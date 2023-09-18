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
