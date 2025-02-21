async function getData(location) {
    const key = 'TB5Y9LTDV3UCDBD8CDYVFNN2B';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${key}&contentType=json`;

    const response = await fetch(url, {mode: 'cors'})

    const data = await response.json()

    console.log(data);
}

getData('chicago')