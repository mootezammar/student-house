import React from "react";
import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import HouseDetails from "./components/HouseDetails";
import Binome from "./pages/Binome";
import MyBooking from "./pages/MyBooking";
import AgencyReg from "./components/AgencyReg";
import { useAppContext } from "./context/AppContext";
import Sidebar from "./components/owner/Sidebar";
import Dashboard from "./pages/owner/Dashboard";
import AddHouse from "./pages/owner/AddHouse";
import ListHouse from "./pages/owner/ListHouse";

const App = () => {
  const { showAgencyReg, setShowAgencyReg } = useAppContext();
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");
  return (
    <main>
      {!isOwnerPath && <Header />}
      {showAgencyReg && <AgencyReg />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/listing/:id" element={<HouseDetails />} />
        <Route path="/binome" element={<Binome />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-bookings" element={<MyBooking />} />

        {/*owner */}
        <Route path="/owner" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="/owner/add-house" element={<AddHouse />} />
          <Route path="/owner/list-house" element={<ListHouse />} />
        </Route>
      </Routes>
      {!isOwnerPath && <Footer />}
    </main>
  );
};

export default App;
