const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

const elements = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#city-input"),
  status: document.querySelector("#search-status"),
  cityName: document.querySelector("#city-name"),
  locationLabel: document.querySelector("#location-label"),
  timestamp: document.querySelector("#last-updated"),
  conditionIcon: document.querySelector("#condition-icon"),
  temperature: document.querySelector("#temperature"),
  condition: document.querySelector("#condition"),
  feelsLike: document.querySelector("#feels-like"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#wind-speed"),
  visibility: document.querySelector("#visibility"),
  forecastList: document.querySelector("#forecast-list"),
  travelSummary: document.querySelector("#travel-summary"),
  travelTips: document.querySelector("#travel-tips"),
  template: document.querySelector("#forecast-template"),
};

const weatherIcons = {
  Clear: { icon: "☀️", label: "Sunny" },
  Clouds: { icon: "☁️", label: "Cloudy" },
  Rain: { icon: "🌧️", label: "Rainy" },
  Drizzle: { icon: "🌦️", label: "Light rain" },
  Snow: { icon: "❄️", label: "Snowy" },
  Thunderstorm: { icon: "⛈️", label: "Thunderstorm" },
  Mist: { icon: "🌫️", label: "Misty" },
  Smoke: { icon: "🌫️", label: "Smoky" },
  Haze: { icon: "🌫️", label: "Hazy" },
  Dust: { icon: "🌪️", label: "Dusty" },
  Fog: { icon: "🌫️", label: "Foggy" },
  Sand: { icon: "🌪️", label: "Sandy" },
  Ash: { icon: "🌋", label: "Ashy" },
  Squall: { icon: "💨", label: "Squall" },
  Tornado: { icon: "🌪️", label: "Tornado" },
};

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

function setStatus(message, type = "") {
  elements.status.textContent = message;
  elements.status.className = `status-banner ${type}`.trim();
}

function getWeatherIcon(condition = "") {
  const normalizedCondition = String(condition).toLowerCase();
  const conditionCodeMap = {
    "200": "⛈️",
    "201": "⛈️",
    "202": "⛈️",
    "210": "⛈️",
    "211": "⛈️",
    "212": "⛈️",
    "221": "⛈️",
    "230": "⛈️",
    "231": "⛈️",
    "232": "⛈️",
    "300": "🌦️",
    "301": "🌦️",
    "302": "🌧️",
    "310": "🌦️",
    "311": "🌧️",
    "312": "🌧️",
    "500": "🌧️",
    "501": "🌧️",
    "502": "🌧️",
    "503": "🌧️",
    "504": "🌧️",
    "511": "❄️",
    "520": "🌦️",
    "521": "🌧️",
    "522": "🌧️",
    "531": "🌧️",
    "600": "❄️",
    "601": "❄️",
    "602": "❄️",
    "611": "🌧️",
    "612": "🌧️",
    "613": "🌧️",
    "615": "🌧️",
    "616": "🌧️",
    "620": "❄️",
    "621": "❄️",
    "622": "❄️",
    "701": "🌫️",
    "711": "🌫️",
    "721": "🌫️",
    "731": "🌪️",
    "741": "🌫️",
    "751": "🌪️",
    "761": "🌪️",
    "762": "🌋",
    "771": "💨",
    "781": "🌪️",
    "800": "☀️",
    "801": "⛅",
    "802": "☁️",
    "803": "☁️",
    "804": "☁️",
  };

  const textMap = {
    clear: { icon: "☀️", label: "Clear" },
    clouds: { icon: "☁️", label: "Cloudy" },
    rain: { icon: "🌧️", label: "Rainy" },
    drizzle: { icon: "🌦️", label: "Light rain" },
    snow: { icon: "❄️", label: "Snowy" },
    thunderstorm: { icon: "⛈️", label: "Thunderstorm" },
    mist: { icon: "🌫️", label: "Misty" },
    smoke: { icon: "🌫️", label: "Smoky" },
    haze: { icon: "🌫️", label: "Hazy" },
    fog: { icon: "🌫️", label: "Foggy" },
    dust: { icon: "🌪️", label: "Dusty" },
    sand: { icon: "🌪️", label: "Sandy" },
    ash: { icon: "🌋", label: "Ashy" },
    squall: { icon: "💨", label: "Squall" },
    tornado: { icon: "🌪️", label: "Tornado" },
  };

  if (!normalizedCondition) {
    return { icon: "🌤️", label: "Changing conditions" };
  }

  const codePrefix = normalizedCondition.split(" ")[0];
  return textMap[normalizedCondition] ?? {
    icon: conditionCodeMap[codePrefix] ?? "🌤️",
    label: (normalizedCondition.charAt(0).toUpperCase() + normalizedCondition.slice(1)) || "Changing conditions",
  };
}

function formatTemperature(value) {
  return `${Math.round(value)}°C`;
}

function formatWind(value) {
  return `${Math.round(value)} km/h`;
}

function formatVisibility(value) {
  return `${(value / 1000).toFixed(1)} km`;
}

function getTravelRecommendation(temperature, condition) {
  const normalizedCondition = String(condition).toLowerCase();
  const isRainy = normalizedCondition.includes("rain") || normalizedCondition.includes("drizzle");
  const isSnowy = normalizedCondition.includes("snow");
  const isClear = normalizedCondition.includes("clear");
  const isCloudy = normalizedCondition.includes("cloud");
  const isStormy = normalizedCondition.includes("thunder") || normalizedCondition.includes("storm");

  if (temperature >= 30) {
    return "☀️ Great weather for sightseeing! Don't forget sunscreen, a hat, and plenty of water.";
  }

  if (isRainy) {
    return "🌧️ Rainy day alert! Pack an umbrella, waterproof shoes, and check out local museums or covered markets.";
  }

  if (isSnowy) {
    return "❄️ Cold-weather plan: wear insulated layers, a warm coat, and choose indoor attractions if conditions worsen.";
  }

  if (isStormy) {
    return "⛈️ Stormy conditions ahead! Keep your outdoor plans flexible and prioritize sheltered attractions.";
  }

  if (temperature <= 10) {
    return "🧣 Cool day: bring a warm jacket, scarf, and layers for a comfortable city walk.";
  }

  if (isClear) {
    return "🌤️ Clear skies are ideal for outdoor exploration. Bring light layers and comfortable walking shoes.";
  }

  if (isCloudy) {
    return "☁️ A comfortable day for mixed plans. Carry a light layer and keep an indoor backup option ready.";
  }

  return "🧳 Check the hourly forecast before heading out and pack a light layer for changing conditions.";
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function renderCurrentWeather(data) {
  const mainCondition = data.weather[0].main;
  const icon = getWeatherIcon(mainCondition);

  elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
  elements.locationLabel.textContent = `Current weather in ${data.name}`;
  elements.conditionIcon.textContent = icon.icon;
  elements.conditionIcon.setAttribute("aria-label", icon.label);
  elements.temperature.textContent = formatTemperature(data.main.temp);
  elements.condition.textContent = data.weather[0].description;
  elements.feelsLike.textContent = formatTemperature(data.main.feels_like);
  elements.humidity.textContent = `${Math.round(data.main.humidity)}%`;
  elements.windSpeed.textContent = formatWind(data.wind.speed);
  elements.visibility.textContent = formatVisibility(data.visibility ?? 0);
  elements.timestamp.textContent = `Updated ${new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function renderForecast(items) {
  elements.forecastList.replaceChildren();

  if (!items.length) {
    elements.forecastList.innerHTML = '<p class="empty-state">No forecast data available.</p>';
    return;
  }

  items.forEach((item) => {
    const card = elements.template.content.cloneNode(true);
    const day = card.querySelector(".forecast-day");
    const icon = card.querySelector(".forecast-icon");
    const temp = card.querySelector(".forecast-temp");
    const condition = card.querySelector(".forecast-condition");
    const conditionData = getWeatherIcon(item.weather[0].main);

    day.textContent = dayFormatter.format(new Date(item.dt * 1000));
    icon.textContent = conditionData.icon;
    temp.textContent = `${formatTemperature(item.main.temp_min)} / ${formatTemperature(item.main.temp_max)}`;
    condition.textContent = conditionData.label;

    elements.forecastList.appendChild(card);
  });
}

function getTravelSummary(conditionLabel, temperature, humidity) {
  const baseAdvice = {
    Sunny: {
      title: "Perfect weather for outdoor plans",
      description: "The day looks bright and pleasant. It is a good time for sightseeing, walks, and open-air activities.",
      tips: [
        "🧢 Pack sunglasses and sunscreen.",
        "💧 Carry a refillable water bottle.",
        "🌤️ Start outdoor activities in the late morning or early afternoon.",
      ],
    },
    Cloudy: {
      title: "Comfortable conditions with flexible plans",
      description: "Cloud cover keeps temperatures more balanced, making it a good time for sightseeing or a relaxed city exploration.",
      tips: [
        "🧥 Bring a light layer for cooler moments.",
        "🧳 Keep a compact umbrella in your bag.",
        "🏙️ Explore indoor attractions and outdoor landmarks during the day.",
      ],
    },
    Rainy: {
      title: "Plan for a cozy, indoor-focused day",
      description: "Rain may make outdoor sightseeing less comfortable, so focus on covered attractions and flexible plans.",
      tips: [
        "☔ Pack a waterproof jacket and shoes.",
        "🏛️ Visit museums, galleries, and covered markets.",
        "🚇 Keep travel time flexible in case of heavy rain.",
      ],
    },
    Snowy: {
      title: "Bundle up and move carefully",
      description: "Cold conditions call for warm layers and a slower pace, especially if you will be walking or traveling outdoors.",
      tips: [
        "🧣 Wear insulated layers and warm gloves.",
        "🥾 Choose waterproof footwear with good traction.",
        "🛶 Consider indoor activities if the weather becomes severe.",
      ],
    },
    Thunderstorm: {
      title: "Prioritize indoor plans",
      description: "Stormy conditions can be unsafe for extended outdoor activities. Keep your itinerary flexible and protected.",
      tips: [
        "⛈️ Avoid exposed viewpoints, beaches, and open roads.",
        "🏨 Choose indoor attractions or a relaxed hotel day.",
        "📱 Check local weather alerts before traveling.",
      ],
    },
    default: {
      title: "Check the conditions before you plan",
      description: "The weather is changing, so keep your itinerary flexible and bring the right layers.",
      tips: [
        "🧥 Bring a light layer for temperature changes.",
        "🌦️ Check the hourly forecast before leaving.",
        "🗺️ Keep one indoor backup option in your plan.",
      ],
    },
  };

  const advice = baseAdvice[conditionLabel] ?? baseAdvice.default;
  let outfit = "Light layers and comfortable shoes";

  if (temperature < 5) outfit = "Thermal layers, a winter coat, gloves, and warm boots";
  else if (temperature < 15) outfit = "A warm jacket, scarf, and closed-toe shoes";
  else if (temperature < 25) outfit = "A breathable top, light jacket, and comfortable walking shoes";
  else outfit = "Light clothing, sunglasses, and breathable footwear";

  if (humidity > 75 && conditionLabel === "Rainy") {
    outfit = "Waterproof outerwear, quick-dry layers, and slip-resistant shoes";
  }

  return {
    title: advice.title,
    description: advice.description,
    suggestions: [...advice.tips, `👕 Best outfit: ${outfit}.`],
  };
}

function renderTravelSuggestions(data) {
  const condition = data.weather[0].main;
  const temperature = data.main.temp;
  const recommendation = getTravelRecommendation(temperature, condition);

  elements.travelSummary.innerHTML = `
    <h3>Travel tip for today</h3>
    <p>${recommendation}</p>
  `;

  elements.travelTips.innerHTML = `
    <li>🧳 Pack for ${temperature >= 25 ? "warm, sunny conditions" : "the current temperature"}.</li>
    <li>🗺️ Choose outdoor attractions when conditions are most comfortable.</li>
    <li>📍 Keep one indoor option available in case the weather changes.</li>
  `;
}

async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error("Unable to connect to the weather service. Please check your internet connection.");
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // The API response is not JSON or does not contain an error body.
    }

    throw new Error(errorMessage === "city not found" ? "City not found. Please enter a valid city name." : errorMessage);
  }

  return response.json();
}

async function loadWeather(city) {
  if (!city.trim()) {
    throw new Error("Please enter a city name.");
  }

  if (WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Add your OpenWeatherMap API key in script.js to load live weather.");
  }

  const weatherUrl = `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
  const forecastUrl = `${WEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;

  const [weatherData, forecastData] = await Promise.all([
    fetchJson(weatherUrl),
    fetchJson(forecastUrl),
  ]);

  const forecastItems = forecastData.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5);

  renderCurrentWeather(weatherData);
  renderForecast(forecastItems);
  renderTravelSuggestions(weatherData);
}

async function handleSearch(event) {
  event.preventDefault();
  const city = elements.input.value.trim();

  setStatus("Loading weather…", "success");
  elements.form.querySelector("button").disabled = true;

  try {
    await loadWeather(city);
    setStatus(`Showing weather for ${city}.`, "success");
  } catch (error) {
    setStatus(error.message || "Unable to load weather. Please try again.", "error");
    elements.cityName.textContent = "Weather unavailable";
    elements.locationLabel.textContent = "Try another city";
    elements.temperature.textContent = "--°C";
    elements.condition.textContent = "No forecast available";
    elements.conditionIcon.textContent = "⚠️";
    elements.forecastList.innerHTML = '<p class="empty-state">Please check the city name or try again later.</p>';
    elements.travelSummary.innerHTML = "<p>Travel tips are unavailable for this location.</p>";
    elements.travelTips.innerHTML = "<li>🌦️ Check your network connection.</li>";
  } finally {
    elements.form.querySelector("button").disabled = false;
    elements.input.focus();
  }
}

elements.form.addEventListener("submit", handleSearch);
elements.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    elements.form.requestSubmit();
  }
});

if (WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
  setStatus("Add your OpenWeatherMap API key in script.js to enable live weather.", "error");
}
