// global variables

let id = 0; 

let units = true;

// Render Function

 async function render(city, date, time, f) {
  // Location API

  // Render Rain

  function renderRain(level) {
   $(document).ready(function() {
      var canvas = $('#canvas')[0];
      let width = $(document).width();
      let height = $(document).height();
      canvas.width = width;
      canvas.height = height;
  
      if(canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.strokeStyle = 'rgba(196,211,223,0.5)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
  
  
        var init = [];
        var maxParts = level;
        for(var a = 0; a < maxParts; a++) {
          init.push({
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 1,
            xs: -0 + Math.random() * 0 + 0,
            ys: Math.random() * 20 + 10
          })
        }
  
        var particles = [];
        for(var b = 0; b < maxParts; b++) {
          particles[b] = init[b];
        }
  
        function draw() {
          ctx.clearRect(0, 0, w, h);
          for(var c = 0; c < particles.length; c++) {
            var p = particles[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }
          move();
        }
  
        function move() {
          for(var b = 0; b < particles.length; b++) {
            var p = particles[b];
            p.x += p.xs;
            p.y += p.ys;
            if(p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }
        
      id = setInterval(draw, 30); 
        
      }
    });
   }

  // Render Snow
   
  function renderSnow (level) {
    $(document).ready(function() {
      var canvas = $('#canvas')[0];
      let width = $(document).width();
      let height = $(document).height();
      canvas.width = width;
      canvas.height = height;
  
      if(canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
  
  
        var init = [];
        var maxParts = level;
        for(var a = 0; a < maxParts; a++) {
          init.push({
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 1,
            xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 1 + 1
          })
        }
  
        var particles = [];
        for(var b = 0; b < maxParts; b++) {
          particles[b] = init[b];
        }
  
        function draw() {
          ctx.clearRect(0, 0, w, h);
          for(var c = 0; c < particles.length; c++) {
            var p = particles[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }
          move();
        }
  
        function move() {
          for(var b = 0; b < particles.length; b++) {
            var p = particles[b];
            p.x += p.xs;
            p.y += p.ys;
            if(p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }
  
      id = setInterval(draw, 30);
  
      }
    });
  }

   let tempUnit = "&temperature_unit=fahrenheit";
   
   if (f == true) {
     tempUnit = "&temperature_unit=fahrenheit"
   } else {
     tempUnit = "";
   }

  // City coordinates API

  try {
    let locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    let locationData = await locationResponse.json();
    let locationResponseObject = {latitude: locationData.results[0].latitude, longitude: locationData.results[0].longitude};
    console.log(locationResponseObject);
    let apiInput = {start_date: date, end_date: date, longitude: locationResponseObject.longitude, latitude: locationResponseObject.latitude};

  // Weather API  

    let weatherResponse = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${apiInput.latitude}&longitude=${apiInput.longitude}&start_date=${apiInput.start_date}&end_date=${apiInput.end_date}&hourly=temperature_2m,rain,snowfall,cloudcover&timezone=auto${tempUnit}&precipitation_unit=inch`);
  let weatherData = await weatherResponse.json();
  console.log(weatherData);
  let weatherResponseObject = {temperature: weatherData.hourly.temperature_2m[time], cloudCover: weatherData.hourly.cloudcover[time], rain: weatherData.hourly.rain[time], snowFall: weatherData.hourly.snowfall[time]};

   console.log(weatherResponseObject);


   let clouds = "Clear";

   // Cloud cover logic
   
  if (((weatherResponseObject.cloudCover / 100) >= 1/8) && ((weatherResponseObject.cloudCover / 100) < 3/8)) {
    clouds = "Mostly Clear";
  } else if (((weatherResponseObject.cloudCover / 100) >= 3/8) && ((weatherResponseObject.cloudCover / 100) <= 5/8)) {
     clouds = "Partly Cloudy";
  } else if (((weatherResponseObject.cloudCover / 100) > 5/8) && ((weatherResponseObject.cloudCover / 100) <= 7/8)) {
    clouds = "Mostly Cloudy";
  } else if (((weatherResponseObject.cloudCover / 100) > 7/8)) {
    clouds = "Cloudy";
  } else {
    clouds = "Clear";
  }

  let canvas = document.getElementById("canvas");
  let context = canvas.getContext('2d');

  let rain = "";

  // Rain logic
   
  function getRain () {
    if ((weatherResponseObject.rain > 0) && (weatherResponseObject.rain < 0.01)) {
      rain = "Light Drizzle";
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(id);
      renderRain(10);
    } else if ((weatherResponseObject.rain >= 0.01) && (weatherResponseObject.rain < 0.02)) {
      rain = "Moderate Drizzle";
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(id);
      renderRain(50);
    } else if ((weatherResponseObject.rain >= 0.02) && (weatherResponseObject.rain < 0.10)) {
      rain = "Light Rain";
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(id);
      renderRain(100);
    } else if ((weatherResponseObject.rain >= 0.10) && (weatherResponseObject.rain < 0.30)) {
      rain = "Moderate Rain";
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(id);
      renderRain(500);
    } else if (weatherResponseObject.rain >= 0.30) {
      rain = "Heavy Rain";
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(id);
      renderRain(1000);
    } else {
      rain = "";
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearInterval(id);
    }
  }

   let snow = "";

  // Snow logic
   
   function getSnow () {
     if ((weatherResponseObject.snowFall > 0) && (weatherResponseObject.snowFall < 0.9)) {
       snow = "Light Snowfall";
       context.clearRect(0, 0, canvas.width, canvas.height);
       clearInterval(id);
       renderSnow(250);
     } else if ((weatherResponseObject.snowFall >= 0.9) && (weatherResponseObject.snowFall < 2.8)) {
       snow = "Moderate Snowfall";
       context.clearRect(0, 0, canvas.width, canvas.height);
       clearInterval(id);
       renderSnow(500);
     } else if ((weatherResponseObject.snowFall >= 2.8)) {
       snow = "Heavy Snowfall";
       context.clearRect(0, 0, canvas.width, canvas.height);
       clearInterval(id);
       renderSnow(1000);
     } else {
       context.clearRect(0, 0, canvas.width, canvas.height);
       clearInterval(id);
       snow = "";
     }
   }

  // Rain and snow logic
   
  if ((weatherResponseObject.rain > 0) && (weatherResponseObject.snowFall > 0)) {
    if (weatherResponseObject.rain > weatherResponseObject.snowFall) {
      getRain();
    } else {
      getSnow();
    }
  } else {
    getRain();
    getSnow();
  }

  // add values to the HTML
  document.getElementById("degrees").innerHTML = `${weatherResponseObject.temperature}°`;
     
  document.getElementById("metrics").innerHTML = `${clouds}`;
  
  document.getElementById("rain").innerHTML = `${rain}`;
  
  document.getElementById("snow").innerHTML = `${snow}`;
  } catch(err) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');
    document.getElementById("degrees").innerHTML = `--`;
    document.getElementById("metrics").innerHTML = `City not recognized!`;
    document.getElementById("rain").innerHTML = ``;
    document.getElementById("snow").innerHTML = ``;
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(id);
    return;
  }
}

// Slider time indicator

let slider = document.getElementById("slider");
let output = document.getElementById("time");
output.innerHTML = `${slider.value} Pm`;

let time = 12;

slider.oninput = function() {
  time = this.value;
  if (this.value > 12) {
     output.innerHTML = `${(this.value) - 12} Pm`;
  } else if (this.value < 12) {
    output.innerHTML = `${this.value} Am`;
    if (this.value == 0) {
      output.innerHTML = `12 Am`;
    }
  } else if (this.value = 12) {
    output.innerHTML = `${this.value} Pm`;
  }
}

// date selector

const currentDate = new Date();

let curentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth() + 1;
let currentYear = currentDate.getFullYear();

let month = document.getElementById(`select-month`);
let year = document.getElementById(`select-year`); 
let day = document.getElementById(`select-day`);

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",  "November",  "December"];

if (currentMonth > 1) {

  // Add years up to current year
  
  for (let i = currentYear;1940 <= i;i--) {
    let option = document.createElement("option");
    option.text = i;
    year.add(option); 
  } 
  
  // Add months up to the month before the current month
  
  for (let i = 0;i < (currentMonth - 1);i++) {
    let option = document.createElement("option");
    option.text = months[i];
    option.value = i;
    month.add(option); 
  } 

} else {
  // Add years up to last year
  
  for (let i = currentYear - 1;1940 <= i;i--) {
    let option = document.createElement("option");
    option.text = i;
    year.add(option); 
  } 
  
  for (let i = 0;i < 12;i++) {
    let option = document.createElement("option");
    option.text = months[i];
    option.value = i;
    month.add(option); 
  } 
}

//check for leapyear


function removeOptions(selectElement) {
  let i, length = selectElement.options.length - 1;
  for(i = length; i >= 0; i--) {
    selectElement.remove(i);
  }
}

let leapyear = false; 

// Check for leapyear on year change

let lastYear = currentYear;

year.oninput = function() {
  if ((this.value != currentYear) && (currentYear == lastYear)) {
    removeOptions(document.getElementById('select-month'));
    for (let i = 0;i < 12;i++) {
    let option = document.createElement("option");
    option.text = months[i];
    option.value = i;
    month.add(option); 
    }
    removeOptions(document.getElementById('select-day'));
    for (let i = 1;31 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
    }
  } else if (this.value == currentYear) {
    removeOptions(document.getElementById('select-month'));
    for (let i = 0;i < (currentMonth - 1);i++) {
    let option = document.createElement("option");
    option.text = months[i];
    option.value = i;
    month.add(option); 
    } 
    removeOptions(document.getElementById('select-day'));
    for (let i = 1;31 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
    }
  }
  if ((0 == (this.value) % 4) && (0 != (this.value) % 100) || (0 == (this.value) % 400)) {
    leapyear = true;
      if (month.value == 1) {
        console.log("leap");
        console.log(this.value);
removeOptions(document.getElementById('select-day'));
        for (let i = 1;29 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
        } 
      }
    } else {
    leapyear = false;
      if (month.value == 1) {
        console.log("no leap");
        console.log(this.value);
removeOptions(document.getElementById('select-day'));
        for (let i = 1;28 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
        }
      }
    }
  lastYear = this.value;
}

// Check for leapyear on month change 

month.oninput = function() {

  removeOptions(document.getElementById('select-day'));
    
    if ((this.value == 0) || (this.value == 2) || (this.value == 4) || (this.value == 6) || (this.value == 7) || (this.value == 9) || (this.value == 11)) {
      for (let i = 1;31 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
      }
    } else if ((this.value == 3) || (this.value == 5) || (this.value == 8) || (this.value == 10)) {
       for (let i = 1;30 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
      }
    } else if ((this.value == 1) && (leapyear == false)) {
      for (let i = 1;28 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
      } 
    } else if ((this.value == 1) && (leapyear == true)) {
      for (let i = 1;29 >= i;i++) {
        let option = document.createElement("option");
        option.text = i;
         day.add(option); 
      } 
    }

  
}
  
// Function run when clicked

function getClick(time) {
  let city = document.getElementById(`cityInput`).value;
  console.log(city);
  let getYear = document.getElementById('select-year').value;
  let getMonth = document.getElementById('select-month').value;
  getMonth = parseInt(getMonth);
  getMonth = getMonth + 1;
  let getDay = document.getElementById('select-day').value; 

  if(getDay < 10) {
    getDay = 0 + getDay;
  }

  getMonth = getMonth.toString();
  if(getMonth < 10) {
    getMonth = 0 + getMonth;
  }

  let date = `${getYear}-${getMonth}-${getDay}`;
  console.log(date);
  render(city, date, time, units);
  console.log("click");
}

// i button modal

let modal = document.querySelector(".modal");
let overlay = document.querySelector(".overlay");
let openModalBtn = document.querySelector(".btn-open");
let closeModalBtn = document.querySelector(".btn-close");

let about = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

openModalBtn.addEventListener("click", about);

let closeAbout = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

closeModalBtn.addEventListener("click", closeAbout);

// function run when the unit button is clicked

function unitChange () {
  if (document.getElementById("units-button").innerHTML == "°F") {
    units = false;
    document.getElementById("units-button").innerHTML = "°C";
  } else {
    units = true;
    document.getElementById("units-button").innerHTML = "°F";
  }

  if (document.getElementById(`cityInput`).value != "") {
    getClick(time);
  }  
  
}
