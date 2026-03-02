import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, cities } from "../../assets/data";

const AddHouse = () => {
  const { currency } = useAppContext();

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    country: "Tunisia",
    propertyType: "",
    rent: "",
    bedrooms: "",
    bathrooms: "",
    garages: "",
    area: "",
    amenities: [],
  });

  const [images, setImages] = useState([null, null, null, null]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAmenities = [
    "Balcony", "High-Speed Internet", "Backyard", "Parking",
    "Fitness Center", "Swimming Pool", "Garden", "Garage",
    "Fireplace", "Terrace", "Air Conditioning", "Elevator",
  ];

  const propertyTypes = ["s+0", "s+1", "s+2", "s+3", "s+4", "s+5+"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Required";
    if (!form.description) newErrors.description = "Required";
    if (!form.address) newErrors.address = "Required";
    if (!form.city) newErrors.city = "Required";
    if (!form.propertyType) newErrors.propertyType = "Required";
    if (!form.rent) newErrors.rent = "Required";
    if (!form.bedrooms) newErrors.bedrooms = "Required";
    if (!form.bathrooms) newErrors.bathrooms = "Required";
    if (!form.area) newErrors.area = "Required";
    if (!images[0]) newErrors.images = "Cover photo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      title: "", description: "", address: "", city: "",
      country: "Tunisia", propertyType: "", rent: "",
      bedrooms: "", bathrooms: "", garages: "", area: "", amenities: [],
    });
    setImages([null, null, null, null]);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("New property:", { ...form, images });
    setSubmitted(true);
  };

  const inputClass = (field) =>
    `regular-14 border ${
      errors[field] ? "border-red-400 bg-red-50" : "border-slate-900/10 bg-secondary/5"
    } rounded-lg w-full px-3 py-2 outline-none focus:border-secondary transition-colors`;

  if (submitted) {
    return (
      <div className="flex-1 m-1 sm:m-3 h-[97vh] bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl flexCenter flex-col gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flexCenter text-3xl">✅</div>
        <h4 className="h4 text-green-600">Property Listed!</h4>
        <p className="regular-14 text-gray-400 text-center max-w-xs">
          <span className="font-semibold text-gray-600">{form.title}</span> has been successfully added to your listings.
        </p>
        <button
          onClick={() => { setSubmitted(false); resetForm(); }}
          className="btn-secondary text-white rounded-lg px-6 py-2 medium-14 mt-2"
        >
          Add Another Property
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 md:px-8 py-6 m-1 sm:m-3 h-[97vh] overflow-y-scroll bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl">

      {/* Header */}
      <div className="mb-6">
        <h3 className="h3">Add New Property</h3>
        <p className="regular-13 text-gray-400">Fill in the details to list a new property</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-3xl">

        {/* ── Images ── */}
        <div>
          <h4 className="h5 mb-1">📸 Property Images</h4>
          <p className="regular-12 text-gray-400 mb-3">
            Upload 4 images. First image will be the cover.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative group">
                {images[index] ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(images[index])}
                      alt={`preview-${index}`}
                      className={`w-full h-28 object-cover rounded-xl ring-2 ${
                        index === 0 ? "ring-secondary" : "ring-slate-900/10"
                      }`}
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                    {/* Hover — change */}
                    <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/40 rounded-xl flexCenter transition-opacity">
                      <span className="text-white text-xs font-medium">Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImage(e, index)}
                        className="hidden"
                      />
                    </label>
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flexCenter opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    index === 0
                      ? "border-secondary/50 bg-secondary/5 hover:bg-secondary/10"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}>
                    <span className="text-2xl mb-1">{index === 0 ? "🖼️" : "➕"}</span>
                    <p className="regular-12 text-gray-400 text-center px-1">
                      {index === 0 ? "Cover photo" : `Photo ${index + 1}`}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage(e, index)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="text-red-400 text-xs mt-2">{errors.images}</p>
          )}
        </div>

        {/* ── Basic Info ── */}
        <div>
          <h4 className="h5 mb-3">🏠 Basic Information</h4>
          <div className="flex flex-col gap-4">

            <div>
              <label className="medium-13 text-gray-500 mb-1 block">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Modern Studio near University"
                className={inputClass("title")}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="medium-13 text-gray-500 mb-1 block">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the property..."
                className={`${inputClass("description")} resize-none`}
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Property Type *</label>
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  className={inputClass("propertyType")}
                >
                  <option value="">Select type</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>{t.toUpperCase()}</option>
                  ))}
                </select>
                {errors.propertyType && <p className="text-red-400 text-xs mt-1">{errors.propertyType}</p>}
              </div>
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Rent (DT/mo) *</label>
                <input
                  name="rent"
                  type="number"
                  min="0"
                  value={form.rent}
                  onChange={handleChange}
                  placeholder="Ex: 400"
                  className={inputClass("rent")}
                />
                {errors.rent && <p className="text-red-400 text-xs mt-1">{errors.rent}</p>}
              </div>
            </div>

          </div>
        </div>

        {/* ── Location ── */}
        <div>
          <h4 className="h5 mb-3">📍 Location</h4>
          <div className="flex flex-col gap-4">

            <div>
              <label className="medium-13 text-gray-500 mb-1 block">Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Ex: 12 Rue de la République"
                className={inputClass("address")}
              />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">City *</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass("city")}
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="medium-13 text-gray-500 mb-1 block">Country</label>
                <input
                  name="country"
                  value={form.country}
                  className={inputClass("country") + " opacity-60 cursor-not-allowed"}
                  disabled
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── Facilities ── */}
        <div>
          <h4 className="h5 mb-3">🛏️ Facilities</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "bedrooms", label: "Bedrooms", icon: "🛏️", required: true },
              { name: "bathrooms", label: "Bathrooms", icon: "🚿", required: true },
              { name: "garages", label: "Garages", icon: "🚗", required: false },
              { name: "area", label: "Area (m²)", icon: "📐", required: true },
            ].map(({ name, label, icon, required }) => (
              <div key={name}>
                <label className="medium-13 text-gray-500 mb-1 block">
                  {icon} {label} {required && "*"}
                </label>
                <input
                  name={name}
                  type="number"
                  min="0"
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputClass(name)}
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Amenities ── */}
        <div>
          <h4 className="h5 mb-3">✨ Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  form.amenities.includes(amenity)
                    ? "bg-secondary text-white border-secondary"
                    : "bg-white text-gray-500 border-gray-200 hover:border-secondary"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
          {form.amenities.length > 0 && (
            <p className="regular-12 text-secondary mt-2">
              {form.amenities.length} selected
            </p>
          )}
        </div>

        {/* ── Submit ── */}
        <div className="flex gap-3 pb-6">
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 medium-14 text-gray-500 hover:border-secondary transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="flex-[2] btn-dark py-3 rounded-xl medium-14"
          >
            + Publish Property
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddHouse;