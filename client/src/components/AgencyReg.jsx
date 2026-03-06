import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, cities } from "../assets/data";
import toast from "react-hot-toast";

const AgencyReg = () => {
  const { setShowAgencyReg, getAxios, getUserData, setIsOwner } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Agency name is required";
    if (!form.contact) newErrors.contact = "Contact is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "Please select a city";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const ax = await getAxios();
      const { data } = await ax.post("/api/agency/register", form);

      if (data.success) {
        setSubmitted(true);
        await getUserData(); // ← refresh user data
        setIsOwner(true);   // ← set owner
        toast.success("Agency registered successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `regular-14 border ${
      errors[field] ? "border-red-400" : "border-slate-900/10"
    } bg-secondary/10 rounded-lg w-full px-3 py-1.5 mt-1 outline-none focus:border-secondary transition-colors`;

  return (
    <div
      onClick={() => setShowAgencyReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl w-full max-w-4xl relative overflow-hidden"
      >
        {/* Left image */}
        <img
          src={assets.createPrp}
          alt="agency"
          className="w-1/2 object-cover hidden md:block"
        />

        {/* Close button */}
        <img
          onClick={() => setShowAgencyReg(false)}
          src={assets.close}
          alt="close"
          className="absolute top-4 right-4 h-6 w-6 p-1 cursor-pointer bg-secondary/50 rounded-full shadow-md z-10"
        />

        {/* Right form */}
        <div className="flex flex-col md:w-1/2 p-8 md:p-10 overflow-y-auto max-h-[90vh]">

          {!submitted ? (
            <>
              <h3 className="h3 mb-1">Register Agency</h3>
              <p className="regular-13 text-gray-400 mb-6">
                Join our platform and start listing properties for students
              </p>

              {/* Name + Contact */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label htmlFor="name" className="medium-14">Agency Name</label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your agency name"
                    className={inputClass("name")}
                    required
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <label htmlFor="contact" className="medium-14">Contact</label>
                  <input
                    id="contact"
                    type="text"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                    className={inputClass("contact")}
                    required
                  />
                  {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="medium-14">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="agency@email.com"
                  className={inputClass("email")}
                  required
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label htmlFor="address" className="medium-14">Address</label>
                <input
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className={inputClass("address")}
                  required
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="mb-6">
                <label htmlFor="city" className="medium-14">City</label>
                <select
                  id="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass("city") + " py-2.5"}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-dark py-2.5 rounded-lg w-full medium-14"
              >
                {loading ? "Registering..." : "Register Agency"}
              </button>
            </>
          ) : (
            <div className="flexCenter flex-col gap-4 py-10 text-center h-full">
              <div className="w-16 h-16 bg-green-100 rounded-full flexCenter text-3xl">
                ✅
              </div>
              <h4 className="h4 text-green-600">Agency Registered!</h4>
              <p className="regular-14 text-gray-400">
                <span className="font-semibold text-gray-600">{form.name}</span> has been successfully registered.
              </p>
              <button
                type="button"
                onClick={() => setShowAgencyReg(false)}
                className="btn-secondary text-white rounded-lg px-6 py-2 medium-14 mt-2"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </form>
    </div>
  );
};

export default AgencyReg;