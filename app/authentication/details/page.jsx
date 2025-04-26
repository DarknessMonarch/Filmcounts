"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/auth.module.css";
import Dropdown from "@/app/components/Dropdown";
import Loader from "@/app/components/StateLoader";
import { MdOutlineCameraAlt as CameraIcon } from "react-icons/md";

import {
  FaRegUser as UserNameIcon,
} from "react-icons/fa6";
import {
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

export default function OrganizationSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizationLogo, setOrganizationLogo] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();
  

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    teamSize: "Small (1-10)"
  });

  const teamSizes = [
    { name: "Small (1-10)" },
    { name: "Medium (11-50)" },
    { name: "Large (51-200)" },
    { name: "Enterprise (201+)" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamSizeSelect = (teamSize) => {
    setFormData((prev) => ({ ...prev, teamSize: teamSize.name }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setOrganizationLogo(imageUrl);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.organizationName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!formData.organizationEmail.trim()) {
      toast.error("Organization email is required");
      return;
    }

    setIsLoading(true);

    try {
      // Replace with actual API call
      // const result = await registerOrganization(formData);
      
      // Simulating successful registration
      setTimeout(() => {
        toast.success("Organization registered successfully");
        router.push("/page/user/dashboard", { scroll: false });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.authComponent} ${styles.organizationSignUp}`}>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.authInput}>
          <UserNameIcon alt="username icon" className={styles.authIcon} />
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              placeholder="Organization name"
              required
            />
          </div>

          <div className={styles.authInput}>
            <EmailIcon alt="email icon" className={styles.authIcon} />
            <input
              type="email"
              name="organizationEmail"
              value={formData.organizationEmail}
              onChange={handleInputChange}
              placeholder="Organization email"
              required
            />
          </div>

          <div className={styles.authInput}>
            <Dropdown
              options={teamSizes}
              dropPlaceHolder="Team size"
              onSelect={handleTeamSizeSelect}
              defaultValue="Small (1-10)"
            />
          </div>

          <div className={styles.logoUploadSection}>
           <label htmlFor="file"> Organization logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <div className={styles.logoPreviewContainer} onClick={handleIconClick}>
              {organizationLogo ? (
                <Image
                  src={organizationLogo}
                  alt="Organization Logo"
                  className={styles.organizationLogo}
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              ) : (
                <div className={styles.uploadLogoPlaceholder}>
                  <CameraIcon className={styles.cameraIcon} />
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.formFooter}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}