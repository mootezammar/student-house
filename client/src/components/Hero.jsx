import React from "react";
import { assets, cities } from "../assets/data";
import FormField from "./FormField";



const inputClass = "rounded border border-gray-200 px-3 py-1.5 mt-1.5 regular-14 outline-none focus:border-secondary transition-colors duration-200";

const Hero = () => {
  return (
    <section className="relative h-screen w-screen bg-[url('/src/assets/hero2.jpg')] bg-cover bg-center bg-no-repeat">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="max-padd-container h-full">
        <div className="relative flexEnd mx-auto flex-col gap-6 h-full pb-10 z-10">
          
          {/* Hero Content */}
          <div className="flex flex-col gap-4 text-white">
            <button className="flexStart w-fit gap-3 border border-white/70 medium-13 rounded-full pl-4 pr-0.5 py-1 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <span>Explore how we simplify student housing</span>
              <span className="flexCenter size-6 p-1 rounded-full bg-white shrink-0">
                <img src={assets.right} alt="arrow" width={20} />
              </span>
            </button>

            <h2 className="h2 capitalize leading-tight text-white max-w-2xl">
              Find your perfect{" "}
              <span className="bg-linear-to-r from-secondary to-white bg-clip-text text-transparent">
                student home
              </span>{" "}
              near your campus with ease
            </h2>
          </div>

          {/* Search Form */}
          <form className="bg-white text-gray-500 rounded-xl px-6 py-5 flex flex-col lg:flex-row gap-4 lg:gap-x-6 w-full ring-1 ring-slate-900/10 shadow-md">
            
            <FormField icon={assets.pin} iconAlt="location" label="Destination" htmlFor="destinationInput">
              <input
                className={inputClass}
                list="destinations"
                id="destinationInput"
                type="text"
                placeholder="Where are you going?"
                required
              />
              <datalist id="destinations">
                {cities.map((city, index) => (
                  <option value={city} key={index} />
                ))}
              </datalist>
            </FormField>

            <FormField icon={assets.calendar} iconAlt="calendar" label="Check in" htmlFor="checkIn">
              <input
                type="date"
                id="checkIn"
                className={inputClass}
              />
            </FormField>

            <FormField icon={assets.calendar} iconAlt="calendar" label="Check out" htmlFor="checkOut">
              <input
                type="date"
                id="checkOut"
                className={inputClass}
              />
            </FormField>

            <FormField icon={assets.user} iconAlt="guests" label="Roommates" htmlFor="guests">
              <input
                type="number"
                id="guests"
                min={1}
                max={10}
                placeholder="0"
                className={inputClass}
              />
            </FormField>

            <button
              type="submit"
              className="btn-dark flexCenter gap-2 lg:self-end lg:mb-0 rounded-xl py-2.5 px-8 max-md:w-full"
            >
              <img src={assets.search} alt="search" className="invert" width={18} />
              <span className="medium-14">Search</span>
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;