"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table";
import styles from "@/app/styles/dashboard.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SingleProjectCard from "@/app/components/role/SingleProjectCard";

export default function SingleProject() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCard = searchParams.get("card");

  const columns = [
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    { key: "transaction", label: "Transaction" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const data = [
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

  const Dashboarddata = [
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

  return (
    <div className={styles.dashboardContainer}>
      <SingleProjectCard data={Dashboarddata} />
      <Table
        title={activeCard ? activeCard : "rejected"}
        columns={columns}
        data={data}
        itemsPerPage={8}
        clickable={false}
        showEditButton={false}
        onEdit={(data) => handleEdit(data.id)}
        onDelete={(item) => handleDelete(item.id)}
      />
    </div>
  );
}
