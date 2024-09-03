import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [userCity, setUserCity] = useState("");
  const [cityToSearch, setCityToSearch] = useState(""); 

  useEffect(() => {
    const fetchWeather = async () => {
      if (cityToSearch) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=d001c75c49c087df4a01e98f695efaf0&units=metric`
          );
          setWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeather();
  }, [cityToSearch]);

  
  const handleChange = (event) => {
    setUserCity(event.target.value);
  };
  const handleSearch = () => {
    setCityToSearch(userCity);
  };

  return (
    <div>
      <input type="text" value={userCity} onChange={handleChange} placeholder="Ingrese el nombre de la ciudad" />
      <button onClick={handleSearch}>Buscar Ciudad</button>

      {weatherData ? (
        <div>
          <h1>{weatherData.name}</h1>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default App;
