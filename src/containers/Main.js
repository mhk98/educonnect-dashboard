import React from "react";

function Main({ children }) {
  return (
    <main className="h-full overflow-y-auto custom-scrollbar">
      <div className="ea-page-container grid">{children}</div>
    </main>
  );
}

export default Main;
