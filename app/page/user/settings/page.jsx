"use client";

import { toast } from "sonner";
import Image from "next/image";
import Loader from "@/app/components/StateLoader";
import { useAuthStore } from "@/app/store/Auth";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/styles/settings.module.css";
import ProfileImg from "@/public/assets/banner.png";
import UserForm from "@/app/components/form/UserForm";
import SettingForm from "@/app/components/form/SettingForm";
import NotificationForm from "@/app/components/form/NotificationForm";
import ProfileBannerImg from "@/public/assets/profileBanner.png";
import { useState, useEffect, useRef } from "react";

import {
  MdModeEdit as EditIcon,
} from "react-icons/md";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";

export default function Settings() {
  const {
    email,
    username,
    profileImage,
    bannerImage,
    updateProfileImage,
  } = useAuthStore();

  const [loadingStates, setLoadingStates] = useState({
    imageUpload: false,
    bannerUpload: false,
  });
  
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current section from URL params, default to 'User'
  const currentNavSection = searchParams.get('navSection') || 'User';

  // Automatically set navSection=User when page first loads without query param
  useEffect(() => {
    if (!searchParams.get('navSection')) {
      const currentUrl = window.location.pathname;
      const newUrl = new URL(currentUrl, window.location.origin);
      newUrl.searchParams.set('navSection', 'User');
      router.replace(newUrl.toString());
    }
  }, [searchParams, router]);

  const setLoadingState = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const navigationItems = [
    {
      title: 'Profile',
      items: [
        { key: 'User', label: 'User' }
      ]
    },
    {
      title: 'Account',
      items: [
        { key: 'Notification', label: 'Notification' }
      ]
    },
    {
      title: 'Security',
      items: [
        { key: 'Settings', label: 'Settings' }
      ]
    }
  ];

  // Find which dropdown should be open based on current selection
  const getOpenDropdown = () => {
    for (const group of navigationItems) {
      if (group.items.some(item => item.key === currentNavSection)) {
        return group.title;
      }
    }
    return 'Profile'; // Default to Profile if no match
  };

  const [openDropdown, setOpenDropdown] = useState(getOpenDropdown());

  // Update open dropdown when navSection changes
  useEffect(() => {
    setOpenDropdown(getOpenDropdown());
  }, [currentNavSection]);

  const handleNavClick = (navSection) => {
    const currentUrl = window.location.pathname;
    const newUrl = new URL(currentUrl, window.location.origin);
    newUrl.searchParams.set('navSection', navSection);
    router.push(newUrl.toString());
  };

  const toggleDropdown = (title) => {
    // If clicking on the currently open dropdown, close it
    if (openDropdown === title) {
      setOpenDropdown(null);
    } else {
      // Close any open dropdown and open the clicked one
      setOpenDropdown(title);
    }
  };

  const isDropdownOpen = (title) => {
    return openDropdown === title;
  };

  const isItemActive = (itemKey) => {
    return currentNavSection === itemKey;
  };

  const handleImageUpload = async (e, type = "profile") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please upload an image smaller than 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const loadingKey = type === "banner" ? "bannerUpload" : "imageUpload";
        setLoadingState(loadingKey, true);
        try {
          const response = await updateProfileImage(base64Image, type);
          if (response.success) {
            toast.success(
              `${
                type === "banner" ? "Banner" : "Profile"
              } image updated successfully`
            );
          } else {
            toast.error(response.message || `Failed to update ${type} image`);
          }
        } catch (error) {
          toast.error(`An error occurred while updating ${type} image`);
        } finally {
          setLoadingState(loadingKey, false);
        }
      };
    }
  };

  const handleBannerUpload = (e) => {
    handleImageUpload(e, "banner");
  };

  const renderContent = () => {
    switch (currentNavSection) {
      case 'User':
        return (
         <UserForm/> 
        );
      case 'Notification':
        return (
        <NotificationForm/>
        );
      case 'Settings':
        return (
         <SettingForm/>
        );
      default:
        return (
          <UserForm/>
        );
    }
  };

  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingBanner}>
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          ref={bannerInputRef}
          style={{ display: "none" }}
        />
        <div
          className={styles.bannerImageContainer}
          onClick={() => bannerInputRef.current?.click()}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <Image
            className={styles.bannerImage}
            src={bannerImage || ProfileBannerImg}
            alt="banner image"
            fill
            sizes="100%"
            quality={100}
            style={{
              objectFit: "cover",
            }}
            priority={true}
          />
          <div className={styles.bannerEditIcon}>
            {loadingStates.bannerUpload ? (
              <Loader />
            ) : (
              <EditIcon className={styles.editIcon} alt="Edit Banner" />
            )}
          </div>
        </div>
      </div>

      <div className={styles.settingWrap}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "profile")}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className={styles.profileSection}>
          <div className={styles.profileImageContain}>
            <Image
              src={profileImage || ProfileImg}
              alt={username}
              className={styles.profileImage}
              fill
              sizes="100%"
              quality={100}
              style={{
                objectFit: "cover",
              }}
              priority={true}
            />
            <div
              className={styles.uploadEditIcon}
              onClick={() => fileInputRef.current?.click()}
            >
              {loadingStates.imageUpload ? (
                <Loader />
              ) : (
                <EditIcon className={styles.editProfileIcon} alt="Edit Icon" />
              )}
            </div>
          </div>
          <div className={styles.profileDetails}>
            <h1>{username}</h1>
            <span>{email}</span>
          </div>
        </div>
      </div>

      <div className={styles.settingWrapinfo}>
        <div className={styles.settingNav}>
          {navigationItems.map((navGroup) => (
            <div key={navGroup.title} className={styles.navGroup}>
              <div 
                className={`${styles.navGroupTitle} ${
                  isDropdownOpen(navGroup.title) ? styles.navGroupTitleActive : ''
                }`}
                onClick={() => toggleDropdown(navGroup.title)}
              >
                <span>{navGroup.title}</span>
                <DropdownIcon 
                  className={`${styles.dropdownIcon} ${
                    isDropdownOpen(navGroup.title) ? styles.rotated : ''
                  }`}
                />
              </div>
              
              {isDropdownOpen(navGroup.title) && (
                <div className={styles.navItems}>
                  {navGroup.items.map((item) => (
                    <div
                      key={item.key}
                      className={`${styles.navItem} ${
                        isItemActive(item.key) ? styles.active : ''
                      }`}
                      onClick={() => handleNavClick(item.key)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.settingContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}