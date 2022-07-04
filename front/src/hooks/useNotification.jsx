import Toast from "@/components/Toast";
import { createContext, useContext, useState } from "react";

const NotificationCtx = createContext({
  showNotification: ({ title, message, variant }) => {},
});

export const useNotification = () => useContext(NotificationCtx);

export const NotificationProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);

  const showNotification = ({ title, message, variant }) => {
    setData({ title, message, variant });
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };
  return (
    <NotificationCtx.Provider value={{ showNotification }}>
      {children}
      {data && (
        <Toast
          show={showNotification}
          onClose={() => setIsVisible(false)}
          isVisible={isVisible}
          title={data.title}
          message={data.message}
          variant={data.variant ?? "success"}
        />
      )}
    </NotificationCtx.Provider>
  );
};
