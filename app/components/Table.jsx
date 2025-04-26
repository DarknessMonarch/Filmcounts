"use client";

import { toast } from "sonner";
import { useState } from "react";
import Popup from "@/app/components/Popup";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/styles/table.module.css";
import NoDataImg from "@/public/assets/noData.png";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdChevronLeft as LeftIcon,
  MdChevronRight as RightIcon,
  MdOutlineFileDownload as DownloadIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
} from "react-icons/md";

export default function ReusableTable({
  title,
  columns,
  data,
  content,
  itemsPerPage = 4,
  clickable = false,
  clickKeyField = "projectName",
  showEditButton = true,
  showDeleteButton = true,
  statusKey = "status",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleEdit = (id) => {
    toggleModal();
    const params = new URLSearchParams(searchParams);
    ["projectEdit", "projectAdd", `${title}Edit`].forEach((key) => params.delete(key));
  
    params.set(`${title}Edit`, id);
    router.push(`${pathname}?${params.toString()}`);  
  };

  const handleDelete = (projectId) => {
    toast.error("Project deleted successfully!", {
      style: {
        border: "1px solid #ff3b3b",
        background: "#fcadad",
        color: "#ff3b3b",
      },
    });
  };


  const filteredData = data.filter((item) => {
    return Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    toast.success("Download successful");
 
  };

  const handleRowClick = (item) => {
    if (clickable && item[clickKeyField]) {
      router.push(`${pathname}/${item[clickKeyField]}`, { scroll: false });
    }
  };

  const getStatusStyle = (status) => {
    if (!status) return "";

    const normalizedStatus = status.toString().toLowerCase();

    if (normalizedStatus === "approved") {
      return styles.statusApproved;
    } else if (normalizedStatus === "failed") {
      return styles.statusFailed;
    } else if (normalizedStatus === "pending") {
      return styles.statusPending;
    }

    return "";
  };

  const renderCellContent = (item, column) => {
    const value = item[column.key];
    if (column.key === statusKey) {
      return (
        <span className={`${styles.statusBadge} ${getStatusStyle(value)}`}>
          {value}
        </span>
      );
    }

    return value;
  };

  const showActionColumn = showEditButton || showDeleteButton;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h1>{title}</h1>
        <div className={styles.tableControls}>
          <div className={styles.searchContainer}>
            <SearchIcon
              className={styles.searchIcon}
              aria-hidden="true"
              alt="Search"
              aria-label="Search"
            />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <input
            type="date"
            className={styles.dateInput}
            value={currentDate}
            onChange={handleDateChange}
          />
          <button className={styles.downloadButton} onClick={handleDownload}>
            <DownloadIcon
              className={styles.downloadIcon}
              aria-hidden="true"
              alt="Download"
              aria-label="Download"
            />
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        {currentItems.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.label}</th>
                ))}
                {showActionColumn && (
                  <th className={styles.actionColumn}>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item)}
                  className={clickable ? styles.clickableRow : ""}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{renderCellContent(item, column)}</td>
                  ))}
                  {showActionColumn && (
                    <td>
                      <div className={styles.actionButtons}>
                        {showEditButton && (
                          <button
                            className={styles.editButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            <EditIcon
                              aria-hidden="true"
                              alt="Edit"
                              aria-label="Edit"
                              className={styles.actionIcon}

                            />
                          </button>
                        )}
                        {showDeleteButton && (
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                          >
                            <DeleteIcon
                              aria-hidden="true"
                              alt="Delete"
                              aria-label="Delete"
                              className={styles.actionIcon}
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Nothing
            NothingImage={NoDataImg}
            Text="No data found"
            Alt="No data found"
          />
        )}
      </div>

      <div className={styles.paginationContainer}>
        <h2>
          Page {currentPage} of {totalPages || 1}
        </h2>
        <div className={styles.paginationControls}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            <LeftIcon
              aria-hidden="true"
              alt="Previous"
              aria-label="Previous"
              className={styles.paginationIcon}
            />
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={styles.paginationButton}
          >
            Next
            <RightIcon
              aria-hidden="true"
              alt="Next"
              aria-label="Next"
              className={styles.paginationIcon}
            />
          </button>
        </div>
      </div>
      <Popup
            Top={0}
            Right={0}
            Left={0}
            Bottom={0}
            Width={500}
            Height={900}
            OnClose={toggleModal}
            Blur={5}
            Zindex={9999}
            BorderRadiusTopLeft={15}
            BorderRadiusTopRight={15}
            BorderRadiusBottomRight={15}
            BorderRadiusBottomLeft={15}
            Content={content}
            IsOpen={modalOpen}
          />
        
    </div>
  );
}
