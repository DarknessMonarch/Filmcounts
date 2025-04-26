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
  } = useNotificationStore();

  const { isOpen, toggleDrawer } = useDrawerStore();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuth = true;
  const username = "Shaun";
  const profileImage = null;
  const userType = pathname.split("/")[2]; 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const  goToSettings = () => {
    router.push(`/page/${userType}/settings`);
  }

  const Title = decodeURIComponent(title)
  const Info = decodeURIComponent(info)

  return (
    <div>
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
            onClick={toggleNotificationPanel}
          >
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
          </div>

          {isAuth && (
            <div className={styles.userProfile} onClick={goToSettings}>
              <Image
                src={profileImage || ProfileImg}
                height={50}
                width={50}
                alt={`${username}'s profile`}
                priority
                className={styles.profileImg}
              />
              {!isMobile && (
                <div className={styles.userProfileInfo}>
                  <h1>{username}</h1>
                  <span>shaun@budgy.com</span>
                </div>
              )}
     
            </div>
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
        Content={<Notification />}
        IsOpen={isNotificationPanelOpen}
      />
    </div>
  );
}
