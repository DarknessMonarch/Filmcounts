"use client";

import { toast } from "sonner";
import { useState } from "react";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/settingsForm.module.css";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { VscSignOut as SignoutIcon } from "react-icons/vsc";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";




export default function SettingsForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [profileFile, setProfileFile] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [devices] = useState([
    {
      name: "iPhone 16",
      lastActive: "Nairobi April 20 2025",
    },
  ]);

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Please upload only image files");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setProfileFile(file);
    const imageUrl = URL.createObjectURL(file);
    setProfileUrl(imageUrl);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const rules = {
      minLength: password.length >= 8,
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
      notSameAsPrevious: password !== passwordData.currentPassword,
    };
    return rules;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const passwordRules = validatePassword(passwordData.newPassword);
    const allRulesPassed = Object.values(passwordRules).every(
      (rule) => rule === true
    );

    if (!allRulesPassed) {
      toast.error("Password does not meet all requirements");
      return;
    }

    setIsLoading(true);

    try {
      setTimeout(() => {
        console.log("Password updated");
        toast.success("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password");
      setIsLoading(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      setTimeout(() => {
        toast.success("Signed out from all devices successfully");
      }, 500);
    } catch (error) {
      toast.error("Failed to sign out from devices");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleteLoading(true);

    try {
      setTimeout(() => {
        console.log("Account deletion requested");
        toast.success("Account deletion request submitted");
        setIsDeleteLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("Failed to delete account");
      setIsDeleteLoading(false);
    }
  };

  const passwordRules = validatePassword(passwordData.newPassword);

  return (
    <form className={styles.formContainer}>
      <div className={styles.formContainerWrapper}>
        <div className={styles.formContainerHeader}>
          <h1>Password</h1>
        </div>
        <div className={styles.formContainerInner}>
          <div className={styles.formInputContainer}>
            <label>Current password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••••••••"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>New password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••••••••••"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••••••••••••"
              className={styles.inputField}
            />
          </div>

          <div className={styles.passwordRules}>
            <h3>Rules for password</h3>
            <p>
              To create a new password, you have to meet all of the following
              requirements:
            </p>
            <ul>
              <li
                className={
                  passwordRules.minLength ? styles.ruleMet : styles.ruleNotMet
                }
              >
                Minimum 8 character
              </li>
              <li
                className={
                  passwordRules.hasSymbol ? styles.ruleMet : styles.ruleNotMet
                }
              >
                At least one special character
              </li>
              <li
                className={
                  passwordRules.hasNumber ? styles.ruleMet : styles.ruleNotMet
                }
              >
                At least one number
              </li>
              <li
                className={
                  passwordRules.notSameAsPrevious
                    ? styles.ruleMet
                    : styles.ruleNotMet
                }
              >
                Can't be the same as a previous password
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handlePasswordSubmit}
            className={`${styles.submitButton} ${
              isLoading ? styles.loading : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Update Password"}
          </button>
        </div>
      </div>

      <div className={styles.formProfleInner}>
        <div className={styles.formContainerHeader}>
          <h1>Devices</h1>
        </div>
        <div className={styles.formContainerInner}>
            <div className={styles.devicesList}>
            {devices.map((device, index) => (
              <div key={index} className={styles.deviceItem}>
                <h4>{device.name}</h4>
                <p>{device.lastActive}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSignOutAllDevices}
            className={styles.signOutButton}
          >
            <SignoutIcon className={styles.settingFooterIcon} />
            Sign out
          </button>
        
        </div>
        <div className={styles.formContainerHeader}>
          <h1>Delete Account</h1>
        </div>
        <div className={styles.formContainerInner}>
          <p>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className={`${styles.deleteButton} ${
              isDeleteLoading ? styles.loading : ""
            }`}
            disabled={isDeleteLoading}
          >
            <DeleteIcon className={styles.settingFooterIcon} />
            {isDeleteLoading ? <Loader /> : "Delete Account"}
          </button>
        </div>
      </div>
    </form>
  );
}
