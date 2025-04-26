"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table";
import styles from "@/app/styles/dashboard.module.css";
import DashboardCard from "@/app/components/role/DashboardCard";

export default function SingleProject() {
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
      title: "Total Budget",
      amount: "Ksh 220,342,123",
      trend: "2.5%",
      trendDirection: "up",
      type: "total",
      status: "profit",

      subtitle: "Across all sector",
    },
    {
      title: "Predicted Overun",
      amount: "Ksh 80,000",
      trend: "1.5%",
      trendDirection: "down",
      subtitle: "Risky project",
      status: "loss",
      type: "overun",
    },
    {
      trend: "2.5%",
      status: "profit",
      type: "expenses",
      title: "Expenses",
      amount: "Ksh 110,000",
      subtitle: "10% utilized",
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <DashboardCard data={Dashboarddata} />
      <Table
        title="Transaction History"
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
