import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./global.css";
import Loader from "@components/ui/Loader.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <App ClassName="no-scrollbar" />
    </Suspense>
  </React.StrictMode>,
);
