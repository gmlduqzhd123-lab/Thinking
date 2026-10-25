const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lesson-ai-panel-BUBqx1TY.js","assets/errors-S67X06TO.js","assets/constants-CYr9ulPU.js"])))=>i.map(i=>d[i]);
import{D as R,a as O,b as gt}from"./constants-CYr9ulPU.js";const Ut="modulepreload",zt=function(t){return"/Thinking/"+t},Pt={},Wt=function(e,r,s){let n=Promise.resolve();if(r&&r.length>0){let c=function(i){return Promise.all(i.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");n=c(r.map(i=>{if(i=zt(i),i in Pt)return;Pt[i]=!0;const d=i.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${p}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Ut,d||(f.as="script"),f.crossOrigin="",f.href=i,l&&f.setAttribute("nonce",l),document.head.appendChild(f),d)return new Promise((k,y)=>{f.addEventListener("load",k),f.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${i}`)))})}))}function a(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return n.then(o=>{for(const l of o||[])l.status==="rejected"&&a(l.reason);return e().catch(a)})},C=["A","B","C","D"];function lt(){return{A:"",B:"",C:"",D:""}}function rt(t){return/^(?:[1-9]|[1-5][0-9]|60)$/.test(t)?Number(t):null}function ft(t,e){if(!Number.isInteger(e)||e<1||e>60||C.some(n=>!/^(?:0|[1-9]\d*)$/.test(t[n])))return null;const r=Object.fromEntries(C.map(n=>[n,Number(t[n])])),s=C.reduce((n,a)=>n+r[a],0);return s>e?null:{counts:r,noResponse:e-s}}function Vt(t,e,r){return(e-t)/r*100}function Yt(t){if(!Number.isInteger(t)||t<2||t>12)throw new RangeError("denominator must be 2–12");return Array.from({length:t},(e,r)=>({start:r/t,end:(r+1)/t}))}const nt=new Map;function yt(t){if(nt.has(t.id))throw new Error(`Unit "${t.id}" is already registered.`);nt.set(t.id,t)}function Kt(t){const e=nt.get(t);if(!e)throw new Error(`Unit "${t}" not found. Registered: ${[...nt.keys()].join(", ")}`);return e}function Et(){return[...nt.values()]}const Gt={id:"M01",title:"🥖 초코바 나누기 · 단위분수 기초 비교 (1/3과 1/5)",description:"길이가 같은 초코바와 리본을 똑같이 나누어 1/3과 1/5 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 나누기",text:"같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모가 커지면 한 조각도 커진다는 생각을 살핍니다."},{id:"B",title:"나누는 수 바꾸기",text:"전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.",hint:"분모와 한 조각 크기의 관계를 설명해 봅니다."},{id:"C",title:"전체 다시 만들기",text:"1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.",hint:"분모가 무엇을 뜻하는지 확인합니다."}],examples:[{id:"E1",text:"5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 길이를 더 많이 나누면 한 조각은 작아져요.",expected:"B"},{id:"E3",text:"두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.",expected:"hold"},{id:"E4",text:"분모가 무엇을 뜻하는지 모르겠어요.",expected:"C"},{id:"E5",text:"어떤 물건인지도 모르고 길이 정보가 없어요.",expected:"hold"},{id:"E6",text:"오늘 날씨가 좋아서 운동장에 갔어요.",expected:"hold"}],denominators:{first:[3,5],transfer:[4,6]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},Qt={id:"M02",title:"🍕 피자 조각 고르기 · 단위분수 심화 비교 (1/4과 1/7)",description:"크기가 같은 피자와 리본을 똑같이 나누어 1/4과 1/7 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 세밀하게 나누기",text:"같은 길이의 전체를 4등분과 7등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모 7이 4보다 크니까 1/7이 크다는 생각을 살핍니다."},{id:"B",title:"등분 수와 조각 크기 규칙 찾기",text:"등분 수를 4에서 7로 늘릴 때 한 조각의 크기가 어떻게 변하는지 규칙을 찾습니다.",hint:"나누는 횟수가 늘어날수록 한 조각이 작아지는 이유를 설명해 봅니다."},{id:"C",title:"단위분수 모아 전체 확인하기",text:"1/4 네 조각과 1/7 일곱 조각을 각각 모아 처음 전체와 같은지 확인합니다.",hint:"단위분수가 전체의 몇 분의 일인지 의미를 되짚습니다."}],examples:[{id:"E1",text:"7이 4보다 크니까 1/7 조각이 더 크다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 여러 번 나눌수록 한 조각은 줄어들어요.",expected:"B"},{id:"E3",text:"전체 크기가 서로 다르면 1/4과 1/7을 바로 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/7이 전체를 어떻게 나눈 것인지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"문제에 그림이나 길이 설명이 전혀 없어요.",expected:"hold"},{id:"E6",text:"점심시간에 친구들과 축구를 했어요.",expected:"hold"}],denominators:{first:[4,7],transfer:[5,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아|여러 번 나눌수록.{0,12}줄어",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},Zt={id:"M03",title:"🎀 색테이프 자르기 · 단위분수 응용 비교 (1/2과 1/6)",description:"길이가 같은 색테이프와 리본을 똑같이 나누어 1/2과 1/6 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"반으로 나누기와 여섯으로 나누기",text:"같은 길이의 전체를 2등분과 6등분해 한 조각의 길이를 직접 비교합니다.",hint:"6이 2보다 크니까 1/6이 더 크다는 생각을 점검합니다."},{id:"B",title:"등분 배수와 조각 크기 관계",text:"2등분한 조각을 다시 3등분하면 6등분이 된다는 점을 통해 조각 크기를 관찰합니다.",hint:"나누는 수가 커질수록 한 조각이 얼마나 작아지는지 살펴봅니다."},{id:"C",title:"단위분수 개수로 전체 채우기",text:"1/2 두 조각과 1/6 여섯 조각을 모아 같은 전체가 되는지 확인합니다.",hint:"분모가 전체를 똑같이 나눈 조각 수임을 확인합니다."}],examples:[{id:"E1",text:"6이 2보다 훨씬 크니까 1/6 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 많이 나누면 한 조각의 길이는 짧아져요.",expected:"B"},{id:"E3",text:"전체 리본의 길이가 서로 다르면 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/6이 무엇을 나타내는지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"길이에 대한 설명이 없어서 알기 어려워요.",expected:"hold"},{id:"E6",text:"쉬는 시간에 물 마시러 다녀왔어요.",expected:"hold"}],denominators:{first:[2,6],transfer:[3,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}(작아|짧아)|더 많이 나눌수록.{0,12}(작아|짧아)",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}};Et().length===0&&(yt(Gt),yt(Qt),yt(Zt));const _=["think","explore","check","result"],kt={think:"1. 생각 고르기",explore:"2. 직접 실험하기",check:"3. 다시 점검하기",result:"4. 오늘의 발견"},at={M01:{badge:"🍫 민수의 초코바 고민",lead:'초코바를 아주 좋아하는 민수는 <strong>"3보다 5가 더 큰 숫자니까 나는 1/5 조각을 먹을래!"</strong>라고 골랐어요. 과연 민수는 1/3 조각보다 더 큰 초코바를 먹게 될까요?',friend:"민수"},M02:{badge:"🍕 서연이의 피자 고민",lead:'피자 파티에서 서연이는 <strong>"4보다 7이 더 큰 숫자니까 1/7 피자 조각이 더 크겠지?"</strong>라고 생각했어요. 과연 1/4 조각과 1/7 조각 중 어느 쪽이 더 클까요?',friend:"서연이"},M03:{badge:"🎀 준호의 색테이프 고민",lead:'만들기 시간에 준호는 <strong>"숫자 6이 2보다 훨씬 크니까 1/6 색테이프가 더 길 거야!"</strong>라고 말했어요. 과연 1/2 조각과 1/6 조각 중 어느 쪽이 더 길까요?',friend:"준호"}},xt={think:'🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요? 숫자(분모)가 커지면 조각은 어떻게 될까요?"',explore:'🙋 선생님 질문 톡: "나누는 사람 수(분모)가 3명에서 12명으로 늘어날수록 내가 먹는 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',check:'🙋 선생님 질문 톡: "처음 생각과 지금 생각이 같나요, 바뀌었나요? 무엇을 보고 확신하게 되었는지 이야기해 볼까요?"',result:'🙋 선생님 질문 톡: "오늘 발견한 단위분수의 비밀을 한 문장으로 다 함께 읽어 보고, 다른 간식 이야기에도 도전해 봐요!"'},Ft=[{id:0,leftDenom:7,rightDenom:2,answer:"right"},{id:1,leftDenom:3,rightDenom:9,answer:"left"},{id:2,leftDenom:11,rightDenom:4,answer:"right"}],Jt=[2,3,5,8,12],wt=[6,2,9],te=["분모가 클수록 조각이 크다고 생각함","더 많이 나눌수록 조각이 작아진다고 생각함","전체가 같은지 확인이 필요함"],Tt=['💬 "분모 숫자가 더 크니까 한 조각도 더 클 것 같아요!"','💬 "같은 전체를 더 많이 나누면 한 조각은 더 작아질 것 같아요!"','💬 "두 간식의 원래 전체 크기가 똑같은지 먼저 확인해야 해요!"'],g=document.querySelector("#lesson-app"),Lt=g.dataset.aiEnabled==="true";let $t,v="M01",h="bar",m="think",I=!0,St=!1,V=!1,E={first:null,again:null,transfer:null},J="",ot="",Y=!1,K=!1,G=!1,M=3,u=5,Q=!1,j=1,N=Ft.map(t=>({...t})),it={0:null,1:null,2:null},tt=0,x=[],D="",P=!1,L="",z=new Set,q=!1,B=!1,S="20",$={first:null,again:null,transfer:null},W="";function T(){return Kt(v)}function jt(){return document.documentElement.getAttribute("data-theme")==="dark"}function qt(){return document.documentElement.getAttribute("data-scale")==="large"}function w(t){if(I)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;const r=new e,s=r.createOscillator(),n=r.createGain();s.connect(n),n.connect(r.destination);const a=r.currentTime;s.frequency.setValueAtTime(t==="fanfare"?659.25:t==="correct"?523.25:440,a),n.gain.setValueAtTime(.04,a),n.gain.exponentialRampToValueAtTime(.001,a+.11),s.start(a),s.stop(a+.11),s.onended=()=>{r.close().catch(()=>{})}}catch{}}function et(t=!1,e=!1){$t?.dispose(),t||(v="M01"),e||z.clear(),h="bar",m="think",St=!1,V=!1,E={first:null,again:null,transfer:null},J="",ot="",Y=!1,K=!1,G=!1,M=T().denominators.first[0],u=T().denominators.first[1],Q=!1,j=1,N=Ft.map(r=>({...r})),it={0:null,1:null,2:null},tt=0,x=[],D="",P=!1,L="",q=!1,B=!1,S="20",$={first:null,again:null,transfer:null},W="",b()}function F(){return v==="M01"?"초코바":v==="M02"?"피자":"색테이프"}function At(){return v==="M01"?{fill:"#e08e2b",bg:"var(--lesson-bar-bg, #fbf5ef)",stroke:"var(--lesson-bar-stroke, #5c3317)"}:v==="M02"?{fill:"#ffca62",bg:"var(--lesson-bar-bg, #fffaf0)",stroke:"var(--lesson-bar-stroke, #b45309)"}:{fill:"#ff8da1",bg:"var(--lesson-bar-bg, #fff5f7)",stroke:"var(--lesson-bar-stroke, #153a69)"}}function ee(t,e=!1){const{fill:a,bg:o,stroke:l}=At();if(e)return`<figure class="fraction fraction-circle">
      <svg viewBox="0 0 160 160" role="img"
        aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${t}명이 똑같이 나눌 예정)">
        <circle cx="80" cy="80" r="60" fill="${a}" fill-opacity="0.28" stroke="${l}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="80" cy="80" r="52" fill="none" stroke="${l}" stroke-width="1.2" stroke-opacity="0.4"/>
        <text x="80" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text>
        <text x="80" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">? (${t}등분 중 1조각)</text>
      </svg>
      <figcaption>상상하기: 똑같은 ${F()}를 <strong>${t}명</strong>이 나눈 한 조각 (<strong>1/${t}</strong>)</figcaption>
    </figure>`;const c=2*Math.PI/t,i=-Math.PI/2,d=i+c,p=80+60*Math.cos(i),f=80+60*Math.sin(i),k=80+60*Math.cos(d),y=80+60*Math.sin(d),U=c>Math.PI?1:0,mt=`M 80 80 L ${p.toFixed(2)} ${f.toFixed(2)} A 60 60 0 ${U} 1 ${k.toFixed(2)} ${y.toFixed(2)} Z`,dt=i+c/2,H=(80+60*.52*Math.cos(dt)).toFixed(2),ut=(80+60*.52*Math.sin(dt)).toFixed(2),vt=Array.from({length:t},(A,pt)=>{const Dt=i+pt*c,Ot=80+60*Math.cos(Dt),Xt=80+60*Math.sin(Dt);return`<line x1="80" y1="80" x2="${Ot.toFixed(2)}" y2="${Xt.toFixed(2)}" stroke="${l}" stroke-width="1.8"/>`}).join("");return`<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${t}">
      <circle cx="80" cy="80" r="60" fill="${o}" stroke="${l}" stroke-width="3"/>
      <path d="${mt}" fill="${a}"/>
      <circle cx="${H}" cy="${ut}" r="${t>=9?3.2:4.5}" fill="#d9381e" fill-opacity="0.85"/>
      ${vt}
      <circle cx="80" cy="80" r="60" fill="none" stroke="${l}" stroke-width="3"/>
    </svg>
    <figcaption>같은 ${F()}의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function se(t){const n=528/t,a=36+n,o=Array.from({length:t+1},(l,c)=>{const i=(36+c*n).toFixed(2),d=c===0||c===t;return`<line x1="${i}" y1="${d?22:28}" x2="${i}" y2="${d?54:48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${d?3:2}"/>`}).join("");return`<figure class="fraction fraction-numberline">
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
  </figure>`}function re(t){const a=120/t,o=136-a,l=Array.from({length:t-1},(c,i)=>{const d=(16+(i+1)*120/t).toFixed(2);return`<line x1="48" y1="${d}" x2="112" y2="${d}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`}).join("");return`<figure class="fraction fraction-cup">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${t}등분하고 한 눈금만큼 채운 들이 모형, 1/${t}">
      <rect x="40" y="16" width="80" height="120" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="42" y="${o.toFixed(2)}" width="76" height="${a.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${l}
      <rect x="40" y="16" width="80" height="120" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 컵의 <strong>1/${t}컵</strong></figcaption>
  </figure>`}function ht(t,e=!1){if(h==="circle")return ee(t,e);if(h==="numberline")return se(t);if(h==="cup")return re(t);const{fill:r,bg:s,stroke:n}=At();if(e)return`<figure class="fraction">
      <svg viewBox="0 0 600 70" role="img"
        aria-label="아직 자르지 않은 전체 길이가 같은 ${F()} 모형 (${t}명이 똑같이 나눌 예정)">
        <rect x="0" y="10" width="600" height="48" rx="8" fill="${r}" fill-opacity="0.22" stroke="${n}" stroke-width="3" stroke-dasharray="8 5"/>
        <line x1="14" y1="34" x2="586" y2="34" stroke="${n}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <text x="300" y="39" text-anchor="middle" font-size="15" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">전체 크기가 똑같은 ${F()} 1개 · ✂️ ${t}조각으로 나누면 1/${t}은?</text>
      </svg>
      <figcaption>상상하기: 같은 ${F()}를 <strong>${t}명</strong>이 똑같이 나눈 한 조각 (<strong>1/${t}</strong>)</figcaption>
    </figure>`;const a=Yt(t),o=600/t,l=a.slice(1).map(i=>`<line x1="${600*i.start}" y1="10" x2="${600*i.start}" y2="58" stroke="${n}" stroke-width="2"/>`).join(""),c=v==="M01"?`<rect x="6" y="16" width="${Math.max(8,o-12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`:v==="M02"?`<circle cx="${Math.min(580,o*.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`:`<line x1="6" y1="34" x2="${Math.max(10,o-6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`;return`<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 막대, 1/${t}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="${s}" stroke="${n}" stroke-width="3"/>
      <rect x="0" y="10" width="${o}" height="48" rx="4" fill="${r}"/>
      ${c}
      ${l}
    </svg>
    <figcaption>같은 ${F()}의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function Ht(t,e,r=!1,s=!1){return`<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${h==="circle"}">${h==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
      ${r?`<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${h==="numberline"}">📐 수직선으로 보기</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${h==="cup"}">🥤 주스 컵으로 보기</button>`:""}
    </div>
    <div class="bar-pair">${ht(t,s)}${ht(e,s)}</div>`}function ct(t){return t==="transfer"}function X(t){return ct(t)?"B":"A"}function Z(t,e,r,s="first"){if(!t)return"아직 선택하지 않음";const[n,a]=ct(s)?[r,e]:[e,r];return{A:`1/${n}이 더 크다`,B:`1/${a}이 더 크다`,C:"두 조각의 크기가 같다",D:"아직 잘 모르겠다"}[t]}function Mt(t,e,r){const s=E[t],[n,a]=ct(t)?[r,e]:[e,r],o=[`A. 1/${n} 조각이 더 크다`,`B. 1/${a} 조각이 더 크다`,"C. 두 조각의 크기가 같다","D. 아직 잘 모르겠다"];return`<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${C.map((l,c)=>`<button type="button" data-pick-poll="${t}" data-pick-choice="${l}" class="solo-choice-btn ${s===l?"solo-choice-selected":""}" aria-pressed="${s===l}">${o[c]}</button>`).join("")}
  </div>`}function _t(t,e,r){const s=E[t];if(!s)return"";if(t==="first")return`<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각으로 <strong>"${Z(s,e,r,t)}"</strong>을(를) 골랐어요! 이제 2단계에서 직접 잘라 확인해 볼까요?</p>`;const n=X(t);return s===n?`<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 더 적게 나눈 <strong>1/${e}</strong> 한 조각이 <strong>1/${r}</strong> 한 조각보다 더 큽니다.</p>`:s==="C"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 나눈 조각 수가 ${e}등분과 ${r}등분으로 서로 다르기 때문에 한 조각의 크기도 달라요. 덜 나눈 <strong>1/${e}</strong>이 더 큽니다.</p>`:s==="D"?`<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 같은 전체를 덜 나눈 조각일수록 한 조각의 크기가 더 커요. 따라서 <strong>1/${e}</strong> 조각이 <strong>1/${r}</strong> 조각보다 더 큽니다.</p>`:`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 분모 숫자 ${r}이 ${e}보다 크지만, 같은 전체를 더 여러 조각으로 나누면 한 조각의 크기는 오히려 작아져요! 따라서 <strong>1/${e}</strong>(${n}번)이 더 큽니다.</p>`}function It(t){if(B)return"🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.";const e=$[t]??lt(),r=rt(S);if(!r)return`⚠️ 참여 인원은 1~${gt} 사이의 자연수로 입력해 주세요.`;const s=ft(e,r),n=X(t);if(s)return`집계 완료: 정답(${n}) ${s.counts[n]}/${r}명 · 미응답 ${s.noResponse}명`;if(C.every(o=>/^(?:0|[1-9]\d*)$/.test(e[o]))){const o=C.reduce((l,c)=>l+Number(e[c]),0);if(o>r)return`⚠️ 보기 인원 합계(${o}명)가 참여 인원(${r}명)보다 많습니다. 인원수를 확인해 주세요.`}return"학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요."}function Nt(t,e,r){if(B)return`<div class="live-poll-chart" data-chart-poll="${t}"><p class="chart-blind-msg">🙈 결과 공개 시 보기별 막대그래프가 표시됩니다.</p></div>`;const s=$[t]??lt(),[n,a]=ct(t)?[r,e]:[e,r],o={A:`A (1/${n})`,B:`B (1/${a})`,C:"C (같다)",D:"D (모름)"},l=C.map(p=>Math.max(0,parseInt(s[p],10)||0)),c=l.reduce((p,f)=>p+f,0),i=Math.max(1,rt(S)??20,c),d=X(t);return`<div class="live-poll-chart" data-chart-poll="${t}" role="region" aria-label="학급 투표 실시간 막대그래프">
    ${C.map((p,f)=>{const k=l[f],y=Math.min(100,Math.round(k/i*100));return`<div class="poll-bar-row">
        <span class="poll-bar-label">${o[p]}</span>
        <div class="poll-bar-track"><div class="poll-bar-fill ${p===d?"poll-bar-correct":""}" style="width: ${y}%"></div></div>
        <span class="poll-bar-val">${k}명 (${y}%)</span>
      </div>`}).join("")}
  </div>`}function Ct(t,e,r){const s=$[t]??lt(),[n,a]=ct(t)?[r,e]:[e,r],o=[`A (1/${n})`,`B (1/${a})`,"C (같다)","D (모름)"];return`<details class="class-poll-details" data-poll-details="${t}" ${q?"open":""}>
    <summary>👩‍🏫 교실 수업용 거수 투표·인원수 기록하기 (필요할 때만 열기)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${gt}명) <input id="${t==="transfer"?"participants-transfer":"participants"}" data-participants-input="${t}" type="text" inputmode="numeric" value="${S}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" class="secondary-btn" aria-pressed="${B}">${B?"👀 결과 공개하기":"🙈 결과 잠시 가리기"}</button>
      </div>
      <div class="class-poll-inputs">
        ${C.map((c,i)=>`<div class="poll-counter-card">
            <label>${o[i]} <input data-count="${c}" data-count-poll="${t}" type="text" inputmode="numeric" value="${B?"•":s[c]}" aria-label="${c} 선택 인원" autocomplete="off" ${B?"readonly":""}></label>
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
      ${Nt(t,e,r)}
      <p class="class-poll-status" data-status-poll="${t}" role="status">${It(t)}</p>
    </div>
  </details>`}function ne(){const t=T(),[e,r]=t.denominators.first,s=at[v]??at.M01;return`
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${Et().map(a=>{const o=a.id===v,l=z.has(a.id);return`<button type="button" data-unit-id="${a.id}" class="unit-card-btn ${o?"unit-card-active":""}" aria-pressed="${o}">
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
        ${St?'<p id="tts-status" class="tts-status" role="status">🔊 이야기를 음성으로 읽어주었어요!</p>':""}
      </div>

      <p class="teacher-talk-banner">${xt.think}</p>

      ${Ht(e,r,!1,!V)}
      <div class="spoiler-hint-row">
        <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${V}">
          ${V?"🙈 자르기 전 모양으로 다시 가리기":"👀 자른 눈금 힌트 살짝 미리 보기"}
        </button>
      </div>

      ${Mt("first",e,r)}
      ${_t("first",e,r)}

      <div class="reason-section">
        <h3>💭 왜 그렇게 생각했나요? (내 생각과 가장 비슷한 말풍선 고르기)</h3>
        <div class="actions reason-bubble-list">
          ${te.map((a,o)=>`<button type="button" data-reason="${o}" class="reason-bubble-btn" aria-label="${a}" aria-pressed="${J===String(o)}">
              <span class="student-bubble">${Tt[o]}</span>
            </button>`).join("")}
        </div>
        ${ot?`<p class="ai-linked-badge">🤖 로컬 AI 추천 탐구 연결됨: <strong>${ot}</strong></p>`:""}
      </div>

      ${Ct("first",e,r)}

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn">② 직접 실험하러 가기 →</button>
      </div>
    </div>`}function Rt(t){const e=t<u?">":t>u?"<":"=",r=t<u?`${t}등분 한 조각이 ${u}등분 한 조각보다 더 큽니다`:t>u?`${u}등분 한 조각이 ${t}등분 한 조각보다 더 큽니다`:"두 조각의 크기가 같습니다";return{barsHtml:`${ht(t)}${ht(u)}`,badgeHtml:`크기 비교: <strong>1/${t} ${e} 1/${u}</strong> (${r})`,discoveryHtml:Q?'<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>':""}}function st(){const t=Math.max(1,Math.min(u,j)),{fill:e,bg:r,stroke:s}=At(),n=600/u,a=n*t,o=Array.from({length:u-1},(c,i)=>{const d=((i+1)*n).toFixed(2);return`<line x1="${d}" y1="10" x2="${d}" y2="54" stroke="${s}" stroke-width="2"/>`}).join(""),l=t===u;return`<figure class="whole-fill-figure">
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
    <p id="fill-whole-status" class="answer" role="status">${l?`🎉 <strong>전체 1 완성!</strong> <strong>1/${u}</strong> 조각을 <strong>${u}개</strong> 모으니 전체 1(${u}/${u})이 꼭 맞게 채워졌어요! 한 조각이 작을수록 전체 1을 채우는 데 더 많은 조각이 필요합니다.`:`🧩 현재 <strong>1/${u}</strong> 조각 <strong>${t}개(${t}/${u})</strong>를 채웠어요. 전체 1이 되려면 조각 <strong>${u-t}개</strong>가 더 필요해요!`}</p>`}function bt(){j=Math.max(1,Math.min(u,j));const{barsHtml:t,badgeHtml:e,discoveryHtml:r}=Rt(M),s=g.querySelector("#explore-exp2-bars");s&&(s.innerHTML=t);const n=g.querySelector("#explore-base-output");n&&(n.textContent=`기준 분수: 1/${M} (${M}등분)`);const a=g.querySelector('button[data-action="base-less"]');a&&(a.disabled=M<=R);const o=g.querySelector('button[data-action="base-more"]');o&&(o.disabled=M>=O);const l=g.querySelector("#explore-denom-output");l&&(l.textContent=`${u}등분 (1/${u})`);const c=g.querySelector("#explore-slider");c&&c.value!==String(u)&&(c.value=String(u));const i=g.querySelector('button[data-action="less"]');i&&(i.disabled=u<=R);const d=g.querySelector('button[data-action="more"]');d&&(d.disabled=u>=O),g.querySelectorAll("button[data-quick-denom]").forEach(y=>{const U=Number(y.dataset.quickDenom)===u;y.setAttribute("aria-pressed",String(U)),y.classList.toggle("quick-denom-active",U)});const p=g.querySelector("#explore-cmp-badge");p&&(p.innerHTML=e);const f=g.querySelector("#explore-discovery-2");f&&(f.innerHTML=r);const k=g.querySelector("#fill-whole-box");k&&(k.innerHTML=st())}function ae(){const[t,e]=T().denominators.first,r=Z(E.first,t,e,"first"),s=J!==""?Tt[Number(J)]:"내 처음 생각을 직접 실험으로 확인해 볼까요?",n=600/t,a=600/e,o=Math.max(0,n-a),{barsHtml:l,badgeHtml:c,discoveryHtml:i}=Rt(M),d=Jt.map(p=>{const f=u===p;return`<button type="button" data-quick-denom="${p}" class="secondary-btn quick-denom-btn ${f?"quick-denom-active":""}" aria-pressed="${f}">👧 ${p}명이 나눌 때 (1/${p})</button>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 재미있는 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>나의 처음 생각</strong>: <strong>${r}</strong></p>
        <p class="hypothesis-sub">${s}</p>
      </div>

      <p class="teacher-talk-banner">${xt.explore}</p>

      <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
        <h3>실험 1 · 가위로 잘라 두 조각을 포개어 대어 보기</h3>
        <p>1/${t} 조각과 1/${e} 조각의 왼쪽 끝을 똑같이 맞추어 포개어 볼까요?</p>
        <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${Y}">
          ${Y?"✂️ 포개어 비교한 결과 닫기":"✂️ 1/"+t+" 조각과 1/"+e+" 조각 포개어 비교하기"}
        </button>

        ${Y?`
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
          <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${h==="circle"}">${h==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
        </div>

        <div class="base-denom-controls" role="group" aria-label="위쪽 기준 분수 분모 조절">
          <button type="button" data-action="base-less" class="secondary-btn" ${M<=R?"disabled":""} aria-label="기준 분모 줄이기">기준 −1</button>
          <output id="explore-base-output" aria-live="polite">기준 분수: 1/${M} (${M}등분)</output>
          <button type="button" data-action="base-more" class="secondary-btn" ${M>=O?"disabled":""} aria-label="기준 분모 늘리기">기준 ＋1</button>
        </div>

        <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">
          ${d}
        </div>

        <div id="explore-exp2-bars" class="bar-pair">${l}</div>

        <div class="slider-experiment-controls">
          <button type="button" data-action="less" ${u<=R?"disabled":""} aria-label="등분 수 줄이기">−</button>
          <input id="explore-slider" type="range" min="${R}" max="${O}" value="${u}" aria-label="나누는 조각 수 슬라이더">
          <output id="explore-denom-output" aria-live="polite">${u}등분 (1/${u})</output>
          <button type="button" data-action="more" ${u>=O?"disabled":""} aria-label="등분 수 늘리기">＋</button>
        </div>

        <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${c}</p>
        <div id="explore-discovery-2" aria-live="polite">${i}</div>
      </section>

      <section class="experiment-box" aria-label="실험 3 단위분수 조각 모아 전체 1 채우기">
        <h3>실험 3 · 단위분수 조각을 하나씩 모아 '전체 1' 완성하기</h3>
        <p>단위분수 조각을 몇 개 모아야 원래 전체 1이 꼭 맞게 채워지는지 직접 채워 보세요!</p>
        <div id="fill-whole-box">${st()}</div>
      </section>

      <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
        <h3>😮 깜짝 실험 · 만약 원래 ${F()} 전체 크기가 서로 다르면 어떨까요?</h3>
        <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${K}">
          ${K?"😮 깜짝 함정 실험 닫기":"😮 깜짝 실험 열어 보기: 미니 간식의 1/2 vs 특대형 간식의 1/4"}
        </button>
        ${K?`
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
        <button type="button" data-action="toggle-reallife" class="secondary-btn" aria-pressed="${G}">
          ${G?"🕒 생활 속 단위분수 실험 닫기":"🕒 생활 속 단위분수 열기: 1시간의 1/2(30분) vs 1/4(15분) & 12칸 초콜릿"}
        </button>
        ${G?`
          <div class="reallife-content" role="region" aria-label="시계판과 12칸 초콜릿 단위분수 비교">
            <div class="reallife-grid">
              <div class="reallife-item">
                <strong>⏰ 1시간(60분) 시계판 비교</strong>
                <p>1시간의 <strong>1/2은 30분</strong>, <strong>1/4은 15분</strong>이에요. 시계판에서도 <strong>1/2 &gt; 1/4</strong>임을 한눈에 알 수 있어요!</p>
              </div>
              <div class="reallife-item">
                <strong>🍫 12칸 판초콜릿 비교</strong>
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
    </div>`}function oe(){const[t,e]=T().denominators.first,[r,s]=T().denominators.transfer,n=N.filter(i=>it[i.id]===i.answer).length,a=N.map(i=>{const d=it[i.id],p=d===i.answer;return`<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${i.id+1}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${i.id+1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${i.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${d==="left"?"solo-choice-selected":""}" aria-pressed="${d==="left"}">1/${i.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${i.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${d==="right"?"solo-choice-selected":""}" aria-pressed="${d==="right"}">1/${i.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${d===null?"👆 더 큰 쪽을 터치!":p?"🎉 정답!":`💡 1/${Math.min(i.leftDenom,i.rightDenom)}이 더 커요!`}</span>
    </div>`}).join(""),o=x.length===wt.length,l=o&&x[0]===2&&x[1]===6&&x[2]===9,c=o?l?"🎉 <strong>칙칙폭폭 출발!</strong> 분모가 작은 수부터 <strong>1/2 &gt; 1/6 &gt; 1/9</strong> 순서로 완벽하게 줄을 세웠어요!":"💡 <strong>다시 줄을 세워 볼까요?</strong> 분모 숫자가 작을수록 한 조각이 더 크답니다. [🔄 기차 다시 줄 세우기]를 눌러 가장 큰 조각(1/2)부터 태워 보세요!":"👆 위 분수 버튼을 가장 큰 조각부터 차례대로 눌러 1호차 → 2호차 → 3호차에 태워 보세요!";return`
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 실험 후 내 생각 확인과 분수 대결</h2>

      <p class="teacher-talk-banner">${xt.check}</p>

      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기: 같은 ${F()}에서 1/${t}과 1/${e} 중 어느 쪽이 더 클까요?</h3>
        <p class="first-memory-tag">💭 1단계에서 고른 내 처음 생각: <strong>${Z(E.first,t,e,"first")}</strong></p>
        ${Mt("again",t,e)}
        ${_t("again",t,e)}
        ${Ct("again",t,e)}
      </section>

      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 한 걸음 더! 새로운 문제: 같은 전체에서 <strong>1/${s}</strong>과 <strong>1/${r}</strong> 중 어느 쪽이 더 클까요?</h3>
        <p class="transfer-caution-note">🔍 보기 순서를 잘 보고 더 큰 조각을 골라 보세요!</p>
        ${Ht(s,r,!0)}
        ${Mt("transfer",r,s)}
        ${_t("transfer",r,s)}
        ${Ct("transfer",r,s)}
      </section>

      <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
        <div class="duel-header-row">
          <h3>3) ⚡ 번개 미니게임 · 어느 조각이 더 클까요? (더 큰 분수 카드를 콕 찍어 보세요!)</h3>
          <button type="button" data-action="duel-shuffle" class="secondary-btn">🎲 새로운 랜덤 대결 3문제 뽑기</button>
        </div>
        <div class="duel-rounds-list">
          ${a}
        </div>
        <p class="duel-score-banner" role="status">🎯 미니게임 현재 점수: <strong>${n} / ${N.length}</strong> 정답 ${n===N.length?"🏆 퍼펙트 클리어!":""} · <span id="duel-streak-badge">🔥 연속 정답 콤보: ${tt}연속</span></p>
      </section>

      <section class="check-subcard train-puzzle-box" aria-label="분수 기차 줄 세우기 퍼즐">
        <h3>4) 🚂 분수 기차 줄 세우기 · 가장 큰 조각부터 순서대로 기차에 태워 보세요!</h3>
        <div class="train-pick-row" role="group" aria-label="기차에 태울 단위분수 고르기">
          ${wt.map(i=>`<button type="button" data-train-denom="${i}" class="secondary-btn train-pick-btn" ${x.includes(i)?"disabled":""}>🚂 1/${i} 조각 태우기</button>`).join("")}
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
    </div>`}function ie(){z.add(v);const t=T(),[e,r]=t.denominators.first,[s,n]=t.denominators.transfer,a=at[v]??at.M01,o=P?"작아집니다!":D==="bigger"?"커집니다(?)":D==="same"?"같습니다(?)":"______",l=E.again===X("again"),c=E.transfer===X("transfer"),i=l&&c?"🏆 최고예요! 직접 실험을 통해 단위분수의 크기 비교 원리를 완벽하게 내 것으로 만들었어요!":l||c?"🌟 참 잘했어요! 실험을 통해 같은 전체를 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!":"🌱 끝까지 스스로 실험하고 생각하며 단위분수의 비밀을 탐구했어요!",d=rt(S),p=d&&$.first?ft($.first,d):null,f=d&&$.again?ft($.again,d):null,k=d&&$.transfer?ft($.transfer,d):null,y=[];if(p&&f&&d){const A=Vt(p.counts.A,f.counts.A,d);y.push(`처음·재선택 정답(1/${e}) 인원: <strong>${p.counts.A}/${d}명 → ${f.counts.A}/${d}명</strong> (${A>=0?"+":""}${A.toFixed(1)}%p)`)}k&&d&&y.push(`응용 문제 정답(1/${s}, B번) 인원: <strong>${k.counts.B}/${d}명</strong>`);const U=y.length>0?`<p class="comparison">👩‍🏫 <strong>학급 전체 집계 요약</strong>: ${y.join(" · ")}</p>`:"",mt=P?'<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 똑같이 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>':D==="bigger"||D==="same"?'<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 2단계 실험에서 나누는 사람 수를 12명으로 늘렸을 때 한 조각의 크기가 어떻게 변했는지 떠올려 보세요!</p>':"",dt=L==="correct"?`<p id="letter-reply" class="answer feedback-correct" role="status">📬 <strong>${a.friend}의 답장</strong>: "아하! 똑같은 간식을 더 많은 사람이 나누어 먹을수록 한 조각이 작아진다는 걸 생각하니 왜 분모가 작은 단위분수가 더 큰지 완전히 이해됐어. 친절하게 알려줘서 정말 고마워!"</p>`:L==="wrong"?`<p id="letter-reply" class="answer feedback-hint" role="status">💡 ${a.friend}가 아직 헷갈려하고 있어요! 같은 간식을 더 많은 조각으로 나누었을 때 한 조각이 어떻게 변했는지 다시 골라 볼까요?</p>`:"",H=Et(),ut=H.find(A=>!z.has(A.id))??H[(H.findIndex(A=>A.id===v)+1)%H.length],vt=H.map(A=>{const pt=z.has(A.id);return`<div class="stamp-item ${pt?"stamp-done":""}">
      <span class="stamp-icon">${pt?"🎖️ 클리어!":"🔒 미도전"}</span>
      <strong>${A.title}</strong>
    </div>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 내 생각의 성장 카드와 마스터 스탬프</h2>

      <p class="teacher-talk-banner">${xt.result}</p>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${i}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 내 생각 (1/${e} vs 1/${r})</span>
            <strong>${Z(E.first,e,r,"first")}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${l?"journey-correct":""}">
            <span class="journey-label">② 실험 후 내 생각 (1/${e} vs 1/${r})</span>
            <strong>${Z(E.again,e,r,"again")} ${l?"⭐":""}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${c?"journey-correct":""}">
            <span class="journey-label">③ 응용 문제 (1/${n} vs 1/${s})</span>
            <strong>${Z(E.transfer,s,n,"transfer")} ${c?"⭐":""}</strong>
          </div>
        </div>
        ${U}
      </div>

      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>🧩 단어 카드를 골라 오늘의 단위분수 규칙을 완성해 보세요!</h3>
        <div class="notebook-line">
          <p>"크기가 같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${o} ]</strong>"</p>
        </div>
        <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
          <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn ${D==="bigger"?"rule-card-wrong":""}" aria-pressed="${D==="bigger"}">📈 점점 커집니다</button>
          <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${P?"solo-choice-selected":""}" aria-pressed="${P}">📉 작아집니다!</button>
          <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn ${D==="same"?"rule-card-wrong":""}" aria-pressed="${D==="same"}">🟰 항상 똑같습니다</button>
        </div>
        ${mt}
      </div>

      <div class="friend-letter-card" role="region" aria-label="고민하던 친구에게 보내는 설명 편지">
        <h3>💌 1단계에서 고민하던 ${a.friend}에게 친절한 설명 편지를 보내 볼까요?</h3>
        <p>"분모 숫자가 클수록 조각도 더 클 거야!"라고 생각했던 ${a.friend}에게 어떤 설명을 보내면 좋을까요?</p>
        <div class="letter-choice-list" role="group" aria-label="친구에게 보낼 설명 고르기">
          <button type="button" data-letter-choice="correct" class="secondary-btn letter-choice-btn ${L==="correct"?"solo-choice-selected":""}" aria-pressed="${L==="correct"}">💌 "같은 전체를 더 많은 조각으로 나눌수록 한 조각의 크기는 오히려 작아지기 때문이야!"</button>
          <button type="button" data-letter-choice="wrong" class="secondary-btn letter-choice-btn ${L==="wrong"?"rule-card-wrong":""}" aria-pressed="${L==="wrong"}">💌 "분모 숫자가 크면 언제나 한 조각의 크기도 함께 커지기 때문이야!"</button>
        </div>
        ${dt}
      </div>

      <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
        <h3>🎖️ 분수 탐구 스탬프 투어 (${z.size} / ${H.length} 이야기 클리어!)</h3>
        <div class="stamp-grid">
          ${vt}
        </div>
      </div>

      <div class="print-certificate-box" role="region" aria-label="단위분수 탐구 박사 인증서 서명란">
        <p class="cert-title">🎓 단위분수 탐구 박사 인증서 · 배움 공책 붙임용</p>
        <p class="cert-sign-line">학번·이름: ____________________ &nbsp;|&nbsp; 오늘 나의 한 줄 소감: ________________________________________</p>
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄하기</button>
        <button type="button" data-action="next-unit" data-next-unit-id="${ut.id}" class="primary-next-btn">🚀 다음 이야기(${ut.title.split("·")[0].trim()}) 도전하기 →</button>
        <button type="button" data-action="restart" class="secondary-btn">🔄 처음부터 다시 하기</button>
      </div>
    </div>`}function le(){switch(m){case"think":return ne();case"explore":return ae();case"check":return oe();case"result":return ie()}}function ce(){const t=jt(),e=qt();return`<header>
    <p class="eyebrow">${Lt?"로컬 AI 보조 수업":"초등 수학 분수 탐구"} · 단위분수 크기 비교</p>
    <h1>생각의 갈림길 AI</h1>
    <p>직접 나누고 겹쳐 보며 분수의 크기를 스스로 깨닫는 4단계 탐구</p>
    <div class="header-controls">
      <button id="sound-toggle" class="scale-toggle" aria-label="효과음 전환" aria-pressed="${I}" type="button">${I?"🔊 효과음":"🔇 음소거"}</button>
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${e}" type="button">${e?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${t}" type="button">${t?"☀️":"🌙"}</button>
    </div>
  </header>`}function de(){const t=_.indexOf(m);return`<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${_.map((e,r)=>{const s=r<t,n=r===t;return`<button type="button" class="${s?"step-pill done":n?"step-pill current":"step-pill"}" data-step-index="${r}" aria-current="${n?"step":"false"}">${kt[e]}</button>`}).join("")}
    </div>
  </nav>`}function b(t=!1){m!=="check"&&(h==="numberline"||h==="cup")&&(h="bar");const e=kt[m];if(g.innerHTML=[ce(),de(),`<section id="step" role="region" aria-label="${e}">${le()}<p id="error" role="alert">${W}</p></section>`,'<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>',"<footer>이 화면의 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>"].join(""),$t?.sync(m==="think"),t){g.querySelector("#step h2")?.focus();const r=g.querySelector("#step-announce");r&&(r.textContent=`${kt[m]} 단계로 이동했습니다.`)}}function Bt(){const t=T(),[e,r]=t.denominators.first,[s,n]=t.denominators.transfer;g.querySelectorAll(".class-poll-status[data-status-poll]").forEach(a=>{const o=a.dataset.statusPoll;a.textContent=It(o)}),g.querySelectorAll(".live-poll-chart[data-chart-poll]").forEach(a=>{const o=a.dataset.chartPoll,[l,c]=o==="transfer"?[s,n]:[e,r];a.outerHTML=Nt(o,l,c)}),g.querySelectorAll("input[data-participants-input]").forEach(a=>{a!==document.activeElement&&a.value!==S&&(a.value=S)})}g.addEventListener("toggle",t=>{const e=t.target;e instanceof HTMLDetailsElement&&e.classList.contains("class-poll-details")&&(q=e.open)},!0);g.addEventListener("input",t=>{const e=t.target;if(e.id==="explore-slider"){u=Number(e.value),Q=!0,bt();return}if(e.id==="participants"||e.dataset.participantsInput){S=e.value,q=!0,Bt();return}if(e.dataset.count&&e.dataset.countPoll){if(B)return;const r=e.dataset.countPoll,s=e.dataset.count;$[r]??=lt(),$[r][s]=e.value,q=!0,Bt()}});window.addEventListener("keydown",t=>{if(!t.altKey)return;const e=document.activeElement?.tagName;if(e==="INPUT"||e==="TEXTAREA")return;const r=_.indexOf(m);t.key==="ArrowRight"&&r<_.length-1?(t.preventDefault(),m=_[r+1],b(!0)):t.key==="ArrowLeft"&&r>0&&(t.preventDefault(),m=_[r-1],b(!0))});g.addEventListener("click",t=>{const e=t.target.closest("button");if(!e)return;if(e.id==="sound-toggle"){I=!I,e.textContent=I?"🔊 효과음":"🔇 음소거",e.setAttribute("aria-pressed",String(I)),I&&w("click");return}if(e.id==="theme-toggle"){const s=jt()?"light":"dark";document.documentElement.setAttribute("data-theme",s),e.textContent=s==="dark"?"☀️":"🌙",e.setAttribute("aria-pressed",String(s==="dark"));return}if(e.id==="scale-toggle"){const s=qt()?"normal":"large";document.documentElement.setAttribute("data-scale",s),e.textContent=s==="large"?"🔍 기본":"🔍 큰글씨",e.setAttribute("aria-pressed",String(s==="large"));return}if(e.dataset.stepIndex!==void 0){const s=Number(e.dataset.stepIndex);Number.isInteger(s)&&s>=0&&s<_.length&&(m=_[s],W="",b(!0));return}if(e.dataset.unitId){v=e.dataset.unitId,et(!0,!0);return}if(e.dataset.quickDenom!==void 0){u=Number(e.dataset.quickDenom),Q=!0,w("click"),bt();return}if(e.dataset.duelRound!==void 0&&e.dataset.duelPick){const s=Number(e.dataset.duelRound),n=e.dataset.duelPick;it[s]=n;const a=N.find(o=>o.id===s);a&&a.answer===n?(tt++,w("correct")):tt=0,b();return}if(e.dataset.trainDenom!==void 0){const s=Number(e.dataset.trainDenom);!x.includes(s)&&x.length<wt.length&&(x=[...x,s],x.length===3&&x[0]===2&&x[1]===6&&x[2]===9?w("fanfare"):w("click"),b());return}if(e.dataset.ruleChoice){const s=e.dataset.ruleChoice;D=s,P=s==="smaller"?!P:!1,P&&w("correct"),b();return}if(e.dataset.letterChoice){L=e.dataset.letterChoice,L==="correct"&&w("fanfare"),b();return}if(e.dataset.votePoll&&e.dataset.voteChoice&&e.dataset.voteDelta){const s=e.dataset.votePoll,n=e.dataset.voteChoice,a=Number(e.dataset.voteDelta);$[s]??={A:"0",B:"0",C:"0",D:"0"};for(const f of C)$[s][f].trim()===""&&($[s][f]="0");const o=C.filter(f=>f!==n).reduce((f,k)=>f+(parseInt($[s][k],10)||0),0),l=parseInt($[s][n],10)||0,c=Math.max(0,gt-o),i=Math.max(0,Math.min(c,l+a));$[s][n]=String(i);const d=o+i,p=rt(S);(!p||d>p)&&(S=String(Math.max(1,Math.min(gt,d)))),q=!0,b();return}if(e.dataset.pickPoll&&e.dataset.pickChoice){const s=e.dataset.pickPoll,n=e.dataset.pickChoice;E[s]=n,W="",w(s!=="first"&&n===X(s)?"correct":"click"),b();return}if(e.dataset.reason!==void 0){J=e.dataset.reason,ot="",w("click"),b();return}const r=e.dataset.action;if(r==="speak-story"){St=!0,w("click");try{const s=(at[v]?.lead??"").replace(/<[^>]+>/g,"");if("speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u"){window.speechSynthesis.cancel();const n=new SpeechSynthesisUtterance(s);n.lang="ko-KR",window.speechSynthesis.speak(n)}}catch{}b()}else if(r==="toggle-model")h=h==="circle"?"bar":"circle",b();else if(r==="toggle-spoiler")V=!V,b();else if(r==="toggle-numberline")h=h==="numberline"?"bar":"numberline",b();else if(r==="toggle-cup")h=h==="cup"?"bar":"cup",b();else if(r==="toggle-overlap")Y=!Y,b();else if(r==="toggle-trap")K=!K,b();else if(r==="toggle-reallife")G=!G,b();else if(r==="toggle-poll-blind")B=!B,q=!0,b();else if(r==="base-less"||r==="base-more")M=Math.max(R,Math.min(O,M+(r==="base-more"?1:-1))),Q=!0,bt();else if(r==="less"||r==="more")u=Math.max(R,Math.min(O,u+(r==="more"?1:-1))),Q=!0,bt();else if(r==="fill-piece-add"){j=Math.min(u,j+1),w(j===u?"fanfare":"click");const s=g.querySelector("#fill-whole-box");s&&(s.innerHTML=st())}else if(r==="fill-piece-full"){j=u,w("fanfare");const s=g.querySelector("#fill-whole-box");s&&(s.innerHTML=st())}else if(r==="fill-piece-reset"){j=1;const s=g.querySelector("#fill-whole-box");s&&(s.innerHTML=st())}else if(r==="duel-shuffle"){const s=[2,3,4,5,6,7,8,9,10,11,12];N=[0,1,2].map(n=>{const a=(n*3+tt+1)%s.length,o=(a+n+2)%s.length,l=s[a],c=s[o]===l?s[(o+1)%s.length]:s[o];return{id:n,leftDenom:l,rightDenom:c,answer:l<c?"left":"right"}}),it={0:null,1:null,2:null},w("click"),b()}else if(r==="train-reset")x=[],b();else if(r==="toggle-notebook-blank")P=!P,b();else if(r==="fill-zeros"){const s=e.dataset.targetPoll||"first";$[s]??=lt();for(const n of C)$[s][n].trim()===""&&($[s][n]="0");q=!0,b()}else if(r==="fill-sample"){const s=e.dataset.targetPoll||"first",n=rt(S)??20,a=X(s),o=a==="A"?"B":"A",l=Math.round(s==="first"?n*.4:n*.8),c=Math.round(s==="first"?n*.45:n*.1),i=Math.round(n*.05),d=Math.max(0,n-l-c-i),p={A:"0",B:"0",C:String(i),D:String(d)};p[a]=String(l),p[o]=String(c),$[s]=p,q=!0,b()}else if(r==="next"){const s=_.indexOf(m);s<_.length-1&&(m=_[s+1],W="",b(!0))}else if(r==="back"){const s=_.indexOf(m);s>0&&(m=_[s-1],W="",b(!0))}else r==="next-unit"?(v=e.dataset.nextUnitId||"M02",et(!0,!0),window.scrollTo?.({top:0})):r==="print-summary"?window.print():r==="restart"&&(et(),window.scrollTo?.({top:0}))});window.addEventListener("pagehide",()=>et());window.addEventListener("pageshow",t=>{t.persisted&&et()});M=T().denominators.first[0];u=T().denominators.first[1];b();Lt&&Wt(async()=>{const{createLessonAiPanel:t}=await import("./lesson-ai-panel-BUBqx1TY.js");return{createLessonAiPanel:t}},__vite__mapDeps([0,1,2])).then(({createLessonAiPanel:t})=>{$t=t(g,(e,r)=>{J=e==="A"?"0":e==="B"?"1":"2",ot=r,b()}),$t.sync(m==="think")});
