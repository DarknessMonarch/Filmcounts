"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import styles from "@/app/styles/project.module.css";
import { BsBuildingsFill as CompanyIcon } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import CompanyForm from "@/app/components/form/CompanyForm";
import { useCompanyStore } from "@/app/store/Company";
import { useAuthStore } from "@/app/store/Auth";
import CompanyTable from "@/app/components/CompanyTable";

export default function CompanyPage() {
  const {
    companies,
    loading,
    getCompaniesForIndividual,
    getCompaniesByOrg,
    deleteCompany
  } = useCompanyStore();

  const { user } = useAuthStore();

  // Load companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const result = await getCompaniesForIndividual();
        
        if (!result.success) {
          toast.error("Failed to load companies");
        }
        
        if (user?.organizationId) {
          const orgResult = await getCompaniesByOrg(user.organizationId);
          if (!orgResult.success) {
            toast.error("Failed to load organizational companies");
          }
        }
      } catch (error) {
        console.error("Failed to load companies:", error);
        toast.error("Failed to load companies");
      }
    };

    loadCompanies();
  }, [getCompaniesForIndividual, getCompaniesByOrg, user?.organizationId]);

  // Define CompanyTable columns
  const CompanyTableColumns = [
    { key: "companyName", label: "Company Name" },
    { key: "companyDescription", label: "Description" },
    { key: "userType", label: "Type" },
    { key: "createdDate", label: "Created Date" }
  ];

  // Filter options for the CompanyTable
  const filterOptions = [
    { value: "individual", label: "Individual" },
    { value: "organization", label: "Organization" }
  ];

  // Transform company data for CompanyTable
  const CompanyTableData = companies.map((company) => ({
    id: String(company.id || company._id || ''),
    companyName: String(company.companyName || "N/A"),
    companyDescription: String(company.companyDescription || "No description"),
    userType: String(company.userType || "INDIVIDUAL"),
    createdDate: company.createdOn 
      ? new Date(company.createdOn).toLocaleDateString()
      : "N/A"
  }));

  const handleDelete = async (company) => {
    if (!company.id) {
      toast.error("Invalid company ID");
      return;
    }
    
    try {
      const result = await deleteCompany(company.id);
      if (result.success) {
        toast.success("Company deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete company");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete company");
    }
  };

  const handleAddCompany = () => {
    console.log("Add new company");
  };

  if (loading) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectTop}>
        {/* Stats Card */}
        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Companies</h4>
            <h1>{companies.length} Companies</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <CompanyIcon
              alt="company icon"
              aria-label="company icon"
              className={styles.projectIcon}
            />
          </div>
        </div>

    
      </div>
          {/* CompanyTable with integrated filter */}
        <CompanyTable
          title="Company"
          columns={CompanyTableColumns}
          data={CompanyTableData}
          content={<CompanyForm />}
          itemsPerPage={8}
          clickable={false}
          showEditButton={true}
          showDeleteButton={true}
          onDelete={handleDelete}
          showCustomButton={true}
          customButtonLabel="Add Company"
          customButtonIcon={MdAdd}
          onCustomButtonClick={handleAddCompany}
          customButtonContent={<CompanyForm />}
          // Filter props
          showFilter={true}
          filterOptions={filterOptions}
          filterKey="userType"
          defaultFilter="all"
        />
    </div>
  );
}