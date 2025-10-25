'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { fetchWithAuth } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface ProductFormProps {
  product?: Product;
}

const categories = ['Laptop', 'PC'];
const conditions = ['New', 'Used', 'Refurbished'];
const storageTypes = ['SSD', 'HDD', 'Hybrid'];

const ProductForm = ({ product }: ProductFormProps) => {
  const router = useRouter();
  const user = useAuth();
  const isEditMode = !!product;
  const [category, setCategory] = useState(product?.category || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      name: data.name,
      type: data.type,
      condition: data.condition,
      price: Number(data.price),
      description: data.description,
      imageUrl: data.imageUrl,
      ownerId: user?.id,
      specs: {
        processor: data.processor,
        ram: data.ram,
        storageType: data.storageType,
        storageCapacity: data.storageCapacity,
        motherboard: data.motherboard,
        // Laptop specific
        ...(category === 'Laptop' && {
          screenSize: data.screenSize,
          batteryHealth: data.batteryHealth,
          graphicsCard: data.graphicsCard_laptop,
          operatingSystem: data.operatingSystem,
          usbPorts: Number(data.usbPorts_laptop),
          hdmiPorts: Number(data.hdmiPorts_laptop),
          audioPorts: Number(data.audioPorts_laptop),
          ethernetPort: data.ethernetPort_laptop === 'on',
          wifi: data.wifi_laptop === 'on',
          bluetooth: data.bluetooth_laptop === 'on',
          webcam: data.webcam === 'on',
          keyboardType: data.keyboardType,
          color: data.color_laptop,
          weight: data.weight_laptop,
          dimensions: data.dimensions_laptop,
          notes: data.notes_laptop,
        }),
        // PC specific
        ...(category === 'PC' && {
          graphicsCard: data.graphicsCard_pc,
          caseType: data.caseType,
          powerSupply: data.powerSupply,
          cpuCooler: data.cpuCooler,
          fans: Number(data.fans),
          usbPorts: Number(data.usbPorts_pc),
          hdmiPorts: Number(data.hdmiPorts_pc),
          audioPorts: Number(data.audioPorts_pc),
          ethernetPort: data.ethernetPort_pc === 'on',
          wifi: data.wifi_pc === 'on',
          bluetooth: data.bluetooth_pc === 'on',
          monitorIncluded: data.monitorIncluded === 'on',
          keyboardIncluded: data.keyboardIncluded === 'on',
          mouseIncluded: data.mouseIncluded === 'on',
          color: data.color_pc,
          weight: data.weight_pc,
          dimensions: data.dimensions_pc,
          notes: data.notes_pc,
        }),
      },
    };

    const url = isEditMode
      ? `/${category.toLowerCase()}s/${product.id}`
      : `/${category.toLowerCase()}s`;
    const method = isEditMode ? 'PATCH' : 'POST';

    await fetchWithAuth(url, {
      method,
      body: JSON.stringify(payload),
    });

    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={product?.name}
              placeholder="Enter product name"
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Condition
            </label>
            <select
              name="condition"
              defaultValue={product?.condition}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            >
              <option value="" disabled>
                Select condition
              </option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Type
            </label>
            <select
              name="type"
              defaultValue={product?.type}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            >
              <option value="Sale">Sale</option>
              <option value="Donation">Donation</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              defaultValue={product?.price}
              placeholder="Enter price"
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              defaultValue={product?.description}
              placeholder="Enter product description"
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              defaultValue={product?.imageUrl}
              placeholder="Enter image URL"
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>
        </div>
      </div>

      {category === 'Laptop' && (
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300 space-y-4">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Laptop Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Processor */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Processor
              </label>
              <input type="text" name="processor" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* RAM */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                RAM
              </label>
              <input type="text" name="ram" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Storage Type */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Storage Type
              </label>
              <select name="storageType" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark">
                {storageTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            {/* Storage Capacity */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Storage Capacity
              </label>
              <input type="text" name="storageCapacity" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Motherboard */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Motherboard
              </label>
              <input type="text" name="motherboard" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Screen Size */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Screen Size
              </label>
              <input type="text" name="screenSize" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Battery Health */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Battery Health
              </label>
              <input type="text" name="batteryHealth" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Graphics Card */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Graphics Card
              </label>
              <input type="text" name="graphicsCard_laptop" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Operating System */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Operating System
              </label>
              <input type="text" name="operatingSystem" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* USB Ports */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                USB Ports
              </label>
              <input type="number" name="usbPorts_laptop" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* HDMI Ports */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                HDMI Ports
              </label>
              <input type="number" name="hdmiPorts_laptop" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Audio Ports */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Audio Ports
              </label>
              <input type="number" name="audioPorts_laptop" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Ethernet Port */}
            <div className="flex items-center">
              <input type="checkbox" name="ethernetPort_laptop" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Ethernet Port
              </label>
            </div>
            {/* Wifi */}
            <div className="flex items-center">
              <input type="checkbox" name="wifi_laptop" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Wifi
              </label>
            </div>
            {/* Bluetooth */}
            <div className="flex items-center">
              <input type="checkbox" name="bluetooth_laptop" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Bluetooth
              </label>
            </div>
            {/* Webcam */}
            <div className="flex items-center">
              <input type="checkbox" name="webcam" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Webcam
              </label>
            </div>
          </div>
        </div>
      )}

      {category === 'PC' && (
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300 space-y-4">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">PC Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Processor */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Processor
              </label>
              <input type="text" name="processor" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* RAM */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                RAM
              </label>
              <input type="text" name="ram" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Storage Type */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Storage Type
              </label>
              <select name="storageType" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark">
                {storageTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            {/* Storage Capacity */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Storage Capacity
              </label>
              <input type="text" name="storageCapacity" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Motherboard */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Motherboard
              </label>
              <input type="text" name="motherboard" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" required />
            </div>
            {/* Graphics Card */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Graphics Card
              </label>
              <input type="text" name="graphicsCard_pc" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Case Type */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Case Type
              </label>
              <input type="text" name="caseType" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Power Supply */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Power Supply
              </label>
              <input type="text" name="powerSupply" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* CPU Cooler */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                CPU Cooler
              </label>
              <input type="text" name="cpuCooler" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Fans */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Fans
              </label>
              <input type="number" name="fans" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* USB Ports */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                USB Ports
              </label>
              <input type="number" name="usbPorts_pc" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* HDMI Ports */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                HDMI Ports
              </label>
              <input type="number" name="hdmiPorts_pc" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Audio Ports */}
            <div>
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
                Audio Ports
              </label>
              <input type="number" name="audioPorts_pc" className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark" />
            </div>
            {/* Ethernet Port */}
            <div className="flex items-center">
              <input type="checkbox" name="ethernetPort_pc" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Ethernet Port
              </label>
            </div>
            {/* Wifi */}
            <div className="flex items-center">
              <input type="checkbox" name="wifi_pc" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Wifi
              </label>
            </div>
            {/* Bluetooth */}
            <div className="flex items-center">
              <input type="checkbox" name="bluetooth_pc" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Bluetooth
              </label>
            </div>
            {/* Monitor Included */}
            <div className="flex items-center">
              <input type="checkbox" name="monitorIncluded" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Monitor Included
              </label>
            </div>
            {/* Keyboard Included */}
            <div className="flex items-center">
              <input type="checkbox" name="keyboardIncluded" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Keyboard Included
              </label>
            </div>
            {/* Mouse Included */}
            <div className="flex items-center">
              <input type="checkbox" name="mouseIncluded" className="mr-2" />
              <label className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                Mouse Included
              </label>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full bg-secondary text-black dark:text-white font-bold py-3 px-6 rounded-lg border border-black dark:border-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_var(--glow-color)] cursor-pointer"
          style={{ '--glow-color': '#22c55e' } as any} // glow verde fijo
        >
          {isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
