import styles from "./Alert.module.css";

export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;

  const icons = {
    error: "❌",
    success: "✅",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
