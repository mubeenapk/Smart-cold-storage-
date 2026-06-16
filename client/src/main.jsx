import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import "./global.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MainRoutes />
  </BrowserRouter>
);