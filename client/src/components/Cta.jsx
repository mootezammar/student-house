import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/data';

const Cta = () => {
  return (
    <section className='bg-[#eefbff] pt-16 xl:pt-22'>
      <div className="max-padd-container">
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 rounded-2xl">

          {/* Badge */}
          <div className="flexCenter bg-black/80 text-white px-4 py-1.5 ring-1 ring-slate-900/10 gap-2 rounded-full mb-4">
            <img src={assets.rocket} width={16} className='invert shrink-0' alt="rocket" />
            <span className='medium-13'>Built for Students, by Students</span>
          </div>

          {/* Heading */}
          <h2 className="h2 max-w-2xl leading-tight">
            List Your Room or Find Your
            <span className='text-secondary'> Perfect Student Home </span>
            in Minutes!
          </h2>

          {/* Subtext */}
          <p className="regular-14 text-slate-500 mt-3 max-w-lg leading-relaxed">
            Whether you're a student searching for affordable housing near campus,
            or someone with a free room to share — we make the process fast, safe, and simple.
          </p>

          {/* CTA Buttons */}
          <div className="flexCenter gap-4 mt-6 flex-wrap">
            <Link
              to="/listing"
              onClick={() => scrollTo(0, 0)}
              className="btn-secondary medium-14"
            >
              Find a Room
            </Link>
            <Link
              to="/list-property"
              onClick={() => scrollTo(0, 0)}
              className="btn-outline medium-14"
            >
              List Your Space
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Cta;