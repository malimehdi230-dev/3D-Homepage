'use strict';

// A user-selected city provides weather without device location permission.
window.WeatherAccess = (() => {
  let dialog, pending, search;
  function city() {
    try {
      const value = JSON.parse(localStorage.getItem('homepage_weather_city'));
      return value && typeof value.name === 'string' && Number.isFinite(value.latitude) && Number.isFinite(value.longitude) ? value : null;
    } catch { return null; }
  }
  const enabled = () => localStorage.getItem('homepage_weather_enabled') === '1' && !!city();
  function changed() {
    document.dispatchEvent(new Event('weather-changed'));
    window.app?.initWeather();
  }
  function chooseCity() {
    window.app?.closeAllModals();
    if (pending) pending(false);
    const result = new Promise(resolve => { pending = resolve; });
    dialog.classList.add('active');
    document.getElementById('weatherCityInput').focus();
    return result;
  }
  function enable() {
    if (!city()) return chooseCity();
    localStorage.setItem('homepage_weather_enabled', '1'); changed();
    return Promise.resolve(true);
  }
  function disable() {
    localStorage.removeItem('homepage_weather_enabled');
    localStorage.removeItem('homepage_weather_cache');
    changed();
  }
  function position(success, failure) {
    const selected = city();
    if (!enabled() || !selected) { failure({ code: 1 }); return; }
    success({ coords:{ latitude:selected.latitude, longitude:selected.longitude } });
  }
  function init() {
    dialog = document.createElement('div');
    dialog.id = 'weatherCityModal'; dialog.className = 'modal-overlay';
    dialog.innerHTML = `<div class="modal" style="max-width:440px"><div class="modal-header"><h2 class="modal-title">Weather for your city</h2><button type="button" class="modal-close" data-modal="weatherCityModal" aria-label="Cancel city selection">×</button></div><p class="settings-section-desc">Choose a city for your forecast. Your search goes to Open-Meteo; your device location is not accessed.</p><form id="weatherCityForm"><label class="form-label" for="weatherCityInput">City name</label><div class="weather-city-search"><input type="text" class="form-input" id="weatherCityInput" placeholder="e.g. Karachi" autocomplete="off" required maxlength="100"><button type="submit" class="btn btn-primary">Find city</button></div></form><p id="weatherCityStatus" role="status"></p><div id="weatherCityResults"></div></div>`;
    dialog.querySelector('.modal').insertAdjacentHTML('beforeend', '<p class="weather-city-attribution">City data: <a href="https://www.geonames.org/" target="_blank" rel="noopener">GeoNames</a> via <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>.</p>');
    document.body.appendChild(dialog);
    new MutationObserver(() => {
      if (!dialog.classList.contains('active')) {
        search?.abort();
        if (pending) { pending(false); pending = null; }
      }
    }).observe(dialog,{attributes:true,attributeFilter:['class']});
    document.getElementById('weatherCityForm').onsubmit = async e => {
      e.preventDefault();
      const query = document.getElementById('weatherCityInput').value.trim();
      if (!query) return;
      search?.abort(); search = new AbortController();
      const controller = search;
      const timeout = setTimeout(() => controller.abort(),8000);
      const status = document.getElementById('weatherCityStatus');
      const results = document.getElementById('weatherCityResults');
      status.textContent = 'Finding cities…'; results.replaceChildren();
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,{signal:controller.signal});
        if (!response.ok) throw new Error('City search unavailable');
        const data = await response.json();
        if (controller !== search || !dialog.classList.contains('active')) return;
        const cities = (data.results || []).filter(c => Number.isFinite(c.latitude) && Number.isFinite(c.longitude));
        status.textContent = cities.length ? 'Choose the city you mean.' : 'No cities found. Try a nearby city or another spelling.';
        cities.forEach(c => {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'weather-city-result';
          button.textContent = [c.name,c.admin1,c.country].filter(Boolean).join(', ');
          button.onclick = () => {
            localStorage.setItem('homepage_weather_city',JSON.stringify({name:c.name,country:c.country || '',latitude:c.latitude,longitude:c.longitude}));
            localStorage.setItem('homepage_weather_enabled','1');
            localStorage.removeItem('homepage_weather_cache');
            if (pending) { pending(true); pending = null; }
            dialog.classList.remove('active'); changed();
          };
          results.appendChild(button);
        });
      } catch {
        if (search === controller && dialog.classList.contains('active')) status.textContent = 'Could not find cities. Check your connection and try again.';
      } finally { clearTimeout(timeout); }
    };
  }
  document.addEventListener('DOMContentLoaded',init);
  return { enabled, enable, disable, position, city, chooseCity };
})();
