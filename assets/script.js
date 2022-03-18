var apiKey = '33fa189239b5aacb798afb7fe2ab44a8'

var submitButton = document.querySelector('#submitBtn');
var displayEl = document.getElementById('display');
var forecastEl = document.getElementById('forecast');
var historyEl = document.getElementById('history');

//empty array on default
var cityList = [];

var localC = JSON.parse(localStorage.getItem("cities"))
if (localC != null) {
    cityList = localC;
    for (var i = 0; i < cityList.length; i++) {
        createHistory(cityList[i]);
    }
}

submitButton.addEventListener('click', function () {
    var cityName = document.querySelector('input').value;
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey + '&units=imperial';
    fetchAPI(requestURL);
})


//adds button that displays the current weather in the city
function createHistory(cityName) {
    var cityElement = document.createElement('button');
    cityElement.addEventListener('click', function () {
        var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey + '&units=imperial';
        fetchAPI(requestURL);
    })
    cityElement.textContent = cityName;
    historyEl.append(cityElement);
}



function fetchAPI(requestURL) {
    fetch(requestURL)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {

            displayEl.innerHTML = "";
            forecastEl.innerHTML = "";
            //city name
            var titleDisplay = document.createElement('h1');
            localStorage.setItem('cities', data.name);
            cityList.push(data.name);
            createHistory(data.name);
            localStorage.setItem('cities', JSON.stringify(cityList));
            titleDisplay.textContent = data.name + " (" + moment.unix(data.dt).format("MM/DD/YYYY") + ")";

            //img
            var iconDisplay = document.createElement('img');
            iconDisplay.src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            titleDisplay.append(iconDisplay);
            displayEl.appendChild(titleDisplay);

            //temp
            var tempDisplay = document.createElement('h3');
            tempDisplay.textContent = "Temp: " + data.main.temp + " °F";
            displayEl.appendChild(tempDisplay);


            //wind
            var windDisplay = document.createElement('h3');
            windDisplay.textContent = "Wind: " + data.wind.speed + " MPH";
            displayEl.appendChild(windDisplay);

            //humidity
            var humidityDisplay = document.createElement('h3');
            humidityDisplay.textContent = "Humidity: " + data.main.humidity + " %";
            displayEl.appendChild(humidityDisplay);

            var uvDisplay = document.createElement('h3');
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var newURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
            fetch(newURL)
                .then(function (response) {
                    let dataSet = response.json();
                    return dataSet;
                })
                .then(function (dataSet) {
                    console.log(dataSet);
                    uvDisplay.textContent = "UV Index: " + dataSet.current.uvi;

                    //uv
                    if (dataSet.current.uvi < 2) {
                        uvDisplay.classList.add('belowTwo');
                    }
                    else if (dataSet.current.uvi < 5) {
                        uvDisplay.classList.add('belowFive');
                    }
                    else if (dataSet.current.uvi < 7) {
                        uvDisplay.classList.add('belowSeven');
                    }
                    else if (dataSet.current.uvi < 10) {
                        uvDisplay.classList.add('belowTen');
                    }
                    else {
                        uvDisplay.classList.add('eleven');
                    }

                    displayEl.appendChild(uvDisplay);

                    //forecast
                    for (var i = 0; i < 5; i++) {
                        var card = document.createElement('section');
                        card.addclass

                        var dateDisplayCard = document.createElement('p');
                        console.log(dataSet.daily[i].dt);
                        dateDisplayCard.textContent = moment.unix(dataSet.daily[i].dt).format("MM/DD/YYYY");
                        card.append(dateDisplayCard);

                        var iconDisplayCard = document.createElement('img');
                        console.log(dataSet.daily[i].weather[0].icon);
                        iconDisplayCard.src = "http://openweathermap.org/img/w/" + dataSet.daily[i].weather[0].icon + ".png";
                        card.append(iconDisplayCard);

                        var tempDisplayCard = document.createElement('p');
                        console.log(dataSet.daily[i].temp.day);
                        tempDisplayCard.textContent = 'Temp: ' + dataSet.daily[i].temp.day + " °F";
                        card.append(tempDisplayCard);

                        var windDisplayCard = document.createElement('p');
                        console.log(dataSet.daily[i].wind_speed);
                        windDisplayCard.textContent = 'Wind: ' + dataSet.daily[i].wind_speed + " MPH";
                        card.append(windDisplayCard);

                        var humidityDisplayCard = document.createElement('p');
                        console.log(dataSet.daily[i].humidity);
                        humidityDisplayCard.textContent = 'Humidity: ' + dataSet.daily[i].humidity + " %";
                        card.append(humidityDisplayCard);

                        forecastEl.append(card);
                    }


                })

        })
        .catch(function (err) {
            console.log(err);
        });
}