let body = document.body;
let inputForm = document.createElement('form');
let inputBox = document.createElement('input');
let submitButton = document.createElement('button');
let testArray = ['Atlanta', 'Atlantis', 'Atalanta'];
let rawCityList = [];
let easyCityList = [];
let city = {};

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
                easyCityList.push(`${rawCityList[i].name},${rawCityList[i].country}`);
            } else {
                easyCityList.push(`${rawCityList[i].name},${rawCityList[i].state},${rawCityList[i].country}`);
            };            
        };
    });

console.log(easyCityList);

inputBox.setAttribute('type', 'text');
submitButton.innerHTML = 'Submit';

body.append(inputForm);
inputForm.append(inputBox);
inputForm.append(submitButton);

let apiKey = '3a8edcb6a734dc2c076a743098ed3084';
let searchQuery = 'Columbus,GA,USA';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&APPID=${apiKey}`)
    .then(response => {
        console.log(`fetch status: code ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log(data);
    });

$(inputBox).autocomplete( {
    appendTo: inputForm,
    minLength: 3,
    source: easyCityList
});