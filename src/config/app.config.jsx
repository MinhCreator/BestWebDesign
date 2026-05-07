import Home from '@pages/Home'
import Rank from '@pages/Rank'
import News from '@pages/News'
import Team from '@pages/Team'
import Event from '@pages/Event'

export const AppConfig = {
  // place code here

  Routes: [
    {
      name: "Home",
      route: "/",
      component: () => <Home />,
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "News",
      route: "/News",
      component: () => <News />,
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "Events",
      route: "/Event",
      component: () => <Event />,
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "Leaderboard",
      route: "/Leaderboard",
      component: () => <Rank />,
      isDisableRoute: false,
      NavbarComp: true,
    },
    {
      name: "Team",
      route: "/Team",
      component: () => <Team />,
      isDisableRoute: false,
      NavbarComp: false,
    },
  ],
};
