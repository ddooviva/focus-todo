import React, { createContext, useContext, useState } from "react";

const ToDosContext = createContext();



export const ToDosProvider = ({ children }) => {
    const [toDos, setToDos] = useState({});

    return (
        <ToDosContext.Provider value={{ toDos, setToDos }}>
            {children}
        </ToDosContext.Provider>
    );
};


export const usePageLocation = () => {
    return useContext(ToDosContext);
};