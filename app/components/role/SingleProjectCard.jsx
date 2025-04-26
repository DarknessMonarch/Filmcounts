"use client";

import { useState, useEffect } from "react";
import styles from "@/app/styles/dashboardCard.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


export default function FinancialCard({ data }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCard = searchParams.get("card");

  useEffect(() => {
    if (!activeCard && data.length > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("card", data[0].type);
      router.push(`${pathname}?${params.toString()}`);
    }
  }, []);

  const handleCardClick = (cardType) => {
    const params = new URLSearchParams(searchParams);
    params.set("card", cardType);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.dashcardContainer}>
      {data.map((card, index) => (
        <div
          key={index}
          className={`${styles.dashcard} ${
            card.type === activeCard ? styles.dashcardactive : ""
          } ${card.status === "rejected" && card.type === activeCard  ? styles.dashcardwarning : ""} skeleton`}
          onClick={() => handleCardClick(card.type)}
          style={{ cursor: "pointer" }}
        >
          <h2>{card.title}</h2>

          <div className={styles.cardInfo}>
            <div
              className={`${styles.amountContainer} ${
                card.status === "rejected"
                  ? styles.amountWarning
                  : styles.amountSuccess
              }`}
            >
              <h1>{card.count}</h1>
            </div>
          </div>

          <div
            className={`${styles.status} ${
              card.status === "rejected"
                ? styles.subtitleWarning
                : styles.subtitleSuccess
            }`}
          >
            <span>{card.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
