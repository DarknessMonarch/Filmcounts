"use client";

import Link from "next/link";
import styles from "@/app/styles/footer.module.css";
import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={styles.footerContainer}>
    <div className={styles.footerLeft}>
          <h1>@ 2025 Budgy, All right reserved</h1>
        </div>
        <div className={styles.footerRight}>
          <Link href="/about" className={styles.footerLink}>
            <div
              className={`${styles.innerfooterLink} ${
                pathname === "/about" || pathname.startsWith("/about")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <h1>About us</h1>
            </div>
          </Link>
          <Link href="/contact" className={styles.footerLink}>
            <div
              className={`${styles.innerfooterLink} ${
                pathname === "/contact" ||
                pathname.startsWith("/contact")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <h1>Contact</h1>
            </div>
          </Link>
          <Link href="/terms" className={styles.footerLink}>
            <div
              className={`${styles.innerfooterLink} ${
                pathname === "/terms" ||
                pathname.startsWith("/terms")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <h1>Terms and Condition</h1>
            </div>
          </Link>
        </div>
    </div>
  );
}
