import React from "react";

function Main({ children }) {
  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar">
      {children}
    </main>
  );
}

export default Main;
