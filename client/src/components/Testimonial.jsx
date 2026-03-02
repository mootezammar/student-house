import React from "react";
import { assets } from "../assets/data";
import Title from "./Title";

const cardsData = [
  {
    image: assets.user1,
    name: "Sarah Ahmed",
    handle: "@sarah_student",
    date: "January 12, 2026",
    text: "Found my perfect room near campus in less than 2 days. The process was so smooth and stress-free!",
  },
  {
    image: assets.user2,
    name: "Youssef Ben Ali",
    handle: "@youssef_uni",
    date: "February 3, 2026",
    text: "As a property manager, this is the best tool I've used to connect with student renters.",
  },
  {
    image: assets.user3,
    name: "Jordan Lee",
    handle: "@jordantalks",
    date: "December 20, 2025",
    text: "The search filters are amazing. I found a furnished room right next to my university.",
  },
  {
    image: assets.user4,
    name: "Amina Trabelsi",
    handle: "@amina_t",
    date: "November 15, 2025",
    text: "Booking a viewing was so easy — no back and forth emails. Everything handled in the app.",
  },
  {
    image: assets.user1,
    name: "Lucas Dupont",
    handle: "@lucas_dp",
    date: "October 8, 2025",
    text: "I listed my spare room and had a verified student tenant within a week. Love this platform.",
  },
  {
    image: assets.user2,
    name: "Fatima Nour",
    handle: "@fatima_n",
    date: "September 22, 2025",
    text: "Safe, transparent listings and a great support team. Highly recommend to every student.",
  },
];

const VerifiedBadge = () => {
  return (
    <svg
      className="mt-0.5 shrink-0"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
        fill="#2196F3"
      />
    </svg>
  );
};

const XIcon = () => {
  return (
    <svg
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z"
        fill="currentColor"
      />
    </svg>
  );
};

const TestimonialCard = ({ card }) => {
  return (
    <div className="p-4 rounded-xl mx-3 bg-white shadow-sm hover:shadow-md border border-slate-900/5 transition-all duration-200 w-72 shrink-0">
      <div className="flex gap-3 items-center">
        <img
          className="size-11 rounded-full object-cover shrink-0"
          src={card.image}
          alt={card.name}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="medium-14">{card.name}</p>
            <VerifiedBadge />
          </div>
          <span className="regular-13 text-slate-400">{card.handle}</span>
        </div>
      </div>
      <p className="regular-14 text-gray-700 py-4 leading-relaxed">
        "{card.text}"
      </p>
      <div className="flexBetween text-slate-400 border-t border-slate-900/5 pt-3">
        <div className="flexStart gap-1.5 regular-13">
          <span>Posted on</span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500 transition-colors duration-200"
          >
            <XIcon />
          </a>
        </div>
        <span className="regular-13">{card.date}</span>
      </div>
    </div>
  );
};

const MarqueeRow = ({ reverse = false }) => {
  return (
    <div className="w-full mx-auto max-w-5xl overflow-hidden relative">
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
      <div
        className={`flex transform-gpu min-w-[200%] py-4 ${reverse ? "marquee-reverse" : "marquee-inner"}`}
      >
        {[...cardsData, ...cardsData].map((card, index) => (
          <TestimonialCard key={index} card={card} />
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
    </div>
  );
};

const Testimonial = () => {
  return (
    <section className="max-padd-container py-16 xl:py-22 overflow-hidden">
      {/* Title Component */}
      <div className="text-center flex flex-col items-center mb-6">
        <Title
          title1="Student Reviews"
          title2="What Our Students Are Saying"
          para="Real experiences from students, room sharers, and property managers who use our platform every day."
          titleStyles="mb-2"
          title2Styles="text-center"
          paraStyles="text-center mx-auto"
        />
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marqueeScroll 30s linear infinite;
        }
        .marquee-reverse {
          animation: marqueeScroll 30s linear infinite reverse;
        }
      `}</style>

      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
};

export default Testimonial;
