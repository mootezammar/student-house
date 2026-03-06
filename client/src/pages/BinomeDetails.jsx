import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets, cityCoordinates } from "../assets/data";
import PropertyMap from "../components/PropertyMap";
import axios from "axios";
import toast from "react-hot-toast";

const BinomeDetails = () => {
  const { id } = useParams();
  const { BACKEND_URL, navigate } = useAppContext();
  const [binome, setBinome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchBinome = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/binomes/${id}`);
        if (data.success) { setBinome(data.binome); scrollTo(0, 0); }
        else { toast.error("Annonce introuvable"); navigate("/binome"); }
      } catch (error) {
        toast.error("Erreur de chargement"); navigate("/binome");
      } finally {
        setLoading(false);
      }
    };
    fetchBinome();
  }, [id]);

  const prefColor = {
    "Non-fumeur": "bg-green-100 text-green-700",
    "Calme": "bg-blue-100 text-blue-700",
    "Sérieux": "bg-purple-100 text-purple-700",
    "Studieux": "bg-indigo-100 text-indigo-700",
    "Propre": "bg-teal-100 text-teal-700",
    "Filles uniquement": "bg-pink-100 text-pink-700",
    "Garçons": "bg-orange-100 text-orange-700",
    "Économe": "bg-yellow-100 text-yellow-700",
    "Sportif": "bg-red-100 text-red-700",
    "Végétarien": "bg-lime-100 text-lime-700",
  };

  const typeColor = {
    Université: "bg-blue-100 text-blue-700",
    ISET: "bg-green-100 text-green-700",
    IPEI: "bg-purple-100 text-purple-700",
    ISI: "bg-orange-100 text-orange-700",
    "Faculté de Médecine": "bg-red-100 text-red-700",
    "École Privée": "bg-yellow-100 text-yellow-700",
  };

  if (loading) return (
    <div className="flexCenter min-h-screen">
      <p className="regular-14 text-gray-400">Chargement...</p>
    </div>
  );

  if (!binome) return null;

  const images = binome.property?.images || [];
  const sharedRent = Math.round(binome.property.price.rent / (binome.lookingFor + 1));

  // ── Propriété avec coordonnées fallback par ville
  const propertyWithCoords = {
    ...binome.property,
    coordinates: binome.property.coordinates?.lat
      ? binome.property.coordinates
      : cityCoordinates[binome.property.city] || { lat: 36.8065, lng: 10.1815 },
  };

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white py-28 min-h-screen">
      <div className="max-padd-container">

        {/* Back */}
        <button onClick={() => navigate("/binome")}
          className="flexStart gap-2 text-gray-400 hover:text-secondary transition-colors mb-6 medium-14">
          ← Retour aux annonces
        </button>

        <div className="flex flex-col xl:flex-row gap-8">

          {/* ── LEFT */}
          <div className="flex-[2]">

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-3">
              <img
                src={images[currentImg] || "https://placehold.co/800x450?text=No+Image"}
                alt="property"
                className="w-full h-[350px] sm:h-[450px] object-cover"
              />
              <span className="absolute top-4 left-4 bg-secondary text-white medium-13 px-4 py-1.5 rounded-full">
                {binome.property.propertyType.toUpperCase()}
              </span>
              <span className="absolute top-4 right-4 bg-white/95 text-secondary bold-14 px-4 py-1.5 rounded-full shadow">
                {sharedRent} DT <span className="regular-12 text-gray-400">/pers/mois</span>
              </span>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                👥 Cherche {binome.lookingFor} binome{binome.lookingFor > 1 ? "s" : ""}
              </div>
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImg((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flexCenter shadow-md transition-all text-xl font-bold">‹</button>
                  <button onClick={() => setCurrentImg((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flexCenter shadow-md transition-all text-xl font-bold">›</button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}>
                    <img src={img} alt={`img-${i}`}
                      className={`w-20 h-16 object-cover rounded-lg shrink-0 transition-all duration-200 ${
                        currentImg === i ? "ring-2 ring-secondary scale-105" : "opacity-60 hover:opacity-100"
                      }`} />
                  </button>
                ))}
              </div>
            )}

            {/* Property info */}
            <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-6 mb-6">
              <h2 className="h3 mb-2">{binome.property.title}</h2>
              <div className="flexStart gap-2 mb-5">
                <img src={assets.pin} alt="pin" width={15} />
                <p className="regular-14 text-gray-400">{binome.property.address}, {binome.property.city}</p>
              </div>

              {/* Facilities */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: "🛏", val: binome.property.facilities?.bedrooms ?? "—", label: "Chambre" },
                  { icon: "🚿", val: binome.property.facilities?.bathrooms ?? "—", label: "Salle de bain" },
                  { icon: "📐", val: binome.property.area ?? "—", label: "m²" },
                  { icon: "👥", val: binome.lookingFor, label: "Binome cherché" },
                ].map(({ icon, val, label }, i) => (
                  <div key={i} className="bg-secondary/5 rounded-xl p-3 text-center">
                    <p className="text-2xl mb-1">{icon}</p>
                    <p className="bold-15">{val}</p>
                    <p className="regular-12 text-gray-400">{label}{val > 1 && label !== "m²" ? "s" : ""}</p>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              {binome.property.amenities?.length > 0 && (
                <div className="mb-6">
                  <h4 className="h5 mb-3">✨ Équipements</h4>
                  <div className="flex flex-wrap gap-2">
                    {binome.property.amenities.map((a, i) => (
                      <span key={i} className="bg-secondary/10 text-secondary text-xs px-3 py-1.5 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Education */}
              {binome.property.nearbyEducation?.length > 0 && (
                <div>
                  <h4 className="h5 mb-3">🎓 Établissements à proximité</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {binome.property.nearbyEducation.map((edu, i) => (
                      <div key={i} className="flexBetween p-3 rounded-lg bg-secondary/5 ring-1 ring-slate-900/5">
                        <div>
                          <p className="medium-14">{edu.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${typeColor[edu.type] || "bg-gray-100 text-gray-600"}`}>
                            {edu.type}
                          </span>
                        </div>
                        <span className="regular-13 text-secondary font-semibold shrink-0 ml-2">📍 {edu.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-6 mb-6">
              <h4 className="h4 mb-3">💬 Description</h4>
              <p className="regular-14 text-gray-500 leading-relaxed">{binome.description}</p>
            </div>

            {/* Map — toujours affichée grâce au fallback */}
            <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-6">
              <PropertyMap property={propertyWithCoords} />
            </div>

          </div>

          {/* ── RIGHT */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Student card */}
            <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-6">
              <h4 className="h4 mb-4">👤 Profil étudiant</h4>
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={binome.student?.image || "https://placehold.co/64x64?text=U"}
                  alt={binome.student?.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-secondary/20"
                />
                <div>
                  <p className="bold-16">{binome.student?.name}</p>
                  <p className="regular-13 text-secondary">{binome.university}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: "Filière", val: binome.field },
                  { label: "Année", val: binome.year },
                  { label: "Disponible", val: new Date(binome.availableFrom).toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Loyer total", val: `${binome.property.price.rent} DT/mois`, colored: true },
                ].map(({ label, val, colored }, i) => (
                  <div key={i} className="flexBetween bg-secondary/5 rounded-lg p-3">
                    <p className="regular-13 text-gray-400">{label}</p>
                    <p className={`medium-13 ${colored ? "text-secondary font-bold" : ""}`}>{val}</p>
                  </div>
                ))}
                <div className="flexBetween bg-green-50 rounded-lg p-3 ring-1 ring-green-100">
                  <p className="regular-13 text-gray-400">Votre part</p>
                  <p className="bold-16 text-green-600">{sharedRent} DT/mois</p>
                </div>
              </div>

              {binome.preferences?.length > 0 && (
                <div>
                  <p className="regular-13 text-gray-400 mb-2">Préférences</p>
                  <div className="flex flex-wrap gap-1.5">
                    {binome.preferences.map((pref) => (
                      <span key={pref} className={`text-xs px-2.5 py-1 rounded-full font-medium ${prefColor[pref] || "bg-gray-100 text-gray-600"}`}>
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white ring-1 ring-slate-900/5 rounded-xl p-6">
              <h4 className="h4 mb-4">📬 Contact</h4>
              {!showContact ? (
                <button onClick={() => setShowContact(true)}
                  className="w-full btn-secondary text-white rounded-xl py-3 medium-14">
                  Afficher les coordonnées
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <a href={`mailto:${binome.contact}`}
                    className="flexCenter gap-3 bg-secondary/10 hover:bg-secondary hover:text-white text-secondary rounded-xl py-3 medium-14 transition-all">
                    <img src={assets.mail} alt="mail" width={16} />{binome.contact}
                  </a>
                  <a href={`tel:${binome.phone}`}
                    className="flexCenter gap-3 bg-secondary/10 hover:bg-secondary hover:text-white text-secondary rounded-xl py-3 medium-14 transition-all">
                    <img src={assets.phone} alt="phone" width={16} />{binome.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Prix sticky */}
            <div className="bg-white ring-1 ring-slate-900/10 rounded-xl p-6 sticky top-28 shadow-sm">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <div>
      <p className="regular-13 text-gray-400 mb-0.5">Loyer partagé</p>
      <p className="text-3xl font-bold text-secondary">
        {sharedRent} <span className="text-lg">DT</span>
      </p>
      <p className="regular-12 text-gray-400">par personne / mois</p>
    </div>
    <div className="w-14 h-14 bg-secondary/10 rounded-full flexCenter">
      <span className="text-2xl">🏠</span>
    </div>
  </div>

  {/* Details */}
  <div className="border-t border-slate-900/5 pt-4 flex flex-col gap-2.5">
    {[
      { label: "Loyer total", val: `${binome.property.price.rent} DT`, icon: "💰" },
      { label: "Personnes", val: binome.lookingFor + 1, icon: "👥" },
      { label: "Type", val: binome.property.propertyType.toUpperCase(), icon: "🏡" },
      { label: "Ville", val: binome.property.city, icon: "📍" },
    ].map(({ label, val, icon }, i) => (
      <div key={i} className="flexBetween bg-secondary/5 rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <p className="regular-13 text-gray-500">{label}</p>
        </div>
        <p className="medium-13 text-gray-800">{val}</p>
      </div>
    ))}
  </div>

  {/* Total highlight */}
  <div className="mt-4 bg-secondary/10 ring-1 ring-secondary/20 rounded-xl p-4 flexBetween">
    <div>
      <p className="regular-12 text-gray-400">Votre part mensuelle</p>
      <p className="bold-18 text-secondary">{sharedRent} DT</p>
    </div>
    <div className="text-right">
      <p className="regular-12 text-gray-400">Sur</p>
      <p className="medium-13 text-gray-600">{binome.lookingFor + 1} pers.</p>
    </div>
  </div>

</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BinomeDetails;