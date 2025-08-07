"use client";

import { toast } from 'sonner';
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/auth.module.css";
import authImage from "@/public/assets/authImage.png";
import { BsQrCode as VerificationIcon } from "react-icons/bs";

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  
  const router = useRouter();
  const params = useParams();
  const { verifyEmail, getUserOrganizations, isUserAdmin } = useAuthStore();

  useEffect(() => {
    // Extract token and code from slug
    // Format: /authentication/verification/68882065d3817a2bb9804bc1/13862
    const slug = params.slug;
    if (slug) {
      // Handle the slug as a single string that contains both token and code
      // Split by the last occurrence of forward slash to separate token and code
      const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
      const lastSlashIndex = slugStr.lastIndexOf('/');
      
      if (lastSlashIndex !== -1) {
        const extractedToken = slugStr.substring(0, lastSlashIndex);
        const extractedCode = slugStr.substring(lastSlashIndex + 1);
        setToken(extractedToken);
        setCode(extractedCode);
      } else {
        // Fallback: treat entire slug as token if no slash found
        setToken(slugStr);
      }
    }
  }, [params.slug]);

  const handleRouting = () => {
    const organizations = getUserOrganizations();
    
    // Check if user has admin roles
    if (isUserAdmin()) {
      router.push("/page/admin/overview");
      return;
    }
    
    // Check if user has organizations
    if (organizations && organizations.length > 0) {
      // If multiple organizations, show selection page
      if (organizations.length > 1) {
        router.push("/authentication/account");
        return;
      }
      
      // Single organization - redirect directly
      const org = organizations[0].organization;
      const orgSlug = org.name?.toLowerCase().replace(/\s+/g, '-');
      router.push(`/page/organization/${orgSlug}/dashboard`);
      return;
    }
    
    // Individual user with no organizations
    router.push("/page/user/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    if (!token) {
      toast.error("Invalid verification link");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(token, verificationCode);

      if (result.success) {
        toast.success(result.data?.message || "Email verified successfully");
        // Route user to appropriate dashboard after successful verification
        handleRouting();
      } else {
        toast.error(result.data?.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification");
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
            <h1>Verify your account</h1>
            <p>Enter the 6-digit verification code sent to your email</p>
          </div>
          
          <div className={styles.authInput}>
            <VerificationIcon
              className={styles.authIcon}
              alt="Verification code icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="verificationCode"
              id="verificationCode"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.trim())}
              maxLength={6}
              required
              pattern="[0-9]{6}"
              title="Verification code must be exactly 6 digits"
            />
          </div>
          
          <div className={styles.authBottomBtn}>
            <button
              type="submit"
              disabled={isLoading || !token}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Verify your account"}
            </button>
          </div>

          <div className={styles.formFooter}>
            <h3>
              Need help?{" "}
              <span
                className={styles.btnLogin}
                onClick={() => router.push("/authentication/login")}
              >
                Back to Login
              </span>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}