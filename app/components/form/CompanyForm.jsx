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
import { useCompanyStore } from "@/app/store/Company";

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

  // Company store integration
  const { 
    companies, 
    loading: companiesLoading, 
    addCompany, 
    getCompaniesForIndividual,
    getCompaniesByOrg 
  } = useCompanyStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAddCompany, setShowAddCompany] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  // Company form data
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyDescription: "",
    userType: "INDIVIDUAL"
  });

  const [formData, setFormData] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    description: "",
    companyId: "",
    budgeteer: "Budgeteer",
    userRole: "accountant",
  });

  // Load companies on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        // Load individual companies by default
        await getCompaniesForIndividual();
      } catch (error) {
        console.error("Failed to load companies:", error);
      }
    };
    
    loadCompanies();
  }, [getCompaniesForIndividual]);

  useEffect(() => {
    if (isEditMode && projectId) {
      if (projectId) {
        setFormData({
          projectName: "Sample Project",
          startDate: "2025-04-20",
          endDate: "2025-07-20",
          description: "This is a sample project description for editing.",
          companyId: "",
          budgeteer: "Budgeteer",
          userRole: "accountant",
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
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        userRole: selected.value,
      }));
    }
  };

  const handleCompanySelect = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        companyId: selected.value,
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "projectName", label: "Project Name" },
      { field: "startDate", label: "Start Date" },
      { field: "endDate", label: "End Date" },
      { field: "description", label: "Description" }
    ];
    
    for (const { field, label } of requiredFields) {
      if (!formData[field]) {
        toast.error(`${label} is required`);
        return false;
      }
    }

    return true;
  };

  const validateCompanyForm = () => {
    if (!companyData.companyName.trim()) {
      toast.error("Company name is required");
      return false;
    }
    return true;
  };

  const handleAddCompany = async () => {
    if (!validateCompanyForm()) return;

    setIsLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', companyData.companyName);
      formDataObj.append('desc', companyData.companyDescription);
      formDataObj.append('type', companyData.userType);
      
      if (logoFile) {
        formDataObj.append('company_logo', logoFile);
      }

      // Convert FormData to regular object for the store
      const companyPayload = {
        name: companyData.companyName,
        desc: companyData.companyDescription,
        type: companyData.userType
      };

      const result = await addCompany(companyPayload);
      
      if (result.success) {
        toast.success("Company created successfully");
        setShowAddCompany(false);
        setCompanyData({
          companyName: "",
          companyDescription: "",
          userType: "INDIVIDUAL"
        });
        setLogoFile(null);
        setLogoUrl(null);
        // Refresh companies list
        await getCompaniesForIndividual();
      } else {
        toast.error(result.error || "Failed to create company");
      }
    } catch (error) {
      console.error("Company creation error:", error);
      toast.error("Failed to create company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
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

  const toggleAddCompany = () => {
    setShowAddCompany(!showAddCompany);
    if (showAddCompany) {
      // Reset form when closing
      setCompanyData({
        companyName: "",
        companyDescription: "",
        userType: "INDIVIDUAL"
      });
      setLogoFile(null);
      setLogoUrl(null);
    }
  };

  const addUser = () => {
    toast.info("Add user functionality would open here");
  };

  // Convert companies to dropdown options
  const companyOptions = companies.map(company => ({
    value: company.id || company._id,
    label: company.companyName
  }));

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{`${isEditMode ? "Edit" : "Create"} Company`}</h1>
      </div>
      
      {showAddCompany && (
        <div className={styles.formContainer} style={{ marginBottom: '20px' }}>
          <div className={styles.formHeader}>
            <h2>Add New Company</h2>
          </div>
          <div className={styles.formContainerInner}>
            <div className={styles.formInputContainer}>
              <label>
                Company Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={companyData.companyName}
                onChange={handleCompanyChange}
                placeholder="Enter company name"
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.formInputContainer}>
              <label>Company Description</label>
              <textarea
                name="companyDescription"
                value={companyData.companyDescription}
                onChange={handleCompanyChange}
                placeholder="About the company"
                className={styles.textareaField}
                rows={3}
              />
            </div>

            <FileInput
              onChange={handleLogoUpload}
              image={logoUrl}
              label="Company Logo"
              required={false}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleAddCompany}
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Add Company"}
              </button>
              <button
                type="button"
                onClick={toggleAddCompany}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              <FormDropdown
                options={companyOptions}
                value={companyOptions.find(option => option.value === formData.companyId)}
                onSelect={handleCompanySelect}
                dropPlaceHolder={companiesLoading ? "Loading companies..." : "Select Company"}
                disabled={companiesLoading}
              />
              <button 
                type="button" 
                className={styles.addButton}
                onClick={toggleAddCompany}
              >
                <AddIcon className={styles.addIcon} aria-label="add company"  />
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
                <AddIcon className={styles.addIcon} aria-label="add user"  />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${
            isLoading ? styles.loading : ""
          }`}
          disabled={isLoading || showAddCompany}
        >
          {isLoading ? <Loader /> : `${isEditMode ? "Update" : "Create"} project`}
        </button>
      </form>
    </div>
  );
}