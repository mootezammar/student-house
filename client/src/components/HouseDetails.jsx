import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import HouseImages from "./HouseImages";
import { assets, cities } from "../assets/data";
import FormField from "./FormField";
import PropertyMap from "./PropertyMap";

const HouseDetails = () => {
  const { properties,currency } = useAppContext();
  const [property, setProperty] = useState(null);
  const { id } = useParams();
 

  const inputClass =
    "rounded border bg-secondary/10 border-gray-200 px-3 py-1.5 mt-1.5 regular-14 outline-none focus:border-secondary transition-colors duration-200";

  useEffect(() => {
    const found = properties.find((p) => p._id === id);
    if (found) {
      setProperty(found);
      scrollTo(0, 0);
    }
  }, [id, properties]);

  const typeColor = {
    "Université": "bg-blue-100 text-blue-700",
    "ISET": "bg-green-100 text-green-700",
    "IPEI": "bg-purple-100 text-purple-700",
    "ISI": "bg-orange-100 text-orange-700",
    "Faculté de Médecine": "bg-red-100 text-red-700",
    "École Privée": "bg-yellow-100 text-yellow-700",
  };

  return (
    property && (
      <div className="bg-linear-to-r from-[#eefbff] to-white py-28">
        <div className="max-padd-container">

          {/* Images */}
          <HouseImages property={property} />

          {/* Main container */}
          <div className="flex flex-col xl:flex-row gap-8 mt-6">

            {/* Left side */}
            <div className="p-4 flex-2 rounded-xl border border-slate-900/10">

              {/* Location */}
              <p className="flexStart gap-x-2">
                <img src={assets.pin} alt="" width={19} />
                <span>{property.address}</span>
              </p>

              {/* Title + Price */}
              <div className="flex justify-between flex-col sm:flex-row sm:items-end mt-3">
                <h3 className="h3">{property.title}</h3>
                <div className="bold-18">{property.price.rent} {currency}/mo</div>
              </div>

              {/* Type */}
              <div className="flex justify-between items-start my-1">
                <h4 className="h4 text-secondary">{property.propertyType}</h4>
              </div>

              {/* Facilities */}
              <div className="flex gap-x-4 mt-3">
                <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-medium">
                  <img src={assets.bed} alt="" width={19} />
                  {property.facilities.bedrooms} bed
                </p>
                <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-medium">
                  <img src={assets.bath} alt="" width={19} />
                  {property.facilities.bathrooms} bath
                </p>
                <p className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-medium">
                  <img src={assets.car} alt="" width={19} />
                  {property.facilities.garages} garage
                </p>
                <p className="flexCenter gap-x-2 font-medium">
                  <img src={assets.ruler} alt="" width={19} />
                  {property.area} m²
                </p>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="h4 mt-4 mb-1">House Details</h4>
                <p className="mb-4">{property.description}</p>
              </div>

              {/* Amenities */}
              <h4 className="h4 mt-6 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-3">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="p-3 py-1 rounded-lg bg-secondary/10 ring-1 ring-slate-900/10 text-sm"
                  >
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
                      <div
                        key={index}
                        className="flexBetween p-3 rounded-lg bg-secondary/5 ring-1 ring-slate-900/5"
                      >
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

              {/*map */}
              <PropertyMap property={property} />

              {/* Booking Form */}
              <form className="text-gray-500 bg-secondary/10 rounded-lg px-6 py-4 flex flex-col lg:flex-row gap-4 mt-10 max-w-md lg:max-w-full ring-1 ring-slate-900/5">
                <FormField icon={assets.pin} iconAlt="location" label="Destination" htmlFor="destinationInput">
                  <input
                    className={inputClass}
                    list="destinations"
                    id="destinationInput"
                    type="text"
                    placeholder="Where are you going?"
                    required
                  />
                  <datalist id="destinations">
                    {cities.map((city, index) => (
                      <option value={city} key={index} />
                    ))}
                  </datalist>
                </FormField>

                <FormField icon={assets.calendar} iconAlt="calendar" label="Check in" htmlFor="checkIn">
                  <input type="date" id="checkIn" className={inputClass} />
                </FormField>

                <FormField icon={assets.calendar} iconAlt="calendar" label="Check out" htmlFor="checkOut">
                  <input type="date" id="checkOut" className={inputClass} />
                </FormField>

                <FormField icon={assets.user} iconAlt="guests" label="Roommates" htmlFor="guests">
                  <input
                    type="number"
                    id="guests"
                    min={1}
                    max={10}
                    placeholder="0"
                    className={inputClass}
                  />
                </FormField>

                <button
                  type="submit"
                  className="btn-dark flexCenter gap-2 lg:self-end lg:mb-0 rounded-xl py-2.5 px-8 max-md:w-full"
                >
                  <img src={assets.search} alt="search" className="invert" width={18} />
                  <span className="medium-14">Search</span>
                </button>
              </form>
            </div>

            {/* Right side */}
            <div className="flex-1 max-w-sm">
              <div className="p-6 rounded-xl border border-slate-900/10">

                {/* Contact Agent */}
                <h4 className="h4 mb-3">Contact Agent</h4>
                <form className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="p-2 py-1 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <button type="submit" className="btn-secondary rounded-lg py-1.5">
                    Send Message
                  </button>
                </form>

                {/* Agency */}
                <h4 className="h4 mb-3 mt-8">For Renting Contact</h4>
                <div className="text-sm divide-y divide-gray-500/30 border border-gray-500/30 rounded">
                  <div className="flex items-start justify-between p-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="h5">{property.agency.name}</h5>
                        <p className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30">
                          Agency
                        </p>
                      </div>
                      <p>Agency office</p>
                    </div>
                    <img
                      src={property.agency.owner.image}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="flexStart gap-2 p-1.5">
                    <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                      <img src={assets.phone} alt="" width={14} />
                    </div>
                    <p>{property.agency.contact}</p>
                  </div>
                  <div className="flexStart gap-2 p-1.5">
                    <div className="bg-green-500/20 p-1 rounded-full border border-green-500/30">
                      <img src={assets.mail} alt="" width={14} />
                    </div>
                    <p>{property.agency.email}</p>
                  </div>
                  <div className="flex items-center divide-x divide-gray-500/30">
                    <button className="flex items-center justify-center gap-2 w-1/2 py-3 cursor-pointer hover:bg-secondary/5 transition-colors">
                      <img src={assets.mail} alt="" width={19} />
                      Send Email
                    </button>
                    <button className="flex items-center justify-center gap-2 w-1/2 py-3 cursor-pointer hover:bg-secondary/5 transition-colors">
                      <img src={assets.phone} alt="" width={19} />
                      Call Now
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