import React from "react";

export type AppRoutes = {
  path: string;
  exact: boolean;
  component: any;
};

const Home = React.lazy(() => import("../pages/home"));
const Dashboard = React.lazy(() => import("../pages/dashboard"));

export const routes: AppRoutes[] = [
  { path: "/", exact: true, component: Home },
  { path: "/dashboard", exact: true, component: Dashboard },
];
