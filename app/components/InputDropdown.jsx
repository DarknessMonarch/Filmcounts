"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/styles/inputdropdown.module.css";
import { MdKeyboardArrowDown as DropdownIcon } from "react-icons/md";
import { IoAdd as AddIcon } from "react-icons/io5";

export default function InputDropdown({
  options = [],
  value = null,
  onSelect,
  dropPlaceHolder,
  nameKey = "name",
  valueKey = "id",
  showAddButton = false,
  addButtonText = "Add new",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [displayText, setDisplayText] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Update display text when value changes
  useEffect(() => {
    if (value && typeof value === "object") {
      setDisplayText(value[nameKey]);
    } else {
      setDisplayText(dropPlaceHolder || "Select an option");
    }
  }, [value, nameKey, dropPlaceHolder]);

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setFilteredOptions(options);
    }
  }, [isOpen, options]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) => {
        if (option[nameKey]) {
          return option[nameKey]
            .toLowerCase()
            .includes(inputValue.toLowerCase());
        }
        return false;
      });
      setFilteredOptions(filtered);
    }
  }, [inputValue, options, nameKey]);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setInputValue("");
    setDisplayText(option[nameKey]); // Update display text immediately
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleAddCustomValue = () => {
    if (inputValue.trim()) {
      const customOption = {
        [valueKey]: `custom_${Date.now()}`,
        [nameKey]: inputValue.trim(),
      };

      onSelect(customOption);
      setIsOpen(false);
      setInputValue("");
      setDisplayText(customOption[nameKey]); // Update display text immediately
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const exactMatch = filteredOptions.find(
        (option) =>
          option[nameKey] &&
          option[nameKey].toLowerCase() === inputValue.toLowerCase()
      );

      if (exactMatch) {
        handleSelect(exactMatch);
      } else if (inputValue.trim()) {
        handleAddCustomValue();
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const shouldShowAddButton =
    showAddButton &&
    inputValue.trim() &&
    !filteredOptions.some(
      (option) =>
        option[nameKey] &&
        option[nameKey].toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdownInput} onClick={toggleDropdown}>
        <span className={styles.dropdownText}>
          {inputValue.length > 0 ? inputValue : displayText}
        </span>
        <DropdownIcon
          className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}
          width={24}
          height={24}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownArea}>
          <div className={styles.dropdownInputSection}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type to search or add new..."
              className={styles.dropdownSearchInput}
            />
            {shouldShowAddButton && (
              <button
                type="button"
                onClick={handleAddCustomValue}
                className={`${styles.optionButton} ${styles.addNewOption}`}
              >      
                <AddIcon className={styles.addIcon} />
              </button>
            )}
          </div>

          <div className={styles.optionsList}>
            {filteredOptions.length > 0 &&
              filteredOptions.map((option) => (
                <span
                  key={
                    option[valueKey] ||
                    option.id ||
                    Math.random().toString(36).substring(7)
                  }
                  onClick={() => handleSelect(option)}
                  className={styles.optionItem}
                >
                  {option[nameKey]}
                </span>
              ))}

            {filteredOptions.length === 0 && !inputValue.trim() && (
              <div className={styles.noResults}>No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}