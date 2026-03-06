import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/data";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, currency, getAxios } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const ax = await getAxios();
      const { data } = await ax.get("/api/bookings/agency");
      if (data.success) {
        setDashboardData({
          bookings: data.bookings,
          totalBookings: data.bookings.length,
          totalRevenue: data.totalRevenue,
        });
      }
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboard();
  }, [user]);

  return (
    <div className="md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl">

      {/* Header */}
      <div className="mb-6">
        <h3 className="h3">Dashboard</h3>
        <p className="regular-13 text-gray-400">Welcome back, {user?.firstName} 👋</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flexStart gap-5 p-5 bg-[#d1e8ff] rounded-xl">
          <div className="w-12 h-12 bg-white/50 rounded-xl flexCenter shrink-0">
            <img src={assets.house} alt="bookings" className="w-6" />
          </div>
          <div>
            <h4 className="h4">
              {dashboardData.totalBookings.toString().padStart(2, "0")}
            </h4>
            <p className="medium-13 text-secondary">Total Bookings</p>
          </div>
        </div>

        <div className="flexStart gap-5 p-5 bg-[#d2f4ff] rounded-xl">
          <div className="w-12 h-12 bg-white/50 rounded-xl flexCenter shrink-0">
            <img src={assets.dollar} alt="revenue" className="w-6" />
          </div>
          <div>
            <h4 className="h4">
              {dashboardData.totalRevenue} {currency}
            </h4>
            <p className="medium-13 text-secondary">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div>
        <h4 className="h4 mb-4">Latest Bookings</h4>

        <div className="rounded-xl overflow-hidden ring-1 ring-slate-900/5">

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[0.4fr_2fr_2fr_1fr_1fr] px-6 py-3 bg-secondary">
            <p className="h5 text-white">#</p>
            <p className="h5 text-white">Property</p>
            <p className="h5 text-white">Dates</p>
            <p className="h5 text-white">Amount</p>
            <p className="h5 text-white">Status</p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flexCenter py-16 text-gray-400 regular-14">
              Loading...
            </div>
          ) : dashboardData.bookings.length === 0 ? (
            <div className="flexCenter py-16 text-gray-400 regular-14">
              No bookings yet
            </div>
          ) : (
            dashboardData.bookings.slice(0, 5).map((booking, index) => (
              <div
                key={booking._id}
                className={`flex flex-col sm:grid sm:grid-cols-[0.4fr_2fr_2fr_1fr_1fr] items-center gap-3 px-6 py-4 border-b border-slate-900/5 hover:bg-secondary/5 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                {/* Index */}
                <p className="hidden sm:block regular-14 text-gray-400">
                  {index + 1}
                </p>

                {/* Property */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src={booking.property.images?.[0] || "https://via.placeholder.com/56x48?text=No+Image"}
                    alt={booking.property.title}
                    className="w-14 h-12 object-cover rounded-lg shrink-0"
                  />
                  <p className="medium-13 line-clamp-2">{booking.property.title}</p>
                </div>

                {/* Dates */}
                <div className="w-full sm:w-auto">
                  <p className="regular-12 text-gray-400 sm:hidden mb-1">Dates</p>
                  <p className="regular-13">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p className="regular-12 text-gray-400">
                    → {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Amount */}
                <div className="w-full sm:w-auto">
                  <p className="regular-12 text-gray-400 sm:hidden mb-1">Amount</p>
                  <p className="medium-14 text-secondary">
                    {booking.totalPrice} {currency}
                  </p>
                </div>

                {/* Status */}
                <div className="w-full sm:w-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      booking.isPaid
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-600 border border-red-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`} />
                    {booking.isPaid ? "Completed" : "Pending"}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;