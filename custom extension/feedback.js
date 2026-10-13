'use strict';
// Public endpoint works with each Chrome Web Store installation's own origin.
const FEEDBACK_API='https://3-d-parallax-backend.vercel.app/api/feedback';
const FB_GIVEN_KEY='homepage_feedback_given';
const FB_DRAFT_KEY='homepage_feedback_draft';
class FeedbackModule {
  constructor(){this.modal=null;this.nudge=null;this.isOpen=false;this._rating=null;this._payload=null;this._sending=false;this._sent=false;}
  init(){
    const overlay=document.createElement('div');overlay.id='feedbackOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','feedbackTitle');overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML=`<div id="feedbackModal">
      <div id="feedbackHeader"><span id="feedbackTitle">Share feedback</span><button id="feedbackClose" aria-label="Close feedback"><i class="fas fa-xmark" aria-hidden="true"></i></button></div>
      <div id="feedbackBody"><p class="feedback-intro">Tell us what worked, what didn’t, or what you’d like next.</p>
        <div class="fb-field"><span class="fb-label" id="feedbackCategoryLabel">Category</span><div id="feedbackTypes" role="group" aria-labelledby="feedbackCategoryLabel">
          <button class="fb-type-btn active" data-type="general" aria-pressed="true">General</button><button class="fb-type-btn" data-type="bug" aria-pressed="false">Bug report</button><button class="fb-type-btn" data-type="feature" aria-pressed="false">Feature request</button><button class="fb-type-btn" data-type="ui" aria-pressed="false">Design</button><button class="fb-type-btn" data-type="performance" aria-pressed="false">Performance</button><button class="fb-type-btn" data-type="praise" aria-pressed="false">Compliment</button>
        </div></div>
        <div class="fb-field"><span class="fb-label" id="feedbackRatingLabel">Your experience <span class="fb-optional">Optional</span></span><div class="feedback-rating-row"><div id="feedbackStars" role="group" aria-labelledby="feedbackRatingLabel">${[1,2,3,4,5].map(value=>`<button class="fb-star" data-value="${value}" aria-label="${value} ${value===1?'star':'stars'}" aria-pressed="false">★</button>`).join('')}</div><button id="clearFeedbackRating" class="fb-clear" hidden>Clear rating</button></div></div>
        <div class="fb-field"><label class="fb-label" for="feedbackMessage">Message</label><textarea id="feedbackMessage" placeholder="For a bug, include what you tried and what happened." maxlength="2000" rows="5" aria-describedby="feedbackCharCount"></textarea><span id="feedbackCharCount">0 / 2000</span></div>
      </div>
      <p class="feedback-privacy-note">Your message, category, optional rating, theme and version are sent when you submit. Feedback is saved privately for follow-up. <a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a> · <a id="feedbackSupportLink" href="https://github.com/malimehdi230-dev/3D-Homepage/issues/new" target="_blank" rel="noopener">Get support</a></p>
      <div id="feedbackFooter"><span id="feedbackStatus" role="status" aria-live="polite"></span><button id="feedbackSubmit"><i class="fas fa-paper-plane" aria-hidden="true"></i> Send feedback</button></div>
    </div>`;
    overlay.addEventListener('click',event=>{if(event.target===overlay)this.close();});document.body.append(overlay);this.modal=overlay;
    const trigger=document.createElement('button');trigger.id='feedbackTriggerBtn';trigger.innerHTML='<i class="fas fa-comment-dots" aria-hidden="true"></i><span>Feedback</span>';trigger.setAttribute('aria-label','Share feedback');trigger.title='Share feedback (F)';trigger.onclick=()=>this.open();document.body.append(trigger);
    document.getElementById('settingsFeedbackBtn')?.addEventListener('click',()=>{document.getElementById('settingsModal')?.classList.remove('active');setTimeout(()=>this.open(),150);});
    document.getElementById('feedbackClose').onclick=()=>this.close();
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&this.isOpen)this.close();if(this.isOpen&&(event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();this._submit();}});
    document.getElementById('feedbackTypes').onclick=event=>{const button=event.target.closest('[data-type]');if(!button||this._sending||this._sent)return;this._chooseType(button.dataset.type);this._changed();};
    for(const star of document.querySelectorAll('.fb-star')){
      star.onclick=()=>{if(!this._sending&&!this._sent){this._setRating(Number(star.dataset.value));this._changed();}};
      star.onmouseenter=()=>{if(!this._sending&&!this._sent)document.querySelectorAll('.fb-star').forEach(item=>item.classList.toggle('hovered',Number(item.dataset.value)<=Number(star.dataset.value)));};
      star.onmouseleave=()=>document.querySelectorAll('.fb-star').forEach(item=>item.classList.remove('hovered'));
    }
    document.getElementById('clearFeedbackRating').onclick=()=>{this._setRating(null);this._changed();};
    document.getElementById('feedbackMessage').oninput=()=>{document.getElementById('feedbackCharCount').textContent=document.getElementById('feedbackMessage').value.length+' / 2000';this._changed();};
    document.getElementById('feedbackSubmit').onclick=()=>this._submit();
    this._restoreDraft();
  }
  _chooseType(type){document.querySelectorAll('.fb-type-btn').forEach(button=>{const chosen=button.dataset.type===type;button.classList.toggle('active',chosen);button.setAttribute('aria-pressed',String(chosen));});}
  _setRating(value){this._rating=value;document.querySelectorAll('.fb-star').forEach(star=>{star.classList.toggle('selected',Number(star.dataset.value)<=value);star.setAttribute('aria-pressed',String(Number(star.dataset.value)===value));});document.getElementById('clearFeedbackRating').hidden=!value;}
  _getRating(){return this._rating;}
  _changed(){this._payload=null;this._saveDraft();document.getElementById('feedbackStatus').textContent='';}
  _saveDraft(){try{sessionStorage.setItem(FB_DRAFT_KEY,JSON.stringify({message:document.getElementById('feedbackMessage').value,type:document.querySelector('.fb-type-btn.active').dataset.type,rating:this._rating,payload:this._payload}));}catch{}}
  _restoreDraft(){
    try{const draft=JSON.parse(sessionStorage.getItem(FB_DRAFT_KEY)||'null');if(!draft||typeof draft.message!=='string'||draft.message.length>2000)return;
      document.getElementById('feedbackMessage').value=draft.message;document.getElementById('feedbackCharCount').textContent=draft.message.length+' / 2000';
      const type=['general','bug','feature','ui','performance','praise'].includes(draft.type)?draft.type:'general';this._chooseType(type);this._setRating(Number.isInteger(draft.rating)&&draft.rating>=1&&draft.rating<=5?draft.rating:null);
      const payload=draft.payload;if(payload?.message===draft.message.trim()&&payload.type===type&&payload.rating===this._rating&&/^[0-9a-f-]{36}$/i.test(payload.submission_id))this._payload=payload;
    }catch{}
  }
  _lock(value){this.modal.querySelectorAll('#feedbackBody button,#feedbackBody textarea').forEach(element=>element.disabled=value);}
  async _submit(){
    if(this._sent){this.close();return;}if(this._sending)return;
    if(window.ExtensionService&&!ExtensionService.enabled('feedbackEnabled')){window.toast?.('Feedback is temporarily unavailable. You can use the support link.','info');return;}
    const message=document.getElementById('feedbackMessage').value.trim(),status=document.getElementById('feedbackStatus'),button=document.getElementById('feedbackSubmit');
    if(Array.from(message).length<3){status.textContent='Please write at least 3 characters.';status.classList.add('error');document.getElementById('feedbackMessage').focus();return;}
    this._payload||={submission_id:crypto.randomUUID(),message,type:document.querySelector('.fb-type-btn.active').dataset.type,rating:this._rating,theme:document.body.dataset.template||localStorage.getItem('homepage_template')||'unknown',version:globalThis.chrome?.runtime?.getManifest?.()?.version||'2.5.0',timestamp:new Date().toISOString()};
    this._saveDraft();this._sending=true;this._lock(true);button.disabled=true;button.innerHTML='<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';status.textContent='';status.classList.remove('error');
    try{
      const response=await fetch(FEEDBACK_API,{method:'POST',credentials:'omit',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json'},body:JSON.stringify(this._payload)});
      if(response.status===429)throw new Error('Please wait a minute before sending again. Your draft is kept.');
      if(response.status===404)throw new Error('The feedback service is unavailable. Your draft is kept.');
      const data=await response.json().catch(()=>null);if(!data)throw new Error('The service returned an unexpected response. Your draft is kept.');
      if(!response.ok||data.success!==true)throw new Error(data.error||'Could not save feedback. Please try again.');
      this._sent=true;this._payload=null;try{sessionStorage.removeItem(FB_DRAFT_KEY);}catch{}
      localStorage.setItem(FB_GIVEN_KEY,'true');button.textContent='Done';status.textContent='Thank you! Your feedback has been received.';
      if(data.id&&/^[0-9a-f-]{36}$/i.test(data.id)){const reference=document.createElement('small');reference.className='feedback-sent-reference';reference.textContent='Reference: '+data.id;status.append(reference);}
    }catch(error){status.textContent=error.name==='TimeoutError'||error.name==='TypeError'?'Could not reach the service. Your draft is kept; try again when you’re online.':error.message;status.classList.add('error');if(error.message?.startsWith('This submission changed')){this._payload=null;this._saveDraft();}button.innerHTML='<i class="fas fa-paper-plane" aria-hidden="true"></i> Try again';}
    finally{this._sending=false;button.disabled=false;this._lock(this._sent);}
  }
  _reset(){this._sent=false;this._payload=null;this._lock(false);document.getElementById('feedbackMessage').value='';document.getElementById('feedbackCharCount').textContent='0 / 2000';document.getElementById('feedbackStatus').textContent='';document.getElementById('feedbackStatus').classList.remove('error');document.getElementById('feedbackSubmit').innerHTML='<i class="fas fa-paper-plane" aria-hidden="true"></i> Send feedback';this._chooseType('general');this._setRating(null);}
  open(){if(this.isOpen||window.ExtensionService&&!ExtensionService.enabled('feedbackEnabled'))return;this._opener=document.activeElement;this.modal.classList.add('open');this.modal.setAttribute('aria-hidden','false');this.isOpen=true;if(window.ExtensionService)document.getElementById('feedbackSupportLink').href=ExtensionService.config().supportUrl;requestAnimationFrame(()=>{if(this.isOpen)(this._sent?document.getElementById('feedbackSubmit'):document.getElementById('feedbackMessage')).focus();});}
  close(){this.modal.classList.remove('open');this.modal.setAttribute('aria-hidden','true');this.isOpen=false;if(this._sent)this._reset();this._opener?.isConnected&&this._opener.focus();}
  toggle(){this.isOpen?this.close():this.open();}
}
window.Feedback=new FeedbackModule();
