import React, { useState, useMemo } from "react";
import { dummyBinomes } from "../assets/data";
import BinomeCard from "../components/BinomeCard";
import BinomeForm from "../components/BinomeForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const cities = ["All", ...new Set(dummyBinomes.map((b) => b.property.city))];

const Binome = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedLooking, setSelectedLooking] = useState("All");
  const [searchUniversity, setSearchUniversity] = useState("");

  const filtered = useMemo(() => {
    return dummyBinomes
      .filter((b) => selectedCity === "All" || b.property.city === selectedCity)
      .filter((b) => selectedLooking === "All" || b.lookingFor === Number(selectedLooking))
      .filter((b) =>
        searchUniversity === "" ||
        b.student.university.toLowerCase().includes(searchUniversity.toLowerCase())
      );
  }, [selectedCity, selectedLooking, searchUniversity]);

  const hasFilters = selectedCity !== "All" || selectedLooking !== "All" || searchUniversity !== "";

  const clearFilters = () => {
    setSelectedCity("All");
    setSelectedLooking("All");
    setSearchUniversity("");
  };

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white py-28 min-h-screen">
      <div className="max-padd-container">

        {/* Header */}
        <div className="flexBetween flex-col sm:flex-row gap-4 mb-10">
          <div>
            <h2 className="h2">🎓 Find a Binome</h2>
            <p className="regular-14 text-gray-400 mt-1">
              Trouve un colocataire étudiant et partage les frais de logement
            </p>
          </div>
          <button
            onClick={() => isSignedIn ? setShowForm(true) : navigate("/sign-in")}
            className="btn-secondary text-white rounded-xl px-6 py-3 medium-14 shrink-0"
          >
            + Publier une annonce
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-4 text-center">
            <p className="bold-24 text-secondary">{dummyBinomes.length}</p>
            <p className="regular-13 text-gray-400">Annonces totales</p>
          </div>
          <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-4 text-center">
            <p className="bold-24 text-secondary">{filtered.length}</p>
            <p className="regular-13 text-gray-400">Résultats</p>
          </div>
          <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-4 text-center">
            <p className="bold-24 text-secondary">
              {dummyBinomes.reduce((acc, b) => acc + b.lookingFor, 0)}
            </p>
            <p className="regular-13 text-gray-400">Places dispo</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">

          {/* Left - Filters */}
          <div className="bg-white ring-1 ring-slate-900/5 p-5 sm:min-w-60 sm:h-fit rounded-xl">
            <h5 className="h5 mb-4">🔍 Filtres</h5>

            {/* Search university */}
            <div className="mb-5">
              <label className="medium-13 text-gray-500 mb-2 block">🎓 Université</label>
              <input
                type="text"
                placeholder="Chercher une université..."
                value={searchUniversity}
                onChange={(e) => setSearchUniversity(e.target.value)}
                className="bg-secondary/5 border border-slate-900/10 outline-none medium-13 h-9 w-full rounded-lg px-3 placeholder:text-gray-300 focus:border-secondary transition-colors"
              />
            </div>

            {/* City filter */}
            <div className="mb-5 border-t border-slate-900/5 pt-4">
              <label className="medium-13 text-gray-500 mb-3 block">🏙️ Ville</label>
              <div className="flex flex-col gap-2">
                {cities.map((city) => (
                  <label key={city} className="flex items-center gap-2 medium-13 cursor-pointer hover:text-secondary transition-colors">
                    <input
                      type="radio"
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => setSelectedCity(city)}
                      className="accent-secondary w-4 h-4"
                    />
                    {city === "All" ? "Toutes les villes" : city}
                  </label>
                ))}
              </div>
            </div>

            {/* Looking for filter */}
            <div className="mb-5 border-t border-slate-900/5 pt-4">
              <label className="medium-13 text-gray-500 mb-3 block">👥 Cherche</label>
              <div className="flex flex-col gap-2">
                {[
                  { val: "All", label: "Tous" },
                  { val: "1", label: "1 binome" },
                  { val: "2", label: "2 binomes" },
                ].map(({ val, label }) => (
                  <label key={val} className="flex items-center gap-2 medium-13 cursor-pointer hover:text-secondary transition-colors">
                    <input
                      type="radio"
                      name="looking"
                      value={val}
                      checked={selectedLooking === val}
                      onChange={() => setSelectedLooking(val)}
                      className="accent-secondary w-4 h-4"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 rounded-lg border-2 border-secondary text-secondary medium-13 hover:bg-secondary hover:text-white transition-all"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* Right - Results */}
          <div className="flex-1">

            {/* Active filters tags */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCity !== "All" && (
                  <span className="flexCenter gap-1 bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-medium">
                    🏙️ {selectedCity}
                    <button onClick={() => setSelectedCity("All")} className="ml-1 hover:text-red-400">✕</button>
                  </span>
                )}
                {selectedLooking !== "All" && (
                  <span className="flexCenter gap-1 bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-medium">
                    👥 {selectedLooking} binome{selectedLooking === "2" ? "s" : ""}
                    <button onClick={() => setSelectedLooking("All")} className="ml-1 hover:text-red-400">✕</button>
                  </span>
                )}
                {searchUniversity && (
                  <span className="flexCenter gap-1 bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-medium">
                    🎓 {searchUniversity}
                    <button onClick={() => setSearchUniversity("")} className="ml-1 hover:text-red-400">✕</button>
                  </span>
                )}
              </div>
            )}

            {/* Results count */}
            <p className="medium-14 text-gray-400 mb-5">
              {filtered.length} annonce{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filtered.map((binome) => (
                  <BinomeCard key={binome._id} binome={binome} />
                ))}
              </div>
            ) : (
              <div className="flexCenter flex-col gap-4 min-h-[40vh] bg-white rounded-xl ring-1 ring-slate-900/5">
                <p className="text-5xl">🔍</p>
                <p className="medium-16 text-gray-500">Aucune annonce trouvée</p>
                <p className="regular-13 text-gray-400">Essayez de modifier vos filtres</p>
                <button
                  onClick={clearFilters}
                  className="btn-secondary text-white rounded-lg px-6 py-2 medium-14"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <BinomeForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            console.log("New binome:", data);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Binome;