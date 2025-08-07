"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import styles from "@/app/styles/project.module.css";
import { BsCashCoin as BudgetIcon } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import BudgetForm from "@/app/components/form/BudgetForm";
import { useBudgetStore } from "@/app/store/Budget";
import { useAuthStore } from "@/app/store/Auth";
import { useSearchParams } from "next/navigation";
import BudgetTable from "@/app/components/BudgetTable";

export default function BudgetPage() {
  const {
    budgets,
    budgetItems,
    loading,
    getUnsubmittedBudgets,
    getSubmittedBudgets,
    getApprovedBudgets,
    deleteBudgetItem,
    submitBudget
  } = useBudgetStore();

  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "default-project-id";
  
  const [activeTab, setActiveTab] = useState("unsubmitted");

  useEffect(() => {
    loadBudgets();
  }, [activeTab, projectId]);

  const loadBudgets = async () => {
    try {
      const filters = { filters: {}, page: 0, size: 10 };
      let result;
      
      switch (activeTab) {
        case "unsubmitted":
          result = await getUnsubmittedBudgets(projectId);
          break;
        case "submitted":
          result = await getSubmittedBudgets(projectId);
          break;
        case "approved":
          result = await getApprovedBudgets(projectId);
          break;
        default:
          result = await getUnsubmittedBudgets(projectId);
      }
      
      if (!result.success) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to load budgets");
    }
  };

  const BudgetTableColumns = [
    { key: "budgetCode", label: "Budget Code" },
    { key: "natureOfRequest", label: "Nature of Request" },
    { key: "units", label: "Units" },
    { key: "factor", label: "Factor" },
    { key: "cost", label: "Cost" },
    { key: "totalCost", label: "Total Cost" },
    { key: "status", label: "Status" }
  ];

  const BudgetTableData = budgets.map((budget) => ({
    id: String(budget.id || budget._id || ''),
    budgetCode: String(budget.budgetCode || "N/A"),
    natureOfRequest: String(budget.natureOfRequest || "N/A"),
    units: String(budget.units || "0"),
    factor: String(budget.factor || "0"),
    cost: String(budget.cost || "0"),
    totalCost: String((budget.units || 0) * (budget.factor || 0) * (budget.cost || 0)),
    status: String(budget.status || activeTab)
  }));

  const handleDelete = async (budget) => {
    if (!budget.id) {
      toast.error("Invalid budget ID");
      return;
    }
    
    try {
      const result = await deleteBudgetItem(budget.id);
      if (result.success) {
        toast.success("Budget item deleted successfully");
        loadBudgets();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete budget item");
    }
  };

  const handleSubmitBudget = async (budget) => {
    try {
      const result = await submitBudget(projectId, { budgetId: budget.id });
      if (result.success) {
        toast.success("Budget submitted successfully");
        loadBudgets();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to submit budget");
    }
  };

  const handleAddBudget = () => {
    console.log("Add new budget");
  };

  const handleAddBudgetItem = () => {
    console.log("Add new budget item");
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const tabConfig = [
    { key: "unsubmitted", label: "Unsubmitted", color: "#f59e0b" },
    { key: "submitted", label: "Submitted", color: "#3b82f6" },
    { key: "approved", label: "Approved", color: "#10b981" }
  ];

  if (loading) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectTop}>
        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Budgets</h4>
            <h1>{budgets.length} Budget Items</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <BudgetIcon
              alt="budget icon"
              aria-label="budget icon"
              className={styles.projectIcon}
            />
          </div>
        </div>
      </div>

      <BudgetTable
        columns={BudgetTableColumns}
        data={BudgetTableData}
        content={<BudgetForm formType="editItem" />}
        itemsPerPage={8}
        showEditButton={activeTab === "unsubmitted"}
        showDeleteButton={activeTab === "unsubmitted"}
        onDelete={handleDelete}
        showCustomButton={true}
        customButtonLabel={activeTab === "unsubmitted" ? "Add Budget Item" : "Add Budget"}
        customButtonIcon={MdAdd}
        onCustomButtonClick={activeTab === "unsubmitted" ? handleAddBudgetItem : handleAddBudget}
        customButtonContent={<BudgetForm formType={activeTab === "unsubmitted" ? "item" : "add"} />}
        showSubmitButton={activeTab === "unsubmitted"}
        onSubmitBudget={handleSubmitBudget}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}