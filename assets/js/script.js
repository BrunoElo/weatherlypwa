let signature = document.querySelector(".love");

let region = document.createElement("h2");
region.className = "location";
signature.insertAdjacentElement("beforebegin", region);

let receivingTime = document.createElement("p");
receivingTime.className = "date";
signature.insertAdjacentElement("beforebegin", receivingTime);

let weatherWrapper = document.createElement("div");
weatherWrapper.className = "weather";
weatherWrapper.innerHTML =
  '<div class="weather__details"><img class="weather__icon" src="">            <p class="weather__description"></p>        </div><div class="current-temperature">            <p></p>        </div>    </div> ';
signature.insertAdjacentElement("beforebegin", weatherWrapper);

let sunTimes = document.createElement("div");
sunTimes.className = "sun-times";
sunTimes.innerHTML =
  '<div class="sunrise">            <p class="text-bold">Sunrise</p>            <p class="sunrise__time"></p>        </div>        <div class="sunset">            <p class="text-bold">Sunset</p>            <p class="sunset__time"></p>        </div>';
signature.insertAdjacentElement("beforebegin", sunTimes);

let weatherElements = document.createElement("div");
weatherElements.className = "weather__elements";
weatherElements.innerHTML =
  '<div class="cloudiness">            <p>Cloudiness</p>            <p class="cloudiness__value"></p>            <p>%</p>        </div>        <div class="humidity">            <p>Humidity</p>            <p class="humidity__value"></p>            <p>%</p>        </div>        <div class="pressure">            <p>Pressure</p>            <p class="pressure__value"></p>            <p>kPa</p>        </div>        <div class="wind">            <p>Wind</p>            <p class="wind__value"></p>            <p>km/h</p>        </div>';
signature.insertAdjacentElement("beforebegin", weatherElements);

let searchField = document.querySelector(".search");
let searchBtn = document.querySelector(".search-icon");
//let region = document.querySelector('.location');
//let receivingTime = document.querySelector('.date');
let weatherIcon = document.querySelector(".weather__icon");
let weatherDescription = document.querySelector(".weather__description");
let currentTemp = document.querySelector(".current-temperature p");
let sunrise = document.querySelector(".sunrise__time");
let sunset = document.querySelector(".sunset__time");
let cloudValue = document.querySelector(".cloudiness__value");
let humidityValue = document.querySelector(".humidity__value");
let pressureValue = document.querySelector(".pressure__value");
let windValue = document.querySelector(".wind__value");

let jsonWeatherData;
let weatherData = JSON.parse(localStorage.getItem("weatherData"));

if (weatherData != null) {
  region.innerHTML = weatherData.name;
  receivingTime.innerHTML = new Date(weatherData.dt * 1000).toLocaleString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // weather icon
  let iconcode = weatherData.weather[0].icon;
  let iconurl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;
  weatherIcon.setAttribute("src", iconurl);

  weatherDescription.innerHTML = weatherData.weather[0].description;
  currentTemp.innerHTML =
    (weatherData.main.temp - 273.15).toPrecision(2) + "°C";

  sunrise.innerHTML = new Date(
    weatherData.sys.sunrise * 1000
  ).toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
  sunset.innerHTML = new Date(
    weatherData.sys.sunset * 1000
  ).toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
  cloudValue.innerHTML = weatherData.clouds.all;
  humidityValue.innerHTML = weatherData.main.humidity;
  pressureValue.innerHTML = weatherData.main.pressure / 10;
  windValue.innerHTML = weatherData.wind.speed;
}

// Function for API request
let weatherReq = () => {
  searchValue = document.querySelector(".search").value;
  //console.log(searchValue);
  // Api request
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&APPID=${process.env.API_KEY}`
  )
    .then((resp) => {
      return resp.json(); // converts json to object
    })
    .then((data) => {
      /* weatherArr.push(data);
        console.log(weatherArr); */
      localStorage.setItem("weatherData", JSON.stringify(data));
      jsonWeatherData = localStorage.getItem("weatherData");
      region.innerHTML = data.name; // location
      receivingTime.innerHTML = new Date(data.dt * 1000).toLocaleString(
        "en-US",
        { weekday: "long", month: "long", day: "numeric", year: "numeric" }
      );

      // weather icon
      let iconcode = data.weather[0].icon;
      let iconurl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;
      weatherIcon.setAttribute("src", iconurl);

      weatherDescription.innerHTML = data.weather[0].description;
      currentTemp.innerHTML = (data.main.temp - 273.15).toPrecision(2) + "°C";

      sunrise.innerHTML = new Date(
        data.sys.sunrise * 1000
      ).toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
      sunset.innerHTML = new Date(
        data.sys.sunset * 1000
      ).toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
      cloudValue.innerHTML = data.clouds.all;
      humidityValue.innerHTML = data.main.humidity;
      pressureValue.innerHTML = data.main.pressure / 10;
      windValue.innerHTML = data.wind.speed;
    })
    .catch(() => {});
};

searchBtn.addEventListener("click", weatherReq);
searchField.addEventListener("keyup", (event) => {
  // listen for the enter keypress
  if (event.keyCode === 13) {
    weatherReq();
  }
});

/* function initweather() {
searchValue = 'London'
    weatherReq();
} */

// Check and register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((reg) => {} /* console.log("service worker registered", reg) */)
    .catch((err) => {} /* console.log("service worker not registered", err) */);
}
