"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import classNames from "classnames";
import Swal from "sweetalert2";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import api from "@/utils/api";
import ChatInput from "../input/chatInput";
import { ChatDto } from "@/types/chat/chat.dto";
import { ChatWithMessagesDto } from "@/types/chat/chat-with-messages.dto";
import { ChatMessageDto } from "@/types/chat/chat-message.dto";
import { getSocket } from "@/utils/sockets";
import { UserSummary } from "@/types/users/user-summary.dto";
import { useAuth } from "@/contexts/AuthContext";
import withAuth from "@/components/auth/withAuth";
import { handleApiError } from "@/utils/handleApiError";


function ChatsPage() {
  // --- Estados principales ---
  const params = useParams();
  const chatIdFromUrl = params?.chatId as string | undefined;
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatWithMessagesDto | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [joiningChatId, setJoiningChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // --- Refs ---
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const readMessages = useRef<Set<string>>(new Set());
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentUserRef = useRef<UserSummary | null>(null);
  const router = useRouter();
  // --- Socket ---
  const socket = getSocket();
  const { user, logout } = useAuth();



  // --- Seleccionar chat automáticamente desde la URL ---
  // --- Seleccionar chat automáticamente desde la URL ---
  useEffect(() => {
    if (!chats.length || !user) return;

    const chatIdFromUrl = Array.isArray(params?.chatId)
      ? params.chatId[0]
      : params?.chatId;

    if (!chatIdFromUrl) return;

    // Evitar re-seleccionar el mismo chat
    if (selectedChat?.id === chatIdFromUrl) return;

    // 👮‍♂️ Filtrar valores null o corruptos
    const validChats = chats.filter(c => c && c.id);

    // 🔍 Buscar el chat en la lista
    const foundChat = validChats.find(c => c.id === chatIdFromUrl);

    // ❌ Caso 1: El usuario escribió un ID inventado en la URL
    if (!foundChat) {
      Swal.fire({
        icon: "error",
        title: "Chat inexistente",
        text: "No tienes permiso para acceder aquí. Tu sesión se cerrará.",
      });

      logout();
      router.push("/");
      return;
    }

    // ❌ Caso 2: El chat existe pero NO pertenece al usuario
    const belongsToUser =
      foundChat.currentUser?.id === user.uuid ||
      foundChat.otherUser?.id === user.uuid;

    if (!belongsToUser) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permiso para ver este chat. Cerrando sesión por seguridad.",
      });

      logout();
      router.push("/");
      return;
    }

    // ✔ Caso 3: Todo válido → seleccionar chat
    handleSelect(foundChat);

  }, [chats, params, user, selectedChat]);




  // --- Join/Leave del chat actual ---
  useEffect(() => {
    if (!socket || !selectedChat) return;
    socket.emit("join", selectedChat.id);
    return () => { socket.emit("leave", selectedChat.id); };
  }, [socket, selectedChat]);
  // --- Traer chats iniciales ---
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get<ChatDto[]>("/chat");
        setChats(res.data);
      } catch (error) {
        handleApiError(error, "Error al obtener chats.");
      }
    };
    fetchChats();
  }, []);

  // --- Listeners de chats ---
  useEffect(() => {
    if (!socket) return;

    const handleChatNew = (newChat: ChatDto) => {
      setChats(prev => {
        const updated = prev.some(c => c.id === newChat.id)
          ? prev.map(c => (c.id === newChat.id ? newChat : c))
          : [newChat, ...prev];
        return updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    };

    const handleChatUpdate = (updatedChat: ChatDto) => {
      const currentUser = currentUserRef.current!;
      if (!currentUser || !updatedChat.currentUser) return;

      setChats(prev =>
        prev
          .map(c => {
            if (c.id !== updatedChat.id) return c;
            const otherUser = updatedChat.currentUser.id === currentUser.id
              ? updatedChat.otherUser
              : updatedChat.currentUser;
            return { ...c, ...updatedChat, currentUser, otherUser };
          })
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );

      setSelectedChat(prev => {
        if (!prev || prev.id !== updatedChat.id) return prev;
        const otherUser = updatedChat.currentUser.id === currentUser.id
          ? updatedChat.otherUser
          : updatedChat.currentUser;
        return { ...prev, ...updatedChat, currentUser, otherUser };
      });
    };

    // 👇 Nuevo listener para chat inactivo
    const handleChatInactive = (data: { chatId: string }) => {
      // 1️⃣ Actualizar la lista de chats para marcar isActive = false
      setChats(prev =>
        prev.map(chat => chat.id === data.chatId ? { ...chat, isActive: false } : chat)
      );

      // 2️⃣ Si el chat actualmente abierto es el inactivo, actualizarlo también
      setSelectedChat(prev => prev && prev.id === data.chatId ? { ...prev, isActive: false } : prev);

      // 3️⃣ Opcional: mostrar alerta
      Swal.fire("Chat cerrado", "Este chat ha sido cerrado y ya no podrás enviar mensajes.", "info");
    };


    socket.on("chat:new", handleChatNew);
    socket.on("chat:update", handleChatUpdate);
    socket.on("chat:inactive", handleChatInactive);

    return () => {
      socket.off("chat:new", handleChatNew);
      socket.off("chat:update", handleChatUpdate);
      socket.off("chat:inactive", handleChatInactive);
    };
  }, [socket]);


  const handleMarkAsDelivered = async () => {
    if (!selectedChat) return;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Desea marcar el producto "${selectedChat.product.title}" como entregado al usuario "${selectedChat.otherUser.user_name}"? 
         Esta acción no se puede deshacer y una vez entregado ya no podrán volver a comunicarse por este chat.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, marcar como entregado",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setLoading(true); // 🔒 desactiva botones
      try {

        await api.post(`/transactions/markAsDelivered/${selectedChat.transactionId}`);
        await Swal.fire("¡Hecho!", "El producto ha sido marcado como entregado.", "success");
      } catch (error: any) {
        handleApiError(error, "Error al marcar como entregado.");
      } finally {
        setLoading(false); // 🔓 reactiva botones
      }
    }
  };

  // --- Obtener mensajes del chat seleccionado ---
  const fetchChatMessages = async (chatId: string) => {
    try {
      const res = await api.get<ChatWithMessagesDto>(`/chat/${chatId}/messages`);
      if (!currentUserRef.current) currentUserRef.current = res.data.currentUser;

      const currentUser = currentUserRef.current;
      const otherUser = res.data.currentUser.id === currentUser.id
        ? res.data.otherUser
        : res.data.currentUser;

      setSelectedChat({ ...res.data, currentUser, otherUser });
    } catch (error) {
      handleApiError(error, "Error al obtener mensajes.");
    }
  };

  // --- Seleccionar chat ---
  const handleSelect = (chat: ChatDto) => {
    if (joiningChatId === chat.id) return;
    setJoiningChatId(chat.id);

    if (selectedChat?.id && selectedChat.id !== chat.id) {
      socket?.emit("leave", selectedChat.id);
    }

    fetchChatMessages(chat.id).finally(() => setJoiningChatId(null));
    socket?.emit("join", chat.id);
    readMessages.current.clear();
  };

  // --- Scroll automático al final ---
  useEffect(() => {
    if (!chatContainerRef.current || !selectedChat) return;

    // 👇 Solo hacer scroll si NO hay búsqueda activa
    if (!messageSearch.trim()) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedChat?.messages, messageSearch]);



  // --- Scroll a mensaje específico ---
  const scrollToMessage = (id: string) => {
    const el = messageRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // --- Listeners de mensajes ---
  useEffect(() => {
    if (!socket) return; // <-- solo dependemos de socket

    const handleNewMessage = (message: ChatMessageDto) => {
      // Actualizar panel izquierdo de chats
      setChats(prev =>
        prev.map(chat => {
          const isSelected = selectedChat?.id === chat.id; // opcional: lectura solo si abierto
          if (chat.id === message.chatId) {
            return {
              ...chat,
              lastMessage: { ...message, read: isSelected },
            };
          }
          return chat;
        })
      );

      // Si el chat está abierto, agregar mensaje y marcar como leído
      setSelectedChat(prev => {
        if (!prev || prev.id !== message.chatId) return prev;
        if (message.senderId !== prev.currentUser.id) {
          socket.emit("markAsRead", { messageId: message.id });
        }
        return { ...prev, messages: [...prev.messages, message] };
      });
    };

    const handleMessageRead = (updated: ChatMessageDto) => {
      setSelectedChat(prev => {
        if (!prev) return prev;
        const newMessages = prev.messages.map(m =>
          m.id === updated.id ? { ...m, read: true, readAt: updated.readAt } : m
        );
        return { ...prev, messages: newMessages };
      });

      setChats(prev =>
        prev.map(c => {
          if (!c.lastMessage) return c;
          if (c.id === updated.chatId && c.lastMessage.id === updated.id) {
            return { ...c, lastMessage: { ...c.lastMessage, read: true, readAt: updated.readAt } };
          }
          return c;
        })
      );
    };

    const handleTyping = (data: { chatId: string; userId: string }) => {
      if (selectedChat && data.chatId === selectedChat.id && data.userId !== selectedChat.currentUser.id) {
        setTypingUser(data.userId);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 3000);
      }
    };

    const handleError = (err: { message: string }) => Swal.fire("Error", err.message, "error");

    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleMessageRead);
    socket.on("message:typing", handleTyping);
    socket.on("message:error", handleError);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleMessageRead);
      socket.off("message:typing", handleTyping);
      socket.off("message:error", handleError);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [socket]); // <-- quitar selectedChat de dependencias


  // --- Marcar mensajes como leídos ---
  useEffect(() => {
    if (!socket || !selectedChat) return;
    selectedChat.messages.forEach(m => {
      if (!m.read && m.senderId !== selectedChat.currentUser.id && !readMessages.current.has(m.id)) {
        socket.emit("markAsRead", { messageId: m.id });
        readMessages.current.add(m.id);
      }
    });
  }, [socket, selectedChat]);

  // --- Filtrado de mensajes ---
  useEffect(() => {
    if (!selectedChat || !messageSearch.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }
    const query = messageSearch.toLowerCase();
    const results = selectedChat.messages
      .filter(m => m.text?.toLowerCase().includes(query))
      .map(m => m.id);
    setSearchResults(results);
    setCurrentResultIndex(results.length ? 0 : -1);
    if (results.length) scrollToMessage(results[0]);
  }, [messageSearch, selectedChat]);

  const goToNextMatch = () => {
    if (!searchResults.length) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);
    scrollToMessage(searchResults[nextIndex]);
  };

  const goToPrevMatch = () => {
    if (!searchResults.length) return;
    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentResultIndex(prevIndex);
    scrollToMessage(searchResults[prevIndex]);
  };

  // --- Filtrado de chats ---
  const filteredChats = useMemo(() => {
    if (!chatSearch.trim()) return chats;
    return chats.filter(chat =>
      chat.otherUser.user_name.toLowerCase().includes(chatSearch.toLowerCase())
    );
  }, [chats, chatSearch]);

  // --- Renderizado de mensajes ---
  const renderedMessages = useMemo(() => {
    if (!selectedChat) return [];
    const query = messageSearch.trim().toLowerCase();
    return selectedChat.messages.map(msg => {
      const isMatch = searchResults.includes(msg.id);
      const parts = query ? (msg.text || "").split(new RegExp(`(${query})`, "gi")) : [msg.text || ""];
      return { ...msg, isMatch, parts };
    });
  }, [selectedChat, messageSearch, searchResults]);


  const canMarkDelivered = selectedChat?.canMarkAsDelivered &&
    selectedChat?.isActive &&
    selectedChat?.currentUser.id === selectedChat.product.ownerId; // ejemplo

  const handleCancel = async () => {
    // Confirmación inicial
    const confirmResult = await Swal.fire({
      title: "Cancelar transacción",
      text: canMarkDelivered
        ? "¿Seguro que deseas cancelar esta transacción en progreso? Al comprador se le aplicará una sanción de 15 días donde no podrá volver a interesarse en este producto."
        : "¿Seguro que deseas cancelar tu interés en este producto? Se te aplicará una sanción de 15 días donde no podrás volver a interesarte en este producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (confirmResult.isConfirmed) {
      // Pedir la razón de la cancelación
      const reasonResult = await Swal.fire({
        title: "Motivo de la cancelación",
        input: "textarea",
        inputPlaceholder: "Escribe aquí la razón...",
        inputAttributes: {
          "aria-label": "Escribe la razón",
        },
        showCancelButton: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
        preConfirm: (reason) => {
          if (!reason || !reason.trim()) {
            Swal.showValidationMessage("Debes ingresar una razón");
          }
          return reason;
        },
      });

      if (reasonResult.isConfirmed) {
        const reason = reasonResult.value;
        // Aquí llamas a tu API para cancelar la transacción
        try {
          setLoading(true);
          await api.post("/transactions/cancel", {
            transactionId: selectedChat?.transactionId,
            cancelReason: reason,
          });
          await Swal.fire("Cancelado", "La transacción se ha cancelado correctamente.", "success");
        } catch (error: any) {
          handleApiError(error,"Error al cancelar la transacción.");
        } finally {
          setLoading(false);
        }
      }
    }
  };



  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">      {/* Panel izquierdo */}
      <div className="w-1/3 border-r border-gray-300 flex flex-col h-screen">        {/* Buscador de chats */}
        <div className="p-4 shrink-0">          <input
          type="text"
          placeholder="Buscar chats..."
          value={chatSearch}
          onChange={e => setChatSearch(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary mb-2" />
        </div>

        {/* Lista de chats con scroll interno */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredChats.length === 0 ? (
            <div className="text-gray-400">No hay chats</div>
          ) : (
            filteredChats.map(chat => {
              const lastMessage = chat.lastMessage;
              const otherUser = chat.otherUser;

              const hasUnread =
                chat.lastMessage &&
                !chat.lastMessage.read &&
                chat.lastMessage.senderId === chat.otherUser.id;


              const showChecks =
                lastMessage &&
                lastMessage.senderId === chat.currentUser.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => handleSelect(chat)}
                  className={classNames(
                    "cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition",
                    { "bg-gray-100 dark:bg-white/10": chat.id === selectedChat?.id }
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={otherUser.avatarUrl || "/default-avatar.png"}
                      alt={otherUser.user_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {hasUnread && chat.isActive && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-1 ring-white"></span>
                    )}
                  </div>

                  {/* Info de chat */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate max-w-[60%]">
                        {otherUser.user_name}
                      </p>

                      {!chat.isActive && (
                        <span className="text-xs text-gray-400 italic ml-2 flex-shrink-0">Chat Inactivo</span>
                      )}

                      {lastMessage && chat.isActive && (
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true, locale: es })}
                        </span>
                      )}
                    </div>

                    {lastMessage && chat.isActive && (
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate max-w-[80%]">
                          {lastMessage.text}
                        </p>
                        {showChecks && (
                          <span className={lastMessage.read ? "text-blue-500 ml-1 flex-shrink-0" : "text-gray-400 ml-1 flex-shrink-0"}>
                            ✔✔
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );

            })
          )}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedChat ? (
          <>
            {/* Encabezado fijo */}
            <div className="p-4 border-b border-gray-300 flex justify-between items-center gap-4 shrink-0">
              {/* Usuario */}
              <div className="flex items-center gap-2">
                <img
                  src={selectedChat.otherUser.avatarUrl || "/default-avatar.png"}
                  alt={selectedChat.otherUser.user_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {selectedChat.otherUser.user_name}
                </p>
              </div>

              {/* Producto */}
              <div className="flex items-center gap-2">
                <img
                  src={selectedChat.product.imageUrl || "/default-product.png"}
                  alt={selectedChat.product.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedChat.product.title}</p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {selectedChat.product.quantityRequested}
                  </p>
                </div>
              </div>

              {/* Buscador de mensajes */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar mensajes..."
                  value={messageSearch}
                  onChange={e => setMessageSearch(e.target.value)}
                  className="p-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-gray-100 disabled:text-gray-400"
                />

                <button
                  onClick={goToPrevMatch}
                  className={classNames(
                    "px-2 py-1 rounded border border-white text-white bg-black transition-colors",
                    "hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  ⬆
                </button>

                <button
                  onClick={goToNextMatch}
                  className={classNames(
                    "px-2 py-1 rounded border border-white text-white bg-black transition-colors",
                    "hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  ⬇
                </button>

                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {searchResults.length ? `${currentResultIndex + 1} / ${searchResults.length}` : "0 / 0"}
                </span>

              </div>


              {/* Botones en columna */}
              <div className="flex flex-col gap-2 mt-4">
                {canMarkDelivered && (
                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={loading} // 👈 desactivado mientras carga
                    className={`px-4 py-2 rounded text-white ${loading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {loading ? "Procesando..." : "Marcar como entregado"}
                  </button>
                )}
                {selectedChat?.isActive && (
                  <button
                    onClick={handleCancel}
                    disabled={loading} // 👈 también desactivado mientras carga
                    className={`px-4 py-2 rounded text-white ${loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    Cancelar
                  </button>
                )}
              </div>

            </div>

            {/* Mensajes con scroll interno */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {renderedMessages.map(msg => (
                <div
                  key={msg.id}
                  ref={el => { messageRefs.current[msg.id] = el; }}
                  className={classNames(
                    "flex flex-col w-fit p-3 rounded-lg break-words whitespace-pre-wrap overflow-hidden relative transition-all max-w-[60%] sm:max-w-[50%]",
                    msg.senderId === selectedChat.currentUser.id
                      ? "bg-purple-200 dark:bg-purple-700 text-black dark:text-white self-end ml-auto"
                      : "bg-gray-200 dark:bg-white/10 self-start text-text-primary-light dark:text-text-primary-dark",
                    msg.isMatch ? "border-2 border-blue-600" : ""
                  )}
                  style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >

                  {/* Texto con resaltado */}
                  <p className="whitespace-pre-wrap">
                    {(msg.text || "").split(new RegExp(`(${messageSearch})`, "gi")).map((part, i) =>
                      part.toLowerCase() === messageSearch.toLowerCase() ? (
                        <span key={i} className="bg-blue-600 text-white font-semibold">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>



                  {/* Imágenes */}
                  {msg.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="img"
                      className="mt-2 w-full max-w-[400px] h-auto object-cover rounded"
                    />
                  ))}

                  {/* Footer (hora + palomitas) */}
                  <div className="flex items-center gap-2 text-xs mt-1 self-end">
                    <span className={msg.read ? "text-blue-500" : "text-gray-400"}>✔✔</span>
                    <span className="text-gray-400">
                      {format(new Date(msg.createdAt), "EEE dd MMM yyyy, h:mm a", { locale: es })}
                    </span>
                  </div>
                </div>
              ))}

              {typingUser && selectedChat.isActive && (
                <div className="text-sm text-gray-400 italic">
                  {selectedChat.otherUser.user_name} está escribiendo...
                </div>
              )}
            </div>

            {/* Input fijo abajo */}
            {selectedChat.isActive && (
              <div className="p-4 border-t border-gray-300 shrink-0">
                <ChatInput chatId={selectedChat.id} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            <span className="text-4xl mb-2">💬</span>
            <p className="text-lg">Selecciona un chat para comenzar</p>
          </div>
        )}
      </div>

    </div>
  );

};

export default withAuth(ChatsPage,true,false);
