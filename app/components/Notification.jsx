"use client";

import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/styles/notification.module.css";
import NotificationImg from "@/public/assets/notification.png";
import { useNotificationStore } from "@/app/store/Notification";
import { MdDelete as DeleteIcon } from "react-icons/md";
import {
  FaBell as ActiveNotificationIcon,
  FaBellSlash as InactiveNotificationIcon,
} from "react-icons/fa";

export default function NotificationPage() {
  const {
    isNotificationEnabled,
    notifications,
    toggleNotificationEnable,
    markAllAsRead,
    unmarkAllAsRead,
    removeNotification,
  } = useNotificationStore();

  const [isMarkReadMode, setIsMarkReadMode] = useState(false);
  const audioRef = useRef(null);

  const NotificationIcon = isNotificationEnabled
    ? ActiveNotificationIcon
    : InactiveNotificationIcon;

  useEffect(() => {
    const unreadNotifications = notifications.filter((notif) => !notif.read);
    if (unreadNotifications.length > 0) {
      toast.info(
        `You have ${unreadNotifications.length} unread notification${
          unreadNotifications.length > 1 ? "s" : ""
        }`
      );
    }
    setIsMarkReadMode(unreadNotifications.length > 0);
  }, [notifications]);

  useEffect(() => {
    const handleNewNotification = () => {
      if (isNotificationEnabled) {
        toast.info("You have a new notification", {
          duration: 5000,
        });
        audioRef.current?.play();
      }
    };

    window.addEventListener("newNotification", handleNewNotification);
    return () => {
      window.removeEventListener("newNotification", handleNewNotification);
    };
  }, [isNotificationEnabled]);

  const handleMarkReadToggle = () => {
    if (isMarkReadMode) {
      markAllAsRead();
      toast.success("All notifications marked as read");
    } else {
      unmarkAllAsRead();
      toast.success("All notifications unmarked as read");
    }
    setIsMarkReadMode((prev) => !prev);
  };

  const handleDeleteNotification = (id) => {
    removeNotification(id);
    toast.success("Notification removed");
  };

  const handleSwipe = (e, id) => {
    const startX = e.touches[0].clientX;
    let moved = false;

    const onMove = (moveEvent) => {
      const deltaX = moveEvent.touches[0].clientX - startX;
      if (deltaX < -100) {
        moved = true;
        handleDeleteNotification(id);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      }
    };

    const onEnd = () => {
      if (!moved) {
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      }
    };

    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
  };

  const notificationData =
    notifications.length > 0
      ? notifications
      : [
          {
            id: 1,
            name: "Security Update",
            message: "You have generated an access token for MinIO storage",
            read: false,
            timestamp: "Today at 8:42 AM",
          },
          {
            id: 1,
            name: "Security Update",
            message: "You have generated an access token for MinIO storage",
            read: false,
            timestamp: "Today at 8:42 AM",
          },
          {
            id: 1,
            name: "Security Update",
            message: "You have generated an access token for MinIO storage",
            read: false,
            timestamp: "Today at 8:42 AM",
          },
          {
            id: 1,
            name: "Security Update",
            message: "You have generated an access token for MinIO storage",
            read: false,
            timestamp: "Today at 8:42 AM",
          },
          {
            id: 2,
            name: "Alert",
            message: "Approve Requisition For Chicken Project",
            read: false,
            actionRequired: true,
            timestamp: "Today at 9:42 AM",
          },
          {
            id: 2,
            name: "Alert",
            message: "Approve Requisition For Chicken Project",
            read: false,
            actionRequired: true,
            timestamp: "Today at 9:42 AM",
          },
          {
            id: 2,
            name: "Alert",
            message: "Approve Requisition For Chicken Project",
            read: false,
            actionRequired: true,
            timestamp: "Today at 9:42 AM",
          },
          {
            id: 2,
            name: "Alert",
            message: "Approve Requisition For Chicken Project",
            read: false,
            actionRequired: true,
            timestamp: "Today at 9:42 AM",
          },
        ];

  return (
    <div className={styles.notificationComponent}>
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />

      <div className={styles.notificationHeader}>
        <h1>Notifications</h1>
        <p onClick={handleMarkReadToggle}>
          {isMarkReadMode ? "Mark all as read" : "Unmark all as read"}
        </p>
      </div>

      <div
        className={`${styles.alertNotificationComponent} ${
          isNotificationEnabled ? styles.enableContainer : ""
        }`}
      >
        <div className={styles.alertNotification}>
          <div className={styles.alertContainer}>
            <NotificationIcon
              className={styles.notificationIcon}
              aria-label={
                isNotificationEnabled
                  ? "notifications enabled"
                  : "notifications disabled"
              }
            />
            <div className={styles.alertInfo}>
              <h1>
                {isNotificationEnabled
                  ? "Push Notifications Enabled"
                  : "Push Notifications Disabled"}
              </h1>
              <p>
                {isNotificationEnabled
                  ? "Automatically get notifications"
                  : "No notifications will be received"}
              </p>
            </div>
          </div>
          <div
            className={`${styles.toggleNotification} ${
              !isNotificationEnabled ? styles.moveDot : ""
            }`}
            onClick={toggleNotificationEnable}
            role="switch"
            aria-checked={isNotificationEnabled}
          >
            <div className={styles.toggleDot}></div>
          </div>
        </div>
      </div>

      <div className={styles.lineNotification}></div>

      <div className={styles.notificationAreaComponent}>
        {notificationData.length > 30 ? (
          notificationData.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationArea} ${
                notification.read
                  ? styles.readNotification
                  : styles.unreadNotification
              }`}
              onTouchStart={(e) => handleSwipe(e, notification.id)}
            >
              <div className={styles.notificationInfo}>
                <div className={styles.notificationInfoHeader}>
                  <div className={styles.notificationText}>
                    <h1>{notification.name}</h1>
                    <p>{notification.message}</p>
                    {notification.actionRequired && (
                      <button className={styles.approveButton}>
                        Approve now
                      </button>
                    )}
                  </div>
                  {!notification.read && (
                    <div className={styles.notificationDot}></div>
                  )}
                </div>
                <div className={styles.notificationFooter}>
                  <span className={styles.notificationTime}>
                    {notification.timestamp ||
                      `Today at ${new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                  </span>
                  <DeleteIcon
                    aria="delete icon"
                    aria-label="delete icon"
                    className={styles.deleteIcon}
                    onClick={() => handleDeleteNotification(notification.id)}
                  />
                
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noNotificationArea}>
            <Nothing
              NothingImage={NotificationImg}
              Text="No Notifications"
              Alt="no notification"
            />
          </div>
        )}
      </div>
    </div>
  );
}
