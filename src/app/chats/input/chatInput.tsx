import classNames from "classnames";
import { useEffect, useState } from "react";
import { uploadImage } from "@/utils/uploadImage";
import { getSocket } from "@/utils/sockets";
import { FaSpinner } from "react-icons/fa"
import { useRef } from "react";

interface ChatInputProps {
  chatId: string;
}

function ChatInput({ chatId }: ChatInputProps) {
  const socket = getSocket();
  const [text, setText] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);


  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_HEIGHT = 150; // límite máximo de altura en px

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // resetear altura
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, MAX_HEIGHT) + "px";
    }
  };
  // --- Emit typing event cada medio segundo mientras el usuario escribe ---
  useEffect(() => {
    if (!text || !socket) return; // ⬅️ Aseguramos que socket exista

    const timeout = setTimeout(() => {
      socket.emit("typing", { chatId });
    }, 500);

    return () => clearTimeout(timeout);
  }, [text, chatId, socket]);

  // --- Liberar previews al desmontar ---
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // --- Enviar mensaje ---
  const handleSend = async () => {
    if (!text.trim() && imageFiles.length === 0) return;

    let uploadedUrls: string[] = [];
    if (imageFiles.length > 0) {
      setUploading(true);
      try {
        uploadedUrls = (
          await Promise.all(imageFiles.map(file => uploadImage(file)))
        ).filter((url): url is string => url !== null);
      } catch (err) {
        console.error("Error al subir imágenes", err);
      } finally {
        setUploading(false);
      }
    }

    if (!socket) return;

    socket.emit("sendMessage", {
      chatId,
      text: text || undefined,
      images: uploadedUrls.length ? uploadedUrls : undefined,
    });


    // limpiar estado
    setText("");
    setImageFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  // --- Selección de archivos ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = files.filter(
      f => f.type === "image/png" || f.type === "image/jpeg"
    );

    setImageFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [
      ...prev,
      ...validFiles.map(f => URL.createObjectURL(f)),
    ]);
  };

  // --- Eliminar imagen del preview ---
  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2 p-2 border-t border-gray-300">
      {/* Previews horizontales de imágenes */}
      {previewUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-2">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs rounded">
                  Subiendo...
                </div>
              )}
              <button
                onClick={() => handleRemoveImage(i)}
                aria-label="Eliminar imagen"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-center">
        {/* Selector de archivos */}
        <label
          className="cursor-pointer px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          aria-label="Adjuntar imágenes"
        >
          📎
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* Input de texto */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          disabled={uploading}
          className="flex-1 p-2 rounded-lg border border-gray-400 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-gray-100 disabled:text-gray-400 resize-none overflow-y-auto"
          placeholder="Escribe un mensaje..."
          rows={1}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ maxHeight: MAX_HEIGHT }}
        />



        {/* Botón enviar con spinner */}
        <button
          onClick={handleSend}
          disabled={uploading}
          className={classNames(
            "px-4 py-2 rounded-lg transition flex items-center justify-center gap-2",
            uploading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              Subiendo...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;

