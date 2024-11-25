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
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch (err) {
    console.error("service worker registeration failed:", err);
  }
}
