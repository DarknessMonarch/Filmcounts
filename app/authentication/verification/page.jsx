"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/auth.module.css";
import { useState } from "react";
import authImage from "@/public/assets/authImage.png";
import { useRouter } from "next/navigation";

import {
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

export default function ResendVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const { resendEmailVerification } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await resendEmailVerification(formData.email);

      if (result.success) {
        toast.success("Verification email sent successfully! Check your inbox.");
        
        const emailSlug = btoa(formData.email);
      } else {
        toast.error(result.data?.message || result.error || "Failed to send verification email");
      }

    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("An error occurred while sending verification email");
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
          quality={100}
          sizes="100%"
          style={{
            objectFit: "cover",
          }}
          priority={true}
        />
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1>Resend Verification Code</h1>
            <p>Enter your email to resend the verification link</p>
          </div>

          <div className={styles.authInput}>
            <EmailIcon alt="email icon" className={styles.authIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className={styles.formFooter}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Resend Verification Email"}
            </button>

            <h3>
              Remember your password?{" "}
              <span
                className={styles.btnLogin}
                onClick={() => router.push("/authentication/login", { scroll: false })}
              >
                Login
              </span>
            </h3>
            
            <h3>
              Don't have an account?{" "}
              <span
                className={styles.btnLogin}
                onClick={() => router.push("/authentication/signup", { scroll: false })}
              >
                Sign Up
              </span>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}