const regex_pc = /^\/(r|user)\/([^/]+)\/comments\/([^/]+)\/[^/]*(?:\/([^/?&#]+))?/
const regex_user = /^\/(?:user|y|u)\/([^/?&#]+)\/?/

export const getFullIDsFromPath = (path) => {
    let postID = undefined, commentID = undefined, user = undefined, subreddit = undefined
    const matches_pc = path.match(regex_pc)
    const matches_user = path.match(regex_user)
    if (matches_pc) {
        const type = matches_pc[1]
        if (type === 'user') {
            subreddit = 'u_' + matches_pc[2]
        } else {
            subreddit = matches_pc[2]
        }
        if (matches_pc[3]) postID = 't3_'+matches_pc[3]
        if (matches_pc[4]) commentID = 't1_'+matches_pc[4]
    } else if (matches_user) {
        user = matches_user[1]
    }
    return [postID, commentID, subreddit]
}

// because archive.is & older iOS safari versions do not support URLSearchParams
export class SimpleURLSearchParams {
  //?removal_status=all
  constructor(search = undefined) {
    const params = {}
    if (search !== undefined) {
      search.replace(/^\?/,'').split('&').forEach(kv => {
        const [key, value] = kv.split('=')
        if (key) {
          params[key] = value
        }
      })
    }
    this.params = params
  }
  has(param) {
    return (param in this.params)
  }
  get(param) {
    if (param in this.params) {
      return decodeURIComponent(this.params[param])
    } else {
      return null
    }
  }
  removeBackslash(exclude = new Set()) {
    for (const key of Object.keys(this.params)) {
      let value = this.get(key)
      const newKey = key.replace(/\\|%5C/g, '')
      if (! exclude.has(newKey)) {
        value = value.replace(/\\|%5C/g, '')
      }
      if (key !== newKey) {
        this.delete(key)
      }
      this.set(newKey, value)
    }
    return this
  }
  set(param, value) {
    this.params[param] = encodeURIComponent(value).replace(/[!()*]/g, escape)
    return this
  }
  setParams(params) {
    Object.entries(params).forEach(([k, v]) => this.set(k, v))
    return this
  }
  delete(param) {
    delete this.params[param]
    return this
  }
  toString() {
    let queryVals = []
    for (var key in this.params) {
        queryVals.push(key+'='+this.params[key])
    }
    if (queryVals.length) {
      const search = queryVals.join('&')
      const extraAMP = search.slice(-1) === '.' ? '&' : ''
      return '?'+search+extraAMP
    } else {
      return ''
    }
  }
}
