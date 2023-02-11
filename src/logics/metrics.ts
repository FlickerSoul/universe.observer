import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'
import type { Metric } from 'web-vitals/src/types/base'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed(): string {
  return ((navigator as any)?.connection as any)?.effectiveType || ''
}

function sendToAnalytics(metric: Metric) {
  const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID

  if (!analyticsId) {
    console.warn('No analytics ID found')
    return
  }

  const body = {
    dsn: analyticsId, // qPgJqYH9LQX5o31Ormk8iWhCxZO
    id: metric.id, // v2-1653884975443-1839479248192
    page: window.location.pathname, // /blog/[slug]
    href: location.href, // https://my-app.vercel.app/blog/my-test
    event_name: metric.name, // TTFB
    value: metric.value.toString(), // 60.20000000298023
    speed: getConnectionSpeed(), // 4g
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: 'application/x-www-form-urlencoded',
  })
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
  }
}

export async function webVitals() {
  try {
    getFID(metric => sendToAnalytics(metric))
    getTTFB(metric => sendToAnalytics(metric))
    getLCP(metric => sendToAnalytics(metric))
    getCLS(metric => sendToAnalytics(metric))
    getFCP(metric => sendToAnalytics(metric))
  } catch (err) {
    console.error('[Analytics]', err)
  }
}
