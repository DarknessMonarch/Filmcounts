"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/Auth";
import FormDropdown from "@/app/components/FormDropdown";
import UserManagementTable from "@/app/components/UserManagementTable";
import styles from "@/app/styles/usermanagement.module.css";
import { useUserManagementStore } from "@/app/store/UserManagement";
import {
  MdPeople,
  MdBusiness,
  MdFilterList,
} from "react-icons/md";

export default function UserManagement() {
  const {
    users,
    organizations,
    loading,
    getAllUsers,
    getAllOrganizations,
    blockUser,
    unblockUser,
    deleteUser,
    clearUserManagementData,
  } = useUserManagementStore();

  const { user, isAuth, tokens } = useAuthStore();

  const [activeTab, setActiveTab] = useState("users");
  const [filterRole, setFilterRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const [stats, setStats] = useState({
    totalAccounts: 0,
    individuals: 0,
    organizations: 0,
    monthlyGrowth: {
      accounts: "% Monthly",
      individuals: "% Monthly",
      organizations: "% Monthly",
    },
  });

  // Get user display name - prioritize username, fallback to email prefix
  const getUserDisplayName = (userItem) => {
    if (!userItem) return 'Unknown User';
    
    if (userItem.username) return userItem.username;
    if (userItem.name) return userItem.name;
    
    // If no username/name, use the part before @ in email
    if (userItem.email) {
      return userItem.email.split('@')[0];
    }
    
    return 'Unknown User';
  };

  const isCurrentUserAdmin = () => {
    if (!user?.organizations) return false;
    
    return user.organizations.some(org => 
      org.roles && org.roles.some(role => 
        role === "ADMIN" || role === "ADMINISTRATOR"
      )
    );
  };

  const getUserOrganizationsInfo = (userItem) => {
    if (!userItem.organizations || userItem.organizations.length === 0) {
      return { orgNames: [], roles: [] };
    }

    const orgNames = userItem.organizations.map(org => org.organization?.name || 'Unknown Org');
    const allRoles = userItem.organizations.flatMap(org => org.roles || []);
    const uniqueRoles = [...new Set(allRoles)];

    return { orgNames, roles: uniqueRoles };
  };

  useEffect(() => {
    if (users.length > 0 || organizations.length > 0) {
      const individualUsers = users.filter(u => !u.organizations || u.organizations.length === 0);
      const orgUsers = users.filter(u => u.organizations && u.organizations.length > 0);
      
      setStats({
        totalAccounts: users.length + organizations.length,
        individuals: individualUsers.length,
        organizations: organizations.length,
        monthlyGrowth: {
          accounts: "% Monthly",
          individuals: "% Monthly", 
          organizations: "% Monthly",
        },
      });
    }
  }, [users, organizations]);

  const roleOptions = [
    { label: "All Roles", value: null },
    { label: "Admin", value: "ADMIN" },
    { label: "Manager", value: "MANAGER" },
    { label: "Finance", value: "FINANCE" },
    { label: "Viewer", value: "VIEWER" },
    { label: "Individual", value: "INDIVIDUAL" },
  ];

  const statusOptions = [
    { label: "All Status", value: null },
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
    { label: "Pending", value: "pending" },
  ];

  useEffect(() => {
    if (tokens?.accessToken && isCurrentUserAdmin()) {
      fetchData();
    }
  }, [tokens?.accessToken, activeTab]);

  const fetchData = async () => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    if (activeTab === "users") {
      const result = await getAllUsers(tokens.accessToken);
      if (!result.success) {
        toast.error(result.error || "Failed to fetch users");
      }
    } else {
      const result = await getAllOrganizations(tokens.accessToken);
      if (!result.success) {
        toast.error(result.error || "Failed to fetch organizations");
      }
    }
  };

  const handleBlockUser = async (userId) => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    const result = await blockUser(userId, tokens.accessToken);
    if (result.success) {
      toast.success("User blocked successfully");
      fetchData(); // Refresh data
    } else {
      toast.error(result.error || "Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    const result = await unblockUser(userId, tokens.accessToken);
    if (result.success) {
      toast.success("User unblocked successfully");
      fetchData(); // Refresh data
    } else {
      toast.error(result.error || "Failed to unblock user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      const result = await deleteUser(userId, tokens.accessToken);
      if (result.success) {
        toast.success("User deleted successfully");
        fetchData(); // Refresh data
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    }
  };

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // Implement edit functionality
    toast.info("Edit functionality coming soon");
  };

  const handleAddUser = () => {
    console.log("Add user clicked");
    // Implement add user functionality
    toast.info("Add user functionality coming soon");
  };

  const exportData = () => {
    const dataToExport = getFilteredData().map(item => ({
      id: item._id || item.id,
      name: getUserDisplayName(item),
      email: item.email,
      phone: item.phone_number,
      organizations: activeTab === "users" 
        ? getUserOrganizationsInfo(item).orgNames 
        : undefined,
      roles: activeTab === "users" 
        ? getUserOrganizationsInfo(item).roles 
        : undefined,
      status: item.isBlocked ? "blocked" : (item.isActive === false ? "pending" : "active"),
      createdAt: item.createdAt,
    }));

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab}-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const getFilteredData = () => {
    const data = activeTab === "users" ? users : organizations;
    return data.filter((item) => {
      const matchesRole = !filterRole || (() => {
        if (activeTab === "users") {
          if (filterRole.value === "INDIVIDUAL") {
            return !item.organizations || item.organizations.length === 0;
          }
          
          if (item.organizations && item.organizations.length > 0) {
            return item.organizations.some(org => 
              org.roles && org.roles.includes(filterRole.value)
            );
          }
          return false;
        }
        return true;
      })();

      const matchesStatus =
        !filterStatus ||
        (filterStatus.value === "blocked"
          ? item.isBlocked
          : filterStatus.value === "active"
          ? !item.isBlocked && item.isActive !== false
          : filterStatus.value === "pending"
          ? item.isActive === false
          : true);

      return matchesRole && matchesStatus;
    });
  };

  const getEnhancedData = () => {
    const data = getFilteredData();
    return data.map(item => ({
      ...item,
      displayName: getUserDisplayName(item),
      organizationsInfo: getUserOrganizationsInfo(item)
    }));
  };

  // Create add user form content (you can customize this)
  const addUserFormContent = (
    <div style={{ padding: '20px' }}>
      <h2>Add New {activeTab === "users" ? "User" : "Organization"}</h2>
      <p>Add user form would go here...</p>
      {/* Add your form components here */}
    </div>
  );

  return (
    <div className={styles.userManagementContainer}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Accounts</div>
            <div className={`${styles.statNumber} ${styles.accounts}`}>
              <h1>{stats.totalAccounts.toLocaleString()}</h1>
              <span>{stats.monthlyGrowth.accounts}</span>
            </div>
          </div>
          <div className={styles.statIcon}>
            <MdPeople />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Individual Users</div>
            <div className={`${styles.statNumber} ${styles.individual}`}>
              <h1>{stats.individuals.toLocaleString()}</h1>
              <span>{stats.monthlyGrowth.individuals}</span>
            </div>
          </div>
          <div className={`${styles.statIcon} ${styles.individual}`}>
            <MdPeople />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Organizations</div>
            <div className={`${styles.statNumber} ${styles.organization}`}>
              <h1>{stats.organizations.toLocaleString()}</h1>
              <span>{stats.monthlyGrowth.organizations}</span>
            </div>
          </div>
          <div className={`${styles.statIcon} ${styles.organization}`}>
            <MdBusiness />
          </div>
        </div>
      </div>

      <div className={styles.managementContent}>
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "users" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <MdPeople /> Users
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "organizations" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("organizations")}
          >
            <MdBusiness /> Organizations
          </button>
        </div>

        <div className={styles.filtersSection}>
          <FormDropdown
            options={roleOptions}
            value={filterRole}
            onSelect={setFilterRole}
            dropPlaceHolder="Filter by Role"
            Icon={<MdFilterList />}
          />

          <FormDropdown
            options={statusOptions}
            value={filterStatus}
            onSelect={setFilterStatus}
            dropPlaceHolder="Filter by Status"
            Icon={<MdFilterList />}
          />
        </div>

        <UserManagementTable
          title={activeTab === "users" ? "Users" : "Organizations"}
          data={getEnhancedData()}
          loading={loading}
          itemsPerPage={10}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
          onExport={exportData}
          onRefresh={fetchData}
          onAdd={handleAddUser}
          showRefreshButton={true}
          showAddButton={true}
          refreshButtonLabel="Refresh"
          addButtonLabel={`Add ${activeTab === "users" ? "User" : "Organization"}`}
          addButtonContent={addUserFormContent}
          refreshLoading={loading}
          getUserDisplayName={getUserDisplayName}
          getUserOrganizationsInfo={getUserOrganizationsInfo}
        />
      </div>
    </div>
  );
}