import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const API_BASE_URL = "https://backend.eaconsultancy.org/api/v1";
const SOCKET_URL = "https://backend.eaconsultancy.org";
const CHAT_ALLOWED_ROLES = ["employee", "admin", "superAdmin"];

const BRAND = "#1B2E6B";
const BRAND_LIGHT = "#EFF6FF";
const BRAND_GRADIENT = "linear-gradient(135deg, #1B2E6B 0%, #2563EB 100%)";

const getToken = () => localStorage.getItem("token");
const getCurrentUserId = () => localStorage.getItem("userId");
const getCurrentRole = () => localStorage.getItem("role");

const getDisplayName = (user) => {
  const name = `${user?.FirstName || ""} ${user?.LastName || ""}`.trim();
  return name || user?.Email || `User ${user?.id || ""}`;
};

const getInitials = (user) =>
  getDisplayName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRequest = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload?.success === false)
    throw new Error(payload?.message || "Request failed");
  return payload;
};

/* ─── Fixed-position action popup (renders outside scroll container) ─── */
function ActionPopup({ anchor, onEdit, onDelete, onClose }) {
  const popupRef = useRef(null);
  const rect = anchor.getBoundingClientRect();

  // Position: above the dot-button, aligned to its right edge
  const top = rect.top - 8; // 8px gap above button
  const right = window.innerWidth - rect.right;

  useEffect(() => {
    const handler = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        e.target !== anchor
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchor, onClose]);

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top,
        right,
        transform: "translateY(-100%)",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
        border: "1px solid #f1f5f9",
        zIndex: 99999,
        minWidth: "140px",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => {
          onEdit();
          onClose();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "11px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: BRAND,
          textAlign: "left",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_LIGHT)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Pencil size={14} /> Edit
      </button>
      <div style={{ height: "1px", background: "#f1f5f9", margin: "0 12px" }} />
      <button
        type="button"
        onClick={() => {
          onClose();
          if (window.confirm("Do you want to delete this message?")) onDelete();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "11px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: "#ef4444",
          textAlign: "left",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Trash2 size={14} /> Remove
      </button>
    </div>
  );
}

/* ─── Message bubble ─── */
function MessageBubble({ message, currentUserId, onEdit, onDelete }) {
  const mine = message.senderUserId === currentUserId;
  const [hovered, setHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dotBtnRef = useRef(null);

  const togglePopup = (e) => {
    e.stopPropagation();
    setAnchorEl((prev) => (prev ? null : dotBtnRef.current));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: mine ? "flex-end" : "flex-start",
          alignItems: "center",
          gap: "5px",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 3-dot button — left of own messages */}
        {mine && (
          <button
            ref={dotBtnRef}
            type="button"
            onClick={togglePopup}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered || anchorEl ? 1 : 0,
              transition: "opacity 0.15s, background 0.12s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <MoreHorizontal size={15} />
          </button>
        )}

        {/* Bubble */}
        <div
          style={{
            maxWidth: "72%",
            borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            padding: "9px 13px",
            fontSize: "13.5px",
            lineHeight: 1.45,
            background: mine ? BRAND : "#fff",
            color: mine ? "#fff" : "#1e293b",
            border: mine ? "none" : "1px solid #e8edf5",
            boxShadow: mine
              ? "0 2px 8px rgba(27,46,107,0.2)"
              : "0 1px 4px rgba(0,0,0,0.07)",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.message}
          <div
            style={{
              marginTop: "3px",
              fontSize: "10px",
              opacity: 0.65,
              textAlign: "right",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Popup rendered via portal-like fixed position */}
      {anchorEl && (
        <ActionPopup
          anchor={anchorEl}
          onEdit={() => onEdit(message)}
          onDelete={() => onDelete(message.id)}
          onClose={() => setAnchorEl(null)}
        />
      )}
    </>
  );
}

/* ─── Inline edit form ─── */
function EditForm({ message, onSave, onCancel }) {
  const [text, setText] = useState(message.message);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const submit = () => {
    if (text.trim()) onSave(message.id, text.trim());
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ maxWidth: "80%", width: "100%" }}>
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
            if (e.key === "Escape") onCancel();
          }}
          rows={2}
          style={{
            width: "100%",
            border: `1.5px solid ${BRAND}`,
            borderRadius: "10px",
            padding: "8px 12px",
            fontSize: "13px",
            outline: "none",
            resize: "none",
            lineHeight: 1.4,
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "5px",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "4px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              fontSize: "12px",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim()}
            style={{
              padding: "4px 14px",
              borderRadius: "8px",
              border: "none",
              background: text.trim() ? BRAND : "#cbd5e1",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main widget ─── */
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const socketRef = useRef(null);
  const selectedConvRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUserId = getCurrentUserId();
  const canUseChat = CHAT_ALLOWED_ROLES.includes(getCurrentRole());

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() =>
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  }, []);

  const loadUsers = useCallback(async () => {
    if (!canUseChat || !isOpen) return;
    try {
      const q = searchTerm.trim()
        ? `?searchTerm=${encodeURIComponent(searchTerm.trim())}`
        : "";
      const r = await apiRequest(`/chat/users${q}`);
      setUsers(r?.data?.data || r?.data || []);
    } catch (err) {
      toast.error(err.message);
    }
  }, [canUseChat, isOpen, searchTerm]);

  const loadConversations = useCallback(async () => {
    if (!canUseChat) return;
    try {
      const r = await apiRequest("/chat/conversations?limit=50");
      const rows = r?.data?.data || r?.data || [];
      setConversations(rows);
      setUnreadTotal(rows.reduce((s, i) => s + Number(i.unreadCount || 0), 0));
    } catch {
      /* silent */
    }
  }, [canUseChat]);

  const markRead = useCallback(async (conversationId) => {
    try {
      await apiRequest(`/chat/conversations/${conversationId}/read`, {
        method: "PUT",
      });
    } catch {
      /* silent */
    }
  }, []);

  const loadMessages = useCallback(
    async (conversation, otherUser) => {
      if (!conversation?.id) {
        setSelectedConversation(null);
        setSelectedUser(otherUser || null);
        setMessages([]);
        return;
      }
      try {
        const r = await apiRequest(
          `/chat/conversations/${conversation.id}/messages?limit=80`,
        );
        const data = r?.data || {};
        setSelectedConversation(data.conversation || conversation);
        setSelectedUser(data.otherUser || otherUser || conversation.otherUser);
        setMessages(data.messages || []);
        selectedConvRef.current = data.conversation || conversation;
        socketRef.current?.emit("chat:conversation:join", {
          conversationId: conversation.id,
        });
        await markRead(conversation.id);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
          ),
        );
        setUnreadTotal((p) =>
          Math.max(0, p - Number(conversation.unreadCount || 0)),
        );
        scrollToBottom();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [markRead, scrollToBottom],
  );

  const openUserChat = async (user) => {
    setSelectedUser(user);
    setSelectedConversation(null);
    setMessages([]);
    selectedConvRef.current = null;
    try {
      const r = await apiRequest(`/chat/users/${user.id}/conversation`);
      if (r?.data) await loadMessages(r.data, user);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateConvFromMsg = useCallback(
    (conversationId, message) => {
      const otherUser =
        message.senderUserId === currentUserId
          ? message.receiver
          : message.sender;
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === conversationId);
        const rest = prev.filter((c) => c.id !== conversationId);
        const isSelected = selectedConvRef.current?.id === conversationId;
        const countUnread =
          message.receiverUserId === currentUserId && !isSelected;
        if (countUnread) setUnreadTotal((n) => n + 1);
        return [
          {
            ...(existing || {}),
            id: conversationId,
            lastMessage: message,
            lastMessageId: message.id,
            lastMessageAt: message.createdAt,
            otherUser,
            unreadCount: countUnread
              ? Number(existing?.unreadCount || 0) + 1
              : existing?.unreadCount || 0,
          },
          ...rest,
        ];
      });
    },
    [currentUserId],
  );

  useEffect(() => {
    selectedConvRef.current = selectedConversation;
  }, [selectedConversation]);
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
  useEffect(() => {
    const t = setTimeout(loadUsers, 250);
    return () => clearTimeout(t);
  }, [loadUsers]);

  useEffect(() => {
    if (!canUseChat) return;
    const token = getToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("chat:message:new", async (payload) => {
      const { conversationId, message } = payload || {};
      if (!conversationId || !message) return;
      updateConvFromMsg(conversationId, message);
      if (selectedConvRef.current?.id === conversationId) {
        setMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message],
        );
        scrollToBottom();
        if (message.receiverUserId === currentUserId)
          await markRead(conversationId);
      }
    });

    socket.on("chat:messages:read", (payload) => {
      if (selectedConvRef.current?.id !== payload?.conversationId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.senderUserId === currentUserId
            ? { ...m, isRead: true, readAt: payload.readAt }
            : m,
        ),
      );
    });

    socket.on("chat:message:deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    socket.on("chat:message:edited", ({ message: updated }) => {
      if (updated)
        setMessages((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m)),
        );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [canUseChat, currentUserId, markRead, scrollToBottom, updateConvFromMsg]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedUser) return;
    setMessageText("");
    try {
      const r = await apiRequest("/chat/messages", {
        method: "POST",
        body: JSON.stringify({
          receiverUserId: selectedUser.id,
          message: text,
          messageType: "text",
        }),
      });
      const conversationId = r?.data?.conversationId;
      const message = r?.data?.message;
      if (conversationId && message) {
        setSelectedConversation((p) => p || { id: conversationId });
        selectedConvRef.current = { id: conversationId };
        setMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message],
        );
        updateConvFromMsg(conversationId, message);
        socketRef.current?.emit("chat:conversation:join", { conversationId });
        scrollToBottom();
      }
    } catch (err) {
      setMessageText(text);
      toast.error(err.message);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await apiRequest(`/chat/messages/${messageId}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSave = async (messageId, newText) => {
    try {
      await apiRequest(`/chat/messages/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ message: newText }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, message: newText } : m)),
      );
      setEditingId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* Show "Seen" only under the very last message I sent that the receiver has read */
  const lastSeenIdx = (() => {
    let idx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].senderUserId === currentUserId) {
        if (messages[i].isRead) idx = i;
        break; // only check the last sent message
      }
    }
    return idx;
  })();

  if (!canUseChat) return null;

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}
    >
      {isOpen ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "360px",
            height: "590px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 40px rgba(27,46,107,0.18)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              height: "56px",
              background: BRAND_GRADIENT,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>Chat</div>
              <div style={{ fontSize: "11px", opacity: 0.75 }}>
                {socketConnected ? "● Online" : "Connecting..."}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Conversation view ── */}
          {selectedUser ? (
            <>
              {/* Recipient bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 14px",
                  height: "58px",
                  borderBottom: "1px solid #e8edf5",
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedConversation(null);
                    selectedConvRef.current = null;
                    setMessages([]);
                    setEditingId(null);
                  }}
                  style={{
                    background: "none",
                    border: `1px solid ${BRAND_LIGHT}`,
                    borderRadius: "8px",
                    padding: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: BRAND,
                  }}
                >
                  <ArrowLeft size={17} />
                </button>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: BRAND_LIGHT,
                    color: BRAND,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(selectedUser)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: BRAND,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getDisplayName(selectedUser)}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedUser.Role}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "14px 12px 6px",
                  background: "#F8FAFC",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {messages.map((message, idx) => {
                  const mine = message.senderUserId === currentUserId;
                  const isEditing = editingId === message.id;
                  const showSeen = mine && idx === lastSeenIdx;

                  return (
                    <div key={message.id}>
                      {isEditing ? (
                        <EditForm
                          message={message}
                          onSave={handleEditSave}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <MessageBubble
                          message={message}
                          currentUserId={currentUserId}
                          onEdit={(m) => setEditingId(m.id)}
                          onDelete={handleDelete}
                        />
                      )}

                      {/* Seen */}
                      {showSeen && (
                        <div
                          style={{
                            textAlign: "right",
                            fontSize: "11px",
                            color: BRAND,
                            fontWeight: 500,
                            marginTop: "2px",
                            paddingRight: "4px",
                            opacity: 0.75,
                          }}
                        >
                          Seen
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={sendMessage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderTop: "1px solid #e8edf5",
                  flexShrink: 0,
                  background: "#fff",
                }}
              >
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Aa"
                  style={{
                    flex: 1,
                    height: "40px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "20px",
                    padding: "0 16px",
                    fontSize: "13.5px",
                    outline: "none",
                    background: "#f0f2f5",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = BRAND)}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: messageText.trim() ? BRAND : "#cbd5e1",
                    border: "none",
                    color: "#fff",
                    cursor: messageText.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Search */}
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e8edf5",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    height: "38px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "20px",
                    padding: "0 14px",
                    background: "#f0f2f5",
                  }}
                >
                  <Search size={14} color="#94a3b8" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search people..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              {/* People list */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {conversations.length > 0 && (
                  <>
                    <div
                      style={{
                        padding: "10px 16px 4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Recent
                    </div>
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => loadMessages(conv, conv.otherUser)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          width: "100%",
                          padding: "9px 16px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = BRAND_LIGHT)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: BRAND_LIGHT,
                            color: BRAND,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "14px",
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(conv.otherUser)}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "13px",
                              color: "#0f172a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {getDisplayName(conv.otherUser)}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {conv.lastMessage?.message || "Start chat"}
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span
                            style={{
                              background: BRAND,
                              color: "#fff",
                              borderRadius: "999px",
                              padding: "2px 7px",
                              fontSize: "11px",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                )}

                <div
                  style={{
                    padding: "10px 16px 4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  People
                </div>
                {users.length === 0 && (
                  <div
                    style={{
                      padding: "20px 16px",
                      fontSize: "13px",
                      color: "#94a3b8",
                      textAlign: "center",
                    }}
                  >
                    No users found
                  </div>
                )}
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => openUserChat(user)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "9px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = BRAND_LIGHT)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#fff",
                        color: BRAND,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "14px",
                        border: `1.5px solid ${BRAND_LIGHT}`,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getDisplayName(user)}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.Role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Open chat"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: BRAND_GRADIENT,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(27,46,107,0.35)",
            position: "relative",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageCircle size={24} />
          {unreadTotal > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "999px",
                padding: "2px 6px",
                fontSize: "11px",
                fontWeight: 700,
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {unreadTotal}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
