import React, { useState } from "react";
import { assets } from "../assets/data";
import Title from "./Title";

const faqsData = [
  {
    question: "How do I find a room near my university?",
    answer:
      "Simply enter your university city in the search bar, set your move-in date, and browse available rooms and shared houses nearby. You can filter by price, room type, and distance.",
  },
  {
    question: "Can I list my free room as a student?",
    answer:
      "Yes! If you have a spare room or want to share your place with another student, you can create a listing in minutes. Just sign up, add your room details, photos, and set your price.",
  },
  {
    question: "Are property managers allowed to list on this platform?",
    answer:
      "Absolutely. Property managers and landlords can register and list multiple properties. Our platform makes it easy to manage bookings, availability, and tenant communication all in one place.",
  },
  {
    question: "Is the platform free for students?",
    answer:
      "Browsing and searching for rooms is completely free for students. Listing a room as a student is also free. We only charge a small service fee when a booking is confirmed.",
  },
  {
    question: "How do I schedule a property viewing?",
    answer:
      "Once you find a listing you like, you can request a viewing directly through the app. The host or manager will confirm a suitable time — no phone calls or emails needed.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes. We take privacy seriously. Your personal data is encrypted and never shared with third parties without your consent. Only confirmed booking parties can see contact details.",
  },
];

const FaqItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = openIndex === index;

  return (
    <div className="w-full border border-slate-900/10 rounded-xl overflow-hidden">
      <button
        className="flexBetween w-full cursor-pointer bg-white hover:bg-secondary/5 px-5 py-3.5 transition-colors duration-200"
        onClick={() => setOpenIndex(isOpen ? null : index)}
      >
        <h5 className="medium-14 text-left">{faq.question}</h5>
        <img
          src={assets.down}
          alt="toggle"
          width={18}
          className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`px-5 transition-all duration-400 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[200px] pb-4 pt-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="regular-14 text-gray-500 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-padd-container py-16 xl:py-22">
      <div className="flex flex-col gap-y-12 xl:flex-row gap-x-16">

        {/* Left Side - Image */}
        <div className="flex-1">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={assets.faq}
              alt="Student housing FAQ"
              className="block w-full object-cover"
            />
            {/* Floating Card */}
            <div className="absolute top-5 left-5 right-5 bg-white/95 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 shadow-md z-10">
              <img
                src={assets.signature}
                alt="verified"
                width={55}
                className="shrink-0"
              />
              <div>
                <h5 className="bold-15">Verified Student Platform</h5>
                <p className="regular-13 mt-0.5">
                  Safe, simple, and built exclusively for students and trusted housing providers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - FAQs */}
        <div className="flex-1 flex flex-col justify-center">
          <Title
            title1={"Got Questions?"}
            title2={"Everything You Need to Know About Student Housing"}
            para={
              "From finding a room to listing your own space — we've answered the most common questions to help you get started quickly."
            }
            titleStyles={"mb-10"}
          />

          <div className="flex flex-col gap-3 w-full max-w-xl">
            {faqsData.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Faq;