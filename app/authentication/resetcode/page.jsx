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
  const router = useRouter();
  const { sendForgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendForgotPassword({ email: email.trim() });

      if (result.success) {
        toast.success(result.data?.message || "Password reset link sent to your email");
        // Optional: redirect to login or stay on page
        setTimeout(() => {
          router.push("/authentication/login");
        }, 2000);
      } else {
        toast.error(result.data?.message || "Failed to send password reset link");
      }
    } catch (error) {
      console.error("Password reset error:", error);
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
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
              <span
                className={styles.btnLogin}
                onClick={() => router.push("/authentication/login")}
              >
                Login
              </span>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}