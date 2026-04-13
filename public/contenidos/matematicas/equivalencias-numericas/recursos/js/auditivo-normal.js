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
  Object.values(fx).forEach((a)=>{ a.volume=0.4; });

  const narrations={};
  function getNarration(path){ if(!narrations[path]) narrations[path]=new Audio(path); return narrations[path]; }

  const tracker=window.createReforzamientoTracker?window.createReforzamientoTracker({
    trackTime:false,
    contenidoId:6,
    nivel:'normal',
    estilo:'auditivo',
    detalleBase:{ bloque:'equivalencias_numericas', motor:'auditivo_normal' },
    apartados:{
      aud_equiv_normal_p1:{pagina:1,apartadoClave:'aud_equiv_normal_p1',tipoActividad:'reforzamiento'},
      aud_equiv_normal_p2:{pagina:2,apartadoClave:'aud_equiv_normal_p2',tipoActividad:'reforzamiento'},
      aud_equiv_normal_p3:{pagina:3,apartadoClave:'aud_equiv_normal_p3',tipoActividad:'reforzamiento'},
      aud_equiv_normal_p4:{pagina:4,apartadoClave:'aud_equiv_normal_p4',tipoActividad:'reforzamiento'},
      aud_equiv_normal_p5:{pagina:5,apartadoClave:'aud_equiv_normal_p5',tipoActividad:'reforzamiento'},
      aud_equiv_normal_p6:{pagina:6,apartadoClave:'aud_equiv_normal_p6',tipoActividad:'reforzamiento'}
    }
  }):null;

  const session=window.createReforzamientoSessionTracker?window.createReforzamientoSessionTracker({
    contenidoId:6,
    nivel:'normal',
    estilo:'auditivo',
    detalleBase:{ bloque:'equivalencias_numericas', motor:'auditivo_normal' }
  }):null;
  if(session) session.start();

  const pageStates={
    1:{solved:false,selected:null,wrong:false,feedback:null,order:null},
    2:{solved:false,selected:null,wrong:false,feedback:null,order:null},
    3:{solved:false,selected:null,wrong:false,feedback:null,order:null},
    4:{solved:false,selected:null,wrong:false,feedback:null,order:null},
    5:{solved:false,selected:null,wrong:false,feedback:null,order:null},
    6:{solved:false,wrong:false,feedback:null,order:null,slots:null}
  };
  const recordedPages={};

  function safePlay(audio){
    try{
      audio.pause();
      audio.currentTime=0;
      const p=audio.play();
      if(p&&p.catch) p.catch(()=>{});
    }catch(_){}
  }
  function stopNarration(){
    if(audioActual){
      audioActual.pause();
      audioActual.currentTime=0;
      audioActual=null;
    }
    document.querySelectorAll('.audio-btn').forEach((b)=>b.classList.remove('playing'));
  }
  function playNarration(path,btn){
    safePlay(fx.click);
    stopNarration();
    const audio=getNarration(path);
    audioActual=audio;
    btn.classList.add('playing');
    const p=audio.play();
    if(p&&p.catch) p.catch(()=>{});
    audio.onended=function(){
      btn.classList.remove('playing');
      if(audioActual===audio) audioActual=null;
    };
  }
  function sectionKey(page){ return 'aud_equiv_normal_p'+page; }
  function markVisible(page){ if(tracker) tracker.markPageVisibleByNumber(page,{motor:'auditivo_normal'}); }
  function registerError(page,detail){ if(tracker) tracker.addError(sectionKey(page),1,{ejercicio:detail||'principal'}); }
  function registerSolved(page){
    if(recordedPages[page]) return;
    recordedPages[page]=true;
    if(tracker){
      tracker.addCorrect(sectionKey(page),1,{ejercicio:'principal'});
      tracker.complete(sectionKey(page),{detalle:{motor:'auditivo_normal',pagina:page,ejercicio:'principal'}});
    }
  }
  function allSolved(){ return Object.values(pageStates).every((state)=>state.solved); }
  function updateQuizLock(){
    const btn=document.getElementById('btnMiniQuiz');
    if(btn) btn.classList.toggle('bloqueado',!allSolved());
  }
  function showFeedback(ok,html){
    const el=document.getElementById('feedback');
    el.className='feedback show '+(ok?'ok':'err');
    el.innerHTML=html;
  }
  function clearFeedback(){
    const el=document.getElementById('feedback');
    el.className='feedback';
    el.innerHTML='';
  }
  function setPageFeedback(page,ok,html){ pageStates[page].feedback={ok,html}; }
  function renderStoredFeedback(page){
    const feedback=pageStates[page].feedback;
    if(feedback) showFeedback(feedback.ok,feedback.html);
    else clearFeedback();
  }
  function shuffleDifferent(base,blocked){
    if(base.length<=1) return base.slice();
    let arr=base.slice();
    const blockedSigs=blocked||[];
    for(let t=0;t<30;t+=1){
      for(let i=arr.length-1;i>0;i-=1){
        const j=Math.floor(Math.random()*(i+1));
        const tmp=arr[i];
        arr[i]=arr[j];
        arr[j]=tmp;
      }
      if(!blockedSigs.includes(arr.join('|'))) return arr.slice();
      arr=base.slice();
    }
    return base.slice().reverse();
  }

  function chip(text,cls){ return `<span class="value-chip ${cls||''}">${text}</span>`; }
  function renderGrid(fill,mini){
    const klass=mini?'mini-grid':'hundred-grid';
    let html=`<div class="grid-wrap"><div class="${klass}">`;
    for(let i=0;i<100;i+=1) html+=`<span class="grid-cell${i<fill?' fill':''}"></span>`;
    return html+'</div></div>';
  }
  function renderBridge(decimalLabel,percentLabel,fill){
    return `<div class="bridge-wrap"><div class="bridge-panel">${renderGrid(fill,true)}${chip(decimalLabel,'sky')}<div class="bridge-arrow">&rarr;</div>${percentLabel?`<div class="bridge-percent">${percentLabel}</div>`:''}</div></div>`;
  }
  function renderGroup(fill,decimalLabel,percentLabel){
    return `<div class="trio-card"><div class="trio-title">Grupo</div><div class="trio-stack">${renderGrid(fill,true)}${chip(decimalLabel,'sky')}${chip(percentLabel)}</div></div>`;
  }
  function renderBoardChoice(label,fill){
    return `<div class="model-title">${label}</div>${renderGrid(fill)}`;
  }
  function renderGroupLarge(label,fill,decimalLabel,percentLabel){
    return `<div class="model-title">${label}</div>${renderGrid(fill)}<div class="model-note" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">${chip(decimalLabel,'sky')}${chip(percentLabel)}</div>`;
  }
  function compactChoice(label,cls){
    return `<div class="compact-choice">${chip(label,cls||'')}</div>`;
  }
  function renderBoardOption(fill){
    return `<div class="model-card">${renderGrid(fill)}</div>`;
  }
  function renderEquivalentOption(fill,decimalLabel,percentLabel){
    return `<div class="model-card">${renderGrid(fill)}<div class="model-note" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">${chip(decimalLabel,'sky')}${chip(percentLabel)}</div></div>`;
  }
  function renderStrip20(fill){
    let html='<div class="strip-wrap"><div class="strip20">';
    for(let i=0;i<20;i+=1) html+=`<span class="strip20-part${i<fill?' fill':''}"></span>`;
    return html+'</div></div>';
  }
  function modelCard(title,visual,note){
    return `<div class="model-card"><div class="model-title">${title}</div>${visual}${note?`<div class="model-note">${note}</div>`:''}</div>`;
  }

  const pages=[
    {
      title:'Porcentaje significa de cada 100',
      lead:'Observa los modelos mientras escuchas.',
      introAudio:'audios/equiv_normal_p1_intro.mp3',
      exerciseAudio:'audios/equiv_normal_p1_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Modelo A',renderGrid(18),chip('18%'))}${modelCard('Modelo B',renderGrid(47),chip('47%','sky'))}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Modelos del reto</div><div class="hint-line">Escucha el porcentaje y toca el modelo correcto.</div></div>`,
        choices:[
          {value:'62',correct:true,html:renderBoardOption(62)},
          {value:'26',correct:false,html:renderBoardOption(26)},
          {value:'72',correct:false,html:renderBoardOption(72)},
          {value:'52',correct:false,html:renderBoardOption(52)}
        ],
        ok:'&iexcl;Muy bien! Ese modelo representa el porcentaje correcto.',
        err:'Cuenta otra vez cu&aacute;ntos cuadros est&aacute;n coloreados.'
      }
    },
    {
      title:'Puente entre decimal y porcentaje',
      lead:'Observa c&oacute;mo una misma cantidad puede escribirse de dos formas.',
      introAudio:'audios/equiv_normal_p2_intro.mp3',
      exerciseAudio:'audios/equiv_normal_p2_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Cantidad 1',renderBridge('0.58','58%',58),'')}${modelCard('Cantidad 2',renderBridge('0.24','24%',24),'')}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Decimal del reto</div><div class="text-center">${chip('0.35','sky')}</div></div>`,
        choices:[
          {value:'35%',correct:true,html:chip('35%')},
          {value:'53%',correct:false,html:chip('53%')},
          {value:'30%',correct:false,html:chip('30%')},
          {value:'45%',correct:false,html:chip('45%')}
        ],
        ok:'&iexcl;Exacto! Ese porcentaje corresponde al decimal escuchado.',
        err:'Piensa ese decimal como una cantidad de cada 100.'
      }
    },
    {
      title:'Misma cantidad, otra escritura',
      lead:'Observa los grupos y compara sus tres formas.',
      introAudio:'audios/equiv_normal_p3_intro.mp3',
      exerciseAudio:'audios/equiv_normal_p3_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Grupo 1',renderGrid(42),`<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">${chip('0.42','sky')}${chip('42%')}</div>`)}${modelCard('Grupo 2',renderGrid(8),`<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">${chip('0.08','sky')}${chip('8%')}</div>`)}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Grupos del reto</div><div class="hint-line">Busca el grupo donde el modelo, el decimal y el porcentaje representan la misma cantidad.</div></div>`,
        choices:[
          {value:'g1',correct:true,html:renderEquivalentOption(65,'0.65','65%')},
          {value:'g2',correct:false,html:renderEquivalentOption(65,'0.65','56%')},
          {value:'g3',correct:false,html:renderEquivalentOption(8,'0.08','80%')},
          {value:'g4',correct:false,html:renderEquivalentOption(53,'0.35','35%')}
        ],
        ok:'&iexcl;Correcto! Ese grupo s&iacute; es equivalente.',
        err:'Revisa si el modelo, el decimal y el porcentaje dicen lo mismo.'
      }
    },
    {
      title:'Cu&aacute;l porcentaje es mayor',
      lead:'Observa las dos cantidades y luego comp&aacute;ralas.',
      introAudio:'audios/equiv_normal_p4_intro.mp3',
      exerciseAudio:'audios/equiv_normal_p4_ej1.mp3',
      contentHtml:()=>`<div class="compare-board"><div class="compare-card"><h4>Tarjeta A</h4>${renderGrid(45,true)}<div class="model-note">${chip('45%')}</div></div><div class="compare-vs">&lt;</div><div class="compare-card"><h4>Tarjeta B</h4>${renderGrid(55,true)}<div class="model-note">${chip('55%','sky')}</div></div></div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Comparaci&oacute;n del reto</div><div class="compare-board"><div class="compare-card"><h4>Tarjeta A</h4>${renderGrid(48,true)}<div class="model-note">${chip('48%')}</div></div><div class="compare-card"><h4>Tarjeta B</h4>${renderGrid(52,true)}<div class="model-note">${chip('52%','sky')}</div></div></div></div>`,
        choices:[
          {value:'<',correct:true,html:'<div class="sign-choice">&lt;</div>'},
          {value:'>',correct:false,html:'<div class="sign-choice">&gt;</div>'},
          {value:'=',correct:false,html:'<div class="sign-choice">=</div>'}
        ],
        ok:'&iexcl;Muy bien! La comparaci&oacute;n qued&oacute; correcta.',
        err:'Observa cu&aacute;l tarjeta tiene m&aacute;s cuadros coloreados.'
      }
    },
    {
      title:'Cuando el entero tiene 20 partes',
      lead:'Observa c&oacute;mo una barra de 20 partes se convierte en porcentaje.',
      introAudio:'audios/equiv_normal_p5_intro.mp3',
      exerciseAudio:'audios/equiv_normal_p5_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Barra A',renderStrip20(12),chip('60%'))}${modelCard('Barra B',renderStrip20(15),chip('75%','sky'))}</div>`,
      activity:{
        type:'choice',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Barra del reto</div>${renderStrip20(14)}<div class="hint-line">Escucha y elige el porcentaje que le corresponde.</div></div>`,
        choices:[
          {value:'70%',correct:true,html:chip('70%')},
          {value:'45%',correct:false,html:chip('45%')},
          {value:'80%',correct:false,html:chip('80%')},
          {value:'65%',correct:false,html:chip('65%')}
        ],
        ok:'&iexcl;Excelente! Ese porcentaje coincide con 14 de 20 partes.',
        err:'Cada parte vale 5%. Cuenta cu&aacute;ntas partes est&aacute;n coloreadas.'
      }
    },
    {
      title:'Reto final',
      lead:'Observa tres modelos distintos de la misma idea.',
      introAudio:'audios/equiv_normal_p6_intro.mp3',
      exerciseAudio:'audios/equiv_normal_p6_ej1.mp3',
      contentHtml:()=>`<div class="model-grid">${modelCard('Modelo A',renderGrid(25),chip('25%'))}${modelCard('Modelo B',renderBridge('0.47','47%',47),'')}${modelCard('Modelo C',renderStrip20(12),chip('60%','sky'))}</div>`,
      activity:{
        type:'sequence',
        prompt:'Escucha el reto y responde con el apoyo visual.',
        supportHtml:()=>`<div class="support-box"><div class="support-title">Modelos del reto</div><div class="model-grid">${modelCard('Modelo 1',renderGrid(35),'')}${modelCard('Modelo 2',renderBridge('0.58','',58),'')}${modelCard('Modelo 3',renderStrip20(13),'')}</div><div class="hint-line">Coloca los porcentajes correctos de izquierda a derecha.</div></div>`,
        items:[
          {value:'35%',html:chip('35%')},
          {value:'58%',html:chip('58%')},
          {value:'65%',html:chip('65%')},
          {value:'47%',html:chip('47%')}
        ],
        correctOrder:['35%','58%','65%'],
        ok:'&iexcl;Excelente! Ya relacionas porcentajes con modelos distintos.',
        err:'Revisa cu&aacute;nto del entero representa cada modelo.'
      }
    }
  ];

  function ensureOrders(page){
    const state=pageStates[page];
    const activity=pages[page-1].activity;
    if(activity.type==='choice'&&!state.order){
      const original=activity.choices.map((c)=>c.value);
      state.order=shuffleDifferent(original,[original.join('|')]);
    }
    if(activity.type==='sequence'&&!state.order){
      const original=activity.items.map((item)=>item.value);
      state.order=shuffleDifferent(original,[original.join('|'),activity.correctOrder.join('|')]);
    }
  }

  function renderChoice(page,activity){
    const state=pageStates[page];
    ensureOrders(page);
    const byValue={};
    activity.choices.forEach((choice)=>{ byValue[choice.value]=choice; });
    const extraClass=activity.layoutClass||'';
    const html=`<div class="options-grid${extraClass?` ${extraClass}`:''}">${state.order.map((value)=>{
      const choice=byValue[value];
      let cls='option-card';
      if(state.selected===value) cls+=' sel';
      if(state.solved&&choice.correct) cls+=' ok';
      if(state.wrong&&state.selected===value&&!choice.correct) cls+=' err';
      return `<button type="button" class="${cls}" data-value="${value}">${choice.html}</button>`;
    }).join('')}</div>`;
    document.getElementById('rootActividad').innerHTML=html;
    document.querySelectorAll('#rootActividad .option-card').forEach((btn)=>{
      btn.addEventListener('click',function(){
        if(state.solved) return;
        state.selected=btn.dataset.value;
        state.wrong=false;
        state.feedback=null;
        safePlay(fx.click);
        renderCurrentPage();
      });
    });
  }

  function renderSequence(page,activity){
    const state=pageStates[page];
    ensureOrders(page);
    if(!state.slots) state.slots=Array(activity.correctOrder.length).fill(null);
    const itemMap={};
    activity.items.forEach((item)=>{ itemMap[item.value]=item; });
    const used=new Set(state.slots.filter(Boolean));
    const slots=state.slots.map((value,index)=>{
      const item=value?itemMap[value]:null;
      return `<button type="button" class="slot${value?' has-card':''}" data-slot="${index}"><div>${value?`<div class="slot-label">${index+1}</div>${item.html}`:`<div class="slot-label">${index+1}</div><div class="hint-line">Coloca una tarjeta aqu&iacute;</div>`}</div></button>`;
    }).join('');
    const bank=state.order.map((value)=>{
      const item=itemMap[value];
      return `<button type="button" class="bank-card${used.has(value)?' used':''}" data-value="${value}">${item.html}</button>`;
    }).join('');
    document.getElementById('rootActividad').innerHTML=`<div class="sequence-wrap"><div class="sequence-slots">${slots}</div><div class="bank-grid">${bank}</div></div>`;
    document.querySelectorAll('#rootActividad .bank-card').forEach((btn)=>{
      btn.addEventListener('click',function(){
        if(state.solved||btn.classList.contains('used')) return;
        const emptyIndex=state.slots.findIndex((value)=>!value);
        if(emptyIndex===-1) return;
        state.slots[emptyIndex]=btn.dataset.value;
        state.wrong=false;
        state.feedback=null;
        safePlay(fx.click);
        renderCurrentPage();
      });
    });
    document.querySelectorAll('#rootActividad .slot').forEach((btn)=>{
      btn.addEventListener('click',function(){
        if(state.solved) return;
        const index=Number(btn.dataset.slot);
        if(!state.slots[index]) return;
        state.slots[index]=null;
        state.wrong=false;
        state.feedback=null;
        safePlay(fx.click);
        renderCurrentPage();
      });
    });
  }

  function verifyCurrent(){
    const page=paginaActual;
    const config=pages[page-1].activity;
    const state=pageStates[page];
    if(state.solved) return;
    if(config.type==='choice'){
      if(!state.selected){
        setPageFeedback(page,false,'Primero escucha y elige una opci&oacute;n.');
        renderCurrentPage();
        return;
      }
      const choice=config.choices.find((item)=>item.value===state.selected);
      const ok=!!(choice&&choice.correct);
      if(ok){
        state.solved=true;
        state.wrong=false;
        setPageFeedback(page,true,config.ok);
        safePlay(fx.ding);
        registerSolved(page);
        updateQuizLock();
        renderCurrentPage();
      }else{
        state.wrong=true;
        setPageFeedback(page,false,config.err);
        safePlay(fx.error);
        registerError(page,'choice');
        renderCurrentPage();
      }
    }
    if(config.type==='sequence'){
      if(state.slots.some((value)=>!value)){
        setPageFeedback(page,false,'Completa los tres lugares antes de verificar.');
        renderCurrentPage();
        return;
      }
      const ok=state.slots.join('|')===config.correctOrder.join('|');
      if(ok){
        state.solved=true;
        state.wrong=false;
        setPageFeedback(page,true,config.ok);
        safePlay(fx.ding);
        registerSolved(page);
        updateQuizLock();
        renderCurrentPage();
      }else{
        state.wrong=true;
        setPageFeedback(page,false,config.err);
        safePlay(fx.error);
        registerError(page,'sequence');
        renderCurrentPage();
      }
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
    btn.addEventListener('click',async function(event){
      if(!allSolved()){ event.preventDefault(); return; }
      event.preventDefault();
      if(session) await session.complete({eventoCierre:'quiz'});
      window.location.href=this.getAttribute('href');
    });
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
  document.querySelector('.btn-volver-menu').addEventListener('click',async ()=>{
    if(session) await session.complete({eventoCierre:'menu'});
    window.location.href='../../menu.html';
  });

  renderCurrentPage();
})();
