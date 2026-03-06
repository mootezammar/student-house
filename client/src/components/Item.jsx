import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/data";
import { useAppContext } from "../context/AppContext";

const FacilityBadge = ({ icon, alt, value, bordered = true }) => (
  <p
    className={`flexCenter gap-x-1 medium-13 ${bordered ? "border-r border-slate-900/20 pr-3" : ""}`}
  >
    <img src={icon} alt={alt} width={16} />
    {value}
  </p>
);

const Item = ({ property }) => {
  const { currency } = useAppContext();
  return (
    <Link
      to={`/listing/${property._id}`}
      onClick={() => scrollTo(0, 0)}
      className="block rounded-xl bg-white ring-1 ring-slate-900/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={
            property.images[0] ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={property.title}
          className="h-52 w-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {/* Property Type Badge */}
        <span className="absolute top-3 left-3 bg-secondary text-white medium-12 px-3 py-1 rounded-full">
          {property.propertyType}
        </span>
        {/* Price Badge */}
        <span className="absolute top-3 right-3 bg-white/90 text-secondary bold-13 px-3 py-1 rounded-full shadow-sm">
          {property.price.rent} {currency}
          <span className="text-gray-400 regular-11">/mo</span>
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Title */}
        <h4 className="h5 line-clamp-1 mb-1">{property.title}</h4>

        {/* Location */}
        <p className="flexStart gap-1 text-gray-400 regular-13 mb-3">
          <img src={assets.pin} alt="location" width={13} />
          {property.city}
        </p>

        {/* Facilities */}
        <div className="flex items-center gap-2 py-2 border-t border-slate-900/5">
          <FacilityBadge
            icon={assets.bed}
            alt="bedrooms"
            value={`${property.facilities.bedrooms} Bed`}
          />
          <FacilityBadge
            icon={assets.bath}
            alt="bathrooms"
            value={`${property.facilities.bathrooms} Bath`}
          />
          <FacilityBadge
            icon={assets.ruler}
            alt="area"
            value={property.area}
            bordered={false}
          />
        </div>

        {/* Description */}
        <p className="line-clamp-2 mt-2 regular-13">{property.description}</p>

        {/* CTA */}
        <div className="flexBetween mt-4 pt-3 border-t border-slate-900/5">
          <span className="regular-13 text-gray-400">Available now</span>
          <span className="medium-13 text-secondary hover:underline">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Item;
