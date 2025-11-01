"use client";
import { useRef, useState } from "react";
import { glowColors } from "@/constants/glowColors";
import { Info } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";
import api from '../../utils/api';
import Swal from "sweetalert2";
import {
  ProductCategory, ProductCondition,
  RAMSize,
  StorageType,
  StorageCapacity,
  CreateProductDto
} from "@/services/listingService";


export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);


  const [hovered, setHovered] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.LAPTOP);

  const [tooltip, setTooltip] = useState<string | null>(null);

  type SelectOption = string | number | { value: string | number; label: string };

  const glow = glowColors[0];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (Object.values(ProductCategory).includes(value as ProductCategory)) {
      setSelectedCategory(value as ProductCategory);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const files = Array.from(formData.getAll("images") as File[]).filter(file => file.size > 0);

    let imageUrls: string[] = [];

    try {
      const requiredFields = [
        "name",
        "description",
        "category",
        "condition",
        "model",
        "processor",
        "ram",
        "storageType",
        "storageCapacity"
      ];

      for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || (typeof value === "string" && value.trim() === "")) {
          Swal.fire({ icon: "warning", title: "Missing Field", text: `Please fill the ${field} field.` });
          setLoading(false);
          return;
        }
      }

      const optionalNumberFields = ["usbPorts", "hdmiPorts", "audioPorts", "fans", "weight", "quantity"];
      for (const field of optionalNumberFields) {
        const value = formData.get(field);
        if (value) {
          const numberValue = Number(value);
          if (isNaN(numberValue) || numberValue < 0) {
            Swal.fire({ icon: "warning", title: "Invalid Value", text: `${field} must be a positive number.` });
            setLoading(false);
            return;
          }
        }
      }

      const dimensions = formData.get("dimensions") as string;
      if (dimensions && !/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/i.test(dimensions)) {
        Swal.fire({ icon: "warning", title: "Invalid Format", text: "Dimensions must be in LxWxH format (e.g., 30x20x5)." });
        setLoading(false);
        return;
      }

      const color = formData.get("color") as string;
      if (color && !/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color) && !/^[a-zA-Z]+$/.test(color)) {
        Swal.fire({ icon: "warning", title: "Invalid Color", text: "Enter a valid color name or hex code (e.g., 'red' or '#FF0000')." });
        setLoading(false);
        return;
      }

      if (files.length === 0) {
        Swal.fire({ icon: "warning", title: "No Images", text: "Please upload at least one image of the product." });
        setLoading(false);
        return;
      }

      for (const file of files) {
        const url = await uploadImage(file);
        if (url) imageUrls.push(url);
      }

      if (files.length > 0 && imageUrls.length === 0) throw new Error("No se pudieron subir las imágenes.");

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
        quantity: Number(formData.get("quantity") || 1),
        imageUrls,

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

      console.log(data);
      const response = await api.post('/products/donate', data);
      console.log(response);
      Swal.fire({
        icon: "success",
        title: "Donation Submitted for Review!",
        text: "Thank you for your generous donation!",
      }).then(() => {
        window.location.reload();
      });

    } catch (error: any) {
      console.error("Error creating donation:", error);
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
    <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-md transition-colors duration-300
    bg-background-light dark:bg-background-dark
    border border-black dark:border-white"
    >
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
        Donate Your Tech
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Fields marked with <span className="text-red-500">*</span> are required.
      </p>

      <form
        ref={formRef}
        className="p-8 rounded-lg shadow-lg transition-colors duration-300
  bg-card-light dark:bg-card-dark
  border border-black dark:border-white"
        onSubmit={handleSubmit}
      >

        {renderInput("name", "Product Name", true)}

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

        <div className="mb-4">
          {renderInput(
            "description",
            "Description",
            true,
            "Include relevant details like brand, model, and condition.",
            "textarea"
          )}
        </div>

        {/* Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            {renderSelect(
              "condition",
              "Condition",
              Object.values(ProductCondition),
              true,
              "Select the condition of the product (New, Used, Refurbished)",
            )}
          </div>



          {/* Brand */}
          <div className="mb-4">
            {renderInput(
              "brand",
              "Brand",
              false,
              "Enter the product brand, e.g., Dell, Apple, Lenovo"
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            {renderInput(
              "quantity",
              "Quantity",
              true,
              "Enter the number of items available (must be 1 or higher)",
              "number",
              1
            )}
          </div>

          {renderInput(
            "model",
            "Model",
            true,
            "Enter the device model (e.g., Inspiron 3520)"
          )}
          {renderInput(
            "processor",
            "Processor",
            true,
            "Enter the CPU model and speed (e.g., Intel i5-1135G7)"
          )}
          <div className="mb-4">
            {renderSelect(
              "ram",
              "RAM",
              Object.values(RAMSize),
              true,
              "Select the memory size (RAM) in GB",
            )}
          </div>


          {renderSelect(
            "storageType",
            "Storage Type",
            Object.values(StorageType),
            true,
            "Select the type of storage (SSD, HDD)",
          )}

          {renderSelect(
            "storageCapacity",
            "Storage Capacity",
            Object.values(StorageCapacity),
            true,
            "Select the storage size (e.g., 256GB, 1TB)"
          )}
          {renderInput("motherboard", "Motherboard", false, "Enter the motherboard model if known")}
          {renderInput("graphicsCard", "Graphics Card", false, "Enter the GPU model if available")}

          {renderInput(
            "usbPorts",
            "USB Ports",
            false,
            "Enter the number of USB ports (positive number)",
            "number",
            0
          )}
          {renderInput(
            "hdmiPorts",
            "HDMI Ports",
            false,
            "Enter the number of HDMI ports (positive number)",
            "number",
            0
          )}
          {renderInput(
            "audioPorts",
            "Audio Ports",
            false,
            "Enter the number of audio ports (positive number)",
            "number",
            0
          )}

          <div className="grid grid-cols-3 gap-4">
            {renderInput("ethernetPort", "Ethernet Port", false, "Check if it has an Ethernet port", "checkbox")}
            {renderInput("wifi", "WiFi", false, "Check if WiFi is available", "checkbox")}
            {renderInput("bluetooth", "Bluetooth", false, "Check if Bluetooth is available", "checkbox")}
          </div>

          {renderInput("color", "Color", false, "Enter a color name or hex code (e.g., red or #FF0000)")}
          {renderInput("weight", "Weight", false, "Enter weight in kilograms (positive number)", "number", 0)}
        </div>

        {renderInput(
          "dimensions",
          "Dimensions",
          false,
          "Enter dimensions in LxWxH format in cm (e.g., 30x20x5)"
        )}

        <div className="mb-16">
          {renderInput(
            "notes",
            "Notes",
            false,
            "Any additional information about the product",
            "textarea"
          )}
        </div>

        {/* Dynamic Specs */}
        <div className="mb-6">
          <h2 className="font-bold mb-2 text-lg text-text-primary-light dark:text-text-primary-dark">
            {selectedCategory} Specifications
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {selectedCategory === "Laptop" && renderInput("screenSize", "Screen Size", false, "Enter screen size in inches (e.g., 15.6)")}
            {selectedCategory === "Laptop" && renderInput("batteryHealth", "Battery Health", false, "Enter battery health percentage (e.g., 90%)")}
            {selectedCategory === "Laptop" && renderInput("operatingSystem", "Operating System", false, "Enter the OS installed (e.g., Windows 11)")}
            {selectedCategory === "Laptop" && renderInput("webcam", "Webcam", false, "Check if webcam is present", "checkbox")}
            {selectedCategory === "Laptop" && renderInput("keyboardType", "Keyboard Type", false, "Enter keyboard type (e.g., QWERTY, Backlit)")}

            {selectedCategory === "PC" && renderInput("caseType", "Case Type", false, "Enter case type (e.g., Mid Tower, Mini Tower)")}
            {selectedCategory === "PC" && renderInput("powerSupply", "Power Supply", false, "Enter PSU wattage and type (e.g., 650W Bronze)")}
            {selectedCategory === "PC" && renderInput("cpuCooler", "CPU Cooler", false, "Enter CPU cooler model")}
            {selectedCategory === "PC" && renderInput("fans", "Fans", false, "Number of cooling fans", "number", 0)}
            {selectedCategory === "PC" && renderInput("monitorIncluded", "Monitor Included", false, "Check if a monitor is included", "checkbox")}
            {selectedCategory === "PC" && renderInput("keyboardIncluded", "Keyboard Included", false, "Check if a keyboard is included", "checkbox")}
            {selectedCategory === "PC" && renderInput("mouseIncluded", "Mouse Included", false, "Check if a mouse is included", "checkbox")}
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-semibold">Upload Images</label>
          <input
            type="file"
            name="images"
            accept=".png, .jpg, .jpeg"
            multiple
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can upload multiple images (PNG, JPG, JPEG)
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-bold
          border border-black dark:border-white
          transition-all duration-300 transform
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
          bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover
          text-black dark:text-white`}
          style={{ boxShadow: hovered ? `0 0 15px ${glow}` : undefined }}
        >
          {loading ? "Submitting..." : "Submit Donation"}
        </button>

      </form>
    </div>
  );

}
