/* Public destinations shared by the homepage and toolbar popup. */
(() => {
  const store = 'https://chromewebstore.google.com/detail/3d-parallax/cgodhedchgcogoicfmdpgfopbfkcafkn';
  window.ExtensionLinks = Object.freeze({ store, reviews: store + '/reviews', groqApi: 'https://console.groq.com/keys' });
  const manifest = globalThis.chrome?.runtime?.getManifest?.();
  window.ExtensionVersion = manifest ? Promise.resolve(manifest.version)
    : fetch('manifest.json').then(response => response.ok ? response.json() : null).then(value => value?.version || null).catch(() => null);
  document.addEventListener('DOMContentLoaded', () => {
    const groq = document.getElementById('getGroqApiLink');
    if (groq && globalThis.chrome?.tabs?.create) groq.addEventListener('click', event => {
      event.preventDefault(); chrome.tabs.create({ url: ExtensionLinks.groqApi });
    });
    ExtensionVersion.then(version => {
      if (version && document.getElementById('settingsVersion')) document.getElementById('settingsVersion').textContent = '3D Parallax v' + version;
    });
  });
  window.openExtensionReviews = () => {
    if (globalThis.chrome?.tabs?.create) chrome.tabs.create({ url: ExtensionLinks.reviews });
    else window.open(ExtensionLinks.reviews, '_blank', 'noopener,noreferrer');
  };
})();
