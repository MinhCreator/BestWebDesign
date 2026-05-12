import { Outlet } from "react-router-dom";
import Navbar from "@components/ui/Navbar";
import Footer from "@components/ui/Footer";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;