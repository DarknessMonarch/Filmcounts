"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Popup from "@/app/components/Popup";
import ProfileImg from "@/public/assets/banner.png";
import styles from "@/app/styles/desknav.module.css";
import { useRouter, usePathname } from "next/navigation";
import Notification from "@/app/components/Notification";
import { useNotificationStore } from "@/app/store/Notification";
import { useAuthStore } from "@/app/store/Auth"; 

import {
  HiMiniUser as UserIcon,
} from "react-icons/hi2";

import { MdLogout as LogoutIcon } from "react-icons/md";
import {
  IoMdNotifications as NotificationActiveIcon,
  IoMdNotificationsOff as NotificationOffIcon,
} from "react-icons/io";
import { TbMenu3 as MenuIcon } from "react-icons/tb";
import { useDrawerStore } from "@/app/store/Drawer";

export default function DeskNavbar({ title, info }) {
  const {
    isNotificationEnabled,
    isNotificationPanelOpen,
    toggleNotificationEnable,
    toggleNotificationPanel,
    closeNotificationPanel,
    fetchNotificationsIfStale,
    getUnreadCount,
    clearNotificationData,
  } = useNotificationStore();

  const { isOpen, toggleDrawer } = useDrawerStore();
  
  const { user, isAuth, logout, tokens } = useAuthStore();
  
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const userType = pathname.split("/")[2];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuth && tokens?.accessToken) {
      fetchNotificationsIfStale(tokens.accessToken);
    }
  }, [isAuth, tokens?.accessToken, fetchNotificationsIfStale]);

  useEffect(() => {
    if (!isAuth) {
      clearNotificationData();
    }
  }, [isAuth, clearNotificationData]);

  const goToSettings = () => {
    router.push(`/page/${userType}/settings`);
  };

  const goToLogin = () => {
    router.push("/authentication/login");
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        clearNotificationData();
        router.push("/authentication/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      clearNotificationData();
      router.push("/authentication/login");
    }
  };

  const handleNotificationClick = () => {
    if (isAuth) {
      toggleNotificationPanel();
    } else {
      router.push("/authentication/login");
    }
  };

  const Title = decodeURIComponent(title);
  const Info = decodeURIComponent(info);

  const unreadCount = getUnreadCount();

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

  // Get user organizations for potential role-based features
  const getUserOrganizations = () => {
    return user?.organizations || [];
  };

  // Check if user has admin role in any organization
  const isUserAdmin = () => {
    const organizations = getUserOrganizations();
    return organizations.some(org => 
      org.roles && org.roles.some(role => 
        role === "ADMIN" || role === "ADMINISTRATOR"
      )
    );
  };

  if (pathname.endsWith("/settings")) {
    return (
      <>
        <div className={styles.navbarSettings}>
          <div
            className={styles.notificationButton}
            onClick={handleNotificationClick}
          >
            <div className={styles.notificationIconWrapper}>
              {isNotificationEnabled ? (
                <NotificationActiveIcon
                  aria-label="notifications active"
                  className={styles.notificationIcon}
                />
              ) : (
                <NotificationOffIcon
                  aria-label="notifications off"
                  className={styles.notificationIcon}
                />
              )}
              {isAuth && unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </div>
          </div>
        </div>

        <Popup
          Width={500}
          OnClose={closeNotificationPanel}
          Top={isMobile ? 0 : 80}
          Blur={5}
          Right={isMobile ? 0 : 10}
          Zindex={isMobile ? 9999 : 999}
          BorderRadiusTopLeft={15}
          BorderRadiusBottomRight={15}
          BorderRadiusBottomLeft={15}
          Content={<Notification accessToken={tokens?.accessToken} />}
          IsOpen={isNotificationPanelOpen && isAuth}
        />
      </>
    );
  }

  return (
    <>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          {isMobile ? (
            <div className={styles.navmenu} onClick={toggleDrawer}>
              <MenuIcon aria-label="menu" className={styles.menuIcon} />
            </div>
          ) : (
            <div className={styles.navLeftInfo}>
              <h1>{Title}</h1>
              <p>{Info}</p>
            </div>
          )}
        </div>

        <div className={styles.navRight}>
          <div
            className={styles.notificationButton}
            onClick={handleNotificationClick}
          >
            <div className={styles.notificationIconWrapper}>
              {isNotificationEnabled ? (
                <NotificationActiveIcon
                  aria-label="notifications active"                               
                  className={styles.notificationIcon}
                />
              ) : (
                <NotificationOffIcon
                  aria-label="notifications off"
                  className={styles.notificationIcon}
                />
              )}
              {isAuth && unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </div>
          </div>

          {isAuth && user ? (
            <div className={styles.userProfile}>
              <div onClick={goToSettings} className={styles.profileSection}>
                <Image
                  src={user.profileImage || ProfileImg}
                  height={50}
                  width={50}
                  alt={`${getUserDisplayName()}'s profile`}
                  priority
                  className={styles.profileImg}
                />
                {!isMobile && (
                  <div className={styles.userProfileInfo}>
                    <h1>{getUserDisplayName()}</h1>
                    <span>{user.email}</span>
                    {user.phone_number && (
                      <small className={styles.phoneNumber}>{user.phone_number}</small>
                    )}
                  </div>
                )}
              </div>
              {!isMobile && (
                <button 
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  aria-label="Logout"
                >
                  <LogoutIcon className={styles.authIcon} aria-label="Logout" />
                </button>
              )}
            </div>
          ) : (
              <button 
                onClick={goToLogin}
                className={styles.loginButton}
              >
                <UserIcon className={styles.authIcon} aria-label="Login" />
              </button> 
         
          )}
        </div>
      </div>
      <Popup
        Width={500}
        OnClose={closeNotificationPanel}
        Top={isMobile ? 0 : 100}
        Blur={5}
        Right={isMobile ? 0 : 250}
        Zindex={isMobile ? 9999 : 999}
        BorderRadiusTopLeft={15}
        BorderRadiusBottomRight={15}
        BorderRadiusBottomLeft={15}
        Content={<Notification accessToken={tokens?.accessToken} />}
        IsOpen={isNotificationPanelOpen && isAuth}
      />
    </>
  );
}