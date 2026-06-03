import React, { useEffect, useId, useRef, useState } from "react";
import "./filter-select.css";

const FilterSelect = ({
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selected = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`filter-select${open ? " filter-select--open" : ""}${
        disabled ? " filter-select--disabled" : ""
      }`}
    >
      <button
        type="button"
        className="filter-select__trigger"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {selected?.icon && (
          <span className="filter-select__trigger-icon" aria-hidden="true">
            <i className={selected.icon}></i>
          </span>
        )}
        <span className="filter-select__trigger-text">{selected?.label}</span>
        <span className="filter-select__chevron" aria-hidden="true">
          <i className="ri-arrow-down-s-line"></i>
        </span>
      </button>

      <ul
        id={listId}
        className="filter-select__menu"
        role="listbox"
        aria-label={ariaLabel}
      >
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <li key={opt.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                className={`filter-select__option${
                  isActive ? " filter-select__option--active" : ""
                }`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.icon && (
                  <span className="filter-select__option-icon" aria-hidden="true">
                    <i className={opt.icon}></i>
                  </span>
                )}
                <span className="filter-select__option-label">{opt.label}</span>
                {isActive && (
                  <i
                    className="ri-check-line filter-select__check"
                    aria-hidden="true"
                  ></i>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterSelect;
