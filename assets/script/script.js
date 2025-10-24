// 🌤 Simple Weather Map (Free version)
const API_KEY = "9e77ec7492fee5be08be9e2c4a0b6493"; // Your OpenWeatherMap key

// Initialize map (centered on Cambodia)
const map = L.map("map").setView([11.56, 104.93], 6);

// Add base map from OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// --- MOCK 10-DAY FORECAST DATA ---
const mockForecastData = [
  {
    date: "10/22",
    dayOfWeek: "TODAY",
    highTemp: 33,
    lowTemp: 26,
    iconCode: "sun",
    descriptionPrimary: "Times of sun and clouds",
    descriptionSecondary: "Night: Mostly cloudy",
    precipitationChance: 40,
  },
  {
    date: "10/23",
    dayOfWeek: "THU",
    highTemp: 32,
    lowTemp: 25,
    iconCode: "cloud",
    descriptionPrimary: "Turning cloudy",
    descriptionSecondary: "Low clouds",
    precipitationChance: 25,
  },
  {
    date: "10/24",
    dayOfWeek: "FRI",
    highTemp: 33,
    lowTemp: 26,
    iconCode: "rain",
    descriptionPrimary: "An afternoon t-storm or two",
    descriptionSecondary: "An evening t-storm or two",
    precipitationChance: 90,
  },
  {
    date: "10/25",
    dayOfWeek: "SAT",
    highTemp: 31,
    lowTemp: 26,
    iconCode: "rain",
    descriptionPrimary: "Rain at times",
    descriptionSecondary: "A little rain early; cloudy",
    precipitationChance: 91,
  },
  {
    date: "10/26",
    dayOfWeek: "SUN",
    highTemp: 34,
    lowTemp: 25,
    iconCode: "rain",
    descriptionPrimary: "Rain in the afternoon",
    descriptionSecondary: "A little rain early; cloudy",
    precipitationChance: 93,
  },
  {
    date: "10/27",
    dayOfWeek: "MON",
    highTemp: 32,
    lowTemp: 24,
    iconCode: "rain",
    descriptionPrimary: "Periods of rain",
    descriptionSecondary: "A little rain early; cloudy",
    precipitationChance: 60,
  },
  {
    date: "10/28",
    dayOfWeek: "TUE",
    highTemp: 32,
    lowTemp: 26,
    iconCode: "rain",
    descriptionPrimary: "Periods of rain",
    descriptionSecondary: "Early rain; overcast",
    precipitationChance: 70,
  },
  {
    date: "10/29",
    dayOfWeek: "WED",
    highTemp: 31,
    lowTemp: 26,
    iconCode: "rain",
    descriptionPrimary: "Rain in the afternoon",
    descriptionSecondary: "A little rain early; cloudy",
    precipitationChance: 85,
  },
  {
    date: "10/30",
    dayOfWeek: "THU",
    highTemp: 33,
    lowTemp: 25,
    iconCode: "rain",
    descriptionPrimary: "Mostly cloudy, a little rain",
    descriptionSecondary: "Early rain; mostly cloudy",
    precipitationChance: 58,
  },
  {
    date: "10/31",
    dayOfWeek: "FRI",
    highTemp: 32,
    lowTemp: 25,
    iconCode: "rain",
    descriptionPrimary: "Periods of rain",
    descriptionSecondary: "Partly to mostly cloudy",
    precipitationChance: 60,
  },
];

// --- RENDER FORECAST FUNCTION ---
function renderForecast(forecastData) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = ""; // Clear previous content

  // Add header
  container.innerHTML = '<div class="header">10-DAY WEATHER FORECAST</div>';

  forecastData.forEach((day) => {
    const row = document.createElement("div");
    row.className = "forecast-row";

    let iconClass = "";
    if (day.iconCode.includes("sun")) iconClass = "sun-icon";
    else if (day.iconCode.includes("rain") || day.iconCode.includes("storm"))
      iconClass = "rain-icon";
    else iconClass = "cloud-icon";

    row.innerHTML = `
      <div class="column-date">
        <span class="day-name">${day.dayOfWeek}</span>
        <span class="date-number">${day.date}</span>
      </div>

      <div class="column-temp">
        <span class="high-temp">${day.highTemp}°</span>
        <span class="low-temp">${day.lowTemp}°</span>
      </div>

      <div class="column-icon">
        <div class="weather-icon ${iconClass}"></div>
      </div>

      <div class="column-description">
        <div class="primary-description">${day.descriptionPrimary}</div>
        <div class="secondary-description">${day.descriptionSecondary}</div>
      </div>

      <div class="column-rain-chance">
        <span class="rain-chance">${day.precipitationChance}%</span>
      </div>
    `;
    container.appendChild(row);
  });
}

// --- LOAD FORECAST DATA ---
function loadWeatherForecast() {
  renderForecast(mockForecastData);
}

// --- FETCH REAL-TIME WEATHER WHEN MAP CLICKED ---
map.on("click", async (e) => {
  const { lat, lng } = e.latlng;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    const data = await res.json();

    // Weather info
    const info = `
      📍 <strong>${data.name || "Unknown location"}</strong><br>
      🌡️ Temperature: ${data.main.temp} °C<br>
      💧 Humidity: ${data.main.humidity}%<br>
      🌬️ Wind Speed: ${data.wind.speed} m/s<br>
      ☁️ Weather: ${data.weather[0].description}
    `;

    // Show popup and info
    L.popup().setLatLng([lat, lng]).setContent(info).openOn(map);
    document.getElementById("weatherData").innerHTML = info;
  } catch (err) {
    document.getElementById("weatherData").textContent = "❌ " + err.message;
  }
});

// --- START EVERYTHING ---
document.addEventListener("DOMContentLoaded", loadWeatherForecast);
