import { get } from './utils'

export const api = {
  downloads: (jdkVersion = '') => get(`https://api.adoptium.net/v3/stats/downloads/total/${jdkVersion}`),
  // eslint-disable-next-line camelcase
  tracking: ({ source, feature_version, jvm_impl, days, ...rest }) => get('https://api.adoptium.net/v3/stats/downloads/tracking/', { source, feature_version, jvm_impl, days, ...rest }),
  // eslint-disable-next-line camelcase
  monthly: ({ source, feature_version, jvm_impl, ...rest }) => get('https://api.adoptium.net/v3/stats/downloads/monthly/', { source, feature_version, jvm_impl, ...rest })
}
