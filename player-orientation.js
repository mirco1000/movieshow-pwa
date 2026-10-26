(() => {
  let ownFullscreen=false,nativeVideo=null;
  window.movieShowEnterLandscape=async fullscreen=>{
    if(fullscreen){
      const videos=Array.from(document.querySelectorAll('video'));
      const video=videos.find(v=>!v.paused&&!v.ended)||videos.reverse().find(v=>v.currentSrc||v.src);
      if(video&&typeof video.webkitEnterFullscreen==='function'){
        try{video.webkitEnterFullscreen();nativeVideo=video;}catch{}
      }else if(!document.fullscreenElement&&document.documentElement.requestFullscreen){
        try{await document.documentElement.requestFullscreen();ownFullscreen=true;}catch{}
      }
    }
    try{await screen.orientation?.lock?.('landscape');}catch{}
  };
  window.movieShowExitLandscape=()=>{
    try{screen.orientation?.unlock?.();}catch{}
    if(nativeVideo?.webkitDisplayingFullscreen){try{nativeVideo.webkitExitFullscreen();}catch{}}nativeVideo=null;
    if(ownFullscreen&&document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}ownFullscreen=false;
  };
})();
