import React, { createContext, useContext, useState } from "react";
const PageLocationContext = createContext();



export const PageLocationProvider = ({ children }) => {
    const [pageLocation, setPageLocation] = useState(0);

    return (
        <PageLocationContext.Provider value={{ pageLocation, setPageLocation }}>
            {children}
        </PageLocationContext.Provider>
    );
};


export const usePageLocation = () => {
    return useContext(PageLocationContext);
};