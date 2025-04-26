"use client";

import styles from "@/app/styles/authLayout.module.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function AuthLayout({ children }) {

  return (
    <div className={styles.authLayout}>
      <Navbar />
      <div className={styles.authLayoutContainer}>
      {children}
      <Footer />
      </div>
    </div>
  );
}
