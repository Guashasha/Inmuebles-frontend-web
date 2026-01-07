"use client";

import styles from "./ToggleButton.module.css";

const ToggleButton = ({
  label,
  value,
  disabled = false,
  isToggled = false,
  onToggle,
}) => {
  function handleClick() {
    if (disabled) return;
    if (onToggle) {
      onToggle(value);
    }
  }

  const buttonClass = [
    styles.toggleButton,
    isToggled ? styles.toggled : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      disabled={disabled}
      type="button"
      data-value={value}
      aria-pressed={isToggled}
      onClick={handleClick}
      className={buttonClass}
    >
      {label}
    </button>
  );
};

export default ToggleButton;
