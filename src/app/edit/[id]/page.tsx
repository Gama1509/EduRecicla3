"use client";

import { useEffect, useRef, useState } from "react";
import { glowColors } from "@/constants/glowColors";
import { Info } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";
import api from "@/utils/api";
import Swal from "sweetalert2";
import {
    ProductCategory,
    ProductCondition,
    RAMSize,
    StorageCapacity,
    StorageType,
} from "@/types/product-details.dto";
import { CreateProductDto } from "@/services/listingService";
import { useDropzone } from "react-dropzone";
import { useParams, useSearchParams } from "next/navigation";

export interface EditProductDto extends CreateProductDto {
    id: string;
}

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id;
    const searchParams = useSearchParams();
    const fromRejected = searchParams.get("source") == "rejected";
    const formRef = useRef<HTMLFormElement>(null);

    const [product, setProduct] = useState<EditProductDto | null>(null);
    const [files, setFiles] = useState<(File & { preview: string })[]>([]);
    const [hovered, setHovered] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.LAPTOP);
    const [loading, setLoading] = useState(false);
    const glow = glowColors[0];

    // Tooltip
    const [tooltip, setTooltip] = useState<string | null>(null);
    type SelectOption = string | number | { value: string | number; label: string };

    // --- Cargar datos del producto ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<EditProductDto>(`/products/edit/${productId}`);
                const data = res.data;
                setProduct(data);
                setSelectedCategory(data.category);
                if (data.imageUrls) {
                    const previewFiles = data.imageUrls.map(
                        (url: string) => ({ preview: url } as File & { preview: string })
                    );
                    setFiles(previewFiles);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [productId]);

    // --- Dropzone ---
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/png": [], "image/jpeg": [] },
        onDrop: (acceptedFiles: File[]) => {
            const filesWithPreview = acceptedFiles.map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
            );
            setFiles((prev) => [...prev, ...filesWithPreview]);
        },
    });

    const removeFile = (file: File & { preview: string }) => {
        if (!file.name) URL.revokeObjectURL(file.preview); // evitar borrar URLs existentes
        setFiles((prev) => prev.filter((f) => f !== file));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value as ProductCategory);
    };

    // --- Detectar cambios ---
    const detectChanges = (formData: FormData, fromRejected: boolean) => {
        if (!product) return { onlyStock: false, anyOtherChange: false, changedFields: [] };

        // --- Detectar cambio de cantidad ---
        const stock = Number(formData.get("stock") || 0);
        const stockChanged = stock !== product.stock;

        // --- Detectar cambios en otros campos ---
        const changedFields: string[] = [];

        const otherChanges = Array.from(formData.entries()).some(([key, value]) => {
            if (key === "stock") return false;

            let productValue = product[key as keyof EditProductDto];

            if (key in (product.laptopSpecs || {})) {
                productValue = product.laptopSpecs?.[key as keyof typeof product.laptopSpecs];
            } else if (key in (product.pcSpecs || {})) {
                productValue = product.pcSpecs?.[key as keyof typeof product.pcSpecs];
            }

            let changed = false;

            if (typeof productValue === "boolean") {
                changed = !!value !== productValue;
            } else if (typeof productValue === "number") {
                changed = Number(value) !== productValue;
            } else {
                changed = (value as string).trim() !== (productValue ?? "").toString().trim();
            }

            if (changed) changedFields.push(key);
            return changed;
        });

        // --- Detectar cambios en imágenes ---
        const oldUrls = product.imageUrls || [];
        const currentUrls = files.map(f => f.preview); // incluye nuevas y existentes
        const imagesChanged =
            currentUrls.length !== oldUrls.length ||
            !oldUrls.every(url => currentUrls.includes(url));

        if (imagesChanged) changedFields.push("images");

        // --- Determinar flags ---
        let onlyStock = stockChanged && !otherChanges && !imagesChanged;
        let anyOtherChange = otherChanges || imagesChanged;

        if (fromRejected && onlyStock) {
            onlyStock = false;
            anyOtherChange = false;
            changedFields.push("rejectedRequiresFullEdit");
        }

        return { onlyStock, anyOtherChange, changedFields };
    };




    // --- Tooltip ---
    const renderTooltip = (text: string) =>
        tooltip === text && (
            <div className="absolute z-20 mt-1 p-2 text-sm bg-gray-800 text-white rounded-md shadow-md w-56">
                {text}
            </div>
        );

    // --- Inputs y Selects reutilizables ---
    const renderInput = (name: string, label: string, required = false, helpText?: string, type: "text" | "textarea" | "checkbox" | "number" = "text", min?: number, max?: number, defaultValue?: any) => (
        <div className="relative mb-4">
            <label className="block mb-1 text-sm font-semibold">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-2">
                {type === "checkbox" ? (
                    <input type="checkbox" name={name} className="w-5 h-5" defaultChecked={defaultValue || false} />
                ) : type === "textarea" ? (
                    <textarea name={name} required={required} defaultValue={defaultValue} rows={4} className="w-full px-2 py-1 border rounded-md" />
                ) : (
                    <input name={name} required={required} type={type} defaultValue={defaultValue} min={min} max={max} className="w-full px-2 py-1 border rounded-md" />
                )}
                {helpText && (
                    <div className="relative cursor-pointer" onMouseEnter={() => setTooltip(helpText)} onMouseLeave={() => setTooltip(null)}>
                        <Info size={18} className="text-gray-500 dark:text-gray-300" />
                        {renderTooltip(helpText)}
                    </div>
                )}
            </div>
        </div>
    );

    const renderSelect = (name: string, label: string, options: SelectOption[], required = false, helpText?: string, onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void, defaultValue?: any) => (
        <div className="relative mb-4">
            <label className="block mb-1 text-sm font-semibold">{label} {required && <span className="text-red-500">*</span>}</label>
            <div className="flex items-center gap-2">
                <select name={name} required={required} onChange={onChange} defaultValue={defaultValue} className="w-full px-2 py-1 border rounded-md bg-white text-black dark:bg-black dark:text-white">
                    {options.map((opt) => typeof opt === "object" ? <option key={opt.value} value={opt.value}>{opt.label}</option> : <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {helpText && (
                    <div className="relative cursor-pointer" onMouseEnter={() => setTooltip(helpText)} onMouseLeave={() => setTooltip(null)}>
                        <Info size={18} className="text-gray-500 dark:text-gray-300" />
                        {renderTooltip(helpText)}
                    </div>
                )}
            </div>
        </div>
    );


    const getRequiredFields = () => {
        const baseFields = [
            "name",
            "price",
            "category",
            "description",
            "model",
            "processor",
            "ram",
            "storageType",
            "storageCapacity",
            "stock",
            "operatingSystem",
            "condition",
        ];
        return baseFields;
    };

    const checkRequiredFields = (formData: FormData) => {
        const missingFields = getRequiredFields().filter(
            (field) => !formData.get(field) || formData.get(field) === ""
        );
        return missingFields;
    };

    // --- Submit ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const imageUrls: string[] = [];

        // --- Helpers para opcionales ---
        const getOptionalField = <T = string>(fieldName: string): T | null => {
            const value = formData.get(fieldName);
            if (value === null) return null;
            const str = value.toString().trim();
            return str === "" ? null : (str as unknown as T);
        };

        const getOptionalNumber = (fieldName: string): number | null => {
            const value = formData.get(fieldName);
            if (!value || value.toString().trim() === "") return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        try {
            // --- Validar campos requeridos ---
            const missingFields = checkRequiredFields(formData);
            if (missingFields.length > 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Missing required fields",
                    text: `Please fill the following fields: ${missingFields.join(", ")}`,
                });
                setLoading(false);
                return;
            }

            // --- Validar puertos ---
            const usb = Number(formData.get("usbPorts"));
            if (isNaN(usb) || usb < 0) {
                Swal.fire({ icon: "warning", title: "Invalid USB Ports", text: "Please enter a valid non-negative number for USB Ports." });
                setLoading(false);
                return;
            }

            const hdmi = Number(formData.get("hdmiPorts"));
            if (isNaN(hdmi) || hdmi < 0) {
                Swal.fire({ icon: "warning", title: "Invalid HDMI Ports", text: "Please enter a valid non-negative number for HDMI Ports." });
                setLoading(false);
                return;
            }

            const audio = Number(formData.get("audioPorts"));
            if (isNaN(audio) || audio < 0) {
                Swal.fire({ icon: "warning", title: "Invalid Audio Ports", text: "Please enter a valid non-negative number for Audio Ports." });
                setLoading(false);
                return;
            }

            const { onlyStock, anyOtherChange, changedFields } = detectChanges(formData, fromRejected);

            // --- Caso producto rechazado y solo cambió cantidad ---
            if (fromRejected && changedFields.includes("rejectedRequiresFullEdit")) {
                Swal.fire({
                    icon: "warning",
                    title: "Edición insuficiente",
                    text: "Como este producto fue rechazado, debes modificar algún campo además de la cantidad antes de reenviar.",
                });
                setLoading(false);
                return;
            }

            // --- Solo cambia cantidad ---
            if (onlyStock) {
                const newStock = getOptionalNumber("stock") ?? 1;

                if (newStock === product.stock) {
                    Swal.fire({ icon: "info", title: "No change", text: "Stock is the same." });
                    setLoading(false);
                    return;
                }

                const result = await Swal.fire({
                    icon: "question",
                    title: `Update Stock?`,
                    text: `Do you want to set the stock to ${newStock} units?`,
                    showCancelButton: true,
                    confirmButtonText: `Yes, update`,
                    cancelButtonText: "Cancel",
                });

                if (!result.isConfirmed) return;

                // Enviar directamente el nuevo stock
                await api.patch(`/products/update-stock/${productId}`, { stock: newStock });
                Swal.fire({ icon: "success", title: `Stock updated to ${newStock}!` });
                window.location.href = "/";
            }
            // --- Cambios en otros campos ---
            else if (anyOtherChange) {
                const result = await Swal.fire({
                    icon: "warning",
                    title: "Send for Review?",
                    text: "Editing these fields will send the product for review again. All active transactions will be cancelled. Continue?",
                    showCancelButton: true,
                    confirmButtonText: "Yes, send for review",
                    cancelButtonText: "Cancel",
                });
                if (!result.isConfirmed) return;

                // --- Manejo de imágenes ---
                const existingUrls = files.filter((f) => !f.name).map((f) => f.preview);
                const newUrls: string[] = [];
                for (const file of files) {
                    if (file.name) {
                        const url = await uploadImage(file);
                        if (url) newUrls.push(url);
                    }
                }

                // --- Preparar datos para actualizar ---
                const updateData: EditProductDto = {
                    ...product,
                    name: getOptionalField("name") ?? "",
                    price: getOptionalNumber("price") ?? 0,
                    description: getOptionalField("description") ?? "",
                    category: getOptionalField("category") as ProductCategory,
                    condition: getOptionalField("condition") as ProductCondition,
                    model: getOptionalField("model") ?? "",
                    processor: getOptionalField("processor") ?? "",
                    ram: getOptionalField("ram") as RAMSize,
                    storageType: getOptionalField("storageType") as StorageType,
                    storageCapacity: getOptionalField("storageCapacity") as StorageCapacity,
                    stock: getOptionalNumber("stock") ?? 1,
                    brand: getOptionalField("brand") ?? "",
                    operatingSystem: getOptionalField("operatingSystem") ?? "",
                    motherboard: getOptionalField("motherboard"),
                    graphicsCard: getOptionalField("graphicsCard"),
                    usbPorts: Number(formData.get("usbPorts")),
                    hdmiPorts: Number(formData.get("hdmiPorts")),
                    audioPorts: Number(formData.get("audioPorts")),
                    ethernetPort: !!formData.get("ethernetPort"),
                    wifi: !!formData.get("wifi"),
                    bluetooth: !!formData.get("bluetooth"),
                    color: getOptionalField("color"),
                    weight: getOptionalField("weight"),
                    dimensions: getOptionalField("dimensions"),
                    notes: getOptionalField("notes"),
                    imageUrls: [...existingUrls, ...newUrls],
                };

                // --- Specs dinámicas según categoría ---
                if (selectedCategory === ProductCategory.LAPTOP) {
                    updateData.laptopSpecs = {
                        batteryHealth: getOptionalField("batteryHealth") ?? "",
                        screenSize: getOptionalField("screenSize") ?? "",
                        webcam: !!formData.get("webcam"),
                        keyboardType: getOptionalField("keyboardType") ?? "",
                    };
                }

                if (selectedCategory === ProductCategory.PC) {
                    updateData.pcSpecs = {
                        caseType: getOptionalField("caseType") ?? "",
                        powerSupply: getOptionalField("powerSupply") ?? "",
                        cpuCooler: getOptionalField("cpuCooler") ?? "",
                        fans: getOptionalNumber("fans") ?? 0,
                        monitorIncluded: !!formData.get("monitorIncluded"),
                        keyboardIncluded: !!formData.get("keyboardIncluded"),
                        mouseIncluded: !!formData.get("mouseIncluded"),
                    };
                }

                await api.put(`/products/edit/data`, updateData);
                Swal.fire({ icon: "success", title: "Product updated! Sent for review." });
                window.location.href = "/";
            }
            // --- No hay cambios ---
            else {
                Swal.fire({ icon: "info", title: "No changes detected" });
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Something went wrong.";
            Swal.fire({ icon: "error", title: "Error", text: msg });
        }
        finally {
            setLoading(false);
        }
    };




    if (!product) return <p>Loading...</p>;
    return (
        <div className="max-w-5xl mx-auto p-8 rounded-lg shadow-md transition-colors duration-300
      bg-background-light dark:bg-background-dark
      border border-black dark:border-white"
        >
            <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                Edit Product
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Fields marked with <span className="text-red-500">*</span> are required.
            </p>

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-8 rounded-lg shadow-lg transition-colors duration-300
        bg-card-light dark:bg-card-dark border border-black dark:border-white"
            >
                {/* Product Name */}
                <div className="mb-4">
                    {renderInput("name", "Product Name", true, "", "text", undefined, undefined, product.name)}
                </div>

                {/* Price */}
                {product.price != null && product.price !== 0 && (
                    <div className="mb-4">
                        {renderInput(
                            "price",
                            "Price",
                            true,
                            "Enter the price in MXN",
                            "number",
                            0,
                            undefined,
                            product.price
                        )}
                    </div>
                )}


                {/* Category */}
                <div className="mb-4">
                    {renderSelect("category", "Category", Object.values(ProductCategory), true, "Select the type of product", handleCategoryChange, product.category)}
                </div>

                {/* Description */}
                <div className="mb-4">
                    {renderInput("description", "Description", true, "Include brand, model, condition", "textarea", undefined, undefined, product.description)}
                </div>

                {/* Grid for 2-column fields */}
                <div className="grid grid-cols-2 gap-4">
                    {renderSelect("condition", "Condition", Object.values(ProductCondition), true, "Select the condition of the product", undefined, product.condition)}
                    {renderInput("brand", "Brand", true, "", "text", undefined, undefined, product.brand)}

                    {renderInput("model", "Model", true, "", "text", undefined, undefined, product.model)}
                    {renderInput("processor", "Processor", true, "", "text", undefined, undefined, product.processor)}

                    {renderSelect("ram", "RAM", Object.values(RAMSize), true, "", undefined, product.ram)}
                    {renderSelect("storageType", "Storage Type", Object.values(StorageType), true, "", undefined, product.storageType)}

                    {renderSelect("storageCapacity", "Storage Capacity", Object.values(StorageCapacity), true, "", undefined, product.storageCapacity)}
                    {renderInput("stock", "Stock", true, "", "number", 0, undefined, product.stock)}

                    {renderInput("operatingSystem", "Operating System", true, "", undefined, undefined, undefined, product.operatingSystem)}
                    {/* Los 3 checkboxes en horizontal como una sola columna */}
                    <div className="flex flex-row gap-4 items-center">
                        {renderInput(
                            "ethernetPort",
                            "Ethernet",
                            true,
                            "Check if the product has an Ethernet port",
                            "checkbox",
                            undefined,
                            undefined,
                            product.ethernetPort
                        )}
                        {renderInput(
                            "wifi",
                            "WiFi",
                            true,
                            "Check if the product has WiFi",
                            "checkbox",
                            undefined,
                            undefined,
                            product.wifi
                        )}
                        {renderInput(
                            "bluetooth",
                            "Bluetooth",
                            true,
                            "Check if the product has Bluetooth",
                            "checkbox",
                            undefined,
                            undefined,
                            product.bluetooth
                        )}
                    </div>

                    {renderInput("usbPorts", "USB Ports", true, "Enter number of USB ports", "number", 0, undefined, product.usbPorts)}
                    {renderInput("hdmiPorts", "HDMI Ports", true, "Enter number of HDMI ports", "number", 0, undefined, product.hdmiPorts)}

                    {renderInput("audioPorts", "Audio Ports", true, "Enter number of audio ports", "number", 0, undefined, product.audioPorts)}
                    {renderInput("motherboard", "Motherboard", false, "", "text", undefined, undefined, product.motherboard)}
                    {renderInput("graphicsCard", "Graphics Card", false, "", "text", undefined, undefined, product.graphicsCard)}
                    {renderInput("color", "Color", false, "", "text", undefined, undefined, product.color)}
                    {renderInput("weight", "Weight", false, "", "text", 0, undefined, product.weight)}
                    {renderInput("dimensions", "Dimensions", false, "", "text", undefined, undefined, product.dimensions)}
                </div>




                {/* Optional fields */}
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {renderInput("notes", "Notes", false, "", "textarea", undefined, undefined, product.notes)}
                </div>

                {/* Dynamic Specs */}
                {selectedCategory === "Laptop" && (
                    <div className="mt-6">
                        <h2 className="font-bold mb-2 text-lg text-text-primary-light dark:text-text-primary-dark">
                            Laptop Specifications
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput(
                                "webcam",
                                "Webcam Included",
                                true, // obligatorio
                                "Check if the laptop includes a webcam. If unchecked, it means the laptop does not have a webcam.",
                                "checkbox",
                                undefined,
                                undefined,
                                product.laptopSpecs?.webcam
                            )}
                            {renderInput("screenSize", "Screen Size", false, "", "text", undefined, undefined, product.laptopSpecs?.screenSize)}
                            {renderInput("batteryHealth", "Battery Health", false, "", "text", undefined, undefined, product.laptopSpecs?.batteryHealth)}
                            {renderInput("keyboardType", "Keyboard Type", false, "", "text", undefined, undefined, product.laptopSpecs?.keyboardType)}
                        </div>
                    </div>
                )}

                {selectedCategory === "PC" && (
                    <div className="mt-6">
                        <h2 className="font-bold mb-2 text-lg text-text-primary-light dark:text-text-primary-dark">
                            PC Specifications
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput(
                                "monitorIncluded",
                                "Monitor Included",
                                true, // obligatorio
                                "Check if the PC includes a monitor. If unchecked, it means the PC does not include a monitor.",
                                "checkbox",
                                undefined,
                                undefined,
                                product.pcSpecs?.monitorIncluded
                            )}

                            {renderInput(
                                "keyboardIncluded",
                                "Keyboard Included",
                                true, // obligatorio
                                "Check if the PC includes a keyboard. If unchecked, it means the PC does not include a keyboard.",
                                "checkbox",
                                undefined,
                                undefined,
                                product.pcSpecs?.keyboardIncluded
                            )}

                            {renderInput(
                                "mouseIncluded",
                                "Mouse Included",
                                true, // obligatorio
                                "Check if the PC includes a mouse. If unchecked, it means the PC does not include a mouse.",
                                "checkbox",
                                undefined,
                                undefined,
                                product.pcSpecs?.mouseIncluded
                            )}
                            {renderInput("caseType", "Case Type", false, "", "text", undefined, undefined, product.pcSpecs?.caseType)}
                            {renderInput("powerSupply", "Power Supply", false, "", "text", undefined, undefined, product.pcSpecs?.powerSupply)}
                            {renderInput("cpuCooler", "CPU Cooler", false, "", "text", undefined, undefined, product.pcSpecs?.cpuCooler)}
                            {renderInput("fans", "Fans", false, "", "number", 0, undefined, product.pcSpecs?.fans)}
                        </div>
                    </div>
                )}

                {/* Image Upload */}
                <div className="mb-6 mt-6">
                    <label className="block mb-1 text-sm font-semibold">
                        Upload Images <span className="text-red-500">*</span>
                    </label>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-400 p-4 rounded-md text-center cursor-pointer hover:border-primary transition-colors h-48 flex items-center justify-center"
                    >
                        <input {...getInputProps()} />
                        <p>Drag & drop images here, or click to select files</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {files.map((file, index) => (
                            <div key={index} className="relative">
                                <img src={file.preview} alt={`preview-${index}`} className="w-full h-48 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(file)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    You can upload multiple images (PNG, JPG)
                </p>
                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="py-3 px-6 rounded-lg font-bold border border-gray-500
            transition-all duration-300 transform hover:scale-105
            bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className={`py-3 px-6 rounded-lg font-bold border border-black dark:border-white
            transition-all duration-300 transform
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover
            text-black dark:text-white`}
                        style={{ boxShadow: hovered ? `0 0 15px ${glow}` : undefined }}
                    >
                        {loading ? "Submitting..." : "Update Product"}
                    </button>
                </div>
            </form>
        </div>
    );



}
