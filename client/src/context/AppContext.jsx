import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [showAgencyReg, setShowAgencyReg] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userData, setUserData] = useState(null);
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currency = "DT";

  // ── Axios avec token
  const getAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: BACKEND_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // ── Get all properties
  const getProperties = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/properties`);
      if (data.success) setProperties(data.properties);
    } catch (error) {
      toast.error("Failed to load properties");
    }
  };

  // ── Get user data
  const getUserData = async () => {
    try {
      const ax = await getAxios();
      const { data } = await ax.get("/api/user");
      if (data.success) {
        setUserData(data.user);
        setIsOwner(data.user.role === "owner");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ── Get agency data
  const getAgencyData = async () => {
    try {
      const ax = await getAxios();
      const { data } = await ax.get("/api/agency/my");
      if (data.success) setAgencyData(data.agency);
    } catch (error) {
      console.error(error);
    }
  };

  // ── Fetch all on mount
  useEffect(() => {
    getProperties();
  }, []);

  // ── Fetch user data when logged in
  useEffect(() => {
    if (user) {
      getUserData();
    }
    setLoading(false);
  }, [user]);

  // ── Fetch agency data when owner
  useEffect(() => {
    if (isOwner) {
      getAgencyData();
    }
  }, [isOwner]);

  const value = {
    navigate,
    properties,
    setProperties,
    currency,
    user,
    userData,
    setUserData,
    agencyData,
    setAgencyData,
    showAgencyReg,
    setShowAgencyReg,
    isOwner,
    setIsOwner,
    loading,
    getAxios,
    getProperties,
    getUserData,
    getAgencyData,
    BACKEND_URL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);