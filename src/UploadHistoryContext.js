import React, { createContext, useState, useContext } from "react";

const UploadHistoryContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadHistory, setUploadHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("uploadHistory")) || [];
    } catch (error) {
      console.error("Error parsing upload history:", error);
      return [];
    }

    
  });

  console.log(uploadHistory)

  const addUpload = (fileID, fileName) => {
    const newEntry = { id: fileID, fileName, date: new Date().toLocaleString() };
    const updatedHistory = [...uploadHistory, newEntry];

    setUploadHistory(updatedHistory);

    localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));
  };

  return (
    <UploadHistoryContext.Provider value={{ uploadHistory, addUpload }}>
      {children}
    </UploadHistoryContext.Provider>
  );
};

export const useUpload = () => useContext(UploadHistoryContext);