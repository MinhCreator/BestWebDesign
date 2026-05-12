import { AppConfig } from "@config/app.config";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@layouts/Layout";

const RouterSupport = () => {
  const routers = AppConfig.Routes;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {routers.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.isDisableRoute ? null : route.component?.()}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterSupport;