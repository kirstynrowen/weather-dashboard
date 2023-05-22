//store weather API key in variable
const apiKey = 'da661090c07b3801270d73c03cca3668';
//store day.js if needed?
const today = dayjs().format('dddd, DD-MM-YYYY');
//target DOM elements
const searchBtn = document.getElementById('searchBtn');
const searchHistoryEl = document.getElementById('history');
const forecastEl = document.getElementById('forecast');
const currentEl = document.getElementById('current');

const searchHistArr = [];

function fetchWeather(searchValue) {
    const [cityInput, stateInput] = searchValue.split(',');
    // const cityInput = document.getElementById('city-input').value;
    // const stateInput = document.getElementById('state-input').value;
    const newSearch = cityInput + ', ' + stateInput;
    searchHistArr.push(newSearch);
    localStorage.setItem('search-history', JSON.stringify(searchHistArr));
    
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
        currentEl.innerHTML = '';

       let todayEl = document.createElement('div');
       todayEl.classList.add('col');
       currentEl.append(todayEl);

       let cardDivEl = document.createElement('div');
       cardDivEl.classList.add('card');
       cardDivEl.style.width = '14rem';
       todayEl.append(cardDivEl);

       let cardBodyEl = document.createElement('div');
       cardBodyEl.classList.add('card-body');
       cardDivEl.append(cardBodyEl);
       
       let dateHeader = document.createElement('h5');
       dateHeader.classList.add('card-title');
       dateHeader.textContent = dayjs.unix(data.dt).format('dddd, DD-MM-YYYY');
       cardBodyEl.append(dateHeader);

       let cityHeader = document.createElement('p');
       dateHeader.classList.add('card-text');
       dateHeader.textContent = `Today's weather in ${data.name}:`;
       cardBodyEl.append(cityHeader);
       
       let weatherInfo = document.createElement('ul');
       weatherInfo.classList.add('list-group', 'list-group-flush');
       cardDivEl.append(weatherInfo);

       let tempEl = document.createElement('li');
       tempEl.classList.add('list-group-item');
       tempEl.textContent = `Temperature: ${data.main.temp.toFixed(0)} °F`;
       weatherInfo.append(tempEl);

       let humidityEl = document.createElement('li');
       humidityEl.classList.add('list-group-item');
       humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
       weatherInfo.append(humidityEl);

       let windEl = document.createElement('li');
       windEl.classList.add('list-group-item');
       windEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;
       weatherInfo.append(windEl);

       fetch(
        'https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + ',' + stateInput + ',US' + '&appid=' + apiKey + '&units=imperial'
    )
    .then((res) => res.json())
    .then((data) => {
       //display forecast
        forecastEl.innerHTML = '';
        for (let i = 0; i < data.list.length; i+=8) {
            const forecastDay = data.list[i];

            let todayEl = document.createElement('div');
            todayEl.classList.add('col');
            forecastEl.append(todayEl);
     
            let cardDivEl = document.createElement('div');
            cardDivEl.classList.add('card');
            cardDivEl.style.width = '14rem';
            todayEl.append(cardDivEl);

            let cardBodyEl = document.createElement('div');
            cardBodyEl.classList.add('card-body');
            cardDivEl.append(cardBodyEl);
            
            let iconEl = document.createElement("img");
            iconEl.setAttribute(
              'src',
              'http://openweathermap.org/img/w/'+ forecastDay.weather[0].icon + '.png'
            );
            iconEl.setAttribute(
                'style',
                'width: 50px; max-width:100%;'+ forecastDay.weather[0].icon + '.png'
              );
            iconEl.classList.add('card-img-top');
            cardBodyEl.append(iconEl);
     
            let dateHeader = document.createElement('p');
            dateHeader.classList.add('card-text');
            dateHeader.textContent = dayjs.unix(forecastDay.dt).format('dddd, MM-DD-YYYY');
            cardBodyEl.append(dateHeader);

            let weatherInfo = document.createElement('ul');
            weatherInfo.classList.add('list-group', 'list-group-flush');
            cardDivEl.append(weatherInfo);
     
            let tempEl = document.createElement('li');
            tempEl.classList.add('list-group-item');
            tempEl.textContent = `Temperature: ${forecastDay.main.temp.toFixed(0)} °F`;
            weatherInfo.append(tempEl);
     
            let humidityEl = document.createElement('li');
            humidityEl.classList.add('list-group-item');
            humidityEl.textContent = `Humidity: ${forecastDay.main.humidity}%`;
            weatherInfo.append(humidityEl);
     
            let windEl = document.createElement('li');
            windEl.classList.add('list-group-item');
            windEl.textContent = `Wind Speed: ${forecastDay.wind.speed} MPH`;
            weatherInfo.append(windEl);
            
        };

    });  

    });   
};

//function to render search history to page
function displaySearchHistory() {
    // Clear element contents
    searchHistoryEl.innerHTML = '';
    // Retrieve the search history from local storage
    const savedSearches = JSON.parse(localStorage.getItem('search-history'));
    for (let i = 0; i < savedSearches.length; i++) {
        const prevSearchBtn = document.createElement('button');
        prevSearchBtn.setAttribute('type', 'button');
        prevSearchBtn.classList.add('btn', 'btn-prev');
        prevSearchBtn.textContent = savedSearches[i];
        prevSearchBtn.setAttribute('search', savedSearches[i]);
        
        prevSearchBtn.addEventListener('click', function () {
            const searchValue = this.getAttribute('search');
            fetchWeather(searchValue);
          });
        
        searchHistoryEl.append(prevSearchBtn);
    }
}

displaySearchHistory();

searchBtn.addEventListener('click', function () {
    const cityInput = document.getElementById('city-input').value;
    const stateInput = document.getElementById('state-input').value;
    const searchValue = cityInput + ', ' + stateInput;
    fetchWeather(searchValue);
  });
