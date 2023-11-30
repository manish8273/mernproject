import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <footer className="main-footer">
        <div className="footer-left">
          Copyright &copy; {year}
          <div className="bullet"></div> BrightRoots
        </div>
        <div className="footer-right">2.3.0</div>
      </footer>
    </div>
  );
}

export default Footer;
