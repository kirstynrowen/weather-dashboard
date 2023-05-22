// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

//store weather API key in variable
const apiKey = 'da661090c07b3801270d73c03cca3668';
//store day.js if needed?
const today = dayjs().format("dddd, YYYY-MM-DD");
//target DOM elements
const searchBtn = document.getElementById('searchBtn');
const searchHistoryEl = document.getElementById('history');
const forecastEl = document.getElementById('forecast');
const currentEl = document.getElementById('current');

const searchHistArr = [];

//function to render search history to page
function displaySearchHistory() {
    // Clear element contents
    searchHistoryEl.innerHTML = '';
    // Retrieve the search history from local storage
    const savedSearches = JSON.parse(localStorage.getItem('search-history')) || [];
    for (let i = 0; i < savedSearches.length; i++) {
        const prevSearchBtn = document.createElement('button');
        prevSearchBtn.setAttribute('type', 'button');
        prevSearchBtn.classList.add('btn');
        prevSearchBtn.textContent = savedSearches[i];
        searchHistoryEl.append(prevSearchBtn);
    }
}

searchBtn.addEventListener('click', function(){
    const cityInput = document.getElementById('city-input').value;
    const stateInput = document.getElementById('state-input').value;
    const newSearch = cityInput + ', ' + stateInput;
    console.log(newSearch);
    searchHistArr.push(newSearch);
    localStorage.setItem('search-history', JSON.stringify(searchHistArr));
    
    displaySearchHistory();
    
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + ',' + stateInput + ',US' + '&appid=' + apiKey + '&units=imperial'
    )
    .then((res) => res.json())
    .then((data) => {
        if (data.cod === '404') {
            document.getElementById('error').textContent = 'Error: City not found. Please try again.';
            return;
        }
       //display current weather
       let todayEl = document.createElement('div');
       todayEl.classList.add('col');
       currentEl.append(todayEl);

       let cardDivEl = document.createElement('div');
       cardDivEl.classList.add('card');
       cardDivEl.style.width = '14rem';
       todayEl.append(cardDivEl);
       
       let dateHeader = document.createElement('h5');
       dateHeader.classList.add('card-title');
       dateHeader.textContent = today;
       cardDivEl.append(dateHeader);
       
       let weatherInfo = document.createElement('ul');
       weatherInfo.classList.add('list-group', 'list-group-flush');
       cardDivEl.append(weatherInfo);

       let tempEl = document.createElement('li');
       tempEl.classList.add('list-group-item');
       tempEl.textContent = `Temperature: ${data.main.temp} °F`;
       weatherInfo.append(tempEl);

       let humidityEl = document.createElement('li');
       humidityEl.classList.add('list-group-item');
       humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
       weatherInfo.append(humidityEl);

       let windEl = document.createElement('li');
       windEl.classList.add('list-group-item');
       windEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;

       //fetch forecast
    })   

})

