import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-WXRC714X46';

export function initAnalytics() {
  ReactGA.initialize(MEASUREMENT_ID);
}

export function trackPageView(path) {
  ReactGA.send({ hitType: 'pageview', page: path });
}

export function trackEvent(name, params = {}) {
  ReactGA.event(name, params);
}
