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
