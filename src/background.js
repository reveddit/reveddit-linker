const regex_site = /^https?:\/\/(?:[^.]+\.)?(re(?:ve)?ddit)\.com(.*)/
let shiftPressed = false;
const ACTION_API = __BUILT_FOR__ === 'chrome' ? 'action' : 'browserAction'

// from reveddit website utils.js
const PATHS_SUB = ['v','r']
const PATHS_USER = ['y','u','user']
const PATH_STR_SUB = '/'+PATHS_SUB[0]
const PATH_STR_USER = '/'+PATHS_USER[0]
const PATH_REDDIT_STR_SUB = '/r'
const PATH_REDDIT_STR_USER = '/user'

const convertPathPrefix = (path, searchPrefix, replacePrefix) => path.replace(new RegExp(`^${searchPrefix}/`), replacePrefix+'/')
const convertPathSubToReddit = (path) => convertPathPrefix(path, PATH_STR_SUB, PATH_REDDIT_STR_SUB)
const convertPathUserToReddit = (path) => convertPathPrefix(path, PATH_STR_USER, PATH_REDDIT_STR_USER)

const convertPathToReddit = (path) => convertPathSubToReddit(convertPathUserToReddit(path))

const updateTabURL = (url, tab) => {
  const matches = url.match(regex_site)
  if (matches) {
    let newUrl = 'https://www.reveddit.com'+matches[2]
    if (matches[1] === 'reveddit') {
      newUrl = 'https://www.reddit.com'+convertPathToReddit(matches[2])
    }
    if (! shiftPressed) {
      chrome.tabs.update({url: newUrl})
    } else {
      chrome.tabs.create({url: newUrl, index:tab.index+1})
    }
  }
  shiftPressed = false
}

chrome[ACTION_API].onClicked.addListener(tab => {
  updateTabURL(tab.url, tab)
})

const contextMenu_id = 'reveddit-link'
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: contextMenu_id,
    title: 'View on re(ve)ddit',
    contexts: ['link','page'],
    documentUrlPatterns: ['https://*.reddit.com/*', 'https://*.reveddit.com/*']
  })
})
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == contextMenu_id) {
    let url = info.pageUrl
    if (info.linkUrl) {
      url = info.linkUrl
    }
    updateTabURL(url, tab)
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  switch(request.type){
    case 'shiftDown':
      shiftPressed = true;
      break;
    case 'shiftUp':
      shiftPressed = false;
      break;
  }
  sendResponse({response: "done"})
});
