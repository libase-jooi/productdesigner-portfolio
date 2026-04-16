import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { PrototypeGate } from "./shared/components/PrototypeGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrototypeGate>
      <RouterProvider router={router} />
    </PrototypeGate>
  </StrictMode>,
);
