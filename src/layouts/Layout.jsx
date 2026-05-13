import { Outlet } from "react-router-dom";
import Navbar from "@components/ui/Navbar";
import BubbleNavbar from "@components/ui/BubbleNavbar";
import Footer from "@components/ui/Footer";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <BubbleNavbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;