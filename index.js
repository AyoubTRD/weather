const apiKey = 'ea23d6bb95c6f4ef065df8a1012df7b1';
const baseURL = '//api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

// ABDESSADEK TASK: IMPLEMENT THIS FUNCTION
// fecth and display the data for the given city

// This function is called whenever a user clicks a link, takes the name of the city corresponding to the link as an argument
async function handleLinkClick(cityName) {
    // Here you go
    //console.log(cityName)
    // Note: use await when calling the get weather function, this function returns the data;
    setLoading(true)
    const weather = await getWeather({cityName});
    render({weather})
    setLoading(false)
    
    
    
}


class Weather {
    constructor(json) {
        const {
            main: {temp, pressure, humidity}, 
            weather: [{main, description, icon}], 
            name: cityName, wind: {speed: windSpeed},
            clouds: {all: clouds},
            timezone, 
        } = JSON.parse(json);

        this.description = description;
        this.main = main;
        this.temp = temp;
        this.cityName = cityName;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.icon = icon;
        this.clouds = clouds;
        this.timezone = timezone;
    }
}
// Takes an object as an argument, returns Promise<Weather>
async function getWeather({cityName, latitude, longitude}) {
    let response;
    if (cityName) {
        // Fetch city weather
        response = await fetch(`${baseURL}&q=${cityName}`);        
    } else {
        // Fetch weather using coordinates
        response = await fetch(`${baseURL}&lat=${latitude}&lon=${longitude}`);
    }
    if (!response.ok) return;
    // Create Weather object
    const weather = new Weather(await response.text());
    // Return weather
    return weather;
}
// Formats the date to a string like: 23:20-Monday, 29 Aug '21
function formatDate(date) {
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];

    return `${hours}:${minutes}-${day}, ${date.getDate()} ${month} '${date.getFullYear() - 2000}`
}

const $temp = document.getElementById('temp');
const $description = document.getElementById('description');
const $humidity = document.getElementById('humidity');
const $wind = document.getElementById('wind');
const $clouds = document.getElementById('clouds');
const $cityName = document.getElementById('cityName');
const $time = document.getElementById('time');
const $icon = document.getElementById('icon');
const $loading = document.querySelector('.loading');
const $search = document.getElementById('search');
const $searchBtn = document.getElementById('search-btn');
const $cityLinks = [...document.querySelectorAll('.city-link')];

$cityLinks.forEach($link => {
    $link.onclick = () => handleLinkClick($link.getAttribute('data-city'));
})

$searchBtn.onclick = () => setSearching(true);

$search.onsubmit = async event => {
    event.preventDefault();
    const cityName = event.target.querySelector('input').value;
    setSearching(false);
    setLoading(true);
    try {
        const weather = await getWeather({cityName});
        render({weather});
    } catch(e) {}
    setLoading(false);
}

// Takes the Weather data, renders it on the screen
function render({ weather }) {
    let now = new Date();
    now = new Date(now.getTime() + weather.timezone * 1000);
    $temp.textContent = Math.round(weather.temp) + '°';
    $description.textContent = weather.description;
    $humidity.textContent = weather.humidity + '%';
    $wind.textContent = weather.windSpeed + 'm/s';
    $clouds.textContent = weather.clouds + '%';
    $cityName.textContent = weather.cityName;
    $time.textContent = formatDate(now);
    $icon.setAttribute('src', `//openweathermap.org/img/wn/${weather.icon}@2x.png`);
}

// show or hide the searching modal, true -> show, false -> hide
function setSearching(isSearching) {
    $search.style.display = isSearching ? 'flex' : 'none';
}

// show or hide the loading modal, true -> show, false -> hide
function setLoading(isLoading) {
    $loading.style.display = isLoading ? 'flex' : 'none';
}

// initializes the website
async function main() {
    setLoading(true);
    const location = {};
    navigator.geolocation.getCurrentPosition(async position => {
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;
        const weather = await getWeather(location);
        render({weather});
        setLoading(false);
    }, async () => {
        location.cityName = 'London';
        const weather = await getWeather(location);
        render({weather});
        setLoading(false);
    });

}

main();



