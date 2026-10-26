(() => {
  let ownFullscreen=false;
  window.movieShowEnterLandscape=async fullscreen=>{
    if(fullscreen&&!document.fullscreenElement&&document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen();ownFullscreen=true;}catch{}}
    try{await screen.orientation?.lock?.('landscape');}catch{}
  };
  window.movieShowExitLandscape=()=>{
    try{screen.orientation?.unlock?.();}catch{}
    if(ownFullscreen&&document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}ownFullscreen=false;
  };
})();
