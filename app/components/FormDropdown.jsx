"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/styles/dropdown.module.css";
import { IoIosSearch as SearchIcon } from "react-icons/io";
import { MdKeyboardArrowDown as DropdownIcon } from "react-icons/md";

export default function SearchableDropdown({
  options = [], 
  value = null,
  onSelect,
  Icon,
  dropPlaceHolder,
  nameKey = "label",
  valueKey = "value", 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Display text for the selected option
  const getDisplayText = () => {
    if (value) {
      return value[nameKey];
    }
    return dropPlaceHolder || "Select an option";
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => {
        // Check if the option has the property we're looking for
        if (option[nameKey]) {
          return option[nameKey].toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options, nameKey]);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setFilteredOptions(options);
    }
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdownInput} onClick={toggleDropdown}>
        {Icon && Icon}
        <span>{getDisplayText()}</span>
        <DropdownIcon
          className={styles.dropdownIcon}
          alt="Dropdown icon"
          width={24}
          height={24}
        />
      </div>
      
      {isOpen && (
        <div className={styles.dropdownArea}>
          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} height={20} alt="Search icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className={styles.searchInput}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <span 
                  key={option[valueKey] || option.id || Math.random().toString(36).substring(7)} 
                  onClick={() => handleSelect(option)}
                  className={styles.optionItem}
                >
                  {option[nameKey]}
                </span>
              ))
            ) : (
              <span className={styles.noResults}>No results found</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}