import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const API = "https://backend.eaconsultancy.org/api/v1";
const SOCKET_URL = "https://backend.eaconsultancy.org";
const BRAND = "#1B2E6B";
const BRAND_GRADIENT = "linear-gradient(135deg, #1B2E6B 0%, #2563EB 100%)";

const PLATFORM_COLORS = {
  facebook: "#1877F2",
  whatsapp: "#25D366",
};

const DESTINATIONS = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "Belgium",
  "Hungary",
  "Denmark",
  "Austria",
  "Finland",
  "Sweden",
  "Cyprus",
  "Malaysia",
  "China",
  "Dubai",
  "Italy",
  "Croatia",
  "Malta",
  "Others",
];
const STATUSES = [
  "Hot Lead",
  "Cool Lead",
  "Open Case",
  "First Call Done",
  "Very Interested",
  "Requires Followup",
  "Blocked",
  "Needs Assistant",
  "Case Closed",
  "Case Converted",
];

const RESPONSIVE_CSS = `
  .ec-msg-wrap {
    display: flex;
    height: calc(100vh - 64px);
    overflow: hidden;
    background: #f8fafc;
    position: relative;
  }
  .ec-msg-sidebar {
    width: 300px;
    min-width: 220px;
    border-right: 1px solid #e2e8f0;
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.25s ease;
    flex-shrink: 0;
  }
  .ec-msg-thread {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }
  .ec-msg-back-btn {
    display: none;
  }
  .ec-msg-conv-list {
    flex: 1;
    overflow-y: auto;
  }
  .ec-msg-input-row {
    padding: 12px 20px;
    border-top: 1px solid #e2e8f0;
    background: #fff;
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }
  .ec-msg-textarea {
    flex: 1;
    resize: none;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 14px;
    color: #1e293b;
    outline: none;
    font-family: inherit;
    line-height: 1.5;
    transition: border-color 0.2s;
    min-width: 0;
  }
  .ec-msg-send-btn {
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    height: 44px;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .ec-msg-bubble-wrap {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ec-lead-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .ec-msg-sidebar {
      width: 240px;
      min-width: 180px;
    }
  }

  /* Mobile */
  @media (max-width: 640px) {
    .ec-msg-sidebar {
      position: absolute;
      top: 0; left: 0; bottom: 0;
      width: 100%;
      z-index: 10;
      min-width: unset;
      border-right: none;
    }
    .ec-msg-sidebar.mobile-hidden {
      transform: translateX(-100%);
      pointer-events: none;
    }
    .ec-msg-thread {
      width: 100%;
    }
    .ec-msg-back-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: ${BRAND};
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }
    .ec-msg-bubble-wrap {
      padding: 14px 12px;
    }
    .ec-msg-input-row {
      padding: 10px 12px;
    }
    .ec-msg-send-btn {
      padding: 10px 14px;
      font-size: 13px;
    }
    .ec-lead-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 400px) {
    .ec-msg-textarea {
      font-size: 13px;
    }
  }
`;

const PlatformBadge = ({ platform }) => (
  <span
    style={{
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 999,
      background: PLATFORM_COLORS[platform] || "#6b7280",
      color: "#fff",
      textTransform: "capitalize",
      letterSpacing: 0.3,
      flexShrink: 0,
    }}
  >
    {platform === "facebook" ? "FB" : "WA"}
  </span>
);

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins}m আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h আগে`;
  return `${Math.floor(hrs / 24)}d আগে`;
};

export default function Messaging() {
  const token = localStorage.getItem("token");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [branches, setBranches] = useState([]);
  const [leadForm, setLeadForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    destination: "",
    status: "",
    location: "",
  });

  useEffect(() => {
    axios
      .get(`${API}/branch`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBranches(res.data?.data || []))
      .catch(() => {});
  }, [token]);

  const openLeadModal = () => {
    const userBranch = localStorage.getItem("branch") || "";
    setLeadForm({
      fullName: selected?.senderName || "",
      phone:
        selected?.platform === "whatsapp" ? selected?.externalId || "" : "",
      email: "",
      destination: "",
      status: "",
      location: userBranch,
    });
    setShowLeadModal(true);
  };

  const submitLead = async () => {
    if (
      !leadForm.fullName.trim() ||
      !leadForm.phone.trim() ||
      !leadForm.location
    ) {
      toast.error("Full Name, Phone এবং Location আবশ্যক");
      return;
    }
    setLeadSubmitting(true);
    try {
      await axios.post(
        `${API}/consultation/create`,
        {
          ...leadForm,
          type: "Office Visits",
          url: "leads",
          userId: localStorage.getItem("userId"),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Lead সফলভাবে add হয়েছে!");
      setShowLeadModal(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Lead add করতে সমস্যা হয়েছে",
      );
    }
    setLeadSubmitting(false);
  };

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/messaging/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(data.data || []);
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;
    socket.on("messaging:new", ({ platform, senderName, messageText }) => {
      setNotification({ platform, senderName, messageText });
      setTimeout(() => setNotification(null), 5000);
      loadConversations();
    });
    return () => socket.disconnect();
  }, [token, loadConversations]);

  const selectConversation = async (conv) => {
    setSelected(conv);
    setMobileShowThread(true);
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API}/messaging/conversations/${conv.id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages(data.data?.messages || []);
      await axios.put(
        `${API}/messaging/conversations/${conv.id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)),
      );
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const handleBack = () => {
    setMobileShowThread(false);
    setSelected(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!replyText.trim() || !selected || sending) return;
    setSending(true);
    try {
      const { data } = await axios.post(
        `${API}/messaging/conversations/${selected.id}/reply`,
        { message: replyText.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((prev) => [...prev, data.data]);
      setReplyText("");
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selected.id
            ? { ...c, lastMessage: replyText.trim(), lastMessageAt: new Date() }
            : c,
        ),
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Reply পাঠাতে সমস্যা হয়েছে");
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      <div className="ec-msg-wrap">
        {/* Notification Toast */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: 80,
              right: 16,
              zIndex: 9999,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(27,46,107,0.18)",
              padding: "14px 18px",
              maxWidth: 300,
              width: "calc(100vw - 32px)",
              borderLeft: `4px solid ${PLATFORM_COLORS[notification.platform] || BRAND}`,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PlatformBadge platform={notification.platform} />
              <span style={{ fontWeight: 700, fontSize: 13, color: BRAND }}>
                {notification.senderName}
              </span>
            </div>
            <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.4 }}>
              {notification.messageText}
            </span>
          </div>
        )}

        {/* Conversations Sidebar */}
        <div
          className={`ec-msg-sidebar${mobileShowThread ? " mobile-hidden" : ""}`}
        >
          {/* Header */}
          <div
            style={{
              background: BRAND_GRADIENT,
              padding: "14px 16px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Messaging</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Facebook & WhatsApp
              </div>
            </div>
            <button
              onClick={openLeadModal}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "5px 11px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
              }
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Add Lead
            </button>
          </div>

          {/* Conversation list */}
          <div className="ec-msg-conv-list">
            {conversations.length === 0 && (
              <div
                style={{
                  padding: 32,
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              >
                কোন message নেই
              </div>
            )}
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 16px",
                  border: "none",
                  borderBottom: "1px solid #f1f5f9",
                  background: selected?.id === conv.id ? "#EFF6FF" : "#fff",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  borderLeft:
                    selected?.id === conv.id
                      ? `3px solid ${BRAND}`
                      : "3px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      minWidth: 0,
                    }}
                  >
                    <PlatformBadge platform={conv.platform} />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#1e293b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conv.senderName || conv.externalId}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    {conv.unreadCount > 0 && (
                      <span
                        style={{
                          background: BRAND,
                          color: "#fff",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 7px",
                          minWidth: 18,
                          textAlign: "center",
                        }}
                      >
                        {conv.unreadCount}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    paddingLeft: 2,
                  }}
                >
                  {conv.lastMessage || "—"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="ec-msg-thread">
          {!selected ? (
            <div
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: 15,
                flexDirection: "column",
                gap: 12,
              }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke={BRAND}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>বাম দিকের conversation select করুন</span>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <button className="ec-msg-back-btn" onClick={handleBack}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>
                <PlatformBadge platform={selected.platform} />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#1e293b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selected.senderName || selected.externalId}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginLeft: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flexShrink: 1,
                  }}
                >
                  {selected.externalId}
                </span>
              </div>

              {/* Messages */}
              <div className="ec-msg-bubble-wrap">
                {loading && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    Loading…
                  </div>
                )}
                {messages.map((msg) => {
                  const isOut = msg.direction === "outgoing";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: isOut ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "75%",
                          background: isOut ? BRAND_GRADIENT : "#fff",
                          color: isOut ? "#fff" : "#1e293b",
                          padding: "10px 14px",
                          borderRadius: isOut
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                          fontSize: 14,
                          lineHeight: 1.5,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          wordBreak: "break-word",
                        }}
                      >
                        {!isOut && (
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              marginBottom: 4,
                              color: PLATFORM_COLORS[msg.platform] || BRAND,
                            }}
                          >
                            {msg.senderName}
                          </div>
                        )}
                        {msg.message}
                        <div
                          style={{
                            fontSize: 10,
                            marginTop: 4,
                            opacity: 0.65,
                            textAlign: "right",
                          }}
                        >
                          {isOut && msg.repliedByName
                            ? `${msg.repliedByName} · `
                            : ""}
                          {timeAgo(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              <div className="ec-msg-input-row">
                <textarea
                  className="ec-msg-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply লিখুন… (Enter পাঠাবে)"
                  rows={2}
                  onFocus={(e) => (e.target.style.borderColor = BRAND)}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  className="ec-msg-send-btn"
                  onClick={sendReply}
                  disabled={!replyText.trim() || sending}
                  style={{
                    background:
                      !replyText.trim() || sending ? "#cbd5e1" : BRAND_GRADIENT,
                    color: "#fff",
                    cursor:
                      !replyText.trim() || sending ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "পাঠানো হচ্ছে…" : "Send"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Add Lead Modal */}
        {showLeadModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLeadModal(false);
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                width: "100%",
                maxWidth: 560,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 16px 60px rgba(27,46,107,0.2)",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  background: BRAND_GRADIENT,
                  borderRadius: "16px 16px 0 0",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#fff",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                  Add New Lead
                </span>
                <button
                  onClick={() => setShowLeadModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <div
                style={{
                  padding: "20px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {selected && (
                  <div
                    style={{
                      background: "#EFF6FF",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 13,
                      color: BRAND,
                      fontWeight: 500,
                    }}
                  >
                    Conversation:{" "}
                    <strong>
                      {selected.senderName || selected.externalId}
                    </strong>{" "}
                    ({selected.platform})
                  </div>
                )}

                <div className="ec-lead-grid">
                  {/* Full Name */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Full Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      value={leadForm.fullName}
                      onChange={(e) =>
                        setLeadForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      placeholder="Lead এর নাম"
                      style={{
                        width: "100%",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = BRAND)}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Phone <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      value={leadForm.phone}
                      onChange={(e) =>
                        setLeadForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+8801XXXXXXXXX"
                      style={{
                        width: "100%",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = BRAND)}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) =>
                        setLeadForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="email@example.com"
                      style={{
                        width: "100%",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = BRAND)}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  {/* Destination */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Destination
                    </label>
                    <select
                      value={leadForm.destination}
                      onChange={(e) =>
                        setLeadForm((p) => ({
                          ...p,
                          destination: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                        background: "#fff",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">Select Destination</option>
                      {DESTINATIONS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Lead Status */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Lead Status
                    </label>
                    <select
                      value={leadForm.status}
                      onChange={(e) =>
                        setLeadForm((p) => ({ ...p, status: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                        background: "#fff",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">Select Status</option>
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Branch */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Branch <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={leadForm.location}
                      onChange={(e) =>
                        setLeadForm((p) => ({ ...p, location: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                        background: "#fff",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option
                          key={b.id || b.branch}
                          value={b.branch || b.name || b.Branch}
                        >
                          {b.branch || b.name || b.Branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 4,
                  }}
                >
                  <button
                    onClick={() => setShowLeadModal(false)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 10,
                      border: "1.5px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "#64748b",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitLead}
                    disabled={leadSubmitting}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 10,
                      border: "none",
                      background: leadSubmitting ? "#cbd5e1" : BRAND_GRADIENT,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: leadSubmitting ? "not-allowed" : "pointer",
                      boxShadow: leadSubmitting
                        ? "none"
                        : "0 2px 8px rgba(27,46,107,0.25)",
                    }}
                  >
                    {leadSubmitting ? "Saving..." : "Save Lead"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
