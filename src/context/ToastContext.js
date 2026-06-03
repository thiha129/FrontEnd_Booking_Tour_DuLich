import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import ToastStack from "../components/Toast/ToastStack";
import AuthPromptModal from "../components/Modal/AuthPromptModal";

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [authModal, setAuthModal] = useState({ open: false, message: "" });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type, message, duration = 4000) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, duration) => addToast("success", message, duration),
    error: (message, duration = 5000) => addToast("error", message, duration),
    warning: (message, duration) => addToast("warning", message, duration),
    info: (message, duration) => addToast("info", message, duration),
  };

  const promptLogin = useCallback(
    (message = "Please sign in to continue") => {
      setAuthModal({ open: true, message });
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setAuthModal({ open: false, message: "" });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, promptLogin }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={removeToast} />
      <AuthPromptModal
        isOpen={authModal.open}
        message={authModal.message}
        onClose={closeAuthModal}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
