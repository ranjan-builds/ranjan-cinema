// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">{children}</main>
      <Footer />
    </>
  );
}
