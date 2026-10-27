const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lesson-ai-panel-BJq4yL9G.js","assets/errors-S67X06TO.js","assets/constants-CYr9ulPU.js"])))=>i.map(i=>d[i]);
import{D as ct,a as dt,b as It}from"./constants-CYr9ulPU.js";const $e="modulepreload",xe=function(t){return"/Thinking/"+t},ee={},ve=function(s,a,i){let o=Promise.resolve();if(a&&a.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),e=n?.nonce||n?.getAttribute("nonce");o=l(a.map(d=>{if(d=xe(d),d in ee)return;ee[d]=!0;const u=d.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${c}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":$e,u||(p.as="script"),p.crossOrigin="",p.href=d,e&&p.setAttribute("nonce",e),document.head.appendChild(p),u)return new Promise((x,y)=>{p.addEventListener("load",x),p.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(n){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=n,window.dispatchEvent(e),!e.defaultPrevented)throw n}return o.then(n=>{for(const e of n||[])e.status==="rejected"&&r(e.reason);return s().catch(r)})},q=["A","B","C","D"];function Pt(){return{A:"",B:"",C:"",D:""}}function ht(t){return/^(?:[1-9]|[1-5][0-9]|60)$/.test(t)?Number(t):null}function Tt(t,s){if(!Number.isInteger(s)||s<1||s>60||q.some(o=>!/^(?:0|[1-9]\d*)$/.test(t[o])))return null;const a=Object.fromEntries(q.map(o=>[o,Number(t[o])])),i=q.reduce((o,r)=>o+a[r],0);return i>s?null:{counts:a,noResponse:s-i}}function ye(t,s,a){return(s-t)/a*100}function ke(t){if(!Number.isInteger(t)||t<2||t>12)throw new RangeError("denominator must be 2–12");return Array.from({length:t},(s,a)=>({start:a/t,end:(a+1)/t}))}const wt=new Map;function Xt(t){if(wt.has(t.id))throw new Error(`Unit "${t.id}" is already registered.`);wt.set(t.id,t)}function me(t){const s=wt.get(t);if(!s)throw new Error(`Unit "${t}" not found. Registered: ${[...wt.keys()].join(", ")}`);return s}function Vt(){return[...wt.values()]}const we={id:"M01",title:"🥖 초코바 나누기 · 단위분수 기초 비교 (1/3과 1/5)",description:"길이가 같은 초코바와 리본을 똑같이 나누어 1/3과 1/5 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 나누기",text:"같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모가 커지면 한 조각도 커진다는 생각을 살핍니다."},{id:"B",title:"나누는 수 바꾸기",text:"전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.",hint:"분모와 한 조각 크기의 관계를 설명해 봅니다."},{id:"C",title:"전체 다시 만들기",text:"1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.",hint:"분모가 무엇을 뜻하는지 확인합니다."}],examples:[{id:"E1",text:"5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 길이를 더 많이 나누면 한 조각은 작아져요.",expected:"B"},{id:"E3",text:"두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.",expected:"hold"},{id:"E4",text:"분모가 무엇을 뜻하는지 모르겠어요.",expected:"C"},{id:"E5",text:"어떤 물건인지도 모르고 길이 정보가 없어요.",expected:"hold"},{id:"E6",text:"오늘 날씨가 좋아서 운동장에 갔어요.",expected:"hold"}],denominators:{first:[3,5],transfer:[4,6]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},Me={id:"M02",title:"🍕 피자 조각 고르기 · 단위분수 심화 비교 (1/4과 1/7)",description:"크기가 같은 피자와 리본을 똑같이 나누어 1/4과 1/7 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 세밀하게 나누기",text:"같은 길이의 전체를 4등분과 7등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모 7이 4보다 크니까 1/7이 크다는 생각을 살핍니다."},{id:"B",title:"등분 수와 조각 크기 규칙 찾기",text:"등분 수를 4에서 7로 늘릴 때 한 조각의 크기가 어떻게 변하는지 규칙을 찾습니다.",hint:"나누는 횟수가 늘어날수록 한 조각이 작아지는 이유를 설명해 봅니다."},{id:"C",title:"단위분수 모아 전체 확인하기",text:"1/4 네 조각과 1/7 일곱 조각을 각각 모아 처음 전체와 같은지 확인합니다.",hint:"단위분수가 전체의 몇 분의 일인지 의미를 되짚습니다."}],examples:[{id:"E1",text:"7이 4보다 크니까 1/7 조각이 더 크다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 여러 번 나눌수록 한 조각은 줄어들어요.",expected:"B"},{id:"E3",text:"전체 크기가 서로 다르면 1/4과 1/7을 바로 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/7이 전체를 어떻게 나눈 것인지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"문제에 그림이나 길이 설명이 전혀 없어요.",expected:"hold"},{id:"E6",text:"점심시간에 친구들과 축구를 했어요.",expected:"hold"}],denominators:{first:[4,7],transfer:[5,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아|여러 번 나눌수록.{0,12}줄어",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},Se={id:"M03",title:"🎀 색테이프 자르기 · 단위분수 응용 비교 (1/2과 1/6)",description:"길이가 같은 색테이프와 리본을 똑같이 나누어 1/2과 1/6 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"반으로 나누기와 여섯으로 나누기",text:"같은 길이의 전체를 2등분과 6등분해 한 조각의 길이를 직접 비교합니다.",hint:"6이 2보다 크니까 1/6이 더 크다는 생각을 점검합니다."},{id:"B",title:"등분 배수와 조각 크기 관계",text:"2등분한 조각을 다시 3등분하면 6등분이 된다는 점을 통해 조각 크기를 관찰합니다.",hint:"나누는 수가 커질수록 한 조각이 얼마나 작아지는지 살펴봅니다."},{id:"C",title:"단위분수 개수로 전체 채우기",text:"1/2 두 조각과 1/6 여섯 조각을 모아 같은 전체가 되는지 확인합니다.",hint:"분모가 전체를 똑같이 나눈 조각 수임을 확인합니다."}],examples:[{id:"E1",text:"6이 2보다 훨씬 크니까 1/6 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 많이 나누면 한 조각의 길이는 짧아져요.",expected:"B"},{id:"E3",text:"전체 리본의 길이가 서로 다르면 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/6이 무엇을 나타내는지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"길이에 대한 설명이 없어서 알기 어려워요.",expected:"hold"},{id:"E6",text:"쉬는 시간에 물 마시러 다녀왔어요.",expected:"hold"}],denominators:{first:[2,6],transfer:[3,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}(작아|짧아)|더 많이 나눌수록.{0,12}(작아|짧아)",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}};Vt().length===0&&(Xt(we),Xt(Me),Xt(Se));const P=["think","explore","check","result"],Ot={think:"1. 생각 고르기",explore:"2. 직접 실험하기",check:"3. 다시 점검하기",result:"4. 오늘의 발견"},Mt={M01:{badge:"🍫 민수의 고민",lead:'<strong>"3보다 5가 더 크니까 1/5 조각이 1/3보다 더 크지 않을까?"</strong>',friend:"민수"},M02:{badge:"🍕 서연이의 고민",lead:'<strong>"4보다 7이 더 크니까 1/7 조각이 1/4보다 더 크지 않을까?"</strong>',friend:"서연이"},M03:{badge:"🎀 준호의 고민",lead:'<strong>"2보다 6이 더 크니까 1/6 색테이프가 1/2보다 더 길지 않을까?"</strong>',friend:"준호"}},_e={think:'🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요?"',explore:'🙋 선생님 질문 톡: "나누는 수가 커질수록 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',check:'🙋 선생님 질문 톡: "처음 생각과 지금 생각이 어떻게 달라졌는지 이야기해 볼까요?"',result:'🙋 선생님 질문 톡: "오늘 발견한 단위분수의 규칙을 한 문장으로 함께 읽어 봐요!"'},Ae={think:"저는 1/○이 더 크다고 생각해요. 왜냐하면 ___ 때문이에요.",explore:"실험해 보니 나누는 수가 클수록 한 조각이 ___졌어요.",check:"분모가 작을수록 한 조각의 크기가 더 ___요.",result:"같은 전체를 더 많이 나눌수록 한 조각은 ___집니다."},se=[[2,5],[3,7],[4,9],[2,8],[3,10],[5,12]],oe=[{id:0,leftDenom:7,rightDenom:2,answer:"right"},{id:1,leftDenom:3,rightDenom:9,answer:"left"},{id:2,leftDenom:11,rightDenom:4,answer:"right"}],Ce=[2,3,5,8,12],zt=[6,2,9],Kt=[2,3,4,6,12],Ee=[2,4,5,6,8],Pe=["분모가 클수록 조각이 크다고 생각함","더 많이 나눌수록 조각이 작아진다고 생각함","전체가 같은지 확인이 필요함"],ie=['💬 "분모 숫자가 클수록 조각도 커요"','💬 "많이 나눌수록 한 조각은 작아져요"','💬 "원래 전체 크기가 같은지 봐야 해요"'],h=document.querySelector("#lesson-app"),le=h.dataset.aiEnabled==="true";let Nt,Y,w="M01",rt=null,re=0,k="bar",v="think",V=!0,Qt=!1,X=!1,m=!1,S={first:null,again:null,transfer:null},St={first:"",again:""},tt="",_t="",Q=!1,nt=!1,ot=!1,C="all",M=!1,E=[2,4],B=3,g=5,ut=!1,D=1,G=oe.map(t=>({...t})),st={0:null,1:null,2:null},yt=0,Lt=0,it=!1,At=[0,0],_=[],z=null,U="",W=!1,K="",et="",gt=new Set,Z={first:!1,again:!1,transfer:!1},L=!1,N="20",$={first:null,again:null,transfer:null},I=0,qt,Ct=null,Et=!1,Ht=!1,lt="";function Gt(){return me(w)}function ft(){if(rt){const[t,s]=rt;return{first:[t,s],transfer:[Math.min(11,t+1),Math.min(12,s+2)]}}return Gt().denominators}function ce(){return document.documentElement.getAttribute("data-theme")==="dark"}function Zt(){return document.documentElement.getAttribute("data-scale")==="large"}function J(){try{"speechSynthesis"in window&&window.speechSynthesis.cancel()}catch{}}function b(t){if(V)try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;(!Y||Y.state==="closed")&&(Y=new s),Y.state==="suspended"&&Y.resume().catch(()=>{});const a=Y.createOscillator(),i=Y.createGain();a.connect(i),i.connect(Y.destination);const o=Y.currentTime;a.frequency.setValueAtTime(t==="fanfare"?659.25:t==="correct"?523.25:440,o),i.gain.setValueAtTime(.04,o),i.gain.exponentialRampToValueAtTime(.001,o+.11),a.start(o),a.stop(o+.11),a.onended=()=>{a.disconnect(),i.disconnect()}}catch{}}function R(){qt&&(clearInterval(qt),qt=void 0),I=0}function pt(t=!1,s=!1,a=!1){Nt?.dispose(),J(),R(),t||(w="M01"),a||(rt=null),s||gt.clear(),k="bar",v="think",Qt=!1,X=!1,m=!1,S={first:null,again:null,transfer:null},St={first:"",again:""},tt="",_t="",Q=!1,nt=!1,ot=!1,C="all",M=!1,E=[2,4];const[i,o]=ft().first;B=i,g=o,ut=!1,D=1,G=oe.map(r=>({...r})),st={0:null,1:null,2:null},yt=0,Lt=0,it=!1,At=[0,0],_=[],z=null,U="",W=!1,K="",et="",Ct=null,Et=!1,Ht=!1,Z={first:!1,again:!1,transfer:!1},L=!1,N="20",$={first:null,again:null,transfer:null},lt="",f()}function kt(){return w==="M01"?"초코바":w==="M02"?"피자":"색테이프"}function Jt(){return w==="M01"?{fill:"#e08e2b",bg:"var(--lesson-bar-bg, #fbf5ef)",stroke:"var(--lesson-bar-stroke, #5c3317)"}:w==="M02"?{fill:"#ffca62",bg:"var(--lesson-bar-bg, #fffaf0)",stroke:"var(--lesson-bar-stroke, #b45309)"}:{fill:"#ff8da1",bg:"var(--lesson-bar-bg, #fff5f7)",stroke:"var(--lesson-bar-stroke, #153a69)"}}function De(t,s=!1){const{fill:r,bg:n,stroke:e}=Jt();if(s){const Ft=m?`<circle cx="80" cy="80" r="46" fill="none" stroke="${e}" stroke-width="2" stroke-dasharray="4 4"/>`:"";return`<figure class="fraction fraction-circle ${m?"pattern-active":""}">
      <svg data-svg-action="toggle-spoiler" class="touchable-svg" viewBox="0 0 160 160" role="img"
        aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${t}명이 똑같이 나눌 예정)">
        <circle cx="80" cy="80" r="60" fill="${r}" fill-opacity="0.28" stroke="${e}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="80" cy="80" r="52" fill="none" stroke="${e}" stroke-width="1.2" stroke-opacity="0.4"/>
        ${Ft}
        <text x="80" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text>
        <text x="80" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">✂️ 1/${t}은?</text>
      </svg>
      <figcaption><strong>1/${t}</strong> (${t}명 중 1조각)</figcaption>
    </figure>`}const l=2*Math.PI/t,d=-Math.PI/2,u=d+l,c=80+60*Math.cos(d),p=80+60*Math.sin(d),x=80+60*Math.cos(u),y=80+60*Math.sin(u),A=l>Math.PI?1:0,F=`M 80 80 L ${c.toFixed(2)} ${p.toFixed(2)} A 60 60 0 ${A} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`,O=d+l/2,xt=(80+60*.52*Math.cos(O)).toFixed(2),j=(80+60*.52*Math.sin(O)).toFixed(2),T=Array.from({length:t},(Ft,H)=>{const vt=d+H*l,be=80+60*Math.cos(vt),he=80+60*Math.sin(vt);return`<line x1="80" y1="80" x2="${be.toFixed(2)}" y2="${he.toFixed(2)}" stroke="${e}" stroke-width="1.8"/>`}).join(""),Bt=m?`<path d="${F}" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3" stroke-dasharray="5 3"/>`:"";return`<figure class="fraction fraction-circle ${m?"pattern-active":""}">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${t}">
      <circle cx="80" cy="80" r="60" fill="${n}" stroke="${e}" stroke-width="3"/>
      <path d="${F}" fill="${r}"/>
      ${Bt}
      <circle cx="${xt}" cy="${j}" r="${t>=9?3.2:4.5}" fill="#d9381e" fill-opacity="0.85"/>
      ${T}
      <circle cx="80" cy="80" r="60" fill="none" stroke="${e}" stroke-width="3"/>
    </svg>
    <figcaption><strong>1/${t}</strong> (${t}조각 중 1조각)</figcaption>
  </figure>`}function Be(t){const o=528/t,r=36+o,n=Array.from({length:t+1},(l,d)=>{const u=(36+d*o).toFixed(2),c=d===0||d===t;return`<line x1="${u}" y1="${c?22:28}" x2="${u}" y2="${c?54:48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${c?3:2}"/>`}).join(""),e=m?`<line x1="36" y1="35" x2="${r.toFixed(2)}" y2="35" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="4 3"/>`:"";return`<figure class="fraction fraction-numberline ${m?"pattern-active":""}">
    <svg viewBox="0 0 600 78" role="img"
      aria-label="0에서 1까지를 ${t}등분하고 첫 눈금을 표시한 수직선 모형, 1/${t}">
      <rect x="36" y="31" width="${o.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${e}
      <line x1="36" y1="38" x2="564" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${n}
      <circle cx="${r.toFixed(2)}" cy="38" r="6" fill="#d9381e"/>
      <text x="36" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="${r.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${t}</text>
      <text x="564" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text>
    </svg>
    <figcaption>0~1 수직선 <strong>1/${t}</strong></figcaption>
  </figure>`}function Fe(t){const r=120/t,n=136-r,e=Array.from({length:t-1},(d,u)=>{const c=(16+(u+1)*120/t).toFixed(2);return`<line x1="48" y1="${c}" x2="112" y2="${c}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`}).join(""),l=m?`<line x1="46" y1="${(n+r*.5).toFixed(2)}" x2="114" y2="${(n+r*.5).toFixed(2)}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="5 3"/>`:"";return`<figure class="fraction fraction-cup ${m?"pattern-active":""}">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${t}등분하고 한 눈금만큼 채운 들이 모형, 1/${t}">
      <rect x="40" y="16" width="80" height="120" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="42" y="${n.toFixed(2)}" width="76" height="${r.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${l}
      ${e}
      <rect x="40" y="16" width="80" height="120" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption><strong>1/${t}컵</strong></figcaption>
  </figure>`}function $t(t,s=!1){if(k==="circle")return De(t,s);if(k==="numberline")return Be(t);if(k==="cup")return Fe(t);const{fill:a,bg:i,stroke:o}=Jt();if(s){const u=m?`<line x1="14" y1="22" x2="586" y2="22" stroke="${o}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="6 4"/><line x1="14" y1="46" x2="586" y2="46" stroke="${o}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="2 5"/>`:"";return`<figure class="fraction ${m?"pattern-active":""}">
      <svg data-svg-action="toggle-spoiler" class="touchable-svg" viewBox="0 0 600 70" role="img"
        aria-label="아직 자르지 않은 전체 길이가 같은 ${kt()} 모형 (${t}명이 똑같이 나눌 예정)">
        <rect x="0" y="10" width="600" height="48" rx="8" fill="${a}" fill-opacity="0.22" stroke="${o}" stroke-width="3" stroke-dasharray="8 5"/>
        <line x1="14" y1="34" x2="586" y2="34" stroke="${o}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        ${u}
        <text x="300" y="39" text-anchor="middle" font-size="15" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 ${kt()} 1개 · ✂️ 1/${t}은?</text>
      </svg>
      <figcaption><strong>1/${t}</strong> (${t}명 중 1조각)</figcaption>
    </figure>`}const r=ke(t),n=600/t,e=r.slice(1).map(u=>`<line x1="${600*u.start}" y1="10" x2="${600*u.start}" y2="58" stroke="${o}" stroke-width="2"/>`).join(""),l=w==="M01"?`<rect x="6" y="16" width="${Math.max(8,n-12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`:w==="M02"?`<circle cx="${Math.min(580,n*.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`:`<line x1="6" y1="34" x2="${Math.max(10,n-6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`,d=m?`<line x1="4" y1="22" x2="${Math.max(6,n-4).toFixed(2)}" y2="22" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2.5" stroke-dasharray="6 4"/><line x1="4" y1="46" x2="${Math.max(6,n-4).toFixed(2)}" y2="46" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2.5" stroke-dasharray="2 5"/>`:"";return`<figure class="fraction ${m?"pattern-active":""}">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 막대, 1/${t}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="${i}" stroke="${o}" stroke-width="3"/>
      <rect x="0" y="10" width="${n}" height="48" rx="4" fill="${a}"/>
      ${l}
      ${d}
      ${e}
    </svg>
    <figcaption><strong>1/${t}</strong> (${t}조각 중 1조각)</figcaption>
  </figure>`}function Te(t,s,a=!1,i=!1){return`<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${k==="circle"}">${k==="circle"?"📏 막대 모양":"🍕 원형 모양"}</button>
      ${a?`<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${k==="numberline"}">📐 수직선</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${k==="cup"}">🥤 주스 컵</button>`:""}
    </div>
    <div class="bar-pair">${$t(t,i)}${$t(s,i)}</div>`}function Dt(t){return t==="transfer"}function at(t){return Dt(t)?"B":"A"}function bt(t,s,a,i="first"){if(!t)return"아직 선택하지 않음";const[o,r]=Dt(i)?[a,s]:[s,a];return{A:`1/${o}이 더 크다`,B:`1/${r}이 더 크다`,C:"두 조각의 크기가 같다",D:"아직 잘 모르겠다"}[t]}function ae(t){return`<svg class="mini-frac-svg" viewBox="0 0 36 12" aria-hidden="true"><rect x="1" y="1" width="34" height="10" rx="2" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5"/><rect x="1" y="1" width="${Math.max(4,Math.round(34/t))}" height="10" rx="1.5" fill="var(--lesson-bar-fill, #ffca62)"/></svg>`}function Ut(t,s,a){const i=S[t],[o,r]=Dt(t)?[a,s]:[s,a],n=[ae(o),ae(r),"",""],e=[`A. 1/${o}이 더 크다`,`B. 1/${r}이 더 크다`,"C. 크기가 같다","D. 잘 모르겠다"];return`<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${q.map((l,d)=>`<button type="button" data-pick-poll="${t}" data-pick-choice="${l}" class="solo-choice-btn ${i===l?"solo-choice-selected":""}" aria-pressed="${i===l}">${n[d]}${e[d]}</button>`).join("")}
  </div>`}function Wt(t,s,a){const i=S[t];if(!i)return"";if(t==="first")return`<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각: <strong>"${bt(i,s,a,t)}"</strong> · 2단계에서 직접 확인해 볼까요?</p>`;const o=at(t);return i===o?`<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 덜 나눈 <strong>1/${s}</strong>이 <strong>1/${a}</strong>보다 더 큽니다.</p>`:i==="C"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> ${s}등분과 ${a}등분은 조각 크기가 달라요. 덜 나눈 <strong>1/${s}</strong>이 더 큽니다.</p>`:i==="D"?`<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 덜 나눌수록 한 조각이 커져서 <strong>1/${s}</strong>이 더 큽니다.</p>`:`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 더 많이 나눌수록 한 조각은 작아져요! <strong>1/${s}</strong>(${o}번)이 더 큽니다.</p>`}function de(t){if(L)return"🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.";const s=$[t]??Pt(),a=ht(N);if(!a)return`⚠️ 참여 인원은 1~${It} 사이의 자연수로 입력해 주세요.`;const i=Tt(s,a),o=at(t);if(i)return`집계 완료: 정답(${o}) ${i.counts[o]}/${a}명 · 미응답 ${i.noResponse}명`;if(q.every(n=>/^(?:0|[1-9]\d*)$/.test(s[n]))){const n=q.reduce((e,l)=>e+Number(s[l]),0);if(n>a)return`⚠️ 보기 인원 합계(${n}명)가 참여 인원(${a}명)보다 많습니다. 인원수를 확인해 주세요.`}return"학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요."}function ue(t,s,a){if(L)return`<div class="live-poll-chart" data-chart-poll="${t}"><p class="chart-blind-msg">🙈 결과 공개 시 보기별 막대그래프가 표시됩니다.</p></div>`;const i=$[t]??Pt(),[o,r]=Dt(t)?[a,s]:[s,a],n={A:`A (1/${o})`,B:`B (1/${r})`,C:"C (같다)",D:"D (모름)"},e=q.map(c=>Math.max(0,parseInt(i[c],10)||0)),l=e.reduce((c,p)=>c+p,0),d=Math.max(1,ht(N)??20,l),u=at(t);return`<div class="live-poll-chart" data-chart-poll="${t}" role="region" aria-label="학급 투표 실시간 막대그래프">
    ${q.map((c,p)=>{const x=e[p],y=Math.min(100,Math.round(x/d*100));return`<div class="poll-bar-row">
        <span class="poll-bar-label">${n[c]}</span>
        <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill ${c===u?"poll-bar-correct":""}" x="0" y="0" width="${y}" height="14" rx="7"/></svg></div>
        <span class="poll-bar-val">${x}명 (${y}%)</span>
      </div>`}).join("")}
  </div>`}function fe(t){const s=St[t];return`<div class="confidence-picker" role="group" aria-label="내 생각 확신 온도계">
    <span class="confidence-label">🌡️ 확신 온도:</span>
    <div class="confidence-btns">
      ${[{key:"low",label:"🌱 헷갈려요"},{key:"mid",label:"🙂 비슷해요"},{key:"high",label:"🔥 확신해요!"}].map(i=>`<button type="button" data-conf-poll="${t}" data-conf-level="${i.key}" class="secondary-btn conf-btn ${s===i.key?"solo-choice-selected":""}" aria-pressed="${s===i.key}">${i.label}</button>`).join("")}
    </div>
  </div>`}function ge(){const t=`${window.location.origin}${window.location.pathname}`,s=new URLSearchParams,a=w==="M02"?"2":w==="M03"?"3":"1";return s.set("topic",a),Zt()&&s.set("scale","large"),`${t}?${s.toString()}`}function Le(){if(!Et)return"";const t=ge();let s=2166136261;for(let i=0;i<t.length;i++)s=Math.imul(s^t.charCodeAt(i),16777619);const a=[];for(let i=0;i<11;i++)for(let o=0;o<11;o++){const r=i<3&&o<3||i<3&&o>7||i>7&&o<3,n=(s>>>(i*11+o)%28&1)===1;(r||n)&&a.push(`<rect x="${8+o*8}" y="${8+i*8}" width="7" height="7" rx="1" fill="#153a69"/>`)}return`<div id="qr-modal-box" class="qr-modal-box" role="region" aria-label="학생 접속 QR 및 공유 링크">
    <svg class="qr-code-svg" viewBox="0 0 104 104" role="img" aria-label="수업 접속 QR 코드 모형">
      <rect x="2" y="2" width="100" height="100" rx="6" fill="#fff" stroke="#153a69" stroke-width="3"/>
      ${a.join("")}
    </svg>
    <div class="qr-modal-info">
      <strong>📱 현재 수업 단원 바로가기 링크</strong>
      <code id="qr-share-url">${t}</code>
      <div class="qr-modal-actions">
        <button type="button" id="copy-share-btn" data-action="copy-share-url" class="secondary-btn talk-dock-btn">${Ht?"✅ 주소 복사 완료!":"📋 수업 주소 복사"}</button>
      </div>
    </div>
  </div>`}function Rt(t){const s=I>0?`🔔 짝 토론 (${I}초)`:"🔔 30초 짝 토론",a=Ct!==null?`<span id="picked-group-badge" class="picked-group-badge" role="status">🎤 발표: <strong>${Ct}모둠</strong>! · 💬 말틀: <em>"${Ae[t]}"</em></span>`:"";return`<div class="teacher-talk-banner">
    <p class="teacher-talk-text">${_e[t]}</p>
    <div class="talk-dock" role="group" aria-label="짝 토론 및 발표 모둠 도구">
      <button type="button" id="talk-bell-btn" data-action="talk-bell" class="secondary-btn talk-dock-btn" aria-pressed="${I>0}">${s}</button>
      <button type="button" data-action="pick-group" class="secondary-btn talk-dock-btn">🎲 모둠 뽑기</button>
      <button type="button" id="qr-share-btn" data-action="toggle-qr-modal" class="secondary-btn talk-dock-btn" aria-pressed="${Et}">📱 수업 QR</button>
      ${a}
    </div>
    ${Le()}
  </div>`}function qe(t){return t?q.some(s=>t[s].trim()!==""):!1}function te(){if(L||!qe($.again))return"";const[t]=ft().first,s=Math.max(0,parseInt($.first?.A??"0",10)||0),a=Math.max(0,parseInt($.again?.A??"0",10)||0),i=Math.max(1,ht(N)??20,s,a),o=Math.min(100,Math.round(s/i*100)),r=Math.min(100,Math.round(a/i*100)),n=a-s,e=n>0?`+${n}명`:`${n}명`;return`<div id="poll-before-after-chart" class="poll-before-after-chart" role="region" aria-label="실험 전후 학급 정답 인원 비교 차트">
    <strong>📈 실험 전(1단계) vs 실험 후(3단계) 정답(1/${t}) 인원 변화 (${e})</strong>
    <div class="poll-bar-row">
      <span class="poll-bar-label">1단계 처음</span>
      <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill" x="0" y="0" width="${o}" height="14" rx="7"/></svg></div>
      <span class="poll-bar-val">${s}명 (${o}%)</span>
    </div>
    <div class="poll-bar-row">
      <span class="poll-bar-label">3단계 실험 후</span>
      <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill poll-bar-correct" x="0" y="0" width="${r}" height="14" rx="7"/></svg></div>
      <span class="poll-bar-val">${a}명 (${r}%)</span>
    </div>
  </div>`}function Yt(t,s,a){const i=$[t]??Pt(),[o,r]=Dt(t)?[a,s]:[s,a],n=[`A (1/${o})`,`B (1/${r})`,"C (같다)","D (모름)"],e=t==="transfer"?"participants-transfer":"participants";return`<details class="class-poll-details" data-poll-details="${t}" ${Z[t]?"open":""}>
    <summary>👩‍🏫 교실 거수 투표·인원 기록 (선택)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${It}명) <input id="${e}" data-participants-input="${t}" type="text" inputmode="numeric" value="${N}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" data-target-poll="${t}" class="secondary-btn" aria-pressed="${L}">${L?"👀 결과 공개하기":"🙈 결과 잠시 가리기"}</button>
      </div>
      <div class="class-poll-inputs">
        ${q.map((l,d)=>`<div class="poll-counter-card">
            <label>${n[d]} <input data-count="${l}" data-count-poll="${t}" type="text" inputmode="numeric" value="${L?"•":i[l]}" aria-label="${l} 선택 인원" autocomplete="off" ${L?"readonly":""}></label>
            <div class="poll-touch-btns">
              <button type="button" data-vote-poll="${t}" data-vote-choice="${l}" data-vote-delta="-1" class="secondary-btn vote-step-btn" aria-label="${l} 인원 1명 줄이기">−1</button>
              <button type="button" data-vote-poll="${t}" data-vote-choice="${l}" data-vote-delta="1" class="secondary-btn vote-step-btn" aria-label="${l} 인원 1명 추가">＋1</button>
            </div>
          </div>`).join("")}
      </div>
      <div class="poll-helpers">
        <button type="button" data-action="fill-zeros" data-target-poll="${t}" class="secondary-btn">빈 칸 0으로 채우기</button>
        <button type="button" data-action="fill-sample" data-target-poll="${t}" class="secondary-btn">예시 인원 채우기</button>
      </div>
      ${ue(t,s,a)}
      ${t==="again"?te():""}
      <p class="class-poll-status" data-status-poll="${t}" role="status">${de(t)}</p>
    </div>
  </details>`}function je(){const[t,s]=ft().first,a=Mt[w]??Mt.M01;return`
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${Vt().map(o=>{const r=!rt&&o.id===w,n=gt.has(o.id),e=o.title.replace(" · "," (")+")";return`<button type="button" data-unit-id="${o.id}" class="unit-card-btn ${r?"unit-card-active":""}" aria-pressed="${r}">
      <strong>${e}</strong>
      <span class="unit-stamp-tag">${n?"⭐ 완료":r?"🔍 탐구 중":"시작"}</span>
    </button>`}).join("")}
      <button type="button" id="random-unit-btn" data-action="random-unit" class="secondary-btn random-unit-pill ${rt?"unit-card-active":""}" aria-pressed="${rt!==null}">
        🎲 깜짝 분수${rt?` (1/${t} vs 1/${s})`:""}
      </button>
    </div>

    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${t}과 1/${s} 비교</h2>

      <div class="story-dilemma-card" role="region" aria-label="${a.badge}">
        <span class="story-badge">${a.badge}</span>
        <p class="question-lead">${a.lead}</p>
        <button type="button" data-action="speak-story" class="secondary-btn tts-btn">🔊 읽어주기</button>
        ${Qt?'<p id="tts-status" class="tts-status" role="status">🔊 음성으로 읽어주었어요!</p>':""}
      </div>

      <div class="visual-controls-bar">
        <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
          <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${k==="circle"}">${k==="circle"?"📏 막대 모양":"🍕 원형 모양"}</button>
        </div>
        <div class="spoiler-hint-row">
          <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${X}">
            ${X?"🙈 눈금 가리기":"👀 눈금 힌트"}
          </button>
          <button type="button" data-action="toggle-pattern" class="secondary-btn" aria-pressed="${m}">
            ${m?"🎨 기본 색상":"🎨 빗금 패턴"}
          </button>
        </div>
      </div>
      <div class="bar-pair">${$t(t,!X)}${$t(s,!X)}</div>

      ${Ut("first",t,s)}
      ${Wt("first",t,s)}

      <div class="followup-zone ${S.first?"followup-ready":""}">
        ${fe("first")}
        <div class="reason-section">
          <h3>💭 왜 그렇게 생각했나요?</h3>
          <div class="actions reason-bubble-list">
            ${Pe.map((o,r)=>`<button type="button" data-reason="${r}" class="reason-bubble-btn" aria-label="${o}" aria-pressed="${tt===String(r)}">
                <span class="student-bubble">${ie[r]}</span>
              </button>`).join("")}
          </div>
          ${_t?`<p class="ai-linked-badge">🤖 AI 추천 연결: <strong>${_t}</strong></p>`:""}
        </div>
      </div>

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Rt("think")}
        ${Yt("first",t,s)}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn ${S.first?"next-btn-ready":""}">② 직접 실험하러 가기 →</button>
      </div>
    </div>`}function pe(t){const s=t<g?">":t>g?"<":"=",a=t<g?`${t}등분 한 조각이 ${g}등분 한 조각보다 더 큽니다`:t>g?`${g}등분 한 조각이 ${t}등분 한 조각보다 더 큽니다`:"두 조각의 크기가 같습니다";return{barsHtml:`${$t(t)}${$t(g)}`,badgeHtml:`크기 비교: <strong>1/${t} ${s} 1/${g}</strong> (${a})`,discoveryHtml:ut?'<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>':""}}function mt(){const t=Math.max(1,Math.min(g,D)),{fill:s,bg:a,stroke:i}=Jt(),o=600/g,r=o*t,n=Array.from({length:g-1},(u,c)=>{const p=((c+1)*o).toFixed(2);return`<line x1="${p}" y1="10" x2="${p}" y2="54" stroke="${i}" stroke-width="2"/>`}).join(""),e=Array.from({length:g},(u,c)=>{const p=(c*o).toFixed(2);return`<rect class="svg-hit-slice" data-fill-slice="${c+1}" x="${p}" y="10" width="${o.toFixed(2)}" height="44" fill="transparent"/>`}).join(""),l=t===g,d=m?`<line x1="4" y1="22" x2="${Math.max(6,r-4).toFixed(2)}" y2="22" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="6 4"/><line x1="4" y1="42" x2="${Math.max(6,r-4).toFixed(2)}" y2="42" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="2 5"/>`:"";return`<figure class="whole-fill-figure ${m?"pattern-active":""}">
      <svg class="touchable-svg" viewBox="0 0 600 66" role="img" aria-label="1/${g} 조각을 ${t}개 모아 ${t}/${g}만큼 채운 막대">
        <rect x="0" y="10" width="600" height="44" rx="6" fill="${a}" stroke="${i}" stroke-width="3"/>
        <rect x="0" y="10" width="${r.toFixed(2)}" height="44" rx="4" fill="${s}"/>
        ${d}
        ${n}
        ${e}
      </svg>
      <figcaption>1/${g} 조각 <strong>${t}개</strong> = <strong>${t}/${g}</strong> ${l?"(= 전체 1 완성!)":""}</figcaption>
    </figure>
    <div class="fill-whole-controls" role="group" aria-label="단위분수 조각 모아 전체 1 채우기 조작">
      <button type="button" data-action="fill-piece-add" class="secondary-btn" ${l?"disabled":""}>➕ 1/${g} 추가</button>
      <button type="button" data-action="fill-piece-full" class="secondary-btn" ${l?"disabled":""}>⚡ 끝까지 채우기</button>
      <button type="button" data-action="fill-piece-reset" class="secondary-btn" ${t<=1?"disabled":""}>🔄 비우기</button>
    </div>
    <p id="fill-whole-status" class="answer" role="status">${l?`🎉 <strong>전체 1 완성!</strong> <strong>1/${g}</strong> 조각 <strong>${g}개</strong>로 전체 1을 채웠어요!`:`🧩 현재 <strong>${t}/${g}</strong> · 전체 1까지 <strong>${g-t}개</strong> 남았어요!`}</p>`}function jt(){D=Math.max(1,Math.min(g,D));const{barsHtml:t,badgeHtml:s,discoveryHtml:a}=pe(B),i=h.querySelector("#explore-exp2-bars");i&&(i.innerHTML=t);const o=h.querySelector("#explore-base-output");o&&(o.textContent=`기준 분수: 1/${B} (${B}등분)`);const r=h.querySelector('button[data-action="base-less"]');r&&(r.disabled=B<=ct);const n=h.querySelector('button[data-action="base-more"]');n&&(n.disabled=B>=dt);const e=h.querySelector("#explore-denom-output");e&&(e.textContent=`${g}등분 (1/${g})`);const l=h.querySelector("#explore-slider");l&&l.value!==String(g)&&(l.value=String(g));const d=h.querySelector('button[data-action="less"]');d&&(d.disabled=g<=ct);const u=h.querySelector('button[data-action="more"]');u&&(u.disabled=g>=dt),h.querySelectorAll("button[data-quick-denom]").forEach(y=>{const A=Number(y.dataset.quickDenom)===g;y.setAttribute("aria-pressed",String(A)),y.classList.toggle("quick-denom-active",A)});const c=h.querySelector("#explore-cmp-badge");c&&(c.innerHTML=s);const p=h.querySelector("#explore-discovery-2");p&&(p.innerHTML=a);const x=h.querySelector("#fill-whole-box");x&&(x.innerHTML=mt())}function Ie(t,s){return S.first==="B"||tt==="0"?`🎯 <strong>맞춤 실험 미션</strong>: 분모(${s})가 클수록 조각도 클까요? <strong>[실험 1 · 조각 포개기]</strong>와 <strong>[실험 3 · 전체 1 채우기]</strong>를 해 보세요!`:S.first==="C"||tt==="2"?"🎯 <strong>맞춤 실험 미션</strong>: <strong>[실험 4 · 등분할 조건]</strong>과 <strong>[실험 6 · 전체 크기가 다를 때]</strong>를 먼저 확인해 보세요!":S.first==="A"||tt==="1"?"🎯 <strong>맞춤 실험 미션</strong>: <strong>[실험 2 · 분모 자유 비교]</strong>와 <strong>[실험 5 · 수직선 깃발]</strong>에 도전해 보세요!":"🎯 <strong>맞춤 실험 미션</strong>: 아래 <strong>[실험 1 · 조각 포개기]</strong>부터 차례대로 눌러 조각 크기를 비교해 보세요!"}function Ne(){const i=[...E].sort((e,l)=>e-l),o=[18,30,42],r=i.map((e,l)=>{const d=(44+512/e).toFixed(2),u=o[l%o.length];return`<g class="touchable-svg" data-svg-flag="${e}">
      <line x1="${d}" y1="${u}" x2="${d}" y2="56" stroke="#d9381e" stroke-width="2.2"/>
      <circle cx="${d}" cy="56" r="4.5" fill="#d9381e"/>
      <text x="${d}" y="${u-2}" text-anchor="middle" font-size="12" font-weight="800" fill="#d9381e">🚩1/${e}</text>
    </g>`}).join(""),n=Kt.map(e=>{const l=(44+512/e).toFixed(2);return`<circle class="svg-hit-slice" data-svg-flag="${e}" cx="${l}" cy="56" r="10" fill="transparent"/>`}).join("");return`<figure class="flag-line-figure">
    <svg class="touchable-svg" viewBox="0 0 600 84" role="img" aria-label="0부터 1까지 수직선 위에 ${i.map(e=>`1/${e}`).join(", ")} 깃발을 꽂아 위치를 비교한 모형">
      <line x1="44" y1="56" x2="556" y2="56" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3.5"/>
      <line x1="44" y1="42" x2="44" y2="68" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <line x1="556" y1="42" x2="556" y2="68" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${r}
      ${n}
      <text x="44" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="556" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">1 (전체)</text>
    </svg>
    <figcaption>꽂힌 깃발(${i.length}개): <strong>${i.length>0?i.map(e=>`1/${e}`).join(" > "):"없음"}</strong></figcaption>
  </figure>`}function He(){const[t,s]=ft().first,a=bt(S.first,t,s,"first"),i=tt!==""?ie[Number(tt)]:"직접 실험으로 확인하기",o=600/t,r=600/s,n=Math.max(0,o-r),{barsHtml:e,badgeHtml:l,discoveryHtml:d}=pe(B),u=Ce.map(j=>{const T=g===j;return`<button type="button" data-quick-denom="${j}" class="secondary-btn quick-denom-btn ${T?"quick-denom-active":""}" aria-pressed="${T}">👧 ${j}명 (1/${j})</button>`}).join(""),c=Kt.map(j=>{const T=E.includes(j);return`<button type="button" data-flag-denom="${j}" class="secondary-btn ${T?"quick-denom-active":""}" aria-pressed="${T}">🚩 1/${j}</button>`}).join(""),p=C==="all"||C==="core",x=C==="all"||C==="concept",y=C==="all"||C==="life",A=Q||ut,F=D===g||M,O=E.length>=4||nt||ot,xt=A||F||O;return`
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 분수 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>처음 생각</strong>: <strong>${a}</strong> <span class="hypothesis-sub">(${i})</span></p>
        <p id="adaptive-mission-card" class="adaptive-mission-card">${Ie(t,s)}</p>
      </div>

      <div class="exp-tab-bar" role="group" aria-label="실험 묶음 선택">
        <button type="button" data-explore-tab="all" class="secondary-btn exp-tab-btn ${C==="all"?"quick-denom-active":""}" aria-pressed="${C==="all"}">🌟 전체 보기</button>
        <button type="button" data-explore-tab="core" class="secondary-btn exp-tab-btn ${C==="core"?"quick-denom-active":""}" aria-pressed="${C==="core"}">✂️ 핵심 비교 (실험 1·2)${A?" ✅":""}</button>
        <button type="button" data-explore-tab="concept" class="secondary-btn exp-tab-btn ${C==="concept"?"quick-denom-active":""}" aria-pressed="${C==="concept"}">🧩 원리 실험 (실험 3·4)${F?" ✅":""}</button>
        <button type="button" data-explore-tab="life" class="secondary-btn exp-tab-btn ${C==="life"?"quick-denom-active":""}" aria-pressed="${C==="life"}">🚩 수직선·실생활 (실험 5·6·7)${O?" ✅":""}</button>
      </div>

      ${p?`
        <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
          <h3>✂️ 실험 1 · 두 조각 포개어 대어 보기</h3>
          <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${Q}">
            ${Q?"✂️ 포개어 비교한 결과 닫기":"✂️ 1/"+t+" 조각과 1/"+s+" 조각 포개어 비교하기"}
          </button>

          ${Q?`
            <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
              <svg viewBox="0 0 600 92" role="img" aria-label="1/${t} 조각과 1/${s} 조각을 겹쳐 길이 차이를 비교한 그림">
                <rect x="0" y="8" width="600" height="74" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
                <rect x="0" y="14" width="${o.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                <text x="${Math.min(535,o+8).toFixed(2)}" y="32" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${t} 한 조각</text>
                <rect x="0" y="46" width="${r.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                <rect x="${r.toFixed(2)}" y="46" width="${n.toFixed(2)}" height="26" rx="4" fill="#fde2e2" stroke="#d9381e" stroke-width="2" stroke-dasharray="4 2"/>
                <text x="${Math.min(430,o+8).toFixed(2)}" y="64" font-size="13" font-weight="800" fill="#d9381e">← 이만큼 1/${t}이 더 길어요!</text>
                <line x1="${r.toFixed(2)}" y1="10" x2="${r.toFixed(2)}" y2="78" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
              </svg>
              <p class="answer">💡 <strong>발견 1</strong>: 덜 나눈 <strong>1/${t}</strong> 조각이 <strong>1/${s}</strong> 조각보다 빨간 점선 칸만큼 확실히 더 깁니다!</p>
            </div>
          `:""}
        </section>

        <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
          <h3>🎚️ 실험 2 · 양쪽 분모(2~12등분) 자유 비교</h3>

          <div class="visual-controls-bar">
            <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
              <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${k==="circle"}">${k==="circle"?"📏 막대 모양":"🍕 원형 모양"}</button>
            </div>
            <div class="base-denom-controls" role="group" aria-label="위쪽 기준 분수 분모 조절">
              <button type="button" data-action="base-less" class="secondary-btn" ${B<=ct?"disabled":""} aria-label="기준 분모 줄이기">기준 −1</button>
              <output id="explore-base-output" aria-live="polite">기준 분수: 1/${B} (${B}등분)</output>
              <button type="button" data-action="base-more" class="secondary-btn" ${B>=dt?"disabled":""} aria-label="기준 분모 늘리기">기준 ＋1</button>
              <button type="button" data-action="toggle-pattern" class="secondary-btn" aria-pressed="${m}">
                ${m?"🎨 기본 색상":"🎨 빗금 패턴"}
              </button>
            </div>
          </div>

          <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">
            ${u}
          </div>

          <div id="explore-exp2-bars" class="bar-pair">${e}</div>

          <div class="slider-experiment-controls">
            <button type="button" data-action="less" ${g<=ct?"disabled":""} aria-label="등분 수 줄이기">−</button>
            <input id="explore-slider" type="range" min="${ct}" max="${dt}" value="${g}" aria-label="나누는 조각 수 슬라이더">
            <output id="explore-denom-output" aria-live="polite">${g}등분 (1/${g})</output>
            <button type="button" data-action="more" ${g>=dt?"disabled":""} aria-label="등분 수 늘리기">＋</button>
          </div>

          <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${l}</p>
          <div id="explore-discovery-2" aria-live="polite">${d}</div>
        </section>
      `:""}

      ${x?`
        <div class="exp-grid-2col">
          <section class="experiment-box" aria-label="실험 3 단위분수 조각 모아 전체 1 채우기">
            <h3>🧩 실험 3 · 조각 모아 '전체 1' 채우기</h3>
            <div id="fill-whole-box">${mt()}</div>
          </section>

          <section class="experiment-box fair-cut-box" aria-label="실험 4 공평하게 똑같이 나누기 조건 실험">
            <h3>🔪 실험 4 · 공평하게 나누기(등분할) 조건</h3>
            <figure class="fair-cut-figure">
              <svg class="touchable-svg" data-svg-action="toggle-fair-cut" viewBox="0 0 600 66" role="img" aria-label="${M?"눈금을 똑같은 간격(200씩)으로 정렬해 바르게 3등분한 1/3 모형":"눈금이 90, 260으로 불공평하게 잘려 크기가 제각각인 3조각 모형"}">
                <rect x="0" y="10" width="600" height="44" rx="6" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
                <rect x="0" y="10" width="${M?200:90}" height="44" rx="4" fill="${M?"#ffca62":"#fde2e2"}"/>
                <line x1="${M?200:90}" y1="10" x2="${M?200:90}" y2="54" stroke="#d9381e" stroke-width="3"/>
                <line x1="${M?400:260}" y1="10" x2="${M?400:260}" y2="54" stroke="#d9381e" stroke-width="3"/>
                <text x="300" y="37" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">${M?"✅ 세 조각의 크기가 모두 똑같음 → 진짜 1/3!":"⚠️ 조각 크기가 제각각(불공평 분할) → 1/3이 아니에요!"}</text>
              </svg>
            </figure>
            <button type="button" data-action="toggle-fair-cut" class="secondary-btn" aria-pressed="${M}">
              ${M?"🔀 불공평 분할 보기":"📏 똑같은 간격(등분할) 정렬"}
            </button>
            <p id="fair-cut-status" class="answer" role="status">${M?"🎉 <strong>등분할 성공!</strong> 전체를 <strong>똑같은 크기</strong>로 나누었을 때만 <strong>1/3</strong>이라고 부를 수 있어요!":"💡 조각 크기가 다르면 3조각 중 1조각이어도 <strong>1/3이 아닙니다</strong>. 똑같이 나누어 보세요!"}</p>
          </section>
        </div>
      `:""}

      ${y?`
        <section class="experiment-box flag-line-box" aria-label="실험 5 수직선 위에 단위분수 깃발 꽂기">
          <h3>📍 실험 5 · 0~1 수직선 단위분수 깃발 꽂기</h3>
          <div class="flag-controls" role="group" aria-label="수직선 깃발 선택">
            ${c}
            <button type="button" data-action="flag-all" class="secondary-btn">🚩 모두 꽂기</button>
            <button type="button" data-action="flag-reset" class="secondary-btn">🔄 기본 깃발</button>
          </div>
          ${Ne()}
          <p id="flag-line-status" class="answer" role="status">${E.length>=4?"🎉 <strong>한눈에 발견!</strong> 분모가 <strong>2 → 3 → 4 → 6 → 12</strong>로 커질수록 깃발이 <strong>0 쪽으로 가까워집니다!</strong>":"📍 깃발을 더 눌러 분모가 커질수록 0과 1 중 어디에 가까워지는지 비교해 보세요!"}</p>
        </section>

        <div class="exp-grid-2col">
          <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
            <h3>😮 실험 6 · 원래 ${kt()} 전체 크기가 다르면?</h3>
            <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${nt}">
              ${nt?"😮 깜짝 실험 닫기":"😮 미니 간식의 1/2 vs 특대형 간식의 1/4 보기"}
            </button>
            ${nt?`
              <div class="trap-experiment-content" role="region" aria-label="전체 크기가 서로 다른 두 간식 비교">
                <svg viewBox="0 0 600 84" role="img" aria-label="작은 미니 간식의 1/2 조각(길이 100)과 특대형 간식의 1/4 조각(길이 140) 비교">
                  <rect x="0" y="10" width="200" height="26" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <rect x="0" y="10" width="100" height="26" rx="4" fill="#ffca62" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <text x="212" y="28" font-size="13" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">작은 미니 ${kt()}의 1/2</text>
                  <rect x="0" y="46" width="560" height="26" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <rect x="0" y="46" width="140" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
                  <text x="150" y="64" font-size="13" font-weight="700" fill="#d9381e">특대형 ${kt()}의 1/4 (더 큼!)</text>
                </svg>
                <p class="answer">💡 <strong>깜짝 발견!</strong> 원래 전체 크기가 다르면 <strong>1/4</strong>이 <strong>1/2</strong>보다 클 수도 있어요! 반드시 <strong>"전체 크기가 같다"</strong>는 약속이 필요합니다.</p>
              </div>
            `:""}
          </section>

          <section class="experiment-box reallife-box" aria-label="생활 속 숨은 단위분수 찾기">
            <h3>🕒 실험 7 · 시계(60분)·판초콜릿(12칸) 분수</h3>
            <button type="button" data-action="toggle-reallife" class="secondary-btn" aria-pressed="${ot}">
              ${ot?"🕒 생활 속 실험 닫기":"🕒 1시간의 1/2(30분) vs 1/4(15분) & 12칸 초콜릿"}
            </button>
            ${ot?`
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
        ${Rt("explore")}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn ${xt?"next-btn-ready":""}">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`}function Re(){const{first:[t,s],transfer:[a,i]}=ft(),o=G.filter(c=>st[c.id]===c.answer).length,r=G.map(c=>{const p=st[c.id],x=p===c.answer,y=it?c.id%2===0?" · 🔵청팀":" · 🔴홍팀":"";return`<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${c.id+1}${y}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${c.id+1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${c.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${p==="left"?"solo-choice-selected":""}" aria-pressed="${p==="left"}">1/${c.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${c.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${p==="right"?"solo-choice-selected":""}" aria-pressed="${p==="right"}">1/${c.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${p===null?"👆 터치!":x?"🎉 정답!":`💡 1/${Math.min(c.leftDenom,c.rightDenom)}이 더 커요!`}</span>
    </div>`}).join(""),n=_.length===zt.length,e=n&&_[0]===2&&_[1]===6&&_[2]===9,l=n?e?"🎉 <strong>칙칙폭폭 출발!</strong> <strong>1/2 &gt; 1/6 &gt; 1/9</strong> 순서로 완벽하게 줄을 세웠어요!":"💡 <strong>다시 줄을 세워 볼까요?</strong> 분모가 작을수록 조각이 더 커요. 가장 큰 조각(1/2)부터 태워 보세요!":"👆 가장 큰 조각부터 차례대로 눌러 1호차 → 2호차 → 3호차에 태워 보세요!",d=z!==null&&z>3&&z<7,u=z===null?"🕵️ 1/3보다 작고 1/7보다 큰 단위분수의 분모 □를 골라 보세요!":d?`🎉 <strong>추리 성공!</strong> 3 &lt; <strong>${z}</strong> &lt; 7이므로 <strong>1/3 &gt; 1/${z} &gt; 1/7</strong>이 성립합니다!`:"💡 <strong>다시 추리해 볼까요?</strong> 3과 7 사이에 있는 분모 숫자를 골라 보세요!";return`
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 내 생각 확인과 분수 대결</h2>

      <div class="check-grid-2col">
        <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
          <h3>1) 처음 문제 다시 고르기 (1/${t} vs 1/${s})</h3>
          <p class="first-memory-tag">💭 1단계 처음 생각: <strong>${bt(S.first,t,s,"first")}</strong></p>
          ${Ut("again",t,s)}
          ${Wt("again",t,s)}
          ${fe("again")}
          ${Yt("again",t,s)}
        </section>

        <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
          <h3>2) 응용 문제 도전 (<strong>1/${i}</strong> vs <strong>1/${a}</strong>)</h3>
          ${Te(i,a,!0)}
          ${Ut("transfer",a,i)}
          ${Wt("transfer",a,i)}
          ${Yt("transfer",a,i)}
        </section>
      </div>

      <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
        <div class="duel-header-row">
          <h3>3) ⚡ 번개 미니게임 · 더 큰 분수 고르기</h3>
          <div class="duel-header-actions">
            <button type="button" id="duel-battle-toggle" data-action="toggle-duel-battle" class="secondary-btn" aria-pressed="${it}">${it?"👯 1:1 대결 켜짐":"👯 1:1 대결 모드"}</button>
            <button type="button" data-action="duel-shuffle" class="secondary-btn">🎲 랜덤 3문제</button>
          </div>
        </div>
        ${it?`<div id="duel-battle-board" class="duel-battle-board" role="status">🔵 청팀 <strong>${At[0]}점</strong> <span class="battle-vs">VS</span> 🔴 홍팀 <strong>${At[1]}점</strong></div>`:""}
        <div class="duel-rounds-list">
          ${r}
        </div>
        <p class="duel-score-banner" role="status">🎯 점수: <strong>${o} / ${G.length}</strong> ${o===G.length?"🏆 퍼펙트!":""} · <span id="duel-streak-badge">🔥 콤보: ${yt}연속</span></p>
      </section>

      <div class="check-grid-2col">
        <section class="check-subcard train-puzzle-box" aria-label="분수 기차 줄 세우기 퍼즐">
          <h3>4) 🚂 분수 기차 (큰 조각부터 태우기)</h3>
          <div class="train-pick-row" role="group" aria-label="기차에 태울 단위분수 고르기">
            ${zt.map(c=>`<button type="button" data-train-denom="${c}" class="secondary-btn train-pick-btn" ${_.includes(c)?"disabled":""}>🚂 1/${c} 태우기</button>`).join("")}
            <button type="button" data-action="train-reset" class="secondary-btn">🔄 다시</button>
          </div>
          <div class="train-cars" role="group" aria-label="분수 기차 칸">
            ${[0,1,2].map(c=>`<div class="train-car">${c+1}호차: <strong>${_[c]?`1/${_[c]}`:"빈칸"}</strong></div>`).join('<span class="train-link" aria-hidden="true">&gt;</span>')}
          </div>
          <p id="train-status" class="answer" role="status">${l}</p>
        </section>

        <section class="check-subcard mystery-quiz-box" aria-label="숨은 분모 추리 퀴즈">
          <h3>5) 🕵️ 숨은 분모 추리 (<strong>1/3 &gt; 1/□ &gt; 1/7</strong>)</h3>
          <div class="mystery-pick-row" role="group" aria-label="빈칸 분모 후보 고르기">
            ${Ee.map(c=>`<button type="button" data-mystery-denom="${c}" class="secondary-btn mystery-btn ${z===c?"solo-choice-selected":""}" aria-pressed="${z===c}">□ = ${c} (1/${c})</button>`).join("")}
          </div>
          <p id="mystery-status" class="answer" role="status">${u}</p>
        </section>
      </div>

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Rt("check")}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn ${S.again&&S.transfer?"next-btn-ready":""}">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`}function Xe(){gt.add(w);const{first:[t,s],transfer:[a,i]}=ft(),o=Mt[w]??Mt.M01,r=W?"작아집니다!":U==="bigger"?"커집니다(?)":U==="same"?"같습니다(?)":"______",n=S.again===at("again"),e=S.transfer===at("transfer"),l=n&&e?"🏆 최고예요! 단위분수의 크기 비교 원리를 완벽하게 마스터했어요!":n||e?"🌟 참 잘했어요! 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!":"🌱 끝까지 스스로 실험하며 단위분수의 비밀을 탐구했어요!",d=ht(N),u=!L&&d&&$.first?Tt($.first,d):null,c=!L&&d&&$.again?Tt($.again,d):null,p=!L&&d&&$.transfer?Tt($.transfer,d):null,x=[];if(u&&c&&d){const H=ye(u.counts.A,c.counts.A,d);x.push(`처음·재선택 정답(1/${t}) 인원: <strong>${u.counts.A}/${d}명 → ${c.counts.A}/${d}명</strong> (${H>=0?"+":""}${H.toFixed(1)}%p)`)}p&&d&&x.push(`응용 문제 정답(1/${a}, B번) 인원: <strong>${p.counts.B}/${d}명</strong>`);const y=x.length>0?`<p class="comparison">👩‍🏫 <strong>학급 집계 요약</strong>: ${x.join(" · ")}</p>`:"",A=W?'<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>':U==="bigger"||U==="same"?'<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 나누는 사람 수를 늘렸을 때 한 조각 크기가 어떻게 변했나요?</p>':"",F=K==="correct"?`<p id="letter-reply" class="answer feedback-correct" role="status">📬 <strong>${o.friend}의 답장</strong>: "아하! 더 많은 사람이 나눌수록 한 조각이 작아지니까 분모가 작은 단위분수가 더 크구나. 고마워!"</p>`:K==="wrong"?`<p id="letter-reply" class="answer feedback-hint" role="status">💡 ${o.friend}가 아직 헷갈려해요! 더 많이 나눌수록 한 조각이 어떻게 변했는지 다시 골라 볼까요?</p>`:"",O={"":"미선택",low:"🌱 조금 헷갈려요",mid:"🙂 어느 정도 맞을 것 같아요",high:"🔥 완전히 확신해요!"},xt=`<p id="metacog-summary" class="metacog-summary">🌡️ <strong>확신 온도 변화</strong>: 처음 <strong>[${O[St.first]}]</strong> → 실험 후 <strong>[${O[St.again]}]</strong></p>`,j=et==="right"?"🎉 <strong>정답이에요!</strong> 같은 <strong>1/5</strong> 조각을 더 많이 모은 <strong>3/5</strong>(3개)이 <strong>2/5</strong>(2개)보다 더 큽니다!":et==="left"?"💡 <strong>다시 살펴볼까요?</strong> 똑같은 <strong>1/5 조각</strong> 2개와 3개 중 어느 쪽이 더 길까요?":"👆 똑같은 1/5 조각을 2개 모은 2/5와 3개 모은 3/5 중 더 큰 쪽을 골라 보세요!",T=Vt(),Bt=T.find(H=>!gt.has(H.id))??T[(T.findIndex(H=>H.id===w)+1)%T.length],Ft=T.map(H=>{const vt=gt.has(H.id);return`<div class="stamp-item ${vt?"stamp-done":""}">
      <span class="stamp-icon">${vt?"🎖️ 클리어!":"🔒 미도전"}</span>
      <strong>${H.title}</strong>
    </div>`}).join("");return`
    <div class="step-card">
      <div id="confetti-burst" class="confetti-burst" aria-hidden="true">
        <svg viewBox="0 0 600 28" preserveAspectRatio="none">
          <circle cx="45" cy="14" r="5" fill="#f59e0b"/><rect x="110" y="6" width="10" height="6" rx="2" fill="#3b82f6"/>
          <circle cx="185" cy="18" r="6" fill="#10b981"/><rect x="260" y="5" width="12" height="6" rx="2" fill="#ec4899"/>
          <circle cx="340" cy="16" r="5" fill="#8b5cf6"/><rect x="415" y="8" width="10" height="6" rx="2" fill="#f97316"/>
          <circle cx="490" cy="12" r="6" fill="#06b6d4"/><rect x="550" y="6" width="10" height="6" rx="2" fill="#eab308"/>
        </svg>
      </div>
      <h2 tabindex="-1">④ 오늘의 발견 · 성장 카드와 마스터 스탬프</h2>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${l}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 생각 (1/${t} vs 1/${s})</span>
            <strong>${bt(S.first,t,s,"first")}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${n?"journey-correct":""}">
            <span class="journey-label">② 실험 후 (1/${t} vs 1/${s})</span>
            <strong>${bt(S.again,t,s,"again")} ${n?"⭐":""}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${e?"journey-correct":""}">
            <span class="journey-label">③ 응용 문제 (1/${i} vs 1/${a})</span>
            <strong>${bt(S.transfer,a,i,"transfer")} ${e?"⭐":""}</strong>
          </div>
        </div>
        ${xt}
        ${y}
        ${te()}
      </div>

      <div class="result-grid-2col">
        <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
          <h3>🧩 오늘의 단위분수 규칙 완성하기</h3>
          <div class="notebook-line">
            <p>"같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${r} ]</strong>"</p>
          </div>
          <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
            <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn ${U==="bigger"?"rule-card-wrong":""}" aria-pressed="${U==="bigger"}">📈 커집니다</button>
            <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${W?"solo-choice-selected":""}" aria-pressed="${W}">📉 작아집니다!</button>
            <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn ${U==="same"?"rule-card-wrong":""}" aria-pressed="${U==="same"}">🟰 같습니다</button>
          </div>
          ${A}
        </div>

        <div class="friend-letter-card" role="region" aria-label="고민하던 친구에게 보내는 설명 편지">
          <h3>💌 ${o.friend}에게 설명 편지 보내기</h3>
          <div class="letter-choice-list" role="group" aria-label="친구에게 보낼 설명 고르기">
            <button type="button" data-letter-choice="correct" class="secondary-btn letter-choice-btn ${K==="correct"?"solo-choice-selected":""}" aria-pressed="${K==="correct"}">💌 "같은 전체를 더 많이 나눌수록 한 조각의 크기는 작아지기 때문이야!"</button>
            <button type="button" data-letter-choice="wrong" class="secondary-btn letter-choice-btn ${K==="wrong"?"rule-card-wrong":""}" aria-pressed="${K==="wrong"}">💌 "분모 숫자가 크면 한 조각의 크기도 항상 커지기 때문이야!"</button>
          </div>
          ${F}
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
            <button type="button" data-bridge-pick="left" class="secondary-btn ${et==="left"?"rule-card-wrong":""}" aria-pressed="${et==="left"}">🧩 2/5가 더 크다</button>
            <button type="button" data-bridge-pick="right" class="secondary-btn ${et==="right"?"solo-choice-selected":""}" aria-pressed="${et==="right"}">🧩 3/5가 더 크다</button>
          </div>
          <p id="bridge-status" class="answer" role="status">${j}</p>
        </div>

        <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
          <h3>🎖️ 분수 탐구 스탬프 투어 (${gt.size} / ${T.length} 클리어!)</h3>
          <div class="stamp-grid">
            ${Ft}
          </div>
        </div>
      </div>

      <div class="print-certificate-box" role="region" aria-label="단위분수 탐구 박사 인증서 서명란">
        <p class="cert-title">🎓 단위분수 탐구 박사 인증서 · 배움 공책 붙임용</p>
        <p class="cert-sign-line">학번·이름: ____________________ &nbsp;|&nbsp; 오늘 나의 한 줄 소감: ________________________________________</p>
      </div>

      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">
        ${Rt("result")}
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄</button>
        <button type="button" data-action="next-unit" data-next-unit-id="${Bt.id}" class="primary-next-btn">🚀 다음 이야기(${Bt.title.split("·")[0].trim()}) →</button>
        <button type="button" data-action="restart" class="secondary-btn">🔄 다시 하기</button>
      </div>
    </div>`}function Oe(){switch(v){case"think":return je();case"explore":return He();case"check":return Re();case"result":return Xe()}}function ze(){const t=ce(),s=Zt();return`<header class="slim-header">
    <div class="header-brand">
      <h1>🧭 생각의 갈림길 AI</h1>
      <span class="eyebrow">${le?"로컬 AI 수업":"단위분수 탐구"}</span>
    </div>
    <div class="header-controls">
      <button id="sound-toggle" class="scale-toggle" aria-label="효과음 전환" aria-pressed="${V}" type="button">${V?"🔊 효과음":"🔇 음소거"}</button>
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${s}" type="button">${s?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${t}" type="button">${t?"☀️":"🌙"}</button>
    </div>
  </header>`}function Ue(){const t=P.indexOf(v);return`<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${P.map((s,a)=>{const i=a<t,o=a===t;return`<button type="button" class="${i?"step-pill done":o?"step-pill current":"step-pill"}" data-step-index="${a}" aria-current="${o?"step":"false"}">${Ot[s]}</button>`}).join("")}
    </div>
  </nav>`}function f(t=!1){v!=="check"&&(k==="numberline"||k==="cup")&&(k="bar");const s=Ot[v];if(h.innerHTML=[ze(),Ue(),`<section id="step" role="region" aria-label="${s}">${Oe()}<p id="error" role="alert">${lt}</p></section>`,'<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>',"<footer>🔒 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>"].join(""),Nt?.sync(v==="think"),t){h.querySelector("#step h2")?.focus();const a=h.querySelector("#step-announce");a&&(a.textContent=`${Ot[v]} 단계로 이동했습니다.`)}}function ne(){const{first:[t,s],transfer:[a,i]}=ft();h.querySelectorAll(".class-poll-status[data-status-poll]").forEach(n=>{const e=n.dataset.statusPoll;n.textContent=de(e)}),h.querySelectorAll(".live-poll-chart[data-chart-poll]").forEach(n=>{const e=n.dataset.chartPoll,[l,d]=e==="transfer"?[a,i]:[t,s];n.outerHTML=ue(e,l,d)});const o=h.querySelector("#poll-before-after-chart"),r=te();o?r?o.outerHTML=r:o.remove():r&&h.querySelector('.live-poll-chart[data-chart-poll="again"]')?.insertAdjacentHTML("afterend",r),h.querySelectorAll("input[data-participants-input]").forEach(n=>{n!==document.activeElement&&n.value!==N&&(n.value=N)})}h.addEventListener("toggle",t=>{const s=t.target;if(s instanceof HTMLDetailsElement&&s.classList.contains("class-poll-details")){const a=s.dataset.pollDetails||"first";Z[a]=s.open}},!0);h.addEventListener("input",t=>{const s=t.target;if(s.id==="explore-slider"){g=Number(s.value),D=1,ut=!0,jt();return}if(s.id==="participants"||s.dataset.participantsInput){N=s.value;const a=s.dataset.participantsInput||"first";Z[a]=!0,ne();return}if(s.dataset.count&&s.dataset.countPoll){if(L)return;const a=s.dataset.countPoll,i=s.dataset.count;$[a]??=Pt(),$[a][i]=s.value,Z[a]=!0,ne()}});window.addEventListener("keydown",t=>{if(t.repeat)return;const s=document.activeElement?.tagName;if(s==="INPUT"||s==="TEXTAREA"||s==="SELECT")return;const a=P.indexOf(v);if(!t.altKey&&!t.ctrlKey&&!t.metaKey){if(["1","2","3","4"].includes(t.key)){if(v==="think"||v==="check"){const i=document.activeElement?.closest('[aria-label="한 걸음 더 새로운 응용 문제"]')!==null,o=v==="think"?"first":i?"transfer":"again",r=q[Number(t.key)-1];r&&(S[o]=r,lt="",b(o!=="first"&&r===at(o)?"correct":"click"),f())}return}if(t.key==="PageDown"&&a<P.length-1){t.preventDefault(),J(),R(),v=P[a+1],f(!0);return}if(t.key==="PageUp"&&a>0){t.preventDefault(),J(),R(),v=P[a-1],f(!0);return}if(t.key===" "&&(s==="BODY"||s==="MAIN"||s==="H2")){t.preventDefault(),v==="think"?X=!X:v==="explore"?Q=!Q:v==="result"&&(W=!W),b("click"),f();return}}t.altKey&&(t.key==="ArrowRight"&&a<P.length-1?(t.preventDefault(),J(),R(),v=P[a+1],f(!0)):t.key==="ArrowLeft"&&a>0&&(t.preventDefault(),J(),R(),v=P[a-1],f(!0)))});h.addEventListener("click",t=>{const s=t.target,a=s.closest("[data-fill-slice]");if(a&&a.dataset.fillSlice){D=Math.max(1,Math.min(g,Number(a.dataset.fillSlice))),b(D===g?"fanfare":"click"),f();return}const i=s.closest("[data-svg-flag]");if(i&&i.dataset.svgFlag){const e=Number(i.dataset.svgFlag);E=E.includes(e)?E.filter(l=>l!==e):[...E,e],b("click"),f();return}const o=s.closest("[data-svg-action]");if(o&&o.dataset.svgAction){const e=o.dataset.svgAction;if(e==="toggle-spoiler"){X=!X,b("click"),f();return}if(e==="toggle-fair-cut"){M=!M,b(M?"correct":"click"),f();return}}const r=s.closest("button");if(!r)return;if(r.id==="sound-toggle"){V=!V,V||J(),r.textContent=V?"🔊 효과음":"🔇 음소거",r.setAttribute("aria-pressed",String(V)),V&&b("click");return}if(r.id==="theme-toggle"){const e=ce()?"light":"dark";document.documentElement.setAttribute("data-theme",e),r.textContent=e==="dark"?"☀️":"🌙",r.setAttribute("aria-pressed",String(e==="dark"));return}if(r.id==="scale-toggle"){const e=Zt()?"normal":"large";document.documentElement.setAttribute("data-scale",e),r.textContent=e==="large"?"🔍 기본":"🔍 큰글씨",r.setAttribute("aria-pressed",String(e==="large"));return}if(r.dataset.stepIndex!==void 0){const e=Number(r.dataset.stepIndex);Number.isInteger(e)&&e>=0&&e<P.length&&(J(),R(),v=P[e],lt="",f(!0));return}if(r.dataset.confPoll&&r.dataset.confLevel){const e=r.dataset.confPoll,l=r.dataset.confLevel;St[e]=l,b("click"),f();return}if(r.dataset.exploreTab){C=r.dataset.exploreTab,b("click"),f();return}if(r.dataset.flagDenom!==void 0){const e=Number(r.dataset.flagDenom);E.includes(e)?E=E.filter(l=>l!==e):E=[...E,e],b("click"),f();return}if(r.dataset.mysteryDenom!==void 0){const e=Number(r.dataset.mysteryDenom);z=e,b(e>3&&e<7?"correct":"click"),f();return}if(r.dataset.bridgePick){const e=r.dataset.bridgePick;et=e,b(e==="right"?"fanfare":"click"),f();return}if(r.dataset.unitId){w=r.dataset.unitId,pt(!0,!0);return}if(r.dataset.quickDenom!==void 0){g=Number(r.dataset.quickDenom),D=1,ut=!0,b("click"),jt();return}if(r.dataset.duelRound!==void 0&&r.dataset.duelPick){const e=Number(r.dataset.duelRound),l=r.dataset.duelPick;if(st[e]===l)return;st[e]=l;const d=G.find(u=>u.id===e);d&&d.answer===l?(yt++,b("correct")):yt=0,At=[G.filter(u=>u.id%2===0&&st[u.id]===u.answer).length,G.filter(u=>u.id%2===1&&st[u.id]===u.answer).length],f();return}if(r.dataset.trainDenom!==void 0){const e=Number(r.dataset.trainDenom);!_.includes(e)&&_.length<zt.length&&(_=[..._,e],_.length===3&&_[0]===2&&_[1]===6&&_[2]===9?b("fanfare"):b("click"),f());return}if(r.dataset.ruleChoice){const e=r.dataset.ruleChoice;U=e,W=e==="smaller",W&&b("correct"),f();return}if(r.dataset.letterChoice){K=r.dataset.letterChoice,K==="correct"&&b("fanfare"),f();return}if(r.dataset.votePoll&&r.dataset.voteChoice&&r.dataset.voteDelta){const e=r.dataset.votePoll,l=r.dataset.voteChoice,d=Number(r.dataset.voteDelta);$[e]??={A:"0",B:"0",C:"0",D:"0"};for(const F of q)/^(?:0|[1-9]\d*)$/.test($[e][F].trim())||($[e][F]="0");const u=q.filter(F=>F!==l).reduce((F,O)=>F+(parseInt($[e][O],10)||0),0),c=parseInt($[e][l],10)||0,p=Math.max(0,It-u),x=Math.max(0,Math.min(p,c+d));$[e][l]=String(x);const y=u+x,A=ht(N);(!A||y>A)&&(N=String(Math.max(1,Math.min(It,y)))),Z[e]=!0,f();return}if(r.dataset.pickPoll&&r.dataset.pickChoice){const e=r.dataset.pickPoll,l=r.dataset.pickChoice;S[e]=l,lt="",b(e!=="first"&&l===at(e)?"correct":"click"),f();return}if(r.dataset.reason!==void 0){tt=r.dataset.reason,_t="",b("click"),f();return}const n=r.dataset.action;if(n==="random-unit"){const e=se[re%se.length];re++,pt(!0,!0),rt=e,B=e[0],g=e[1],b("click"),f()}else if(n==="toggle-qr-modal")Et=!Et,Ht=!1,b("click"),f();else if(n==="copy-share-url"){Ht=!0;try{navigator.clipboard?.writeText(ge())}catch{}b("correct"),f()}else if(n==="toggle-duel-battle")it=!it,b("click"),f();else if(n==="speak-story"){Qt=!0,b("click");try{const e=(Mt[w]?.lead??"").replace(/<[^>]+>/g,"");if("speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u"){window.speechSynthesis.cancel();const l=new SpeechSynthesisUtterance(e);l.lang="ko-KR",window.speechSynthesis.speak(l)}}catch{}f()}else if(n==="toggle-model")k=k==="circle"?"bar":"circle",f();else if(n==="toggle-spoiler")X=!X,f();else if(n==="toggle-pattern")m=!m,b("click"),f();else if(n==="toggle-fair-cut")M=!M,b(M?"correct":"click"),f();else if(n==="flag-all")E=[...Kt],b("fanfare"),f();else if(n==="flag-reset")E=[2,4],b("click"),f();else if(n==="talk-bell")I>0?(R(),b("click"),f()):(R(),I=30,b("click"),f(),qt=setInterval(()=>{I=Math.max(0,I-1);const e=h.querySelector("#talk-bell-btn");e&&(e.textContent=I>0?`🔔 짝 토론 (${I}초)`:"🔔 30초 짝 토론",e.setAttribute("aria-pressed",String(I>0))),I<=0&&(R(),b("fanfare"))},1e3));else if(n==="pick-group")Ct=(Ct??0)%6+1,b("click"),f();else if(n==="toggle-numberline")k=k==="numberline"?"bar":"numberline",f();else if(n==="toggle-cup")k=k==="cup"?"bar":"cup",f();else if(n==="toggle-overlap")Q=!Q,f();else if(n==="toggle-trap")nt=!nt,f();else if(n==="toggle-reallife")ot=!ot,f();else if(n==="toggle-poll-blind"){L=!L;const e=r.dataset.targetPoll||"first";Z[e]=!0,f()}else if(n==="base-less"||n==="base-more")B=Math.max(ct,Math.min(dt,B+(n==="base-more"?1:-1))),ut=!0,jt();else if(n==="less"||n==="more")g=Math.max(ct,Math.min(dt,g+(n==="more"?1:-1))),D=1,ut=!0,jt();else if(n==="fill-piece-add"){D=Math.min(g,D+1),b(D===g?"fanfare":"click");const e=h.querySelector("#fill-whole-box");e&&(e.innerHTML=mt())}else if(n==="fill-piece-full"){D=g,b("fanfare");const e=h.querySelector("#fill-whole-box");e&&(e.innerHTML=mt())}else if(n==="fill-piece-reset"){D=1;const e=h.querySelector("#fill-whole-box");e&&(e.innerHTML=mt())}else if(n==="duel-shuffle"){Lt++;const e=[2,3,4,5,6,7,8,9,10,11,12];G=[0,1,2].map(l=>{const d=(l*3+Lt*2+yt)%e.length,u=(d+l+Lt%4+2)%e.length,c=e[d],p=e[u]===c?e[(u+1)%e.length]:e[u];return{id:l,leftDenom:c,rightDenom:p,answer:c<p?"left":"right"}}),st={0:null,1:null,2:null},At=[0,0],b("click"),f()}else if(n==="train-reset")_=[],f();else if(n==="toggle-notebook-blank")W=!0,f();else if(n==="fill-zeros"){const e=r.dataset.targetPoll||"first";$[e]??=Pt();for(const l of q)/^(?:0|[1-9]\d*)$/.test($[e][l].trim())||($[e][l]="0");Z[e]=!0,f()}else if(n==="fill-sample"){const e=r.dataset.targetPoll||"first",l=ht(N)??20,d=at(e),u=d==="A"?"B":"A",c=Math.round(e==="first"?l*.4:l*.8),p=Math.round(e==="first"?l*.45:l*.1),x=Math.round(l*.05),y=Math.max(0,l-c-p-x),A={A:"0",B:"0",C:String(x),D:String(y)};A[d]=String(c),A[u]=String(p),$[e]=A,Z[e]=!0,f()}else if(n==="next"){const e=P.indexOf(v);e<P.length-1&&(J(),R(),v=P[e+1],lt="",f(!0))}else if(n==="back"){const e=P.indexOf(v);e>0&&(J(),R(),v=P[e-1],lt="",f(!0))}else n==="next-unit"?(w=r.dataset.nextUnitId||"M02",pt(!0,!0),window.scrollTo?.({top:0})):n==="print-summary"?window.print():n==="restart"&&(pt(),window.scrollTo?.({top:0}))});window.addEventListener("pagehide",()=>pt());window.addEventListener("pageshow",t=>{t.persisted&&pt()});try{const t=new URLSearchParams(window.location.search),s=t.get("topic")||t.get("unit");s==="1"||s==="M01"?w="M01":s==="2"||s==="M02"?w="M02":(s==="3"||s==="M03")&&(w="M03"),t.get("scale")==="large"&&document.documentElement.setAttribute("data-scale","large")}catch{}B=Gt().denominators.first[0];g=Gt().denominators.first[1];f();le&&ve(async()=>{const{createLessonAiPanel:t}=await import("./lesson-ai-panel-BJq4yL9G.js");return{createLessonAiPanel:t}},__vite__mapDeps([0,1,2])).then(({createLessonAiPanel:t})=>{Nt=t(h,(s,a)=>{tt=s==="A"?"0":s==="B"?"1":"2",_t=a,f()}),Nt.sync(v==="think")});
