"use client";

import Image from "next/image";
import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/settingsForm.module.css";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";


import { BsCameraFill as CameraIcon } from "react-icons/bs";


const FileInput = ({ onChange, image, label, required }) => {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className={styles.formInputWrapper}>
      <div
        className={`${styles.formChangeUpload} ${
          image ? styles.imageUploaded : ""
        }`}
        onClick={handleIconClick}
      >
        <input
          type="file"
          accept="image/*,.svg,.png,.jpg,.gif"
          onChange={onChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {image ? (
          <Image
            src={image}
            alt={`Uploaded ${label}`}
            className={styles.IdImage}
            fill
            sizes="100%"
            quality={100}
            objectFit="contain"
            priority
          />
        ) : (
          <div className={styles.uploadPlaceholder}>
            <CameraIcon className={styles.CameraIcon} aria-label="Upload" />
            <p>
              Click to upload or drag and drop
              <br />
              SVG, PNG, JPG or GIF
              <br />
              (max file size)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PersonalInfoForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileFile, setProfileFile] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    emailAddress: "",
    username: "",
    phoneNo: "",
    city: "",
    countryName: "",
    zipCode: "",
    bio: "",
  });

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Please upload only image files");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setProfileFile(file);
    const imageUrl = URL.createObjectURL(file);
    setProfileUrl(imageUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["fullName", "lastName", "emailAddress", "username"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formDataObj.append(key, String(value));
        }
      });

      if (profileFile) {
        formDataObj.append("profile", profileFile);
      }

      setTimeout(() => {
        console.log("Form data submitted:", Object.fromEntries(formDataObj));
        toast.success("Personal information updated successfully");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to update personal information");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formContainerWrapper}>
        <div className={styles.formContainerHeader}>
          <h1>Personal information</h1>
        </div>
        <div className={styles.formContainerInner}>
        <div className={styles.formInputInnerWrapper}>
          <div className={styles.formInputContainer}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`${styles.inputField} ${
                errors.fullName ? styles.errorInput : ""
              }`}
            />
            {errors.fullName && (
              <span className={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`${styles.inputField} ${
                errors.lastName ? styles.errorInput : ""
              }`}
            />
            {errors.lastName && (
              <span className={styles.errorText}>{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className={styles.formInputInnerWrapper}>
          <div className={styles.formInputContainer}>
            <label>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter email address"
              className={`${styles.inputField} ${
                errors.emailAddress ? styles.errorInput : ""
              }`}
            />
            {errors.emailAddress && (
              <span className={styles.errorText}>{errors.emailAddress}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter user name"
              className={`${styles.inputField} ${
                errors.username ? styles.errorInput : ""
              }`}
            />
            {errors.username && (
              <span className={styles.errorText}>{errors.username}</span>
            )}
          </div>
        </div>

        <div className={styles.formInputInnerWrapper}>
          <div className={styles.formInputContainer}>
            <label>Phone No</label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="Enter phone no"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.formInputInnerWrapper}>
          <div className={styles.formInputContainer}>
            <label>Country Name</label>
            <input
              type="text"
              name="countryName"
              value={formData.countryName}
              onChange={handleChange}
              placeholder="Enter country name"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>Zip code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Enter zip code"
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.formInputContainer}>
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Click here have writed"
            className={styles.textareaField}
            rows={4}
          />
        </div>
        <button
          type="submit"
          className={`${styles.submitButton} ${
            isLoading ? styles.loading : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Save Changes"}
        </button>
        </div>

      </div>
      <div className={styles.formProfleInner}>
        <div className={styles.formContainerHeader}>
          <h1>Change your profile</h1>
        </div>

        <FileInput
          onChange={handleProfileUpload}
          image={profileUrl}
          label="Pic"
          required={false}
        />
      </div>
    </form>
  );
}
