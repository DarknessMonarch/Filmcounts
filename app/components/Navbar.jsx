"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "@/app/styles/navbar.module.css";
import Logo from "@/public/assets/logo.png";
import Coloredlogo from "@/public/assets/coloredlogo.png";

import { IoHomeSharp as HomeIcon, IoKey as LoginIcon } from "react-icons/io5";
import { FaUserCircle as SignUpIcon } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    
    <div className={styles.navContainer}>
      <div className={styles.navWrapper}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.navLogo}>
            <Image
              src={isMobile ? Logo : Coloredlogo}
              alt="logo Image"
              height={30}
              className={styles.logoImage}
            />
          </Link>
        </div>
        <div className={styles.navRight}>
          <Link href="/" className={styles.navLink}>
            <div
              className={`${styles.innernavLink} ${
                pathname === "/" 
                  ? styles.activeLink
                  : ""
              }`}
            >
              <HomeIcon
                alt="home icon"
                aria-label="home icon"
                className={styles.linkIcon}
              />
              <h1>Home</h1>
            </div>
          </Link>
          <Link href="/authentication/signup" className={styles.navLink}>
            <div
              className={`${styles.innernavLink} ${
                pathname === "/authentication/signup" ||
                pathname.startsWith("/authentication/signup")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <SignUpIcon
                alt="signup icon"
                aria-label="signup icon"
                className={styles.linkIcon}
              />
              <h1>Signup</h1>
            </div>
          </Link>
          <Link href="/authentication/login" className={styles.navLink}>
            <div
              className={`${styles.innernavLink} ${
                pathname === "/authentication/login" ||
                pathname.startsWith("/authentication/login")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <LoginIcon
                alt="login icon"
                aria-label="login icon"
                className={styles.linkIcon}
              />
              <h1>Login</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
