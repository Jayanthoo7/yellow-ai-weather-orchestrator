/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
export async function getWeatherForCity(city) {
    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather');
    }

    return data.weather[0].main;
}