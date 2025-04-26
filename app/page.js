"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import styles from "@/app/styles/app.module.css";
import Dashboard from "@/public/assets/dashboard.png";

import { FaArrowRight as ArrowIcon } from "react-icons/fa6";

export default function App() {
  const router = useRouter();

  const login = async () => {
    router.push("authentication/login");
  };

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <div className={styles.appContent}>
        <span>Budget Management</span>
        <h1>Take charge of your finance  with our
          budget Management system</h1>
        <p>Achieve your financial goal with us for yourself or your organization</p>
        <button className={styles.appButton} onClick={login}>
          Get started today
          <ArrowIcon
            alt="arrow icon"
            aria-label="arrow icon"
            className={styles.arrowIcon}
          />
        </button>
        <div className={styles.appImageContainer}>
          <Image
            className={styles.appImage}
            src={Dashboard}
            alt="app image"
            fill
            sizes="100%"
            quality={100}
            style={{
              objectFit: "contain",
            }}
            priority={true}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}