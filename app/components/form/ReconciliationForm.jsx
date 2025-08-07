"use client";

import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FormDropdown from "@/app/components/FormDropdown";
import { useUserManagementStore } from "@/app/store/UserManagement";

export default function ReconciliationForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formType = searchParams.get("reconciliation") || "add";
  const reconciliationId = searchParams.get("id");
  const isEditMode = formType === "edit";
  
  const isOrganizationRoute = pathname.includes("/organization/");
  const { organizations } = useUserManagementStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethodOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "Mobile Money", value: "Mobile Money" },
    { label: "Cheque", value: "Cheque" },
  ];

  const [formData, setFormData] = useState({
    supplier: "",
    date: "",
    itemParticulars: "",
    transactionFee: "",
    floatIssuedTo: "",
    floatIssuedBy: "",
    paymentMethod: null,
    amount: "",
    total: "",
    balance: "",
    createdAt: new Date().toLocaleDateString(),
    // Organization-specific fields
    description: "",
    category: "",
    projectCode: "",
    approvedBy: "",
    verifiedBy: "",
    receiptNumber: "",
    vendorContact: "",
    taxAmount: "",
    netAmount: "",
  });

  useEffect(() => {
    if (isEditMode && reconciliationId) {
      setFormData(prev => ({
        ...prev,
        supplier: "Lesley",
        date: new Date().toISOString().split('T')[0],
        itemParticulars: "Kitchen",
        transactionFee: "0",
        floatIssuedTo: "Kitchen",
        floatIssuedBy: "Shaun",
        paymentMethod: paymentMethodOptions.find(option => option.value === "Cash"),
        amount: "20000",
        total: "20000",
        balance: "10000",
        // Organization edit data
        description: isOrganizationRoute ? "Kitchen equipment and supplies for staff cafeteria" : "",
        category: isOrganizationRoute ? "Equipment" : "",
        projectCode: isOrganizationRoute ? "ORG-2025-001" : "",
        approvedBy: isOrganizationRoute ? "Sarah Johnson" : "",
        verifiedBy: isOrganizationRoute ? "Mike Wilson" : "",
        receiptNumber: isOrganizationRoute ? "REC-001-2025" : "",
        vendorContact: isOrganizationRoute ? "+254712345678" : "",
        taxAmount: isOrganizationRoute ? "3200" : "",
        netAmount: isOrganizationRoute ? "16800" : "",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        supplier: "",
        date: "",
        itemParticulars: "",
        transactionFee: "",
        floatIssuedTo: "",
        floatIssuedBy: "",
        paymentMethod: null,
        amount: "",
        total: "",
        balance: "",
        createdAt: new Date().toLocaleDateString(),
        description: "",
        category: "",
        projectCode: "",
        approvedBy: "",
        verifiedBy: "",
        receiptNumber: "",
        vendorContact: "",
        taxAmount: "",
        netAmount: "",
      }));
    }
  }, [isEditMode, reconciliationId, isOrganizationRoute]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-calculate total when amount or transaction fee changes
    if (name === 'amount' || name === 'transactionFee') {
      const amount = parseFloat(name === 'amount' ? value : formData.amount) || 0;
      const fee = parseFloat(name === 'transactionFee' ? value : formData.transactionFee) || 0;
      const total = amount + fee;
      setFormData((prev) => ({ ...prev, total: total.toString() }));
    }

    // Auto-calculate net amount when amount or tax amount changes (for organization)
    if (isOrganizationRoute && (name === 'amount' || name === 'taxAmount')) {
      const amount = parseFloat(name === 'amount' ? value : formData.amount) || 0;
      const tax = parseFloat(name === 'taxAmount' ? value : formData.taxAmount) || 0;
      const net = amount - tax;
      setFormData((prev) => ({ ...prev, netAmount: net.toString() }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePaymentMethodSelect = (option) => {
    setFormData((prev) => ({ ...prev, paymentMethod: option }));
    if (errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let requiredFields = [
      "supplier", "date", "itemParticulars", "floatIssuedTo", 
      "floatIssuedBy", "paymentMethod", "amount"
    ];
    
    // Add organization-specific required fields
    if (isOrganizationRoute) {
      requiredFields = [...requiredFields, "description", "category", "projectCode", "approvedBy", "verifiedBy"];
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

    if (formData.transactionFee && isNaN(parseFloat(formData.transactionFee))) {
      newErrors.transactionFee = "Transaction fee must be a valid number";
    }

    if (isOrganizationRoute && formData.taxAmount && isNaN(parseFloat(formData.taxAmount))) {
      newErrors.taxAmount = "Tax amount must be a valid number";
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
        console.log("Reconciliation form submitted:", formData);
        toast.success(`Reconciliation ${isEditMode ? "updated" : "created"} successfully!`);
        setIsLoading(false);
        router.push(window.location.pathname);
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} reconciliation`);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{`${isEditMode ? "Edit" : "Create"} ${isOrganizationRoute ? "Organization " : ""}Reconciliation`}</h1>
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

          <div className={styles.formInputContainer}>
            <label>
              Supplier <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className={`${styles.inputField} ${
                errors.supplier ? styles.errorInput : ""
              }`}
              required
            />
            {errors.supplier && (
              <span className={styles.errorText}>{errors.supplier}</span>
            )}
          </div>

          {isOrganizationRoute && (
            <div className={styles.formInputContainer}>
              <label>
                Vendor Contact
              </label>
              <input
                type="text"
                name="vendorContact"
                value={formData.vendorContact}
                onChange={handleChange}
                placeholder="Enter vendor contact information"
                className={styles.inputField}
              />
            </div>
          )}

          <div className={styles.formInputContainer}>
            <label>
              Item Particulars <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="itemParticulars"
              value={formData.itemParticulars}
              onChange={handleChange}
              placeholder="Enter item details"
              className={`${styles.inputField} ${
                errors.itemParticulars ? styles.errorInput : ""
              }`}
              required
            />
            {errors.itemParticulars && (
              <span className={styles.errorText}>{errors.itemParticulars}</span>
            )}
          </div>

          {isOrganizationRoute && (
            <>
              <div className={styles.formInputContainer}>
                <label>
                  Description <span className={styles.required}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the transaction"
                  className={`${styles.textareaField} ${
                    errors.description ? styles.errorInput : ""
                  }`}
                  rows={3}
                  required
                />
                {errors.description && (
                  <span className={styles.errorText}>{errors.description}</span>
                )}
              </div>

              <div className={styles.formDateContainer}>
                <div className={styles.formInputContainer}>
                  <label>
                    Category <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Equipment, Supplies, Services"
                    className={`${styles.inputField} ${
                      errors.category ? styles.errorInput : ""
                    }`}
                    required
                  />
                  {errors.category && (
                    <span className={styles.errorText}>{errors.category}</span>
                  )}
                </div>

                <div className={styles.formInputContainer}>
                  <label>
                    Project Code <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleChange}
                    placeholder="Enter project code"
                    className={`${styles.inputField} ${
                      errors.projectCode ? styles.errorInput : ""
                    }`}
                    required
                  />
                  {errors.projectCode && (
                    <span className={styles.errorText}>{errors.projectCode}</span>
                  )}
                </div>
              </div>

              <div className={styles.formInputContainer}>
                <label>
                  Receipt Number
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  placeholder="Enter receipt/invoice number"
                  className={styles.inputField}
                />
              </div>
            </>
          )}

          <div className={styles.formInputContainer}>
            <label>Transaction Fee</label>
            <input
              type="number"
              name="transactionFee"
              value={formData.transactionFee}
              onChange={handleChange}
              placeholder="Enter transaction fee (optional)"
              className={`${styles.inputField} ${
                errors.transactionFee ? styles.errorInput : ""
              }`}
              min="0"
              step="0.01"
            />
            {errors.transactionFee && (
              <span className={styles.errorText}>{errors.transactionFee}</span>
            )}
          </div>

          <div className={styles.formDateContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Amount <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className={`${styles.inputField} ${
                  errors.amount ? styles.errorInput : ""
                }`}
                min="0"
                step="0.01"
                required
              />
              {errors.amount && (
                <span className={styles.errorText}>{errors.amount}</span>
              )}
            </div>

            {isOrganizationRoute && (
              <div className={styles.formInputContainer}>
                <label>Tax Amount</label>
                <input
                  type="number"
                  name="taxAmount"
                  value={formData.taxAmount}
                  onChange={handleChange}
                  placeholder="Enter tax amount"
                  className={`${styles.inputField} ${
                    errors.taxAmount ? styles.errorInput : ""
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.taxAmount && (
                  <span className={styles.errorText}>{errors.taxAmount}</span>
                )}
              </div>
            )}
          </div>

          <div className={styles.formDateContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Float Issued To <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="floatIssuedTo"
                value={formData.floatIssuedTo}
                onChange={handleChange}
                placeholder="Issued to"
                className={`${styles.inputField} ${
                  errors.floatIssuedTo ? styles.errorInput : ""
                }`}
                required
              />
              {errors.floatIssuedTo && (
                <span className={styles.errorText}>{errors.floatIssuedTo}</span>
              )}
            </div>

            <div className={styles.formInputContainer}>
              <label>
                Float Issued By <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="floatIssuedBy"
                value={formData.floatIssuedBy}
                onChange={handleChange}
                placeholder="Issued by"
                className={`${styles.inputField} ${
                  errors.floatIssuedBy ? styles.errorInput : ""
                }`}
                required
              />
              {errors.floatIssuedBy && (
                <span className={styles.errorText}>{errors.floatIssuedBy}</span>
              )}
            </div>
          </div>

          {isOrganizationRoute && (
            <div className={styles.formDateContainer}>
              <div className={styles.formInputContainer}>
                <label>
                  Approved By <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  placeholder="Enter approver name"
                  className={`${styles.inputField} ${
                    errors.approvedBy ? styles.errorInput : ""
                  }`}
                  required
                />
                {errors.approvedBy && (
                  <span className={styles.errorText}>{errors.approvedBy}</span>
                )}
              </div>

              <div className={styles.formInputContainer}>
                <label>
                  Verified By <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="verifiedBy"
                  value={formData.verifiedBy}
                  onChange={handleChange}
                  placeholder="Enter verifier name"
                  className={`${styles.inputField} ${
                    errors.verifiedBy ? styles.errorInput : ""
                  }`}
                  required
                />
                {errors.verifiedBy && (
                  <span className={styles.errorText}>{errors.verifiedBy}</span>
                )}
              </div>
            </div>
          )}

          <div className={styles.formInputContainer}>
            <label>
              Payment Method <span className={styles.required}>*</span>
            </label>
            <FormDropdown
              options={paymentMethodOptions}
              value={formData.paymentMethod}
              onSelect={handlePaymentMethodSelect}
              dropPlaceHolder="Select payment method"
            />
            {errors.paymentMethod && (
              <span className={styles.errorText}>{errors.paymentMethod}</span>
            )}
          </div>

          <div className={styles.formDateContainer}>
            <div className={styles.formInputContainer}>
              <label>Balance</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                placeholder="Remaining balance"
                className={styles.inputField}
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formInputContainer}>
              <label>Total</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                placeholder="Total amount"
                className={styles.inputField}
                min="0"
                step="0.01"
                readOnly
              />
            </div>
          </div>

          {isOrganizationRoute && (
            <div className={styles.formInputContainer}>
              <label>Net Amount</label>
              <input
                type="number"
                name="netAmount"
                value={formData.netAmount}
                onChange={handleChange}
                placeholder="Net amount after tax"
                className={styles.inputField}
                min="0"
                step="0.01"
                readOnly
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : `${isEditMode ? "Update" : "Create"} Reconciliation`}
        </button>
      </form>
    </div>
  );
}