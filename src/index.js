import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router"; // Fixed import
import App from "./App";
import { Download } from "./Download";
import { createClient } from "@supabase/supabase-js";
import { SupabaseProvider } from "./SupabaseContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:id" element={<Download/>} />
        </Routes>
      </BrowserRouter>
    </SupabaseProvider>
  </React.StrictMode>
);
