import { get } from "./utils";

export const api = {
    downloads: (jdkVersion = "") => get(`https://api.adoptopenjdk.net/v3/stats/downloads/total/${jdkVersion}`),
    tracking: ({ source, feature_version, docker_repo, ...rest }) => get(`https://api.adoptopenjdk.net/v3/stats/downloads/tracking/`, { source, feature_version, docker_repo, ...rest }),
};