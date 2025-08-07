"use client";

import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBudgetStore } from "@/app/store/Budget";

export default function BudgetForm({ formType: propFormType, itemId, onClose }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = propFormType || searchParams.get("budget") || "add";
  const budgetItemId = itemId || searchParams.get("id");
  const isEditMode = formType === "edit";
  const isBudgetItem = formType === "item" || formType === "editItem";

  const { 
    loading,
    createBudget,
    addBudgetItem,
    updateBudgetItem
  } = useBudgetStore();

  const [formData, setFormData] = useState({
    budgetCode: "",
    natureOfRequest: "",
    units: "",
    factor: "",
    cost: ""
  });

  useEffect(() => {
    if (isEditMode && budgetItemId) {
      setFormData({
        budgetCode: "B",
        natureOfRequest: "Sample Display",
        units: "10",
        factor: "2",
        cost: "3000"
      });
    }
  }, [isEditMode, budgetItemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "budgetCode", label: "Budget Code" },
      { field: "natureOfRequest", label: "Nature of Request" },
      { field: "units", label: "Units" },
      { field: "factor", label: "Factor" },
      { field: "cost", label: "Cost" }
    ];
    
    for (const { field, label } of requiredFields) {
      if (!formData[field]) {
        toast.error(`${label} is required`);
        return false;
      }
    }

    if (isNaN(formData.units) || formData.units <= 0) {
      toast.error("Units must be a valid number");
      return false;
    }

    if (isNaN(formData.factor) || formData.factor <= 0) {
      toast.error("Factor must be a valid number");
      return false;
    }

    if (isNaN(formData.cost) || formData.cost <= 0) {
      toast.error("Cost must be a valid number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        units: Number(formData.units),
        factor: Number(formData.factor),
        cost: Number(formData.cost)
      };

      let result;
      
      if (isBudgetItem) {
        if (formType === "editItem") {
          result = await updateBudgetItem(budgetItemId, submitData);
        } else {
          result = await addBudgetItem(submitData);
        }
      } else {
        const projectId = searchParams.get("projectId") || "default-project-id";
        result = await createBudget(projectId, submitData);
      }
      
      if (result.success) {
        toast.success(result.message);
        if (onClose) {
          onClose();
        } else {
          router.back();
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getFormTitle = () => {
    if (formType === "editItem") return "Edit Budget Item";
    if (isBudgetItem) return "Add Budget Item";
    if (isEditMode) return "Edit Budget";
    return "Create Budget";
  };

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{getFormTitle()}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formInputContainer}>
            <label>
              Budget Code <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="budgetCode"
              value={formData.budgetCode}
              onChange={handleChange}
              placeholder="Enter budget code"
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Nature of Request <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="natureOfRequest"
              value={formData.natureOfRequest}
              onChange={handleChange}
              placeholder="Enter nature of request"
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formDateContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Units <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="units"
                value={formData.units}
                onChange={handleChange}
                placeholder="Enter units"
                className={styles.inputField}
                min="1"
                required
              />
            </div>

            <div className={styles.formInputContainer}>
              <label>
                Factor <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="factor"
                value={formData.factor}
                onChange={handleChange}
                placeholder="Enter factor"
                className={styles.inputField}
                min="1"
                required
              />
            </div>
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
              placeholder="Enter cost"
              className={styles.inputField}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          {loading ? <Loader /> : getFormTitle().split(' ')[0]}
        </button>
      </form>
    </div>
  );
}