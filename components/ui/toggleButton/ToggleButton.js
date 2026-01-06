"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./ToggleButton.module.css";

const ToggleButton = forwardRef(
  (
    {
      label,
      value,
      disabled = false,
      isToggled = false,
      exclusive = false,
      onToggle,
    },
    ref
  ) => {
    const [toggleValue, setToggleValue] = useState(isToggled);

    useImperativeHandle(ref, () => ({
      turnOffIfNotValue: (condition) => {
        if (value !== condition)
        setToggleValue(false);
      }
    }));

    function handleClick() {
      if (disabled) return;

      if (exclusive) {
        if (!toggleValue) {
          setToggleValue(true);
        } else {
          return;
        }
      } else {
        setToggleValue(!toggleValue);
      }

      if (onToggle) {
        onToggle(value, toggleValue);
      }
    }

    const buttonClass = [
      styles.toggleButton,
      toggleValue ? styles.toggled : "",
      disabled ? styles.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        disabled={disabled}
        data-value={value}
        data-toggled={isToggled}
        aria-pressed={isToggled}
        onClick={handleClick}
        className={buttonClass}
      >
        {label}
      </button>
    );
  }
);

export default ToggleButton;
