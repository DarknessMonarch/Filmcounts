"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/Auth";
import { useUserManagementStore } from "@/app/store/UserManagement";
import { useTrailStore } from "@/app/store/Trail";
import StatisticsGraph from "@/app/components/StatisticsGraph";
import styles from "@/app/styles/overview.module.css";
import { 
  MdPeople, 
  MdBusiness, 
  MdAttachMoney,
  MdLink,
  MdFavorite,
  MdKeyboardArrowDown,
  MdAccessTime,
  MdAccountCircle
} from "react-icons/md";

export default function Overview() {
  const {
    users,
    organizations,
    loading: userLoading,
    getAllUsers,
    getAllOrganizations,
  } = useUserManagementStore();

  const {
    trails,
    loading: trailLoading,
    searchTrail,
  } = useTrailStore();

  const { user, isAuth, tokens } = useAuthStore();

  const [selectedTab, setSelectedTab] = useState("Total Users");
  
  const [stats, setStats] = useState({
    totalAccounts: 0,
    income: 12000,
    individuals: 0,
    organizations: 0,
    activeSessions: 1000,
    systemHealth: "Good",
    monthlyGrowth: {
      accounts: "% Monthly",
      individuals: "% Monthly",
      organizations: "% Monthly",
    }
  });

  const tabOptions = ["Total Users", "Individual", "Organizations"];

  const isCurrentUserAdmin = () => {
    if (!user?.organizations) return false;
    
    return user.organizations.some(org => 
      org.roles && org.roles.some(role => 
        role === "ADMIN" || role === "ADMINISTRATOR"
      )
    );
  };

  useEffect(() => {
    if (tokens?.accessToken && isCurrentUserAdmin()) {
      fetchData();
      fetchRecentActivities();
    }
  }, [tokens?.accessToken]);

  useEffect(() => {
    if (users.length > 0 || organizations.length > 0) {
      const individualUsers = users.filter(u => !u.organizations || u.organizations.length === 0);
      const orgUsers = users.filter(u => u.organizations && u.organizations.length > 0);
      
      setStats(prevStats => ({
        ...prevStats,
        totalAccounts: users.length + organizations.length,
        individuals: individualUsers.length,
        organizations: organizations.length,
      }));
    }
  }, [users, organizations]);

  const fetchData = async () => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    const usersResult = await getAllUsers();
    if (!usersResult.success) {
      toast.error(usersResult.error || "Failed to fetch users");
    }

    const orgsResult = await getAllOrganizations();
    if (!orgsResult.success) {
      toast.error(orgsResult.error || "Failed to fetch organizations");
    }
  };

  const fetchRecentActivities = async () => {
    if (!tokens?.accessToken) {
      return;
    }

    // Fetch recent trail activities - limit to 5 most recent
    const trailResult = await searchTrail({
      limit: '5',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });

    if (!trailResult.success) {
      console.warn("Failed to fetch recent activities:", trailResult.error);
    }
  };

  const fetchChartData = async (period) => {
    try {
      let data;
      
      switch (selectedTab) {
        case "Total Users":
          data = {
            labels: period === "Monthly" 
              ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
              : period === "Weekly"
              ? ["Week 1", "Week 2", "Week 3", "Week 4"]
              : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: period === "Monthly"
              ? [stats.totalAccounts * 0.7, stats.totalAccounts * 0.8, stats.totalAccounts * 0.85, stats.totalAccounts * 0.9, stats.totalAccounts * 0.95, stats.totalAccounts * 0.98, stats.totalAccounts]
              : period === "Weekly"
              ? [stats.totalAccounts * 0.85, stats.totalAccounts * 0.9, stats.totalAccounts * 0.95, stats.totalAccounts]
              : [stats.totalAccounts * 0.95, stats.totalAccounts * 0.96, stats.totalAccounts * 0.97, stats.totalAccounts * 0.98, stats.totalAccounts * 0.99, stats.totalAccounts, stats.totalAccounts * 1.01]
          };
          break;
        case "Individual":
          data = {
            labels: period === "Monthly" 
              ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
              : period === "Weekly"
              ? ["Week 1", "Week 2", "Week 3", "Week 4"]
              : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: period === "Monthly"
              ? [stats.individuals * 0.6, stats.individuals * 0.7, stats.individuals * 0.8, stats.individuals * 0.85, stats.individuals * 0.9, stats.individuals * 0.95, stats.individuals]
              : period === "Weekly"
              ? [stats.individuals * 0.8, stats.individuals * 0.85, stats.individuals * 0.9, stats.individuals]
              : [stats.individuals * 0.9, stats.individuals * 0.92, stats.individuals * 0.94, stats.individuals * 0.96, stats.individuals * 0.98, stats.individuals, stats.individuals * 1.02]
          };
          break;
        case "Organizations":
          data = {
            labels: period === "Monthly" 
              ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
              : period === "Weekly"
              ? ["Week 1", "Week 2", "Week 3", "Week 4"]
              : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: period === "Monthly"
              ? [stats.organizations * 0.5, stats.organizations * 0.6, stats.organizations * 0.7, stats.organizations * 0.8, stats.organizations * 0.85, stats.organizations * 0.9, stats.organizations]
              : period === "Weekly"
              ? [stats.organizations * 0.7, stats.organizations * 0.8, stats.organizations * 0.9, stats.organizations]
              : [stats.organizations * 0.85, stats.organizations * 0.87, stats.organizations * 0.89, stats.organizations * 0.91, stats.organizations * 0.93, stats.organizations * 0.95, stats.organizations]
          };
          break;
        default:
          data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            values: [0, 0, 0, 0, 0, 0, 0]
          };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    if (isToday) {
      return `Today ${timeStr}`;
    } else if (isYesterday) {
      return `Yesterday ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const getActivityDescription = (trail) => {
    const { action, resource, details } = trail;
    
    switch (action?.toLowerCase()) {
      case 'create':
        return `Created ${resource}: ${details?.name || details?.email || 'New item'}`;
      case 'update':
        return `Updated ${resource}: ${details?.name || details?.email || 'Item modified'}`;
      case 'delete':
        return `Deleted ${resource}: ${details?.name || details?.email || 'Item removed'}`;
      case 'login':
        return `User login: ${details?.email || 'User authenticated'}`;
      case 'logout':
        return `User logout: ${details?.email || 'User signed out'}`;
      case 'block':
        return `Blocked user: ${details?.email || details?.name || 'User blocked'}`;
      case 'unblock':
        return `Unblocked user: ${details?.email || details?.name || 'User unblocked'}`;
      case 'config_update':
        return `Config updated: ${details?.configType || 'System configuration'}`;
      default:
        return `${action} ${resource}${details?.name ? `: ${details.name}` : ''}`;
    }
  };

  const getUserInitials = (trail) => {
    if (trail.user?.name) {
      return trail.user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (trail.user?.email) {
      return trail.user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topSection}>
        <div className={styles.leftPanel}>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Available accounts</div>
                <div className={styles.statValue}>{stats.totalAccounts.toLocaleString()}</div>
              </div>
              <div className={`${styles.statIcon} ${styles.accountsIcon}`}>
                <MdPeople />
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Income</div>
                <div className={styles.statValue}>Ksh {stats.income.toLocaleString()}</div>
                <div className={styles.statGrowth}>+5.6% from last month</div>
              </div>
              <div className={`${styles.statIcon} ${styles.incomeIcon}`}>
                <MdAttachMoney />
              </div>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Individual</div>
                <div className={styles.statValue}>{stats.individuals.toLocaleString()}</div>
                <div className={styles.statGrowth}>% of visitors</div>
              </div>
              <div className={`${styles.statIcon} ${styles.individualIcon}`}>
                <MdPeople />
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Organizations</div>
                <div className={styles.statValue}>{stats.organizations.toLocaleString()}</div>
                <div className={styles.statGrowth}>% of visitors</div>
              </div>
              <div className={`${styles.statIcon} ${styles.organizationIcon}`}>
                <MdBusiness />
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTabs}>
                {tabOptions.map((tab) => (
                  <button
                    key={tab}
                    className={`${styles.tabBtn} ${selectedTab === tab ? styles.active : ""}`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className={styles.viewAll}>
                View all <MdKeyboardArrowDown />
              </div>
            </div>

            {/* Replace the hardcoded chart area with StatisticsGraph */}
            <div className={styles.chartArea}>
              <StatisticsGraph
                fetchDataFunction={fetchChartData}
                title={selectedTab}
                lineColor="#26cf96"
                periodOptions={["Monthly", "Weekly", "Daily"]}
              />
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.rightStatsRow}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Active Sessions</div>
                <div className={styles.statValue}>{stats.activeSessions.toLocaleString()}</div>
                <div className={styles.statGrowth}>+2.5% from last month</div>
              </div>
              <div className={`${styles.statIcon} ${styles.sessionsIcon}`}>
                <MdLink />
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>System Health</div>
                <div className={styles.healthStatus}>{stats.systemHealth}</div>
                <div className={styles.healthSubtext}>All service operational</div>
              </div>
              <div className={`${styles.statIcon} ${styles.healthIcon}`}>
                <MdFavorite />
              </div>
            </div>
          </div>

          <div className={styles.activitiesPanel}>
            <div className={styles.activitiesHeader}>
              <div className={styles.activitiesTitle}>Recent activities</div>
              <div className={styles.viewAll}>
                View all <MdKeyboardArrowDown />
              </div>
            </div>
            
            <div className={styles.activitiesContent}>
              {trailLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner}></div>
                  <span>Loading activities...</span>
                </div>
              ) : trails && trails.length > 0 ? (
                trails.map((trail, index) => (
                  <div key={trail._id || index} className={styles.activityItem}>
                    <div className={styles.activityAvatar}>
                      {trail.user?.avatar ? (
                        <img src={trail.user.avatar} alt="User" className={styles.avatarImg} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {getUserInitials(trail)}
                        </div>
                      )}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>
                        {getActivityDescription(trail)}
                      </div>
                      <div className={styles.activityMeta}>
                        <MdAccessTime size={12} />
                        <span className={styles.activityTime}>
                          {formatTimestamp(trail.timestamp)}
                        </span>
                        {trail.ipAddress && (
                          <span className={styles.activityIp}>
                            • {trail.ipAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <MdAccountCircle size={32} />
                  <span>No recent activities</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}