import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { assets, cities, dummyProperties } from "../assets/data";

const BinomeForm = ({ onClose, onSubmit }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 2 étapes
  const [form, setForm] = useState({
    // Step 1 — Logement
    propertyId: "",
    city: "",
    propertyType: "",
    rent: "",
    address: "",
    // Step 2 — Profil étudiant
    name: user?.fullName || "",
    image: user?.imageUrl || "",
    university: "",
    field: "",
    year: "",
    contact: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    lookingFor: "1",
    description: "",
    preferences: [],
    availableFrom: "",
  });

  const [errors, setErrors] = useState({});

  const years = ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année", "1ère année Master", "2ème année Master", "Doctorat"];
  const propertyTypes = ["s+0", "s+1", "s+2", "s+3", "s+4", "s+5+"];
  const allPreferences = ["Non-fumeur", "Calme", "Sérieux", "Studieux", "Propre", "Filles uniquement", "Garçons", "Économe", "Sportif", "Végétarien"];
  const universities = [
    "Université de Tunis El Manar", "Université de Tunis", "Université de la Manouba",
    "Université de Carthage", "Université de Jendouba", "Université de Sousse",
    "Université de Monastir", "Université de Sfax", "Université de Gabès",
    "Université de Gafsa", "Université de Kairouan", "Université de Monastir",
    "ISET Tunis", "ISET Sfax", "ISET Sousse", "ISET Monastir", "ISET Bizerte",
    "ISET Nabeul", "ISET Kairouan", "ISET Gabès", "ISET Gafsa", "ISET Mahdia",
    "IPEI Tunis", "IPEI Sfax", "IPEI Sousse", "IPEI Monastir",
    "ISI Ariana", "ISI Kef", "ISI Mahdia",
    "Faculté de Médecine de Tunis", "Faculté de Médecine de Sfax",
    "Faculté de Médecine de Sousse", "Faculté de Médecine de Monastir",
    "ESPRIT", "Autre",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePreference = (pref) => {
    setForm((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.city) newErrors.city = "Choisir une ville";
    if (!form.propertyType) newErrors.propertyType = "Choisir un type";
    if (!form.rent) newErrors.rent = "Entrer le loyer";
    if (!form.address) newErrors.address = "Entrer l'adresse";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Entrer votre nom";
    if (!form.university) newErrors.university = "Choisir une université";
    if (!form.field) newErrors.field = "Entrer votre filière";
    if (!form.year) newErrors.year = "Choisir votre année";
    if (!form.contact) newErrors.contact = "Entrer un email";
    if (!form.phone) newErrors.phone = "Entrer un numéro";
    if (!form.description) newErrors.description = "Écrire une description";
    if (!form.availableFrom) newErrors.availableFrom = "Choisir une date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    onSubmit && onSubmit(form);
    alert("✅ Annonce publiée avec succès !");
    onClose && onClose();
  };

  const inputClass = (field) =>
    `w-full border ${errors[field] ? "border-red-400" : "border-gray-200"} rounded-lg px-3 py-2 regular-14 outline-none focus:border-secondary transition-colors`;

  const sharedRent = form.rent
    ? Math.round(Number(form.rent) / (Number(form.lookingFor) + 1))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flexBetween px-6 py-4 border-b border-slate-900/10">
          <div>
            <h3 className="h4">🎓 Publier une annonce</h3>
            <p className="regular-13 text-gray-400">Étape {step} sur 2</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flexCenter rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="bg-secondary h-1.5 transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6">

          {/* ───── STEP 1 — Logement ───── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="bold-15 text-secondary mb-1">🏠 Informations sur le logement</p>

              {/* City */}
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Ville *</label>
                <select name="city" value={form.city} onChange={handleChange} className={inputClass("city")}>
                  <option value="">Choisir une ville</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Adresse *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Ex: 12 Rue de la République, Tunis"
                  className={inputClass("address")}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Property Type + Rent */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Type *</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} className={inputClass("propertyType")}>
                    <option value="">Type</option>
                    {propertyTypes.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                  {errors.propertyType && <p className="text-red-400 text-xs mt-1">{errors.propertyType}</p>}
                </div>
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Loyer total (DT) *</label>
                  <input
                    type="number"
                    name="rent"
                    value={form.rent}
                    onChange={handleChange}
                    placeholder="Ex: 400"
                    className={inputClass("rent")}
                  />
                  {errors.rent && <p className="text-red-400 text-xs mt-1">{errors.rent}</p>}
                </div>
              </div>

              {/* Looking for */}
              <div>
                <label className="medium-13 text-gray-500 mb-2 block">Nombre de binomes recherchés *</label>
                <div className="flex gap-3">
                  {["1", "2"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, lookingFor: n }))}
                      className={`flex-1 py-2.5 rounded-lg border-2 medium-14 transition-all ${
                        form.lookingFor === n
                          ? "border-secondary bg-secondary text-white"
                          : "border-gray-200 text-gray-500 hover:border-secondary"
                      }`}
                    >
                      👥 {n} binome{n === "2" ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shared rent preview */}
              {form.rent && (
                <div className="bg-secondary/10 rounded-xl p-4 flexBetween">
                  <p className="regular-14 text-gray-500">Loyer par personne :</p>
                  <p className="bold-18 text-secondary">{sharedRent} DT <span className="regular-13">/mois</span></p>
                </div>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="btn-dark w-full rounded-xl py-3 medium-14 mt-2"
              >
                Suivant →
              </button>
            </div>
          )}

          {/* ───── STEP 2 — Profil étudiant ───── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="bold-15 text-secondary mb-1">👤 Votre profil étudiant</p>

              {/* Name */}
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Ahmed Ben Ali"
                  className={inputClass("name")}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* University */}
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Université / École *</label>
                <select name="university" value={form.university} onChange={handleChange} className={inputClass("university")}>
                  <option value="">Choisir une université</option>
                  {universities.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                {errors.university && <p className="text-red-400 text-xs mt-1">{errors.university}</p>}
              </div>

              {/* Field + Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Filière *</label>
                  <input
                    type="text"
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    placeholder="Ex: Informatique"
                    className={inputClass("field")}
                  />
                  {errors.field && <p className="text-red-400 text-xs mt-1">{errors.field}</p>}
                </div>
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Année *</label>
                  <select name="year" value={form.year} onChange={handleChange} className={inputClass("year")}>
                    <option value="">Année</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Email *</label>
                  <input
                    type="email"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={inputClass("contact")}
                  />
                  {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
                </div>
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Téléphone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                    className={inputClass("phone")}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Available from */}
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Disponible à partir du *</label>
                <input
                  type="date"
                  name="availableFrom"
                  value={form.availableFrom}
                  onChange={handleChange}
                  className={inputClass("availableFrom")}
                />
                {errors.availableFrom && <p className="text-red-400 text-xs mt-1">{errors.availableFrom}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Décrivez-vous et ce que vous cherchez chez un binome..."
                  className={`${inputClass("description")} resize-none`}
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Preferences */}
              <div>
                <label className="medium-13 text-gray-500 mb-2 block">Préférences</label>
                <div className="flex flex-wrap gap-2">
                  {allPreferences.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        form.preferences.includes(pref)
                          ? "bg-secondary text-white border-secondary"
                          : "bg-white text-gray-500 border-gray-200 hover:border-secondary"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 medium-14 text-gray-500 hover:border-secondary transition-colors"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  className="flex-2 btn-secondary text-white rounded-xl py-3 px-8 medium-14"
                >
                  ✅ Publier l'annonce
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BinomeForm;