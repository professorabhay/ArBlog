import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

const commonLinkClass =
  "text-base font-medium text-white/60 text-xs hover:text-white/60";

const FooterLink = ({ to, text }) => (
  <li className="mb-4">
    <Link className={commonLinkClass} to={to}>
      {text}
    </Link>
  </li>
);

function Footer() {
  const navigate = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section className="overflow-hidden pt-10 pb-10 bg-[#000000] text-sm h-1">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-sm text-gray-600">&copy; Copyright 2024. professorabhay 🥷</p>
      </div>
    </section>
  );
}

export default Footer;
