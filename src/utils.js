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

export const splitDrilldownSeriesByArchAndOs = (data) => {
  const mArch = new Map()
  const mOs = new Map()

  mArch.set('sources', { name: 'Sources', id: 'sources', data: [] })
  mOs.set('sources', { name: 'Sources', id: 'sources', data: [] })

  data.forEach((slddsd) => {
    const tokens = slddsd.name.split('_')
    // console.info("what = " + tokens[0]);
    // console.info("arch = " + tokens[1]);
    // console.info("os = " + tokens[2]);
    // console.info("hotspot = " + tokens[3]);
    // console.info("version = " + tokens[4]);

    slddsd.name = getFormattedName(tokens)

    if (tokens.length === 3 && tokens[0].endsWith('sources')) {
      mArch.get('sources').data.push(slddsd)
      mOs.get('sources').data.push(slddsd)
    } else if (tokens.length >= 5) {
      if (!mArch.has(tokens[1])) mArch.set(tokens[1], { name: tokens[1], id: tokens[1], data: [] })

      mArch.get(tokens[1]).data.push(slddsd)

      if (!mOs.has(tokens[2])) mOs.set(tokens[2], { name: tokens[1], id: tokens[1], data: [] })
      mOs.get(tokens[2]).data.push(slddsd)
    }
  })

  if (mArch.get('sources').data.length === 0) mArch.delete('sources')
  if (mOs.get('sources').data.length === 0) mOs.delete('sources')

  return {
    arch: Object.fromEntries(mArch),
    os: Object.fromEntries(mOs)
  }
}

const getFormattedName = (tokens) => {
  if (tokens.length === 3 && tokens[0].endsWith('sources')) return 'sources'
  else if (tokens.length >= 5) {
    let afterCarret = tokens[0].slice(tokens[0].indexOf('-') + 1)
    if (afterCarret === 'jre') afterCarret = 'JRE'
    else if (afterCarret === 'jdk') afterCarret = 'JDK'

    return `${capitalizeFirst(tokens[2])} (${capitalizeFirst(afterCarret)})`
  } else return tokens.join('_')
}

const capitalizeFirst = (text) => {
  return text[0].toUpperCase() + text.substring(1)
}
