import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.scss";
import { AppProvider } from "./utils/app_context/general.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  </QueryClientProvider>
);

if ("serviceWorker" in navigator) {
  try {
    const registeration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    registeration.addEventListener("updatefound", () => {
      registeration.installing;
    });
  } catch (err) {
    console.error("service worker registeration failed:", err);

    if (!("serviceWorker" in navigator)) {
      console.error("Browser does not support service workers");
    }
    if (!("Notification" in window)) {
      console.error("Browser does not support notifications");
    }
  }
}
