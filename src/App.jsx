import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppConfig } from '@config/app.config'

function App() {
  // const t = import.meta.env.VITE_SERVER_URL;
  // alert(t);
  const routes = AppConfig.Routes;
  return (
    <Router>
      <div className="min-h-screen bg-base-100 font-inter">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.route} element={ route.isDisableRoute ? null : route.component()} />
          ))}
          {/* <Route path="/" element={<Home />} />
          <Route path="/News" element={<News />} />
          <Route path="/Event" element={<Event />} />
          <Route path="/Leaderboard" element={<Rank />} />
          <Route path="/Team" element={<Team />} />
          <Route path="/Form" element={<Form />} /> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App;
