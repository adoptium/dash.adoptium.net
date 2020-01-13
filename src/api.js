export const get = async (url, params) => {
    const response = await fetch(url + stringify(params), {
        method: 'get'
    });

    return response.json();
};

export const api={
        downloads:(jdkVersion="") => get(`https://api.adoptopenjdk.net/v3/stats/downloads/total/${jdkVersion}`),
        tracking:({source,feature_version, docker_repo,...rest})=>get(`https://api.adoptopenjdk.net/v3/stats/downloads/tracking/`,{source,feature_version, docker_repo,...rest}),
};

export const stringify = (obj={}) => {
    if(Object.keys(obj).length===0)return "";
    return '?' + Object.keys(obj).reduce(function (a, k) {
        if (obj[k] !== undefined) {
            a.push(k + '=' + encodeURIComponent(obj[k]));
        }
        return a;
    }, []).join('&');
}

export const parse = query => {
    if (!query) {
        return {};
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => { let [key, value] = param.split('='); params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''; return params; }, {});
};