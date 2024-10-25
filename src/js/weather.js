function getWeatherIcon({ precipitation, rain, showers, snowfall, cloud_cover }) {
    if (precipitation === 0 && rain === 0 && snowfall === 0) {
        if (cloud_cover < 20) {
            return "☀️";
        } else if (cloud_cover >= 20 && cloud_cover <= 50) {
            return "🌤";
        } else if (cloud_cover > 50) {
            return "☁️";
        }
    } else if (rain > 0 || showers > 0) {
        if (precipitation > 10) {
            return "⛈";
        }
        return "🌧";
    } else if (snowfall > 0) {
        return "❄️";
    }

    return "🌤";
}

function getSimpleWeatherIcon({ precipitation, rain, showers, snowfall }) {
    if (precipitation === 0 && rain === 0 && snowfall === 0) {
        return "☀️";
    } else if (snowfall > 0) {
        return "❄️";
    } else if (rain > 0 || showers > 0) {
        if (precipitation > 10) {
            return "⛈";
        }
        return "🌧";
    }
    return "🌤";
}


async function fetchWeather(data) {

    const weatherUnits = data.current_units;
    const weatherData = data.current;

    document.getElementById('weather-time').textContent = `Текущее время ${new Date(weatherData.time).toLocaleTimeString()}`;
    document.getElementById('weather-icon').textContent = `${getWeatherIcon(weatherData)}`;
    document.getElementById('weather-temp').textContent = `Температура: ${weatherData.temperature_2m}${weatherUnits.temperature_2m}`;
    document.getElementById('weather-temp-as').textContent = `Ощущается как: ${weatherData.apparent_temperature}${weatherUnits.apparent_temperature}`;
    document.getElementById('weather-humidity').textContent = `Влажность: ${weatherData.relative_humidity_2m}${weatherUnits.relative_humidity_2m}`;
    document.getElementById('weather-wind-speed').textContent = `Скорость ветра: ${weatherData.wind_speed_10m}${weatherUnits.wind_speed_10m}`;
    document.getElementById('weather-pressure').textContent = `Давление: ${weatherData.pressure_msl}${weatherUnits.pressure_msl}`;
}


async function fetchForecast(data) {
    const todayIndex = 0;
    const todayDate = data.daily.time[todayIndex];
    const todayMaxTemp = data.daily.temperature_2m_max[todayIndex];
    const todayMinTemp = data.daily.temperature_2m_min[todayIndex];
    const todaySunrise = data.daily.sunrise[todayIndex].split("T")[1];
    const todaySunset = data.daily.sunset[todayIndex].split("T")[1];
    const todayDylightDuration = data.daily.daylight_duration[todayIndex]/3600;
    const todaySunshineDuration = data.daily.sunshine_duration[todayIndex]/3600;
    const todayPrecipitation = data.daily.precipitation_sum[todayIndex];

    document.getElementById("report-date").textContent = `Сегодня (${todayDate})`;
    document.getElementById("report-temp-max").textContent = `Макс температура: ${todayMaxTemp}°C`;
    document.getElementById("report-temp-min").textContent = `Мин температура: ${todayMinTemp}°C`;
    document.getElementById("report-sunrise").textContent = `Рассвет: ${todaySunrise}`;
    document.getElementById("report-sunset").textContent = `Закат: ${todaySunset}`;
    document.getElementById("report-daylight-duration").textContent = `Часы дневного света: ${todayDylightDuration.toFixed(1)}ч`;
    document.getElementById("report-sunshine-duration").textContent = `Часы солнечного света: ${todaySunshineDuration.toFixed(1)}ч`;
    document.getElementById("report-precipitation").textContent = `Осадки: ${todayPrecipitation} мм`;

    const forecastContainer = document.getElementById("forecast-container");
    for (let i = 1; i <= 5; i++) {
        const date = data.daily.time[i];
        const maxTemp = data.daily.temperature_2m_max[i];
        const minTemp = data.daily.temperature_2m_min[i];
        const sunrise = data.daily.sunrise[i].split("T")[1];
        const sunset = data.daily.sunset[i].split("T")[1];
        const precipitation = data.daily.precipitation_sum[i];
        
        const icon = getSimpleWeatherIcon({
            precipitation: data.daily.precipitation_sum[i],
            rain: data.daily.rain_sum[i] || 0,
            showers: data.daily.showers_sum[i] || 0,
            snowfall: data.daily.snowfall_sum[i] || 0
        });

        const card = `
            <div class="col-md-2">
                <div class="card text-center border border-info h-100">
                    <h4>${date}</h4>
                    <div class="weather-icon">${icon}</div>
                    <p>Макс: ${maxTemp}°C</p>
                    <p>Мин: ${minTemp}°C</p>
                    <p>Рассвет: ${sunrise}</p>
                    <p>Закат: ${sunset}</p>
                    <p>Осадки: ${precipitation} мм</p>
                </div>
            </div>
        `;
        forecastContainer.innerHTML += card;
    }
}

async function Run() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.61&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum&wind_speed_unit=ms&timezone=Europe%2FMoscow"
    const response = await fetch(url);
    const data = await response.json();

    fetchWeather(data);
    fetchForecast(data);
}

Run();