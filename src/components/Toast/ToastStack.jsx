import React from "react";
import "../../styles/toast.css";

const ICONS = {
  success: "ri-checkbox-circle-fill",
  error: "ri-error-warning-fill",
  warning: "ri-alert-fill",
  info: "ri-information-fill",
};

const ToastStack = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`toast-item toast-item--${item.type}`}
          role="alert"
        >
          <span className={`toast-item__icon toast-item__icon--${item.type}`}>
            <i className={ICONS[item.type] || ICONS.info}></i>
          </span>
          <p className="toast-item__message">{item.message}</p>
          <button
            type="button"
            className="toast-item__close"
            onClick={() => onDismiss(item.id)}
            aria-label="Dismiss"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
