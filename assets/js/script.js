let body = document.body;
let inputForm = document.createElement('form');
let inputBox = document.createElement('input');
let submitButton = document.createElement('button');
let rawCityList = [];
let easyCityList = [];
let city = {};
let apiKey = '3a8edcb6a734dc2c076a743098ed3084';
let searchQuery;
let weatherData;
let lat;
let long;



// let jsondata = require('./assets/js/city.list.json');
// console.log(jsondata);


// Pull City List
fetch('./assets/js/city.list.json')
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

inputBox.setAttribute('type', 'text');
submitButton.innerHTML = 'Submit';

body.append(inputForm);
inputForm.append(inputBox);
inputForm.append(submitButton);

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
    let weatherContainer = document.createElement('div');
    weatherContainer.innerHTML = `${cityName}<br>Temp: ${weatherData.current.temp}<br>Wind speed: ${weatherData.current.wind_speed}<br>Humidity: ${weatherData.current.humidity}%<br>UV Index: ${weatherData.current.uvi}`;
    body.append(weatherContainer);
}

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    searchQuery = inputBox.value;
    let index = easyCityList.indexOf(searchQuery);
    lat = rawCityList[index].coord.lat;
    lon = rawCityList[index].coord.lon;
    cityName = rawCityList[index].name;
    weatherFetch(lat, lon);
});