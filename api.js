/* Hospital Queue System - GitHub Pages API bridge
 * This file replaces google.script.run when the UI is hosted on GitHub Pages.
 * The Google Apps Script Web App remains the backend/database API.
 */
const GAS_API_URL =
  'https://script.google.com/macros/s/AKfycbxCRXvqDsG9qHhl9QSu358Sggehtv1ocu0cG-fZVz34yUQjqzaIOlDVhegRmIAGQx7VNw/exec';

function apiCall(action, params, onSuccess, onFailure) {
  params = params || {};
  const callbackName = '__gas_cb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  const script = document.createElement('script');

  let finished = false;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
    if (script.parentNode) script.parentNode.removeChild(script);
  };

  window[callbackName] = function (data) {
    cleanup();
    if (typeof onSuccess === 'function') onSuccess(data);
  };

  script.onerror = function () {
    cleanup();
    if (typeof onFailure === 'function') {
      onFailure(new Error('Cannot connect to Google Apps Script API.'));
    }
  };

  const query = new URLSearchParams();
  query.set('api', '1');
  query.set('action', action);
  query.set('callback', callbackName);
  query.set('_', Date.now().toString());

  Object.keys(params).forEach(function (key) {
    const value = params[key];
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  script.src = GAS_API_URL + '?' + query.toString();
  document.head.appendChild(script);
}
