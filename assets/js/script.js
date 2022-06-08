// Define variables
let body = document.body;
let inputForm = document.getElementById('search-form');
let inputBox = document.getElementById('input-box');
let submitButton = document.getElementById('submit-button');
let recentSearches = document.getElementById('recent-searches');
let currentWeather = document.getElementById('current-weather');
let fiveDayForecast = document.getElementById('five-day-forecast');
let rawCityList = [];
let easyCityList = [];
let apiKey = '3a8edcb6a734dc2c076a743098ed3084';
let searchQuery;
let weatherData;
let cityObj;
let iconData;
let lat;
let long;
let newSearch = true;
let today = new Date();
today = today.toLocaleDateString();

// Pull City List
fetch('https://raw.githubusercontent.com/MMMPhoto/Weather-App/main/assets/js/city.list.json')
    .then(response => {
        return response.json();
    })
    .then(jsondata => {
        rawCityList = jsondata;
        console.log(rawCityList);

        // Refine City List
        for (i = 0; i < rawCityList.length; i++) {
            if (rawCityList[i].state === "") {
                easyCityList.push(`${rawCityList[i].name}, ${rawCityList[i].country}`);
            } else {
                easyCityList.push(`${rawCityList[i].name}, ${rawCityList[i].state}, ${rawCityList[i].country}`);
            };            
        };
    });
console.log(easyCityList);

// Create button for recent search
let createRecentButton = (button) => {
    button = document.createElement('button');
    button.setAttribute('id', `${cityTag}`);
    button.setAttribute('class', 'city-button');
    button.textContent = cityName;
    recentSearches.append(button);
};

// Add item to local storage
let saveLocalStorage = (cityObj) => {
    cityObj = {buttonName: `${cityName}`, tagName: `${cityTag}`};
    recentCities.push(cityObj);
    localStorage.setItem("recentSearches", JSON.stringify(recentCities));
};

// Pull recent searches from local storage
let recentCities = JSON.parse(localStorage.getItem("recentSearches"));
// Create if recentSearches is null
if (recentCities === null) {
    recentCities = [];
} else {
    for(i = 0; i < recentCities.length; i++) {
        cityName = recentCities[i].buttonName;
        cityTag = recentCities[i].tagName;
        createRecentButton();
    };
};
console.log(`Recent cities: ${recentCities}`);

// JQuery UI autocompete for input box
$(inputBox).autocomplete( {
    appendTo: inputForm,
    minLength: 3,
    source: easyCityList
});

// API call to get weather data
let weatherFetch = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&APPID=${apiKey}`)
    .then(response => {
        console.log(`fetch status: code ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log(data);
        weatherData = data;
        weatherDisplay(weatherData);
    });
};

// Display weather data
let weatherDisplay = (weatherData) => {
    inputBox.value = "";
    currentWeather.classList.add('current-weather-border');
    currentWeather.innerHTML = `<h2>${cityName} (${today}) <img class='border border-dark' src=http://openweathermap.org/img/w/${weatherData.current.weather[0].icon}.png /></h2><p>Temp: ${Math.round(weatherData.current.temp)}°F</p><p>Wind speed: ${Math.round(weatherData.current.wind_speed)} mph</p><p>Humidity: ${weatherData.current.humidity}%</p><p>UV Index: <span id='uv-color'>${Math.round(weatherData.current.uvi)}</span></p>`;
    setUVColor(weatherData);
    fiveDayForecast.innerHTML = `<h3>5 Day Forecast:</h3>`;
    for (i = 1; i < 6; i++) {
        let dailyForecast = document.createElement('li');
        fiveDayForecast.appendChild(dailyForecast);
        let relativeDate = new Date();
        relativeDate.setDate(relativeDate.getDate() + i);
        relativeDate = relativeDate.toLocaleDateString();
        fiveDayForecast.lastChild.innerHTML = `<h4>${relativeDate} <img class='border border-dark' src=http://openweathermap.org/img/w/${weatherData.daily[i].weather[0].icon}.png /></h4><p>Temp: ${Math.round(weatherData.daily[i].temp.max)}°F</p><p>Wind speed: ${Math.round(weatherData.daily[i].wind_speed)} mph</p><p>Humidity: ${weatherData.daily[i].humidity}%</p>`;
        dailyForecast.setAttribute('class', 'daily-forecast rounded m-2 p-2');
    };
    if (newSearch) {
        createRecentButton();
    };
};

// UV Index color coding
let setUVColor = (weatherData) => {
    let uvColorBox = document.getElementById('uv-color');
    uvColorBox.setAttribute('class', 'border p-2 rounded');
    if (Math.round(weatherData.current.uvi) <= 2) {
        uvColorBox.style.backgroundColor = '#008000';
    } else if (Math.round(weatherData.current.uvi) <= 5) {
        uvColorBox.style.backgroundColor = '#FFFF00';
    } else if (Math.round(weatherData.current.uvi) <= 7) {
        uvColorBox.style.backgroundColor = '#FFA500';
    } else if (Math.round(weatherData.current.uvi) <= 10) {
        uvColorBox.style.backgroundColor = '#FF0000';
    } else {
        uvColorBox.style.backgroundColor = '#800080';
    };
};

// Listen for search query
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    newSearch = true;
    searchQuery = inputBox.value;
    if (easyCityList.includes(searchQuery)) {
        let index = easyCityList.indexOf(searchQuery);
        lat = rawCityList[index].coord.lat;
        lon = rawCityList[index].coord.lon;
        cityName = rawCityList[index].name;
        cityTag = inputBox.value;
        weatherFetch(lat, lon);
        saveLocalStorage(cityObj);
    } else {
        alert('please select a city from the dropdown list');
    }
});

// Listen for recent searches button click
recentSearches.addEventListener("click", (event) => {
    event.preventDefault();
    newSearch = false;
    let recallSearch = event.target.id;
    let index = easyCityList.indexOf(recallSearch);
    lat = rawCityList[index].coord.lat;
    lon = rawCityList[index].coord.lon;
    cityName = rawCityList[index].name;
    weatherFetch(lat, lon);
});