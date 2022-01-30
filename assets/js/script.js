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


let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


let API_KEY = "928833520683a8d6e55eaf1f2e8c61f4"

setInterval(() => {
    let time = new Date();
    let month = time.getMonth();
    let date = time.getDate();
    let day = time.getDay();
    let hour = time.getHours();
    let hoursIn12HrFormat = hour >= 13 ? hour %12: hour;
    let minutes = time.getMinutes();
    let ampm = hour >=12 ? 'PM':'AM';

    timeEl.innerHTML = hoursIn12HrFormat + ":" + (minutes < 10? "0" +minutes:minutes) + " " + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ", " + date +" "+ months[month];
}, 1000);


function getWeatherData(varLat, varLon, currentCityName, varName) {
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=`+varLat+`&lon=`+varLon+`&exclude=hourly&units=metric&appid=${API_KEY}`;
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
 let {clouds, humidity, temp, sunrise, sunset, wind_speed, feels_like, weather} = data.current;
    timezone.innerHTML = varName;
    countryEl.innerHTML = data.lat + "N " +data.lon+"E"
    let uvi = data.daily[0].uvi;


    currentWeatherItemsEl.innerHTML = 
    `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
    <div class="weather-item">
    <div>Current Temp</div>
    <div>&nbsp&nbsp${temp} &#176;C</div>
    </div>
    <div class="weather-item">
    <div>Feels Like</div>
    <div>${feels_like} &#176;C</div>
    </div>
    <div class="weather-item">
    <div>Clouds</div>
    <div>${clouds}%</div>
    </div>
    <div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
    <div>UV Index</div>
    <div id="day0-UV">${uvi}<span id="day0-UV"></span></div>
    </div>
    <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>`;
    

    let = otherDayForecast = ""
    data.daily.forEach((day, idx) => {
        if(idx == 1){
            currentTempEl.innerHTML = `            
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Day:  ${day.temp.day} &#176; C</div>
                <div class="temp">Night:  ${day.temp.night} &#176; C</div>
            </div>`
          } else { //for (var i = 0; i <= 5; i++) {
            otherDayForecast += `            
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Day: ${day.temp.day} &#176; C</div>
            <div class="temp">Night: ${day.temp.night} &#176; C</div>
            </div>
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}




function searchApi(query) {
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=`+query+`&appid=${API_KEY}`;
 
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
        console.log(currentCityName + ` located at:`+varLat+`x`+ varLon);
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
      varText += `<li class="oldCity" onclick="searchApi('`+cityList[i]+`')">`+cityList[i]+`</li>`;
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
  if(!cityList) {  //check to see if the variable exists
      console.log("- No saved information"); //prints error message in console
      cityList=[];
      return cityList;
  }
  return cityList;
}



  searchFormEl.addEventListener('submit', handleSearchFormSubmit);
  cityList = loadCityList(cityList);
  searchApi("Toronto");