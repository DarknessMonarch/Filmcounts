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

  // Columns for Requisition table
  const requisitionColumns = [
    { key: "requestedBy", label: "Requested by" },
    { key: "date", label: "Date" },
    { key: "paymentMethod", label: "Payment method" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
    { key: "cost", label: "cost" },
    { key: "factor", label: "factor" },
  ];

  // Columns for Reconciliation table
  const reconciliationColumns = [
    { key: "supplier", label: "Supplier" },
    { key: "date", label: "Date" },
    { key: "itemParticulars", label: "Item particulars" },
    { key: "transactionFee", label: "Transaction fee" },
    { key: "floatIssuedTo", label: "Float issued to" },
    { key: "floatIssuedBy", label: "Float issued by" },
    { key: "paymentMethod", label: "Payment method" },
    { key: "amount", label: "Amount" },
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

  const requisitionData = [
    {
      requestedBy: "John Doe",
      date: "March 25 2025",
      paymentMethod: "Bank Transfer",
      amount: "Ksh 20,000",
      status: "Pending",
      reason: "Equipment Purchase",
      cost: "Ksh 18,000",
      factor: "1.1",
      id: 1,
    },
    {
      requestedBy: "Jane Smith",
      date: "March 26 2025",
      paymentMethod: "Cash",
      amount: "Ksh 80,000",
      status: "Approved",
      reason: "Construction Materials",
      cost: "Ksh 75,000",
      factor: "1.07",
      id: 2,
    },
    {
      requestedBy: "Mike Johnson",
      date: "March 27 2025",
      paymentMethod: "Mobile Money",
      amount: "Ksh 10,000",
      status: "Rejected",
      reason: "Office Supplies",
      cost: "Ksh 9,500",
      factor: "1.05",
      id: 3,
    },
  ];

  const reconciliationData = [
    {
      supplier: "Lesley",
      date: "timestamp",
      itemParticulars: "Kitchen",
      transactionFee: "N/A",
      floatIssuedTo: "Kitchen",
      floatIssuedBy: "Shaun",
      paymentMethod: "Cash",
      amount: "Ksh 20000",
      total: "Ksh 20000",
      balance: "Ksh 10000",
      id: 1,
    },
    {
      supplier: "ABC Supplies",
      date: "March 26 2025",
      itemParticulars: "Office Equipment",
      transactionFee: "Ksh 500",
      floatIssuedTo: "Admin",
      floatIssuedBy: "Manager",
      paymentMethod: "Bank Transfer",
      amount: "Ksh 50000",
      total: "Ksh 50500",
      balance: "Ksh 25000",
      id: 2,
    },
    {
      supplier: "XYZ Ltd",
      date: "March 27 2025",
      itemParticulars: "Construction Materials",
      transactionFee: "Ksh 200",
      floatIssuedTo: "Site Manager",
      floatIssuedBy: "Project Lead",
      paymentMethod: "Mobile Money",
      amount: "Ksh 75000",
      total: "Ksh 75200",
      balance: "Ksh 30000",
      id: 3,
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
      count: "2",
      trendDirection: "up",
      type: "requisition",
      status: "approved",
      period: "1 months",
    },
    {
      title: "Number of Reconciliation",
      amount: "2",
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