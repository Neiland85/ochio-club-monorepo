import React from "react";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">Header</header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">Footer</footer>
    </div>
  );
};

export default AppLayout;
