import React, { lazy } from "react";
import Loadable from "../shared/Loadable";

export const AppConfig = {
  // place code here

  Routes: [
    {
      name: "Home",
      path: "/",
      component: Loadable(lazy(() => import("../pages/Home"))),
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "News",
      path: "/News",
      component: Loadable(lazy(() => import("../pages/News"))),
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "Events",
      path: "/Event",
      component: Loadable(lazy(() => import("../pages/Event"))),
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "Leaderboard",
      path: "/Leaderboard",
      component: Loadable(lazy(() => import("../pages/Rank"))),
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "Team",
      path: "/Team",
      component: Loadable(lazy(() => import("../pages/Team"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Testing",
      path: "/dev/Test",
      component: Loadable(lazy(() => import("../pages/Testing"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    // Admin routes
    {
      name: "Admin Login",
      path: "/admin/login",
      component: Loadable(lazy(() => import("../pages/admin/Login"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Admin Dashboard",
      path: "/admin/dashboard",
      component: Loadable(lazy(() => import("../pages/admin/Dashboard"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Admin Registrations",
      path: "/admin/registrations",
      component: Loadable(lazy(() => import("../pages/admin/Registrations"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Admin Content",
      path: "/admin/content",
      component: Loadable(lazy(() => import("../pages/admin/Content"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Admin Health",
      path: "/admin/health",
      component: Loadable(lazy(() => import("../pages/admin/SystemHealth"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Admin Users",
      path: "/admin/users",
      component: Loadable(lazy(() => import("../pages/admin/Users"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
    {
      name: "Admin Events",
      path: "/admin/events",
      component: Loadable(lazy(() => import("../pages/admin/Events"))),
      isDisableRoute: false,
      NavbarComp: false,
    },
  ],
};
