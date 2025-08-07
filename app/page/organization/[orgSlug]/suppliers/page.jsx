"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import styles from "@/app/styles/project.module.css";
import { FaBoxArchive as SupplierIcon } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import SupplierForm from "@/app/components/form/SupplierForm";
import { useSupplierStore } from "@/app/store/Supplier";
import { useAuthStore } from "@/app/store/Auth";
import SupplierTable from "@/app/components/CompanyTable";

export default function SupplierPage() {
  const {
    suppliers,
    loading,
    getIndividualSuppliers,
    getSuppliersByOrg,
    deleteSupplier
  } = useSupplierStore();

  const { user } = useAuthStore();

  // Load suppliers on mount
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        // Load individual suppliers first
        const result = await getIndividualSuppliers();
        
        if (!result.success) {
          toast.error("Failed to load individual suppliers");
        }
        
        // If user has an organization, load organization suppliers too
        if (user?.organizationId) {
          const orgResult = await getSuppliersByOrg(user.organizationId);
          if (!orgResult.success) {
            toast.error("Failed to load organizational suppliers");
          }
        }
      } catch (error) {
        console.error("Failed to load suppliers:", error);
        toast.error("Failed to load suppliers");
      }
    };

    loadSuppliers();
  }, [getIndividualSuppliers, getSuppliersByOrg, user?.organizationId]);

  // Define SupplierTable columns
  const SupplierTableColumns = [
    { key: "name", label: "Supplier Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "location", label: "Location" },
    { key: "types", label: "Types" },
    { key: "supplierType", label: "Supplier Type" },
    { key: "createdDate", label: "Created Date" }
  ];

  // Filter options for the SupplierTable
  const filterOptions = [
    { value: "individual", label: "Individual" },
    { value: "organization", label: "Organization" }
  ];

  // Transform supplier data for SupplierTable
  const SupplierTableData = suppliers.map((supplier) => ({
    id: String(supplier.id || supplier._id || ''),
    name: String(supplier.name || "N/A"),
    email: String(supplier.email || "N/A"),
    phoneNumber: String(supplier.phoneNumber || "N/A"),
    location: String(supplier.location || "N/A"),
    types: Array.isArray(supplier.types) ? supplier.types.join(", ") : "N/A",
    supplierType: supplier.organizationId ? "Organization" : "Individual",
    description: String(supplier.description || "No description"),
    createdDate: supplier.createdOn 
      ? new Date(supplier.createdOn).toLocaleDateString()
      : "N/A"
  }));

  const handleDelete = async (supplier) => {
    if (!supplier.id) {
      toast.error("Invalid supplier ID");
      return;
    }
    
    try {
      const result = await deleteSupplier(supplier.id);
      if (result.success) {
        toast.success(result.message || "Supplier deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete supplier");
    }
  };

  const handleAddSupplier = () => {
    console.log("Add new supplier");
  };

  const handleEdit = (supplier) => {
    console.log("Edit supplier:", supplier);
    // This will be handled by the SupplierTable component's edit functionality
  };

  // Calculate stats
  const individualSuppliers = suppliers.filter(s => !s.organizationId);
  const organizationSuppliers = suppliers.filter(s => s.organizationId);

  if (loading) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectTop}>
        {/* Stats Cards */}
        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Total Suppliers</h4>
            <h1>{suppliers.length} Suppliers</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <SupplierIcon
              alt="supplier icon"
              aria-label="supplier icon"
              className={styles.projectIcon}
            />
          </div>
        </div>

        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Individual</h4>
            <h1>{individualSuppliers.length}</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <SupplierIcon
              alt="individual supplier icon"
              aria-label="individual supplier icon"
              className={styles.projectIcon}
            />
          </div>
        </div>

        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Organization</h4>
            <h1>{organizationSuppliers.length}</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <SupplierIcon
              alt="organization supplier icon"
              aria-label="organization supplier icon"
              className={styles.projectIcon}
            />
          </div>
        </div>
      </div>

      {/* SupplierTable with integrated filter */}
      <SupplierTable
        title="Supplier"
        columns={SupplierTableColumns}
        data={SupplierTableData}
        content={<SupplierForm />}
        itemsPerPage={8}
        clickable={true}
        showEditButton={true}
        showDeleteButton={true}
        onDelete={handleDelete}
        onEdit={handleEdit}
        showCustomButton={true}
        customButtonLabel="Add Supplier"
        customButtonIcon={MdAdd}
        onCustomButtonClick={handleAddSupplier}
        customButtonContent={<SupplierForm />}
        // Filter props
        showFilter={true}
        filterOptions={filterOptions}
        filterKey="supplierType"
        defaultFilter="all"
        // Search props
        showSearch={true}
        searchPlaceholder="Search suppliers..."
        searchableColumns={["name", "email", "phoneNumber", "location", "types"]}
      />
    </div>
  );
}