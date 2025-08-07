"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/app/styles/navbar.module.css";
import Logo from "@/public/assets/logo.png";
import Coloredlogo from "@/public/assets/coloredlogo.png";
import ProfileImg from "@/public/assets/banner.png";
import { useAuthStore } from "@/app/store/Auth";

import { IoHomeSharp as HomeIcon, IoKey as LoginIcon } from "react-icons/io5";
import { FaUserCircle as SignUpIcon } from "react-icons/fa";
import { MdLogout as LogoutIcon, MdSettings as SettingsIcon } from "react-icons/md";
import { HiMiniUser as UserIcon } from "react-icons/hi2";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  
  const { user, isAuth, logout, tokens } = useAuthStore();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get user display name - prioritize username, fallback to email prefix
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.username) return user.username;
    
    // If no username, use the part before @ in email
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        router.push("/authentication/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      router.push("/authentication/login");
    }
  };

  const goToUserDashboard = () => {
    // Navigate to user dashboard - adjust this path based on your routing structure
    const userType = pathname.split("/")[2] || "user";
    router.push(`/page/${userType}/dashboard`);
  };

  const goToSettings = () => {
    const userType = pathname.split("/")[2] || "user";
    router.push(`/page/${userType}/settings`);
  };

  return (
    <div className={styles.navContainer}>
      <div className={styles.navWrapper}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.navLogo}>
            <Image
              src={isMobile ? Logo : Coloredlogo}
              alt="logo Image"
              height={30}
              className={styles.logoImage}
            />
          </Link>
        </div>
        <div className={styles.navRight}>
          <Link href="/" className={styles.navLink}>
            <div
              className={`${styles.innernavLink} ${
                pathname === "/" 
                  ? styles.activeLink
                  : ""
              }`}
            >
              <HomeIcon
                alt="home icon"
                aria-label="home icon"
                className={styles.linkIcon}
              />
              <h1>Home</h1>
            </div>
          </Link>

          {isAuth && user ? (
            // Show authenticated user menu
            <>
              <div className={styles.navLink} onClick={goToUserDashboard}>
                <div
                  className={`${styles.innernavLink} ${
                    pathname.includes("/dashboard")
                      ? styles.activeLink
                      : ""
                  }`}
                >
                  <div className={styles.userAvatarSmall}>
                    <Image
                      src={user.profileImage || ProfileImg}
                      height={20}
                      width={20}
                      alt={`${getUserDisplayName()}'s profile`}
                      className={styles.profileImgSmall}
                    />
                  </div>
                  <h1>{getUserDisplayName()}</h1>
                </div>
              </div>

              <div className={styles.navLink} onClick={goToSettings}>
                <div
                  className={`${styles.innernavLink} ${
                    pathname.includes("/settings")
                      ? styles.activeLink
                      : ""
                  }`}
                >
                  <SettingsIcon
                    alt="settings icon"
                    aria-label="settings icon"
                    className={styles.linkIcon}
                  />
                  <h1>Settings</h1>
                </div>
              </div>

              <div className={styles.navLink} onClick={handleLogout}>
                <div className={styles.innernavLink}>
                  <LogoutIcon
                    alt="logout icon"
                    aria-label="logout icon"
                    className={styles.linkIcon}
                  />
                  <h1>Logout</h1>
                </div>
              </div>
            </>
          ) : (
            // Show unauthenticated user menu
            <>
              <Link href="/authentication/signup" className={styles.navLink}>
                <div
                  className={`${styles.innernavLink} ${
                    pathname === "/authentication/signup" ||
                    pathname.startsWith("/authentication/signup")
                      ? styles.activeLink
                      : ""
                  }`}
                >
                  <SignUpIcon
                    alt="signup icon"
                    aria-label="signup icon"
                    className={styles.linkIcon}
                  />
                  <h1>Signup</h1>
                </div>
              </Link>
              <Link href="/authentication/login" className={styles.navLink}>
                <div
                  className={`${styles.innernavLink} ${
                    pathname === "/authentication/login" ||
                    pathname.startsWith("/authentication/login")
                      ? styles.activeLink
                      : ""
                  }`}
                >
                  <LoginIcon
                    alt="login icon"
                    aria-label="login icon"
                    className={styles.linkIcon}
                  />
                  <h1>Login</h1>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}