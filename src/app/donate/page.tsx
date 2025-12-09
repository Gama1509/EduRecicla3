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
import { productConditionLabels } from "@/constants/productLabels";

export default function DonatePage() {
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

    const formData = new FormData(e.currentTarget);
    const imageUrls: string[] = [];

    try {
      // --- Campos requeridos ---
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
      ] as const;

      // --- Mapeo de campos a nombres en español ---
      const fieldNames = {
        name: "Nombre",
        description: "Descripción",
        category: "Categoría",
        condition: "Condición",
        model: "Modelo",
        processor: "Procesador",
        ram: "RAM",
        storageType: "Tipo de almacenamiento",
        storageCapacity: "Capacidad de almacenamiento",
        operatingSystem: "Sistema operativo",
      };

      for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || (typeof value === "string" && value.trim() === "")) {
          Swal.fire({
            icon: "warning",
            title: "Campo faltante",
            text: `Por favor, completa el campo ${fieldNames[field]}.`
          });
          setLoading(false);
          return;
        }
      }


      // --- Campos numéricos opcionales ---
      const optionalNumberFields = ["fans", "weight", "stock", "usbPorts", "hdmiPorts", "audioPorts"] as const;

      // Mapeo de nombres de campos a español
      const optionalFieldNames = {
        fans: "Ventiladores",
        weight: "Peso",
        stock: "Stock",
        usbPorts: "Puertos USB",
        hdmiPorts: "Puertos HDMI",
        audioPorts: "Puertos de audio",
      } as const;

      for (const field of optionalNumberFields) {
        const value = formData.get(field);
        if (value) {
          const numberValue = Number(value);
          if (isNaN(numberValue) || numberValue < 0) {
            Swal.fire({
              icon: "warning",
              title: "Valor inválido",
              text: `${optionalFieldNames[field as keyof typeof optionalFieldNames]} debe ser un número positivo.`,
            });
            setLoading(false);
            return;
          }
        }
      }

      const dimensions = formData.get("dimensions") as string;
      if (
        dimensions &&
        !/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?\s?(cm|centimeters|inch|inches)?$/i.test(dimensions.trim())
      ) {
        Swal.fire({
          icon: "warning",
          title: "Formato inválido",
          text: "Las dimensiones deben estar en formato LxAxH con unidades opcionales (por ejemplo: 15x15x15 cm, 15x15x15 inches).",
        });
        setLoading(false);
        return;
      }


      // --- Validar color ---
      // --- Validar color ---
      const color = formData.get("color") as string;
      if (
        color &&
        !/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color) &&
        !/^[a-zA-Z]+$/.test(color)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Color inválido",
          text: "Ingresa un nombre de color válido o un código hexadecimal (por ejemplo: 'rojo' o '#FF0000').",
        });
        setLoading(false);
        return;
      }

      if (files.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin imágenes",
          text: "Por favor, sube al menos una imagen del producto.",
        });
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

      // --- Construir DTO ---
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
      const response = await api.post('/products/donate', data);
      Swal.fire({
        icon: "success",
        title: "¡Donación enviada para revisión!",
        text: "¡Gracias por tu generosa donación!",
      }).then(() => {
        setFiles([]);
        window.location.reload();
      });


    } catch (error: any) {
      console.error("Error creating donation:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Algo salió mal. Por favor, intenta de nuevo.",
      });
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
      className="max-w-3xl mx-auto p-4 sm:p-8 rounded-lg shadow-md transition-colors duration-300
  bg-background-light dark:bg-background-dark
  border border-black dark:border-white mt-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 text-center">
        Dona Tu Tecnología
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
        Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-4 sm:p-8 rounded-lg shadow-lg transition-colors duration-300
      bg-card-light dark:bg-card-dark
      border border-black dark:border-white"
      >
        {/* Nombre del producto */}
        <div className="mb-4">
          {renderInput("name", "Nombre del producto", true)}
        </div>

        {/* Categoría */}
        <div className="mb-4">
          {renderSelect(
            "category",
            "Categoría",
            Object.values(ProductCategory),
            true,
            "Selecciona el tipo de producto",
            handleCategoryChange
          )}
        </div>

        {/* Descripción */}
        <div className="mb-4">
          {renderInput(
            "description",
            "Descripción",
            true,
            "Incluye detalles relevantes como marca, modelo y condición.",
            "textarea"
          )}
        </div>

        {/* Grid principal - 1 o 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderSelect(
            "condition",
            "Condición",
            Object.values(ProductCondition).map((val) => ({
              value: val,
              label: productConditionLabels[val],
            })),
            true,
            "Selecciona la condición del producto"
          )}

          {renderInput(
            "brand",
            "Marca",
            true,
            "Ingresa la marca del producto, por ejemplo: Dell, Apple, Lenovo"
          )}

          {renderInput(
            "model",
            "Modelo",
            true,
            "Ingresa el modelo del dispositivo (p. ej., Inspiron 3520)"
          )}
          {renderInput(
            "processor",
            "Procesador",
            true,
            "Ingresa el modelo y velocidad del CPU (p. ej., Intel i5-1135G7)"
          )}

          {renderSelect(
            "ram",
            "RAM",
            Object.values(RAMSize),
            true,
            "Selecciona la memoria RAM en GB"
          )}
          {renderSelect(
            "storageType",
            "Tipo de almacenamiento",
            Object.values(StorageType),
            true,
            "Selecciona el tipo de almacenamiento (SSD, HDD)"
          )}

          {renderSelect(
            "storageCapacity",
            "Capacidad de almacenamiento",
            Object.values(StorageCapacity),
            true,
            "Selecciona el tamaño de almacenamiento (p. ej., 256GB, 1TB)"
          )}
          {renderInput(
            "stock",
            "Cantidad disponible",
            true,
            "Ingresa la cantidad de unidades disponibles (mínimo 1)",
            "number",
            1
          )}

          {renderInput(
            "operatingSystem",
            "Sistema Operativo",
            true,
            "Ingresa el SO instalado (p. ej., Windows 11), o 'Sin' si no tiene"
          )}

          {/* Ethernet / WiFi / Bluetooth en una fila */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {renderInput(
              "ethernetPort",
              "Puerto Ethernet",
              true,
              "Marca si tiene puerto Ethernet",
              "checkbox"
            )}
            {renderInput(
              "wifi",
              "WiFi",
              true,
              "Marca si tiene WiFi disponible",
              "checkbox"
            )}
            {renderInput(
              "bluetooth",
              "Bluetooth",
              true,
              "Marca si tiene Bluetooth disponible",
              "checkbox"
            )}
          </div>

          {renderInput(
            "motherboard",
            "Placa madre",
            false,
            "Ingresa el modelo de la placa madre si lo conoces"
          )}
          {renderInput(
            "graphicsCard",
            "Tarjeta gráfica",
            false,
            "Ingresa el modelo de la GPU si está disponible"
          )}

          {renderInput(
            "usbPorts",
            "Puertos USB",
            true,
            "Ingresa la cantidad de puertos USB",
            "number",
            0
          )}
          {renderInput(
            "hdmiPorts",
            "Puertos HDMI",
            true,
            "Ingresa la cantidad de puertos HDMI",
            "number",
            0
          )}
          {renderInput(
            "audioPorts",
            "Puertos de audio",
            true,
            "Ingresa la cantidad de puertos de audio",
            "number",
            0
          )}

          {renderInput(
            "color",
            "Color",
            false,
            "Ingresa un color o código hexadecimal (p. ej., rojo o #FF0000)"
          )}
          {renderInput(
            "weight",
            "Peso",
            false,
            "Ingresa el peso en kilogramos (número positivo)",
            "number",
            0
          )}
          {renderInput(
            "dimensions",
            "Dimensiones",
            false,
            "Ingresa las dimensiones (p. ej., 15x15x15 cm o 15x15x15 pulgadas)"
          )}
        </div>

        {renderInput(
          "notes",
          "Notas",
          false,
          "Cualquier información adicional sobre el producto",
          "textarea"
        )}

        {/* Especificaciones dinámicas */}
        {selectedCategory && (
          <div className="mt-6">
            <h2 className="font-bold mb-2 text-lg text-text-primary-light dark:text-text-primary-dark">
              Especificaciones de {selectedCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCategory === "Laptop" && (
                <>
                  {renderInput(
                    "webcam",
                    "Incluye webcam",
                    true,
                    "Marca si la laptop incluye webcam",
                    "checkbox"
                  )}
                  {renderInput(
                    "screenSize",
                    "Tamaño de pantalla",
                    false,
                    "Ingresa el tamaño de pantalla con unidades (p. ej., 15.6 pulgadas o 39.6 cm)"
                  )}
                  {renderInput(
                    "batteryHealth",
                    "Salud de la batería",
                    false,
                    "Ingresa el porcentaje de salud de la batería (p. ej., 90%)"
                  )}
                  {renderInput(
                    "keyboardType",
                    "Tipo de teclado",
                    false,
                    "Ingresa el tipo de teclado (p. ej., QWERTY, retroiluminado)"
                  )}
                </>
              )}

              {selectedCategory === "PC" && (
                <>
                  {renderInput(
                    "monitorIncluded",
                    "Incluye monitor",
                    true,
                    "Marca si la PC incluye monitor",
                    "checkbox"
                  )}
                  {renderInput(
                    "keyboardIncluded",
                    "Incluye teclado",
                    true,
                    "Marca si la PC incluye teclado",
                    "checkbox"
                  )}
                  {renderInput(
                    "mouseIncluded",
                    "Incluye mouse",
                    true,
                    "Marca si la PC incluye mouse",
                    "checkbox"
                  )}
                  {renderInput(
                    "caseType",
                    "Tipo de torre",
                    false,
                    "Ingresa el tipo de torre (p. ej., Mid Tower, Mini Tower)"
                  )}
                  {renderInput(
                    "powerSupply",
                    "Fuente de poder",
                    false,
                    "Ingresa el wattaje y tipo de PSU (p. ej., 650W Bronze)"
                  )}
                  {renderInput(
                    "cpuCooler",
                    "Disipador CPU",
                    false,
                    "Ingresa el modelo del disipador de CPU"
                  )}
                  {renderInput(
                    "fans",
                    "Ventiladores",
                    false,
                    "Cantidad de ventiladores de enfriamiento",
                    "number",
                    0
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Subir imágenes */}
        <div className="mb-6 mt-6">
          <label className="block mb-1 text-sm font-semibold">
            Subir imágenes <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 p-4 rounded-md text-center cursor-pointer hover:border-primary transition-colors h-48 flex items-center justify-center"
          >
            <input {...getInputProps()} />
            <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar archivos</p>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            Puedes subir múltiples imágenes (PNG, JPG)
          </p>
        </div>

        {/* Botón enviar */}
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
            {loading ? "Enviando..." : "Enviar Donación"}
          </button>
        </div>
      </form>
    </div>
  );



}
