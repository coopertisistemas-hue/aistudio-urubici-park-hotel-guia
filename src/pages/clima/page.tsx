import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/feature/PageHeader';
import PageFooter from '../../components/feature/PageFooter';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherIcon, getWeatherDescription, formatDayName } from '../../services/weatherService';

const ClimaPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, loading, error, lastUpdated, refetch } = useWeather();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diff < 60) return 'Atualizado agora';
    if (diff < 120) return 'Atualizado há 1 minuto';
    const minutes = Math.floor(diff / 60);
    return `Atualizado há ${minutes} minutos`;
  };

  const today = data?.daily[0];
  const upcomingDays = data?.daily.slice(1, 4) ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageHeader isScrolled={isScrolled} backTo="/" backLabel="Início" />

      <div className="relative z-10 max-w-md mx-auto pt-8 pb-16">
        <div className="px-4 mb-6 text-center">
          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            Clima
          </h2>
          <p className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
            Urubici
          </p>
        </div>

        <div className="px-4 space-y-4">
          {loading ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/20 border-t-yellow-400 rounded-full animate-spin mb-4" />
                <p className="text-white/80">Carregando clima...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <i className="ri-error-warning-line text-red-400 text-2xl" />
                </div>
                <p className="text-white/80 mb-4">Não foi possível carregar o clima.</p>
                <button
                  onClick={refetch}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : data && today ? (
            <>
              {/* Agora */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl p-6">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="ri-time-line text-yellow-400 text-sm" />
                  Agora
                </h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl drop-shadow-lg">
                      {getWeatherIcon(data.current.weatherCode)}
                    </span>
                    <div>
                      <div className="text-4xl font-bold text-white">
                        {data.current.temperature}°
                      </div>
                      <div className="text-white/60 text-sm">
                        Máx: {today.maxTemp}° / Mín: {today.minTemp}°
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm">
                      {getWeatherDescription(data.current.weatherCode)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-white/70 bg-white/10 px-3 py-2 rounded-lg flex-1 justify-center">
                    <i className="ri-windy-line" />
                    <span className="text-xs">Vento: {data.current.windSpeed} km/h</span>
                  </div>
                  {today.precipitationProbability > 0 && (
                    <div className="flex items-center gap-2 text-white/70 bg-white/10 px-3 py-2 rounded-lg flex-1 justify-center">
                      <i className="ri-rainy-line" />
                      <span className="text-xs">Chuva: {today.precipitationProbability}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos dias */}
              {upcomingDays.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl p-4">
                  <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="ri-calendar-line text-yellow-400 text-sm" />
                    Próximos dias
                  </h3>
                  
                  <div className="space-y-2">
                    {upcomingDays.map((day, index) => (
                      <div 
                        key={day.date} 
                        className={`flex items-center justify-between p-3 rounded-xl ${index > 0 ? 'bg-white/5' : ''}`}
                      >
                        <span className="text-white font-medium text-sm w-16">
                          {formatDayName(day.date)}
                        </span>
                        <span className="text-2xl drop-shadow-lg">
                          {getWeatherIcon(day.weatherCode)}
                        </span>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="font-semibold">{day.maxTemp}°</span>
                          <span className="text-white/40">/</span>
                          <span className="text-white/60">{day.minTemp}°</span>
                        </div>
                        {day.precipitationProbability > 0 && (
                          <div className="flex items-center gap-1 text-white/50 text-xs">
                            <i className="ri-rainy-line" />
                            {day.precipitationProbability}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last updated */}
              {lastUpdated && (
                <p className="text-white/40 text-xs text-center">
                  {getLastUpdatedText()}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="px-4 mb-6">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm transition-colors py-2"
        >
          <i className="ri-arrow-left-line" />
          Voltar para o Guia
        </Link>
      </div>

      <PageFooter />
    </div>
  );
};

export default ClimaPage;
