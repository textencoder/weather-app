const currentLocation = document.getElementById("location");
const currentTemp = document.getElementById("current-temp");
const currentCondition = document.getElementById("current-condition");
const highTemp = document.getElementById("high-temp");
const lowTemp = document.getElementById("low-temp");

const dailyCondition = document.getElementById("daily-condition");

const handleScroll = (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    document.querySelector("#hours").scrollLeft += e.deltaY;
  }
};

document
  .querySelector("#hours")
  .addEventListener("wheel", handleScroll, { passive: false });

window.addEventListener("DOMContentLoaded", getData("chicago"));

async function getData(location) {
  const key = "TB5Y9LTDV3UCDBD8CDYVFNN2B";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${key}&contentType=json`;

  const response = await fetch(url, { mode: "cors" });

  const data = await response.json();

  populateCurrentTemp(data);
  populateHourlyData(data);
  populateDayData(data);

  populateFeelsLike(data);
  populateUvIndex(data);

  console.log(data);
}

//getData('chicago')

function populateCurrentTemp(data) {
  currentTemp.textContent = data.currentConditions.temp.toFixed(0) + "°";
  currentCondition.textContent = data.currentConditions.conditions;
  highTemp.textContent = "H:" + data.days[0].tempmax.toFixed(0) + "°";
  lowTemp.textContent = "L:" + data.days[0].tempmin.toFixed(0) + "°";

  currentLocation.textContent = "";
  for (const char of data.resolvedAddress) {
    if (char == ",") {
      return;
    }
    currentLocation.textContent += char;
  }
}

function populateHourlyData(data) {
  document.querySelector("#hours").innerHTML = "";

  dailyCondition.textContent = data.days[0].description;

  for (const [key, value] of Object.entries(data.days[0].hours)) {
    if (Number(key) >= new Date().getHours()) {
      populateHours(value.datetime, value.icon, value.temp.toFixed(0));
    }
  }
  for (const [key, value] of Object.entries(data.days[1].hours)) {
    //if (Number(key) >= new Date().getHours()) {
    populateHours(value.datetime, value.icon, value.temp.toFixed(0));
    //}
  }
}

function populateHours(timeData, conditionData, tempData) {
  const container = document.createElement("div");
  container.classList.add("hour");

  const time = document.createElement("p");
  time.classList.add("time");
  let hoursAbbr = Number(timeData[0] + timeData[1]);

  if (hoursAbbr == 0) {
    hoursAbbr = "12AM";
  } else if (hoursAbbr >= 12) {
    hoursAbbr -= 12;
    hoursAbbr == 0 ? (hoursAbbr = 12) : hoursAbbr;
    hoursAbbr += "PM";
  } else {
    hoursAbbr += "AM";
  }
  time.textContent = hoursAbbr;

  const condition = document.createElement("img");
  condition.classList.add("condition");
  condition.src = `./assets/${conditionData}.svg`;

  const temp = document.createElement("p");
  temp.classList.add("hour-temp");
  temp.textContent = tempData + "°";

  container.append(time, condition, temp);
  document.querySelector("#hours").append(container);
}

function populateDayData(data) {
  document.querySelector("#ten-day-forecast").innerHTML = "";

  const label = document.createElement("label");
  const calendarIcon = document.createElement("img");
  calendarIcon.src = "./assets/calendar-month.svg";
  calendarIcon.style.width = "18px";
  label.append(calendarIcon);
  label.innerHTML += "10 DAY FORECAST";

  document.querySelector("#ten-day-forecast").append(label);

  for (let i = 0; i < 10; i++) {
    populateDays(
      data.days[i].datetime,
      data.days[i].icon,
      data.days[i].tempmin,
      data.days[i].tempmax
    );
  }

  // for (const day of data.days) {
  //     populateDays(day.datetime, day.icon, day.tempmin, day.tempmax)
  // }
}

const dayObj = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function populateDays(dayData, conditionData, dayLowData, dayHighData) {
  const day = document.createElement("div");
  day.classList.add("day");

  const dayOfWeek = document.createElement("p");
  dayOfWeek.classList.add("day-of-week");
  const parsedDay = new Date(dayData).getUTCDay();
  dayOfWeek.textContent = dayObj[parsedDay];

  const condition = document.createElement("img");
  condition.classList.add("day-condition");
  condition.src = `./assets/${conditionData}.svg`;

  const dayLow = document.createElement("p");
  dayLow.classList.add("day-low");
  dayLow.textContent = dayLowData.toFixed(0) + "°";

  const barGraph = document.createElement("bar-graph");
  barGraph.classList.add("bar-graph");

  const dayHigh = document.createElement("p");
  dayHigh.classList.add("day-high");
  dayHigh.textContent = dayHighData.toFixed(0) + "°";

  day.append(dayOfWeek, condition, dayLow, barGraph, dayHigh);

  document.querySelector("#ten-day-forecast").append(day);
}

function populateFeelsLike(data) {
  const label = document.createElement('p');
  const labelIcon = document.createElement('img');
  labelIcon.src = "/assets/thermometer.svg";
  labelIcon.style.width = "18px";
  label.append(labelIcon);
  label.innerHTML += "FEELS LIKE";

  const feelsLike = document.createElement('p');
  feelsLike.textContent = data.currentConditions.feelslike.toFixed(0) + "°";

  const actual = document.createElement('p');
  actual.textContent = "Actual: " + data.currentConditions.temp.toFixed(0) + "°";

  const barGraph = document.createElement('span');
  barGraph.classList.add('bar-graph');

  const description = document.createElement('p');
  description.textContent = "Wind is making it feel colder.";

  document.querySelector('#feels-like').append(label, feelsLike, actual, barGraph, description);
}

function populateUvIndex(data) {
  const label = document.createElement('p');
  const labelIcon = document.createElement('img');
  labelIcon.src = "/assets/sunny.svg";
  labelIcon.style.width = "18px";
  label.append(labelIcon);
  label.innerHTML += "UV INDEX";

  const index = document.createElement('p');
  index.textContent = data.currentConditions.uvindex;

  const level = document.createElement('p');
  level.textContent = "{index level}";

  const barGraph = document.createElement('span');
  barGraph.classList.add('bar-graph');

  const description = document.createElement('p');
  description.textContent = "Use sun protection until 2PM.";

  document.querySelector('#uv-index').append(label, index, level, barGraph, description);
}



//submit listeners
document.querySelector("#submit-btn").addEventListener("click", () => {
  getData(document.querySelector("input").value);
  document.querySelector("input").value = "";
  document.querySelector("input").blur();
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" || e.key == 13) {
    getData(document.querySelector("input").value);
    document.querySelector("input").value = "";
    document.querySelector("input").blur();
  }
});

//geolocation
function success(pos) {
  const crd = pos.coords;
  getCity(crd.latitude, crd.longitude);
}

document.querySelector("#location-btn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(success);
});

async function getCity(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  getData(data.address.town);
}
