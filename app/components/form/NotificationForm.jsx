"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import styles from "@/app/styles/notificationform.module.css";
import { FaBell as NotificationIcon } from "react-icons/fa";
import { IoPhonePortraitOutline as PushIcon } from "react-icons/io5";
import { MdEmail as EmailIcon } from "react-icons/md";

const ToggleSwitch = ({ checked, onChange, label, icon }) => {
  return (
    <div className={styles.toggleContainer}>
      <div className={styles.toggleHeader}>
        <div className={styles.toggleIconWrapper}>{icon}</div>
        <span>{label}</span>
      </div>

      <div
        className={`${styles.toggleSwitch} ${checked ? styles.active : ""}`}
        onClick={onChange}
      >
        <div
          className={`${styles.toggleSlider} ${
            checked ? styles.sliderActive : ""
          }`}
        />
      </div>
    </div>
  );
};

export default function GlobalPreferencesForm() {
  const [preferences, setPreferences] = useState({
    inApp: false,
    email: true,
    push: true,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => {
      const newPreferences = {
        ...prev,
        [key]: !prev[key],
      };

      const action = newPreferences[key] ? "enabled" : "disabled";
      const preferenceType =
        key === "inApp" ? "In-App" : key.charAt(0).toUpperCase() + key.slice(1);
      toast.success(`${preferenceType} notifications ${action}`);

      return newPreferences;
    });
  };

  useEffect(() => {
    const savePreferences = () => {
      console.log("Saving preferences:", preferences);
    };

    const timeoutId = setTimeout(savePreferences, 500);
    return () => clearTimeout(timeoutId);
  }, [preferences]);

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <h1>Global preferences</h1>
      </div>

      <div className={styles.preferencesContainer}>
        <div className={styles.preferencesContainerInner}>
          <ToggleSwitch
            checked={preferences.inApp}
            onChange={() => handleToggle("inApp")}
            icon={<NotificationIcon className={styles.switchIcon} />}
            label="In-App"
          />

          <ToggleSwitch
            checked={preferences.email}
            onChange={() => handleToggle("email")}
            icon={<EmailIcon className={styles.switchIcon} />}
            label="Email"
          />

          <ToggleSwitch
            checked={preferences.push}
            onChange={() => handleToggle("push")}
            icon={<PushIcon className={styles.switchIcon} />}
            label="Push"
          />
        </div>
      </div>
    </div>
  );
}
