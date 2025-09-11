// Weather API integration routes
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get current weather
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    // In a real app, you would use the OpenWeather API
    // const API_KEY = process.env.OPENWEATHER_API_KEY;
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    // Mock weather data for demonstration
    const mockWeather = {
      temperature: 22,
      condition: 'sunny',
      description: 'Clear sky',
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      sunrise: '06:30',
      sunset: '18:45',
      city: city || 'Sample City',
      country: 'US',
      timestamp: new Date()
    };

    res.json({
      success: true,
      weather: mockWeather
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});

// Get weather forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;

    // Mock forecast data
    const forecast = [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        temperature: { min: 18, max: 25 },
        condition: 'partly_cloudy',
        description: 'Partly cloudy',
        humidity: 70,
        windSpeed: 8,
        precipitation: 20
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        temperature: { min: 16, max: 23 },
        condition: 'rainy',
        description: 'Light rain',
        humidity: 85,
        windSpeed: 15,
        precipitation: 60
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        temperature: { min: 14, max: 20 },
        condition: 'cloudy',
        description: 'Overcast',
        humidity: 80,
        windSpeed: 12,
        precipitation: 40
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        temperature: { min: 17, max: 24 },
        condition: 'sunny',
        description: 'Clear sky',
        humidity: 60,
        windSpeed: 6,
        precipitation: 0
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        temperature: { min: 19, max: 26 },
        condition: 'sunny',
        description: 'Clear sky',
        humidity: 55,
        windSpeed: 4,
        precipitation: 0
      }
    ];

    res.json({
      success: true,
      forecast: forecast.slice(0, parseInt(days))
    });
  } catch (error) {
    console.error('Weather forecast error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather forecast',
      message: error.message 
    });
  }
});

// Get weather alerts
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Mock weather alerts
    const alerts = [
      {
        id: 'alert1',
        type: 'heat_wave',
        severity: 'moderate',
        title: 'Heat Wave Warning',
        description: 'Temperatures are expected to reach 35°C or higher for the next 3 days. Stay hydrated and avoid prolonged sun exposure.',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        areas: ['Sample City', 'Nearby Areas']
      },
      {
        id: 'alert2',
        type: 'air_quality',
        severity: 'high',
        title: 'Poor Air Quality Alert',
        description: 'Air quality index is currently unhealthy for sensitive groups. Limit outdoor activities.',
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        areas: ['Sample City']
      }
    ];

    res.json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error('Weather alerts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather alerts',
      message: error.message 
    });
  }
});

// Get environmental conditions
router.get('/environmental', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Mock environmental data
    const environmental = {
      airQuality: {
        index: 85,
        level: 'moderate',
        pollutants: {
          pm25: 25,
          pm10: 35,
          o3: 120,
          no2: 45,
          so2: 15
        }
      },
      uvIndex: {
        value: 6,
        level: 'high',
        recommendation: 'Use sun protection'
      },
      pollen: {
        grass: 'low',
        tree: 'moderate',
        weed: 'low',
        overall: 'moderate'
      },
      solarIrradiance: {
        value: 850,
        unit: 'W/m²',
        description: 'Good for solar energy'
      }
    };

    res.json({
      success: true,
      environmental
    });
  } catch (error) {
    console.error('Environmental data error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch environmental data',
      message: error.message 
    });
  }
});

// Get weather-based eco tips
router.get('/eco-tips', async (req, res) => {
  try {
    const { condition, temperature } = req.query;

    // Mock eco tips based on weather
    const tips = [
      {
        id: 'tip1',
        title: 'Energy Saving Tip',
        description: 'With sunny weather, consider using natural light instead of artificial lighting.',
        category: 'energy',
        weatherCondition: 'sunny',
        priority: 'high'
      },
      {
        id: 'tip2',
        title: 'Water Conservation',
        description: 'Rainy weather is perfect for collecting rainwater for your plants.',
        category: 'water',
        weatherCondition: 'rainy',
        priority: 'medium'
      },
      {
        id: 'tip3',
        title: 'Transportation',
        description: 'Nice weather is ideal for walking or cycling instead of driving.',
        category: 'transport',
        weatherCondition: 'sunny',
        priority: 'high'
      }
    ];

    // Filter tips based on weather condition if provided
    const filteredTips = condition 
      ? tips.filter(tip => tip.weatherCondition === condition)
      : tips;

    res.json({
      success: true,
      tips: filteredTips
    });
  } catch (error) {
    console.error('Eco tips error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch eco tips',
      message: error.message 
    });
  }
});

module.exports = router;
