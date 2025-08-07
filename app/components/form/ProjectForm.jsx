"use client";

import Image from "next/image";
import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useState, useRef, useEffect } from "react";
import FormDropdown from "@/app/components/FormDropdown";
import { IoIosAdd as AddIcon } from "react-icons/io";
import { BsCameraFill as CameraIcon } from "react-icons/bs";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
      <label>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
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
            <CameraIcon
              className={styles.CameraIcon}
              alt="Upload Icon"
              width={30}
              height={30}
            />
            <p className={styles.uploadText}>
              Click to upload or drag and drop
              <br />
              SVG, PNG, JPG or GIF
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const userRoleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "accountant", label: "Accountant" },
];

export default function ProjectForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formType = searchParams.get("project") || "add";
  const projectId = searchParams.get("id");
  const isEditMode = formType === "edit";

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    description: "",
    company: "",
    budgeteer: "Budgeteer",
    userRole: "Accountant",
  });

  useEffect(() => {
    if (isEditMode && projectId) {
      if (projectId) {
        setFormData({
          projectName: "Sample Project",
          startDate: "2025-04-20",
          endDate: "2025-07-20",
          description: "This is a sample project description for editing.",
          company: "Sample Company",
          budgeteer: "Budgeteer",
          userRole: "Accountant",
        });
      }
    }
  }, [isEditMode, projectId]);

  const handleLogoUpload = (e) => {
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

    setLogoFile(file);
    const imageUrl = URL.createObjectURL(file);
    setLogoUrl(imageUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleChange = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        userRole: selected.value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["projectName", "startDate", "endDate", "description"];
    
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
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

      if (logoFile) {
        formDataObj.append("logo", logoFile);
      }

      setTimeout(() => {
        console.log("Form data submitted:", Object.fromEntries(formDataObj));
        toast.success(`Project ${isEditMode ? "updated" : "created"} successfully`);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to submit project");
      setIsLoading(false);
    }
  };

  const goBack = () => router.back();

  const addCompany = () => {
    toast.info("Add company functionality would open here");
  };

  const addUser = () => {
    toast.info("Add user functionality would open here");
  };

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{`${isEditMode ? "Edit" : "Create"} Project`}</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formInputContainer}>
            <label>
              Project Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
              className={`${styles.inputField} ${
                errors.projectName ? styles.errorInput : ""
              }`}
              required
            />
            {errors.projectName && (
              <span className={styles.errorText}>{errors.projectName}</span>
            )}
          </div>

          <div className={styles.formDateContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Start Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`${styles.inputField} ${
                  errors.startDate ? styles.errorInput : ""
                }`}
                required
              />
              {errors.startDate && (
                <span className={styles.errorText}>{errors.startDate}</span>
              )}
            </div>

            <div className={styles.formInputContainer}>
              <label>
                End Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`${styles.inputField} ${
                  errors.endDate ? styles.errorInput : ""
                }`}
                required
              />
              {errors.endDate && (
                <span className={styles.errorText}>{errors.endDate}</span>
              )}
            </div>
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="About the project"
              className={`${styles.textareaField} ${
                errors.description ? styles.errorInput : ""
              }`}
              rows={4}
              required
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>Company</label>
            <div className={styles.dropdownWithButtonContainer}>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Add a company"
                className={styles.inputField}
              />
              <button 
                type="button" 
                className={styles.addButton}
                onClick={addCompany}
              >
                <AddIcon className={styles.addIcon} aria-label="add icon"  />
              </button>
            </div>
          </div>

          <div className={styles.formInputContainer}>
            <label>Budgeteer</label>
            <input
              type="text"
              name="budgeteer"
              value={formData.budgeteer}
              onChange={handleChange}
              placeholder="Budgeteer"
              className={styles.inputField}
              disabled
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>User role</label>
            <div className={styles.dropdownWithButtonContainer}>
              <FormDropdown
                options={userRoleOptions}
                value={userRoleOptions.find(option => option.value === formData.userRole)}
                onSelect={handleRoleChange}
                dropPlaceHolder="Select Role"
              />
              <button 
                type="button" 
                className={styles.addButton}
                onClick={addUser}
              >
                <AddIcon className={styles.addIcon} aria-label="add icon"  />
              
              </button>
            </div>
          </div>

          <FileInput
            onChange={handleLogoUpload}
            image={logoUrl}
            label="Logo"
            required={false}
          />
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${
            isLoading ? styles.loading : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : `${isEditMode ? "Update" : "Create"} project`}
        </button>
      </form>
    </div>
  );
}