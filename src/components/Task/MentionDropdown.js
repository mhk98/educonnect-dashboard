import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function MentionInput({ value, onChange }) {
  const editorRef = useRef(null);
  const branch = localStorage.getItem("branch");

  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  /* ----------------------------------
     Load users
  ---------------------------------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/user/student")
      .then((res) => setUsers(res.data.data || []));
  }, []);

  /* ----------------------------------
     Sync value -> contentEditable
     🔥 THIS FIXES EDIT ISSUE
  ---------------------------------- */
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  /* ----------------------------------
     Branch filter
  ---------------------------------- */
  // const filteredUsers =
  //   branch === "Edu Anchor"
  //     ? users.filter((u) => u.Branch !== "Edu Anchor")
  //     : users.filter((u) => u.Branch === branch || u.Branch === "Edu Anchor");

  /* ----------------------------------
     Handle typing
  ---------------------------------- */
  const handleInput = () => {
    const text = editorRef.current.innerText;
    onChange(editorRef.current.innerHTML);

    const match = text.match(/@(\w*)$/);
    if (!match) {
      setSuggestions([]);
      return;
    }

    const keyword = match[1].toLowerCase();
    setSuggestions(
      // filteredUsers.filter((u) =>
      users.filter((u) => u.FirstName?.toLowerCase().startsWith(keyword)),
    );
  };

  /* ----------------------------------
     Insert mention
  ---------------------------------- */
  const insertMention = (user) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const match = editorRef.current.innerText.match(/@(\w*)$/);

    if (!match) return;

    // remove @keyword
    range.setStart(range.endContainer, range.endOffset - match[0].length);
    range.deleteContents();

    const span = document.createElement("span");
    span.setAttribute("data-user-id", user.id);
    span.setAttribute("contenteditable", "false");
    span.className =
      "inline-flex items-center bg-gray-200 text-gray-900 px-2 py-0.5 rounded-md mx-0.5 text-sm font-medium group";

    span.innerHTML = `
      ${user.FirstName} ${user.LastName}
      <span class="ml-1 text-xs text-gray-500 cursor-pointer hidden group-hover:inline">×</span>
    `;

    range.insertNode(span);

    // add space after mention
    const space = document.createTextNode("\u00A0");
    span.after(space);

    // move cursor
    range.setStartAfter(space);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    setSuggestions([]);
    onChange(editorRef.current.innerHTML);
  };

  /* ----------------------------------
     Remove mention
  ---------------------------------- */
  const handleClick = (e) => {
    if (e.target.textContent === "×") {
      e.target.closest("span[data-user-id]").remove();
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="relative">
      {/* ---------- Editable Input ---------- */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onClick={handleClick}
        className="
          w-full min-h-[42px]
          border rounded-md px-3 py-2
          text-sm text-gray-900
          focus:outline-none focus:ring-1 focus:ring-blue-400
        "
        suppressContentEditableWarning
      />

      {/* ---------- Dropdown ---------- */}
      {suggestions.length > 0 && (
        <div className="absolute bottom-full mb-1 w-full bg-white border rounded-md shadow z-10 max-h-40 overflow-y-auto">
          {suggestions.map((u) => (
            <div
              key={u.id}
              onMouseDown={(e) => {
                e.preventDefault(); // 🔥 prevent blur
                insertMention(u);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              {u.image ? (
                <img
                  className="w-6 h-6 rounded-full"
                  src={u.image}
                  alt="avatar"
                />
              ) : (
                <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full text-xs">
                  {u.FirstName?.[0]?.toUpperCase() || ""}
                  {u.LastName?.[0]?.toUpperCase() || ""}
                </span>
              )}
              {u.FirstName}
              {u.LastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
