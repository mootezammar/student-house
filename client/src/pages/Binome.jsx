import React, { useState, useMemo, useEffect } from "react";
import BinomeCard from "../components/BinomeCard";
import BinomeForm from "../components/BinomeForm";
import { useAppContext } from "../context/AppContext";
import { cities as staticCities } from "../assets/data";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

const staticUniversities = [
  "Université de Tunis El Manar",
  "Université de Tunis",
  "Université de la Manouba",
  "Université de Carthage",
  "Université de Sousse",
  "Université de Monastir",
  "Université de Sfax",
  "Université de Gabès",
  "Université de Gafsa",
  "Université de Kairouan",
  "Université de Jendouba",
  "ISET Tunis", "ISET Sfax", "ISET Sousse", "ISET Monastir",
  "ISET Bizerte", "ISET Nabeul", "ISET Kairouan", "ISET Gabès",
  "ISET Gafsa", "ISET Mahdia", "ISET Béja", "ISET Jendouba",
  "IPEI Tunis", "IPEI Sfax", "IPEI Sousse", "IPEI Monastir",
  "ISI Ariana", "ISI Kef", "ISI Mahdia",
  "Faculté de Médecine de Tunis", "Faculté de Médecine de Sfax",
  "Faculté de Médecine de Sousse", "Faculté de Médecine de Monastir",
  "ESPRIT", "Autre",
];

const Binome = () => {
  const { isSignedIn } = useUser();
  const { navigate, BACKEND_URL } = useAppContext();

  const [binomes, setBinomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedLooking, setSelectedLooking] = useState("All");
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [universitySearch, setUniversitySearch] = useState("");

  const fetchBinomes = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/binomes`);
      if (data.success) setBinomes(data.binomes);
    } catch (error) {
      toast.error("Failed to load binomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBinomes();
  }, []);

  const cities = ["All", ...staticCities];

  const filteredUniversities = useMemo(() => {
    if (!universitySearch) return staticUniversities;
    return staticUniversities.filter((u) =>
      u.toLowerCase().includes(universitySearch.toLowerCase())
    );
  }, [universitySearch]);

  const filtered = useMemo(() => {
    return binomes
      .filter((b) => selectedCity === "All" || b.property?.city === selectedCity)
      .filter((b) => selectedLooking === "All" || b.lookingFor === Number(selectedLooking))
      .filter((b) =>
        selectedUniversity === "All" ||
        b.university?.toLowerCase().includes(selectedUniversity.toLowerCase())
      );
  }, [binomes, selectedCity, selectedLooking, selectedUniversity]);

  const hasFilters = selectedCity !== "All" || selectedLooking !== "All" || selectedUniversity !== "All";

  const clearFilters = () => {
    setSelectedCity("All");
    setSelectedLooking("All");
    setSelectedUniversity("All");
    setUniversitySearch("");
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
            <p className="bold-24 text-secondary">{binomes.length}</p>
            <p className="regular-13 text-gray-400">Annonces totales</p>
          </div>
          <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-4 text-center">
            <p className="bold-24 text-secondary">{filtered.length}</p>
            <p className="regular-13 text-gray-400">Résultats</p>
          </div>
          <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-4 text-center">
            <p className="bold-24 text-secondary">
              {binomes.reduce((acc, b) => acc + b.lookingFor, 0)}
            </p>
            <p className="regular-13 text-gray-400">Places dispo</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">

          {/* Filters */}
          <div className="bg-white ring-1 ring-slate-900/5 p-5 sm:min-w-60 sm:h-fit rounded-xl">
            <h5 className="h5 mb-4">🔍 Filtres</h5>

            {/* University */}
            <div className="mb-5">
              <label className="medium-13 text-gray-500 mb-2 block">🎓 Université</label>
              <input
                type="text"
                placeholder="Chercher une université..."
                value={universitySearch}
                onChange={(e) => setUniversitySearch(e.target.value)}
                className="bg-secondary/5 border border-slate-900/10 outline-none medium-13 h-9 w-full rounded-lg px-3 placeholder:text-gray-300 focus:border-secondary transition-colors mb-2"
              />
              {selectedUniversity !== "All" && (
                <div className="flex items-center justify-between bg-secondary/10 px-3 py-2 rounded-lg mb-2">
                  <span className="medium-13 text-secondary line-clamp-1">{selectedUniversity}</span>
                  <button
                    onClick={() => { setSelectedUniversity("All"); setUniversitySearch(""); }}
                    className="text-red-400 hover:text-red-600 ml-2 shrink-0 font-bold"
                  >×</button>
                </div>
              )}
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                {filteredUniversities.map((uni) => (
                  <button
                    key={uni}
                    onClick={() => { setSelectedUniversity(selectedUniversity === uni ? "All" : uni); setUniversitySearch(""); }}
                    className={`text-left px-3 py-2 rounded-lg transition-all duration-200 medium-12 ${
                      selectedUniversity === uni
                        ? "bg-secondary text-white"
                        : "bg-secondary/5 hover:bg-secondary/10 text-gray-600"
                    }`}
                  >
                    {uni}
                  </button>
                ))}
                {filteredUniversities.length === 0 && (
                  <p className="regular-13 text-center py-3 text-gray-400">Aucune université trouvée</p>
                )}
              </div>
            </div>

            {/* City */}
            <div className="mb-5 border-t border-slate-900/5 pt-4">
              <label className="medium-13 text-gray-500 mb-3 block">🏙️ Ville</label>
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
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

            {/* Looking for */}
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

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 rounded-lg border-2 border-secondary text-secondary medium-13 hover:bg-secondary hover:text-white transition-all"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUniversity !== "All" && (
                  <span className="flexCenter gap-1 bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-medium">
                    🎓 {selectedUniversity}
                    <button onClick={() => setSelectedUniversity("All")} className="ml-1 hover:text-red-400">✕</button>
                  </span>
                )}
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
              </div>
            )}

            <p className="medium-14 text-gray-400 mb-5">
              {filtered.length} annonce{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
            </p>

            {loading ? (
              <div className="flexCenter min-h-[40vh]">
                <p className="regular-14 text-gray-400">Loading...</p>
              </div>
            ) : filtered.length > 0 ? (
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
                <button onClick={clearFilters} className="btn-secondary text-white rounded-lg px-6 py-2 medium-14">
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <BinomeForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchBinomes();
          }}
        />
      )}
    </div>
  );
};

export default Binome;