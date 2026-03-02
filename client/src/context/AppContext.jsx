import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProperties } from "../assets/data";
import { useUser } from "@clerk/clerk-react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showAgencyReg, setShowAgencyReg] = useState(false);
  const [isOwner, setIsOwner] = useState(true);

  
  const currency = "DT";

  const getProperties = () => {
    setProperties(dummyProperties);
  };

  useEffect(() => {
    getProperties();
  }, []);

  const value = {
    navigate,
    properties,
    currency,
    user,
    showAgencyReg,
    setShowAgencyReg,
    isOwner,
    setIsOwner,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
