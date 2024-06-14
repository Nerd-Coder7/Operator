import { Outlet } from "react-router-dom";
import { Layout as DashboardLayout } from "./layouts/dashboard/layout";
import ReportsPage from "./pages";
import NotFoundPage from "./pages/404";
import CreateOperatorPage from "./pages/create-operator";
import OperatorsPage from "./pages/operators";
import PublicOperatorsPage from "./pages/public-operators";
import IconsPage from "./pages/icons";
import OrdersPage from "./pages/orders";
import SettingsPage from "./pages/settings";
import LoginPage from "./pages/login";
import ThemePage from "./pages/theme";
import InboxPage from "./pages/chat";
import ChatsPage from "./pages/admin-chat";
import RegisterPage from "./pages/register";
import VerifyPage from "./pages/verify";
import TransactionPage from "./pages/transaction";
import ProfilePage from "./pages/profile";
import SuccessPage from "./pages/success";
import FailedPage from "./pages/failed";
import PrivateRoute from "./utils/PrivateRoute";

export const routes = [
  {
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <ReportsPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "theme",
        element: <ThemePage />,
      },
      {
        path: "icons",
        element: <IconsPage />,
      },
      { path: "operators-create", element: <CreateOperatorPage /> },
      { path: "operators", element: <OperatorsPage /> },
      { path: "all-operators", element: <PublicOperatorsPage /> },
      { path: "chat", element: <InboxPage /> },
      { path: "conversations", element: <ChatsPage /> },
      { path: "transaction-history", element: <TransactionPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  {
    path: "404",
    element: <NotFoundPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "success",
    element: <SuccessPage />,
  },
  {
    path: "failed",
    element: <FailedPage />,
  },
  { path: "register", element: <RegisterPage /> },
  { path: "auth/verify", element: <VerifyPage /> },

  {
    path: "*",
    element: <NotFoundPage />,
  },
];
