import {redditModifications} from './content-reddit.js'


window.addEventListener('keydown',function(event){
  if(event.shiftKey){
    chrome.runtime.sendMessage({type: 'shiftDown'}, function(){});
  }
});

window.addEventListener('keyup',function(event){
  if (event.key.toLocaleLowerCase() === 'shift') {
    chrome.runtime.sendMessage({type: 'shiftUp'}, () => {});
  }
});

(function () {
  let isReddit = false
  jQuery(document).ready(() => {
    const matches = window.location.href.match(/^https?:\/\/[^/]*(reddit\.com|reveddit\.com|localhost)/)
    if (matches) {
      isReddit = matches[1] === 'reddit.com'
    }
    if (isReddit) {
      redditModifications()
    }
  })
})();
