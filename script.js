const currentLocation = document.getElementById('location');
const currentTemp = document.getElementById('current-temp');
const currentCondition = document.getElementById('current-condition');
const highTemp = document.getElementById('high-temp');
const lowTemp = document.getElementById('low-temp');

const dailyCondition = document.getElementById('daily-condition');


window.addEventListener('DOMContentLoaded', getData('chicago'))

async function getData(location) {
    const key = 'TB5Y9LTDV3UCDBD8CDYVFNN2B';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${key}&contentType=json`;

    const response = await fetch(url, {mode: 'cors'})

    const data = await response.json()

    //console.log(data);

    populateCurrentTemp(data);
    populateHourlyData(data);
}

//getData('chicago')

function populateCurrentTemp(data) {
    console.log(data)

    currentTemp.textContent = data.currentConditions.temp.toFixed(0) + '°';
    currentCondition.textContent = data.currentConditions.conditions;
    highTemp.textContent = 'H:' + data.days[0].tempmax.toFixed(0) + '°';
    lowTemp.textContent = 'L:' + data.days[0].tempmin.toFixed(0) + '°';

    for (const char of data.resolvedAddress) {
        if (char == ',') {
            return;
        }
        currentLocation.textContent += char;
    }
}

function populateHourlyData(data) {
    dailyCondition.textContent = data.days[0].description;
    
    for (const [key,value] of Object.entries(data.days[0].hours)) {
        if (Number(key) >= new Date().getHours()) {
            populateHours(value.datetime,value.icon,value.temp.toFixed(0));
        }
    }
    for (const [key,value] of Object.entries(data.days[1].hours)) {
        //if (Number(key) >= new Date().getHours()) {
            populateHours(value.datetime,value.icon,value.temp.toFixed(0));
        //}
    }
}

function populateHours(timeData, conditionData, tempData) {
    const container = document.createElement('div');
    container.classList.add('hour');

    const time = document.createElement('p');
    time.classList.add('time');
    let hoursAbbr = Number(timeData[0] + timeData[1])
    
    if (hoursAbbr == 0) {
        hoursAbbr = '12AM'
    } else if (hoursAbbr >= 12) {
        hoursAbbr -= 12;
        hoursAbbr == 0 ? hoursAbbr = 12 : hoursAbbr;
        hoursAbbr += 'PM'
    } else {
        hoursAbbr += 'AM'
    }
    time.textContent = hoursAbbr;

    const condition = document.createElement('img');
    condition.classList.add('condition');
    condition.src = `./assets/${conditionData}.svg`;

    const temp = document.createElement('p');
    temp.classList.add('hour-temp');
    temp.textContent = tempData + '°';

    container.append(time, condition, temp);
    document.querySelector('#hours').append(container)
}