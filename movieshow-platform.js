(() => {
  const jobs=new Map();
  const key=id=>new URL(`offline-media/${encodeURIComponent(id)}`,document.baseURI).href;
  window.movieShowDownload=async(id,url,onProgress)=>{
    const controller=new AbortController();jobs.set(id,controller);
    try {
      const response=await fetch(url,{signal:controller.signal});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      if(/mpegurl/i.test(response.headers.get('content-type')||'')||/\.m3u8(?:[?&]|$)/i.test(url))throw new Error('Le téléchargement hors ligne nécessite un fichier vidéo direct.');
      const total=Number(response.headers.get('content-length'))||0;
      const reader=response.body.getReader();let received=0;
      const stream=new ReadableStream({async pull(c){
        try {const {done,value}=await reader.read();if(done){c.close();return;}received+=value.length;onProgress(received,total);c.enqueue(value);}
        catch(error){c.error(error);}
      },cancel(){return reader.cancel();}});
      const cache=await caches.open('movieshow-media-v1');
      await cache.put(key(id),new Response(stream,{headers:{'Content-Type':response.headers.get('content-type')||'video/mp4'}}));
    } finally {if(jobs.get(id)===controller)jobs.delete(id);}
  };
  window.movieShowAbort=id=>jobs.get(id)?.abort();
  window.movieShowDeleteDownload=async id=>(await caches.open('movieshow-media-v1')).delete(key(id));
  window.movieShowDownloadUrl=async id=>{
    const response=await (await caches.open('movieshow-media-v1')).match(key(id));
    return response?URL.createObjectURL(await response.blob()):null;
  };
})();
