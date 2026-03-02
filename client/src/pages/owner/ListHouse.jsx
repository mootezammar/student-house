import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { dummyProperties } from "../../assets/data";

const ListHouse = () => {
  const { currency } = useAppContext();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    setProperties(dummyProperties);
  }, []);

  const filtered = properties
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      filterStatus === "All" ||
      (filterStatus === "Available" && p.isAvailable) ||
      (filterStatus === "Unavailable" && !p.isAvailable)
    );

  const toggleAvailability = (id) => {
    setProperties((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  const deleteProperty = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="flex-1 md:px-8 py-6 m-1 sm:m-3 h-[97vh] overflow-y-scroll bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl">

      {/* Header */}
      <div className="flexBetween flex-wrap gap-4 mb-6">
        <div>
          <h3 className="h3">My Properties</h3>
          <p className="regular-13 text-gray-400">{properties.length} properties listed</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-secondary/5 border border-slate-900/10 rounded-lg px-3 flex-1">
          <span className="text-gray-300">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or city..."
            className="bg-transparent outline-none regular-14 h-10 w-full placeholder:text-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 text-xs">
              ✕
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {["All", "Available", "Unavailable"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                filterStatus === status
                  ? "bg-secondary text-white"
                  : "bg-secondary/5 text-gray-500 hover:bg-secondary/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-secondary/5 rounded-xl p-3 text-center">
          <p className="bold-18 text-secondary">{properties.length}</p>
          <p className="regular-12 text-gray-400">Total</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="bold-18 text-green-600">{properties.filter((p) => p.isAvailable).length}</p>
          <p className="regular-12 text-gray-400">Available</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="bold-18 text-red-500">{properties.filter((p) => !p.isAvailable).length}</p>
          <p className="regular-12 text-gray-400">Unavailable</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden ring-1 ring-slate-900/5">

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 py-3 bg-secondary">
          <p className="h5 text-white">Property</p>
          <p className="h5 text-white">Type</p>
          <p className="h5 text-white">Rent</p>
          <p className="h5 text-white">Status</p>
          <p className="h5 text-white">Actions</p>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flexCenter flex-col gap-3 py-16 text-gray-400 bg-white">
            <p className="text-4xl">🏠</p>
            <p className="medium-14">No properties found</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-secondary text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filtered.map((property, index) => (
            <div
              key={property._id}
              className={`flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-3 px-4 py-4 border-b border-slate-900/5 hover:bg-secondary/5 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              {/* Property */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-14 h-12 object-cover rounded-lg shrink-0"
                />
                <div>
                  <p className="medium-13 line-clamp-1">{property.title}</p>
                  <p className="regular-12 text-gray-400">📍 {property.city}</p>
                </div>
              </div>

              {/* Type */}
              <div>
                <span className="bg-secondary/10 text-secondary medium-12 px-2 py-1 rounded-full">
                  {property.propertyType.toUpperCase()}
                </span>
              </div>

              {/* Rent */}
              <p className="medium-13 text-secondary">
                {property.price.rent} {currency}
                <span className="regular-12 text-gray-400"> /mo</span>
              </p>

              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                property.isAvailable
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-600 border-red-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${property.isAvailable ? "bg-green-500" : "bg-red-500"}`} />
                {property.isAvailable ? "Available" : "Unavailable"}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(property._id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    property.isAvailable
                      ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {property.isAvailable ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteProperty(property._id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default ListHouse;