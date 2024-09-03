import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [userCity, setUserCity] = useState("");
  const [cityToSearch, setCityToSearch] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      if (cityToSearch) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=d001c75c49c087df4a01e98f695efaf0&units=metric`
          );
          const weather = response.data;
          setWeatherData(weather);

          // Obtener la calidad del aire usando las coordenadas
          const { lat, lon } = weather.coord;
          const airQualityResponse = await axios.get(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=d001c75c49c087df4a01e98f695efaf0`
          );
          setAirQuality(airQualityResponse.data);
        } catch (error) {
          console.error("Error fetching weather or air quality data:", error);
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
      <input
        type="text"
        value={userCity}
        onChange={handleChange}
        placeholder="Ingrese el nombre de la ciudad"
      />
      <button onClick={handleSearch}>Buscar Ciudad</button>

      {weatherData ? (
        <div>
          <h1>Ciudad: {weatherData.name}</h1>
          <p>Latitud: {weatherData.coord.lat}</p>
          <p>Longitud: {weatherData.coord.lon}</p>
          <p>Temperatura: {weatherData.main.temp}°C</p>
          <p>Humedad: {weatherData.main.humidity}%</p>

          {airQuality ? (
            <p>Calidad del aire (Índice de calidad del aire - AQI): {airQuality.list[0].main.aqi}</p>
          ) : (
            <p>Cargando calidad del aire...</p>
          )}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default App;
