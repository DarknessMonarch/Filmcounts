"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import Loader from "@/app/components/StateLoader";
import authImage from "@/public/assets/authImage.png";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { FaRegUser as UserNameIcon, FaGoogle as GoogleIcon, } from "react-icons/fa6";
import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const { login } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRouting = () => {
    const { getUserOrganizations, isUserAdmin } = useAuthStore.getState();
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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        toast.success("Login successful");
        handleRouting();
      } else {
        toast.error(result.data?.errors || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info("Google sign-up functionality will be implemented");
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
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1>Welcome back</h1>
            <p>Enter your email and password to login</p>
          </div>

          <div className={styles.authInput}>
            <UserNameIcon className={styles.authIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </button>
          </div>

          <div className={styles.formChange}>
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">Accept terms and conditions</label>
            </div>
            <span onClick={() => router.push("resetcode")}>
              Forgot Password?
            </span>
          </div>
          
          <div className={styles.formFooter}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.formAuthButton} ${
                isLoading ? styles.activeFormAuthButton : ""
              }`}
            >
              {isLoading ? <Loader /> : "Login"}
            </button>

            <h3>
              Don&apos;t have an account?{" "}
              <div
                className={styles.btnLogin}
                onClick={() => router.push("signup")}
              >
                Signup
              </div>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}