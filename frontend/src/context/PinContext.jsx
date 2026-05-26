import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchPins() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/pin/all");
            setPins(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPins();
    }, []);

    return (
        <PinContext.Provider value={{ pins, loading, fetchPins }}>
            {children}
        </PinContext.Provider>
    );
};

export const PinData = () => useContext(PinContext);
