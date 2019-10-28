const regex_site = /^https?:\/\/(?:[^.]+\.)?(rev?ddit)\.com/
const reddit_title = 'View on reddit'
let shiftPressed = false;

const updateTabURL = (url, tab) => {
  const matches = url.match(regex_site)
  if (matches) {
    let newUrl = url.replace('reddit.com', 'revddit.com')
    if (matches[1] === 'revddit') {
      newUrl = url.replace('revddit.com', 'reddit.com')
    }
    if (! shiftPressed) {
      chrome.tabs.update({url: newUrl})
    } else {
      chrome.tabs.create({url: newUrl, index:tab.index+1})
    }
  }
  shiftPressed = false
}

chrome.browserAction.onClicked.addListener(tab => {
  updateTabURL(tab.url, tab)
})

const contextMenu_id = 'revddit-link'
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: contextMenu_id,
    title: 'View on re(v)ddit',
    contexts: ['link','page'],
    documentUrlPatterns: ['https://*.reddit.com/*', 'https://*.revddit.com/*', 'https://*.reveddit.com/*']
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
