"use client";

import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import FormDropdown from "@/app/components/FormDropdown";
import styles from "@/app/styles/form.module.css";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useUserManagementStore } from "@/app/store/UserManagement"; 

export default function RequisitionForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formType = searchParams.get("requisition") || "add";
  const requisitionId = searchParams.get("id");
  const isEditMode = formType === "edit";
  
  const isOrganizationRoute = pathname.includes("/organization/");
  const { organizations } = useUserManagementStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethodOptions = [
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "Cash", value: "Cash" },
    { label: "Mobile Money", value: "Mobile Money" },
    { label: "Cheque", value: "Cheque" },
  ];

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  const [formData, setFormData] = useState({
    requestedBy: "",
    date: "",
    paymentMethod: "Bank Transfer",
    amount: "",
    reason: "",
    cost: "",
    factor: "1.0",
    createdAt: new Date().toLocaleDateString(),
    // Organization-specific fields
    natureOfRequest: "",
    units: "",
    authorizedBy: "",
    checkedBy: "",
  });

  useEffect(() => {
    if (isEditMode && requisitionId) {
      setFormData(prev => ({
        ...prev,
        requestedBy: "John Doe",
        date: new Date().toISOString().split('T')[0],
        paymentMethod: "Bank Transfer",
        amount: "20000",
        reason: "Equipment Purchase",
        cost: "18000",
        factor: "1.1",
        natureOfRequest: isOrganizationRoute ? "Office Supplies" : "",
        units: isOrganizationRoute ? "10" : "",
        authorizedBy: isOrganizationRoute ? "Jane Smith" : "",
        checkedBy: isOrganizationRoute ? "Mike Johnson" : "",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        requestedBy: "",
        date: "",
        paymentMethod: "Bank Transfer",
        amount: "",
        reason: "",
        cost: "",
        factor: "1.0",
        createdAt: new Date().toLocaleDateString(),
        natureOfRequest: "",
        units: "",
        authorizedBy: "",
        checkedBy: "",
      }));
    }
  }, [isEditMode, requisitionId, isOrganizationRoute]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-calculate amount when cost and factor change
    if (name === 'cost' || name === 'factor') {
      const cost = parseFloat(name === 'cost' ? value : formData.cost) || 0;
      const factor = parseFloat(name === 'factor' ? value : formData.factor) || 1;
      const amount = cost * factor;
      setFormData((prev) => ({ ...prev, amount: amount.toString() }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle dropdown selections
  const handleDropdownSelect = (fieldName, option) => {
    setFormData((prev) => ({ ...prev, [fieldName]: option.value }));
    
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let requiredFields = [
      "requestedBy", "date", "paymentMethod", "amount", "reason", "cost"
    ];
    
    // Add organization-specific required fields
    if (isOrganizationRoute) {
      requiredFields = [...requiredFields, "natureOfRequest", "units", "authorizedBy", "checkedBy"];
    }
    
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
        } is required`;
      }
    });

    // Validate numeric fields
    if (formData.amount && isNaN(parseFloat(formData.amount))) {
      newErrors.amount = "Amount must be a valid number";
    }

    if (formData.cost && isNaN(parseFloat(formData.cost))) {
      newErrors.cost = "Cost must be a valid number";
    }

    if (formData.factor && isNaN(parseFloat(formData.factor))) {
      newErrors.factor = "Factor must be a valid number";
    }

    if (isOrganizationRoute && formData.units && isNaN(parseFloat(formData.units))) {
      newErrors.units = "Units must be a valid number";
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
      setTimeout(() => {
        console.log("Requisition form submitted:", formData);
        toast.success(`Requisition ${isEditMode ? "updated" : "created"} successfully!`);
        setIsLoading(false);
        router.push(window.location.pathname);
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} requisition`);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{`${isEditMode ? "Edit" : "Create"} ${isOrganizationRoute ? "Organization " : ""}Requisition`}</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formInputContainer}>
            <label>
              Date <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.date ? styles.errorInput : ""
              }`}
              required
            />
            {errors.date && (
              <span className={styles.errorText}>{errors.date}</span>
            )}
          </div>

          {isOrganizationRoute && (
            <div className={styles.formInputContainer}>
              <label>
                Nature of Request <span className={styles.required}>*</span>
              </label>
              <textarea
                name="natureOfRequest"
                value={formData.natureOfRequest}
                onChange={handleChange}
                placeholder="Explain the nature of request"
                className={`${styles.textareaField} ${
                  errors.natureOfRequest ? styles.errorInput : ""
                }`}
                rows={3}
                required
              />
              {errors.natureOfRequest && (
                <span className={styles.errorText}>{errors.natureOfRequest}</span>
              )}
            </div>
          )}

          {isOrganizationRoute && (
            <div className={styles.formInputContainer}>
              <label>
                Units <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="units"
                value={formData.units}
                onChange={handleChange}
                placeholder="Enter number of units"
                className={`${styles.inputField} ${
                  errors.units ? styles.errorInput : ""
                }`}
                min="1"
                required
              />
              {errors.units && (
                <span className={styles.errorText}>{errors.units}</span>
              )}
            </div>
          )}

          <div className={styles.formDateContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Factor <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="factor"
                value={formData.factor}
                onChange={handleChange}
                placeholder="Enter multiplier factor"
                className={`${styles.inputField} ${
                  errors.factor ? styles.errorInput : ""
                }`}
                min="0.1"
                step="0.01"
                required
              />
              {errors.factor && (
                <span className={styles.errorText}>{errors.factor}</span>
              )}
            </div>

            <div className={styles.formInputContainer}>
              <label>
                Cost <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="Enter base cost"
                className={`${styles.inputField} ${
                  errors.cost ? styles.errorInput : ""
                }`}
                min="0"
                step="0.01"
                required
              />
              {errors.cost && (
                <span className={styles.errorText}>{errors.cost}</span>
              )}
            </div>
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Requested By <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleChange}
              placeholder="Enter requester name"
              className={`${styles.inputField} ${
                errors.requestedBy ? styles.errorInput : ""
              }`}
              required
            />
            {errors.requestedBy && (
              <span className={styles.errorText}>{errors.requestedBy}</span>
            )}
          </div>

          {isOrganizationRoute && (
            <>
              <div className={styles.formInputContainer}>
                <label>
                  Authorized By <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="authorizedBy"
                  value={formData.authorizedBy}
                  onChange={handleChange}
                  placeholder="Enter authorizer name"
                  className={`${styles.inputField} ${
                    errors.authorizedBy ? styles.errorInput : ""
                  }`}
                  required
                />
                {errors.authorizedBy && (
                  <span className={styles.errorText}>{errors.authorizedBy}</span>
                )}
              </div>

              <div className={styles.formInputContainer}>
                <label>
                  Checked By <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="checkedBy"
                  value={formData.checkedBy}
                  onChange={handleChange}
                  placeholder="Enter checker name"
                  className={`${styles.inputField} ${
                    errors.checkedBy ? styles.errorInput : ""
                  }`}
                  required
                />
                {errors.checkedBy && (
                  <span className={styles.errorText}>{errors.checkedBy}</span>
                )}
              </div>
            </>
          )}

          <div className={styles.formInputContainer}>
            <label>
              Payment Method <span className={styles.required}>*</span>
            </label>
            <FormDropdown
              options={paymentMethodOptions}
              value={paymentMethodOptions.find(option => option.value === formData.paymentMethod)}
              onSelect={(option) => handleDropdownSelect('paymentMethod', option)}
              dropPlaceHolder="Choose payment method"
            />
            {errors.paymentMethod && (
              <span className={styles.errorText}>{errors.paymentMethod}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Amount <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Total amount (auto-calculated)"
              className={`${styles.inputField} ${
                errors.amount ? styles.errorInput : ""
              }`}
              min="0"
              step="0.01"
              readOnly
              required
            />
            {errors.amount && (
              <span className={styles.errorText}>{errors.amount}</span>
            )}
          </div>

          {!isOrganizationRoute && (
            <div className={styles.formInputContainer}>
              <label>
                Reason <span className={styles.required}>*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for requisition"
                className={`${styles.textareaField} ${
                  errors.reason ? styles.errorInput : ""
                }`}
                rows={3}
                required
              />
              {errors.reason && (
                <span className={styles.errorText}>{errors.reason}</span>
              )}
            </div>
          )}

 
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : `${isEditMode ? "Update" : "Create"} Requisition`}
        </button>
      </form>
    </div>
  );
}