const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lesson-ai-panel-BJq4yL9G.js","assets/errors-S67X06TO.js","assets/constants-CYr9ulPU.js"])))=>i.map(i=>d[i]);
import{D as st,a as rt,b as Bt}from"./constants-CYr9ulPU.js";const ie="modulepreload",le=function(t){return"/Thinking/"+t},Vt={},ce=function(e,r,s){let a=Promise.resolve();if(r&&r.length>0){let c=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),i=n?.nonce||n?.getAttribute("nonce");a=c(r.map(u=>{if(u=le(u),u in Vt)return;Vt[u]=!0;const d=u.endsWith(".css"),l=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${l}`))return;const g=document.createElement("link");if(g.rel=d?"stylesheet":ie,d||(g.as="script"),g.crossOrigin="",g.href=u,i&&g.setAttribute("nonce",i),document.head.appendChild(g),d)return new Promise((k,m)=>{g.addEventListener("load",k),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(n){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n}return a.then(n=>{for(const i of n||[])i.status==="rejected"&&o(i.reason);return e().catch(o)})},D=["A","B","C","D"];function wt(){return{A:"",B:"",C:"",D:""}}function ut(t){return/^(?:[1-9]|[1-5][0-9]|60)$/.test(t)?Number(t):null}function _t(t,e){if(!Number.isInteger(e)||e<1||e>60||D.some(a=>!/^(?:0|[1-9]\d*)$/.test(t[a])))return null;const r=Object.fromEntries(D.map(a=>[a,Number(t[a])])),s=D.reduce((a,o)=>a+r[o],0);return s>e?null:{counts:r,noResponse:e-s}}function de(t,e,r){return(e-t)/r*100}function ue(t){if(!Number.isInteger(t)||t<2||t>12)throw new RangeError("denominator must be 2–12");return Array.from({length:t},(e,r)=>({start:r/t,end:(r+1)/t}))}const xt=new Map;function It(t){if(xt.has(t.id))throw new Error(`Unit "${t.id}" is already registered.`);xt.set(t.id,t)}function fe(t){const e=xt.get(t);if(!e)throw new Error(`Unit "${t}" not found. Registered: ${[...xt.keys()].join(", ")}`);return e}function Ot(){return[...xt.values()]}const pe={id:"M01",title:"🥖 초코바 나누기 · 단위분수 기초 비교 (1/3과 1/5)",description:"길이가 같은 초코바와 리본을 똑같이 나누어 1/3과 1/5 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 나누기",text:"같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모가 커지면 한 조각도 커진다는 생각을 살핍니다."},{id:"B",title:"나누는 수 바꾸기",text:"전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.",hint:"분모와 한 조각 크기의 관계를 설명해 봅니다."},{id:"C",title:"전체 다시 만들기",text:"1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.",hint:"분모가 무엇을 뜻하는지 확인합니다."}],examples:[{id:"E1",text:"5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 길이를 더 많이 나누면 한 조각은 작아져요.",expected:"B"},{id:"E3",text:"두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.",expected:"hold"},{id:"E4",text:"분모가 무엇을 뜻하는지 모르겠어요.",expected:"C"},{id:"E5",text:"어떤 물건인지도 모르고 길이 정보가 없어요.",expected:"hold"},{id:"E6",text:"오늘 날씨가 좋아서 운동장에 갔어요.",expected:"hold"}],denominators:{first:[3,5],transfer:[4,6]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},ge={id:"M02",title:"🍕 피자 조각 고르기 · 단위분수 심화 비교 (1/4과 1/7)",description:"크기가 같은 피자와 리본을 똑같이 나누어 1/4과 1/7 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 세밀하게 나누기",text:"같은 길이의 전체를 4등분과 7등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모 7이 4보다 크니까 1/7이 크다는 생각을 살핍니다."},{id:"B",title:"등분 수와 조각 크기 규칙 찾기",text:"등분 수를 4에서 7로 늘릴 때 한 조각의 크기가 어떻게 변하는지 규칙을 찾습니다.",hint:"나누는 횟수가 늘어날수록 한 조각이 작아지는 이유를 설명해 봅니다."},{id:"C",title:"단위분수 모아 전체 확인하기",text:"1/4 네 조각과 1/7 일곱 조각을 각각 모아 처음 전체와 같은지 확인합니다.",hint:"단위분수가 전체의 몇 분의 일인지 의미를 되짚습니다."}],examples:[{id:"E1",text:"7이 4보다 크니까 1/7 조각이 더 크다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 여러 번 나눌수록 한 조각은 줄어들어요.",expected:"B"},{id:"E3",text:"전체 크기가 서로 다르면 1/4과 1/7을 바로 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/7이 전체를 어떻게 나눈 것인지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"문제에 그림이나 길이 설명이 전혀 없어요.",expected:"hold"},{id:"E6",text:"점심시간에 친구들과 축구를 했어요.",expected:"hold"}],denominators:{first:[4,7],transfer:[5,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아|여러 번 나눌수록.{0,12}줄어",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},be={id:"M03",title:"🎀 색테이프 자르기 · 단위분수 응용 비교 (1/2과 1/6)",description:"길이가 같은 색테이프와 리본을 똑같이 나누어 1/2과 1/6 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"반으로 나누기와 여섯으로 나누기",text:"같은 길이의 전체를 2등분과 6등분해 한 조각의 길이를 직접 비교합니다.",hint:"6이 2보다 크니까 1/6이 더 크다는 생각을 점검합니다."},{id:"B",title:"등분 배수와 조각 크기 관계",text:"2등분한 조각을 다시 3등분하면 6등분이 된다는 점을 통해 조각 크기를 관찰합니다.",hint:"나누는 수가 커질수록 한 조각이 얼마나 작아지는지 살펴봅니다."},{id:"C",title:"단위분수 개수로 전체 채우기",text:"1/2 두 조각과 1/6 여섯 조각을 모아 같은 전체가 되는지 확인합니다.",hint:"분모가 전체를 똑같이 나눈 조각 수임을 확인합니다."}],examples:[{id:"E1",text:"6이 2보다 훨씬 크니까 1/6 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 많이 나누면 한 조각의 길이는 짧아져요.",expected:"B"},{id:"E3",text:"전체 리본의 길이가 서로 다르면 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/6이 무엇을 나타내는지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"길이에 대한 설명이 없어서 알기 어려워요.",expected:"hold"},{id:"E6",text:"쉬는 시간에 물 마시러 다녀왔어요.",expected:"hold"}],denominators:{first:[2,6],transfer:[3,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}(작아|짧아)|더 많이 나눌수록.{0,12}(작아|짧아)",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}};Ot().length===0&&(It(pe),It(ge),It(be));const B=["think","explore","check","result"],Ht={think:"1. 생각 고르기",explore:"2. 직접 실험하기",check:"3. 다시 점검하기",result:"4. 오늘의 발견"},vt={M01:{badge:"🍫 민수의 고민",lead:'<strong>"3보다 5가 더 크니까 1/5 조각이 1/3보다 더 크지 않을까?"</strong>',friend:"민수"},M02:{badge:"🍕 서연이의 고민",lead:'<strong>"4보다 7이 더 크니까 1/7 조각이 1/4보다 더 크지 않을까?"</strong>',friend:"서연이"},M03:{badge:"🎀 준호의 고민",lead:'<strong>"2보다 6이 더 크니까 1/6 색테이프가 1/2보다 더 길지 않을까?"</strong>',friend:"준호"}},he={think:'🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요?"',explore:'🙋 선생님 질문 톡: "나누는 수가 커질수록 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',check:'🙋 선생님 질문 톡: "처음 생각과 지금 생각이 어떻게 달라졌는지 이야기해 볼까요?"',result:'🙋 선생님 질문 톡: "오늘 발견한 단위분수의 규칙을 한 문장으로 함께 읽어 봐요!"'},Gt=[{id:0,leftDenom:7,rightDenom:2,answer:"right"},{id:1,leftDenom:3,rightDenom:9,answer:"left"},{id:2,leftDenom:11,rightDenom:4,answer:"right"}],$e=[2,3,5,8,12],Xt=[6,2,9],Zt=[2,3,4,6,12],xe=[2,4,5,6,8],ve=["분모가 클수록 조각이 크다고 생각함","더 많이 나눌수록 조각이 작아진다고 생각함","전체가 같은지 확인이 필요함"],Qt=['💬 "분모 숫자가 클수록 조각도 커요"','💬 "많이 나눌수록 한 조각은 작아져요"','💬 "원래 전체 크기가 같은지 봐야 해요"'],b=document.querySelector("#lesson-app"),Jt=b.dataset.aiEnabled==="true";let Tt,R,S="M01",x="bar",y="think",z=!0,Ut=!1,Q=!1,v=!1,C={first:null,again:null,transfer:null},yt={first:"",again:""},Y="",kt="",nt=!1,ot=!1,it=!1,M="all",_=!1,j=[2,4],E=3,f=5,lt=!1,F=1,J=Gt.map(t=>({...t})),ct={0:null,1:null,2:null},gt=0,Et=0,w=[],X=null,N="",G=!1,O="",K="",at=new Set,W={first:!1,again:!1,transfer:!1},P=!1,q="20",$={first:null,again:null,transfer:null},L=0,Pt,mt=null,tt="";function I(){return fe(S)}function te(){return document.documentElement.getAttribute("data-theme")==="dark"}function ee(){return document.documentElement.getAttribute("data-scale")==="large"}function et(){try{"speechSynthesis"in window&&window.speechSynthesis.cancel()}catch{}}function h(t){if(z)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;(!R||R.state==="closed")&&(R=new e),R.state==="suspended"&&R.resume().catch(()=>{});const r=R.createOscillator(),s=R.createGain();r.connect(s),s.connect(R.destination);const a=R.currentTime;r.frequency.setValueAtTime(t==="fanfare"?659.25:t==="correct"?523.25:440,a),s.gain.setValueAtTime(.04,a),s.gain.exponentialRampToValueAtTime(.001,a+.11),r.start(a),r.stop(a+.11),r.onended=()=>{r.disconnect(),s.disconnect()}}catch{}}function U(){Pt&&(clearInterval(Pt),Pt=void 0),L=0}function bt(t=!1,e=!1){Tt?.dispose(),et(),U(),t||(S="M01"),e||at.clear(),x="bar",y="think",Ut=!1,Q=!1,v=!1,C={first:null,again:null,transfer:null},yt={first:"",again:""},Y="",kt="",nt=!1,ot=!1,it=!1,M="all",_=!1,j=[2,4],E=I().denominators.first[0],f=I().denominators.first[1],lt=!1,F=1,J=Gt.map(r=>({...r})),ct={0:null,1:null,2:null},gt=0,Et=0,w=[],X=null,N="",G=!1,O="",K="",mt=null,W={first:!1,again:!1,transfer:!1},P=!1,q="20",$={first:null,again:null,transfer:null},tt="",p()}function ht(){return S==="M01"?"초코바":S==="M02"?"피자":"색테이프"}function Wt(){return S==="M01"?{fill:"#e08e2b",bg:"var(--lesson-bar-bg, #fbf5ef)",stroke:"var(--lesson-bar-stroke, #5c3317)"}:S==="M02"?{fill:"#ffca62",bg:"var(--lesson-bar-bg, #fffaf0)",stroke:"var(--lesson-bar-stroke, #b45309)"}:{fill:"#ff8da1",bg:"var(--lesson-bar-bg, #fff5f7)",stroke:"var(--lesson-bar-stroke, #153a69)"}}function ye(t,e=!1){const{fill:o,bg:n,stroke:i}=Wt();if(e){const pt=v?`<circle cx="80" cy="80" r="46" fill="none" stroke="${i}" stroke-width="2" stroke-dasharray="4 4"/>`:"";return`<figure class="fraction fraction-circle ${v?"pattern-active":""}">
      <svg viewBox="0 0 160 160" role="img"
        aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${t}명이 똑같이 나눌 예정)">
        <circle cx="80" cy="80" r="60" fill="${o}" fill-opacity="0.28" stroke="${i}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="80" cy="80" r="52" fill="none" stroke="${i}" stroke-width="1.2" stroke-opacity="0.4"/>
        ${pt}
        <text x="80" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text>
        <text x="80" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">✂️ 1/${t}은?</text>
      </svg>
      <figcaption><strong>1/${t}</strong> (${t}명 중 1조각)</figcaption>
    </figure>`}const c=2*Math.PI/t,u=-Math.PI/2,d=u+c,l=80+60*Math.cos(u),g=80+60*Math.sin(u),k=80+60*Math.cos(d),m=80+60*Math.sin(d),A=c>Math.PI?1:0,H=`M 80 80 L ${l.toFixed(2)} ${g.toFixed(2)} A 60 60 0 ${A} 1 ${k.toFixed(2)} ${m.toFixed(2)} Z`,Ct=u+c/2,St=(80+60*.52*Math.cos(Ct)).toFixed(2),Ft=(80+60*.52*Math.sin(Ct)).toFixed(2),qt=Array.from({length:t},(pt,jt)=>{const T=u+jt*c,At=80+60*Math.cos(T),oe=80+60*Math.sin(T);return`<line x1="80" y1="80" x2="${At.toFixed(2)}" y2="${oe.toFixed(2)}" stroke="${i}" stroke-width="1.8"/>`}).join(""),V=v?`<path d="${H}" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3" stroke-dasharray="5 3"/>`:"";return`<figure class="fraction fraction-circle ${v?"pattern-active":""}">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${t}">
      <circle cx="80" cy="80" r="60" fill="${n}" stroke="${i}" stroke-width="3"/>
      <path d="${H}" fill="${o}"/>
      ${V}
      <circle cx="${St}" cy="${Ft}" r="${t>=9?3.2:4.5}" fill="#d9381e" fill-opacity="0.85"/>
      ${qt}
      <circle cx="80" cy="80" r="60" fill="none" stroke="${i}" stroke-width="3"/>
    </svg>
    <figcaption><strong>1/${t}</strong> (${t}조각 중 1조각)</figcaption>
  </figure>`}function ke(t){const a=528/t,o=36+a,n=Array.from({length:t+1},(c,u)=>{const d=(36+u*a).toFixed(2),l=u===0||u===t;return`<line x1="${d}" y1="${l?22:28}" x2="${d}" y2="${l?54:48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${l?3:2}"/>`}).join(""),i=v?`<line x1="36" y1="35" x2="${o.toFixed(2)}" y2="35" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="4 3"/>`:"";return`<figure class="fraction fraction-numberline ${v?"pattern-active":""}">
    <svg viewBox="0 0 600 78" role="img"
      aria-label="0에서 1까지를 ${t}등분하고 첫 눈금을 표시한 수직선 모형, 1/${t}">
      <rect x="36" y="31" width="${a.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${i}
      <line x1="36" y1="38" x2="564" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${n}
      <circle cx="${o.toFixed(2)}" cy="38" r="6" fill="#d9381e"/>
      <text x="36" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="${o.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${t}</text>
      <text x="564" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text>
    </svg>
    <figcaption>0~1 수직선 <strong>1/${t}</strong></figcaption>
  </figure>`}function me(t){const o=120/t,n=136-o,i=Array.from({length:t-1},(u,d)=>{const l=(16+(d+1)*120/t).toFixed(2);return`<line x1="48" y1="${l}" x2="112" y2="${l}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`}).join(""),c=v?`<line x1="46" y1="${(n+o*.5).toFixed(2)}" x2="114" y2="${(n+o*.5).toFixed(2)}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="5 3"/>`:"";return`<figure class="fraction fraction-cup ${v?"pattern-active":""}">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${t}등분하고 한 눈금만큼 채운 들이 모형, 1/${t}">
      <rect x="40" y="16" width="80" height="120" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="42" y="${n.toFixed(2)}" width="76" height="${o.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${c}
      ${i}
      <rect x="40" y="16" width="80" height="120" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption><strong>1/${t}컵</strong></figcaption>
  </figure>`}function ft(t,e=!1){if(x==="circle")return ye(t,e);if(x==="numberline")return ke(t);if(x==="cup")return me(t);const{fill:r,bg:s,stroke:a}=Wt();if(e){const d=v?`<line x1="14" y1="22" x2="586" y2="22" stroke="${a}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="6 4"/><line x1="14" y1="46" x2="586" y2="46" stroke="${a}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="2 5"/>`:"";return`<figure class="fraction ${v?"pattern-active":""}">
      <svg viewBox="0 0 600 70" role="img"
        aria-label="아직 자르지 않은 전체 길이가 같은 ${ht()} 모형 (${t}명이 똑같이 나눌 예정)">
        <rect x="0" y="10" width="600" height="48" rx="8" fill="${r}" fill-opacity="0.22" stroke="${a}" stroke-width="3" stroke-dasharray="8 5"/>
        <line x1="14" y1="34" x2="586" y2="34" stroke="${a}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        ${d}
        <text x="300" y="39" text-anchor="middle" font-size="15" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 ${ht()} 1개 · ✂️ 1/${t}은?</text>
      </svg>
      <figcaption><strong>1/${t}</strong> (${t}명 중 1조각)</figcaption>
    </figure>`}const o=ue(t),n=600/t,i=o.slice(1).map(d=>`<line x1="${600*d.start}" y1="10" x2="${600*d.start}" y2="58" stroke="${a}" stroke-width="2"/>`).join(""),c=S==="M01"?`<rect x="6" y="16" width="${Math.max(8,n-12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`:S==="M02"?`<circle cx="${Math.min(580,n*.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`:`<line x1="6" y1="34" x2="${Math.max(10,n-6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`,u=v?`<line x1="4" y1="22" x2="${Math.max(6,n-4).toFixed(2)}" y2="22" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2.5" stroke-dasharray="6 4"/><line x1="4" y1="46" x2="${Math.max(6,n-4).toFixed(2)}" y2="46" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2.5" stroke-dasharray="2 5"/>`:"";return`<figure class="fraction ${v?"pattern-active":""}">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 막대, 1/${t}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="${s}" stroke="${a}" stroke-width="3"/>
      <rect x="0" y="10" width="${n}" height="48" rx="4" fill="${r}"/>
      ${c}
      ${u}
      ${i}
    </svg>
    <figcaption><strong>1/${t}</strong> (${t}조각 중 1조각)</figcaption>
  </figure>`}function we(t,e,r=!1,s=!1){return`<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${x==="circle"}">${x==="circle"?"📏 막대 모양":"🍕 원형 모양"}</button>
      ${r?`<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${x==="numberline"}">📐 수직선</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${x==="cup"}">🥤 주스 컵</button>`:""}
    </div>
    <div class="bar-pair">${ft(t,s)}${ft(e,s)}</div>`}function Mt(t){return t==="transfer"}function Z(t){return Mt(t)?"B":"A"}function dt(t,e,r,s="first"){if(!t)return"아직 선택하지 않음";const[a,o]=Mt(s)?[r,e]:[e,r];return{A:`1/${a}이 더 크다`,B:`1/${o}이 더 크다`,C:"두 조각의 크기가 같다",D:"아직 잘 모르겠다"}[t]}function Nt(t,e,r){const s=C[t],[a,o]=Mt(t)?[r,e]:[e,r],n=[`A. 1/${a}이 더 크다`,`B. 1/${o}이 더 크다`,"C. 크기가 같다","D. 잘 모르겠다"];return`<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${D.map((i,c)=>`<button type="button" data-pick-poll="${t}" data-pick-choice="${i}" class="solo-choice-btn ${s===i?"solo-choice-selected":""}" aria-pressed="${s===i}">${n[c]}</button>`).join("")}
  </div>`}function Rt(t,e,r){const s=C[t];if(!s)return"";if(t==="first")return`<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각: <strong>"${dt(s,e,r,t)}"</strong> · 2단계에서 직접 확인해 볼까요?</p>`;const a=Z(t);return s===a?`<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 덜 나눈 <strong>1/${e}</strong>이 <strong>1/${r}</strong>보다 더 큽니다.</p>`:s==="C"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> ${e}등분과 ${r}등분은 조각 크기가 달라요. 덜 나눈 <strong>1/${e}</strong>이 더 큽니다.</p>`:s==="D"?`<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 덜 나눌수록 한 조각이 커져서 <strong>1/${e}</strong>이 더 큽니다.</p>`:`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 더 많이 나눌수록 한 조각은 작아져요! <strong>1/${e}</strong>(${a}번)이 더 큽니다.</p>`}function se(t){if(P)return"🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.";const e=$[t]??wt(),r=ut(q);if(!r)return`⚠️ 참여 인원은 1~${Bt} 사이의 자연수로 입력해 주세요.`;const s=_t(e,r),a=Z(t);if(s)return`집계 완료: 정답(${a}) ${s.counts[a]}/${r}명 · 미응답 ${s.noResponse}명`;if(D.every(n=>/^(?:0|[1-9]\d*)$/.test(e[n]))){const n=D.reduce((i,c)=>i+Number(e[c]),0);if(n>r)return`⚠️ 보기 인원 합계(${n}명)가 참여 인원(${r}명)보다 많습니다. 인원수를 확인해 주세요.`}return"학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요."}function re(t,e,r){if(P)return`<div class="live-poll-chart" data-chart-poll="${t}"><p class="chart-blind-msg">🙈 결과 공개 시 보기별 막대그래프가 표시됩니다.</p></div>`;const s=$[t]??wt(),[a,o]=Mt(t)?[r,e]:[e,r],n={A:`A (1/${a})`,B:`B (1/${o})`,C:"C (같다)",D:"D (모름)"},i=D.map(l=>Math.max(0,parseInt(s[l],10)||0)),c=i.reduce((l,g)=>l+g,0),u=Math.max(1,ut(q)??20,c),d=Z(t);return`<div class="live-poll-chart" data-chart-poll="${t}" role="region" aria-label="학급 투표 실시간 막대그래프">
    ${D.map((l,g)=>{const k=i[g],m=Math.min(100,Math.round(k/u*100));return`<div class="poll-bar-row">
        <span class="poll-bar-label">${n[l]}</span>
        <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill ${l===d?"poll-bar-correct":""}" x="0" y="0" width="${m}" height="14" rx="7"/></svg></div>
        <span class="poll-bar-val">${k}명 (${m}%)</span>
      </div>`}).join("")}
  </div>`}function ae(t){const e=yt[t];return`<div class="confidence-picker" role="group" aria-label="내 생각 확신 온도계">
    <span class="confidence-label">🌡️ 확신 온도:</span>
    <div class="confidence-btns">
      ${[{key:"low",label:"🌱 헷갈려요"},{key:"mid",label:"🙂 비슷해요"},{key:"high",label:"🔥 확신해요!"}].map(s=>`<button type="button" data-conf-poll="${t}" data-conf-level="${s.key}" class="secondary-btn conf-btn ${e===s.key?"solo-choice-selected":""}" aria-pressed="${e===s.key}">${s.label}</button>`).join("")}
    </div>
  </div>`}function Lt(t){const e=L>0?`🔔 짝 토론 (${L}초)`:"🔔 30초 짝 토론",r=mt!==null?`<span id="picked-group-badge" class="picked-group-badge" role="status">🎤 발표: <strong>${mt}모둠</strong>!</span>`:"";return`<div class="teacher-talk-banner">
    <p class="teacher-talk-text">${he[t]}</p>
    <div class="talk-dock" role="group" aria-label="짝 토론 및 발표 모둠 도구">
      <button type="button" id="talk-bell-btn" data-action="talk-bell" class="secondary-btn talk-dock-btn" aria-pressed="${L>0}">${e}</button>
      <button type="button" data-action="pick-group" class="secondary-btn talk-dock-btn">🎲 모둠 뽑기</button>
      ${r}
    </div>
  </div>`}function Me(t){return t?D.some(e=>t[e].trim()!==""):!1}function Yt(){if(P||!Me($.again))return"";const[t]=I().denominators.first,e=Math.max(0,parseInt($.first?.A??"0",10)||0),r=Math.max(0,parseInt($.again?.A??"0",10)||0),s=Math.max(1,ut(q)??20,e,r),a=Math.min(100,Math.round(e/s*100)),o=Math.min(100,Math.round(r/s*100)),n=r-e,i=n>0?`+${n}명`:`${n}명`;return`<div id="poll-before-after-chart" class="poll-before-after-chart" role="region" aria-label="실험 전후 학급 정답 인원 비교 차트">
    <strong>📈 실험 전(1단계) vs 실험 후(3단계) 정답(1/${t}) 인원 변화 (${i})</strong>
    <div class="poll-bar-row">
      <span class="poll-bar-label">1단계 처음</span>
      <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill" x="0" y="0" width="${a}" height="14" rx="7"/></svg></div>
      <span class="poll-bar-val">${e}명 (${a}%)</span>
    </div>
    <div class="poll-bar-row">
      <span class="poll-bar-label">3단계 실험 후</span>
      <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill poll-bar-correct" x="0" y="0" width="${o}" height="14" rx="7"/></svg></div>
      <span class="poll-bar-val">${r}명 (${o}%)</span>
    </div>
  </div>`}function zt(t,e,r){const s=$[t]??wt(),[a,o]=Mt(t)?[r,e]:[e,r],n=[`A (1/${a})`,`B (1/${o})`,"C (같다)","D (모름)"],i=t==="transfer"?"participants-transfer":"participants";return`<details class="class-poll-details" data-poll-details="${t}" ${W[t]?"open":""}>
    <summary>👩‍🏫 교실 거수 투표·인원 기록 (선택)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${Bt}명) <input id="${i}" data-participants-input="${t}" type="text" inputmode="numeric" value="${q}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" data-target-poll="${t}" class="secondary-btn" aria-pressed="${P}">${P?"👀 결과 공개하기":"🙈 결과 잠시 가리기"}</button>
      </div>
      <div class="class-poll-inputs">
        ${D.map((c,u)=>`<div class="poll-counter-card">
            <label>${n[u]} <input data-count="${c}" data-count-poll="${t}" type="text" inputmode="numeric" value="${P?"•":s[c]}" aria-label="${c} 선택 인원" autocomplete="off" ${P?"readonly":""}></label>
            <div class="poll-touch-btns">
              <button type="button" data-vote-poll="${t}" data-vote-choice="${c}" data-vote-delta="-1" class="secondary-btn vote-step-btn" aria-label="${c} 인원 1명 줄이기">−1</button>
              <button type="button" data-vote-poll="${t}" data-vote-choice="${c}" data-vote-delta="1" class="secondary-btn vote-step-btn" aria-label="${c} 인원 1명 추가">＋1</button>
            </div>
          </div>`).join("")}
      </div>
      <div class="poll-helpers">
        <button type="button" data-action="fill-zeros" data-target-poll="${t}" class="secondary-btn">빈 칸 0으로 채우기</button>
        <button type="button" data-action="fill-sample" data-target-poll="${t}" class="secondary-btn">예시 인원 채우기</button>
      </div>
      ${re(t,e,r)}
      ${t==="again"?Yt():""}
      <p class="class-poll-status" data-status-poll="${t}" role="status">${se(t)}</p>
    </div>
  </details>`}function Ce(){const t=I(),[e,r]=t.denominators.first,s=vt[S]??vt.M01;return`
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${Ot().map(o=>{const n=o.id===S,i=at.has(o.id),c=o.title.replace(" · "," (")+")";return`<button type="button" data-unit-id="${o.id}" class="unit-card-btn ${n?"unit-card-active":""}" aria-pressed="${n}">
      <strong>${c}</strong>
      <span class="unit-stamp-tag">${i?"⭐ 완료":n?"🔍 탐구 중":"시작"}</span>
    </button>`}).join("")}
    </div>

    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${e}과 1/${r} 비교</h2>

      <div class="story-dilemma-card" role="region" aria-label="${s.badge}">
        <span class="story-badge">${s.badge}</span>
        <p class="question-lead">${s.lead}</p>
        <button type="button" data-action="speak-story" class="secondary-btn tts-btn">🔊 읽어주기</button>
        ${Ut?'<p id="tts-status" class="tts-status" role="status">🔊 음성으로 읽어주었어요!</p>':""}
      </div>

      <div class="visual-controls-bar">
        <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
          <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${x==="circle"}">${x==="circle"?"📏 막대 모양":"🍕 원형 모양"}</button>
        </div>
        <div class="spoiler-hint-row">
          <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${Q}">
            ${Q?"🙈 눈금 가리기":"👀 눈금 힌트"}
          </button>
          <button type="button" data-action="toggle-pattern" class="secondary-btn" aria-pressed="${v}">
            ${v?"🎨 기본 색상":"🎨 빗금 패턴"}
          </button>
        </div>
      </div>
      <div class="bar-pair">${ft(e,!Q)}${ft(r,!Q)}</div>

      ${Nt("first",e,r)}
      ${Rt("first",e,r)}

      <div class="followup-zone ${C.first?"followup-ready":""}">
        ${ae("first")}
        <div class="reason-section">
          <h3>💭 왜 그렇게 생각했나요?</h3>
          <div class="actions reason-bubble-list">
            ${ve.map((o,n)=>`<button type="button" data-reason="${n}" class="reason-bubble-btn" aria-label="${o}" aria-pressed="${Y===String(n)}">
                <span class="student-bubble">${Qt[n]}</span>
              </button>`).join("")}
          </div>
          ${kt?`<p class="ai-linked-badge">🤖 AI 추천 연결: <strong>${kt}</strong></p>`:""}
        </div>
      </div>

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Lt("think")}
        ${zt("first",e,r)}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn">② 직접 실험하러 가기 →</button>
      </div>
    </div>`}function ne(t){const e=t<f?">":t>f?"<":"=",r=t<f?`${t}등분 한 조각이 ${f}등분 한 조각보다 더 큽니다`:t>f?`${f}등분 한 조각이 ${t}등분 한 조각보다 더 큽니다`:"두 조각의 크기가 같습니다";return{barsHtml:`${ft(t)}${ft(f)}`,badgeHtml:`크기 비교: <strong>1/${t} ${e} 1/${f}</strong> (${r})`,discoveryHtml:lt?'<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>':""}}function $t(){const t=Math.max(1,Math.min(f,F)),{fill:e,bg:r,stroke:s}=Wt(),a=600/f,o=a*t,n=Array.from({length:f-1},(u,d)=>{const l=((d+1)*a).toFixed(2);return`<line x1="${l}" y1="10" x2="${l}" y2="54" stroke="${s}" stroke-width="2"/>`}).join(""),i=t===f,c=v?`<line x1="4" y1="22" x2="${Math.max(6,o-4).toFixed(2)}" y2="22" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="6 4"/><line x1="4" y1="42" x2="${Math.max(6,o-4).toFixed(2)}" y2="42" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="2 5"/>`:"";return`<figure class="whole-fill-figure ${v?"pattern-active":""}">
      <svg viewBox="0 0 600 66" role="img" aria-label="1/${f} 조각을 ${t}개 모아 ${t}/${f}만큼 채운 막대">
        <rect x="0" y="10" width="600" height="44" rx="6" fill="${r}" stroke="${s}" stroke-width="3"/>
        <rect x="0" y="10" width="${o.toFixed(2)}" height="44" rx="4" fill="${e}"/>
        ${c}
        ${n}
      </svg>
      <figcaption>1/${f} 조각 <strong>${t}개</strong> = <strong>${t}/${f}</strong> ${i?"(= 전체 1 완성!)":""}</figcaption>
    </figure>
    <div class="fill-whole-controls" role="group" aria-label="단위분수 조각 모아 전체 1 채우기 조작">
      <button type="button" data-action="fill-piece-add" class="secondary-btn" ${i?"disabled":""}>➕ 1/${f} 추가</button>
      <button type="button" data-action="fill-piece-full" class="secondary-btn" ${i?"disabled":""}>⚡ 끝까지 채우기</button>
      <button type="button" data-action="fill-piece-reset" class="secondary-btn" ${t<=1?"disabled":""}>🔄 비우기</button>
    </div>
    <p id="fill-whole-status" class="answer" role="status">${i?`🎉 <strong>전체 1 완성!</strong> <strong>1/${f}</strong> 조각 <strong>${f}개</strong>로 전체 1을 채웠어요!`:`🧩 현재 <strong>${t}/${f}</strong> · 전체 1까지 <strong>${f-t}개</strong> 남았어요!`}</p>`}function Dt(){F=Math.max(1,Math.min(f,F));const{barsHtml:t,badgeHtml:e,discoveryHtml:r}=ne(E),s=b.querySelector("#explore-exp2-bars");s&&(s.innerHTML=t);const a=b.querySelector("#explore-base-output");a&&(a.textContent=`기준 분수: 1/${E} (${E}등분)`);const o=b.querySelector('button[data-action="base-less"]');o&&(o.disabled=E<=st);const n=b.querySelector('button[data-action="base-more"]');n&&(n.disabled=E>=rt);const i=b.querySelector("#explore-denom-output");i&&(i.textContent=`${f}등분 (1/${f})`);const c=b.querySelector("#explore-slider");c&&c.value!==String(f)&&(c.value=String(f));const u=b.querySelector('button[data-action="less"]');u&&(u.disabled=f<=st);const d=b.querySelector('button[data-action="more"]');d&&(d.disabled=f>=rt),b.querySelectorAll("button[data-quick-denom]").forEach(m=>{const A=Number(m.dataset.quickDenom)===f;m.setAttribute("aria-pressed",String(A)),m.classList.toggle("quick-denom-active",A)});const l=b.querySelector("#explore-cmp-badge");l&&(l.innerHTML=e);const g=b.querySelector("#explore-discovery-2");g&&(g.innerHTML=r);const k=b.querySelector("#fill-whole-box");k&&(k.innerHTML=$t())}function Se(t,e){return C.first==="B"||Y==="0"?`🎯 <strong>맞춤 실험 미션</strong>: 분모(${e})가 클수록 조각도 클까요? <strong>[실험 1 · 조각 포개기]</strong>와 <strong>[실험 3 · 전체 1 채우기]</strong>를 해 보세요!`:C.first==="C"||Y==="2"?"🎯 <strong>맞춤 실험 미션</strong>: <strong>[실험 4 · 등분할 조건]</strong>과 <strong>[실험 6 · 전체 크기가 다를 때]</strong>를 먼저 확인해 보세요!":C.first==="A"||Y==="1"?"🎯 <strong>맞춤 실험 미션</strong>: <strong>[실험 2 · 분모 자유 비교]</strong>와 <strong>[실험 5 · 수직선 깃발]</strong>에 도전해 보세요!":"🎯 <strong>맞춤 실험 미션</strong>: 아래 <strong>[실험 1 · 조각 포개기]</strong>부터 차례대로 눌러 조각 크기를 비교해 보세요!"}function Ae(){const s=[...j].sort((n,i)=>n-i),a=[18,30,42],o=s.map((n,i)=>{const c=(44+512/n).toFixed(2),u=a[i%a.length];return`<g>
      <line x1="${c}" y1="${u}" x2="${c}" y2="56" stroke="#d9381e" stroke-width="2.2"/>
      <circle cx="${c}" cy="56" r="4.5" fill="#d9381e"/>
      <text x="${c}" y="${u-2}" text-anchor="middle" font-size="12" font-weight="800" fill="#d9381e">🚩1/${n}</text>
    </g>`}).join("");return`<figure class="flag-line-figure">
    <svg viewBox="0 0 600 84" role="img" aria-label="0부터 1까지 수직선 위에 ${s.map(n=>`1/${n}`).join(", ")} 깃발을 꽂아 위치를 비교한 모형">
      <line x1="44" y1="56" x2="556" y2="56" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3.5"/>
      <line x1="44" y1="42" x2="44" y2="68" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <line x1="556" y1="42" x2="556" y2="68" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${o}
      <text x="44" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="556" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">1 (전체)</text>
    </svg>
    <figcaption>꽂힌 깃발(${s.length}개): <strong>${s.length>0?s.map(n=>`1/${n}`).join(" > "):"없음"}</strong></figcaption>
  </figure>`}function _e(){const[t,e]=I().denominators.first,r=dt(C.first,t,e,"first"),s=Y!==""?Qt[Number(Y)]:"직접 실험으로 확인하기",a=600/t,o=600/e,n=Math.max(0,a-o),{barsHtml:i,badgeHtml:c,discoveryHtml:u}=ne(E),d=$e.map(A=>{const H=f===A;return`<button type="button" data-quick-denom="${A}" class="secondary-btn quick-denom-btn ${H?"quick-denom-active":""}" aria-pressed="${H}">👧 ${A}명 (1/${A})</button>`}).join(""),l=Zt.map(A=>{const H=j.includes(A);return`<button type="button" data-flag-denom="${A}" class="secondary-btn ${H?"quick-denom-active":""}" aria-pressed="${H}">🚩 1/${A}</button>`}).join(""),g=M==="all"||M==="core",k=M==="all"||M==="concept",m=M==="all"||M==="life";return`
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 분수 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>처음 생각</strong>: <strong>${r}</strong> <span class="hypothesis-sub">(${s})</span></p>
        <p id="adaptive-mission-card" class="adaptive-mission-card">${Se(t,e)}</p>
      </div>

      <div class="exp-tab-bar" role="group" aria-label="실험 묶음 선택">
        <button type="button" data-explore-tab="all" class="secondary-btn exp-tab-btn ${M==="all"?"quick-denom-active":""}" aria-pressed="${M==="all"}">🌟 전체 보기</button>
        <button type="button" data-explore-tab="core" class="secondary-btn exp-tab-btn ${M==="core"?"quick-denom-active":""}" aria-pressed="${M==="core"}">✂️ 핵심 비교 (실험 1·2)</button>
        <button type="button" data-explore-tab="concept" class="secondary-btn exp-tab-btn ${M==="concept"?"quick-denom-active":""}" aria-pressed="${M==="concept"}">🧩 원리 실험 (실험 3·4)</button>
        <button type="button" data-explore-tab="life" class="secondary-btn exp-tab-btn ${M==="life"?"quick-denom-active":""}" aria-pressed="${M==="life"}">🚩 수직선·실생활 (실험 5·6·7)</button>
      </div>

      ${g?`
        <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
          <h3>✂️ 실험 1 · 두 조각 포개어 대어 보기</h3>
          <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${nt}">
            ${nt?"✂️ 포개어 비교한 결과 닫기":"✂️ 1/"+t+" 조각과 1/"+e+" 조각 포개어 비교하기"}
          </button>

          ${nt?`
            <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
              <svg viewBox="0 0 600 92" role="img" aria-label="1/${t} 조각과 1/${e} 조각을 겹쳐 길이 차이를 비교한 그림">
                <rect x="0" y="8" width="600" height="74" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
                <rect x="0" y="14" width="${a.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                <text x="${Math.min(535,a+8).toFixed(2)}" y="32" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${t} 한 조각</text>
                <rect x="0" y="46" width="${o.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                <rect x="${o.toFixed(2)}" y="46" width="${n.toFixed(2)}" height="26" rx="4" fill="#fde2e2" stroke="#d9381e" stroke-width="2" stroke-dasharray="4 2"/>
                <text x="${Math.min(430,a+8).toFixed(2)}" y="64" font-size="13" font-weight="800" fill="#d9381e">← 이만큼 1/${t}이 더 길어요!</text>
                <line x1="${o.toFixed(2)}" y1="10" x2="${o.toFixed(2)}" y2="78" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
              </svg>
              <p class="answer">💡 <strong>발견 1</strong>: 덜 나눈 <strong>1/${t}</strong> 조각이 <strong>1/${e}</strong> 조각보다 빨간 점선 칸만큼 확실히 더 깁니다!</p>
            </div>
          `:""}
        </section>

        <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
          <h3>🎚️ 실험 2 · 양쪽 분모(2~12등분) 자유 비교</h3>

          <div class="visual-controls-bar">
            <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
              <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${x==="circle"}">${x==="circle"?"📏 막대 모양":"🍕 원형 모양"}</button>
            </div>
            <div class="base-denom-controls" role="group" aria-label="위쪽 기준 분수 분모 조절">
              <button type="button" data-action="base-less" class="secondary-btn" ${E<=st?"disabled":""} aria-label="기준 분모 줄이기">기준 −1</button>
              <output id="explore-base-output" aria-live="polite">기준 분수: 1/${E} (${E}등분)</output>
              <button type="button" data-action="base-more" class="secondary-btn" ${E>=rt?"disabled":""} aria-label="기준 분모 늘리기">기준 ＋1</button>
              <button type="button" data-action="toggle-pattern" class="secondary-btn" aria-pressed="${v}">
                ${v?"🎨 기본 색상":"🎨 빗금 패턴"}
              </button>
            </div>
          </div>

          <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">
            ${d}
          </div>

          <div id="explore-exp2-bars" class="bar-pair">${i}</div>

          <div class="slider-experiment-controls">
            <button type="button" data-action="less" ${f<=st?"disabled":""} aria-label="등분 수 줄이기">−</button>
            <input id="explore-slider" type="range" min="${st}" max="${rt}" value="${f}" aria-label="나누는 조각 수 슬라이더">
            <output id="explore-denom-output" aria-live="polite">${f}등분 (1/${f})</output>
            <button type="button" data-action="more" ${f>=rt?"disabled":""} aria-label="등분 수 늘리기">＋</button>
          </div>

          <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${c}</p>
          <div id="explore-discovery-2" aria-live="polite">${u}</div>
        </section>
      `:""}

      ${k?`
        <div class="exp-grid-2col">
          <section class="experiment-box" aria-label="실험 3 단위분수 조각 모아 전체 1 채우기">
            <h3>🧩 실험 3 · 조각 모아 '전체 1' 채우기</h3>
            <div id="fill-whole-box">${$t()}</div>
          </section>

          <section class="experiment-box fair-cut-box" aria-label="실험 4 공평하게 똑같이 나누기 조건 실험">
            <h3>🔪 실험 4 · 공평하게 나누기(등분할) 조건</h3>
            <figure class="fair-cut-figure">
              <svg viewBox="0 0 600 66" role="img" aria-label="${_?"눈금을 똑같은 간격(200씩)으로 정렬해 바르게 3등분한 1/3 모형":"눈금이 90, 260으로 불공평하게 잘려 크기가 제각각인 3조각 모형"}">
                <rect x="0" y="10" width="600" height="44" rx="6" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
                <rect x="0" y="10" width="${_?200:90}" height="44" rx="4" fill="${_?"#ffca62":"#fde2e2"}"/>
                <line x1="${_?200:90}" y1="10" x2="${_?200:90}" y2="54" stroke="#d9381e" stroke-width="3"/>
                <line x1="${_?400:260}" y1="10" x2="${_?400:260}" y2="54" stroke="#d9381e" stroke-width="3"/>
                <text x="300" y="37" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">${_?"✅ 세 조각의 크기가 모두 똑같음 → 진짜 1/3!":"⚠️ 조각 크기가 제각각(불공평 분할) → 1/3이 아니에요!"}</text>
              </svg>
            </figure>
            <button type="button" data-action="toggle-fair-cut" class="secondary-btn" aria-pressed="${_}">
              ${_?"🔀 불공평 분할 보기":"📏 똑같은 간격(등분할) 정렬"}
            </button>
            <p id="fair-cut-status" class="answer" role="status">${_?"🎉 <strong>등분할 성공!</strong> 전체를 <strong>똑같은 크기</strong>로 나누었을 때만 <strong>1/3</strong>이라고 부를 수 있어요!":"💡 조각 크기가 다르면 3조각 중 1조각이어도 <strong>1/3이 아닙니다</strong>. 똑같이 나누어 보세요!"}</p>
          </section>
        </div>
      `:""}

      ${m?`
        <section class="experiment-box flag-line-box" aria-label="실험 5 수직선 위에 단위분수 깃발 꽂기">
          <h3>📍 실험 5 · 0~1 수직선 단위분수 깃발 꽂기</h3>
          <div class="flag-controls" role="group" aria-label="수직선 깃발 선택">
            ${l}
            <button type="button" data-action="flag-all" class="secondary-btn">🚩 모두 꽂기</button>
            <button type="button" data-action="flag-reset" class="secondary-btn">🔄 기본 깃발</button>
          </div>
          ${Ae()}
          <p id="flag-line-status" class="answer" role="status">${j.length>=4?"🎉 <strong>한눈에 발견!</strong> 분모가 <strong>2 → 3 → 4 → 6 → 12</strong>로 커질수록 깃발이 <strong>0 쪽으로 가까워집니다!</strong>":"📍 깃발을 더 눌러 분모가 커질수록 0과 1 중 어디에 가까워지는지 비교해 보세요!"}</p>
        </section>

        <div class="exp-grid-2col">
          <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
            <h3>😮 실험 6 · 원래 ${ht()} 전체 크기가 다르면?</h3>
            <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${ot}">
              ${ot?"😮 깜짝 실험 닫기":"😮 미니 간식의 1/2 vs 특대형 간식의 1/4 보기"}
            </button>
            ${ot?`
              <div class="trap-experiment-content" role="region" aria-label="전체 크기가 서로 다른 두 간식 비교">
                <svg viewBox="0 0 600 84" role="img" aria-label="작은 미니 간식의 1/2 조각(길이 100)과 특대형 간식의 1/4 조각(길이 140) 비교">
                  <rect x="0" y="10" width="200" height="26" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <rect x="0" y="10" width="100" height="26" rx="4" fill="#ffca62" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <text x="212" y="28" font-size="13" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">작은 미니 ${ht()}의 1/2</text>
                  <rect x="0" y="46" width="560" height="26" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <rect x="0" y="46" width="140" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <text x="150" y="64" font-size="13" font-weight="700" fill="#d9381e">특대형 ${ht()}의 1/4 (더 큼!)</text>
                </svg>
                <p class="answer">💡 <strong>깜짝 발견!</strong> 원래 전체 크기가 다르면 <strong>1/4</strong>이 <strong>1/2</strong>보다 클 수도 있어요! 반드시 <strong>"전체 크기가 같다"</strong>는 약속이 필요합니다.</p>
              </div>
            `:""}
          </section>

          <section class="experiment-box reallife-box" aria-label="생활 속 숨은 단위분수 찾기">
            <h3>🕒 실험 7 · 시계(60분)·판초콜릿(12칸) 분수</h3>
            <button type="button" data-action="toggle-reallife" class="secondary-btn" aria-pressed="${it}">
              ${it?"🕒 생활 속 실험 닫기":"🕒 1시간의 1/2(30분) vs 1/4(15분) & 12칸 초콜릿"}
            </button>
            ${it?`
              <div class="reallife-content" role="region" aria-label="시계판과 12칸 초콜릿 단위분수 비교">
                <div class="reallife-grid">
                  <div class="reallife-item">
                    <strong>⏰ 1시간(60분) 시계판</strong>
                    <div class="reallife-svg-wrap">
                      <svg viewBox="0 0 220 90" role="img" aria-label="1시간의 1/2(30분 반원)과 1/4(15분 부채꼴) 비교 시계판">
                        <circle cx="55" cy="45" r="34" fill="#fff" stroke="#153a69" stroke-width="2.5"/>
                        <path d="M 55 45 L 55 11 A 34 34 0 0 1 55 79 Z" fill="#ffca62"/>
                        <circle cx="55" cy="45" r="34" fill="none" stroke="#153a69" stroke-width="2.5"/>
                        <text x="55" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/2시간 = 30분</text>
                        <circle cx="165" cy="45" r="34" fill="#fff" stroke="#153a69" stroke-width="2.5"/>
                        <path d="M 165 45 L 165 11 A 34 34 0 0 1 199 45 Z" fill="#7cc6fe"/>
                        <circle cx="165" cy="45" r="34" fill="none" stroke="#153a69" stroke-width="2.5"/>
                        <text x="165" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/4시간 = 15분</text>
                      </svg>
                    </div>
                    <p><strong>1/2시간(30분) &gt; 1/4시간(15분)</strong></p>
                  </div>
                  <div class="reallife-item">
                    <strong>🍫 12칸 판초콜릿</strong>
                    <div class="reallife-svg-wrap">
                      <svg viewBox="0 0 220 90" role="img" aria-label="12칸 판초콜릿의 1/3(4칸)과 1/4(3칸) 비교">
                        <rect x="10" y="14" width="90" height="52" rx="4" fill="#fff" stroke="#5c3317" stroke-width="2"/>
                        <rect x="10" y="14" width="30" height="52" rx="3" fill="#e08e2b"/>
                        <line x1="40" y1="14" x2="40" y2="66" stroke="#5c3317" stroke-width="2"/>
                        <line x1="70" y1="14" x2="70" y2="66" stroke="#5c3317" stroke-width="2"/>
                        <text x="55" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">12칸의 1/3 = 4칸</text>
                        <rect x="120" y="14" width="90" height="52" rx="4" fill="#fff" stroke="#5c3317" stroke-width="2"/>
                        <rect x="120" y="14" width="22.5" height="52" rx="3" fill="#7cc6fe"/>
                        <line x1="142.5" y1="14" x2="142.5" y2="66" stroke="#5c3317" stroke-width="2"/>
                        <line x1="165" y1="14" x2="165" y2="66" stroke="#5c3317" stroke-width="2"/>
                        <line x1="187.5" y1="14" x2="187.5" y2="66" stroke="#5c3317" stroke-width="2"/>
                        <text x="165" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">12칸의 1/4 = 3칸</text>
                      </svg>
                    </div>
                    <p><strong>1/3(4칸) &gt; 1/4(3칸)</strong></p>
                  </div>
                </div>
              </div>
            `:""}
          </section>
        </div>
      `:""}

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Lt("explore")}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`}function Ee(){const[t,e]=I().denominators.first,[r,s]=I().denominators.transfer,a=J.filter(l=>ct[l.id]===l.answer).length,o=J.map(l=>{const g=ct[l.id],k=g===l.answer;return`<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${l.id+1}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${l.id+1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${l.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${g==="left"?"solo-choice-selected":""}" aria-pressed="${g==="left"}">1/${l.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${l.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${g==="right"?"solo-choice-selected":""}" aria-pressed="${g==="right"}">1/${l.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${g===null?"👆 터치!":k?"🎉 정답!":`💡 1/${Math.min(l.leftDenom,l.rightDenom)}이 더 커요!`}</span>
    </div>`}).join(""),n=w.length===Xt.length,i=n&&w[0]===2&&w[1]===6&&w[2]===9,c=n?i?"🎉 <strong>칙칙폭폭 출발!</strong> <strong>1/2 &gt; 1/6 &gt; 1/9</strong> 순서로 완벽하게 줄을 세웠어요!":"💡 <strong>다시 줄을 세워 볼까요?</strong> 분모가 작을수록 조각이 더 커요. 가장 큰 조각(1/2)부터 태워 보세요!":"👆 가장 큰 조각부터 차례대로 눌러 1호차 → 2호차 → 3호차에 태워 보세요!",u=X!==null&&X>3&&X<7,d=X===null?"🕵️ 1/3보다 작고 1/7보다 큰 단위분수의 분모 □를 골라 보세요!":u?`🎉 <strong>추리 성공!</strong> 3 &lt; <strong>${X}</strong> &lt; 7이므로 <strong>1/3 &gt; 1/${X} &gt; 1/7</strong>이 성립합니다!`:"💡 <strong>다시 추리해 볼까요?</strong> 3과 7 사이에 있는 분모 숫자를 골라 보세요!";return`
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 내 생각 확인과 분수 대결</h2>

      <div class="check-grid-2col">
        <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
          <h3>1) 처음 문제 다시 고르기 (1/${t} vs 1/${e})</h3>
          <p class="first-memory-tag">💭 1단계 처음 생각: <strong>${dt(C.first,t,e,"first")}</strong></p>
          ${Nt("again",t,e)}
          ${Rt("again",t,e)}
          ${ae("again")}
          ${zt("again",t,e)}
        </section>

        <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
          <h3>2) 응용 문제 도전 (<strong>1/${s}</strong> vs <strong>1/${r}</strong>)</h3>
          ${we(s,r,!0)}
          ${Nt("transfer",r,s)}
          ${Rt("transfer",r,s)}
          ${zt("transfer",r,s)}
        </section>
      </div>

      <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
        <div class="duel-header-row">
          <h3>3) ⚡ 번개 미니게임 · 더 큰 분수 고르기</h3>
          <button type="button" data-action="duel-shuffle" class="secondary-btn">🎲 랜덤 3문제</button>
        </div>
        <div class="duel-rounds-list">
          ${o}
        </div>
        <p class="duel-score-banner" role="status">🎯 점수: <strong>${a} / ${J.length}</strong> ${a===J.length?"🏆 퍼펙트!":""} · <span id="duel-streak-badge">🔥 콤보: ${gt}연속</span></p>
      </section>

      <div class="check-grid-2col">
        <section class="check-subcard train-puzzle-box" aria-label="분수 기차 줄 세우기 퍼즐">
          <h3>4) 🚂 분수 기차 (큰 조각부터 태우기)</h3>
          <div class="train-pick-row" role="group" aria-label="기차에 태울 단위분수 고르기">
            ${Xt.map(l=>`<button type="button" data-train-denom="${l}" class="secondary-btn train-pick-btn" ${w.includes(l)?"disabled":""}>🚂 1/${l} 태우기</button>`).join("")}
            <button type="button" data-action="train-reset" class="secondary-btn">🔄 다시</button>
          </div>
          <div class="train-cars" role="group" aria-label="분수 기차 칸">
            ${[0,1,2].map(l=>`<div class="train-car">${l+1}호차: <strong>${w[l]?`1/${w[l]}`:"빈칸"}</strong></div>`).join('<span class="train-link" aria-hidden="true">&gt;</span>')}
          </div>
          <p id="train-status" class="answer" role="status">${c}</p>
        </section>

        <section class="check-subcard mystery-quiz-box" aria-label="숨은 분모 추리 퀴즈">
          <h3>5) 🕵️ 숨은 분모 추리 (<strong>1/3 &gt; 1/□ &gt; 1/7</strong>)</h3>
          <div class="mystery-pick-row" role="group" aria-label="빈칸 분모 후보 고르기">
            ${xe.map(l=>`<button type="button" data-mystery-denom="${l}" class="secondary-btn mystery-btn ${X===l?"solo-choice-selected":""}" aria-pressed="${X===l}">□ = ${l} (1/${l})</button>`).join("")}
          </div>
          <p id="mystery-status" class="answer" role="status">${d}</p>
        </section>
      </div>

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Lt("check")}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`}function Pe(){at.add(S);const t=I(),[e,r]=t.denominators.first,[s,a]=t.denominators.transfer,o=vt[S]??vt.M01,n=G?"작아집니다!":N==="bigger"?"커집니다(?)":N==="same"?"같습니다(?)":"______",i=C.again===Z("again"),c=C.transfer===Z("transfer"),u=i&&c?"🏆 최고예요! 단위분수의 크기 비교 원리를 완벽하게 마스터했어요!":i||c?"🌟 참 잘했어요! 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!":"🌱 끝까지 스스로 실험하며 단위분수의 비밀을 탐구했어요!",d=ut(q),l=!P&&d&&$.first?_t($.first,d):null,g=!P&&d&&$.again?_t($.again,d):null,k=!P&&d&&$.transfer?_t($.transfer,d):null,m=[];if(l&&g&&d){const T=de(l.counts.A,g.counts.A,d);m.push(`처음·재선택 정답(1/${e}) 인원: <strong>${l.counts.A}/${d}명 → ${g.counts.A}/${d}명</strong> (${T>=0?"+":""}${T.toFixed(1)}%p)`)}k&&d&&m.push(`응용 문제 정답(1/${s}, B번) 인원: <strong>${k.counts.B}/${d}명</strong>`);const A=m.length>0?`<p class="comparison">👩‍🏫 <strong>학급 집계 요약</strong>: ${m.join(" · ")}</p>`:"",H=G?'<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>':N==="bigger"||N==="same"?'<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 나누는 사람 수를 늘렸을 때 한 조각 크기가 어떻게 변했나요?</p>':"",Ct=O==="correct"?`<p id="letter-reply" class="answer feedback-correct" role="status">📬 <strong>${o.friend}의 답장</strong>: "아하! 더 많은 사람이 나눌수록 한 조각이 작아지니까 분모가 작은 단위분수가 더 크구나. 고마워!"</p>`:O==="wrong"?`<p id="letter-reply" class="answer feedback-hint" role="status">💡 ${o.friend}가 아직 헷갈려해요! 더 많이 나눌수록 한 조각이 어떻게 변했는지 다시 골라 볼까요?</p>`:"",St={"":"미선택",low:"🌱 조금 헷갈려요",mid:"🙂 어느 정도 맞을 것 같아요",high:"🔥 완전히 확신해요!"},Ft=`<p id="metacog-summary" class="metacog-summary">🌡️ <strong>확신 온도 변화</strong>: 처음 <strong>[${St[yt.first]}]</strong> → 실험 후 <strong>[${St[yt.again]}]</strong></p>`,qt=K==="right"?"🎉 <strong>정답이에요!</strong> 같은 <strong>1/5</strong> 조각을 더 많이 모은 <strong>3/5</strong>(3개)이 <strong>2/5</strong>(2개)보다 더 큽니다!":K==="left"?"💡 <strong>다시 살펴볼까요?</strong> 똑같은 <strong>1/5 조각</strong> 2개와 3개 중 어느 쪽이 더 길까요?":"👆 똑같은 1/5 조각을 2개 모은 2/5와 3개 모은 3/5 중 더 큰 쪽을 골라 보세요!",V=Ot(),pt=V.find(T=>!at.has(T.id))??V[(V.findIndex(T=>T.id===S)+1)%V.length],jt=V.map(T=>{const At=at.has(T.id);return`<div class="stamp-item ${At?"stamp-done":""}">
      <span class="stamp-icon">${At?"🎖️ 클리어!":"🔒 미도전"}</span>
      <strong>${T.title}</strong>
    </div>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 성장 카드와 마스터 스탬프</h2>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${u}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 생각 (1/${e} vs 1/${r})</span>
            <strong>${dt(C.first,e,r,"first")}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${i?"journey-correct":""}">
            <span class="journey-label">② 실험 후 (1/${e} vs 1/${r})</span>
            <strong>${dt(C.again,e,r,"again")} ${i?"⭐":""}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${c?"journey-correct":""}">
            <span class="journey-label">③ 응용 문제 (1/${a} vs 1/${s})</span>
            <strong>${dt(C.transfer,s,a,"transfer")} ${c?"⭐":""}</strong>
          </div>
        </div>
        ${Ft}
        ${A}
        ${Yt()}
      </div>

      <div class="result-grid-2col">
        <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
          <h3>🧩 오늘의 단위분수 규칙 완성하기</h3>
          <div class="notebook-line">
            <p>"같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${n} ]</strong>"</p>
          </div>
          <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
            <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn ${N==="bigger"?"rule-card-wrong":""}" aria-pressed="${N==="bigger"}">📈 커집니다</button>
            <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${G?"solo-choice-selected":""}" aria-pressed="${G}">📉 작아집니다!</button>
            <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn ${N==="same"?"rule-card-wrong":""}" aria-pressed="${N==="same"}">🟰 같습니다</button>
          </div>
          ${H}
        </div>

        <div class="friend-letter-card" role="region" aria-label="고민하던 친구에게 보내는 설명 편지">
          <h3>💌 ${o.friend}에게 설명 편지 보내기</h3>
          <div class="letter-choice-list" role="group" aria-label="친구에게 보낼 설명 고르기">
            <button type="button" data-letter-choice="correct" class="secondary-btn letter-choice-btn ${O==="correct"?"solo-choice-selected":""}" aria-pressed="${O==="correct"}">💌 "같은 전체를 더 많이 나눌수록 한 조각의 크기는 작아지기 때문이야!"</button>
            <button type="button" data-letter-choice="wrong" class="secondary-btn letter-choice-btn ${O==="wrong"?"rule-card-wrong":""}" aria-pressed="${O==="wrong"}">💌 "분모 숫자가 크면 한 조각의 크기도 항상 커지기 때문이야!"</button>
          </div>
          ${Ct}
        </div>
      </div>

      <div class="result-grid-2col">
        <div class="bridge-mission-card" role="region" aria-label="다음 개념 연결 분모가 같은 진분수 비교">
          <h3>🚀 다음 차시 브릿지 · <strong>2/5 vs 3/5</strong></h3>
          <figure class="bridge-figure">
            <svg viewBox="0 0 600 84" role="img" aria-label="5등분 중 2조각을 칠한 2/5 막대와 3조각을 칠한 3/5 막대 비교">
              <rect x="0" y="8" width="600" height="28" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <rect x="0" y="8" width="240" height="28" rx="4" fill="#ffca62"/>
              <line x1="120" y1="8" x2="120" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <line x1="240" y1="8" x2="240" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <line x1="360" y1="8" x2="360" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <line x1="480" y1="8" x2="480" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="252" y="27" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">2/5 (1/5이 2개)</text>
              <rect x="0" y="46" width="600" height="28" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <rect x="0" y="46" width="360" height="28" rx="4" fill="#7cc6fe"/>
              <line x1="120" y1="46" x2="120" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <line x1="240" y1="46" x2="240" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <line x1="360" y1="46" x2="360" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <line x1="480" y1="46" x2="480" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="372" y="65" font-size="13" font-weight="800" fill="#d9381e">3/5 (1/5이 3개)</text>
            </svg>
          </figure>
          <div class="bridge-choice-row" role="group" aria-label="2/5와 3/5 중 더 큰 분수 고르기">
            <button type="button" data-bridge-pick="left" class="secondary-btn ${K==="left"?"rule-card-wrong":""}" aria-pressed="${K==="left"}">🧩 2/5가 더 크다</button>
            <button type="button" data-bridge-pick="right" class="secondary-btn ${K==="right"?"solo-choice-selected":""}" aria-pressed="${K==="right"}">🧩 3/5가 더 크다</button>
          </div>
          <p id="bridge-status" class="answer" role="status">${qt}</p>
        </div>

        <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
          <h3>🎖️ 분수 탐구 스탬프 투어 (${at.size} / ${V.length} 클리어!)</h3>
          <div class="stamp-grid">
            ${jt}
          </div>
        </div>
      </div>

      <div class="print-certificate-box" role="region" aria-label="단위분수 탐구 박사 인증서 서명란">
        <p class="cert-title">🎓 단위분수 탐구 박사 인증서 · 배움 공책 붙임용</p>
        <p class="cert-sign-line">학번·이름: ____________________ &nbsp;|&nbsp; 오늘 나의 한 줄 소감: ________________________________________</p>
      </div>

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Lt("result")}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄</button>
        <button type="button" data-action="next-unit" data-next-unit-id="${pt.id}" class="primary-next-btn">🚀 다음 이야기(${pt.title.split("·")[0].trim()}) →</button>
        <button type="button" data-action="restart" class="secondary-btn">🔄 다시 하기</button>
      </div>
    </div>`}function De(){switch(y){case"think":return Ce();case"explore":return _e();case"check":return Ee();case"result":return Pe()}}function Be(){const t=te(),e=ee();return`<header class="slim-header">
    <div class="header-brand">
      <h1>🧭 생각의 갈림길 AI</h1>
      <span class="eyebrow">${Jt?"로컬 AI 수업":"단위분수 탐구"}</span>
    </div>
    <div class="header-controls">
      <button id="sound-toggle" class="scale-toggle" aria-label="효과음 전환" aria-pressed="${z}" type="button">${z?"🔊 효과음":"🔇 음소거"}</button>
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${e}" type="button">${e?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${t}" type="button">${t?"☀️":"🌙"}</button>
    </div>
  </header>`}function Te(){const t=B.indexOf(y);return`<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${B.map((e,r)=>{const s=r<t,a=r===t;return`<button type="button" class="${s?"step-pill done":a?"step-pill current":"step-pill"}" data-step-index="${r}" aria-current="${a?"step":"false"}">${Ht[e]}</button>`}).join("")}
    </div>
  </nav>`}function p(t=!1){y!=="check"&&(x==="numberline"||x==="cup")&&(x="bar");const e=Ht[y];if(b.innerHTML=[Be(),Te(),`<section id="step" role="region" aria-label="${e}">${De()}<p id="error" role="alert">${tt}</p></section>`,'<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>',"<footer>🔒 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>"].join(""),Tt?.sync(y==="think"),t){b.querySelector("#step h2")?.focus();const r=b.querySelector("#step-announce");r&&(r.textContent=`${Ht[y]} 단계로 이동했습니다.`)}}function Kt(){const t=I(),[e,r]=t.denominators.first,[s,a]=t.denominators.transfer;b.querySelectorAll(".class-poll-status[data-status-poll]").forEach(i=>{const c=i.dataset.statusPoll;i.textContent=se(c)}),b.querySelectorAll(".live-poll-chart[data-chart-poll]").forEach(i=>{const c=i.dataset.chartPoll,[u,d]=c==="transfer"?[s,a]:[e,r];i.outerHTML=re(c,u,d)});const o=b.querySelector("#poll-before-after-chart"),n=Yt();o?n?o.outerHTML=n:o.remove():n&&b.querySelector('.live-poll-chart[data-chart-poll="again"]')?.insertAdjacentHTML("afterend",n),b.querySelectorAll("input[data-participants-input]").forEach(i=>{i!==document.activeElement&&i.value!==q&&(i.value=q)})}b.addEventListener("toggle",t=>{const e=t.target;if(e instanceof HTMLDetailsElement&&e.classList.contains("class-poll-details")){const r=e.dataset.pollDetails||"first";W[r]=e.open}},!0);b.addEventListener("input",t=>{const e=t.target;if(e.id==="explore-slider"){f=Number(e.value),F=1,lt=!0,Dt();return}if(e.id==="participants"||e.dataset.participantsInput){q=e.value;const r=e.dataset.participantsInput||"first";W[r]=!0,Kt();return}if(e.dataset.count&&e.dataset.countPoll){if(P)return;const r=e.dataset.countPoll,s=e.dataset.count;$[r]??=wt(),$[r][s]=e.value,W[r]=!0,Kt()}});window.addEventListener("keydown",t=>{if(t.repeat)return;const e=document.activeElement?.tagName;if(e==="INPUT"||e==="TEXTAREA"||e==="SELECT")return;if(!t.altKey&&!t.ctrlKey&&!t.metaKey&&["1","2","3","4"].includes(t.key)){if(y==="think"||y==="check"){const s=document.activeElement?.closest('[aria-label="한 걸음 더 새로운 응용 문제"]')!==null,a=y==="think"?"first":s?"transfer":"again",o=D[Number(t.key)-1];o&&(C[a]=o,tt="",h(a!=="first"&&o===Z(a)?"correct":"click"),p())}return}if(!t.altKey)return;const r=B.indexOf(y);t.key==="ArrowRight"&&r<B.length-1?(t.preventDefault(),et(),U(),y=B[r+1],p(!0)):t.key==="ArrowLeft"&&r>0&&(t.preventDefault(),et(),U(),y=B[r-1],p(!0))});b.addEventListener("click",t=>{const e=t.target.closest("button");if(!e)return;if(e.id==="sound-toggle"){z=!z,z||et(),e.textContent=z?"🔊 효과음":"🔇 음소거",e.setAttribute("aria-pressed",String(z)),z&&h("click");return}if(e.id==="theme-toggle"){const s=te()?"light":"dark";document.documentElement.setAttribute("data-theme",s),e.textContent=s==="dark"?"☀️":"🌙",e.setAttribute("aria-pressed",String(s==="dark"));return}if(e.id==="scale-toggle"){const s=ee()?"normal":"large";document.documentElement.setAttribute("data-scale",s),e.textContent=s==="large"?"🔍 기본":"🔍 큰글씨",e.setAttribute("aria-pressed",String(s==="large"));return}if(e.dataset.stepIndex!==void 0){const s=Number(e.dataset.stepIndex);Number.isInteger(s)&&s>=0&&s<B.length&&(et(),U(),y=B[s],tt="",p(!0));return}if(e.dataset.confPoll&&e.dataset.confLevel){const s=e.dataset.confPoll,a=e.dataset.confLevel;yt[s]=a,h("click"),p();return}if(e.dataset.exploreTab){M=e.dataset.exploreTab,h("click"),p();return}if(e.dataset.flagDenom!==void 0){const s=Number(e.dataset.flagDenom);j.includes(s)?j=j.filter(a=>a!==s):j=[...j,s],h("click"),p();return}if(e.dataset.mysteryDenom!==void 0){const s=Number(e.dataset.mysteryDenom);X=s,h(s>3&&s<7?"correct":"click"),p();return}if(e.dataset.bridgePick){const s=e.dataset.bridgePick;K=s,h(s==="right"?"fanfare":"click"),p();return}if(e.dataset.unitId){S=e.dataset.unitId,bt(!0,!0);return}if(e.dataset.quickDenom!==void 0){f=Number(e.dataset.quickDenom),F=1,lt=!0,h("click"),Dt();return}if(e.dataset.duelRound!==void 0&&e.dataset.duelPick){const s=Number(e.dataset.duelRound),a=e.dataset.duelPick;if(ct[s]===a)return;ct[s]=a;const o=J.find(n=>n.id===s);o&&o.answer===a?(gt++,h("correct")):gt=0,p();return}if(e.dataset.trainDenom!==void 0){const s=Number(e.dataset.trainDenom);!w.includes(s)&&w.length<Xt.length&&(w=[...w,s],w.length===3&&w[0]===2&&w[1]===6&&w[2]===9?h("fanfare"):h("click"),p());return}if(e.dataset.ruleChoice){const s=e.dataset.ruleChoice;N=s,G=s==="smaller",G&&h("correct"),p();return}if(e.dataset.letterChoice){O=e.dataset.letterChoice,O==="correct"&&h("fanfare"),p();return}if(e.dataset.votePoll&&e.dataset.voteChoice&&e.dataset.voteDelta){const s=e.dataset.votePoll,a=e.dataset.voteChoice,o=Number(e.dataset.voteDelta);$[s]??={A:"0",B:"0",C:"0",D:"0"};for(const g of D)/^(?:0|[1-9]\d*)$/.test($[s][g].trim())||($[s][g]="0");const n=D.filter(g=>g!==a).reduce((g,k)=>g+(parseInt($[s][k],10)||0),0),i=parseInt($[s][a],10)||0,c=Math.max(0,Bt-n),u=Math.max(0,Math.min(c,i+o));$[s][a]=String(u);const d=n+u,l=ut(q);(!l||d>l)&&(q=String(Math.max(1,Math.min(Bt,d)))),W[s]=!0,p();return}if(e.dataset.pickPoll&&e.dataset.pickChoice){const s=e.dataset.pickPoll,a=e.dataset.pickChoice;C[s]=a,tt="",h(s!=="first"&&a===Z(s)?"correct":"click"),p();return}if(e.dataset.reason!==void 0){Y=e.dataset.reason,kt="",h("click"),p();return}const r=e.dataset.action;if(r==="speak-story"){Ut=!0,h("click");try{const s=(vt[S]?.lead??"").replace(/<[^>]+>/g,"");if("speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u"){window.speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(s);a.lang="ko-KR",window.speechSynthesis.speak(a)}}catch{}p()}else if(r==="toggle-model")x=x==="circle"?"bar":"circle",p();else if(r==="toggle-spoiler")Q=!Q,p();else if(r==="toggle-pattern")v=!v,h("click"),p();else if(r==="toggle-fair-cut")_=!_,h(_?"correct":"click"),p();else if(r==="flag-all")j=[...Zt],h("fanfare"),p();else if(r==="flag-reset")j=[2,4],h("click"),p();else if(r==="talk-bell")L>0?(U(),h("click"),p()):(U(),L=30,h("click"),p(),Pt=setInterval(()=>{L=Math.max(0,L-1);const s=b.querySelector("#talk-bell-btn");s&&(s.textContent=L>0?`🔔 짝 토론 (${L}초)`:"🔔 30초 짝 토론",s.setAttribute("aria-pressed",String(L>0))),L<=0&&(U(),h("fanfare"))},1e3));else if(r==="pick-group")mt=(mt??0)%6+1,h("click"),p();else if(r==="toggle-numberline")x=x==="numberline"?"bar":"numberline",p();else if(r==="toggle-cup")x=x==="cup"?"bar":"cup",p();else if(r==="toggle-overlap")nt=!nt,p();else if(r==="toggle-trap")ot=!ot,p();else if(r==="toggle-reallife")it=!it,p();else if(r==="toggle-poll-blind"){P=!P;const s=e.dataset.targetPoll||"first";W[s]=!0,p()}else if(r==="base-less"||r==="base-more")E=Math.max(st,Math.min(rt,E+(r==="base-more"?1:-1))),lt=!0,Dt();else if(r==="less"||r==="more")f=Math.max(st,Math.min(rt,f+(r==="more"?1:-1))),F=1,lt=!0,Dt();else if(r==="fill-piece-add"){F=Math.min(f,F+1),h(F===f?"fanfare":"click");const s=b.querySelector("#fill-whole-box");s&&(s.innerHTML=$t())}else if(r==="fill-piece-full"){F=f,h("fanfare");const s=b.querySelector("#fill-whole-box");s&&(s.innerHTML=$t())}else if(r==="fill-piece-reset"){F=1;const s=b.querySelector("#fill-whole-box");s&&(s.innerHTML=$t())}else if(r==="duel-shuffle"){Et++;const s=[2,3,4,5,6,7,8,9,10,11,12];J=[0,1,2].map(a=>{const o=(a*3+Et*2+gt)%s.length,n=(o+a+Et%4+2)%s.length,i=s[o],c=s[n]===i?s[(n+1)%s.length]:s[n];return{id:a,leftDenom:i,rightDenom:c,answer:i<c?"left":"right"}}),ct={0:null,1:null,2:null},h("click"),p()}else if(r==="train-reset")w=[],p();else if(r==="toggle-notebook-blank")G=!0,p();else if(r==="fill-zeros"){const s=e.dataset.targetPoll||"first";$[s]??=wt();for(const a of D)/^(?:0|[1-9]\d*)$/.test($[s][a].trim())||($[s][a]="0");W[s]=!0,p()}else if(r==="fill-sample"){const s=e.dataset.targetPoll||"first",a=ut(q)??20,o=Z(s),n=o==="A"?"B":"A",i=Math.round(s==="first"?a*.4:a*.8),c=Math.round(s==="first"?a*.45:a*.1),u=Math.round(a*.05),d=Math.max(0,a-i-c-u),l={A:"0",B:"0",C:String(u),D:String(d)};l[o]=String(i),l[n]=String(c),$[s]=l,W[s]=!0,p()}else if(r==="next"){const s=B.indexOf(y);s<B.length-1&&(et(),U(),y=B[s+1],tt="",p(!0))}else if(r==="back"){const s=B.indexOf(y);s>0&&(et(),U(),y=B[s-1],tt="",p(!0))}else r==="next-unit"?(S=e.dataset.nextUnitId||"M02",bt(!0,!0),window.scrollTo?.({top:0})):r==="print-summary"?window.print():r==="restart"&&(bt(),window.scrollTo?.({top:0}))});window.addEventListener("pagehide",()=>bt());window.addEventListener("pageshow",t=>{t.persisted&&bt()});E=I().denominators.first[0];f=I().denominators.first[1];p();Jt&&ce(async()=>{const{createLessonAiPanel:t}=await import("./lesson-ai-panel-BJq4yL9G.js");return{createLessonAiPanel:t}},__vite__mapDeps([0,1,2])).then(({createLessonAiPanel:t})=>{Tt=t(b,(e,r)=>{Y=e==="A"?"0":e==="B"?"1":"2",kt=r,p()}),Tt.sync(y==="think")});
