import React from "react";
import Title from "./Title";
import { assets } from "../assets/data";

const About = () => {
  return (
    <section className="max-padd-container py-16 xl:py-28 pt-36">
      {/* Container */}
      <div className="flex items-center flex-col lg:flex-row gap-12">
        
        {/* Left Side - Info */}
        <div className="flex-1">
          <Title
            title1={"Your Trusted Student Housing Platform"}
            title2={"Making Student Rentals Simple & Accessible"}
            para={
              "Whether you're a student looking for a place to stay, a student with a free room to share, or a property manager — we connect you all in one easy platform."
            }
            titleStyles={"mb-10"}
          />

          <div className="flex flex-col gap-6 mt-5">
            <div className="flex items-start gap-3">
              <img src={assets.calendarSecondary} alt="" width={20} className="mt-0.5 shrink-0" />
              <p>Easy scheduling for property viewings directly in the app</p>
            </div>
            <div className="flex items-start gap-3">
              <img src={assets.graph} alt="" width={20} className="mt-0.5 shrink-0" />
              <p>Affordable listings updated in real-time for students</p>
            </div>
            <div className="flex items-start gap-3">
              <img src={assets.map} alt="" width={20} className="mt-0.5 shrink-0" />
              <p>Find rooms near your university with a simple search</p>
            </div>
            <div className="flex items-start gap-3">
              <img src={assets.pound} alt="" width={20} className="mt-0.5 shrink-0" />
              <p>Students can list their free rooms and split costs easily</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center divide-x divide-gray-300 mt-11">
            <div className="flex -space-x-3 pr-3">
              <img src={assets.client1} alt="student" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[1]" />
            </div>
            <div className="flex -space-x-3 pr-3">
              <img src={assets.client2} alt="student" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[1]" />
            </div>
            <div className="flex -space-x-3 pr-3">
              <img src={assets.client3} alt="student" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[1]" />
            </div>
            <div className="flex -space-x-3 pr-3">
              <img src={assets.client4} alt="student" className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-[1]" />
            </div>
            <div className="pl-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={assets.star} alt="star" width={17} />
                ))}
                <p className="text-gray-600 medium-16 ml-2">5.0</p>
              </div>
              <p className="text-sm text-gray-500">
                Trusted by{" "}
                <span className="font-medium text-gray-800">10,000+</span>{" "}
                students
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 flex justify-end">
          <img
            src={assets.about}
            alt="students housing"
            className="rounded-3xl w-full object-cover shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default About;