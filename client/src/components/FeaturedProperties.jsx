import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/data";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

import { useAppContext } from "../context/AppContext";
import Item from "./Item";

const FeaturedProperties = () => {
  const { properties } = useAppContext();

  return (
    <section className="max-padd-container py-16 xl:py-22">
      {/* Section Header */}
      <span className="medium-16 text-secondary">
        Available Student Rooms & Houses
      </span>
      <h2 className="h2 mt-1">Discover Your Next Home</h2>

      {/* Subheader Row */}
      <div className="flexBetween mt-8 mb-6">
        <h5 className="text-gray-500">
          Showing <span className="font-bold text-black">1–9</span> of{" "}
          <span className="font-bold text-black">3,000+</span> listings
        </h5>
        <Link
          to="/listing"
          onClick={() => scrollTo(0, 0)}
          className="flexCenter gap-2 bg-secondary/10 hover:bg-secondary/20 ring-1 ring-slate-900/15 rounded-lg px-4 py-2 transition-all duration-300"
        >
          <img src={assets.sliders} alt="filters" width={18} />
          <span className="medium-13 text-secondary">Filter</span>
        </Link>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          600: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1124: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1300: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        modules={[Autoplay]}
        className="h-122 md:h-133.25 xl:h-105.5 mt-5"
      >
        {properties.slice(0, 9).map((property) => (
          <SwiperSlide key={property._id}>
            <Item property={property} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* View All Link */}
      <div className="flexCenter mt-10">
        <Link
          to="/listing"
          onClick={() => scrollTo(0, 0)}
          className="btn-outline medium-14 hover:bg-secondary hover:text-white transition-all duration-300"
        >
          View All Listings
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProperties;
