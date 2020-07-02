// Variables for current weather
var weatherLocation;
var weatherCurrent;
var weatherIcon ;

// Variables for Forecast
var weatherForecast;

// Variables for API call
var weather ;
var queryURL ;

function KtoF (tempK){
  var tempF = (tempK - 273.15) * (9/5) + 32;
  return tempF;
}

function todaysDate (){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  return today = mm + '/' + dd + '/' + yyyy;
}

//  *** API CALL 1 ***
function weatherCall (newCity){  
  var city = newCity;
  var key = "51727a8b82bfa19792db2f23ff500b2b";
  var queryURL1= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key ;

  // Calls API using name and stores lon+lat
  $.ajax({
    "async": false,
    "crossDomain": true,
    url: queryURL1 , 
    method: "GET"
    }).done (function(response){
    
       weatherLocation = response.coord; //stores lat and lon for second API call
      });

  var queryURL2= `https://api.openweathermap.org/data/2.5/onecall?lat=` + weatherLocation.lat + `&lon=`+ weatherLocation.lon + `&exclude=hourly,minutely&appid=` + key;

  //Calls 5 day forecast and current
  $.ajax({
    "async": false,
    "crossDomain": true,
    url: queryURL2 , 
    method: "GET"
    }).done (function(response){
          
        weatherObject = response;
        weatherCurrent = response.current;
        weatherForecast = response.daily;
      });

    //   Updates Current Weather Dashboard 
      var currentImgObj = '<img src="http://openweathermap.org/img/wn/' + weatherCurrent.weather[0].icon + '@2x.png">';
      $('#current-location').append('<h4>' + weatherObject.timezone + ' - ('+ todaysDate() + ') '+ currentImgObj+'</h4>');
      $('#current-temperature').text("Temperature: " + KtoF(weatherCurrent.temp).toPrecision(4)  + " DegF");
      $('#current-humidity').text("Humidity: " +weatherCurrent.humidity + " %");
      $('#current-windspeed').text("Wind Speed: " +weatherCurrent.wind_speed + " MPH");
      $('#current-uv').text("UV Index: " +weatherCurrent.uvi);
      
      // Updates Forecast 5 day Dashboard
      for( var i = 1 ; i <6 ; i++){
        console.log(weatherForecast[i].weather[0].icon);
        var forecastImgObj = '<img src="http://openweathermap.org/img/wn/' + weatherForecast[i].weather[0].icon+ '@2x.png">' ;
        $('#future-forecast').append('<div class="five-day-forecast" id = "forecast-'+i+'" ><h5>Day ' +i+ '</h5></div>');
        $('#forecast-'+i).append(forecastImgObj);
        $('#forecast-'+i).append('<h6 id = "temp-'+i+'" >Temp: ' + KtoF(weatherForecast[i].temp.day).toPrecision(4)  + ' DegF</h6>');
        $('#forecast-'+i).append('<h6 id = "humidity-'+i+'" >Humidity:' + weatherForecast[i].humidity + '%</h6>');
      
      
      }
    } //**End of API CALL */


$("#newCityBtn").on("click" , function (){
  event.preventDefault();
  var newCity = $("#newCityInput").val();

  if (newCity !== ""){
    weatherCall(newCity);
    $("#weather-locations").append("<button class='cityBlock'>" + newCity + "</button>");
    console.log(newCity); 
    }
  })



 

