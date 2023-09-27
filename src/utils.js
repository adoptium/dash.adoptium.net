export const get = async (url, params) => {
  const response = await fetch(url + stringify(params), {
    method: 'get'
  })

  if (response.status === 200) {
    return response.json()
  } else {
    return {}
  }
}

export const stringify = (obj = {}) => {
  if (Object.keys(obj).length === 0) return ''
  return '?' + Object.keys(obj).reduce(function (a, k) {
    if (obj[k] !== undefined) {
      a.push(k + '=' + encodeURIComponent(obj[k]))
    }
    return a
  }, []).join('&')
}

export const parse = query => {
  if (!query) {
    return {}
  }
  return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => { const [key, value] = param.split('='); params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''; return params }, {})
}

export const formatNum = number => {
  return number.toLocaleString(navigator.language)
}

export const secondLevelDrilldownSeriesDataToThirdLevel = (data) => {
  const mArch = new Map();
  const mOs = new Map();

  mArch.set('sources', []);
  mOs.set('sources', []);

  data.forEach((slddsd) => {
    const tokens = slddsd.name.split('_');
    // console.info("what = " + tokens[0]);
    // console.info("arch = " + tokens[1]);
    // console.info("os = " + tokens[2]);
    // console.info("hotspot = " + tokens[3]);
    // console.info("version = " + tokens[4]);

    if(tokens.length === 3 && tokens[0].endsWith("sources")) {
      mArch.get('sources').push(slddsd);
      mOs.get('sources').push(slddsd);
    } else if(tokens.length >= 5) {
      if(!mArch.has(tokens[1])) mArch.set(tokens[1], []);
      mArch.get(tokens[1]).push(slddsd);

      if(!mOs.has(tokens[2])) mOs.set(tokens[2], []);
      mOs.get(tokens[2]).push(slddsd);
    }
  });

  if(mArch.get('sources').length === 0) mArch.delete('sources');
  if(mOs.get('sources').length === 0) mOs.delete('sources');

  return {
    arch: Object.fromEntries(mArch),
    os: Object.fromEntries(mOs)
  };
}

export const toSecondAndThirdLevels = (data) => {
  const mArch = new Map();
  const mOs = new Map();

  mArch.set('sources', {name: 'Sources', id: 'sources', data: []});
  mOs.set('sources', {name: 'Sources', id: 'sources', data: []});

  data.forEach((slddsd) => {
    const tokens = slddsd.name.split('_');
    // console.info("what = " + tokens[0]);
    // console.info("arch = " + tokens[1]);
    // console.info("os = " + tokens[2]);
    // console.info("hotspot = " + tokens[3]);
    // console.info("version = " + tokens[4]);

    if(tokens.length === 3 && tokens[0].endsWith("sources")) {
      mArch.get('sources').data.push(slddsd);
      mOs.get('sources').data.push(slddsd);
    } else if(tokens.length >= 5) {
      if(!mArch.has(tokens[1])) mArch.set(tokens[1], {name: tokens[1], id: tokens[1], data: []});
      mArch.get(tokens[1]).data.push(slddsd);

      if(!mOs.has(tokens[2])) mOs.set(tokens[2], {name: tokens[1], id: tokens[1], data: []});
      mOs.get(tokens[2]).data.push(slddsd);
    }
  });

  if(mArch.get('sources').data.length === 0) mArch.delete('sources');
  if(mOs.get('sources').data.length === 0) mOs.delete('sources');

  return {
    arch: Object.fromEntries(mArch),
    os: Object.fromEntries(mOs)
  };
}
