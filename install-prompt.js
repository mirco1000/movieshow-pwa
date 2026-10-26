(() => {
  const card=document.getElementById('install-card');
  const action=document.getElementById('install-action');
  const help=document.getElementById('install-help');
  const steps=document.getElementById('install-steps');
  const note=document.getElementById('install-note');
  const standalone=matchMedia('(display-mode: standalone)');
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const android=/Android/i.test(navigator.userAgent);
  let deferred=null,booted=false;
  function installed(){return standalone.matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;}
  function startApp(){
    if(booted)return;booted=true;card.hidden=true;card.style.pointerEvents='none';card.setAttribute('inert','');document.getElementById('loading').hidden=false;
    const script=document.createElement('script');script.src='flutter_bootstrap.js';script.async=true;
    script.onerror=()=>document.getElementById('boot-error').style.display='grid';document.body.append(script);
    setTimeout(()=>{if(document.getElementById('loading'))document.getElementById('boot-error').style.display='grid';},45000);
  }
  function exitApp(){window.close();window.location.replace('about:blank');}
  function instructions(){
    const lines=ios?['Touchez Partager dans Safari.','Choisissez « Sur l’écran d’accueil ».','Activez « Ouvrir comme app » si proposé, puis touchez Ajouter.','Ouvrez MovieShow depuis sa nouvelle icône.']:android?['Dans Chrome, ouvrez le menu ⋮.','Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».','Ouvrez MovieShow depuis sa nouvelle icône.']:['Dans le menu du navigateur, choisissez « Installer MovieShow » ou « Ajouter au Dock » si proposé.','Ouvrez MovieShow depuis sa nouvelle icône.'];
    steps.replaceChildren(...lines.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    note.textContent=!isSecureContext&&!ios?'L’installation complète sur Android nécessite une adresse HTTPS.':'MovieShow démarrera uniquement depuis son icône, sans barre d’adresse.';
    help.hidden=false;
  }
  addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event;});
  action.addEventListener('click',async()=>{
    if(!deferred){instructions();return;}
    const event=deferred;deferred=null;
    try{await event.prompt();const choice=await event.userChoice;if(choice.outcome==='dismissed'){exitApp();return;}installationDone();}
    catch{instructions();}
  });
  function installationDone(){document.getElementById('install-title').textContent='MovieShow est installé';note.textContent='Ouvrez MovieShow depuis sa nouvelle icône sur votre écran d’accueil.';steps.replaceChildren();help.hidden=false;action.hidden=true;}
  document.getElementById('install-exit').addEventListener('click',exitApp);
  addEventListener('appinstalled',installationDone);
  standalone.addEventListener('change',()=>{if(installed())startApp();});
  if(installed())startApp();
})();
