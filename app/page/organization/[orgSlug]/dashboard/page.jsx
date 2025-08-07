"use client";

import Table from "@/app/components/Table";
import styles from "@/app/styles/dashboard.module.css";
import ProjectForm from "@/app/components/form/ProjectForm";
import StatisticsGraph from "@/app/components/StatisticsGraph";

export default function Dashboard() {
  const columns = [
    { key: "projectName", label: "Project Name" },
    { key: "date", label: "Date" },
    { key: "department", label: "Department" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];

  const data = [
    {
      projectName: "Chicken",
      date: "March 25 2025 12:00 pm",
      department: "Kitchen",
      email: "Penguin@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
    {
      projectName: "Construction",
      date: "March 26 2025 13:00 am",
      department: "Cement",
      email: "Shaun@gmail.com",
      phone: "0700000",
    },
  ];
  const fetchProjectData = async (period) => {
    console.log(`Fetching ${period} data`);
    return {
      success: true,
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"],
        values: [22000, 35000, 25000, 40000, 55000, 45000, 40000],
      },
    };
  };

  return (
    <div className={styles.dashboardContainer}>
      <StatisticsGraph
        fetchDataFunction={fetchProjectData}
        title="Projects"
        periodOptions={["Monthly", "Weekly", "Daily"]}
      />
      <Table
        title="Projects"
        columns={columns}
        data={data}
        itemsPerPage={4}
        clickable={true}
        content={<ProjectForm />}
        clickKeyField="projectName"
      />
    </div>
  );
}

