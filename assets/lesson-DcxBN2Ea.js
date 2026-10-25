const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lesson-ai-panel-CkbyGUTi.js","assets/errors-S67X06TO.js","assets/constants-CYr9ulPU.js"])))=>i.map(i=>d[i]);
import{D as X,a as U,b as xt}from"./constants-CYr9ulPU.js";const Vt="modulepreload",Yt=function(t){return"/Thinking/"+t},Lt={},Kt=function(e,r,s){let n=Promise.resolve();if(r&&r.length>0){let c=function(i){return Promise.all(i.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");n=c(r.map(i=>{if(i=Yt(i),i in Lt)return;Lt[i]=!0;const d=i.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${f}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":Vt,d||(p.as="script"),p.crossOrigin="",p.href=i,l&&p.setAttribute("nonce",l),document.head.appendChild(p),d)return new Promise((k,m)=>{p.addEventListener("load",k),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})}))}function a(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return n.then(o=>{for(const l of o||[])l.status==="rejected"&&a(l.reason);return e().catch(a)})},E=["A","B","C","D"];function dt(){return{A:"",B:"",C:"",D:""}}function ot(t){return/^(?:[1-9]|[1-5][0-9]|60)$/.test(t)?Number(t):null}function bt(t,e){if(!Number.isInteger(e)||e<1||e>60||E.some(n=>!/^(?:0|[1-9]\d*)$/.test(t[n])))return null;const r=Object.fromEntries(E.map(n=>[n,Number(t[n])])),s=E.reduce((n,a)=>n+r[a],0);return s>e?null:{counts:r,noResponse:e-s}}function Zt(t,e,r){return(e-t)/r*100}function Gt(t){if(!Number.isInteger(t)||t<2||t>12)throw new RangeError("denominator must be 2–12");return Array.from({length:t},(e,r)=>({start:r/t,end:(r+1)/t}))}const it=new Map;function Mt(t){if(it.has(t.id))throw new Error(`Unit "${t.id}" is already registered.`);it.set(t.id,t)}function Qt(t){const e=it.get(t);if(!e)throw new Error(`Unit "${t}" not found. Registered: ${[...it.keys()].join(", ")}`);return e}function Dt(){return[...it.values()]}const Jt={id:"M01",title:"🥖 초코바 나누기 · 단위분수 기초 비교 (1/3과 1/5)",description:"길이가 같은 초코바와 리본을 똑같이 나누어 1/3과 1/5 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 나누기",text:"같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모가 커지면 한 조각도 커진다는 생각을 살핍니다."},{id:"B",title:"나누는 수 바꾸기",text:"전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.",hint:"분모와 한 조각 크기의 관계를 설명해 봅니다."},{id:"C",title:"전체 다시 만들기",text:"1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.",hint:"분모가 무엇을 뜻하는지 확인합니다."}],examples:[{id:"E1",text:"5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 길이를 더 많이 나누면 한 조각은 작아져요.",expected:"B"},{id:"E3",text:"두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.",expected:"hold"},{id:"E4",text:"분모가 무엇을 뜻하는지 모르겠어요.",expected:"C"},{id:"E5",text:"어떤 물건인지도 모르고 길이 정보가 없어요.",expected:"hold"},{id:"E6",text:"오늘 날씨가 좋아서 운동장에 갔어요.",expected:"hold"}],denominators:{first:[3,5],transfer:[4,6]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},te={id:"M02",title:"🍕 피자 조각 고르기 · 단위분수 심화 비교 (1/4과 1/7)",description:"크기가 같은 피자와 리본을 똑같이 나누어 1/4과 1/7 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 세밀하게 나누기",text:"같은 길이의 전체를 4등분과 7등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모 7이 4보다 크니까 1/7이 크다는 생각을 살핍니다."},{id:"B",title:"등분 수와 조각 크기 규칙 찾기",text:"등분 수를 4에서 7로 늘릴 때 한 조각의 크기가 어떻게 변하는지 규칙을 찾습니다.",hint:"나누는 횟수가 늘어날수록 한 조각이 작아지는 이유를 설명해 봅니다."},{id:"C",title:"단위분수 모아 전체 확인하기",text:"1/4 네 조각과 1/7 일곱 조각을 각각 모아 처음 전체와 같은지 확인합니다.",hint:"단위분수가 전체의 몇 분의 일인지 의미를 되짚습니다."}],examples:[{id:"E1",text:"7이 4보다 크니까 1/7 조각이 더 크다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 여러 번 나눌수록 한 조각은 줄어들어요.",expected:"B"},{id:"E3",text:"전체 크기가 서로 다르면 1/4과 1/7을 바로 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/7이 전체를 어떻게 나눈 것인지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"문제에 그림이나 길이 설명이 전혀 없어요.",expected:"hold"},{id:"E6",text:"점심시간에 친구들과 축구를 했어요.",expected:"hold"}],denominators:{first:[4,7],transfer:[5,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아|여러 번 나눌수록.{0,12}줄어",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},ee={id:"M03",title:"🎀 색테이프 자르기 · 단위분수 응용 비교 (1/2과 1/6)",description:"길이가 같은 색테이프와 리본을 똑같이 나누어 1/2과 1/6 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"반으로 나누기와 여섯으로 나누기",text:"같은 길이의 전체를 2등분과 6등분해 한 조각의 길이를 직접 비교합니다.",hint:"6이 2보다 크니까 1/6이 더 크다는 생각을 점검합니다."},{id:"B",title:"등분 배수와 조각 크기 관계",text:"2등분한 조각을 다시 3등분하면 6등분이 된다는 점을 통해 조각 크기를 관찰합니다.",hint:"나누는 수가 커질수록 한 조각이 얼마나 작아지는지 살펴봅니다."},{id:"C",title:"단위분수 개수로 전체 채우기",text:"1/2 두 조각과 1/6 여섯 조각을 모아 같은 전체가 되는지 확인합니다.",hint:"분모가 전체를 똑같이 나눈 조각 수임을 확인합니다."}],examples:[{id:"E1",text:"6이 2보다 훨씬 크니까 1/6 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 많이 나누면 한 조각의 길이는 짧아져요.",expected:"B"},{id:"E3",text:"전체 리본의 길이가 서로 다르면 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/6이 무엇을 나타내는지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"길이에 대한 설명이 없어서 알기 어려워요.",expected:"hold"},{id:"E6",text:"쉬는 시간에 물 마시러 다녀왔어요.",expected:"hold"}],denominators:{first:[2,6],transfer:[3,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}(작아|짧아)|더 많이 나눌수록.{0,12}(작아|짧아)",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}};Dt().length===0&&(Mt(Jt),Mt(te),Mt(ee));const _=["think","explore","check","result"],_t={think:"1. 생각 고르기",explore:"2. 직접 실험하기",check:"3. 다시 점검하기",result:"4. 오늘의 발견"},lt={M01:{badge:"🍫 민수의 초코바 고민",lead:'초코바를 아주 좋아하는 민수는 <strong>"3보다 5가 더 큰 숫자니까 나는 1/5 조각을 먹을래!"</strong>라고 골랐어요. 과연 민수는 1/3 조각보다 더 큰 초코바를 먹게 될까요?',friend:"민수"},M02:{badge:"🍕 서연이의 피자 고민",lead:'피자 파티에서 서연이는 <strong>"4보다 7이 더 큰 숫자니까 1/7 피자 조각이 더 크겠지?"</strong>라고 생각했어요. 과연 1/4 조각과 1/7 조각 중 어느 쪽이 더 클까요?',friend:"서연이"},M03:{badge:"🎀 준호의 색테이프 고민",lead:'만들기 시간에 준호는 <strong>"숫자 6이 2보다 훨씬 크니까 1/6 색테이프가 더 길 거야!"</strong>라고 말했어요. 과연 1/2 조각과 1/6 조각 중 어느 쪽이 더 길까요?',friend:"준호"}},mt={think:'🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요? 숫자(분모)가 커지면 조각은 어떻게 될까요?"',explore:'🙋 선생님 질문 톡: "나누는 사람 수(분모)가 3명에서 12명으로 늘어날수록 내가 먹는 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',check:'🙋 선생님 질문 톡: "처음 생각과 지금 생각이 같나요, 바뀌었나요? 무엇을 보고 확신하게 되었는지 이야기해 볼까요?"',result:'🙋 선생님 질문 톡: "오늘 발견한 단위분수의 비밀을 한 문장으로 다 함께 읽어 보고, 다른 간식 이야기에도 도전해 봐요!"'},jt=[{id:0,leftDenom:7,rightDenom:2,answer:"right"},{id:1,leftDenom:3,rightDenom:9,answer:"left"},{id:2,leftDenom:11,rightDenom:4,answer:"right"}],se=[2,3,5,8,12],St=[6,2,9],re=["분모가 클수록 조각이 크다고 생각함","더 많이 나눌수록 조각이 작아진다고 생각함","전체가 같은지 확인이 필요함"],qt=['💬 "분모 숫자가 더 크니까 한 조각도 더 클 것 같아요!"','💬 "같은 전체를 더 많이 나누면 한 조각은 더 작아질 것 같아요!"','💬 "두 간식의 원래 전체 크기가 똑같은지 먼저 확인해야 해요!"'],b=document.querySelector("#lesson-app"),Ht=b.dataset.aiEnabled==="true";let vt,T,y="M01",$="bar",v="think",j=!0,Pt=!1,K=!1,A={first:null,again:null,transfer:null},st="",ct="",Z=!1,G=!1,Q=!1,M=3,u=5,J=!1,C=1,R=jt.map(t=>({...t})),tt={0:null,1:null,2:null},rt=0,ht=0,x=[],B="",N=!1,q="",V=new Set,H={first:!1,again:!1,transfer:!1},S=!1,D="20",h={first:null,again:null,transfer:null},Y="";function L(){return Qt(y)}function It(){return document.documentElement.getAttribute("data-theme")==="dark"}function Nt(){return document.documentElement.getAttribute("data-scale")==="large"}function O(){try{"speechSynthesis"in window&&window.speechSynthesis.cancel()}catch{}}function w(t){if(j)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;(!T||T.state==="closed")&&(T=new e),T.state==="suspended"&&T.resume().catch(()=>{});const r=T.createOscillator(),s=T.createGain();r.connect(s),s.connect(T.destination);const n=T.currentTime;r.frequency.setValueAtTime(t==="fanfare"?659.25:t==="correct"?523.25:440,n),s.gain.setValueAtTime(.04,n),s.gain.exponentialRampToValueAtTime(.001,n+.11),r.start(n),r.stop(n+.11),r.onended=()=>{r.disconnect(),s.disconnect()}}catch{}}function nt(t=!1,e=!1){vt?.dispose(),O(),t||(y="M01"),e||V.clear(),$="bar",v="think",Pt=!1,K=!1,A={first:null,again:null,transfer:null},st="",ct="",Z=!1,G=!1,Q=!1,M=L().denominators.first[0],u=L().denominators.first[1],J=!1,C=1,R=jt.map(r=>({...r})),tt={0:null,1:null,2:null},rt=0,ht=0,x=[],B="",N=!1,q="",H={first:!1,again:!1,transfer:!1},S=!1,D="20",h={first:null,again:null,transfer:null},Y="",g()}function F(){return y==="M01"?"초코바":y==="M02"?"피자":"색테이프"}function Bt(){return y==="M01"?{fill:"#e08e2b",bg:"var(--lesson-bar-bg, #fbf5ef)",stroke:"var(--lesson-bar-stroke, #5c3317)"}:y==="M02"?{fill:"#ffca62",bg:"var(--lesson-bar-bg, #fffaf0)",stroke:"var(--lesson-bar-stroke, #b45309)"}:{fill:"#ff8da1",bg:"var(--lesson-bar-bg, #fff5f7)",stroke:"var(--lesson-bar-stroke, #153a69)"}}function ne(t,e=!1){const{fill:a,bg:o,stroke:l}=Bt();if(e)return`<figure class="fraction fraction-circle">
      <svg viewBox="0 0 160 160" role="img"
        aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${t}명이 똑같이 나눌 예정)">
        <circle cx="80" cy="80" r="60" fill="${a}" fill-opacity="0.28" stroke="${l}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="80" cy="80" r="52" fill="none" stroke="${l}" stroke-width="1.2" stroke-opacity="0.4"/>
        <text x="80" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text>
        <text x="80" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">? (${t}등분 중 1조각)</text>
      </svg>
      <figcaption>상상하기: 똑같은 ${F()}를 <strong>${t}명</strong>이 나눈 한 조각 (<strong>1/${t}</strong>)</figcaption>
    </figure>`;const c=2*Math.PI/t,i=-Math.PI/2,d=i+c,f=80+60*Math.cos(i),p=80+60*Math.sin(i),k=80+60*Math.cos(d),m=80+60*Math.sin(d),W=c>Math.PI?1:0,kt=`M 80 80 L ${f.toFixed(2)} ${p.toFixed(2)} A 60 60 0 ${W} 1 ${k.toFixed(2)} ${m.toFixed(2)} Z`,ft=i+c/2,I=(80+60*.52*Math.cos(ft)).toFixed(2),pt=(80+60*.52*Math.sin(ft)).toFixed(2),wt=Array.from({length:t},(P,gt)=>{const Ft=i+gt*c,zt=80+60*Math.cos(Ft),Wt=80+60*Math.sin(Ft);return`<line x1="80" y1="80" x2="${zt.toFixed(2)}" y2="${Wt.toFixed(2)}" stroke="${l}" stroke-width="1.8"/>`}).join("");return`<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${t}">
      <circle cx="80" cy="80" r="60" fill="${o}" stroke="${l}" stroke-width="3"/>
      <path d="${kt}" fill="${a}"/>
      <circle cx="${I}" cy="${pt}" r="${t>=9?3.2:4.5}" fill="#d9381e" fill-opacity="0.85"/>
      ${wt}
      <circle cx="80" cy="80" r="60" fill="none" stroke="${l}" stroke-width="3"/>
    </svg>
    <figcaption>같은 ${F()}의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function ae(t){const n=528/t,a=36+n,o=Array.from({length:t+1},(l,c)=>{const i=(36+c*n).toFixed(2),d=c===0||c===t;return`<line x1="${i}" y1="${d?22:28}" x2="${i}" y2="${d?54:48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${d?3:2}"/>`}).join("");return`<figure class="fraction fraction-numberline">
    <svg viewBox="0 0 600 78" role="img"
      aria-label="0에서 1까지를 ${t}등분하고 첫 눈금을 표시한 수직선 모형, 1/${t}">
      <rect x="36" y="31" width="${n.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      <line x1="36" y1="38" x2="564" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${o}
      <circle cx="${a.toFixed(2)}" cy="38" r="6" fill="#d9381e"/>
      <text x="36" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="${a.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${t}</text>
      <text x="564" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text>
    </svg>
    <figcaption>0~1 수직선의 <strong>1/${t}</strong> 눈금</figcaption>
  </figure>`}function oe(t){const a=120/t,o=136-a,l=Array.from({length:t-1},(c,i)=>{const d=(16+(i+1)*120/t).toFixed(2);return`<line x1="48" y1="${d}" x2="112" y2="${d}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`}).join("");return`<figure class="fraction fraction-cup">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${t}등분하고 한 눈금만큼 채운 들이 모형, 1/${t}">
      <rect x="40" y="16" width="80" height="120" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="42" y="${o.toFixed(2)}" width="76" height="${a.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${l}
      <rect x="40" y="16" width="80" height="120" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 컵의 <strong>1/${t}컵</strong></figcaption>
  </figure>`}function yt(t,e=!1){if($==="circle")return ne(t,e);if($==="numberline")return ae(t);if($==="cup")return oe(t);const{fill:r,bg:s,stroke:n}=Bt();if(e)return`<figure class="fraction">
      <svg viewBox="0 0 600 70" role="img"
        aria-label="아직 자르지 않은 전체 길이가 같은 ${F()} 모형 (${t}명이 똑같이 나눌 예정)">
        <rect x="0" y="10" width="600" height="48" rx="8" fill="${r}" fill-opacity="0.22" stroke="${n}" stroke-width="3" stroke-dasharray="8 5"/>
        <line x1="14" y1="34" x2="586" y2="34" stroke="${n}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <text x="300" y="39" text-anchor="middle" font-size="15" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">전체 크기가 똑같은 ${F()} 1개 · ✂️ ${t}조각으로 나누면 1/${t}은?</text>
      </svg>
      <figcaption>상상하기: 같은 ${F()}를 <strong>${t}명</strong>이 똑같이 나눈 한 조각 (<strong>1/${t}</strong>)</figcaption>
    </figure>`;const a=Gt(t),o=600/t,l=a.slice(1).map(i=>`<line x1="${600*i.start}" y1="10" x2="${600*i.start}" y2="58" stroke="${n}" stroke-width="2"/>`).join(""),c=y==="M01"?`<rect x="6" y="16" width="${Math.max(8,o-12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`:y==="M02"?`<circle cx="${Math.min(580,o*.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`:`<line x1="6" y1="34" x2="${Math.max(10,o-6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`;return`<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 막대, 1/${t}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="${s}" stroke="${n}" stroke-width="3"/>
      <rect x="0" y="10" width="${o}" height="48" rx="4" fill="${r}"/>
      ${c}
      ${l}
    </svg>
    <figcaption>같은 ${F()}의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function Rt(t,e,r=!1,s=!1){return`<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${$==="circle"}">${$==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
      ${r?`<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${$==="numberline"}">📐 수직선으로 보기</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${$==="cup"}">🥤 주스 컵으로 보기</button>`:""}
    </div>
    <div class="bar-pair">${yt(t,s)}${yt(e,s)}</div>`}function ut(t){return t==="transfer"}function z(t){return ut(t)?"B":"A"}function et(t,e,r,s="first"){if(!t)return"아직 선택하지 않음";const[n,a]=ut(s)?[r,e]:[e,r];return{A:`1/${n}이 더 크다`,B:`1/${a}이 더 크다`,C:"두 조각의 크기가 같다",D:"아직 잘 모르겠다"}[t]}function Ct(t,e,r){const s=A[t],[n,a]=ut(t)?[r,e]:[e,r],o=[`A. 1/${n} 조각이 더 크다`,`B. 1/${a} 조각이 더 크다`,"C. 두 조각의 크기가 같다","D. 아직 잘 모르겠다"];return`<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${E.map((l,c)=>`<button type="button" data-pick-poll="${t}" data-pick-choice="${l}" class="solo-choice-btn ${s===l?"solo-choice-selected":""}" aria-pressed="${s===l}">${o[c]}</button>`).join("")}
  </div>`}function Et(t,e,r){const s=A[t];if(!s)return"";if(t==="first")return`<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각으로 <strong>"${et(s,e,r,t)}"</strong>을(를) 골랐어요! 이제 2단계에서 직접 잘라 확인해 볼까요?</p>`;const n=z(t);return s===n?`<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 더 적게 나눈 <strong>1/${e}</strong> 한 조각이 <strong>1/${r}</strong> 한 조각보다 더 큽니다.</p>`:s==="C"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 나눈 조각 수가 ${e}등분과 ${r}등분으로 서로 다르기 때문에 한 조각의 크기도 달라요. 덜 나눈 <strong>1/${e}</strong>이 더 큽니다.</p>`:s==="D"?`<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 같은 전체를 덜 나눈 조각일수록 한 조각의 크기가 더 커요. 따라서 <strong>1/${e}</strong> 조각이 <strong>1/${r}</strong> 조각보다 더 큽니다.</p>`:`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 분모 숫자 ${r}이 ${e}보다 크지만, 같은 전체를 더 여러 조각으로 나누면 한 조각의 크기는 오히려 작아져요! 따라서 <strong>1/${e}</strong>(${n}번)이 더 큽니다.</p>`}function Ot(t){if(S)return"🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.";const e=h[t]??dt(),r=ot(D);if(!r)return`⚠️ 참여 인원은 1~${xt} 사이의 자연수로 입력해 주세요.`;const s=bt(e,r),n=z(t);if(s)return`집계 완료: 정답(${n}) ${s.counts[n]}/${r}명 · 미응답 ${s.noResponse}명`;if(E.every(o=>/^(?:0|[1-9]\d*)$/.test(e[o]))){const o=E.reduce((l,c)=>l+Number(e[c]),0);if(o>r)return`⚠️ 보기 인원 합계(${o}명)가 참여 인원(${r}명)보다 많습니다. 인원수를 확인해 주세요.`}return"학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요."}function Xt(t,e,r){if(S)return`<div class="live-poll-chart" data-chart-poll="${t}"><p class="chart-blind-msg">🙈 결과 공개 시 보기별 막대그래프가 표시됩니다.</p></div>`;const s=h[t]??dt(),[n,a]=ut(t)?[r,e]:[e,r],o={A:`A (1/${n})`,B:`B (1/${a})`,C:"C (같다)",D:"D (모름)"},l=E.map(f=>Math.max(0,parseInt(s[f],10)||0)),c=l.reduce((f,p)=>f+p,0),i=Math.max(1,ot(D)??20,c),d=z(t);return`<div class="live-poll-chart" data-chart-poll="${t}" role="region" aria-label="학급 투표 실시간 막대그래프">
    ${E.map((f,p)=>{const k=l[p],m=Math.min(100,Math.round(k/i*100));return`<div class="poll-bar-row">
        <span class="poll-bar-label">${o[f]}</span>
        <div class="poll-bar-track"><div class="poll-bar-fill ${f===d?"poll-bar-correct":""}" style="width: ${m}%"></div></div>
        <span class="poll-bar-val">${k}명 (${m}%)</span>
      </div>`}).join("")}
  </div>`}function At(t,e,r){const s=h[t]??dt(),[n,a]=ut(t)?[r,e]:[e,r],o=[`A (1/${n})`,`B (1/${a})`,"C (같다)","D (모름)"],l=t==="transfer"?"participants-transfer":"participants";return`<details class="class-poll-details" data-poll-details="${t}" ${H[t]?"open":""}>
    <summary>👩‍🏫 교실 수업용 거수 투표·인원수 기록하기 (필요할 때만 열기)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${xt}명) <input id="${l}" data-participants-input="${t}" type="text" inputmode="numeric" value="${D}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" data-target-poll="${t}" class="secondary-btn" aria-pressed="${S}">${S?"👀 결과 공개하기":"🙈 결과 잠시 가리기"}</button>
      </div>
      <div class="class-poll-inputs">
        ${E.map((c,i)=>`<div class="poll-counter-card">
            <label>${o[i]} <input data-count="${c}" data-count-poll="${t}" type="text" inputmode="numeric" value="${S?"•":s[c]}" aria-label="${c} 선택 인원" autocomplete="off" ${S?"readonly":""}></label>
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
      ${Xt(t,e,r)}
      <p class="class-poll-status" data-status-poll="${t}" role="status">${Ot(t)}</p>
    </div>
  </details>`}function ie(){const t=L(),[e,r]=t.denominators.first,s=lt[y]??lt.M01;return`
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${Dt().map(a=>{const o=a.id===y,l=V.has(a.id);return`<button type="button" data-unit-id="${a.id}" class="unit-card-btn ${o?"unit-card-active":""}" aria-pressed="${o}">
      <span class="unit-stamp-tag">${l?"⭐ 클리어 완료!":o?"🔍 지금 탐구 중":"👆 눌러서 시작"}</span>
      <strong>${a.title}</strong>
      <span>${a.description}</span>
    </button>`}).join("")}
    </div>

    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${e}과 1/${r} 비교</h2>

      <div class="story-dilemma-card" role="region" aria-label="${s.badge}">
        <div class="story-card-header">
          <span class="story-badge">${s.badge}</span>
          <button type="button" data-action="speak-story" class="secondary-btn tts-btn">🔊 이야기 읽어주기</button>
        </div>
        <p class="question-lead">${s.lead}</p>
        ${Pt?'<p id="tts-status" class="tts-status" role="status">🔊 이야기를 음성으로 읽어주었어요!</p>':""}
      </div>

      <p class="teacher-talk-banner">${mt.think}</p>

      ${Rt(e,r,!1,!K)}
      <div class="spoiler-hint-row">
        <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${K}">
          ${K?"🙈 자르기 전 모양으로 다시 가리기":"👀 자른 눈금 힌트 살짝 미리 보기"}
        </button>
      </div>

      ${Ct("first",e,r)}
      ${Et("first",e,r)}

      <div class="reason-section">
        <h3>💭 왜 그렇게 생각했나요? (내 생각과 가장 비슷한 말풍선 고르기)</h3>
        <div class="actions reason-bubble-list">
          ${re.map((a,o)=>`<button type="button" data-reason="${o}" class="reason-bubble-btn" aria-label="${a}" aria-pressed="${st===String(o)}">
              <span class="student-bubble">${qt[o]}</span>
            </button>`).join("")}
        </div>
        ${ct?`<p class="ai-linked-badge">🤖 로컬 AI 추천 탐구 연결됨: <strong>${ct}</strong></p>`:""}
      </div>

      ${At("first",e,r)}

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn">② 직접 실험하러 가기 →</button>
      </div>
    </div>`}function Ut(t){const e=t<u?">":t>u?"<":"=",r=t<u?`${t}등분 한 조각이 ${u}등분 한 조각보다 더 큽니다`:t>u?`${u}등분 한 조각이 ${t}등분 한 조각보다 더 큽니다`:"두 조각의 크기가 같습니다";return{barsHtml:`${yt(t)}${yt(u)}`,badgeHtml:`크기 비교: <strong>1/${t} ${e} 1/${u}</strong> (${r})`,discoveryHtml:J?'<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>':""}}function at(){const t=Math.max(1,Math.min(u,C)),{fill:e,bg:r,stroke:s}=Bt(),n=600/u,a=n*t,o=Array.from({length:u-1},(c,i)=>{const d=((i+1)*n).toFixed(2);return`<line x1="${d}" y1="10" x2="${d}" y2="54" stroke="${s}" stroke-width="2"/>`}).join(""),l=t===u;return`<figure class="whole-fill-figure">
      <svg viewBox="0 0 600 66" role="img" aria-label="1/${u} 조각을 ${t}개 모아 ${t}/${u}만큼 채운 막대">
        <rect x="0" y="10" width="600" height="44" rx="6" fill="${r}" stroke="${s}" stroke-width="3"/>
        <rect x="0" y="10" width="${a.toFixed(2)}" height="44" rx="4" fill="${e}"/>
        ${o}
      </svg>
      <figcaption>1/${u} 조각 <strong>${t}개</strong> 모음 = <strong>${t}/${u}</strong> ${l?"(= 전체 1 완성!)":""}</figcaption>
    </figure>
    <div class="fill-whole-controls" role="group" aria-label="단위분수 조각 모아 전체 1 채우기 조작">
      <button type="button" data-action="fill-piece-add" class="secondary-btn" ${l?"disabled":""}>➕ 1/${u} 조각 더 채우기</button>
      <button type="button" data-action="fill-piece-full" class="secondary-btn" ${l?"disabled":""}>⚡ 끝까지 채우기 (${u}/${u} = 1)</button>
      <button type="button" data-action="fill-piece-reset" class="secondary-btn" ${t<=1?"disabled":""}>🔄 1조각으로 비우기</button>
    </div>
    <p id="fill-whole-status" class="answer" role="status">${l?`🎉 <strong>전체 1 완성!</strong> <strong>1/${u}</strong> 조각을 <strong>${u}개</strong> 모으니 전체 1(${u}/${u})이 꼭 맞게 채워졌어요! 한 조각이 작을수록 전체 1을 채우는 데 더 많은 조각이 필요합니다.`:`🧩 현재 <strong>1/${u}</strong> 조각 <strong>${t}개(${t}/${u})</strong>를 채웠어요. 전체 1이 되려면 조각 <strong>${u-t}개</strong>가 더 필요해요!`}</p>`}function $t(){C=Math.max(1,Math.min(u,C));const{barsHtml:t,badgeHtml:e,discoveryHtml:r}=Ut(M),s=b.querySelector("#explore-exp2-bars");s&&(s.innerHTML=t);const n=b.querySelector("#explore-base-output");n&&(n.textContent=`기준 분수: 1/${M} (${M}등분)`);const a=b.querySelector('button[data-action="base-less"]');a&&(a.disabled=M<=X);const o=b.querySelector('button[data-action="base-more"]');o&&(o.disabled=M>=U);const l=b.querySelector("#explore-denom-output");l&&(l.textContent=`${u}등분 (1/${u})`);const c=b.querySelector("#explore-slider");c&&c.value!==String(u)&&(c.value=String(u));const i=b.querySelector('button[data-action="less"]');i&&(i.disabled=u<=X);const d=b.querySelector('button[data-action="more"]');d&&(d.disabled=u>=U),b.querySelectorAll("button[data-quick-denom]").forEach(m=>{const W=Number(m.dataset.quickDenom)===u;m.setAttribute("aria-pressed",String(W)),m.classList.toggle("quick-denom-active",W)});const f=b.querySelector("#explore-cmp-badge");f&&(f.innerHTML=e);const p=b.querySelector("#explore-discovery-2");p&&(p.innerHTML=r);const k=b.querySelector("#fill-whole-box");k&&(k.innerHTML=at())}function le(){const[t,e]=L().denominators.first,r=et(A.first,t,e,"first"),s=st!==""?qt[Number(st)]:"내 처음 생각을 직접 실험으로 확인해 볼까요?",n=600/t,a=600/e,o=Math.max(0,n-a),{barsHtml:l,badgeHtml:c,discoveryHtml:i}=Ut(M),d=se.map(f=>{const p=u===f;return`<button type="button" data-quick-denom="${f}" class="secondary-btn quick-denom-btn ${p?"quick-denom-active":""}" aria-pressed="${p}">👧 ${f}명이 나눌 때 (1/${f})</button>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 재미있는 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>나의 처음 생각</strong>: <strong>${r}</strong></p>
        <p class="hypothesis-sub">${s}</p>
      </div>

      <p class="teacher-talk-banner">${mt.explore}</p>

      <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
        <h3>실험 1 · 가위로 잘라 두 조각을 포개어 대어 보기</h3>
        <p>1/${t} 조각과 1/${e} 조각의 왼쪽 끝을 똑같이 맞추어 포개어 볼까요?</p>
        <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${Z}">
          ${Z?"✂️ 포개어 비교한 결과 닫기":"✂️ 1/"+t+" 조각과 1/"+e+" 조각 포개어 비교하기"}
        </button>

        ${Z?`
          <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
            <svg viewBox="0 0 600 92" role="img" aria-label="1/${t} 조각과 1/${e} 조각을 겹쳐 길이 차이를 비교한 그림">
              <rect x="0" y="8" width="600" height="74" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <rect x="0" y="14" width="${n.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(535,n+8).toFixed(2)}" y="32" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${t} 한 조각</text>
              <rect x="0" y="46" width="${a.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <rect x="${a.toFixed(2)}" y="46" width="${o.toFixed(2)}" height="26" rx="4" fill="#fde2e2" stroke="#d9381e" stroke-width="2" stroke-dasharray="4 2"/>
              <text x="${Math.min(430,n+8).toFixed(2)}" y="64" font-size="13" font-weight="800" fill="#d9381e">← 이만큼 1/${t}이 더 길어요!</text>
              <line x1="${a.toFixed(2)}" y1="10" x2="${a.toFixed(2)}" y2="78" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
            </svg>
            <p class="answer">💡 <strong>발견 1</strong>: 왼쪽 끝을 맞추어 포개어 보니, 덜 나눈 <strong>1/${t}</strong> 조각이 <strong>1/${e}</strong> 조각보다 빨간 점선 칸만큼 확실히 더 깁니다!</p>
          </div>
        `:""}
      </section>

      <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
        <h3>실험 2 · 양쪽 단위분수의 나누는 사람 수(분모)를 2명~12명 사이에서 자유롭게 비교하기</h3>
        <p>위쪽 기준 분수와 아래쪽 실험 분수를 원하는 등분 수로 바꾸어 어떤 분수끼리든 직접 비교해 보세요.</p>

        <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
          <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${$==="circle"}">${$==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
        </div>

        <div class="base-denom-controls" role="group" aria-label="위쪽 기준 분수 분모 조절">
          <button type="button" data-action="base-less" class="secondary-btn" ${M<=X?"disabled":""} aria-label="기준 분모 줄이기">기준 −1</button>
          <output id="explore-base-output" aria-live="polite">기준 분수: 1/${M} (${M}등분)</output>
          <button type="button" data-action="base-more" class="secondary-btn" ${M>=U?"disabled":""} aria-label="기준 분모 늘리기">기준 ＋1</button>
        </div>

        <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">
          ${d}
        </div>

        <div id="explore-exp2-bars" class="bar-pair">${l}</div>

        <div class="slider-experiment-controls">
          <button type="button" data-action="less" ${u<=X?"disabled":""} aria-label="등분 수 줄이기">−</button>
          <input id="explore-slider" type="range" min="${X}" max="${U}" value="${u}" aria-label="나누는 조각 수 슬라이더">
          <output id="explore-denom-output" aria-live="polite">${u}등분 (1/${u})</output>
          <button type="button" data-action="more" ${u>=U?"disabled":""} aria-label="등분 수 늘리기">＋</button>
        </div>

        <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${c}</p>
        <div id="explore-discovery-2" aria-live="polite">${i}</div>
      </section>

      <section class="experiment-box" aria-label="실험 3 단위분수 조각 모아 전체 1 채우기">
        <h3>실험 3 · 단위분수 조각을 하나씩 모아 '전체 1' 완성하기</h3>
        <p>단위분수 조각을 몇 개 모아야 원래 전체 1이 꼭 맞게 채워지는지 직접 채워 보세요!</p>
        <div id="fill-whole-box">${at()}</div>
      </section>

      <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
        <h3>😮 깜짝 실험 · 만약 원래 ${F()} 전체 크기가 서로 다르면 어떨까요?</h3>
        <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${G}">
          ${G?"😮 깜짝 함정 실험 닫기":"😮 깜짝 실험 열어 보기: 미니 간식의 1/2 vs 특대형 간식의 1/4"}
        </button>
        ${G?`
          <div class="trap-experiment-content" role="region" aria-label="전체 크기가 서로 다른 두 간식 비교">
            <svg viewBox="0 0 600 84" role="img" aria-label="작은 미니 간식의 1/2 조각(길이 100)과 특대형 간식의 1/4 조각(길이 140) 비교">
              <rect x="0" y="10" width="200" height="26" rx="4" fill="#fff" stroke="#153a69" stroke-width="2"/>
              <rect x="0" y="10" width="100" height="26" rx="4" fill="#ffca62" stroke="#153a69" stroke-width="2"/>
              <text x="212" y="28" font-size="13" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">작은 미니 ${F()}의 1/2 한 조각</text>
              <rect x="0" y="46" width="560" height="26" rx="4" fill="#fff" stroke="#153a69" stroke-width="2"/>
              <rect x="0" y="46" width="140" height="26" rx="4" fill="#7cc6fe" stroke="#153a69" stroke-width="2"/>
              <text x="150" y="64" font-size="13" font-weight="700" fill="#d9381e">특대형 점보 ${F()}의 1/4 한 조각 (더 큼!)</text>
            </svg>
            <p class="answer">💡 <strong>깜짝 발견!</strong> 원래 전체 크기가 다르면 <strong>1/4</strong>이 <strong>1/2</strong>보다 더 클 수도 있어요! 그래서 단위분수의 크기를 비교할 때는 반드시 <strong>"원래 전체의 크기가 똑같다"</strong>는 약속이 먼저 있어야 합니다.</p>
          </div>
        `:""}
      </section>

      <section class="experiment-box reallife-box" aria-label="생활 속 숨은 단위분수 찾기">
        <h3>🕒 생활 속 실험 · 시계판(60분)과 판초콜릿(12칸)에서 단위분수 찾기</h3>
        <button type="button" data-action="toggle-reallife" class="secondary-btn" aria-pressed="${Q}">
          ${Q?"🕒 생활 속 단위분수 실험 닫기":"🕒 생활 속 단위분수 열기: 1시간의 1/2(30분) vs 1/4(15분) & 12칸 초콜릿"}
        </button>
        ${Q?`
          <div class="reallife-content" role="region" aria-label="시계판과 12칸 초콜릿 단위분수 비교">
            <div class="reallife-grid">
              <div class="reallife-item">
                <strong>⏰ 1시간(60분) 시계판 비교</strong>
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
                <p>1시간의 <strong>1/2은 30분</strong>, <strong>1/4은 15분</strong>이에요. 시계판에서도 <strong>1/2 &gt; 1/4</strong>임을 한눈에 알 수 있어요!</p>
              </div>
              <div class="reallife-item">
                <strong>🍫 12칸 판초콜릿 비교</strong>
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
                <p>12칸 전체를 똑같이 나누면 <strong>1/3은 4칸</strong>, <strong>1/4은 3칸</strong>이에요. 따라서 <strong>1/3 &gt; 1/4</strong>입니다!</p>
              </div>
            </div>
          </div>
        `:""}
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`}function ce(){const[t,e]=L().denominators.first,[r,s]=L().denominators.transfer,n=R.filter(i=>tt[i.id]===i.answer).length,a=R.map(i=>{const d=tt[i.id],f=d===i.answer;return`<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${i.id+1}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${i.id+1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${i.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${d==="left"?"solo-choice-selected":""}" aria-pressed="${d==="left"}">1/${i.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${i.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${d==="right"?"solo-choice-selected":""}" aria-pressed="${d==="right"}">1/${i.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${d===null?"👆 더 큰 쪽을 터치!":f?"🎉 정답!":`💡 1/${Math.min(i.leftDenom,i.rightDenom)}이 더 커요!`}</span>
    </div>`}).join(""),o=x.length===St.length,l=o&&x[0]===2&&x[1]===6&&x[2]===9,c=o?l?"🎉 <strong>칙칙폭폭 출발!</strong> 분모가 작은 수부터 <strong>1/2 &gt; 1/6 &gt; 1/9</strong> 순서로 완벽하게 줄을 세웠어요!":"💡 <strong>다시 줄을 세워 볼까요?</strong> 분모 숫자가 작을수록 한 조각이 더 크답니다. [🔄 기차 다시 줄 세우기]를 눌러 가장 큰 조각(1/2)부터 태워 보세요!":"👆 위 분수 버튼을 가장 큰 조각부터 차례대로 눌러 1호차 → 2호차 → 3호차에 태워 보세요!";return`
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 실험 후 내 생각 확인과 분수 대결</h2>

      <p class="teacher-talk-banner">${mt.check}</p>

      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기: 같은 ${F()}에서 1/${t}과 1/${e} 중 어느 쪽이 더 클까요?</h3>
        <p class="first-memory-tag">💭 1단계에서 고른 내 처음 생각: <strong>${et(A.first,t,e,"first")}</strong></p>
        ${Ct("again",t,e)}
        ${Et("again",t,e)}
        ${At("again",t,e)}
      </section>

      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 한 걸음 더! 새로운 문제: 같은 전체에서 <strong>1/${s}</strong>과 <strong>1/${r}</strong> 중 어느 쪽이 더 클까요?</h3>
        <p class="transfer-caution-note">🔍 보기 순서를 잘 보고 더 큰 조각을 골라 보세요!</p>
        ${Rt(s,r,!0)}
        ${Ct("transfer",r,s)}
        ${Et("transfer",r,s)}
        ${At("transfer",r,s)}
      </section>

      <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
        <div class="duel-header-row">
          <h3>3) ⚡ 번개 미니게임 · 어느 조각이 더 클까요? (더 큰 분수 카드를 콕 찍어 보세요!)</h3>
          <button type="button" data-action="duel-shuffle" class="secondary-btn">🎲 새로운 랜덤 대결 3문제 뽑기</button>
        </div>
        <div class="duel-rounds-list">
          ${a}
        </div>
        <p class="duel-score-banner" role="status">🎯 미니게임 현재 점수: <strong>${n} / ${R.length}</strong> 정답 ${n===R.length?"🏆 퍼펙트 클리어!":""} · <span id="duel-streak-badge">🔥 연속 정답 콤보: ${rt}연속</span></p>
      </section>

      <section class="check-subcard train-puzzle-box" aria-label="분수 기차 줄 세우기 퍼즐">
        <h3>4) 🚂 분수 기차 줄 세우기 · 가장 큰 조각부터 순서대로 기차에 태워 보세요!</h3>
        <div class="train-pick-row" role="group" aria-label="기차에 태울 단위분수 고르기">
          ${St.map(i=>`<button type="button" data-train-denom="${i}" class="secondary-btn train-pick-btn" ${x.includes(i)?"disabled":""}>🚂 1/${i} 조각 태우기</button>`).join("")}
          <button type="button" data-action="train-reset" class="secondary-btn">🔄 기차 다시 줄 세우기</button>
        </div>
        <div class="train-cars" role="group" aria-label="분수 기차 칸">
          ${[0,1,2].map(i=>`<div class="train-car">${i+1}호차: <strong>${x[i]?`1/${x[i]}`:"빈칸"}</strong></div>`).join('<span class="train-link" aria-hidden="true">&gt;</span>')}
        </div>
        <p id="train-status" class="answer" role="status">${c}</p>
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`}function de(){V.add(y);const t=L(),[e,r]=t.denominators.first,[s,n]=t.denominators.transfer,a=lt[y]??lt.M01,o=N?"작아집니다!":B==="bigger"?"커집니다(?)":B==="same"?"같습니다(?)":"______",l=A.again===z("again"),c=A.transfer===z("transfer"),i=l&&c?"🏆 최고예요! 직접 실험을 통해 단위분수의 크기 비교 원리를 완벽하게 내 것으로 만들었어요!":l||c?"🌟 참 잘했어요! 실험을 통해 같은 전체를 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!":"🌱 끝까지 스스로 실험하고 생각하며 단위분수의 비밀을 탐구했어요!",d=ot(D),f=!S&&d&&h.first?bt(h.first,d):null,p=!S&&d&&h.again?bt(h.again,d):null,k=!S&&d&&h.transfer?bt(h.transfer,d):null,m=[];if(f&&p&&d){const P=Zt(f.counts.A,p.counts.A,d);m.push(`처음·재선택 정답(1/${e}) 인원: <strong>${f.counts.A}/${d}명 → ${p.counts.A}/${d}명</strong> (${P>=0?"+":""}${P.toFixed(1)}%p)`)}k&&d&&m.push(`응용 문제 정답(1/${s}, B번) 인원: <strong>${k.counts.B}/${d}명</strong>`);const W=m.length>0?`<p class="comparison">👩‍🏫 <strong>학급 전체 집계 요약</strong>: ${m.join(" · ")}</p>`:"",kt=N?'<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 똑같이 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>':B==="bigger"||B==="same"?'<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 2단계 실험에서 나누는 사람 수를 12명으로 늘렸을 때 한 조각의 크기가 어떻게 변했는지 떠올려 보세요!</p>':"",ft=q==="correct"?`<p id="letter-reply" class="answer feedback-correct" role="status">📬 <strong>${a.friend}의 답장</strong>: "아하! 똑같은 간식을 더 많은 사람이 나누어 먹을수록 한 조각이 작아진다는 걸 생각하니 왜 분모가 작은 단위분수가 더 큰지 완전히 이해됐어. 친절하게 알려줘서 정말 고마워!"</p>`:q==="wrong"?`<p id="letter-reply" class="answer feedback-hint" role="status">💡 ${a.friend}가 아직 헷갈려하고 있어요! 같은 간식을 더 많은 조각으로 나누었을 때 한 조각이 어떻게 변했는지 다시 골라 볼까요?</p>`:"",I=Dt(),pt=I.find(P=>!V.has(P.id))??I[(I.findIndex(P=>P.id===y)+1)%I.length],wt=I.map(P=>{const gt=V.has(P.id);return`<div class="stamp-item ${gt?"stamp-done":""}">
      <span class="stamp-icon">${gt?"🎖️ 클리어!":"🔒 미도전"}</span>
      <strong>${P.title}</strong>
    </div>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 내 생각의 성장 카드와 마스터 스탬프</h2>

      <p class="teacher-talk-banner">${mt.result}</p>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${i}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 내 생각 (1/${e} vs 1/${r})</span>
            <strong>${et(A.first,e,r,"first")}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${l?"journey-correct":""}">
            <span class="journey-label">② 실험 후 내 생각 (1/${e} vs 1/${r})</span>
            <strong>${et(A.again,e,r,"again")} ${l?"⭐":""}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${c?"journey-correct":""}">
            <span class="journey-label">③ 응용 문제 (1/${n} vs 1/${s})</span>
            <strong>${et(A.transfer,s,n,"transfer")} ${c?"⭐":""}</strong>
          </div>
        </div>
        ${W}
      </div>

      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>🧩 단어 카드를 골라 오늘의 단위분수 규칙을 완성해 보세요!</h3>
        <div class="notebook-line">
          <p>"크기가 같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${o} ]</strong>"</p>
        </div>
        <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
          <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn ${B==="bigger"?"rule-card-wrong":""}" aria-pressed="${B==="bigger"}">📈 점점 커집니다</button>
          <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${N?"solo-choice-selected":""}" aria-pressed="${N}">📉 작아집니다!</button>
          <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn ${B==="same"?"rule-card-wrong":""}" aria-pressed="${B==="same"}">🟰 항상 똑같습니다</button>
        </div>
        ${kt}
      </div>

      <div class="friend-letter-card" role="region" aria-label="고민하던 친구에게 보내는 설명 편지">
        <h3>💌 1단계에서 고민하던 ${a.friend}에게 친절한 설명 편지를 보내 볼까요?</h3>
        <p>"분모 숫자가 클수록 조각도 더 클 거야!"라고 생각했던 ${a.friend}에게 어떤 설명을 보내면 좋을까요?</p>
        <div class="letter-choice-list" role="group" aria-label="친구에게 보낼 설명 고르기">
          <button type="button" data-letter-choice="correct" class="secondary-btn letter-choice-btn ${q==="correct"?"solo-choice-selected":""}" aria-pressed="${q==="correct"}">💌 "같은 전체를 더 많은 조각으로 나눌수록 한 조각의 크기는 오히려 작아지기 때문이야!"</button>
          <button type="button" data-letter-choice="wrong" class="secondary-btn letter-choice-btn ${q==="wrong"?"rule-card-wrong":""}" aria-pressed="${q==="wrong"}">💌 "분모 숫자가 크면 언제나 한 조각의 크기도 함께 커지기 때문이야!"</button>
        </div>
        ${ft}
      </div>

      <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
        <h3>🎖️ 분수 탐구 스탬프 투어 (${V.size} / ${I.length} 이야기 클리어!)</h3>
        <div class="stamp-grid">
          ${wt}
        </div>
      </div>

      <div class="print-certificate-box" role="region" aria-label="단위분수 탐구 박사 인증서 서명란">
        <p class="cert-title">🎓 단위분수 탐구 박사 인증서 · 배움 공책 붙임용</p>
        <p class="cert-sign-line">학번·이름: ____________________ &nbsp;|&nbsp; 오늘 나의 한 줄 소감: ________________________________________</p>
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄하기</button>
        <button type="button" data-action="next-unit" data-next-unit-id="${pt.id}" class="primary-next-btn">🚀 다음 이야기(${pt.title.split("·")[0].trim()}) 도전하기 →</button>
        <button type="button" data-action="restart" class="secondary-btn">🔄 처음부터 다시 하기</button>
      </div>
    </div>`}function ue(){switch(v){case"think":return ie();case"explore":return le();case"check":return ce();case"result":return de()}}function fe(){const t=It(),e=Nt();return`<header>
    <p class="eyebrow">${Ht?"로컬 AI 보조 수업":"초등 수학 분수 탐구"} · 단위분수 크기 비교</p>
    <h1>생각의 갈림길 AI</h1>
    <p>직접 나누고 겹쳐 보며 분수의 크기를 스스로 깨닫는 4단계 탐구</p>
    <div class="header-controls">
      <button id="sound-toggle" class="scale-toggle" aria-label="효과음 전환" aria-pressed="${j}" type="button">${j?"🔊 효과음":"🔇 음소거"}</button>
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${e}" type="button">${e?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${t}" type="button">${t?"☀️":"🌙"}</button>
    </div>
  </header>`}function pe(){const t=_.indexOf(v);return`<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${_.map((e,r)=>{const s=r<t,n=r===t;return`<button type="button" class="${s?"step-pill done":n?"step-pill current":"step-pill"}" data-step-index="${r}" aria-current="${n?"step":"false"}">${_t[e]}</button>`}).join("")}
    </div>
  </nav>`}function g(t=!1){v!=="check"&&($==="numberline"||$==="cup")&&($="bar");const e=_t[v];if(b.innerHTML=[fe(),pe(),`<section id="step" role="region" aria-label="${e}">${ue()}<p id="error" role="alert">${Y}</p></section>`,'<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>',"<footer>이 화면의 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>"].join(""),vt?.sync(v==="think"),t){b.querySelector("#step h2")?.focus();const r=b.querySelector("#step-announce");r&&(r.textContent=`${_t[v]} 단계로 이동했습니다.`)}}function Tt(){const t=L(),[e,r]=t.denominators.first,[s,n]=t.denominators.transfer;b.querySelectorAll(".class-poll-status[data-status-poll]").forEach(a=>{const o=a.dataset.statusPoll;a.textContent=Ot(o)}),b.querySelectorAll(".live-poll-chart[data-chart-poll]").forEach(a=>{const o=a.dataset.chartPoll,[l,c]=o==="transfer"?[s,n]:[e,r];a.outerHTML=Xt(o,l,c)}),b.querySelectorAll("input[data-participants-input]").forEach(a=>{a!==document.activeElement&&a.value!==D&&(a.value=D)})}b.addEventListener("toggle",t=>{const e=t.target;if(e instanceof HTMLDetailsElement&&e.classList.contains("class-poll-details")){const r=e.dataset.pollDetails||"first";H[r]=e.open}},!0);b.addEventListener("input",t=>{const e=t.target;if(e.id==="explore-slider"){u=Number(e.value),C=1,J=!0,$t();return}if(e.id==="participants"||e.dataset.participantsInput){D=e.value;const r=e.dataset.participantsInput||"first";H[r]=!0,Tt();return}if(e.dataset.count&&e.dataset.countPoll){if(S)return;const r=e.dataset.countPoll,s=e.dataset.count;h[r]??=dt(),h[r][s]=e.value,H[r]=!0,Tt()}});window.addEventListener("keydown",t=>{if(!t.altKey)return;const e=document.activeElement?.tagName;if(e==="INPUT"||e==="TEXTAREA")return;const r=_.indexOf(v);t.key==="ArrowRight"&&r<_.length-1?(t.preventDefault(),O(),v=_[r+1],g(!0)):t.key==="ArrowLeft"&&r>0&&(t.preventDefault(),O(),v=_[r-1],g(!0))});b.addEventListener("click",t=>{const e=t.target.closest("button");if(!e)return;if(e.id==="sound-toggle"){j=!j,j||O(),e.textContent=j?"🔊 효과음":"🔇 음소거",e.setAttribute("aria-pressed",String(j)),j&&w("click");return}if(e.id==="theme-toggle"){const s=It()?"light":"dark";document.documentElement.setAttribute("data-theme",s),e.textContent=s==="dark"?"☀️":"🌙",e.setAttribute("aria-pressed",String(s==="dark"));return}if(e.id==="scale-toggle"){const s=Nt()?"normal":"large";document.documentElement.setAttribute("data-scale",s),e.textContent=s==="large"?"🔍 기본":"🔍 큰글씨",e.setAttribute("aria-pressed",String(s==="large"));return}if(e.dataset.stepIndex!==void 0){const s=Number(e.dataset.stepIndex);Number.isInteger(s)&&s>=0&&s<_.length&&(O(),v=_[s],Y="",g(!0));return}if(e.dataset.unitId){y=e.dataset.unitId,nt(!0,!0);return}if(e.dataset.quickDenom!==void 0){u=Number(e.dataset.quickDenom),C=1,J=!0,w("click"),$t();return}if(e.dataset.duelRound!==void 0&&e.dataset.duelPick){const s=Number(e.dataset.duelRound),n=e.dataset.duelPick;if(tt[s]===n)return;tt[s]=n;const a=R.find(o=>o.id===s);a&&a.answer===n?(rt++,w("correct")):rt=0,g();return}if(e.dataset.trainDenom!==void 0){const s=Number(e.dataset.trainDenom);!x.includes(s)&&x.length<St.length&&(x=[...x,s],x.length===3&&x[0]===2&&x[1]===6&&x[2]===9?w("fanfare"):w("click"),g());return}if(e.dataset.ruleChoice){const s=e.dataset.ruleChoice;B=s,N=s==="smaller",N&&w("correct"),g();return}if(e.dataset.letterChoice){q=e.dataset.letterChoice,q==="correct"&&w("fanfare"),g();return}if(e.dataset.votePoll&&e.dataset.voteChoice&&e.dataset.voteDelta){const s=e.dataset.votePoll,n=e.dataset.voteChoice,a=Number(e.dataset.voteDelta);h[s]??={A:"0",B:"0",C:"0",D:"0"};for(const p of E)h[s][p].trim()===""&&(h[s][p]="0");const o=E.filter(p=>p!==n).reduce((p,k)=>p+(parseInt(h[s][k],10)||0),0),l=parseInt(h[s][n],10)||0,c=Math.max(0,xt-o),i=Math.max(0,Math.min(c,l+a));h[s][n]=String(i);const d=o+i,f=ot(D);(!f||d>f)&&(D=String(Math.max(1,Math.min(xt,d)))),H[s]=!0,g();return}if(e.dataset.pickPoll&&e.dataset.pickChoice){const s=e.dataset.pickPoll,n=e.dataset.pickChoice;A[s]=n,Y="",w(s!=="first"&&n===z(s)?"correct":"click"),g();return}if(e.dataset.reason!==void 0){st=e.dataset.reason,ct="",w("click"),g();return}const r=e.dataset.action;if(r==="speak-story"){Pt=!0,w("click");try{const s=(lt[y]?.lead??"").replace(/<[^>]+>/g,"");if("speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u"){window.speechSynthesis.cancel();const n=new SpeechSynthesisUtterance(s);n.lang="ko-KR",window.speechSynthesis.speak(n)}}catch{}g()}else if(r==="toggle-model")$=$==="circle"?"bar":"circle",g();else if(r==="toggle-spoiler")K=!K,g();else if(r==="toggle-numberline")$=$==="numberline"?"bar":"numberline",g();else if(r==="toggle-cup")$=$==="cup"?"bar":"cup",g();else if(r==="toggle-overlap")Z=!Z,g();else if(r==="toggle-trap")G=!G,g();else if(r==="toggle-reallife")Q=!Q,g();else if(r==="toggle-poll-blind"){S=!S;const s=e.dataset.targetPoll||"first";H[s]=!0,g()}else if(r==="base-less"||r==="base-more")M=Math.max(X,Math.min(U,M+(r==="base-more"?1:-1))),J=!0,$t();else if(r==="less"||r==="more")u=Math.max(X,Math.min(U,u+(r==="more"?1:-1))),C=1,J=!0,$t();else if(r==="fill-piece-add"){C=Math.min(u,C+1),w(C===u?"fanfare":"click");const s=b.querySelector("#fill-whole-box");s&&(s.innerHTML=at())}else if(r==="fill-piece-full"){C=u,w("fanfare");const s=b.querySelector("#fill-whole-box");s&&(s.innerHTML=at())}else if(r==="fill-piece-reset"){C=1;const s=b.querySelector("#fill-whole-box");s&&(s.innerHTML=at())}else if(r==="duel-shuffle"){ht++;const s=[2,3,4,5,6,7,8,9,10,11,12];R=[0,1,2].map(n=>{const a=(n*3+ht*2+rt)%s.length,o=(a+n+ht%4+2)%s.length,l=s[a],c=s[o]===l?s[(o+1)%s.length]:s[o];return{id:n,leftDenom:l,rightDenom:c,answer:l<c?"left":"right"}}),tt={0:null,1:null,2:null},w("click"),g()}else if(r==="train-reset")x=[],g();else if(r==="toggle-notebook-blank")N=!0,g();else if(r==="fill-zeros"){const s=e.dataset.targetPoll||"first";h[s]??=dt();for(const n of E)h[s][n].trim()===""&&(h[s][n]="0");H[s]=!0,g()}else if(r==="fill-sample"){const s=e.dataset.targetPoll||"first",n=ot(D)??20,a=z(s),o=a==="A"?"B":"A",l=Math.round(s==="first"?n*.4:n*.8),c=Math.round(s==="first"?n*.45:n*.1),i=Math.round(n*.05),d=Math.max(0,n-l-c-i),f={A:"0",B:"0",C:String(i),D:String(d)};f[a]=String(l),f[o]=String(c),h[s]=f,H[s]=!0,g()}else if(r==="next"){const s=_.indexOf(v);s<_.length-1&&(O(),v=_[s+1],Y="",g(!0))}else if(r==="back"){const s=_.indexOf(v);s>0&&(O(),v=_[s-1],Y="",g(!0))}else r==="next-unit"?(y=e.dataset.nextUnitId||"M02",nt(!0,!0),window.scrollTo?.({top:0})):r==="print-summary"?window.print():r==="restart"&&(nt(),window.scrollTo?.({top:0}))});window.addEventListener("pagehide",()=>nt());window.addEventListener("pageshow",t=>{t.persisted&&nt()});M=L().denominators.first[0];u=L().denominators.first[1];g();Ht&&Kt(async()=>{const{createLessonAiPanel:t}=await import("./lesson-ai-panel-CkbyGUTi.js");return{createLessonAiPanel:t}},__vite__mapDeps([0,1,2])).then(({createLessonAiPanel:t})=>{vt=t(b,(e,r)=>{st=e==="A"?"0":e==="B"?"1":"2",ct=r,g()}),vt.sync(v==="think")});
