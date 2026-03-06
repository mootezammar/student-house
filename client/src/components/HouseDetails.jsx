import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import HouseImages from "./HouseImages";
import { assets, cityCoordinates } from "../assets/data";
import FormField from "./FormField";
import PropertyMap from "./PropertyMap";
import axios from "axios";
import toast from "react-hot-toast";

const HouseDetails = () => {
  const { properties, currency, BACKEND_URL, getAxios, user, navigate } = useAppContext();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Pay at Check-in");
  const { id } = useParams();

  const inputClass =
    "rounded border bg-secondary/10 border-gray-200 px-3 py-1.5 mt-1.5 regular-14 outline-none focus:border-secondary transition-colors duration-200";

  useEffect(() => {
    const found = properties.find((p) => p._id === id);
    if (found) {
      setProperty(found);
      scrollTo(0, 0);
    } else {
      const fetchProperty = async () => {
        try {
          const { data } = await axios.get(`${BACKEND_URL}/api/properties/${id}`);
          if (data.success) {
            setProperty(data.property);
            scrollTo(0, 0);
          }
        } catch (error) {
          toast.error("Property not found");
        }
      };
      fetchProperty();
    }
  }, [id, properties]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to book"); navigate("/"); return; }
    if (!checkIn || !checkOut) { toast.error("Please select check-in and check-out dates"); return; }
    try {
      setLoading(true);
      const ax = await getAxios();
      const { data } = await ax.post("/api/bookings", {
        propertyId: id, checkInDate: checkIn, checkOutDate: checkOut, guests, paymentMethod,
      });
      if (data.success) {
        toast.success("Booking created successfully!");
        if (paymentMethod === "Stripe") {
          const stripeRes = await ax.post("/api/bookings/stripe", { bookingId: data.booking._id });
          if (stripeRes.data.success) window.location.href = stripeRes.data.url;
        } else {
          navigate("/my-bookings");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const typeColor = {
    Université: "bg-blue-100 text-blue-700",
    ISET: "bg-green-100 text-green-700",
    IPEI: "bg-purple-100 text-purple-700",
    ISI: "bg-orange-100 text-orange-700",
    "Faculté de Médecine": "bg-red-100 text-red-700",
    "École Privée": "bg-yellow-100 text-yellow-700",
  };

  // ── Propriété avec coordonnées fallback par ville
  const propertyWithCoords = property ? {
    ...property,
    coordinates: property.coordinates?.lat
      ? property.coordinates
      : cityCoordinates[property.city] || { lat: 36.8065, lng: 10.1815 },
  } : null;

  return (
    property && (
      <div className="bg-linear-to-r from-[#eefbff] to-white py-28">
        <div className="max-padd-container">

          <HouseImages property={property} />

          <div className="flex flex-col xl:flex-row gap-8 mt-6">

            {/* Left */}
            <div className="p-4 flex-2 rounded-xl border border-slate-900/10">

              <p className="flexStart gap-x-2">
                <img src={assets.pin} alt="" width={19} />
                <span>{property.address}</span>
              </p>

              <div className="flex justify-between flex-col sm:flex-row sm:items-end mt-3">
                <h3 className="h3">{property.title}</h3>
                <div className="bold-18">{property.price.rent} {currency}/mo</div>
              </div>

              <div className="flex justify-between items-start my-1">
                <h4 className="h4 text-secondary">{property.propertyType}</h4>
              </div>

              <div className="flex gap-x-4 mt-3">
                <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-medium">
                  <img src={assets.bed} alt="" width={19} />{property.facilities.bedrooms} bed
                </p>
                <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-medium">
                  <img src={assets.bath} alt="" width={19} />{property.facilities.bathrooms} bath
                </p>
                <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-medium">
                  <img src={assets.car} alt="" width={19} />{property.facilities.garages} garage
                </p>
                <p className="flexCenter gap-x-2 font-medium">
                  <img src={assets.ruler} alt="" width={19} />{property.area} m²
                </p>
              </div>

              <div className="mt-6">
                <h4 className="h4 mt-4 mb-1">House Details</h4>
                <p className="mb-4">{property.description}</p>
              </div>

              <h4 className="h4 mt-6 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="p-3 py-1 rounded-lg bg-secondary/10 ring-1 ring-slate-900/10 text-sm">
                    {amenity}
                  </div>
                ))}
              </div>

              {/* Nearby Education */}
              {property.nearbyEducation?.length > 0 && (
                <div className="mt-8">
                  <h4 className="h4 mb-4">🎓 Nearby Education</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.nearbyEducation.map((edu, index) => (
                      <div key={index} className="flexBetween p-3 rounded-lg bg-secondary/5 ring-1 ring-slate-900/5">
                        <div>
                          <p className="medium-14">{edu.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${typeColor[edu.type] || "bg-gray-100 text-gray-600"}`}>
                            {edu.type}
                          </span>
                        </div>
                        <span className="regular-13 text-secondary font-semibold shrink-0 ml-2">
                          📍 {edu.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map — toujours affichée avec fallback coords */}
              <PropertyMap property={propertyWithCoords} />

              {/* Booking Form */}
              <form onSubmit={handleBooking} className="text-gray-500 bg-secondary/10 rounded-lg px-6 py-4 flex flex-col lg:flex-row gap-4 mt-10 max-w-md lg:max-w-full ring-1 ring-slate-900/5">
                <FormField icon={assets.calendar} iconAlt="calendar" label="Check in" htmlFor="checkIn">
                  <input type="date" id="checkIn" className={inputClass} value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)} required />
                </FormField>
                <FormField icon={assets.calendar} iconAlt="calendar" label="Check out" htmlFor="checkOut">
                  <input type="date" id="checkOut" className={inputClass} value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)} required />
                </FormField>
                <FormField icon={assets.user} iconAlt="guests" label="Roommates" htmlFor="guests">
                  <input type="number" id="guests" min={1} max={10} className={inputClass}
                    value={guests} onChange={(e) => setGuests(e.target.value)} />
                </FormField>
                <FormField icon={assets.dollar} iconAlt="payment" label="Payment" htmlFor="payment">
                  <select id="payment" className={inputClass} value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Pay at Check-in">Pay at Check-in</option>
                    <option value="Stripe">Stripe</option>
                  </select>
                </FormField>
                <button type="submit" disabled={loading}
                  className="btn-dark flexCenter gap-2 lg:self-end lg:mb-0 rounded-xl py-2.5 px-8 max-md:w-full">
                  {loading ? "Booking..." : "Book Now"}
                </button>
              </form>
            </div>

            {/* Right */}
            <div className="flex-1 max-w-sm">
              <div className="p-6 rounded-xl border border-slate-900/10">
                <h4 className="h4 mb-3">For Renting Contact</h4>
                <div className="text-sm divide-y divide-gray-500/30 border border-gray-500/30 rounded">
                  <div className="flex items-start justify-between p-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="h5">{property.agency?.name}</h5>
                        <p className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30">
                          Agency
                        </p>
                      </div>
                      <p>Agency office</p>
                    </div>
                    {property.agency?.owner?.image && (
                      <img src={property.agency.owner.image} alt="" className="w-10 h-10 rounded-full" />
                    )}
                  </div>
                  <div className="flexStart gap-2 p-1.5">
                    <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                      <img src={assets.phone} alt="" width={14} />
                    </div>
                    <p>{property.agency?.contact}</p>
                  </div>
                  <div className="flexStart gap-2 p-1.5">
                    <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                      <img src={assets.mail} alt="" width={14} />
                    </div>
                    <p>{property.agency?.email}</p>
                  </div>
                  <div className="flex items-center divide-x divide-gray-500/30">
                    <button className="flex items-center justify-center gap-2 w-1/2 py-3 cursor-pointer hover:bg-secondary/5 transition-colors">
                      <img src={assets.mail} alt="" width={19} />Send Email
                    </button>
                    <button className="flex items-center justify-center gap-2 w-1/2 py-3 cursor-pointer hover:bg-secondary/5 transition-colors">
                      <img src={assets.phone} alt="" width={19} />Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  );
};

export default HouseDetails;