"use client";

import { toast } from "sonner";
import { useState } from "react";
import Popup from "@/app/components/Popup"; 
import Nothing from "@/app/components/Nothing";
import styles from "@/app/styles/table.module.css";
import NoDataImg from "@/public/assets/noData.png";

import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdChevronLeft as LeftIcon,
  MdChevronRight as RightIcon,
  MdOutlineFileDownload as DownloadIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
  MdBlock as BlockIcon,
  MdCheckCircle as UnblockIcon,
  MdMoreVert as MoreIcon,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdPeople,
  MdBusiness,
  MdRefresh,
  MdAdd,
} from "react-icons/md";

export default function UserManagementTable({
  title,
  data = [],
  itemsPerPage = 10,
  onEdit,
  onDelete,
  onBlock,
  onUnblock,
  onExport,
  loading = false,
  getUserDisplayName,
  getUserOrganizationsInfo,
  showRefreshButton = false,
  showAddButton = false,
  onRefresh,
  onAdd,
  refreshButtonLabel = "Refresh",
  addButtonLabel = "Add User",
  addButtonContent,
  refreshLoading = false,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showActions, setShowActions] = useState({});
  const [addModalOpen, setAddModalOpen] = useState(false);

  const toggleAddModal = () => {
    setAddModalOpen(!addModalOpen);
  };

  const filteredData = data.filter((item) => {
    const displayName = item.displayName || getUserDisplayName?.(item) || item.name || item.username || 'Unknown';
    return (
      searchTerm === "" ||
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone_number?.includes(searchTerm)
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

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === currentItems.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(currentItems.map((item) => item._id || item.id)));
    }
  };

  const toggleActions = (id) => {
    setShowActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownload = () => {
    if (onExport) {
      onExport();
    } else {
      const dataStr = JSON.stringify(filteredData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    }
    
    if (addButtonContent) {
      toggleAddModal();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (item) => {
    if (item.isBlocked) {
      return (
        <span className={`${styles.statusBadge} ${styles.statusFailed}`}>
          Blocked
        </span>
      );
    }
    if (item.isActive === false) {
      return (
        <span className={`${styles.statusBadge} ${styles.statusPending}`}>
          Pending
        </span>
      );
    }
    return (
      <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
        Active
      </span>
    );
  };

  const handleEdit = (item) => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = (item) => {
    if (onDelete) {
      onDelete(item._id || item.id);
    }
  };

  const handleBlock = (item) => {
    if (onBlock) {
      onBlock(item._id || item.id);
    }
  };

  const handleUnblock = (item) => {
    if (onUnblock) {
      onUnblock(item._id || item.id);
    }
  };

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loadingContainer}>
          <span>Loading {title.toLowerCase()}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h1>{title}</h1>
          {selectedUsers.size > 0 && (
            <span className={styles.selectedCount}>
              {selectedUsers.size} selected
            </span>
          )}
        </div>
        <div className={styles.tableControls}>
          <div className={styles.searchContainer}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {showRefreshButton && (
            <button 
              className={styles.customButton} 
              onClick={handleRefresh}
              disabled={refreshLoading}
              title={refreshButtonLabel}
            >
              <MdRefresh
                className={styles.customButtonIcon}
                aria-hidden="true"
                alt={refreshButtonLabel}
                aria-label={refreshButtonLabel}
              />
              {refreshButtonLabel}
            </button>
          )}
          
          {showAddButton && (
            <button 
              className={styles.customButton} 
              onClick={handleAdd}
              title={addButtonLabel}
            >
              <MdAdd
                className={styles.customButtonIcon}
                aria-hidden="true"
                alt={addButtonLabel}
                aria-label={addButtonLabel}
              />
              {addButtonLabel}
            </button>
          )}
          
          <button className={styles.downloadButton} onClick={handleDownload}>
            <DownloadIcon className={styles.downloadIcon} />
            Export
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {currentItems.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
                <th>User Info</th>
                <th>Contact</th>
                <th>Organizations & Roles</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => {
                const displayName = item.displayName || getUserDisplayName?.(item) || item.name || item.username || 'Unknown';
                const orgInfo = item.organizationsInfo || getUserOrganizationsInfo?.(item) || { orgNames: [], roles: [] };
                
                return (
                <tr key={item._id || item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(item._id || item.id)}
                      onChange={() => handleSelectUser(item._id || item.id)}
                      className={styles.checkbox}
                    />
                  </td>
                  
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {item.profileImage ? (
                          <img src={item.profileImage} alt={displayName} />
                        ) : (
                          <span>
                            {displayName?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>
                          {displayName}
                        </div>
                        <div className={styles.userId}>
                          ID: {(item._id || item.id)?.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className={styles.contactInfo}>
                      <div className={styles.emailCell}>
                        <MdEmail className={styles.cellIcon} />
                        {item.email}
                      </div>
                      {item.phone_number && (
                        <div className={styles.phoneCell}>
                          <MdPhone className={styles.cellIcon} />
                          {item.phone_number}
                        </div>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className={styles.orgRoleInfo}>
                      {orgInfo.orgNames && orgInfo.orgNames.length > 0 ? (
                        <>
                          <div className={styles.orgNames}>
                            {orgInfo.orgNames.map((orgName, idx) => (
                              <span key={idx} className={styles.orgBadge}>
                                {orgName}
                              </span>
                            ))}
                          </div>
                          <div className={styles.rolesList}>
                            {orgInfo.roles.map((role, idx) => (
                              <span key={idx} className={`${styles.roleBadge} ${styles[role.toLowerCase()]}`}>
                                {role}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <span className={styles.individualBadge}>Individual User</span>
                      )}
                    </div>
                  </td>

                  <td>{getStatusBadge(item)}</td>

                  <td>
                    <div className={styles.dateCell}>
                      <MdCalendarToday className={styles.cellIcon} />
                      {formatDate(item.createdAt || item.createdOn || new Date())}
                    </div>
                  </td>

                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionButton}
                        onClick={() => toggleActions(item._id || item.id)}
                      >
                        <MoreIcon />
                      </button>

                      {showActions[item._id || item.id] && (
                        <div className={styles.actionsMenu}>
                          <button 
                            onClick={() => handleEdit(item)}
                            className={styles.editButton}
                          >
                            <EditIcon /> Edit
                          </button>
                          {item.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(item)}
                              className={styles.unblockButton}
                            >
                              <UnblockIcon /> Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(item)}
                              className={styles.blockButton}
                            >
                              <BlockIcon /> Block
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item)}
                            className={styles.deleteButton}
                          >
                            <DeleteIcon /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        ) : (
          <Nothing
            NothingImage={NoDataImg}
            Text={`No ${title.toLowerCase()} found`}
            Alt={`No ${title.toLowerCase()} found`}
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
            <LeftIcon className={styles.paginationIcon} />
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={styles.paginationButton}
          >
            Next
            <RightIcon className={styles.paginationIcon} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className={styles.bulkActions}>
          <span>{selectedUsers.size} items selected</span>
          <div className={styles.bulkButtons}>
            <button className={styles.bulkBlockBtn}>
              <BlockIcon /> Block Selected
            </button>
            <button className={styles.bulkDeleteBtn}>
              <DeleteIcon /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {addButtonContent && (
        <Popup
          Top={0}
          Right={0}
          Left={0}
          Bottom={0}
          Width={500}
          Height={900}
          OnClose={toggleAddModal}
          Blur={5}
          Zindex={9999}
          BorderRadiusTopLeft={15}
          BorderRadiusTopRight={15}
          BorderRadiusBottomRight={15}
          BorderRadiusBottomLeft={15}
          Content={addButtonContent}
          IsOpen={addModalOpen}
        />
      )}
    </div>
  );
}