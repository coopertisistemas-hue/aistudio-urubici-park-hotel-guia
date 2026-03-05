// Urubici-SC coordinates: latitude -28.015, longitude -49.592

export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

const API_URL = 'https://api.open-meteo.com/v1/forecast';
const LATITUDE = -28.015;
const LONGITUDE = -49.592;

export async function getWeather(): Promise<WeatherData> {
  const response = await fetch(
    `${API_URL}?latitude=${LATITUDE}&longitude=${LONGITUDE}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo&forecast_days=4`
  );

  if (!response.ok) {
    throw new Error('Falha ao buscar dados do clima');
  }

  const data = await response.json();

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date,
    maxTemp: Math.round(data.daily.temperature_2m_max[i]),
    minTemp: Math.round(data.daily.temperature_2m_min[i]),
    weatherCode: data.daily.weathercode[i],
    precipitationProbability: data.daily.precipitation_probability_max[i] ?? 0,
  }));

  return {
    current: {
      temperature: Math.round(data.current_weather.temperature),
      windSpeed: data.current_weather.windspeed,
      weatherCode: data.current_weather.weathercode,
    },
    daily,
  };
}

export function getWeatherIcon(code: number): string {
  const icons: Record<number, string> = {
    0: '☀️',
    1: '🌤',
    2: '⛅',
    3: '☁️',
    45: '🌫',
    48: '🌫',
    51: '🌧',
    53: '🌧',
    55: '🌧',
    61: '🌧',
    63: '🌧',
    65: '🌧',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    77: '🌨',
    80: '🌧',
    81: '🌧',
    82: '🌧',
    85: '🌨',
    86: '🌨',
    95: '⛈',
    96: '⛈',
    99: '⛈',
  };

  return icons[code] ?? '☁️';
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Predominantemente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    77: 'Granizo',
    80: 'Chuva leve',
    81: 'Chuva moderada',
    82: 'Chuva forte',
    85: 'Neve leve',
    86: 'Neve forte',
    95: 'Tempestade',
    96: 'Tempestade',
    99: 'Tempestade forte',
  };

  return descriptions[code] ?? 'Condição desconhecida';
}

export function formatDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Hoje';
  if (date.getTime() === tomorrow.getTime()) return 'Amanhã';

  return date.toLocaleDateString('pt-BR', { weekday: 'short' });
}
