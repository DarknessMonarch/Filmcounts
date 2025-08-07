"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import styles from "@/app/styles/project.module.css";
import { SiOnlyoffice as DepartmentIcon } from "react-icons/si";
import { MdAdd } from "react-icons/md";
import DepartmentForm from "@/app/components/form/DepartmentForm";
import { useDepartmentStore } from "@/app/store/Departments";
import { useAuthStore } from "@/app/store/Auth";
import DepartmentTable from "@/app/components/DepartmentTable";

export default function DepartmentPage() {
  const {
    departments,
    loading,
    getDepartmentsByOrg,
    deleteDepartment
  } = useDepartmentStore();

  const { user } = useAuthStore();

  useEffect(() => {
    const loadDepartments = async () => {
      if (user?.organizationId) {
        try {
          const result = await getDepartmentsByOrg(user.organizationId);
          if (!result.success) {
            toast.error("Failed to load departments");
          }
        } catch (error) {
          toast.error("Failed to load departments");
        }
      }
    };

    loadDepartments();
  }, [getDepartmentsByOrg, user?.organizationId]);

  const DepartmentTableColumns = [
    { key: "departmentName", label: "Department Name" },
    { key: "description", label: "Description" },
    { key: "createdDate", label: "Created Date" }
  ];

  const DepartmentTableData = departments.map((department) => ({
    id: String(department.id || department._id || ''),
    departmentName: String(department.departmentName || "N/A"),
    description: String(department.description || "No description"),
    createdDate: department.createdOn 
      ? new Date(department.createdOn).toLocaleDateString()
      : "N/A"
  }));

  const handleDelete = async (department) => {
    if (!department.id) {
      toast.error("Invalid department ID");
      return;
    }
    
    try {
      const result = await deleteDepartment(department.id);
      if (result.success) {
        toast.success("Department deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete department");
      }
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  const handleAddDepartment = () => {
    console.log("Add new department");
  };

  if (loading) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectTop}>
        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Departments</h4>
            <h1>{departments.length} Departments</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <DepartmentIcon
              alt="department icon"
              aria-label="department icon"
              className={styles.projectIcon}
            />
          </div>
        </div>
      </div>

      <DepartmentTable
        title="Department"
        columns={DepartmentTableColumns}
        data={DepartmentTableData}
        content={<DepartmentForm />}
        itemsPerPage={8}
        clickable={false}
        showEditButton={true}
        showDeleteButton={true}
        onDelete={handleDelete}
        showCustomButton={true}
        customButtonLabel="Add Department"
        customButtonIcon={MdAdd}
        onCustomButtonClick={handleAddDepartment}
        customButtonContent={<DepartmentForm />}
      />
    </div>
  );
}