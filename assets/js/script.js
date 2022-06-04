// Define variables
let body = document.body;
let inputForm = document.getElementById('search-form');
let inputBox = document.getElementById('input-box');
let submitButton = document.getElementById('submit-button');
let rawCityList = [];
let easyCityList = [];
let apiKey = '3a8edcb6a734dc2c076a743098ed3084';
let searchQuery;
let weatherData;
let lat;
let long;
let newSearch = true;

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

// Build elements
let recentSearches = document.getElementById('recent-searches');
let currentWeather = document.getElementById('current-weather');
let fiveDayForcast = document.getElementById('five-day-forecast');

$(inputBox).autocomplete( {
    appendTo: inputForm,
    minLength: 3,
    source: easyCityList
});

let weatherFetch = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&APPID=${apiKey}`)
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

let weatherDisplay = (weatherData) => {
    currentWeather.innerHTML = `${cityName}<br>Temp: ${weatherData.current.temp}<br>Wind speed: ${weatherData.current.wind_speed}<br>Humidity: ${weatherData.current.humidity}%<br>UV Index: ${weatherData.current.uvi}`;
    if (newSearch) {
        createRecentButton();
    }
};

let createRecentButton = (button) => {
    button = document.createElement('button');
    button.setAttribute('id', `${cityTag}`);
    button.setAttribute('class', 'city-button');
    button.textContent = cityName;
    recentSearches.append(button);
};

// Listen for search query
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    newSearch = true;
    searchQuery = inputBox.value;
    let index = easyCityList.indexOf(searchQuery);
    lat = rawCityList[index].coord.lat;
    lon = rawCityList[index].coord.lon;
    cityName = rawCityList[index].name;
    cityTag = inputBox.value;
    weatherFetch(lat, lon);
});

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

