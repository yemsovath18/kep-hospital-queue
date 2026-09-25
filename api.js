/**
 * ===================================================================
 * HospitalAPI - JSONP bridge for GitHub Pages
 * ===================================================================
 * These 3 static pages (index.html, staff.html, display.html) are
 * hosted on GitHub Pages, which cannot run Google Apps Script or
 * read/write the Google Sheet directly. Instead, every page loads
 * this file and calls HospitalAPI.<method>(...), which:
 *
 *   1. Builds a URL to the deployed Apps Script web app with
 *      ?api=1&action=<method>&callback=<uniqueName>&...params
 *   2. Injects a <script> tag pointing at that URL (JSONP) - this
 *      avoids the browser's CORS restrictions, since it's treated
 *      as loading a script, not a cross-origin XHR/fetch call.
 *   3. Apps Script's handleApiRequest_() replies with:
 *         uniqueName({...json result...});
 *      which runs immediately once the script loads, calling our
 *      registered callback function with the result.
 *   4. That resolves (or rejects) a Promise, so calling code can use
 *      HospitalAPI.getServiceTypesFull().then(function(services){...})
 *
 * IMPORTANT: replace DEPLOY_URL below if you ever redeploy the
 * Apps Script web app and get a new /exec URL.
 * ===================================================================
 */

var HospitalAPI = (function () {
  'use strict';

  var DEPLOY_URL = 'https://script.google.com/macros/s/AKfycbxCRXvqDsG9qHhl9QSu358Sggehtv1ocu0cG-fZVz34yUQjqzaIOlDVhegRmIAGQx7VNw/exec';
  var TIMEOUT_MS = 15000;
  var callbackCounter = 0;

  function jsonp(action, params) {
    return new Promise(function (resolve, reject) {
      callbackCounter++;
      var callbackName = 'hospitalApiCallback_' + Date.now() + '_' + callbackCounter;

      var script = document.createElement('script');
      var timeoutId = null;

      function cleanup() {
        if (timeoutId) clearTimeout(timeoutId);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = function (result) {
        cleanup();
        resolve(result);
      };

      var url = DEPLOY_URL + '?api=1&action=' + encodeURIComponent(action) + '&callback=' + callbackName;
      params = params || {};
      Object.keys(params).forEach(function (key) {
        var value = params[key];
        if (value === undefined || value === null) value = '';
        url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
      });

      script.src = url;
      script.onerror = function () {
        cleanup();
        reject(new Error('JSONP request failed for action: ' + action));
      };

      timeoutId = setTimeout(function () {
        cleanup();
        reject(new Error('JSONP request timed out for action: ' + action));
      }, TIMEOUT_MS);

      document.head.appendChild(script);
    });
  }

  return {
    getServiceTypes: function () {
      return jsonp('getServiceTypes');
    },
    getServiceTypesWithCounters: function () {
      return jsonp('getServiceTypesWithCounters');
    },
    getServiceTypesFull: function () {
      return jsonp('getServiceTypesFull');
    },
    createTicket: function (serviceType) {
      return jsonp('createTicket', { serviceType: serviceType });
    },
    getDisplayOverview: function () {
      return jsonp('getDisplayOverview');
    },
    getLatestCalled: function () {
      return jsonp('getLatestCalled');
    },
    getQueueData: function () {
      return jsonp('getQueueData');
    },
    getDisplayData: function () {
      return jsonp('getDisplayData');
    },
    callNextTicket: function (serviceType) {
      return jsonp('callNextTicket', { serviceType: serviceType });
    },
    updateTicketStatus: function (queueId, newStatus) {
      return jsonp('updateTicketStatus', { queueId: queueId, newStatus: newStatus });
    },
    getAudioManifest: function () {
      return jsonp('getAudioManifest');
    },
    getAudioData: function (key) {
      return jsonp('getAudioData', { key: key });
    }
  };
})();
