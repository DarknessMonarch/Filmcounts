"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/notfound.module.css";
import NotFoundImage from "@/public/assets/notfound.png";

import { MdKeyboardDoubleArrowRight as BackIcon } from "react-icons/md";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuth } = useAuthStore();

  const goBack = () => {
    if (isAuth) {
      const userType = pathname.split("/")[2]; 
      router.push(`/page/${userType}`);
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.notFound}>
      <Image
        className={styles.notFoundImg}
        src={NotFoundImage}
        height={240}
        alt="Not found image"
        priority={true}
      />
      <h1>404 Not Found</h1>
      <div className={styles.buttonGroup}>
        <button className={styles.notFoundBtn} onClick={goBack}>
          Go Back <BackIcon className={styles.backIcon} aria-hidden="true" />
        </button>
        {isAuth && (
          <button className={styles.notFoundBtn} onClick={goToDashboard}>
            Dashboard{" "}
            <BackIcon className={styles.backIcon} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
