import { useContext, createContext, useState, useEffect, useRef } from "react";
import axios from 'axios'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState(null)
    const [values, setValues] = useState([])
    const [place, setPlace] = useState('dehradun')
    const [thisLocation, setLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [coords, setCoords] = useState(null)
    const manualOverride = useRef(false);

    // fetch api
    const fetchWeather = async (queryParam) => {
        setLoading(true)
        setError(null)
        const apiKey = '5a29544aa2744291870173851260904';
        // const apiKey = '6eb0cd02c2954df5a73125417262702';

        const query = queryParam || (coords ? `${coords.lat},${coords.lon}` : place) || 'dehradun';
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=7&aqi=no&alerts=no`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const apiMsg = errorData.error?.message;
                throw new Error(apiMsg || `HTTP Error ${response.status} — Location not found. Try a different city name.`);
            }

            const data = await response.json();

            if (data && data.location && data.current) {
                setLocation(`${data.location.name}, ${data.location.region}, ${data.location.country}`);

                if (data.forecast && data.forecast.forecastday) {
                    const forecastValues = data.forecast.forecastday.map(day => ({
                        datetime: day.date,
                        temp: day.day.avgtemp_c,
                        conditions: day.day.condition.text,
                        max_temp: day.day.maxtemp_c,
                        min_temp: day.day.mintemp_c,
                        chance_of_rain: day.day.daily_chance_of_rain
                    }));
                    setValues(forecastValues);
                } else {
                    setValues([]);
                }

                setWeather({
                    temp: data.current.temp_c,
                    humidity: data.current.humidity,
                    wspd: data.current.wind_kph,
                    heatindex: data.current.heatindex_c || data.current.feelslike_c,
                    conditions: data.current.condition.text,
                    icon: data.current.condition.icon
                });
            } else {
                throw new Error("Missing location or current data in API response");
            }
        } catch (e) {
            console.error("Critical Weather fetch error:", e);
            setError(`Unable to load weather: ${e.message}`);
            setWeather(null);
        } finally {
            setLoading(false)
        }
    }

    // On first load: try geolocation. If denied, fall back to default place.
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (!manualOverride.current) {
                        setCoords({ lat: latitude, lon: longitude });
                    }
                },
                () => {
                    fetchWeather(place);
                }
            );
        } else {
            fetchWeather(place);
        }
    }, [])  // Only on mount — NOT dependent on place

    // When place changes due to manual user input: fetch directly
    useEffect(() => {
        if (place && place !== 'dehradun') {
            manualOverride.current = true;
            fetchWeather(place);
        }
    }, [place])

    useEffect(() => {
        if (coords && !manualOverride.current) {
            fetchWeather(`${coords.lat},${coords.lon}`);
        }
    }, [coords])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place,
            loading,
            error
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
