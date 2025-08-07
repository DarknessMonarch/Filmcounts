"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table";
import styles from "@/app/styles/dashboard.module.css";
import RequisitionForm from "@/app/components/form/RequisitionForm";
import ReconciliationForm from "@/app/components/form/ReconciliationForm";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SingleProjectCard from "@/app/components/role/SingleProjectCard";
import { MdAdd } from "react-icons/md";

export default function SingleProject() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCard = searchParams.get("card");

  // Columns for Requisition table (updated with organization fields)
  const requisitionColumns = [
    { key: "requestedBy", label: "Requested by" },
    { key: "date", label: "Date" },
    { key: "natureOfRequest", label: "Nature of Request" },
    { key: "units", label: "Units" },
    { key: "authorizedBy", label: "Authorized by" },
    { key: "checkedBy", label: "Checked by" },
    { key: "paymentMethod", label: "Payment method" },
    { key: "cost", label: "Cost" },
    { key: "factor", label: "Factor" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  // Columns for Reconciliation table (updated with organization fields)
  const reconciliationColumns = [
    { key: "supplier", label: "Supplier" },
    { key: "date", label: "Date" },
    { key: "itemParticulars", label: "Item particulars" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "projectCode", label: "Project Code" },
    { key: "receiptNumber", label: "Receipt No." },
    { key: "transactionFee", label: "Transaction fee" },
    { key: "floatIssuedTo", label: "Float issued to" },
    { key: "floatIssuedBy", label: "Float issued by" },
    { key: "approvedBy", label: "Approved by" },
    { key: "verifiedBy", label: "Verified by" },
    { key: "paymentMethod", label: "Payment method" },
    { key: "amount", label: "Amount" },
    { key: "taxAmount", label: "Tax Amount" },
    { key: "netAmount", label: "Net Amount" },
    { key: "total", label: "Total" },
    { key: "balance", label: "Balance" },
  ];

  // Default columns for other views
  const defaultColumns = [
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    { key: "transaction", label: "Transaction" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  // Updated requisition data with all organization fields
  const requisitionData = [
    {
      requestedBy: "John Doe",
      date: "March 25 2025",
      natureOfRequest: "Office equipment and supplies needed for the new marketing department expansion project",
      units: "15",
      authorizedBy: "Sarah Johnson",
      checkedBy: "Mike Wilson",
      paymentMethod: "Bank Transfer",
      cost: "Ksh 18,000",
      factor: "1.1",
      amount: "Ksh 19,800",
      status: "Pending",
      createdAt: "March 24 2025",
      id: 1,
    },
    {
      requestedBy: "Jane Smith",
      date: "March 26 2025",
      natureOfRequest: "Construction materials for building renovation including cement, steel bars, and paint",
      units: "50",
      authorizedBy: "David Brown",
      checkedBy: "Lisa Anderson",
      paymentMethod: "Cash",
      cost: "Ksh 75,000",
      factor: "1.07",
      amount: "Ksh 80,250",
      status: "Approved",
      createdAt: "March 25 2025",
      id: 2,
    },
    {
      requestedBy: "Mike Johnson",
      date: "March 27 2025",
      natureOfRequest: "IT equipment including laptops, monitors, and software licenses for remote work setup",
      units: "8",
      authorizedBy: "Emily Davis",
      checkedBy: "Robert Taylor",
      paymentMethod: "Mobile Money",
      cost: "Ksh 9,500",
      factor: "1.05",
      amount: "Ksh 9,975",
      status: "Rejected",
      createdAt: "March 26 2025",
      id: 3,
    },
    {
      requestedBy: "Alice Cooper",
      date: "March 28 2025",
      natureOfRequest: "Medical supplies and equipment for the company clinic including first aid kits and sanitizers",
      units: "25",
      authorizedBy: "Thomas White",
      checkedBy: "Jennifer Green",
      paymentMethod: "Cheque",
      cost: "Ksh 12,000",
      factor: "1.15",
      amount: "Ksh 13,800",
      status: "Pending",
      createdAt: "March 27 2025",
      id: 4,
    },
    {
      requestedBy: "Bob Martinez",
      date: "March 29 2025",
      natureOfRequest: "Vehicle maintenance and fuel for company fleet including oil change and tire replacement",
      units: "3",
      authorizedBy: "Karen Miller",
      checkedBy: "Steven Clark",
      paymentMethod: "Bank Transfer",
      cost: "Ksh 35,000",
      factor: "1.08",
      amount: "Ksh 37,800",
      status: "Approved",
      createdAt: "March 28 2025",
      id: 5,
    },
  ];

  // Updated reconciliation data with all organization fields
  const reconciliationData = [
    {
      supplier: "Lesley Enterprises Ltd",
      date: "March 25, 2025",
      itemParticulars: "Kitchen Equipment",
      description: "Kitchen equipment and supplies for staff cafeteria including refrigerators, cooking utensils, and dining sets",
      category: "Equipment",
      projectCode: "ORG-2025-001",
      receiptNumber: "REC-001-2025",
      vendorContact: "+254712345678",
      transactionFee: "500",
      floatIssuedTo: "Kitchen Department",
      floatIssuedBy: "Shaun Manager",
      approvedBy: "Sarah Johnson",
      verifiedBy: "Mike Wilson",
      paymentMethod: "Cash",
      amount: "Ksh 20,000",
      taxAmount: "Ksh 3,200",
      netAmount: "Ksh 16,800",
      total: "Ksh 20,500",
      balance: "Ksh 10,000",
      createdAt: "March 24, 2025",
      id: 1,
    },
    {
      supplier: "ABC Office Supplies",
      date: "March 26, 2025",
      itemParticulars: "Office Equipment",
      description: "Computer hardware, printers, and office furniture for the new marketing department expansion",
      category: "Technology",
      projectCode: "ORG-2025-002",
      receiptNumber: "REC-002-2025",
      vendorContact: "+254723456789",
      transactionFee: "Ksh 800",
      floatIssuedTo: "Admin Department",
      floatIssuedBy: "Department Manager",
      approvedBy: "David Brown",
      verifiedBy: "Lisa Anderson",
      paymentMethod: "Bank Transfer",
      amount: "Ksh 50,000",
      taxAmount: "Ksh 8,000",
      netAmount: "Ksh 42,000",
      total: "Ksh 50,800",
      balance: "Ksh 25,000",
      createdAt: "March 25, 2025",
      id: 2,
    },
    {
      supplier: "XYZ Construction Ltd",
      date: "March 27, 2025",
      itemParticulars: "Construction Materials",
      description: "Building materials for office renovation including cement, steel, paint, and electrical fixtures",
      category: "Construction",
      projectCode: "ORG-2025-003",
      receiptNumber: "REC-003-2025",
      vendorContact: "+254734567890",
      transactionFee: "Ksh 1,200",
      floatIssuedTo: "Site Manager",
      floatIssuedBy: "Project Lead",
      approvedBy: "Emily Davis",
      verifiedBy: "Robert Taylor",
      paymentMethod: "Mobile Money",
      amount: "Ksh 75,000",
      taxAmount: "Ksh 12,000",
      netAmount: "Ksh 63,000",
      total: "Ksh 76,200",
      balance: "Ksh 30,000",
      createdAt: "March 26, 2025",
      id: 3,
    },
    {
      supplier: "Tech Solutions Kenya",
      date: "March 28, 2025",
      itemParticulars: "IT Services",
      description: "Network setup, software installation, and IT support services for company-wide digital transformation",
      category: "Services",
      projectCode: "ORG-2025-004",
      receiptNumber: "REC-004-2025",
      vendorContact: "+254745678901",
      transactionFee: "Ksh 600",
      floatIssuedTo: "IT Department",
      floatIssuedBy: "CTO Office",
      approvedBy: "Thomas White",
      verifiedBy: "Jennifer Green",
      paymentMethod: "Cheque",
      amount: "Ksh 35,000",
      taxAmount: "Ksh 5,600",
      netAmount: "Ksh 29,400",
      total: "Ksh 35,600",
      balance: "Ksh 15,000",
      createdAt: "March 27, 2025",
      id: 4,
    },
    {
      supplier: "Green Energy Solutions",
      date: "March 29, 2025",
      itemParticulars: "Solar Equipment",
      description: "Solar panels, inverters, and batteries for sustainable energy implementation across all office buildings",
      category: "Energy",
      projectCode: "ORG-2025-005",
      receiptNumber: "REC-005-2025",
      vendorContact: "+254756789012",
      transactionFee: "Ksh 1,500",
      floatIssuedTo: "Facilities Manager",
      floatIssuedBy: "Operations Director",
      approvedBy: "Karen Miller",
      verifiedBy: "Steven Clark",
      paymentMethod: "Bank Transfer",
      amount: "Ksh 120,000",
      taxAmount: "Ksh 19,200",
      netAmount: "Ksh 100,800",
      total: "Ksh 121,500",
      balance: "Ksh 50,000",
      createdAt: "March 28, 2025",
      id: 5,
    },
  ];

  // Default data for other views (approved, rejected, etc.)
  const defaultData = [
    {
      name: "Factory",
      date: "March 25 2025 12:00 pm",
      transaction: "Machinery",
      amount: "Ksh 20,000",
      status: "Pending",
      id: 1,
    },
    {
      name: "Construction",
      date: "March 26 2025 13:00 am",
      transaction: "Cement",
      amount: "Ksh 80,000",
      status: "Approved",
      id: 2,
    },
    {
      name: "Farm",
      date: "March 26 2025 13:00 am",
      transaction: "Chicken",
      amount: "Ksh 10,000",
      status: "Failed",
      id: 3,
    },
  ];

  const dashboardData = [
    {
      title: "number of requisition",
      count: "5",
      trendDirection: "up",
      type: "requisition",
      status: "approved",
      period: "1 months",
    },
    {
      title: "Number of Reconciliation",
      amount: "5",
      trendDirection: "down",
      period: "2 months",
      status: "approved",
      type: "reconciliation",
    },
    {
      title: "Not Approved",
      amount: "1",
      period: "3 months",
      status: "rejected",
      type: "rejected",
    },
  ];

  // Function to get the appropriate data and columns based on active card
  const getTableData = () => {
    switch (activeCard) {
      case "requisition":
        return {
          columns: requisitionColumns,
          data: requisitionData,
          title: "Requisition",
          form: <RequisitionForm />,
          canAdd: true,
          canEdit: true
        };
      case "reconciliation":
        return {
          columns: reconciliationColumns,
          data: reconciliationData,
          title: "Reconciliation",
          form: <ReconciliationForm />,
          canAdd: true,
          canEdit: true
        };
      case "rejected":
        return {
          columns: defaultColumns,
          data: defaultData.filter(item => item.status === "Failed" || item.status === "Rejected"),
          title: "Rejected",
          form: null,
          canAdd: false,
          canEdit: false
        };
      default:
        return {
          columns: defaultColumns,
          data: defaultData,
          title: activeCard || "Dashboard",
          form: <RequisitionForm />,
          canAdd: true,
          canEdit: true
        };
    }
  };

  const tableConfig = getTableData();

  const handleAddRequisition = () => {
    console.log("Add requisition clicked");
  };

  const handleEdit = (id) => {
    console.log("Edit item with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete item with id:", id);
  };

  return (
    <div className={styles.dashboardContainer}>
      <SingleProjectCard data={dashboardData} />
      <Table
        title={tableConfig.title}
        columns={tableConfig.columns}
        data={tableConfig.data}
        content={tableConfig.form} 
        itemsPerPage={8}
        clickable={false}
        showEditButton={tableConfig.canEdit}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showCustomButton={tableConfig.canAdd}
        customButtonLabel={tableConfig.canAdd ? `Add ${tableConfig.title}` : ""}
        customButtonIcon={MdAdd}
        onCustomButtonClick={handleAddRequisition}
        customButtonContent={tableConfig.form}
      />
    </div>
  );
}