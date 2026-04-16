import { createBrowserRouter } from "react-router-dom";
import { LandingLayout } from "./layouts/LandingLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { DesignerListPage } from "@/features/designer/pages/DesignerListPage";
import { DesignerDetailPage } from "@/features/designer/pages/DesignerDetailPage";
import { ProjectDetailPage } from "@/features/project/pages/ProjectDetailPage";
import { ProcessingPage } from "@/features/upload/pages/ProcessingPage";
import { ReviewPage } from "@/features/upload/pages/ReviewPage";
import { AdminDesignerListPage } from "@/features/designer/pages/AdminDesignerListPage";
import { AdminDesignerEditPage } from "@/features/designer/pages/AdminDesignerEditPage";

export const router = createBrowserRouter([
  // LP（ランディングページ）
  {
    element: <LandingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  // 認証
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  // ポートフォリオ（ログイン後）
  {
    element: <PublicLayout />,
    children: [
      { path: "dashboard", element: <DesignerListPage /> },
      { path: "upload/processing", element: <ProcessingPage /> },
      { path: "upload/review/:designerId", element: <ReviewPage /> },
      { path: "designers/:designerId", element: <DesignerDetailPage /> },
      { path: "portfolio/:slug", element: <DesignerDetailPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
    ],
  },
  // Admin
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDesignerListPage /> },
      { path: "designers/:designerId", element: <AdminDesignerEditPage /> },
    ],
  },
]);
