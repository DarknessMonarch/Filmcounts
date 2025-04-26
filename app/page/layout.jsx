"use client";

import styles from "@/app/styles/pageLayout.module.css";
import DeskNavbar from "@/app/components/Desknavbar";
import { useDrawerStore } from "@/app/store/Drawer";
import SideNav from "@/app/components/SideNav";
import { usePathname } from "next/navigation";

export default function PageLayout({ children }) {
  const { isOpen, toggleDrawer } = useDrawerStore();
  const pathname = usePathname();

  const CloseSideNav = () => {
    if (window.innerWidth < 768 && isOpen) {
      toggleDrawer();
    }
  };

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const lastSegment =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "home";

  const description = (() => {
    const formattedSegment = lastSegment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const defaultDescriptions = {
      dashboard: "Keep track of your projects and their metrics.",
      about: "Learn more about us and our mission.",
      projects: "Manage your projects and their metrics.",
    };

    return (
      defaultDescriptions[lastSegment] ||
      `${formattedSegment} - Manage and view your ${lastSegment.toLowerCase()} information.`
    );
  })();

  return (
    <div className={styles.pageLayout} onClick={CloseSideNav}>
      <SideNav />
      <div className={styles.pageContent}>
        <DeskNavbar
          title={
            lastSegment.charAt(0).toUpperCase() +
            lastSegment.slice(1).replace(/-/g, " ")
          }
          info={description}
        />

        {children}
      </div>
    </div>
  );
}
