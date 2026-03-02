import React from "react";

const FormField = ({ icon, iconAlt, label, htmlFor, children }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flexStart gap-2">
        <img src={icon} alt={iconAlt} width={20} className="shrink-0" />
        <label htmlFor={htmlFor} className="medium-14 text-gray-600">
          {label}
        </label>
      </div>
      {children}
    </div>
  );
};

export default FormField;
