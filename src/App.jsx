import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [userCity, setUserCity] = useState("");
  const [cityToSearch, setCityToSearch] = useState("");
  const [airQualityHistory, setAirQualityHistory] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (cityToSearch) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=d001c75c49c087df4a01e98f695efaf0&units=metric`
          );
          const weather = response.data;
          setWeatherData(weather);

          const { lat, lon } = weather.coord;
          const airQualityResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=d001c75c49c087df4a01e98f695efaf0`
          );

          const currentAirQuality = airQualityResponse.data.list[0].main.aqi;
          setAirQuality(currentAirQuality);

          // Actualiza el historial de la calidad del aire
          setAirQualityHistory((prevHistory) => [
            ...prevHistory,
            { time: new Date().toLocaleTimeString(), aqi: currentAirQuality }
          ]);

          // Sistema de alertas basado en la calidad del aire
          if (currentAirQuality >= 4) {
            alert("¡Alerta! La calidad del aire es peligrosa.");
          }
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

  const data = {
    labels: airQualityHistory.map((entry) => entry.time),
    datasets: [
      {
        label: "Índice de Calidad del Aire (AQI)",
        data: airQualityHistory.map((entry) => entry.aqi),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
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
            <>
              <p>Calidad del aire (Índice de calidad del aire - AQI): {airQuality}</p>
              <Line data={data} />
            </>
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
