/* Restore visual preferences before first paint. External script for MV3 CSP. */
(() => {
  const properties = {
    clock_size: ['--custom-clock-size','rem'], name_size: ['--custom-name-size','rem'],
    headline_size: ['--custom-headline-size','rem'], search_height: ['--custom-search-height','px'],
    search_width: ['--custom-search-width','px'], search_radius: ['--custom-search-radius','px'],
    weather_size: ['--custom-weather-size','rem'], scene_scale: ['--custom-scene-scale','']
  };
  try {
    Object.entries(properties).forEach(([key,[property,unit]]) => {
      const value = localStorage.getItem('homepage_custom_' + key);
      if (value !== null && Number.isFinite(Number(value))) document.documentElement.style.setProperty(property,value + unit);
    });
  } catch { /* The homepage still works when storage is unavailable. */ }
})();
