"use client";

import Link from "next/link";
import Image from "next/image";
import AdBg from "@/public/assets/ads.png";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/sideNav.module.css";
import { usePathname, useRouter } from "next/navigation";
import ColoredLogo from "@/public/assets/coloredlogo.png";

import { HiChartBar as OverviewIcon } from "react-icons/hi";
import { BsBuildingsFill as CompanyIcon } from "react-icons/bs";
import { FaBoxArchive as SupplierIcon } from "react-icons/fa6";
import { GiTakeMyMoney as BudgetIcon} from "react-icons/gi";
import {
  HiMiniUserGroup as TeamIcon,
  HiMiniUser as UserIcon,
} from "react-icons/hi2";
import { IoFolderOpen as ProjectIcon } from "react-icons/io5";
import {
  MdWindow as DashboardIcon,
  MdSettings as SettingsIcon,
} from "react-icons/md";
import { TbHelpSquareRoundedFilled as HelpIcon } from "react-icons/tb";
import { IoIosAlbums as SidePanelIcon } from "react-icons/io";

import { HiMiniUsers as UsersIcon } from "react-icons/hi2";
import { IoIosAlbums as AuditTrailIcon } from "react-icons/io";
import { MdSettingsInputComposite as ConfigurationIcon } from "react-icons/md";
import { SiOnlyoffice as DepartmentIcon } from "react-icons/si";
export default function SideNavComponent() {
  const { user, isAuth } = useAuthStore();
  const { isOpen, toggleDrawer } = useDrawerStore();
  const [isMobile, setMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const getUserType = () => {
    if (pathname.includes("/page/admin/")) {
      return "admin";
    } else if (pathname.includes("/page/organization/")) {
      return "organization";
    } else if (pathname.includes("/page/user/")) {
      return "user";
    }
    return "user";
  };

  const userType = getUserType();

  const getOrganizationSlug = () => {
    if (userType === "organization") {
      const pathParts = pathname.split("/");
      const orgIndex = pathParts.indexOf("organization");
      if (orgIndex !== -1 && pathParts[orgIndex + 1]) {
        return pathParts[orgIndex + 1];
      }
    }
    return null;
  };

  const organizationSlug = getOrganizationSlug();

  const getUserDisplayName = () => {
    if (!user) return "User";

    if (user.username) return user.username;

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  const isUserAdmin = () => {
    if (!user?.organizations) return false;

    return user.organizations.some(
      (org) =>
        org.roles &&
        org.roles.some((role) => role === "ADMIN" || role === "ADMINISTRATOR")
    );
  };

  const getUserOrganizations = () => {
    return user?.organizations || [];
  };

  const hasRole = (roleName) => {
    if (!user?.organizations) return false;

    return user.organizations.some(
      (org) =>
        org.roles &&
        org.roles.some((role) => role.toUpperCase() === roleName.toUpperCase())
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getBasePath = () => {
    if (userType === "admin") {
      return "/page/admin/";
    } else if (userType === "organization" && organizationSlug) {
      return `/page/organization/${organizationSlug}/`;
    } else {
      return "/page/user/";
    }
  };

  const isLinkActive = (href) => {
    const fullPath = getBasePath() + href;

    if (pathname === fullPath) return true;

    const linkLastSegment = href.split("/").pop();
    return pathname.includes(`/${linkLastSegment}`);
  };

  const navLinks = {
    user: [
      {
        href: "dashboard",
        icon: (
          <DashboardIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Dashboard",
      },
      {
        href: "projects",
        icon: <ProjectIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Projects",
      },
    ],
    organization: [
      {
        href: "dashboard",
        icon: (
          <DashboardIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Dashboard",
      },
      {
        href: "company",
        icon: <CompanyIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Company",
      },
      {
        href: "suppliers",
        icon: (
          <SupplierIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Suppliers",
      },
      {
        href: "departments",
        icon: (
          <DepartmentIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Departments",
      },
      {
        href: "projects",
        icon: <ProjectIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Projects",
      },

      {
        href: "budget",
        icon: <BudgetIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Budget",
      },
      {
        href: "team",
        icon: <TeamIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Team",
      }
    ],
    admin: [
      {
        href: "overview",
        icon: (
          <OverviewIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Overview",
      },
      {
        href: "users",
        icon: <UsersIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Users Management",
      },
      {
        href: "audit",
        icon: (
          <AuditTrailIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Audit Trail",
      },
      {
        href: "configuration",
        icon: (
          <ConfigurationIcon
            className={styles.sideNavIcon}
            aria-hidden="true"
          />
        ),
        label: "System Configuration",
      },
    ],
    utilities: [
      {
        href: "settings",
        icon: (
          <SettingsIcon className={styles.sideNavIcon} aria-hidden="true" />
        ),
        label: "Settings",
      },
      {
        href: "help",
        icon: <HelpIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Help Center",
      },
    ],
  };

  const getNavLinks = () => {
    let links = [];

    if (userType === "organization") {
      links = [...navLinks.organization];
    } else if (userType === "admin") {
      links = [...navLinks.admin];
    } else {
      links = [...navLinks.user];
    }

    return links;
  };

  if (isMobile && !isOpen) {
    return null;
  }

  const CloseSideNav = () => {
    if (!isMobile && isOpen) {
      toggleDrawer();
    }
  };

  const shouldShowOrgPrompt = () => {
    return (
      userType === "user" &&
      isAuth &&
      user &&
      getUserOrganizations().length === 0
    );
  };

  return (
    <div
      className={`${styles.sideNavContainer} ${
        isOpen ? styles.showSideNav : ""
      }`}
    >
      <div className={styles.sideNavTop}>
        <Image
          className={styles.logoImg}
          src={ColoredLogo}
          alt="logo"
          height={40}
          priority={true}
        />
        <div onClick={CloseSideNav}>
          <SidePanelIcon
            className={styles.sidepanelicon}
            aria-hidden="true"
            aria-label="side panel icon"
          />
        </div>
      </div>

      <div className={styles.sideNavScroller}>
        <div className={styles.sideNavScrollerTop}>
          {getNavLinks().map((link, index) => (
            <Link
              key={index}
              href={`${getBasePath()}${link.href}`}
              className={`${styles.sideNavLinkContainer} ${
                isLinkActive(link.href) ? styles.activesideNav : ""
              }`}
            >
              <div className={styles.sideNavLinkIconContainer}>{link.icon}</div>
              <h1>{link.label}</h1>
            </Link>
          ))}
        </div>

        <div className={styles.sideNavUtilities}>
          {navLinks.utilities.map((link, index) => (
            <Link
              key={index}
              href={`${getBasePath()}${link.href}`}
              className={`${styles.sideNavLinkContainer} ${
                isLinkActive(link.href) ? styles.activesideNav : ""
              }`}
            >
              <div className={styles.sideNavLinkIconContainer}>{link.icon}</div>
              <h1>{link.label}</h1>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.sideNavBottom}>
        {shouldShowOrgPrompt() ? (
          <div className={`${styles.sideNavAdverts} skeleton`}>
            <Image
              className={styles.advertImage}
              src={AdBg}
              alt="Advertisement"
              fill
              sizes="100%"
              priority={true}
            />
            <div className={styles.advertText}>
              <h1>Have an organisation?</h1>
              <p>
                Sign up for more features such as team management among other
                features
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.userInfo}>
            {isAuth && user && (
              <>
                <div className={styles.userDetails}>
                  <h3>{getUserDisplayName()}</h3>
                  <p>{user.email}</p>
                  {getUserOrganizations().length > 0 && (
                    <div className={styles.userOrgs}>
                      <small>
                        {getUserOrganizations()
                          .map((org) => org.organization.name)
                          .join(", ")}
                      </small>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
