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
import {
  BsBuildingsFill as CompanyIcon,
  BsClipboardFill as AuditTrailIcon,
} from "react-icons/bs";
import { FaBoxArchive as SupplierIcon } from "react-icons/fa6";
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

export default function SideNavComponent() {
  const [username, setUsername] = useState("penguin");
  const [userType, setUserType] = useState("user");
  const { isOpen, toggleDrawer } = useDrawerStore();
  const { isAuth, toggleAuth } = useAuthStore();
  const [isMobile, setMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
    } else if (userType === "organization") {
      return "/page/organization/";
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
        href: "projects",
        icon: <ProjectIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Projects",
      },
      {
        href: "team",
        icon: <TeamIcon className={styles.sideNavIcon} aria-hidden="true" />,
        label: "Team",
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
        icon: <UserIcon className={styles.sideNavIcon} aria-hidden="true" />,
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
          <AuditTrailIcon className={styles.sideNavIcon} aria-hidden="true" />
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
            <h1>Have an organisation</h1>
            <p>
              Sign up for more features such as team management among other
              features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}