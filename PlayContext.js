import React, { createContext, useContext, useState } from "react";
const PlayContext = createContext();



export const PlayProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <PlayContext.Provider value={{ isPlaying, setIsPlaying }}>
            {children}
        </PlayContext.Provider>
    );
};


export const usePlay = () => {
    return useContext(PlayContext);
};