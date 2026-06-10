import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function fetchPins(pageNum = 1) {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/pin/all?page=${pageNum}&limit=20`);
            if (pageNum === 1) {
                setPins(data.pins);
            } else {
                setPins(prev => [...prev, ...data.pins]);
            }
            setHasMore(data.hasMore);
            setPage(pageNum);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPins(1);
    }, []);

    return (
        <PinContext.Provider value={{ pins, setPins, loading, fetchPins, page, hasMore }}>
            {children}
        </PinContext.Provider>
    );
};

export const PinData = () => useContext(PinContext);
