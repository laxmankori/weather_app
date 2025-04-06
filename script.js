// Element selectors
const tempValues = document.querySelectorAll(".temp_value");
const humidityElements = document.querySelectorAll(".humaditys");
const windSpeeds = document.querySelectorAll(".wind_speed");
const weatherValues = document.querySelectorAll(".weather");
const cityName = document.querySelector("#city");
const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const input = document.querySelector("input");
const button = document.querySelector("button");
const greet = document.querySelector("#greet");
const forecastContainer = document.querySelector(".forcast_boxs");

// Loading animation 
const loader = document.querySelector("#loader");

function showLoader() {
  loader.classList.remove("d-none");
}

function hideLoader() {
  loader.classList.add("d-none");
}


// Date & Time
const today = new Date();
const dateString = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Update time every second
setInterval(() => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  timeElement.textContent = timeString;
}, 1000);

// Greeting message
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
greet.textContent = getGreeting();

// Default city and input handler
let city = "jabalpur";
button.addEventListener("click", () => {
  const userInput = input.value.trim();
  if (!userInput) return;
  city = userInput;
  getWeatherData(city);
  getForecast(city);
  input.value = "";
});

// Fetch current weather
async function getWeatherData(city) {
  try {
    showLoader();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=55e8578480926510e42839878ea2b22e&units=metric`);
    const data = await res.json();

    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const weatherDesc = data.weather[0].description;

    tempValues.forEach(t => t.textContent = `${Math.floor(temp)}°`);
    humidityElements.forEach(h => h.textContent = `${humidity}%`);
    windSpeeds.forEach(ws => ws.textContent = `${wind}m/s`);
    weatherValues.forEach(w => w.textContent = weatherDesc);

    cityName.textContent = city;
    dateElement.textContent = dateString;

  } catch (error) {
    alert(`Error fetching weather data: "${city}" is not a city please enter currect city name`);
  } finally {
    hideLoader();
  }
}

// Convert 24-hour to 12-hour time
function convertTo12Hour(time24) {
  let [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

// Fetch weather forecast
async function getForecast(city) {
  try {
    showLoader();

    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=55e8578480926510e42839878ea2b22e&units=metric`);
    const data = await res.json();

    forecastContainer.innerHTML = "";

    data.list.slice(0, 6).forEach(item => {
      const [_, timeStr] = item.dt_txt.split(" ");
      const time12hr = convertTo12Hour(timeStr);
      const temp = Math.floor(item.main.temp);
      const desc = item.weather[0].description;

      forecastContainer.innerHTML += `
        <div class="forcast_box border border-dark rounded-4 p-3 col-lg-4">
          <h3 class="fs-6">${time12hr}</h3>
          <h1 class="fs-3">${temp}°</h1>
          <h1 class="fs-6 opacity-75">${desc}</h1>
        </div>`;
    });

  } catch (error) {
    alert(`Error fetching weather data: "${city}" is not a city please enter currect city name`);
  } finally {
    hideLoader();
  }
}

// Initial data load
getWeatherData(city);
getForecast(city);
