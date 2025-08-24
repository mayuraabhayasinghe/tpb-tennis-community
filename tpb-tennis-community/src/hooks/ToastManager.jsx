import { useState, useRef } from "react";
import Notification from "../components/ui/toast.jsx";

export function useToast() {
  const [notifications, setNotifications] = useState([]);
  const nextIdRef = useRef(1);

  const addToast = (type, title, message, duration) => {
    const id = nextIdRef.current++;
    const newToast = {
      id,
      type,
      title,
      message,
      showIcon: true,
      duration,
    };

    setNotifications((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setNotifications((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title, message, duration = 3000) =>
    addToast("success", title, message, duration);

  const error = (title, message, duration = 5000) =>
    addToast("error", title, message, duration);

  const warning = (title, message, duration = 4000) =>
    addToast("warning", title, message, duration);

  const info = (title, message, duration = 4000) =>
    addToast("info", title, message, duration);

  const loading = (title, message) => addToast("loading", title, message);

  return {
    notifications,
    success,
    error,
    warning,
    info,
    loading,
    removeToast,
  };
}
