import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { cities } from "../assets/data";
import toast from "react-hot-toast";

const BinomeForm = ({ onClose, onSuccess, existingBooking = null }) => {
  const { user } = useUser();
  const { getAxios } = useAppContext();

  const [step, setStep] = useState(existingBooking ? 2 : 1); // si booking existant → skip step 1
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Step 1 — pré-rempli si booking existant
    city: existingBooking?.property?.city || "",
    propertyType: existingBooking?.property?.propertyType || "",
    rent: existingBooking?.property?.price?.rent?.toString() || "",
    address: existingBooking?.property?.address || "",
    lookingFor: "1",
    // Step 2
    university: "",
    field: "",
    year: "",
    contact: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    description: "",
    preferences: [],
    availableFrom: existingBooking?.checkInDate
      ? new Date(existingBooking.checkInDate).toISOString().split("T")[0]
      : "",
  });

  const [errors, setErrors] = useState({});

  const years = ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année", "1ère année Master", "2ème année Master", "Doctorat"];
  const propertyTypes = ["s+0", "s+1", "s+2", "s+3", "s+4", "s+5+"];
  const allPreferences = ["Non-fumeur", "Calme", "Sérieux", "Studieux", "Propre", "Filles uniquement", "Garçons", "Économe", "Sportif", "Végétarien"];
  const universities = [
    "Université de Tunis El Manar", "Université de Tunis", "Université de la Manouba",
    "Université de Carthage", "Université de Sousse", "Université de Monastir",
    "Université de Sfax", "Université de Gabès", "Université de Gafsa",
    "Université de Kairouan", "ISET Tunis", "ISET Sfax", "ISET Sousse",
    "IPEI Tunis", "ISI Ariana", "Faculté de Médecine de Tunis",
    "Faculté de Médecine de Sfax", "ESPRIT", "Autre",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      setLoading(true);
      const ax = await getAxios();
      let propertyId;

      if (existingBooking) {
        // ── Utiliser la propriété du booking directement
        propertyId = existingBooking.property._id;
      } else {
        // ── Créer une nouvelle propriété avec isBinome=true
        const formData = new FormData();
        formData.append("title", `${form.propertyType.toUpperCase()} - ${form.address}, ${form.city}`);
        formData.append("description", form.description);
        formData.append("address", form.address);
        formData.append("city", form.city);
        formData.append("propertyType", form.propertyType);
        formData.append("rent", form.rent);
        formData.append("bedrooms", "1");
        formData.append("bathrooms", "1");
        formData.append("garages", "0");
        formData.append("area", "50");
        formData.append("amenities", "[]");
        formData.append("isBinome", "true");

        const propRes = await ax.post("/api/properties", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!propRes.data.success) {
          toast.error(propRes.data.message);
          return;
        }
        propertyId = propRes.data.property._id;
      }

      // ── Créer le binome
      const binomeRes = await ax.post("/api/binomes", {
        propertyId,
        lookingFor: Number(form.lookingFor),
        description: form.description,
        preferences: form.preferences,
        availableFrom: form.availableFrom,
        university: form.university,
        field: form.field,
        year: form.year,
        contact: form.contact,
        phone: form.phone,
      });

      if (binomeRes.data.success) {
        toast.success("Annonce publiée avec succès!");
        onSuccess && onSuccess();
      } else {
        toast.error(binomeRes.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border ${errors[field] ? "border-red-400" : "border-gray-200"} rounded-lg px-3 py-2 regular-14 outline-none focus:border-secondary transition-colors`;

  const sharedRent = form.rent ? Math.round(Number(form.rent) / (Number(form.lookingFor) + 1)) : 0;

  const totalSteps = existingBooking ? 1 : 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flexBetween px-6 py-4 border-b border-slate-900/10">
          <div>
            <h3 className="h4">🎓 Publier une annonce</h3>
            {existingBooking ? (
              <p className="regular-13 text-secondary mt-0.5">
                📍 {existingBooking.property?.title}
              </p>
            ) : (
              <p className="regular-13 text-gray-400">Étape {step} sur {totalSteps}</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flexCenter rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">✕</button>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-100 h-1.5">
          <div className="bg-secondary h-1.5 transition-all duration-500"
            style={{ width: existingBooking ? "100%" : step === 1 ? "50%" : "100%" }} />
        </div>

        {/* Booking info banner si existingBooking */}
        {existingBooking && (
          <div className="mx-6 mt-4 p-4 bg-secondary/5 rounded-xl ring-1 ring-secondary/20 flex gap-3">
            <img
              src={existingBooking.property?.images?.[0] || "https://placehold.co/64x64?text=🏠"}
              alt=""
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div>
              <p className="medium-14 line-clamp-1">{existingBooking.property?.title}</p>
              <p className="regular-13 text-gray-400">📍 {existingBooking.property?.address}</p>
              <p className="regular-13 text-secondary font-semibold mt-1">
                {existingBooking.property?.price?.rent} DT/mois · {existingBooking.property?.propertyType?.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">

          {/* Step 1 — seulement si pas de booking existant */}
          {step === 1 && !existingBooking && (
            <div className="flex flex-col gap-4">
              <p className="bold-15 text-secondary mb-1">🏠 Informations sur le logement</p>

              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Ville *</label>
                <select name="city" value={form.city} onChange={handleChange} className={inputClass("city")}>
                  <option value="">Choisir une ville</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Adresse *</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Ex: 12 Rue de la République" className={inputClass("address")} />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

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
                  <input type="number" name="rent" value={form.rent} onChange={handleChange} placeholder="Ex: 400" className={inputClass("rent")} />
                  {errors.rent && <p className="text-red-400 text-xs mt-1">{errors.rent}</p>}
                </div>
              </div>

              <div>
                <label className="medium-13 text-gray-500 mb-2 block">Nombre de binomes *</label>
                <div className="flex gap-3">
                  {["1", "2"].map((n) => (
                    <button key={n} type="button" onClick={() => setForm((prev) => ({ ...prev, lookingFor: n }))}
                      className={`flex-1 py-2.5 rounded-lg border-2 medium-14 transition-all ${form.lookingFor === n ? "border-secondary bg-secondary text-white" : "border-gray-200 text-gray-500 hover:border-secondary"}`}>
                      👥 {n} binome{n === "2" ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {form.rent && (
                <div className="bg-secondary/10 rounded-xl p-4 flexBetween">
                  <p className="regular-14 text-gray-500">Loyer par personne :</p>
                  <p className="bold-18 text-secondary">{sharedRent} DT <span className="regular-13">/mois</span></p>
                </div>
              )}

              <button type="button" onClick={() => validateStep1() && setStep(2)} className="btn-dark w-full rounded-xl py-3 medium-14 mt-2">
                Suivant →
              </button>
            </div>
          )}

          {/* Step 2 — profil étudiant */}
          {(step === 2 || existingBooking) && (
            <div className="flex flex-col gap-4">
              <p className="bold-15 text-secondary mb-1">👤 Votre profil étudiant</p>

              {/* lookingFor — visible aussi pour booking existant */}
              <div>
                <label className="medium-13 text-gray-500 mb-2 block">Nombre de binomes recherchés *</label>
                <div className="flex gap-3">
                  {["1", "2"].map((n) => (
                    <button key={n} type="button" onClick={() => setForm((prev) => ({ ...prev, lookingFor: n }))}
                      className={`flex-1 py-2.5 rounded-lg border-2 medium-14 transition-all ${form.lookingFor === n ? "border-secondary bg-secondary text-white" : "border-gray-200 text-gray-500 hover:border-secondary"}`}>
                      👥 {n} binome{n === "2" ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loyer partagé */}
              {existingBooking && (
                <div className="bg-secondary/10 rounded-xl p-4 flexBetween">
                  <p className="regular-14 text-gray-500">Loyer par personne :</p>
                  <p className="bold-18 text-secondary">
                    {Math.round(existingBooking.property?.price?.rent / (Number(form.lookingFor) + 1))} DT
                    <span className="regular-13">/mois</span>
                  </p>
                </div>
              )}

              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Université / École *</label>
                <select name="university" value={form.university} onChange={handleChange} className={inputClass("university")}>
                  <option value="">Choisir une université</option>
                  {universities.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                {errors.university && <p className="text-red-400 text-xs mt-1">{errors.university}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Filière *</label>
                  <input type="text" name="field" value={form.field} onChange={handleChange} placeholder="Ex: Informatique" className={inputClass("field")} />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Email *</label>
                  <input type="email" name="contact" value={form.contact} onChange={handleChange} placeholder="email@example.com" className={inputClass("contact")} />
                  {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
                </div>
                <div>
                  <label className="medium-13 text-gray-500 mb-1 block">Téléphone *</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+216 XX XXX XXX" className={inputClass("phone")} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Disponible à partir du *</label>
                <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} className={inputClass("availableFrom")} />
                {errors.availableFrom && <p className="text-red-400 text-xs mt-1">{errors.availableFrom}</p>}
              </div>

              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder="Décrivez-vous et votre mode de vie..." className={`${inputClass("description")} resize-none`} />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="medium-13 text-gray-500 mb-2 block">Préférences</label>
                <div className="flex flex-wrap gap-2">
                  {allPreferences.map((pref) => (
                    <button key={pref} type="button" onClick={() => togglePreference(pref)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.preferences.includes(pref) ? "bg-secondary text-white border-secondary" : "bg-white text-gray-500 border-gray-200 hover:border-secondary"}`}>
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                {!existingBooking && (
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 medium-14 text-gray-500 hover:border-secondary transition-colors">
                    ← Retour
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className={`${existingBooking ? "w-full" : "flex-[2]"} btn-secondary text-white rounded-xl py-3 px-8 medium-14`}>
                  {loading ? "Publication..." : "✅ Publier l'annonce"}
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