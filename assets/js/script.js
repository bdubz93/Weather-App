let timeEl = document.getElementById("time");
let dateEl = document.getElementById("date");
let currentWeatherItemsEl = document.getElementById("current-weather-items");
let timezone = document.getElementById("time-zone");
let countryEl = document.getElementById("country");
let weatherForecastEl = document.getElementById("weather-forecast");
let currentTempEl = document.getElementById("current-temp");
let searchEl = document.getElementById("searchCity");
var currentCityName;
var searchFormEl = document.querySelector('#search-city');
var resultTextEl = document.querySelector('#currentCityName');
var cityList = [];
let celc = `&nbsp&#176;C`
let space = `&nbsp`

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


let API_KEY = "928833520683a8d6e55eaf1f2e8c61f4"

setInterval(() => {
  let time = new Date();
  let month = time.getMonth();
  let date = time.getDate();
  let day = time.getDay();
  let hour = time.getHours();
  let hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  let minutes = time.getMinutes();
  let ampm = hour >= 12 ? 'PM' : 'AM';

  timeEl.innerHTML = hoursIn12HrFormat + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + months[month] + " " + date;
}, 1000);


function getWeatherData(varLat, varLon, currentCityName, varName) {
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=` + varLat + `&lon=` + varLon + `&exclude=hourly&units=metric&appid=${API_KEY}`;
  fetch(locQueryUrl)
    .then(function (response) {
      console.log(response)
      if (!response.ok) {
        throw response.json();
      }
      console.log(response.json)
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      updateCityList(currentCityName);
      showWeatherData(data);

    })


}

function showWeatherData(data) {
  let { clouds, humidity, temp, sunrise, sunset, wind_speed, feels_like, weather, dt } = data.current;
  timezone.innerHTML = varName;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E"
  let uvi = data.daily[0].uvi;
  let dtDate = moment.unix(data.current.dt).format("MM/DD/YYYY")
  let windspeed = Math.round((data.daily[0].wind_speed*3.6));
  if (data.daily[0].uvi >= 11) {varUVI = `Violet`, varCOL = `White`}; // Extreme
  if (data.daily[0].uvi < 11) {varUVI = `Red`, varCOL = `White`}; // Very High
  if (data.daily[0].uvi < 8) {varUVI = `Orange`, varCOL = `White`}; // High
  if (data.daily[0].uvi < 6) {varUVI = `Yellow`, varCOL = `Black`}; // Moderate
  if (data.daily[0].uvi < 3) {varUVI = `Green`, varCOL = `White`}; // Low
  console.log(varUVI)

  currentWeatherItemsEl.innerHTML =
    `
    <div class="weather-item">
    <div></div>
    <div>${dtDate}</div>
    </div>
    <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
    <div class="weather-item">
    <div>Current Temp</div>
    <div>&nbsp&nbsp${temp} &#176;C</div>
    </div>
    <div class="weather-item">
    <div>Feels Like</div>
    <div>${feels_like} &#176;C</div>
    </div>
    <div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
    <div>Windspeed</div>
    <div>&nbsp&nbsp${windspeed +space+"km/h"}</div>
    </div>
    <div class="weather-item">
    <div>UV Index</div>
    <div id="day0-UV">${uvi}<span id="day0-UV"></span></div>
    </div>
    <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format('h:mm a')}</div>
    </div>
    <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset * 1000).format('h:mm a')}</div>
    </div>`;
    $(`#day0-UV`).css({ "background-color": varUVI,"color": varCOL, "border-radius": "5px","width": "50px","text-align": "center"});
  displayFiveDay(data);

}

function displayFiveDay(data) {  //updates the weather information for the various IDs
  for (var i = 1; i <= 5; i++) {
    let windspeed = Math.round((data.daily[i].wind_speed*3.6));
    console.log(data.daily[i].weather[0].icon)
    $(`#day` + i + `-tempnight`).html("Night:" + space + data.daily[i].temp.night + celc);
    $(`#day` + i + `-tempday`).html("Morning:"+space+data.daily[i].temp.morn + celc);
    $(`#day` + i + `-date`).text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
    $(`#day` + i + `-icon`).attr("src", `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`);
    $(`#day` + i + `-humidity`).html("Humidity:"+space+data.daily[i].humidity+`%`);
    $(`#day` + i + `-windspeed`).html("Windspeed:"+space+windspeed+"km/h");
    $(`#day` + i + `-current`).html("Temp:" + space + data.daily[i].temp.day + celc);
  }
}


function searchApi(query) {
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=` + query + `&appid=${API_KEY}`;

  fetch(locQueryUrl)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        $("#search-input")[0].reset()
        alert("ERROR: City not found");
        throw response.json();
      }
      console.log(response.json);
      return response.json();

    })
    .then(function (data) {
      console.log(data)
      varName = data.name;
      varLat = data.coord.lat;
      varLon = data.coord.lon;
      currentCityName = query;
      console.log(currentCityName + ` located at:` + varLat + `x` + varLon);
      getWeatherData(varLat, varLon, currentCityName, varName);
    })

}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  var searchInputVal = document.querySelector('#search-input').value;
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  searchApi(searchInputVal);
}


function showCityList(cityList) {  //displays the list of cities chosen in the past
  var varText = "";
  for (var i = 0; i < cityList.length; i++) {
    varText += `<li class="oldCity" onclick="searchApi('` + cityList[i] + `')">` + cityList[i] + `</li>`;
  }
  $(`#cityListGroup`).html(varText);
}

function updateCityList(currentCityName) {  //saves the city list to local storage
  cityList.indexOf(currentCityName) === -1 ? cityList.push(currentCityName) : console.log("City already on list")
  localStorage.setItem("cityList", JSON.stringify(cityList)); //saves cityList
  showCityList(cityList);
}





function loadCityList(cityList) {  //function to load the text from memory
  cityList = JSON.parse(localStorage.getItem("cityList"));
  if (!cityList) {  //check to see if the variable exists
    console.log("- No saved information"); //prints error message in console
    cityList = [];
    return cityList;
  }
  return cityList;
}



searchFormEl.addEventListener('submit', handleSearchFormSubmit);
cityList = loadCityList(cityList);
searchApi("Toronto");