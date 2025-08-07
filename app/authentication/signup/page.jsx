"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/auth.module.css";
import { useState, useEffect } from "react";
import authImage from "@/public/assets/authImage.png";
import { useRouter, useSearchParams } from "next/navigation";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import {
  FaRegUser as UserNameIcon,
  FaGoogle as GoogleIcon,
} from "react-icons/fa6";

import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

export default function SignUp() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const searchParams = useSearchParams();
  const { register } = useAuthStore();
  const router = useRouter();
  const [referral, setReferral] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "Individual",
  });

  useEffect(() => {
    const referralParam = searchParams.get("referral");
    if (referralParam) {
      setReferral(referralParam);
    }
  }, [searchParams]);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateUsername = (username) => {
    if (username.includes("@")) {
      toast.error("Username cannot be an email address");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate username on change
    if (name === "username") {
      validateUsername(value);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info("Google sign-up functionality will be implemented");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!validateUsername(formData.username)) {
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
      };

      if (referral) {
        userData.referredBy = referral;
      }

      const result = await register(userData);

      if (result.success) {
        toast.success("Account created successfully");
        handleRouting();
      } else {
        toast.error(result.data?.errors || "Registration failed");
      }

    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
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
            <h1>Welcome</h1>
            <p>Enter your email and password to sign up</p>
          </div>

          <div className={styles.authInput}>
            <UserNameIcon alt="username icon" className={styles.authIcon} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
            />
          </div>

          <div className={styles.authInput}>
            <EmailIcon alt="email icon" className={styles.authIcon} />
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
            <PasswordIcon alt="password icon" className={styles.authIcon} />
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
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword ? (
                <ShowPasswordIcon
                  alt="show password icon"
                  className={styles.authIcon}
                />
              ) : (
                <HidePasswordIcon
                  alt="hide password icon"
                  className={styles.authIcon}
                />
              )}
            </button>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon alt="password icon" className={styles.authIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showConfirmPassword ? (
                <ShowPasswordIcon
                  alt="show password icon"
                  className={styles.authIcon}
                />
              ) : (
                <HidePasswordIcon
                  alt="hide password icon"
                  className={styles.authIcon}
                />
              )}
            </button>
          </div>

          <div className={styles.termsContainer}>
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              required
            />
            <label
              onClick={() => router.push("/page/terms", { scroll: false })}
              htmlFor="terms"
            >
              Accept terms and conditions
            </label>
          </div>
          <div className={styles.formFooter}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Sign up"}
            </button>

            <h3>
              Already have an account?{" "}
              <span
                className={styles.btnLogin}
                onClick={() => router.push("login", { scroll: false })}
              >
                Login
              </span>
            </h3>

            <div>or</div>

            <button
              type="button"
              className={styles.googleSignUpButton}
              onClick={handleGoogleSignUp}
            >
              <GoogleIcon className={styles.googleIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}