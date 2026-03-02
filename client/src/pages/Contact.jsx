import React, { useState } from "react";
import { assets } from "../assets/data";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white py-28 min-h-screen">
      <div className="max-padd-container">
        <div className="flex flex-col xl:flex-row gap-12 items-start justify-center">
          {/* Left — Info */}
          <div className="flex-1 max-w-md">
            <p className="text-xs bg-black/80 text-white font-medium px-3 py-1 rounded-full inline-block mb-4">
              Contact Us
            </p>
            <h1 className="h1 mb-4">
              Let's Get In <span className="text-secondary">Touch.</span>
            </h1>
            <p className="regular-14 text-gray-400 mb-8">
              Have a question about a property or need help finding the perfect
              student accommodation? We're here to help.
            </p>

            {/* Contact cards */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl ring-1 ring-slate-900/5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flexCenter shrink-0">
                  <img src={assets.mail} alt="mail" width={18} />
                </div>
                <div>
                  <p className="medium-14">Email</p>
                  <a
                    href="mailto:contactSN@gmail.com"
                    className="regular-13 text-secondary hover:underline"
                  >
                    contactSN@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl ring-1 ring-slate-900/5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flexCenter shrink-0">
                  <img src={assets.phone} alt="phone" width={18} />
                </div>
                <div>
                  <p className="medium-14">Phone</p>
                  <a
                    href="tel:+21655000000"
                    className="regular-13 text-secondary hover:underline"
                  >
                    +216 55 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl ring-1 ring-slate-900/5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flexCenter shrink-0">
                  <img src={assets.pin} alt="location" width={18} />
                </div>
                <div>
                  <p className="medium-14">Location</p>
                  <p className="regular-13 text-gray-400">Tunis, Tunisia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-8 shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h4 className="h4 mb-1">Send us a message</h4>

                  {/* Name */}
                  <div>
                    <label className="medium-13 text-gray-500 mb-1.5 block">
                      Full Name
                    </label>
                    <div className="flex items-center h-10 pl-3 border border-slate-200 bg-secondary/5 rounded-full focus-within:ring-2 focus-within:ring-secondary/30 focus-within:border-secondary transition-all overflow-hidden">
                      <img
                        src={assets.user}
                        alt=""
                        width={17}
                        className="opacity-40 shrink-0"
                      />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="h-full px-2 w-full outline-none bg-transparent regular-14"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="medium-13 text-gray-500 mb-1.5 block">
                      Email Address
                    </label>
                    <div className="flex items-center h-10 pl-3 border border-slate-200 bg-secondary/5 rounded-full focus-within:ring-2 focus-within:ring-secondary/30 focus-within:border-secondary transition-all overflow-hidden">
                      <img
                        src={assets.mail}
                        alt=""
                        width={17}
                        className="opacity-40 shrink-0"
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="h-full px-2 w-full outline-none bg-transparent regular-14"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="medium-13 text-gray-500 mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 bg-secondary/5 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all regular-14"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flexCenter gap-2 btn-secondary w-full font-bold rounded-full py-3"
                  >
                    Send Message
                    <img
                      src={assets.right}
                      alt=""
                      className="invert"
                      width={16}
                    />
                  </button>
                </form>
              ) : (
                // Success state
                <div className="flexCenter flex-col gap-4 py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flexCenter text-3xl">
                    ✅
                  </div>
                  <h4 className="h4 text-green-600">Message Sent!</h4>
                  <p className="regular-14 text-gray-400 max-w-xs">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", message: "" });
                    }}
                    className="btn-secondary text-white rounded-full px-6 py-2 medium-14 mt-2"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
