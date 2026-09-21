/* LOOKOUT shared voice input */
(function(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let activeButton = null;
  let activeInput = null;
  let listening = false;

  if (SR) {
    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';

    recognition.onstart = function(){
      listening = true;
      activeButton?.classList.add('voice-listening');
      if(activeButton) activeButton.textContent = '⏹';
    };
    recognition.onresult = function(e){
      const text = e.results?.[0]?.[0]?.transcript?.trim() || '';
      if(activeInput && text){
        const old = activeInput.value.trim();
        activeInput.value = old ? old + ' ' + text : text;
        activeInput.dispatchEvent(new Event('input',{bubbles:true}));
      }
    };
    recognition.onerror = function(e){ console.warn('LOOKOUT voice:', e.error); };
    recognition.onend = function(){
      listening = false;
      activeButton?.classList.remove('voice-listening');
      if(activeButton) activeButton.textContent = '🎤';
      activeButton = null;
      activeInput = null;
    };
  }

  window.startVoiceInput = function(button, inputId){
    const input = document.getElementById(inputId);
    if(!input) return;
    if(!recognition){ alert('Voice recognition is not supported in this browser. Use Microsoft Edge or Google Chrome.'); return; }
    if(listening){ recognition.stop(); return; }
    activeButton = button;
    activeInput = input;
    try { recognition.start(); } catch(e) { console.warn(e); }
  };

  function addButton(input){
    if(!input || input.dataset.voiceAttached === '1') return;
    input.dataset.voiceAttached = '1';
    const wrap = document.createElement('div');
    wrap.className = 'lookout-voice-wrap';
    input.parentNode.insertBefore(wrap,input);
    wrap.appendChild(input);
    const btn = document.createElement('button');
    btn.type='button';
    btn.className='voice-input-btn';
    btn.textContent='🎤';
    btn.title='Voice input';
    btn.setAttribute('aria-label','Voice input');
    btn.addEventListener('click',()=>window.startVoiceInput(btn,input.id));
    wrap.appendChild(btn);
  }

  function scan(){
    ['generatorPrompt','editPrompt','ragQuestion'].forEach(id=>addButton(document.getElementById(id)));
  }
  window.LookOutVoice = {scan, stop:()=>recognition?.stop()};
  new MutationObserver(scan).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',scan);
})();
