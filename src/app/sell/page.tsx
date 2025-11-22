"use client";
import { useEffect, useRef, useState } from "react";
import { glowColors } from "@/constants/glowColors";
import { Info } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";
import api from '../../utils/api';
import Swal from "sweetalert2";
import { ProductCategory, ProductCondition, RAMSize, StorageCapacity, StorageType } from "@/types/product-details.dto";
import { CreateProductDto } from "@/services/listingService";
import { useDropzone } from "react-dropzone";



export default function SellPage() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [hovered, setHovered] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.LAPTOP);

  const [tooltip, setTooltip] = useState<string | null>(null);

  type SelectOption = string | number | { value: string | number; label: string };

  const glow = glowColors[0];


  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },

    onDrop: (acceptedFiles: File[]) => {
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles((prev) => [...prev, ...filesWithPreview]);
    },
  });

  const removeFile = (file: File & { preview: string }) => {
    URL.revokeObjectURL(file.preview);
    setFiles((prev) => prev.filter((f) => f !== file));
  };


  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (Object.values(ProductCategory).includes(value as ProductCategory)) {
      setSelectedCategory(value as ProductCategory);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const imageUrls: string[] = [];
    const formData = new FormData(e.currentTarget);

    try {
      // --- Campos requeridos ---
      const requiredFields = [
        "name",
        "description",
        "category",
        "condition",
        "model",
        "processor",
        "ram",
        "storageType",
        "storageCapacity",
        "operatingSystem",
        "price"
      ];

      for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || (typeof value === "string" && value.trim() === "")) {
          Swal.fire({ icon: "warning", title: "Missing Field", text: `Please fill the ${field} field.` });
          setLoading(false);
          return;
        }
      }

      // --- Validar precio ---
      const priceValue = formData.get("price");
      const priceNumber = Number(priceValue);
      if (isNaN(priceNumber) || priceNumber < 0) {
        Swal.fire({ icon: "warning", title: "Invalid Price", text: "Price must be a positive number." });
        setLoading(false);
        return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(priceValue!.toString())) {
        Swal.fire({ icon: "warning", title: "Invalid Price", text: "Price can have up to 2 decimal places." });
        setLoading(false);
        return;
      }

      // --- Campos numéricos opcionales ---
      const numberFields = ["fans", "stock", "usbPorts", "hdmiPorts", "audioPorts", "weight"];
      for (const field of numberFields) {
        const value = formData.get(field);
        if (value) {
          const num = Number(value);
          if (isNaN(num) || num < 0) {
            Swal.fire({ icon: "warning", title: `Invalid ${field}`, text: `${field} must be a non-negative number.` });
            setLoading(false);
            return;
          }
        }
      }

      // --- Validar dimensiones ---
      const dimensions = formData.get("dimensions") as string;
      if (
        dimensions &&
        !/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?\s?(cm|centimeters|inch|inches)?$/i.test(dimensions.trim())
      ) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Dimensions",
          text: "Dimensions must be in LxWxH format with optional units (e.g., 15x15x15 cm, 15x15x15 inches).",
        });
        setLoading(false);
        return;
      }

      // --- Validar color ---
      const color = formData.get("color") as string;
      if (
        color &&
        !/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color) &&
        !/^[a-zA-Z]+$/.test(color)
      ) {
        Swal.fire({ icon: "warning", title: "Invalid Color", text: "Enter a valid color name or hex code (e.g., 'red' or '#FF0000')." });
        setLoading(false);
        return;
      }

      // --- Validar imágenes ---
      if (files.length === 0) {
        Swal.fire({ icon: "warning", title: "No Images", text: "Please upload at least one image of the product." });
        setLoading(false);
        return;
      }

      // --- Subir imágenes ---
      for (const file of files) {
        const url = await uploadImage(file);
        if (url) imageUrls.push(url);
      }
      if (files.length > 0 && imageUrls.length === 0)
        throw new Error("No se pudieron subir las imágenes.");

      // --- Crear objeto DTO ---
      const data: CreateProductDto = {
        name: formData.get("name") as string,
        brand: formData.get("brand") as string,
        condition: formData.get("condition") as ProductCondition,
        description: formData.get("description") as string,
        category: formData.get("category") as ProductCategory,
        model: formData.get("model") as string,
        processor: formData.get("processor") as string,
        ram: formData.get("ram") as RAMSize,
        storageType: formData.get("storageType") as StorageType,
        storageCapacity: formData.get("storageCapacity") as StorageCapacity,
        stock: Number(formData.get("stock") || 1),
        imageUrls,
        operatingSystem: formData.get("operatingSystem") as string,
        price: priceNumber,
        motherboard: formData.get("motherboard") as string,
        graphicsCard: formData.get("graphicsCard") as string,
        usbPorts: Number(formData.get("usbPorts") || 0),
        hdmiPorts: Number(formData.get("hdmiPorts") || 0),
        audioPorts: Number(formData.get("audioPorts") || 0),
        ethernetPort: !!formData.get("ethernetPort"),
        wifi: !!formData.get("wifi"),
        bluetooth: !!formData.get("bluetooth"),
        color: formData.get("color") as string,
        weight: formData.get("weight") as string,
        dimensions: formData.get("dimensions") as string,
        notes: formData.get("notes") as string,

        laptopSpecs: selectedCategory === ProductCategory.LAPTOP ? {
          batteryHealth: formData.get("batteryHealth") as string,
          screenSize: formData.get("screenSize") as string,
          webcam: !!formData.get("webcam"),
          keyboardType: formData.get("keyboardType") as string,
        } : undefined,

        pcSpecs: selectedCategory === ProductCategory.PC ? {
          caseType: formData.get("caseType") as string,
          powerSupply: formData.get("powerSupply") as string,
          cpuCooler: formData.get("cpuCooler") as string,
          fans: Number(formData.get("fans") || 0),
          monitorIncluded: !!formData.get("monitorIncluded"),
          keyboardIncluded: !!formData.get("keyboardIncluded"),
          mouseIncluded: !!formData.get("mouseIncluded"),
        } : undefined,
      };

      // --- Enviar a API ---
      const response = await api.post("/products/sell", data);
      Swal.fire({
        icon: "success",
        title: "Sale Submitted for Review!",
        text: "Thank you for choosing us!",
      }).then(() => {
        setFiles([]);
        window.location.reload();
      });

    } catch (error: any) {
      console.error("Error creating sale:", error);
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };




  const renderTooltip = (text: string) =>
    tooltip === text && (
      <div className="absolute z-20 mt-1 p-2 text-sm bg-gray-800 text-white rounded-md shadow-md w-56">
        {text}
      </div>
    );

  const renderInput = (
    name: string,
    label: string,
    required = false,
    helpText?: string,
    type: "text" | "textarea" | "checkbox" | "number" = "text", // agregamos "number"
    min?: number,
    max?: number
  ) => (
    <div className="relative mb-4">
      <label className="block mb-1 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        {type === "checkbox" ? (
          <input type="checkbox" name={name} className="w-5 h-5" />
        ) : type === "textarea" ? (
          <textarea
            name={name}
            required={required}
            rows={4}
            className="w-full px-2 py-1 border rounded-md"
          />
        ) : (
          <input
            name={name}
            required={required}
            type={type}   // puede ser "text", "number", etc.
            min={min}     // opcional
            max={max}     // opcional
            className="w-full px-2 py-1 border rounded-md"
          />
        )}
        {helpText && (
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setTooltip(helpText)}
            onMouseLeave={() => setTooltip(null)}
          >
            <Info size={18} className="text-gray-500 dark:text-gray-300" />
            {renderTooltip(helpText)}
          </div>
        )}
      </div>
    </div>
  );

  const renderSelect = (
    name: string,
    label: string,
    options: SelectOption[],
    required = false,
    helpText?: string,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  ) => (
    <div className="relative mb-4">
      <label className="block mb-1 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <select
          name={name}
          required={required}
          onChange={onChange}
          className="w-full px-2 py-1 border rounded-md bg-white text-black dark:bg-black dark:text-white"
        >
          {options.map((opt) =>
            typeof opt === "object" ? (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ) : (
              <option key={opt} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
        {helpText && (
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setTooltip(helpText)}
            onMouseLeave={() => setTooltip(null)}
          >
            <Info size={18} className="text-gray-500 dark:text-gray-300" />
            {renderTooltip(helpText)}
          </div>
        )}
      </div>
    </div>
  );



  return (
    <div
      className="max-w-5xl mx-auto p-8 rounded-lg shadow-md transition-colors duration-300
      bg-background-light dark:bg-background-dark
      border border-black dark:border-white mt-8"
    >
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
        Sell Your Tech
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
          {renderInput("name", "Product Name", true, "", "text")}
        </div>

        {/* Price */}
        <div className="mb-4">
          {renderInput(
            "price",
            "Price",
            true,
            "Enter the price in MXN (e.g., 50000)",
            "number",
            0
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          {renderSelect(
            "category",
            "Category",
            Object.values(ProductCategory),
            true,
            "Select the type of product",
            handleCategoryChange
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          {renderInput(
            "description",
            "Description",
            true,
            "Include brand, model, and condition.",
            "textarea"
          )}
        </div>

        {/* Grid for 2-column fields */}
        <div className="grid grid-cols-2 gap-4">
          {renderSelect(
            "condition",
            "Condition",
            Object.values(ProductCondition),
            true,
            "Select the condition of the product"
          )}
          {renderInput("brand", "Brand", true, "", "text")}

          {renderInput("model", "Model", true, "", "text")}
          {renderInput("processor", "Processor", true, "", "text")}

          {renderSelect("ram", "RAM", Object.values(RAMSize), true, "", undefined)}
          {renderSelect(
            "storageType",
            "Storage Type",
            Object.values(StorageType),
            true
          )}

          {renderSelect(
            "storageCapacity",
            "Storage Capacity",
            Object.values(StorageCapacity),
            true
          )}
          {renderInput("stock", "Stock", true, "", "number", 1)}

          {renderInput("operatingSystem", "Operating System", true, "", "text")}

          {/* Ethernet / WiFi / Bluetooth checkboxes (1 row = 1 column) */}
          <div className="flex flex-row gap-4 items-center">
            {renderInput(
              "ethernetPort",
              "Ethernet Port",
              true,
              "Check if the product has an Ethernet port",
              "checkbox"
            )}
            {renderInput(
              "wifi",
              "WiFi",
              true,
              "Check if the product has WiFi",
              "checkbox"
            )}
            {renderInput(
              "bluetooth",
              "Bluetooth",
              true,
              "Check if the product has Bluetooth",
              "checkbox"
            )}
          </div>

          {renderInput("usbPorts", "USB Ports", true, "", "number", 0)}
          {renderInput("hdmiPorts", "HDMI Ports", true, "", "number", 0)}

          {renderInput("audioPorts", "Audio Ports", true, "", "number", 0)}
          {renderInput("motherboard", "Motherboard", false, "", "text")}
          {renderInput("graphicsCard", "Graphics Card", false, "", "text")}
          {renderInput("color", "Color", false, "", "text")}
          {renderInput("weight", "Weight", false, "", "text")}
          {renderInput("dimensions", "Dimensions", false, "", "text")}
        </div>

        {/* Optional fields */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {renderInput("notes", "Notes", false, "", "textarea")}
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
                true,
                "Check if the laptop includes a webcam",
                "checkbox"
              )}
              {renderInput("screenSize", "Screen Size", false, "", "text")}
              {renderInput("batteryHealth", "Battery Health", false, "", "text")}
              {renderInput("keyboardType", "Keyboard Type", false, "", "text")}
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
                true,
                "Check if the PC includes a monitor",
                "checkbox"
              )}
              {renderInput(
                "keyboardIncluded",
                "Keyboard Included",
                true,
                "Check if the PC includes a keyboard",
                "checkbox"
              )}
              {renderInput(
                "mouseIncluded",
                "Mouse Included",
                true,
                "Check if the PC includes a mouse",
                "checkbox"
              )}
              {renderInput("caseType", "Case Type", false, "", "text")}
              {renderInput("powerSupply", "Power Supply", false, "", "text")}
              {renderInput("cpuCooler", "CPU Cooler", false, "", "text")}
              {renderInput("fans", "Fans", false, "", "number", 0)}
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
                <img
                  src={file.preview}
                  alt={`preview-${index}`}
                  className="w-full h-48 object-cover rounded-md"
                />
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
          <p className="text-xs text-gray-500 mt-1">
            You can upload multiple images (PNG, JPG)
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-center gap-4 mt-6">
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
            {loading ? "Submitting..." : "Submit Sale"}
          </button>
        </div>
      </form>
    </div>
  );

}
