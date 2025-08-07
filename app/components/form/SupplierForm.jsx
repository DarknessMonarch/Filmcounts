"use client";

import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useState, useEffect } from "react";
import FormDropdown from "@/app/components/FormDropdown";
import { IoIosAdd as AddIcon, IoIosClose as CloseIcon } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupplierStore } from "@/app/store/Supplier";

const supplierTypeOptions = [
  { value: "Smart phones", label: "Smart phones" },
  { value: "Smart phone accessories", label: "Smart phone accessories" },
  { value: "Computers", label: "Computers" },
  { value: "Computer accessories", label: "Computer accessories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Office supplies", label: "Office supplies" },
  { value: "Clothing", label: "Clothing" },
  { value: "Food & Beverages", label: "Food & Beverages" },
  { value: "Construction materials", label: "Construction materials" },
];

export default function SupplierForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("type") || "add";
  const supplierId = searchParams.get("id");
  const organizationId = searchParams.get("orgId"); // For organization suppliers
  const isEditMode = formType === "edit";

  // Supplier store integration
  const { 
    suppliers,
    loading: suppliersLoading, 
    addSupplier,
    updateSupplier,
    getSuppliersByOrg,
    getIndividualSuppliers
  } = useSupplierStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [newTypeInput, setNewTypeInput] = useState("");
  const [showAddType, setShowAddType] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    location: "",
    description: "",
    organizationId: organizationId || null, // null for individual suppliers
  });

  // Load suppliers on component mount if in edit mode
  useEffect(() => {
    if (isEditMode && supplierId) {
      // Find supplier from store or load from API
      const existingSupplier = suppliers.find(s => s.id === supplierId);
      if (existingSupplier) {
        setFormData({
          name: existingSupplier.name || "",
          phoneNumber: existingSupplier.phoneNumber || "",
          email: existingSupplier.email || "",
          location: existingSupplier.location || "",
          description: existingSupplier.description || "",
          organizationId: existingSupplier.organizationId || null,
        });
        setSelectedTypes(existingSupplier.types || []);
      } else {
        // Load suppliers if not in store
        const loadSuppliers = async () => {
          try {
            if (organizationId) {
              await getSuppliersByOrg(organizationId);
            } else {
              await getIndividualSuppliers();
            }
          } catch (error) {
            console.error("Failed to load suppliers:", error);
          }
        };
        loadSuppliers();
      }
    }
  }, [isEditMode, supplierId, organizationId, suppliers, getSuppliersByOrg, getIndividualSuppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeSelect = (selected) => {
    if (selected && !selectedTypes.includes(selected.value)) {
      setSelectedTypes((prev) => [...prev, selected.value]);
    }
  };

  const removeType = (typeToRemove) => {
    setSelectedTypes((prev) => prev.filter(type => type !== typeToRemove));
  };

  const addCustomType = () => {
    const trimmedType = newTypeInput.trim();
    if (trimmedType && !selectedTypes.includes(trimmedType)) {
      setSelectedTypes((prev) => [...prev, trimmedType]);
      setNewTypeInput("");
      setShowAddType(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { field: "name", label: "Supplier Name" },
      { field: "phoneNumber", label: "Phone Number" },
      { field: "email", label: "Email" },
      { field: "location", label: "Location" }
    ];
    
    // Check required fields
    for (const { field, label } of requiredFields) {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${label} is required`;
      }
    }

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate phone number (basic validation)
    if (formData.phoneNumber && !/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Validate at least one type is selected
    if (selectedTypes.length === 0) {
      newErrors.types = "Please select at least one supplier type";
    }

    setErrors(newErrors);
    
    // Show first error as toast
    const firstError = Object.values(newErrors)[0];
    if (firstError) {
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const supplierPayload = {
        ...formData,
        types: selectedTypes,
      };

      // Remove organizationId if null (for individual suppliers)
      if (!supplierPayload.organizationId) {
        delete supplierPayload.organizationId;
      }

      let result;
      if (isEditMode) {
        result = await updateSupplier(supplierId, supplierPayload);
      } else {
        result = await addSupplier(supplierPayload);
      }
      
      if (result.success) {
        toast.success(result.message || `Supplier ${isEditMode ? "updated" : "created"} successfully`);
        
        // Reset form if creating new supplier
        if (!isEditMode) {
          setFormData({
            name: "",
            phoneNumber: "",
            email: "",
            location: "",
            description: "",
            organizationId: organizationId || null,
          });
          setSelectedTypes([]);
        }
        
        // Navigate back or to suppliers list
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        toast.error(result.error || `Failed to ${isEditMode ? "update" : "create"} supplier`);
        
        // Handle validation errors from API
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach(error => {
            toast.error(error);
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} supplier`);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => router.back();

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{`${isEditMode ? "Edit" : "Create"} Supplier`}</h1>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formInputContainer}>
            <label>
              Supplier Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className={`${styles.inputField} ${
                errors.name ? styles.errorInput : ""
              }`}
              required
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Phone Number <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., +254793986438"
              className={`${styles.inputField} ${
                errors.phoneNumber ? styles.errorInput : ""
              }`}
              required
            />
            {errors.phoneNumber && (
              <span className={styles.errorText}>{errors.phoneNumber}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="supplier@example.com"
              className={`${styles.inputField} ${
                errors.email ? styles.errorInput : ""
              }`}
              required
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Location <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Nairobi, Kenya"
              className={`${styles.inputField} ${
                errors.location ? styles.errorInput : ""
              }`}
              required
            />
            {errors.location && (
              <span className={styles.errorText}>{errors.location}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Supplier Types <span className={styles.required}>*</span>
            </label>
            <div className={styles.dropdownWithButtonContainer}>
              <FormDropdown
                options={supplierTypeOptions.filter(option => 
                  !selectedTypes.includes(option.value)
                )}
                onSelect={handleTypeSelect}
                dropPlaceHolder="Select supplier types"
              />
              <button 
                type="button" 
                className={styles.addButton}
                onClick={() => setShowAddType(!showAddType)}
                title="Add custom type"
              >
                <AddIcon className={styles.addIcon} aria-label="add custom type" />
              </button>
            </div>
            
            {showAddType && (
              <div className={styles.customTypeContainer} style={{ marginTop: '10px' }}>
                <div className={styles.dropdownWithButtonContainer}>
                  <input
                    type="text"
                    value={newTypeInput}
                    onChange={(e) => setNewTypeInput(e.target.value)}
                    placeholder="Enter custom supplier type"
                    className={styles.inputField}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomType();
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className={styles.addButton}
                    onClick={addCustomType}
                    disabled={!newTypeInput.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {selectedTypes.length > 0 && (
              <div className={styles.selectedTypesContainer} style={{ marginTop: '10px' }}>
                <label>Selected Types:</label>
                <div className={styles.selectedTypesList}>
                  {selectedTypes.map((type, index) => (
                    <span key={index} className={styles.selectedTypeTag}>
                      {type}
                      <button
                        type="button"
                        onClick={() => removeType(type)}
                        className={styles.removeTypeButton}
                        aria-label={`Remove ${type}`}
                      >
                        <CloseIcon />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {errors.types && (
              <span className={styles.errorText}>{errors.types}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description about the supplier"
              className={`${styles.textareaField} ${
                errors.description ? styles.errorInput : ""
              }`}
              rows={4}
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>
        </div>

        <div className={styles.formButtonContainer}>
        
          <button
            type="submit"
            className={`${styles.submitButton} ${
              isLoading ? styles.loading : ""
            }`}
            disabled={isLoading || suppliersLoading}
          >
            {isLoading ? <Loader /> : `${isEditMode ? "Update" : "Create"} Supplier`}
          </button>
        </div>
      </form>
    </div>
  );
}