"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/account.module.css";
import authImage from "@/public/assets/authImage.png";
import { FaBuilding, FaUser, FaShieldAlt } from "react-icons/fa";

export default function AccountSelection() {
  const router = useRouter();
  const { user, isAuth, getUserOrganizations } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    if (!isAuth || !user) {
      router.push("/authentication/login");
      return;
    }
  }, [isAuth, user, router]);

  const handleAccountSelection = async (accountData) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setSelectedAccount(accountData.id);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (accountData.type === "organization") {
        const orgSlug = accountData.orgData.name.toLowerCase().replace(/\s+/g, '-');
        router.push(`/page/organization/${orgSlug}/dashboard`);
      } else if (accountData.type === "individual") {
        router.push("/page/user/dashboard");
      } else if (accountData.type === "admin") {
        router.push("/page/admin/overview");
      }
      
      toast.success(`Welcome to ${accountData.name}`);
    } catch (error) {
      toast.error("Failed to access account");
      setIsLoading(false);
      setSelectedAccount(null);
    }
  };

  const getAccountOptions = () => {
    if (!user) return [];
    
    const options = [];
    const organizations = getUserOrganizations();

    options.push({
      id: "individual",
      type: "individual",
      name: "Personal Account",
      description: "Access your personal dashboard",
      icon: FaUser,
      color: "tertiary"
    });

    organizations.forEach((orgData, index) => {
      const org = orgData.organization;
      const roles = orgData.roles || [];
      
      const hasAdminRole = roles.some(role => 
        role === "ADMIN" || role === "ADMINISTRATOR"
      );
      
      if (hasAdminRole) {
        options.push({
          id: `admin-${org.id}`,
          type: "admin",
          name: `${org.name} - Admin`,
          description: "Manage organization settings and users",
          icon: FaShieldAlt,
          color: "secondary",
          orgData: org
        });
      }
      
      options.push({
        id: `org-${org.id}`,
        type: "organization",
        name: org.name,
        description: `Access ${org.name} dashboard`,
        icon: FaBuilding,
        color: "primary",
        roles: roles.join(", "),
        orgData: org
      });
    });

    return options;
  };

  const accountOptions = getAccountOptions();

  if (!user || accountOptions.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.accountComponent}>
      <div className={styles.accountComponentBgImage}>
        <Image
          src={authImage}
          alt="auth background"
          fill
          sizes="100%"
          quality={100}
          style={{
            objectFit: "cover",
          }}
          priority={true}
        />
      </div>

      <div className={styles.accountWrapper}>
        <div className={styles.accountContainer}>
          <div className={styles.accountHeader}>
            <h1>Choose Your Account</h1>
            <p>Select which account you want to access</p>
          </div>

          <div className={styles.accountOptions}>
            {accountOptions.map((account) => {
              const IconComponent = account.icon;
              const isSelected = selectedAccount === account.id;
              const isCurrentlyLoading = isLoading && isSelected;

              return (
                <button
                  key={account.id}
                  onClick={() => handleAccountSelection(account)}
                  disabled={isLoading}
                  className={`${styles.accountOption} ${isSelected ? styles.selected : ''} ${styles[account.color]}`}
                >
                  <div className={`${styles.accountIcon} ${styles[`${account.color}Icon`]}`}>
                    {isCurrentlyLoading ? (
                      <div className={styles.spinner} />
                    ) : (
                      <IconComponent />
                    )}
                  </div>

                  <div className={styles.accountContent}>
                    <h3>
                      {account.name}
                      {account.roles && (
                        <span className={styles.accountRoles}>
                          ({account.roles})
                        </span>
                      )}
                    </h3>
                    <p>{account.description}</p>
                  </div>

                  <div className={styles.accountArrow}>
                    →
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.accountFooter}>
            <button
              onClick={() => router.push("/authentication/login")}
              disabled={isLoading}
              className={styles.backButton}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}