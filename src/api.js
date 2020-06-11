import { get } from "./utils";

export const api = {
    downloads: (jdkVersion = "") => get(`https://api.adoptopenjdk.net/v3/stats/downloads/total/${jdkVersion}`),
    tracking: ({ source, feature_version, jvm_impl, days, ...rest }) => get(`https://api.adoptopenjdk.net/v3/stats/downloads/tracking/`, { source, feature_version, jvm_impl, days, ...rest }),
    monthly: ({ source, feature_version, jvm_impl, ...rest }) => get(`https://api.adoptopenjdk.net/v3/stats/downloads/monthly/`, { source, feature_version, jvm_impl, ...rest })
};