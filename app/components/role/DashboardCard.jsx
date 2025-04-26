"use client";

import { useState, useEffect } from "react";
import styles from "@/app/styles/dashboardCard.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  FaArrowTrendDown as LossIcon,
  FaArrowTrendUp as ProfitIcon,
} from "react-icons/fa6";

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
          } ${card.status === "loss" && card.type === activeCard  ? styles.dashcardwarning : ""} skeleton`}
          onClick={() => handleCardClick(card.type)}
          style={{ cursor: "pointer" }}
        >
          <h2>{card.title}</h2>

          <div className={styles.cardInfo}>
            <h4>balance</h4>
            <div
              className={`${styles.amountContainer} ${
                card.status === "loss"
                  ? styles.amountWarning
                  : styles.amountSuccess
              }`}
            >
              <h1>{card.amount}</h1>

              {card.trend && (
                <div
                  className={`${styles.trendContainer} ${
                    card.status === "loss"
                      ? styles.amountWarning
                      : styles.amountSuccess
                  }`}
                >
                  {card.status === "loss" ? (
                    <LossIcon
                      className={styles.trendIcon}
                      aria="loss icon"
                      aria-label="loss icon"
                    />
                  ) : (
                    <ProfitIcon
                      className={styles.trendIcon}
                      aria="profit icon"
                      aria-label="profit icon"
                    />
                  )}
                  <p>{card.trend}</p>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${styles.status} ${
              card.status === "loss"
                ? styles.subtitleWarning
                : styles.subtitleSuccess
            }`}
          >
            <span>{card.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
