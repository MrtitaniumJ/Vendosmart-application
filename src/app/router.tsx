import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { UploadPage } from "../features/csv-import/pages/UploadPage";
import { TablePage } from "../features/bom-table/pages/TablePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout><Outlet /></AppLayout>,
    children: [
      {
        index: true,
        element: <Navigate to="/upload" replace />,
      },
      {
        path: "upload",
        element: <UploadPage />,
      },
      {
        path: "table",
        element: <TablePage />,
      },
    ],
  },
]);
