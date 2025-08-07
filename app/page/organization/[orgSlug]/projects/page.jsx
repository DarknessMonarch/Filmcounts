"use client";

import { useState, useEffect } from "react";
import Banner from "@/public/assets/banner.png";
import styles from "@/app/styles/project.module.css";
import ProjectCard from "@/app/components/role/ProjectCard";

import { IoIosWallet as WalletIcon } from "react-icons/io";
import { BsProjectorFill as ProjectIcon } from "react-icons/bs";

export default function Project() {
  const projectDetails = [
    {
      amount: "Ksh 80,000",
      project: 20,
    },
  ];

  const data = [
    {
      id: "task1",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Pending",
      amount: "80,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:null,
      team: [
        {
          id: "1",
          name: "John Doe",
          role: "Project Manager",
          image: Banner,
        },
        {
          id: "2",
          name: "Jane Smith",
          role: "Developer",
          image: Banner,
        },
        {
          id: "3",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },
    {
      id: "task2",
      title: "Buy Chicken",
      description: "Immah drive an f1",
      status: "Approved",
      amount: "30,000",
      currency: "Ksh",
      dueOn: "26/03/2025 13:00 am",
      createdAt: "March 25 2025 12:00 pm",
      image:Banner,
      team: [
    
        {
          id: "1",
          name: "Alice Johnson",
          role: "Designer",
          image: Banner,
        }
      ]
    },

  ];

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectTop}>
        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Spending</h4>
            <h1>{projectDetails[0].amount}</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <WalletIcon
              alt="wallet icon"
              aria="wallet icon"
              aria-label="wallet icon"
              className={styles.projectIcon}
            />
          </div>
        </div>
        <div className={styles.projectTopCard}>
          <div className={styles.projectTopWrapperInner}>
            <h4>Projects</h4>
            <h1>{data.length}</h1>
          </div>
          <div className={styles.projectIconWrapper}>
            <ProjectIcon
              alt="project icon"
              aria="project icon"
              aria-label="project icon"
              className={styles.projectIcon}
            />
          </div>
        </div>
      </div>
      <ProjectCard data={data} />
    </div>
  );
}
