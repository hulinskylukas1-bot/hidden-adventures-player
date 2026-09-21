function markSolvedUI(w,b){
 const resp=state.responses?.[b.id],cfg=b.config||{};
 w.classList.add('solved');
 const input=w.querySelector('input');
 if(input){
   if(resp?.kind==='text')input.value=resp.value||'';
   input.disabled=true;
 }
 w.querySelectorAll('button').forEach(x=>x.disabled=true);
 if(resp?.kind==='choice'){
   w.querySelectorAll('.choice').forEach(btn=>{if(String(btn.dataset.value)===String(resp.value))btn.classList.add('selected')});
 }
 if(b.block_type==='quiz'){
   Object.entries(state.quizAnswers||{}).forEach(([key,oi])=>{
     const prefix=`${b.id}:`;
     if(!key.startsWith(prefix))return;
     const qi=Number(key.slice(prefix.length));
     const box=w.querySelector(`.quizq[data-q="${qi}"]`);
     if(!box)return;
     box.querySelectorAll('.quizopt').forEach(x=>x.disabled=true);
     const btn=box.querySelector(`.quizopt[data-i="${Number(oi)}"]`);
     if(btn)btn.classList.add('selected');
     const rr=box.querySelector('.result'); if(rr)rr.textContent='Správně.';
   });
 }
 if(resp?.kind==='text'){
   const r=w.querySelector('.result'); if(r)r.textContent='Správně.';
 }
 if(resp?.kind==='confirm'){
   const r=w.querySelector('.result'); if(r)r.textContent='';
 }
 if(resp?.kind==='photo'){
   const r=w.querySelector('.result'); if(r)r.textContent=`Fotografie uložena${resp.value?.file_name?`: ${resp.value.file_name}`:''}.`;
 }
 if(resp?.kind==='gps'){
   const r=w.querySelector('.result'); if(r)r.textContent=resp.value?.validated===false?'Poloha zaznamenána; cílové souřadnice ještě nejsou nastavené.':'Poloha potvrzena.';
 }
}
function renderSavedUntil(target){
 const blocks=data.stages[stageIndex].blocks||[];
 cursor=0;
 while(cursor<target&&cursor<blocks.length){
   const b=blocks[cursor];
   if(b.block_type==='conditional_message'){
     const required=b.config?.when?.choice;
     if(required&&norm(required)!==norm(state.lastChoice)){cursor++;continue}
   }
   appendBlock(b);
   const last=document.querySelector('#feed .reveal:last-child');
   if(interactive(b.block_type)&&state.solved?.[b.id])markSolvedUI(last,b);
   cursor++;
 }
}
function revealUntilStop(){
 const st=data.stages[stageIndex], blocks=st.blocks||[];
 document.getElementById('continueBar').classList.add('hidden');
 while(cursor<blocks.length){
   const b=blocks[cursor];
   if(b.block_type==='conditional_message'){
     const required=b.config?.when?.choice;
     if(required && norm(required)!==norm(state.lastChoice)){ cursor++; continue; }
   }
   appendBlock(b); visible.push(b.id);
   if(interactive(b.block_type)){waiting=true;return}
   cursor++;
 }
 document.getElementById('continueBar').classList.remove('hidden');
 document.getElementById('continueBtn').textContent=stageIndex<(data.stages.length-1)?'Pokračovat':'Dokončit ukázku';
}
async function advance(){
 if(waiting)return;
 if(stageIndex<data.stages.length-1){
   const nextStage=stageIndex+1;
   try{
     await persistProgress(null,'stage_advance',{from_stage:stageIndex,to_stage:nextStage},nextStage,0);
     stageIndex=nextStage;cursor=0;visible=[];waiting=false;
     document.querySelector('.progress').textContent=`${stageIndex+1} / ${data.stages.length}`;
     revealUntilStop();
   }catch(e){showSyncNotice('Nepodařilo se uložit přesun. Zkuste znovu.')}
 } else alert('Konec aktuální ukázky Spiknutí.');
}

async function applyRemoteProgress(force=false){
 if(!session||applyingRemote||!data)return;
 applyingRemote=true;
 try{
   const {data:remote,error}=await rpc('get_session_progress',{p_session_token:session.session_token});
   if(error||!remote)return;
   const rev=Number(remote.revision||0);
   if(!force&&rev<=Number(session.revision||0))return;

   session.revision=rev;
   const rs=remote.state||{};
   const remoteStage=Number.isInteger(rs.stageIndex)?rs.stageIndex:0;
   const remoteCursor=Number.isInteger(rs.cursor)?rs.cursor:0;

   state.lastChoice=rs.lastChoice??state.lastChoice;
   state.choices=rs.choices||state.choices;
   state.solved=rs.solved||state.solved;
   state.responses=rs.responses||state.responses;
   state.quizAnswers=rs.quizAnswers||state.quizAnswers;

   stageIndex=Math.max(0,Math.min(remoteStage,data.stages.length-1));
   cursor=Math.max(0,remoteCursor);
   waiting=false;
   visible=[];

   shell();
   const target=cursor;
   renderSavedUntil(target);

   const blocks=data.stages[stageIndex].blocks||[];
   if(cursor<blocks.length){
     const current=blocks[cursor];
     if(current?.block_type==='quiz'){
       appendBlock(current);
       waiting=true;
     }else{
       revealUntilStop();
     }
   }else{
     revealUntilStop();
   }

   showSyncNotice('Postup byl aktualizován z jiného zařízení.');
 } finally {applyingRemote=false}
}
function showSyncNotice(msg){
 let n=document.getElementById('syncNotice');
 if(!n){n=document.createElement('div');n.id='syncNotice';n.className='sync-notice';document.body.appendChild(n)}
 n.textContent=msg;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),2200);
}
function setupSync(){
 if(syncTimer) clearInterval(syncTimer);
 showSyncNotice('Zařízení je synchronizované.');
 syncTimer=setInterval(()=>applyRemoteProgress(),900);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)applyRemoteProgress()},{passive:true});
}
function exitGame(){
 if(syncTimer){clearInterval(syncTimer);syncTimer=null}
 localStorage.removeItem(SESSION_KEY);
 session=null; data=null; stageIndex=0; cursor=0; visible=[]; waiting=false;
 state.lastChoice=null; state.choices={}; state.solved={}; state.responses={}; state.quizAnswers={};
 entry();
}
async function boot(code){
 root.innerHTML=`<div class="shell"><div class="top"><div class="brand">HIDDEN ADVENTURES</div><button id="cancelLoad" class="exitGameBtn" type="button">Jiný kód</button></div><section class="case"><div class="casehead"><h1>Spiknutí</h1></div><div class="bubble">Načítám rozehranou hru…</div></section></div>`;
 const cancelLoad=document.getElementById('cancelLoad'); if(cancelLoad)cancelLoad.onclick=exitGame;
 const {data:ss,error:se}=await rpc('start_or_resume_game',{p_code:code,p_device_token:deviceToken}); if(se)throw se;
 session={...ss,code,revision:Number(ss.revision||0)}; localStorage.setItem(SESSION_KEY,JSON.stringify({token:ss.session_token,code}));
 const {data:d,error}=await rpc('get_game_preview',{p_slug:'spiknuti',p_locale:'cs'}); if(error)throw error; data=d;
 const saved=ss.state||{}; if(Number.isInteger(saved.stageIndex))stageIndex=Math.max(0,Math.min(saved.stageIndex,data.stages.length-1)); if(Number.isInteger(saved.cursor))cursor=Math.max(0,saved.cursor);
 state.lastChoice=saved.lastChoice??null; state.choices=saved.choices||{}; state.solved=saved.solved||{}; state.responses=saved.responses||{}; state.quizAnswers=saved.quizAnswers||{};
 waiting=false; visible=[]; shell(); const target=cursor; renderSavedUntil(target); revealUntilStop(); setupSync();
}
function entry(){
 root.innerHTML=`<div class="shell"><section class="case"><div class="casehead"><h1>Spiknutí</h1></div><div class="bubble task"><div class="text">Zadejte kód hry</div><div class="answer"><input id="gameCode" value="" placeholder="Kód hry" autocomplete="off" autocapitalize="characters"><button id="startGame" class="btn">Vstoupit do hry</button></div><div id="entryError" class="result muted"></div></div></section></div>`;
 document.getElementById('startGame').onclick=async()=>{try{await boot(document.getElementById('gameCode').value)}catch(e){document.getElementById('entryError').textContent=e.message.includes('INVALID_GAME_CODE')?'Neplatný kód hry.':e.message.includes('DEVICE_LIMIT_REACHED')?'Tato hra už je připojena na maximálním počtu zařízení.':`Hru se nepodařilo otevřít: ${e.message}`}};
}
async function startup(){
 try{
   const saved=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
   if(saved?.code) await boot(saved.code); else entry();
 }catch(e){
   localStorage.removeItem(SESSION_KEY);
   entry();
   const box=document.getElementById('entryError');
   if(box)box.textContent=`Předchozí session se nepodařilo obnovit: ${e.message}`;
 }
}
startup();