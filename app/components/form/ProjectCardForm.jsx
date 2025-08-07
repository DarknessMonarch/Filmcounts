"use client";

import Image from "next/image";
import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import InputDropdown from "@/app/components/InputDropdown";
import styles from "@/app/styles/form.module.css";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BsCameraFill as CameraIcon } from "react-icons/bs";
import { useUserManagementStore } from "@/app/store/UserManagement"; // Import your store

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
            <CameraIcon className={styles.CameraIcon} />
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

export default function ProjectCardForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formType = searchParams.get("project") || "add";
  const projectId = searchParams.get("id");
  const isEditMode = formType === "edit";
  
  // Check if this is an organization route
  const isOrganizationRoute = pathname.includes("/organization/");
  
  // Get organizations from user management store
  const { organizations } = useUserManagementStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  // User roles options
  const userRoles = [
    { id: 1, name: "Admin", value: "admin" },
    { id: 2, name: "Manager", value: "manager" },
    { id: 3, name: "Developer", value: "developer" },
    { id: 4, name: "Designer", value: "designer" },
    { id: 5, name: "Analyst", value: "analyst" },
    { id: 6, name: "Tester", value: "tester" }
  ];

  const [formData, setFormData] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    description: "",
    amount: 50000, 
    status: "pending",
    createdAt: new Date().toLocaleDateString(),
    // Organization-specific fields
    company: null,
    userRole: null,
    team: [
      {
        id: 1,
        name: "Current User",
        image: null 
      }
    ]
  });

  useEffect(() => {
    if (isEditMode && projectId) {
      setFormData(prev => ({
        ...prev,
        projectName: "Sample Project",
        startDate: "2025-04-20",
        endDate: "2025-07-20",
        description: "This is a sample project description for editing.",
        amount: 75000,
        status: "approved",
        // Sample organization data for edit mode
        company: isOrganizationRoute && organizations.length > 0 ? organizations[0] : null,
        userRole: isOrganizationRoute ? userRoles[0] : null
      }));
      
    } else {
      setFormData(prev => ({
        ...prev,
        projectName: "",
        startDate: "",
        endDate: "",
        description: "",
        amount: 50000,
        status: "pending",
        createdAt: new Date().toLocaleDateString(),
        company: null,
        userRole: null
      }));
      setLogoUrl(null);
      setLogoFile(null);
    }
  }, [isEditMode, projectId, isOrganizationRoute, organizations, userRoles]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    setLogoUrl(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCompanySelect = (company) => {
    setFormData((prev) => ({ ...prev, company }));
    if (errors.company) {
      setErrors((prev) => ({ ...prev, company: null }));
    }
  };

  const handleUserRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, userRole: role }));
    if (errors.userRole) {
      setErrors((prev) => ({ ...prev, userRole: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["projectName", "startDate", "endDate", "description"];
    
    // Add organization-specific required fields
    if (isOrganizationRoute) {
      requiredFields.push("company", "userRole");
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        let fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
        if (field === "userRole") fieldName = "User Role";
        newErrors[field] = `${fieldName} is required`;
      }
    });

    // Validate that end date is after start date
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

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
        if (key === 'team') {
          formDataObj.append(key, JSON.stringify(value));
        } else if (key === 'company' || key === 'userRole') {
          // Handle object values for dropdowns
          if (value) {
            formDataObj.append(key, JSON.stringify(value));
          }
        } else if (value !== null && value !== undefined) {
          formDataObj.append(key, value);
        }
      });

      if (logoFile) {
        formDataObj.append("logo", logoFile);
      }

      setTimeout(() => {
        console.log("Form submitted:", Object.fromEntries(formDataObj));
        console.log("Form data object:", formData);
        toast.success(`Project ${isEditMode ? "updated" : "created"} successfully!`);
        setIsLoading(false);
        router.push(window.location.pathname); 
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} project`);
      setIsLoading(false);
    }
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
                min={formData.startDate} 
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

          {/* Organization-specific fields */}
          {isOrganizationRoute && (
            <>
              <div className={styles.formInputContainer}>
                <label>
                  Company <span className={styles.required}>*</span>
                </label>
                <InputDropdown
                  options={organizations}
                  value={formData.company}
                  onSelect={handleCompanySelect}
                  dropPlaceHolder="Company"
                  nameKey="name"
                  valueKey="id"
                  showAddButton={true}
                  addButtonText="Add company"
                />
                {errors.company && (
                  <span className={styles.errorText}>{errors.company}</span>
                )}
              </div>

              <div className={styles.formInputContainer}>
                <label>
                  User Role <span className={styles.required}>*</span>
                </label>
                <InputDropdown
                  options={userRoles}
                  value={formData.userRole}
                  onSelect={handleUserRoleSelect}
                  dropPlaceHolder="User role"
                  nameKey="name"
                  valueKey="value"
                  showAddButton={true}
                  addButtonText="Add role"
                />
                {errors.userRole && (
                  <span className={styles.errorText}>{errors.userRole}</span>
                )}
              </div>
            </>
          )}

          <FileInput
            onChange={handleLogoUpload}
            image={logoUrl}
            label="Project Logo"
            required={false}
          />
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : `${isEditMode ? "Update" : "Create"} Project`}
        </button>
      </form>
    </div>
  );
}