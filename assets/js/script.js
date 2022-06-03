let body = document.body;
let inputForm = document.createElement('form');
let inputBox = document.createElement('input');
let submitButton = document.createElement('button');
let testArray = ['Atlanta', 'Atlantis', 'Atalanta'];

fetch('./assets/js/current.city.list.json')
    .then(response => {
        return response.json();
    })
    .then(jsondata => console.log(jsondata));

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
    minLength: 2,
    source: testArray
});