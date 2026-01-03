"use client";

import { useState } from "react";
import styles from "./ToggleButton.module.css";

export default function ToggleButton({
  label,
  value,
  disabled = false,
  isToggled = false,
  onToggle
}) {
  const [toggleValue, setToggleValue] = useState(isToggled);

  function handleClick() {
    if (disabled) return;

    const newState = !toggleValue;
    setToggleValue(newState);

    if (onToggle) {
      onToggle(value, newState);
    }
  };

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
