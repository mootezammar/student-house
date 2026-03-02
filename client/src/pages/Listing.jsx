import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import Item from "../components/Item";

const Listing = () => {
  const { properties } = useAppContext();

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [sortBy, setSortBy] = useState("Relevant");
  const [schoolSearch, setSchoolSearch] = useState("");

  const sortOptions = ["Relevant", "Low to High", "High to Low"];
  const houseType = ["s+0", "s+1", "s+2", "s+3", "s+4", "s+5+"];
  const priceRange = [
    "0 to 200",
    "200 to 400",
    "400 to 800",
    "800 to 1200",
    "1200 +",
  ];

  // Extract all unique schools from all properties
  const allSchools = useMemo(() => {
    const schools = [];
    properties.forEach((p) => {
      p.nearbyEducation?.forEach((edu) => {
        if (!schools.find((s) => s.name === edu.name)) {
          schools.push({ name: edu.name, type: edu.type });
        }
      });
    });
    return schools.sort((a, b) => a.name.localeCompare(b.name));
  }, [properties]);

  const filteredSchools = useMemo(() => {
    if (!schoolSearch) return allSchools;
    return allSchools.filter((s) =>
      s.name.toLowerCase().includes(schoolSearch.toLowerCase()),
    );
  }, [allSchools, schoolSearch]);

  const cities = useMemo(() => {
    return [...new Set(properties.map((p) => p.city))].sort();
  }, [properties]);

  const toggleFilter = (value, setState) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter(
        (p) =>
          selectedTypes.length === 0 || selectedTypes.includes(p.propertyType),
      )
      .filter(
        (p) => selectedCities.length === 0 || selectedCities.includes(p.city),
      )
      .filter((p) => {
        if (selectedPrices.length === 0) return true;
        const price = p.price.rent;
        return selectedPrices.some((range) => {
          if (range === "0 to 200") return price <= 200;
          if (range === "200 to 400") return price > 200 && price <= 400;
          if (range === "400 to 800") return price > 400 && price <= 800;
          if (range === "800 to 1200") return price > 800 && price <= 1200;
          if (range === "1200 +") return price > 1200;
          return true;
        });
      })
      .filter((p) => {
        if (!selectedSchool) return true;
        return p.nearbyEducation?.some((ne) => ne.name === selectedSchool);
      })
      .sort((a, b) => {
        if (sortBy === "Low to High") return a.price.rent - b.price.rent;
        if (sortBy === "High to Low") return b.price.rent - a.price.rent;
        return 0;
      });
  }, [
    properties,
    selectedTypes,
    selectedCities,
    selectedPrices,
    selectedSchool,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedPrices.length > 0 ||
    selectedCities.length > 0 ||
    selectedSchool !== null ||
    sortBy !== "Relevant";

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedPrices([]);
    setSelectedCities([]);
    setSelectedSchool(null);
    setSchoolSearch("");
    setSortBy("Relevant");
  };

  // Badge color per education type
  const typeColor = {
    Université: "bg-blue-100 text-blue-700",
    ISET: "bg-green-100 text-green-700",
    IPEI: "bg-purple-100 text-purple-700",
    ISI: "bg-orange-100 text-orange-700",
    "Faculté de Médecine": "bg-red-100 text-red-700",
    "École Privée": "bg-yellow-100 text-yellow-700",
  };

  const FilterSection = ({
    title,
    items,
    selected,
    onToggle,
    scrollable = false,
  }) => (
    <div className="py-3 border-t border-slate-900/10">
      <h5 className="h5 mb-3">{title}</h5>
      <div
        className={`flex flex-col gap-2 ${scrollable ? "max-h-44 overflow-y-auto pr-1" : ""}`}
      >
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 medium-14 cursor-pointer hover:text-secondary transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="accent-secondary w-4 h-4 shrink-0"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white py-28">
      <div className="max-padd-container flex flex-col sm:flex-row gap-8 mb-16">
        {/* Left side - Filters */}
        <div className="bg-secondary/10 ring-1 ring-slate-900/5 p-4 sm:min-w-64 sm:h-fit rounded-xl">
          {/* Sort */}
          <div className="py-3">
            <h5 className="h5 mb-3">Sort By</h5>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-900/10 outline-none medium-14 h-9 w-full rounded-lg px-2 cursor-pointer"
            >
              {sortOptions.map((sort) => (
                <option value={sort} key={sort}>
                  {sort}
                </option>
              ))}
            </select>
          </div>

          {/* 🎓 Search by School Name */}
          <div className="py-3 border-t border-slate-900/10">
            <h5 className="h5 mb-3">🎓 Near My School</h5>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search school..."
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              className="bg-white border border-slate-900/10 outline-none medium-13 h-9 w-full rounded-lg px-3 mb-2 placeholder:text-gray-300"
            />

            {/* Selected school badge */}
            {selectedSchool && (
              <div className="flex items-center justify-between bg-secondary/10 px-3 py-2 rounded-lg mb-2">
                <span className="medium-13 text-secondary line-clamp-1">
                  {selectedSchool}
                </span>
                <button
                  onClick={() => {
                    setSelectedSchool(null);
                    setSchoolSearch("");
                  }}
                  className="text-red-400 hover:text-red-600 ml-2 shrink-0 font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* School list */}
            <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
              {filteredSchools.map((school) => (
                <button
                  key={school.name}
                  onClick={() => {
                    setSelectedSchool(
                      selectedSchool === school.name ? null : school.name,
                    );
                    setSchoolSearch("");
                  }}
                  className={`text-left px-3 py-2 rounded-lg transition-all duration-200 medium-13 ${
                    selectedSchool === school.name
                      ? "bg-secondary text-white"
                      : "bg-white hover:bg-secondary/10"
                  }`}
                >
                  <span className="block line-clamp-1">{school.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full mt-0.5 inline-block ${
                      selectedSchool === school.name
                        ? "bg-white/20 text-white"
                        : typeColor[school.type] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {school.type}
                  </span>
                </button>
              ))}
              {filteredSchools.length === 0 && (
                <p className="regular-13 text-center py-3">No school found</p>
              )}
            </div>
          </div>

          {/* City */}
          <FilterSection
            title="🏙️ City"
            items={cities}
            selected={selectedCities}
            onToggle={(v) => toggleFilter(v, setSelectedCities)}
            scrollable={true}
          />

          {/* House Type */}
          <FilterSection
            title="🏠 House Type"
            items={houseType}
            selected={selectedTypes}
            onToggle={(v) => toggleFilter(v, setSelectedTypes)}
          />

          {/* Price Range */}
          <FilterSection
            title="💰 Price (DT/night)"
            items={priceRange.map((p) => `${p} DT`)}
            selected={selectedPrices.map((p) => `${p} DT`)}
            onToggle={(v) =>
              toggleFilter(v.replace(" DT", ""), setSelectedPrices)
            }
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 w-full btn-outline text-center text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Right side - Results */}
        <div className="flex-1">
          {/* Active filters tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSchool && (
                <span className="flexCenter gap-1 bg-secondary text-white medium-13 px-3 py-1 rounded-full">
                  🎓 {selectedSchool}
                  <button
                    onClick={() => setSelectedSchool(null)}
                    className="ml-1 hover:text-red-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCities.map((city) => (
                <span
                  key={city}
                  className="flexCenter gap-1 bg-secondary/10 text-secondary medium-13 px-3 py-1 rounded-full"
                >
                  🏙️ {city}
                  <button
                    onClick={() => toggleFilter(city, setSelectedCities)}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedTypes.map((type) => (
                <span
                  key={type}
                  className="flexCenter gap-1 bg-secondary/10 text-secondary medium-13 px-3 py-1 rounded-full"
                >
                  🏠 {type}
                  <button
                    onClick={() => toggleFilter(type, setSelectedTypes)}
                    className="ml-1 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="medium-14 text-gray-50 mb-4">
            {filteredProperties.length} propert
            {filteredProperties.length !== 1 ? "ies" : "y"} found
            {selectedSchool && (
              <span className="text-secondary ml-1">near {selectedSchool}</span>
            )}
          </p>

          {filteredProperties.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map((property) => (
                <Item key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flexCenter flex-col gap-3 min-h-[40vh] text-gray-50">
              <p className="medium-16">No properties found near this school.</p>
              <button
                onClick={clearFilters}
                className="btn-secondary text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
