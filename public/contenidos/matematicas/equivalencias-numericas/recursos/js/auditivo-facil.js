(function(){
  const totalPaginas=6;
  let paginaActual=1;
  let audioActual=null;

  const fx={
    click:new Audio('/contenidos/matematicas/recursos/sonidos/click.mp3'),
    ding:new Audio('/contenidos/matematicas/recursos/sonidos/ding.mp3'),
    error:new Audio('/contenidos/matematicas/recursos/sonidos/error.mp3'),
    whoosh:new Audio('/contenidos/matematicas/recursos/sonidos/whoosh.mp3')
  };
  Object.values(fx).forEach((a)=>{a.volume=0.4;});

  const narrations={};
  function getNarration(path){ if(!narrations[path]) narrations[path]=new Audio(path); return narrations[path]; }

  const tracker=window.createReforzamientoTracker?window.createReforzamientoTracker({
    trackTime:false,
    contenidoId:6,
    nivel:'facil',
    estilo:'auditivo',
    detalleBase:{bloque:'equivalencias_numericas',motor:'auditivo_facil'},
    apartados:{
      aud_equiv_facil_p1:{pagina:1,apartadoClave:'aud_equiv_facil_p1',tipoActividad:'reforzamiento'},
      aud_equiv_facil_p2:{pagina:2,apartadoClave:'aud_equiv_facil_p2',tipoActividad:'reforzamiento'},
      aud_equiv_facil_p3:{pagina:3,apartadoClave:'aud_equiv_facil_p3',tipoActividad:'reforzamiento'},
      aud_equiv_facil_p4:{pagina:4,apartadoClave:'aud_equiv_facil_p4',tipoActividad:'reforzamiento'},
      aud_equiv_facil_p5:{pagina:5,apartadoClave:'aud_equiv_facil_p5',tipoActividad:'reforzamiento'},
      aud_equiv_facil_p6:{pagina:6,apartadoClave:'aud_equiv_facil_p6',tipoActividad:'reforzamiento'}
    }
  }):null;

  const session=window.createReforzamientoSessionTracker?window.createReforzamientoSessionTracker({
    contenidoId:6,
    nivel:'facil',
    estilo:'auditivo',
    detalleBase:{bloque:'equivalencias_numericas',motor:'auditivo_facil'}
  }):null;
  if(session) session.start();

  const pageStates={
    1:{solved:false,selected:null,wrong:false,feedback:null},
    2:{solved:false,selected:null,wrong:false,feedback:null},
    3:{solved:false,selected:null,wrong:false,feedback:null},
    4:{solved:false,selected:null,wrong:false,feedback:null},
    5:{solved:false,selected:null,wrong:false,feedback:null},
    6:{solved:false,order:null,slots:null,wrong:false,feedback:null}
  };
  const recordedPages={};

  function safePlay(audio){ try{audio.pause();audio.currentTime=0;const p=audio.play();if(p&&p.catch)p.catch(()=>{});}catch(_){} }
  function stopNarration(){ if(audioActual){audioActual.pause();audioActual.currentTime=0;audioActual=null;} document.querySelectorAll('.audio-btn').forEach((b)=>b.classList.remove('playing')); }
  function playNarration(path,btn){ safePlay(fx.click); stopNarration(); const audio=getNarration(path); audioActual=audio; btn.classList.add('playing'); const p=audio.play(); if(p&&p.catch)p.catch(()=>{}); audio.onended=function(){ btn.classList.remove('playing'); if(audioActual===audio) audioActual=null; }; }
  function sectionKey(page){ return 'aud_equiv_facil_p'+page; }
  function markVisible(page){ if(tracker) tracker.markPageVisibleByNumber(page,{motor:'auditivo_facil'}); }
  function registerError(page,detail){ if(tracker) tracker.addError(sectionKey(page),1,{ejercicio:detail||'principal'}); }
  function registerSolved(page){ if(recordedPages[page]) return; recordedPages[page]=true; if(tracker){ tracker.addCorrect(sectionKey(page),1,{ejercicio:'principal'}); tracker.complete(sectionKey(page),{detalle:{motor:'auditivo_facil',pagina:page,ejercicio:'principal'}}); } }
  function allSolved(){ return Object.values(pageStates).every((state)=>state.solved); }
  function updateQuizLock(){ const btn=document.getElementById('btnMiniQuiz'); if(btn) btn.classList.toggle('bloqueado',!allSolved()); }
  function showFeedback(ok,html){ const el=document.getElementById('feedback'); el.className='feedback show '+(ok?'ok':'err'); el.innerHTML=html; }
  function clearFeedback(){ const el=document.getElementById('feedback'); el.className='feedback'; el.innerHTML=''; }
  function setPageFeedback(page,ok,html){ pageStates[page].feedback={ok,html}; }
  function renderStoredFeedback(page){ const feedback=pageStates[page].feedback; if(feedback) showFeedback(feedback.ok,feedback.html); else clearFeedback(); }
  function shuffleDifferent(base,blocked){ if(base.length<=1) return base.slice(); let arr=base.slice(); const blockedSigs=blocked||[]; for(let t=0;t<30;t+=1){ for(let i=arr.length-1;i>0;i-=1){ const j=Math.floor(Math.random()*(i+1)); const tmp=arr[i]; arr[i]=arr[j]; arr[j]=tmp; } if(!blockedSigs.includes(arr.join('|'))) return arr.slice(); arr=base.slice(); } return base.slice().reverse(); }

  function chip(text,cls){ return `<span class="value-chip ${cls||''}">${text}</span>`; }
  function renderBottle(fill,total){ const count=total||10; let html='<div class="bottle-wrap"><div><div class="bottle-cap"></div><div class="bottle">'; for(let i=0;i<count;i+=1){ const isFill=i>=count-fill; html+=`<span class="bottle-cell${isFill?' fill':''}"></span>`; } return html+'</div></div></div>'; }
  function renderStrip(total,fill){ let html='<div class="strip-wrap"><div class="strip10">'; for(let i=0;i<total;i+=1){ html+=`<span class="cell${i<fill?' fill':''}"></span>`; } return html+'</div></div>'; }
  function renderGrid(fill){ let html='<div class="grid-wrap"><div class="hundred-grid">'; for(let i=0;i<100;i+=1){ html+=`<span class="grid-cell${i<fill?' fill':''}"></span>`; } return html+'</div></div>'; }
  function renderNumberLine(point){ const total=10,start=8,end=92; let marks=''; for(let i=0;i<=total;i+=1){ const left=start+((end-start)*i/total); const label=i===0?'0':(i===total?'1':''); marks+=`<div class="line-mark" style="left:${left}%"><span>${label}</span></div>`; } const pointLeft=start+((end-start)*point/total); return `<div class="line-wrap"><div class="line-track"></div>${marks}<div class="line-point" style="left:${pointLeft}%"></div></div>`; }
  function modelCard(title,visual,note){ return `<div class="model-card"><div class="model-title">${title}</div>${visual}${note?`<div class="model-note">${note}</div>`:''}</div>`; }

  const pages=[
    {
      title:'La unidad completa',
      lead:'Escucha la explicaci&oacute;n y mira cu&aacute;l modelo queda lleno por completo.',
      introAudio:'audios/equiv_facil_p1_intro.mp3',
      exerciseAudio:'audios/equiv_facil_p1_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Vaso entero',renderBottle(10),chip('1.0','gold'))}${modelCard('Medio vaso',renderBottle(5),chip('0.5','sky'))}${modelCard('Una parte',renderBottle(1),chip('0.1'))}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Modelos del reto</div><div class="hint-line">Busca el que est&aacute; lleno por completo.</div></div>`,
        choices:[
          {value:'whole',correct:true,html:`${renderBottle(10)}${chip('Tarjeta A')}`},
          {value:'seven',correct:false,html:`${renderBottle(7)}${chip('Tarjeta B')}`},
          {value:'five',correct:false,html:`${renderBottle(5)}${chip('Tarjeta C')}`},
          {value:'two',correct:false,html:`${renderBottle(2)}${chip('Tarjeta D')}`}
        ],
        ok:'&iexcl;Muy bien! Ese modelo representa 1.0.',
        err:'Observa otra vez cu&aacute;l modelo est&aacute; completo.'
      }
    },
    {
      title:'D&eacute;cimos en una barra',
      lead:'Escucha la explicaci&oacute;n y mira c&oacute;mo una barra de 10 partes puede leerse como decimal.',
      introAudio:'audios/equiv_facil_p2_intro.mp3',
      exerciseAudio:'audios/equiv_facil_p2_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Barra ejemplo',renderStrip(10,4),chip('0.4'))}${modelCard('Otra barra',renderStrip(10,8),chip('0.8','gold'))}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Decimal del reto</div><div class="text-center">${chip('0.6')}</div></div>`,
        choices:[
          {value:'3',correct:false,html:`${renderStrip(10,3)}${chip('Tarjeta A')}`},
          {value:'6',correct:true,html:`${renderStrip(10,6)}${chip('Tarjeta B')}`},
          {value:'8',correct:false,html:`${renderStrip(10,8)}${chip('Tarjeta C')}`},
          {value:'10',correct:false,html:`${renderStrip(10,10)}${chip('Tarjeta D')}`}
        ],
        ok:'&iexcl;Correcto! Seis de diez partes se leen como 0.6.',
        err:'Cuenta cu&aacute;ntas partes de diez est&aacute;n coloreadas.'
      }
    },
    {
      title:'Cent&eacute;simos en una cuadr&iacute;cula',
      lead:'Escucha la explicaci&oacute;n y observa c&oacute;mo los cent&eacute;simos se leen en una cuadr&iacute;cula de 100.',
      introAudio:'audios/equiv_facil_p3_intro.mp3',
      exerciseAudio:'audios/equiv_facil_p3_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Cuadr&iacute;cula ejemplo',renderGrid(25),chip('0.25','gold'))}${modelCard('Otra lectura',renderGrid(57),chip('0.57','sky'))}</div>`,
      activity:{
        type:'choice',
        layoutClass:'full-grid',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Decimal del reto</div><div class="text-center">${chip('0.43')}</div></div>`,
        choices:[
          {value:'43',correct:true,html:`${renderGrid(43)}${chip('Tarjeta A')}`},
          {value:'25',correct:false,html:`${renderGrid(25)}${chip('Tarjeta B')}`},
          {value:'57',correct:false,html:`${renderGrid(57)}${chip('Tarjeta C')}`},
          {value:'34',correct:false,html:`${renderGrid(34)}${chip('Tarjeta D')}`}
        ],
        ok:'&iexcl;Bien hecho! 43 de 100 se lee como 0.43.',
        err:'Busca la cuadr&iacute;cula con 43 cuadritos coloreados.'
      }
    },
    {
      title:'Compara decimales',
      lead:'Escucha la explicaci&oacute;n y mira qu&eacute; tarjeta representa m&aacute;s del mismo entero.',
      introAudio:'audios/equiv_facil_p4_intro.mp3',
      exerciseAudio:'audios/equiv_facil_p4_ej1.mp3',
      contentHtml:()=>`<div class="compare-board"><div class="compare-card"><h4>Tarjeta A</h4>${renderGrid(30)}<div class="model-note">${chip('0.30')}</div></div><div class="compare-card"><h4>Tarjeta B</h4>${renderGrid(70)}<div class="model-note">${chip('0.70','sky')}</div></div></div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Tarjetas del reto</div><div class="compare-board"><div class="compare-card"><h4>Tarjeta A</h4>${renderGrid(45)}<div class="model-note">${chip('0.45')}</div></div><div class="compare-card"><h4>Tarjeta B</h4>${renderGrid(50)}<div class="model-note">${chip('0.50')}</div></div></div></div>`,
        choices:[
          {value:'<',correct:true,html:'<div class="sign-choice">&lt;</div>'},
          {value:'>',correct:false,html:'<div class="sign-choice">&gt;</div>'},
          {value:'=',correct:false,html:'<div class="sign-choice">=</div>'}
        ],
        ok:'&iexcl;Exacto! 0.45 es menor que 0.50.',
        err:'Compara cu&aacute;l tarjeta tiene m&aacute;s partes coloreadas.'
      }
    },
    {
      title:'La recta num&eacute;rica',
      lead:'Escucha la explicaci&oacute;n y observa c&oacute;mo cada decimal ocupa un lugar exacto entre 0 y 1.',
      introAudio:'audios/equiv_facil_p5_intro.mp3',
      exerciseAudio:'audios/equiv_facil_p5_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Recta de ejemplo',renderNumberLine(6),chip('0.6','gold'))}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Rectas del reto</div><div class="hint-line">Elige la recta donde el punto cae en siete d&eacute;cimos.</div></div>`,
        choices:[
          {value:'6',correct:false,html:`<div class="model-title">Tarjeta A</div>${renderNumberLine(6)}`},
          {value:'7',correct:true,html:`<div class="model-title">Tarjeta B</div>${renderNumberLine(7)}`},
          {value:'8',correct:false,html:`<div class="model-title">Tarjeta C</div>${renderNumberLine(8)}`},
          {value:'9',correct:false,html:`<div class="model-title">Tarjeta D</div>${renderNumberLine(9)}`}
        ],
        ok:'&iexcl;Muy bien! El punto correcto est&aacute; en 0.7.',
        err:'Cuenta los saltos desde 0 hasta el punto amarillo.'
      }
    },
    {
      title:'Reto final',
      lead:'Escucha la explicaci&oacute;n y usa lo que ya sabes sobre entero, d&eacute;cimos y cent&eacute;simos.',
      introAudio:'audios/equiv_facil_p6_intro.mp3',
      exerciseAudio:'audios/equiv_facil_p6_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Modelo entero',renderBottle(10),chip('1.0','gold'))}${modelCard('Modelo de d&eacute;cimos',renderStrip(10,8),chip('0.8'))}${modelCard('Modelo de cent&eacute;simos',renderGrid(25),chip('0.25','sky'))}</div>`,
      activity:{
        type:'sequence',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Modelos del reto</div><div class="model-grid">${modelCard('Modelo 1',renderBottle(10),'')}${modelCard('Modelo 2',renderStrip(10,6),'')}${modelCard('Modelo 3',renderGrid(43),'')}</div><div class="hint-line">Coloca sus decimales de izquierda a derecha.</div></div>`,
        items:[
          {value:'1.0',html:chip('1.0')},
          {value:'0.6',html:chip('0.6')},
          {value:'0.43',html:chip('0.43')},
          {value:'0.25',html:chip('0.25')},
          {value:'0.8',html:chip('0.8')}
        ],
        correctOrder:['1.0','0.6','0.43'],
        ok:'&iexcl;Excelente! Ya relacionas entero, d&eacute;cimos y cent&eacute;simos.',
        err:'Observa los tres modelos y decide qu&eacute; decimal representa cada uno.'
      }
    }
  ];

  function ensureOrders(page){
    const state=pageStates[page];
    const activity=pages[page-1].activity;
    if(activity.type==='choice'&&!state.order){ const original=activity.choices.map((c)=>c.value); state.order=shuffleDifferent(original,[original.join('|')]); }
    if(activity.type==='sequence'&&!state.order){ const original=activity.items.map((item)=>item.value); state.order=shuffleDifferent(original,[original.join('|'),activity.correctOrder.join('|')]); }
  }

  function renderChoice(page,activity){
    const state=pageStates[page];
    ensureOrders(page);
    const byValue={}; activity.choices.forEach((choice)=>{ byValue[choice.value]=choice; });
    const extraClass=activity.layoutClass||'';
    const html=`<div class="options-grid${extraClass?` ${extraClass}`:''}">${state.order.map((value)=>{ const choice=byValue[value]; let cls='option-card'; if(state.selected===value) cls+=' sel'; if(state.solved&&choice.correct) cls+=' ok'; if(state.wrong&&state.selected===value&&!choice.correct) cls+=' err'; return `<button type="button" class="${cls}" data-value="${value}">${choice.html}</button>`; }).join('')}</div>`;
    document.getElementById('rootActividad').innerHTML=html;
    document.querySelectorAll('#rootActividad .option-card').forEach((btn)=>{
      btn.addEventListener('click',function(){ if(state.solved) return; state.selected=btn.dataset.value; state.wrong=false; state.feedback=null; safePlay(fx.click); renderCurrentPage(); });
    });
  }

  function renderSequence(page,activity){
    const state=pageStates[page];
    ensureOrders(page);
    if(!state.slots) state.slots=Array(activity.correctOrder.length).fill(null);
    const itemMap={}; activity.items.forEach((item)=>{ itemMap[item.value]=item; });
    const used=new Set(state.slots.filter(Boolean));
    const slots=state.slots.map((value,index)=>{ const item=value?itemMap[value]:null; return `<button type="button" class="slot${value?' has-card':''}" data-slot="${index}"><div>${value?`<div class="slot-label">${index+1}</div>${item.html}`:`<div class="slot-label">${index+1}</div><div class="hint-line">Coloca una tarjeta aqu&iacute;</div>`}</div></button>`; }).join('');
    const bank=state.order.map((value)=>{ const item=itemMap[value]; return `<button type="button" class="bank-card${used.has(value)?' used':''}" data-value="${value}">${item.html}</button>`; }).join('');
    document.getElementById('rootActividad').innerHTML=`<div class="sequence-wrap"><div class="sequence-slots">${slots}</div><div class="bank-grid">${bank}</div></div>`;
    document.querySelectorAll('#rootActividad .bank-card').forEach((btn)=>{ btn.addEventListener('click',function(){ if(state.solved||btn.classList.contains('used')) return; const emptyIndex=state.slots.findIndex((value)=>!value); if(emptyIndex===-1) return; state.slots[emptyIndex]=btn.dataset.value; state.wrong=false; state.feedback=null; safePlay(fx.click); renderCurrentPage(); }); });
    document.querySelectorAll('#rootActividad .slot').forEach((btn)=>{ btn.addEventListener('click',function(){ if(state.solved) return; const index=Number(btn.dataset.slot); if(!state.slots[index]) return; state.slots[index]=null; state.wrong=false; state.feedback=null; safePlay(fx.click); renderCurrentPage(); }); });
  }
  function verifyCurrent(){
    const page=paginaActual;
    const config=pages[page-1].activity;
    const state=pageStates[page];
    if(state.solved) return;
    if(config.type==='choice'){
      if(!state.selected){ setPageFeedback(page,false,'Primero escucha y elige una opci&oacute;n.'); renderCurrentPage(); return; }
      const choice=config.choices.find((item)=>item.value===state.selected);
      const ok=!!(choice&&choice.correct);
      if(ok){ state.solved=true; state.wrong=false; setPageFeedback(page,true,config.ok); safePlay(fx.ding); registerSolved(page); updateQuizLock(); renderCurrentPage(); }
      else { state.wrong=true; setPageFeedback(page,false,config.err); safePlay(fx.error); registerError(page,'choice'); renderCurrentPage(); }
    }
    if(config.type==='sequence'){
      if(state.slots.some((value)=>!value)){ setPageFeedback(page,false,'Completa los tres lugares antes de verificar.'); renderCurrentPage(); return; }
      const ok=state.slots.join('|')===config.correctOrder.join('|');
      if(ok){ state.solved=true; state.wrong=false; setPageFeedback(page,true,config.ok); safePlay(fx.ding); registerSolved(page); updateQuizLock(); renderCurrentPage(); }
      else { state.wrong=true; setPageFeedback(page,false,config.err); safePlay(fx.error); registerError(page,'sequence'); renderCurrentPage(); }
    }
  }

  function clearCurrent(){
    const page=paginaActual;
    const config=pages[page-1].activity;
    const state=pageStates[page];
    if(state.solved) return;
    state.wrong=false;
    state.feedback=null;
    if(config.type==='choice') state.selected=null;
    if(config.type==='sequence') state.slots=Array(config.correctOrder.length).fill(null);
    safePlay(fx.click);
    renderCurrentPage();
  }

  function renderQuizButton(){
    const wrap=document.getElementById('quizWrap');
    if(paginaActual!==totalPaginas){ wrap.innerHTML=''; return; }
    wrap.innerHTML=`<a href="quiz.html" class="quiz-link${allSolved()?'':' bloqueado'}" id="btnMiniQuiz"><i class="fas fa-puzzle-piece"></i>IR AL QUIZ</a>`;
    const btn=document.getElementById('btnMiniQuiz');
    btn.addEventListener('click',async function(event){ if(!allSolved()){ event.preventDefault(); return; } event.preventDefault(); if(session) await session.complete({eventoCierre:'quiz'}); window.location.href=this.getAttribute('href'); });
  }

  function renderCurrentPage(){
    const page=pages[paginaActual-1];
    document.getElementById('tituloPagina').innerHTML=page.title;
    document.getElementById('leadPagina').innerHTML=page.lead;
    document.getElementById('contenidoPagina').innerHTML=page.contentHtml();
    document.getElementById('promptActividad').innerHTML=page.activity.prompt;
    document.getElementById('supportActividad').innerHTML=page.activity.supportHtml();
    if(page.activity.type==='choice') renderChoice(paginaActual,page.activity);
    if(page.activity.type==='sequence') renderSequence(paginaActual,page.activity);
    renderStoredFeedback(paginaActual);

    const btnIntro=document.getElementById('btnAudioIntro');
    const btnEj=document.getElementById('btnAudioEj');
    btnIntro.classList.remove('playing');
    btnEj.classList.remove('playing');
    btnIntro.onclick=()=>playNarration(page.introAudio,btnIntro);
    btnEj.onclick=()=>playNarration(page.exerciseAudio,btnEj);

    document.getElementById('btnAnterior').disabled=paginaActual===1;
    document.getElementById('btnSiguiente').disabled=paginaActual===totalPaginas||!pageStates[paginaActual].solved;
    document.getElementById('contadorPagina').textContent=paginaActual+'/'+totalPaginas;
    document.getElementById('progresoTexto').textContent='P&aacute;gina '+paginaActual+' de '+totalPaginas;
    const porcentaje=Math.round((paginaActual/totalPaginas)*100);
    document.getElementById('progresoNum').textContent=porcentaje+'%';
    document.getElementById('barraRelleno').style.width=porcentaje+'%';
    renderQuizButton();
    markVisible(paginaActual);
  }

  function changePage(delta){
    const next=paginaActual+delta;
    if(next<1||next>totalPaginas) return;
    paginaActual=next;
    stopNarration();
    safePlay(fx.whoosh);
    renderCurrentPage();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  document.getElementById('btnVerificar').addEventListener('click',verifyCurrent);
  document.getElementById('btnBorrar').addEventListener('click',clearCurrent);
  document.getElementById('btnAnterior').addEventListener('click',()=>changePage(-1));
  document.getElementById('btnSiguiente').addEventListener('click',()=>changePage(1));
  document.querySelector('.btn-volver-menu').addEventListener('click',async ()=>{ if(session) await session.complete({eventoCierre:'menu'}); window.location.href='../../menu.html'; });

  renderCurrentPage();
})();
