import React, { lazy } from "react";
import Loadable from '../shared/Loadable';


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
  ],
};
