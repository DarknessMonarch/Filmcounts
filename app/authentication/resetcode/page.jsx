"use client";

import { toast } from 'sonner';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/auth.module.css";
import authImage from "@/public/assets/authImage.png";
import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function ResetCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while requesting password reset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.authImage}
          src={authImage}
          alt="auth image"
          fill
          sizes="100%"
          quality={100}
          style={{
            objectFit: "cover",
          }}
          priority={true}
        />
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
    
          <div className={styles.formHeader}>
            <h1>Reset password</h1>
            <p>Enter your email to get the reset link</p>
          </div>

          <div className={styles.authInput}>
            <EmailIcon
              className={styles.authIcon}
              alt="Email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email"
            />
          </div>
          <div className={styles.formFooter}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Request code"}
          </button>
          <h3>
          Remembered your password?{" "}
            <div
              className={styles.btnLogin}
              onClick={() => router.push("login")}
            >
              Login
            </div>
          </h3>
          </div>
        </form>
      </div>
    </div>
  );
}
