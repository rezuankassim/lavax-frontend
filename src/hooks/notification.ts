import { create } from "zustand";

type NotificationState = {
  productTitle: string;
  message: string;
  status: string;
  setNotification: (
    message: string,
    status: string,
    productTitle?: string
  ) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  productTitle: "",
  message: "",
  status: "",
  setNotification: (message, status, productTitle) => {
    set(() => ({
      message: message,
      status: status,
      productTitle: productTitle || "",
    }));

    setTimeout(() => {
      set(() => ({
        message: "",
        status: "",
        productTitle: "",
      }));
    }, 2500);
  },
}));
