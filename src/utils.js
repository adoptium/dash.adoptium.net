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

export const splitDrilldownSeriesByArtifacts = (data) => {
  const mArtifacts = new Map()

  data.forEach((entry) => {
    const { artifact, name } = getArtifactAndFormattedName(entry)

    if (artifact !== undefined && name !== undefined) {
      // add a name field
      entry.name = name

      if (!mArtifacts.has(artifact)) mArtifacts.set(artifact, { name: artifact, id: artifact, data: [] })

      mArtifacts.get(artifact).data.push(entry)
    }
  })

  return {
    artifacts: Object.fromEntries(mArtifacts)
  }
}

/**
 * what = tokens[0]
 * arch = tokens[1]
 * os =  tokens[2]
 * hotspot = tokens[3]
 * version = tokens[4]
 */
const getArtifactAndFormattedName = (entry) => {
  const tokens = entry.name.split('_')

  if (tokens.length > 0 && tokens[0].endsWith('sources')) {
    return { artifact: 'sources', name: 'sources' }
  } else if (tokens.length >= 5) {
    const artifact = tokens[0].slice(tokens[0].indexOf('-') + 1)
    const name = entry.name.endsWith('.msi')
      ? `${capitalizeFirst(tokens[2])} (${capitalizeFirst(tokens[1])} / installer)`
      : `${capitalizeFirst(tokens[2])} (${capitalizeFirst(tokens[1])})`

    return { artifact, name }
  } else {
    // this should not append
    return { artifact: undefined, name: undefined }
  }
}

const capitalizeFirst = (text) => {
  return text[0].toUpperCase() + text.substring(1)
}
