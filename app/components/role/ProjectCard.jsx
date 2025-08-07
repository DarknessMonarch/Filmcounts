"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import Popup from "@/app/components/Popup";
import styles from "@/app/styles/projectCard.module.css";
import ProjectCardForm from "@/app/components/form/ProjectCardForm";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from "react-icons/md";
import { IoAddOutline as AddIcon } from "react-icons/io5";

export default function ProjectCard({ data }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleEdit = (e, projectId) => {
    e.stopPropagation(); 
    toggleModal();
    const params = new URLSearchParams(searchParams);
    ["project", "projectEdit", "projectAdd", "id"].forEach((key) => params.delete(key));

    params.set("project", "edit");
    params.set("id", projectId);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleAdd = () => {
    toggleModal();
    const params = new URLSearchParams(searchParams);
    ["project", "projectEdit", "projectAdd", "id"].forEach((key) => params.delete(key));

    params.set("project", "add");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = (e, projectId) => {
    e.stopPropagation(); 
    toast.error("Project deleted successfully!", {
      style: {
        border: "1px solid #ff3b3b",
        background: "#fcadad",
        color: "#ff3b3b",
      },
    });
  };

  const handleSingleClick = (name) => {
    router.push(`${pathname}/${name}`, { scroll: false });
  };

  return (
    <div className={styles.projectcardContainer}>
      {data.map((project, index) => (
        <div
          key={index}
          onClick={() => handleSingleClick(project.title)}
          className={`${styles.projectcard} ${
            project.status.toLowerCase() === "pending" ? styles.pending : ""
          } ${
            project.status.toLowerCase() === "rejected" ? styles.rejected : ""
          }`}
        >
          <div className={styles.projectHeader}>
            <h2>Created: {project.createdAt}</h2>
            <div className={styles.projectActions}>
              <EditIcon
                onClick={(e) => handleEdit(e, project.id)}
                aria-hidden="true"
                alt="Edit"
                aria-label="Edit"
                className={styles.editIcon}
              />
              <DeleteIcon
                onClick={(e) => handleDelete(e, project.id)}
                aria-hidden="true"
                alt="Delete"
                aria-label="Delete"
                className={styles.deleteIcon}
              />
            </div>
          </div>

          <div className={styles.projectDescription}>
            <div className={styles.projectDescriptionInfo}>
              {project.image !== null ? (
                <Image
                  src={project.image}
                  height={100}
                  width={100}
                  alt={`${project.title}'s profile`}
                  priority
                  className={styles.projectImage}
                />
              ) : (
                <div className={styles.projectLetterBackground}>
                  <div className={styles.projectLetter}>
                    <h4>{project.title.charAt(0).toUpperCase()}</h4>
                  </div>
                </div>
              )}
              <div className={styles.projectDescriptionText}>
                <h3>{project.title}</h3>
                <p>ksh{project.amount}</p>
              </div>
            </div>
            <div
              className={`${styles.dataStatus} ${
                styles[project.status.toLowerCase()]
              }`}
            >
              <span>{project.status}</span>
            </div>
          </div>
          <div className={styles.projectDescriptionContent}>
            <p>{project.description}</p>
          </div>
          <div className={styles.projectFooter}>
            <div className={styles.projectUser}>
              <div className={styles.projectUser}>
                {project.team.map((member) => (
                  <div key={member.id} className={styles.projectUserImage}>
                    {member.image !== null && (
                      <Image
                        src={member.image}
                        height={20}
                        width={20}
                        alt={`${member.name}'s profile`}
                        priority
                        className={styles.teamImage}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <h2>Due: {project.dueOn}</h2>
          </div>
        </div>
      ))}

      <div className={styles.emptyCard} onClick={handleAdd}>
        <AddIcon
          alt="Add project"
          aria-label="Add project"
          className={styles.addIcon}
        />
      </div>
      <Popup
        Top={0}
        Right={0}
        Left={0}
        Bottom={0}
        Width={500}
        Height={790}
        OnClose={toggleModal}
        Blur={5}
        Zindex={9999}
        BorderRadiusTopLeft={15}
        BorderRadiusTopRight={15}
        BorderRadiusBottomRight={15}
        BorderRadiusBottomLeft={15}
        Content={<ProjectCardForm />}
        IsOpen={modalOpen}
      />
    </div>
  );
}