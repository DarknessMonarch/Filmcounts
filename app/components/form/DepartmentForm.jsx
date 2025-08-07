"use client";

import { toast } from "sonner";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDepartmentStore } from "@/app/store/Departments";

export default function DepartmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("department") || "add";
  const departmentId = searchParams.get("id");
  const isEditMode = formType === "edit";

  const { 
    loading,
    addDepartment,
    updateDepartment
  } = useDepartmentStore();

  const [formData, setFormData] = useState({
    departmentName: "",
    organizationId: "682f31efbaef99189c55fe87",
    description: ""
  });

  useEffect(() => {
    if (isEditMode && departmentId) {
      setFormData({
        departmentName: "Sample Department",
        organizationId: "682f31efbaef99189c55fe87",
        description: "This is a sample department description for editing."
      });
    }
  }, [isEditMode, departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.departmentName) {
      toast.error("Department name is required");
      return false;
    }
    if (!formData.description) {
      toast.error("Description is required");
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
      let result;
      if (isEditMode) {
        result = await updateDepartment(departmentId, formData);
      } else {
        result = await addDepartment(formData);
      }
      
      if (result.success) {
        toast.success(result.message);
        router.back();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const goBack = () => router.back();

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>{`${isEditMode ? "Edit" : "Create"} Department`}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formInputContainer}>
            <label>
              Department Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              placeholder="Enter department name"
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="About the department"
              className={styles.textareaField}
              rows={4}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          {loading ? <Loader /> : `${isEditMode ? "Update" : "Create"} Department`}
        </button>
      </form>
    </div>
  );
}