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

         
        </div>
      </div>
    </section>
  );
};

export default Hero;