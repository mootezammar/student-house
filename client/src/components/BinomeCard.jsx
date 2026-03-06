import React, { useState } from "react";
import { assets } from "../assets/data";
import { useAppContext } from "../context/AppContext";

const BinomeCard = ({ binome }) => {
  const [showContact, setShowContact] = useState(false);
  const { navigate } = useAppContext();

  const sharedRent = Math.round(
    binome.property.price.rent / (binome.lookingFor + 1)
  );

  const prefColor = {
    "Non-fumeur": "bg-green-100 text-green-700",
    "Calme": "bg-blue-100 text-blue-700",
    "Sérieux": "bg-purple-100 text-purple-700",
    "Studieux": "bg-indigo-100 text-indigo-700",
    "Propre": "bg-teal-100 text-teal-700",
    "Filles uniquement": "bg-pink-100 text-pink-700",
    "Garçons": "bg-orange-100 text-orange-700",
    "Économe": "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-900/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* House Image */}
      <div className="relative">
        <img
          src={binome.property.images?.[0] || "https://placehold.co/400x176?text=No+Image"}
          alt={binome.property.title}
          className="h-44 w-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-secondary text-white medium-12 px-3 py-1 rounded-full">
          {binome.property.propertyType.toUpperCase()}
        </span>
        <span className="absolute top-3 right-3 bg-white/95 text-secondary bold-13 px-3 py-1 rounded-full shadow-sm">
          {sharedRent} DT
          <span className="text-gray-400 regular-11"> /pers</span>
        </span>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-medium">
          👥 Cherche {binome.lookingFor} binome{binome.lookingFor > 1 ? "s" : ""}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Student info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={binome.student?.image || "https://placehold.co/48x48?text=U"}
            alt={binome.student?.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/20"
          />
          <div>
            <p className="bold-15">{binome.student?.name}</p>
            <p className="regular-13 text-gray-400">{binome.field} • {binome.year}</p>
          </div>
        </div>

        {/* University */}
        <div className="flexStart gap-1 mb-2">
          <span className="text-secondary text-sm">🎓</span>
          <p className="regular-13 text-gray-500 line-clamp-1">{binome.university}</p>
        </div>

        {/* Location */}
        <div className="flexStart gap-1 mb-3">
          <img src={assets.pin} alt="pin" width={13} />
          <p className="regular-13 text-gray-400">{binome.property.city} • {binome.property.address}</p>
        </div>

        {/* Description */}
        <p className="regular-13 text-gray-500 line-clamp-2 mb-3">{binome.description}</p>

        {/* Preferences */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {binome.preferences.map((pref) => (
            <span key={pref} className={`text-xs px-2 py-0.5 rounded-full font-medium ${prefColor[pref] || "bg-gray-100 text-gray-600"}`}>
              {pref}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-900/5 pt-3">
          <div className="flexBetween mb-3">
            <p className="regular-13 text-gray-400">
              📅 <span className="font-medium text-gray-600">
                {new Date(binome.availableFrom).toLocaleDateString("fr-TN", { month: "long", year: "numeric" })}
              </span>
            </p>
            <p className="regular-13 text-gray-400">
              💰 <span className="font-medium text-secondary">{binome.property.price.rent} DT</span>
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-2 mb-2">
            {/* Voir le logement */}
            <button
              onClick={() => navigate(`/binome/${binome._id}`)}
              className="flex-1 py-2 rounded-lg border-2 border-secondary text-secondary medium-13 hover:bg-secondary hover:text-white transition-all"
            >
              🏠 Voir logement
            </button>

            {/* Contacter */}
            {!showContact ? (
              <button
                onClick={() => setShowContact(true)}
                className="flex-1 btn-secondary text-white rounded-lg py-2 medium-13"
              >
                Contacter
              </button>
            ) : (
              <button
                onClick={() => setShowContact(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-500 medium-13 hover:bg-gray-200 transition-all"
              >
                Masquer
              </button>
            )}
          </div>

          {/* Contact info */}
          {showContact && (
            <div className="bg-secondary/10 rounded-lg p-3 flex flex-col gap-2 mt-2">
              <a href={`mailto:${binome.contact}`} className="flexCenter gap-2 bg-white rounded-lg py-2 text-sm font-medium hover:bg-secondary hover:text-white transition-all">
                <img src={assets.mail} alt="mail" width={15} />
                {binome.contact}
              </a>
              <a href={`tel:${binome.phone}`} className="flexCenter gap-2 bg-white rounded-lg py-2 text-sm font-medium hover:bg-secondary hover:text-white transition-all">
                <img src={assets.phone} alt="phone" width={15} />
                {binome.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinomeCard;