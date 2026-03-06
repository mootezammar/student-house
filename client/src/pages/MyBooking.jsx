import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/data";
import BinomeForm from "../components/BinomeForm";
import toast from "react-hot-toast";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [binomeBooking, setBinomeBooking] = useState(null); // booking sélectionné pour binome
  const { currency, user, getAxios } = useAppContext();

  const fetchBookings = async () => {
    try {
      const ax = await getAxios();
      const { data } = await ax.get("/api/bookings/my");
      if (data.success) setBookings(data.bookings);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  // ── Cancel booking
  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const ax = await getAxios();
      const { data } = await ax.patch(`/api/bookings/cancel/${id}`);
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b)
        );
        toast.success("Booking cancelled!");
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  // ── Pay with Stripe
  const handlePayNow = async (bookingId) => {
    try {
      const ax = await getAxios();
      const { data } = await ax.post("/api/bookings/stripe", { bookingId });
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white py-28 min-h-screen">
      <div className="max-padd-container">

        {/* Header */}
        <div className="mb-8">
          <h2 className="h2">My Bookings</h2>
          <p className="regular-14 text-gray-400 mt-1">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="flexCenter min-h-[50vh]">
            <p className="regular-14 text-gray-400">Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flexCenter flex-col gap-4 min-h-[50vh] bg-white rounded-2xl ring-1 ring-slate-900/5">
            <p className="text-5xl">🏠</p>
            <p className="medium-16 text-gray-500">No bookings yet</p>
            <p className="regular-13 text-gray-400">Start exploring properties to make your first booking</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white ring-1 ring-slate-900/5 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">

                  {/* Image */}
                  <div className="relative shrink-0">
                    <img
                      src={booking.property.images?.[0] || "https://placehold.co/192x192?text=No+Image"}
                      alt="property"
                      className="h-48 sm:h-full sm:w-48 w-full object-cover"
                    />
                    <span className={`absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full ${
                      booking.isPaid ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {booking.isPaid ? "✓ Paid" : "✗ Unpaid"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">

                    <div>
                      <div className="flexBetween flex-wrap gap-2 mb-2">
                        <h4 className="h4 line-clamp-1">{booking.property.title}</h4>
                        <p className="bold-18 text-secondary">{booking.totalPrice} {currency}</p>
                      </div>

                      <p className="flexStart gap-1 regular-13 text-gray-400 mb-4">
                        <img src={assets.pin} alt="pin" width={13} />
                        {booking.property.address}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-secondary/5 rounded-lg p-3">
                          <p className="regular-12 text-gray-400 mb-0.5">Check-In</p>
                          <p className="medium-13">{new Date(booking.checkInDate).toDateString()}</p>
                        </div>
                        <div className="bg-secondary/5 rounded-lg p-3">
                          <p className="regular-12 text-gray-400 mb-0.5">Check-Out</p>
                          <p className="medium-13">{new Date(booking.checkOutDate).toDateString()}</p>
                        </div>
                        <div className="bg-secondary/5 rounded-lg p-3">
                          <p className="regular-12 text-gray-400 mb-0.5">Guests</p>
                          <p className="medium-13">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                          booking.status === "cancelled" ? "bg-red-100 text-red-600" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            booking.status === "confirmed" ? "bg-green-500" :
                            booking.status === "cancelled" ? "bg-red-500" :
                            "bg-yellow-500"
                          }`} />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-900/5">
                      <div>
                        <p className="regular-12 text-gray-400 mb-0.5">Booking ID</p>
                        <p className="regular-12 text-gray-400 font-mono break-all">{booking._id}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* 🎓 Publier sur Binome — visible si booking confirmé */}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => setBinomeBooking(booking)}
                            className="px-4 py-2 rounded-lg medium-13 shrink-0 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors border border-secondary/20"
                          >
                            🎓 Chercher Binome
                          </button>
                        )}

                        {/* Pay Now */}
                        {!booking.isPaid && booking.status !== "cancelled" && (
                          <button
                            onClick={() => handlePayNow(booking._id)}
                            className="btn-secondary text-white rounded-lg px-6 py-2 medium-13 shrink-0"
                          >
                            Pay Now
                          </button>
                        )}

                        {/* Cancel */}
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="px-6 py-2 rounded-lg medium-13 shrink-0 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BinomeForm modal avec booking pré-rempli */}
      {binomeBooking && (
        <BinomeForm
          existingBooking={binomeBooking}
          onClose={() => setBinomeBooking(null)}
          onSuccess={() => {
            setBinomeBooking(null);
            toast.success("Annonce binome publiée !");
          }}
        />
      )}
    </div>
  );
};

export default MyBooking;