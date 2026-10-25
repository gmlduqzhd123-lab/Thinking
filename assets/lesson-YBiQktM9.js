const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lesson-ai-panel-BoDNsCOK.js","assets/errors-S67X06TO.js","assets/constants-CYr9ulPU.js"])))=>i.map(i=>d[i]);
import{D as Q,a as Z,b as G}from"./constants-CYr9ulPU.js";const At="modulepreload",Bt=function(t){return"/Thinking/"+t},$t={},Ft=function(e,s,r){let n=Promise.resolve();if(s&&s.length>0){let c=function(i){return Promise.all(i.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=a?.nonce||a?.getAttribute("nonce");n=c(s.map(i=>{if(i=Bt(i),i in $t)return;$t[i]=!0;const d=i.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${u}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":At,d||(f.as="script"),f.crossOrigin="",f.href=i,o&&f.setAttribute("nonce",o),document.head.appendChild(f),d)return new Promise((w,X)=>{f.addEventListener("load",w),f.addEventListener("error",()=>X(new Error(`Unable to preload CSS for ${i}`)))})}))}function l(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return n.then(a=>{for(const o of a||[])o.status==="rejected"&&l(o.reason);return e().catch(l)})},C=["A","B","C","D"];function rt(){return{A:"",B:"",C:"",D:""}}function J(t){return/^(?:[1-9]|[1-5][0-9]|60)$/.test(t)?Number(t):null}function K(t,e){if(!Number.isInteger(e)||e<1||e>60||C.some(n=>!/^(?:0|[1-9]\d*)$/.test(t[n])))return null;const s=Object.fromEntries(C.map(n=>[n,Number(t[n])])),r=C.reduce((n,l)=>n+s[l],0);return r>e?null:{counts:s,noResponse:e-r}}function It(t,e,s){return(e-t)/s*100}function jt(t){if(!Number.isInteger(t)||t<2||t>12)throw new RangeError("denominator must be 2–12");return Array.from({length:t},(e,s)=>({start:s/t,end:(s+1)/t}))}const O=new Map;function lt(t){if(O.has(t.id))throw new Error(`Unit "${t.id}" is already registered.`);O.set(t.id,t)}function Nt(t){const e=O.get(t);if(!e)throw new Error(`Unit "${t}" not found. Registered: ${[...O.keys()].join(", ")}`);return e}function gt(){return[...O.values()]}const Tt={id:"M01",title:"🥖 초코바 나누기 · 단위분수 기초 비교 (1/3과 1/5)",description:"길이가 같은 초코바와 리본을 똑같이 나누어 1/3과 1/5 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 나누기",text:"같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모가 커지면 한 조각도 커진다는 생각을 살핍니다."},{id:"B",title:"나누는 수 바꾸기",text:"전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.",hint:"분모와 한 조각 크기의 관계를 설명해 봅니다."},{id:"C",title:"전체 다시 만들기",text:"1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.",hint:"분모가 무엇을 뜻하는지 확인합니다."}],examples:[{id:"E1",text:"5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 길이를 더 많이 나누면 한 조각은 작아져요.",expected:"B"},{id:"E3",text:"두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.",expected:"hold"},{id:"E4",text:"분모가 무엇을 뜻하는지 모르겠어요.",expected:"C"},{id:"E5",text:"어떤 물건인지도 모르고 길이 정보가 없어요.",expected:"hold"},{id:"E6",text:"오늘 날씨가 좋아서 운동장에 갔어요.",expected:"hold"}],denominators:{first:[3,5],transfer:[4,6]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},Ht={id:"M02",title:"🍕 피자 조각 고르기 · 단위분수 심화 비교 (1/4과 1/7)",description:"크기가 같은 피자와 리본을 똑같이 나누어 1/4과 1/7 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 세밀하게 나누기",text:"같은 길이의 전체를 4등분과 7등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모 7이 4보다 크니까 1/7이 크다는 생각을 살핍니다."},{id:"B",title:"등분 수와 조각 크기 규칙 찾기",text:"등분 수를 4에서 7로 늘릴 때 한 조각의 크기가 어떻게 변하는지 규칙을 찾습니다.",hint:"나누는 횟수가 늘어날수록 한 조각이 작아지는 이유를 설명해 봅니다."},{id:"C",title:"단위분수 모아 전체 확인하기",text:"1/4 네 조각과 1/7 일곱 조각을 각각 모아 처음 전체와 같은지 확인합니다.",hint:"단위분수가 전체의 몇 분의 일인지 의미를 되짚습니다."}],examples:[{id:"E1",text:"7이 4보다 크니까 1/7 조각이 더 크다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 여러 번 나눌수록 한 조각은 줄어들어요.",expected:"B"},{id:"E3",text:"전체 크기가 서로 다르면 1/4과 1/7을 바로 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/7이 전체를 어떻게 나눈 것인지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"문제에 그림이나 길이 설명이 전혀 없어요.",expected:"hold"},{id:"E6",text:"점심시간에 친구들과 축구를 했어요.",expected:"hold"}],denominators:{first:[4,7],transfer:[5,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아|여러 번 나눌수록.{0,12}줄어",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},qt={id:"M03",title:"🎀 색테이프 자르기 · 단위분수 응용 비교 (1/2과 1/6)",description:"길이가 같은 색테이프와 리본을 똑같이 나누어 1/2과 1/6 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"반으로 나누기와 여섯으로 나누기",text:"같은 길이의 전체를 2등분과 6등분해 한 조각의 길이를 직접 비교합니다.",hint:"6이 2보다 크니까 1/6이 더 크다는 생각을 점검합니다."},{id:"B",title:"등분 배수와 조각 크기 관계",text:"2등분한 조각을 다시 3등분하면 6등분이 된다는 점을 통해 조각 크기를 관찰합니다.",hint:"나누는 수가 커질수록 한 조각이 얼마나 작아지는지 살펴봅니다."},{id:"C",title:"단위분수 개수로 전체 채우기",text:"1/2 두 조각과 1/6 여섯 조각을 모아 같은 전체가 되는지 확인합니다.",hint:"분모가 전체를 똑같이 나눈 조각 수임을 확인합니다."}],examples:[{id:"E1",text:"6이 2보다 훨씬 크니까 1/6 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 많이 나누면 한 조각의 길이는 짧아져요.",expected:"B"},{id:"E3",text:"전체 리본의 길이가 서로 다르면 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/6이 무엇을 나타내는지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"길이에 대한 설명이 없어서 알기 어려워요.",expected:"hold"},{id:"E6",text:"쉬는 시간에 물 마시러 다녀왔어요.",expected:"hold"}],denominators:{first:[2,6],transfer:[3,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}(작아|짧아)|더 많이 나눌수록.{0,12}(작아|짧아)",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}};gt().length===0&&(lt(Tt),lt(Ht),lt(qt));const v=["think","explore","check","result"],ct={think:"1. 생각 고르기",explore:"2. 직접 실험하기",check:"3. 다시 점검하기",result:"4. 오늘의 발견"},ht={M01:{badge:"🍫 민수의 초코바 고민",lead:'초코바를 아주 좋아하는 민수는 <strong>"3보다 5가 더 큰 숫자니까 나는 1/5 조각을 먹을래!"</strong>라고 골랐어요. 과연 민수는 1/3 조각보다 더 큰 초코바를 먹게 될까요?'},M02:{badge:"🍕 서연이의 피자 고민",lead:'피자 파티에서 서연이는 <strong>"4보다 7이 더 큰 숫자니까 1/7 피자 조각이 더 크겠지?"</strong>라고 생각했어요. 과연 1/4 조각과 1/7 조각 중 어느 쪽이 더 클까요?'},M03:{badge:"🎀 준호의 색테이프 고민",lead:'만들기 시간에 준호는 <strong>"숫자 6이 2보다 훨씬 크니까 1/6 색테이프가 더 길 거야!"</strong>라고 말했어요. 과연 1/2 조각과 1/6 조각 중 어느 쪽이 더 길까요?'}},nt={think:'🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요? 숫자(분모)가 커지면 조각은 어떻게 될까요?"',explore:'🙋 선생님 질문 톡: "나누는 사람 수(분모)가 3명에서 12명으로 늘어날수록 내가 먹는 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',check:'🙋 선생님 질문 톡: "처음 생각과 지금 생각이 같나요, 바뀌었나요? 무엇을 보고 확신하게 되었는지 이야기해 볼까요?"',result:'🙋 선생님 질문 톡: "오늘 발견한 단위분수의 비밀을 한 문장으로 다 함께 읽어 보고, 다른 간식 이야기에도 도전해 봐요!"'},V=[{id:0,leftDenom:7,rightDenom:2,answer:"right"},{id:1,leftDenom:3,rightDenom:9,answer:"left"},{id:2,leftDenom:11,rightDenom:4,answer:"right"}],Lt=[2,3,5,8,12],Xt=["분모가 클수록 조각이 크다고 생각함","더 많이 나눌수록 조각이 작아진다고 생각함","전체가 같은지 확인이 필요함"],mt=['💬 "분모 숫자가 더 크니까 한 조각도 더 클 것 같아요!"','💬 "같은 전체를 더 많이 나누면 한 조각은 더 작아질 것 같아요!"','💬 "두 간식의 원래 전체 크기가 똑같은지 먼저 확인해야 해요!"'],h=document.querySelector("#lesson-app"),vt=h.dataset.aiEnabled==="true";let tt,m="M01",$="bar",x="think",N=!1,k={first:null,again:null,transfer:null},L="",U="",T=!1,H=!1,p=5,z=!1,et={0:null,1:null,2:null},M="",P=!1,I=new Set,D=!1,A=!1,S="20",b={first:null,again:null,transfer:null},j="";function F(){return Nt(m)}function yt(){return document.documentElement.getAttribute("data-theme")==="dark"}function kt(){return document.documentElement.getAttribute("data-scale")==="large"}function _(t=!1,e=!1){tt?.dispose(),t||(m="M01"),e||I.clear(),$="bar",x="think",N=!1,k={first:null,again:null,transfer:null},L="",U="",T=!1,H=!1,p=F().denominators.first[1],z=!1,et={0:null,1:null,2:null},M="",P=!1,D=!1,A=!1,S="20",b={first:null,again:null,transfer:null},j="",g()}function E(){return m==="M01"?"초코바":m==="M02"?"피자":"색테이프"}function wt(){return m==="M01"?{fill:"#e08e2b",bg:"var(--lesson-bar-bg, #fbf5ef)",stroke:"var(--lesson-bar-stroke, #5c3317)"}:m==="M02"?{fill:"#ffca62",bg:"var(--lesson-bar-bg, #fffaf0)",stroke:"var(--lesson-bar-stroke, #b45309)"}:{fill:"#ff8da1",bg:"var(--lesson-bar-bg, #fff5f7)",stroke:"var(--lesson-bar-stroke, #153a69)"}}function Rt(t,e=!1){const{fill:l,bg:a,stroke:o}=wt();if(e)return`<figure class="fraction fraction-circle">
      <svg viewBox="0 0 160 160" role="img"
        aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${t}명이 똑같이 나눌 예정)">
        <circle cx="80" cy="80" r="60" fill="${l}" fill-opacity="0.28" stroke="${o}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="80" cy="80" r="52" fill="none" stroke="${o}" stroke-width="1.2" stroke-opacity="0.4"/>
        <text x="80" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text>
        <text x="80" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">? (${t}등분 중 1조각)</text>
      </svg>
      <figcaption>상상하기: 똑같은 ${E()}를 <strong>${t}명</strong>이 나눈 한 조각 (<strong>1/${t}</strong>)</figcaption>
    </figure>`;const c=2*Math.PI/t,i=-Math.PI/2,d=i+c,u=80+60*Math.cos(i),f=80+60*Math.sin(i),w=80+60*Math.cos(d),X=80+60*Math.sin(d),ot=c>Math.PI?1:0,B=`M 80 80 L ${u.toFixed(2)} ${f.toFixed(2)} A 60 60 0 ${ot} 1 ${w.toFixed(2)} ${X.toFixed(2)} Z`,R=i+c/2,it=(80+60*.52*Math.cos(R)).toFixed(2),y=(80+60*.52*Math.sin(R)).toFixed(2),Y=Array.from({length:t},(Zt,St)=>{const bt=i+St*c,Pt=80+60*Math.cos(bt),Dt=80+60*Math.sin(bt);return`<line x1="80" y1="80" x2="${Pt.toFixed(2)}" y2="${Dt.toFixed(2)}" stroke="${o}" stroke-width="1.8"/>`}).join("");return`<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${t}">
      <circle cx="80" cy="80" r="60" fill="${a}" stroke="${o}" stroke-width="3"/>
      <path d="${B}" fill="${l}"/>
      <circle cx="${it}" cy="${y}" r="${t>=9?3.2:4.5}" fill="#d9381e" fill-opacity="0.85"/>
      ${Y}
      <circle cx="80" cy="80" r="60" fill="none" stroke="${o}" stroke-width="3"/>
    </svg>
    <figcaption>같은 ${E()}의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function _t(t){const n=528/t,l=36+n,a=Array.from({length:t+1},(o,c)=>{const i=(36+c*n).toFixed(2),d=c===0||c===t;return`<line x1="${i}" y1="${d?22:28}" x2="${i}" y2="${d?54:48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${d?3:2}"/>`}).join("");return`<figure class="fraction fraction-numberline">
    <svg viewBox="0 0 600 78" role="img"
      aria-label="0에서 1까지를 ${t}등분하고 첫 눈금을 표시한 수직선 모형, 1/${t}">
      <rect x="36" y="31" width="${n.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      <line x1="36" y1="38" x2="564" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${a}
      <circle cx="${l.toFixed(2)}" cy="38" r="6" fill="#d9381e"/>
      <text x="36" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="${l.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${t}</text>
      <text x="564" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text>
    </svg>
    <figcaption>0~1 수직선의 <strong>1/${t}</strong> 눈금</figcaption>
  </figure>`}function Ot(t){const l=120/t,a=136-l,o=Array.from({length:t-1},(c,i)=>{const d=(16+(i+1)*120/t).toFixed(2);return`<line x1="48" y1="${d}" x2="112" y2="${d}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`}).join("");return`<figure class="fraction fraction-cup">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${t}등분하고 한 눈금만큼 채운 들이 모형, 1/${t}">
      <rect x="40" y="16" width="80" height="120" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="42" y="${a.toFixed(2)}" width="76" height="${l.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${o}
      <rect x="40" y="16" width="80" height="120" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 컵의 <strong>1/${t}컵</strong></figcaption>
  </figure>`}function st(t,e=!1){if($==="circle")return Rt(t,e);if($==="numberline")return _t(t);if($==="cup")return Ot(t);const{fill:s,bg:r,stroke:n}=wt();if(e)return`<figure class="fraction">
      <svg viewBox="0 0 600 70" role="img"
        aria-label="아직 자르지 않은 전체 길이가 같은 ${E()} 모형 (${t}명이 똑같이 나눌 예정)">
        <rect x="0" y="10" width="600" height="48" rx="8" fill="${s}" fill-opacity="0.22" stroke="${n}" stroke-width="3" stroke-dasharray="8 5"/>
        <line x1="14" y1="34" x2="586" y2="34" stroke="${n}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <text x="300" y="39" text-anchor="middle" font-size="15" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">전체 크기가 똑같은 ${E()} 1개 · ✂️ ${t}조각으로 나누면 1/${t}은?</text>
      </svg>
      <figcaption>상상하기: 같은 ${E()}를 <strong>${t}명</strong>이 똑같이 나눈 한 조각 (<strong>1/${t}</strong>)</figcaption>
    </figure>`;const l=jt(t),a=600/t,o=l.slice(1).map(i=>`<line x1="${600*i.start}" y1="10" x2="${600*i.start}" y2="58" stroke="${n}" stroke-width="2"/>`).join(""),c=m==="M01"?`<rect x="6" y="16" width="${Math.max(8,a-12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`:m==="M02"?`<circle cx="${Math.min(580,a*.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`:`<line x1="6" y1="34" x2="${Math.max(10,a-6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`;return`<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 막대, 1/${t}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="${r}" stroke="${n}" stroke-width="3"/>
      <rect x="0" y="10" width="${a}" height="48" rx="4" fill="${s}"/>
      ${c}
      ${o}
    </svg>
    <figcaption>같은 ${E()}의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function Mt(t,e,s=!1,r=!1){return`<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${$==="circle"}">${$==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
      ${s?`<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${$==="numberline"}">📐 수직선으로 보기</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${$==="cup"}">🥤 주스 컵으로 보기</button>`:""}
    </div>
    <div class="bar-pair">${st(t,r)}${st(e,r)}</div>`}function at(t){return t==="transfer"}function W(t){return at(t)?"B":"A"}function q(t,e,s,r="first"){if(!t)return"아직 선택하지 않음";const[n,l]=at(r)?[s,e]:[e,s];return{A:`1/${n}이 더 크다`,B:`1/${l}이 더 크다`,C:"두 조각의 크기가 같다",D:"아직 잘 모르겠다"}[t]}function dt(t,e,s){const r=k[t],[n,l]=at(t)?[s,e]:[e,s],a=[`A. 1/${n} 조각이 더 크다`,`B. 1/${l} 조각이 더 크다`,"C. 두 조각의 크기가 같다","D. 아직 잘 모르겠다"];return`<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${C.map((o,c)=>`<button type="button" data-pick-poll="${t}" data-pick-choice="${o}" class="solo-choice-btn ${r===o?"solo-choice-selected":""}" aria-pressed="${r===o}">${a[c]}</button>`).join("")}
  </div>`}function ut(t,e,s){const r=k[t];if(!r)return"";if(t==="first")return`<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각으로 <strong>"${q(r,e,s,t)}"</strong>을(를) 골랐어요! 이제 2단계에서 직접 잘라 확인해 볼까요?</p>`;const n=W(t);return r===n?`<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 더 적게 나눈 <strong>1/${e}</strong> 한 조각이 <strong>1/${s}</strong> 한 조각보다 더 큽니다.</p>`:r==="C"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 나눈 조각 수가 ${e}등분과 ${s}등분으로 서로 다르기 때문에 한 조각의 크기도 달라요. 덜 나눈 <strong>1/${e}</strong>이 더 큽니다.</p>`:r==="D"?`<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 같은 전체를 덜 나눈 조각일수록 한 조각의 크기가 더 커요. 따라서 <strong>1/${e}</strong> 조각이 <strong>1/${s}</strong> 조각보다 더 큽니다.</p>`:`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 분모 숫자 ${s}이 ${e}보다 크지만, 같은 전체를 더 여러 조각으로 나누면 한 조각의 크기는 오히려 작아져요! 따라서 <strong>1/${e}</strong>(${n}번)이 더 큽니다.</p>`}function Et(t){if(A)return"🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.";const e=b[t]??rt(),s=J(S);if(!s)return`⚠️ 참여 인원은 1~${G} 사이의 자연수로 입력해 주세요.`;const r=K(e,s),n=W(t);if(r)return`집계 완료: 정답(${n}) ${r.counts[n]}/${s}명 · 미응답 ${r.noResponse}명`;if(C.every(a=>/^(?:0|[1-9]\d*)$/.test(e[a]))){const a=C.reduce((o,c)=>o+Number(e[c]),0);if(a>s)return`⚠️ 보기 인원 합계(${a}명)가 참여 인원(${s}명)보다 많습니다. 인원수를 확인해 주세요.`}return"학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요."}function pt(t,e,s){const r=b[t]??rt(),[n,l]=at(t)?[s,e]:[e,s],a=[`A (1/${n})`,`B (1/${l})`,"C (같다)","D (모름)"];return`<details class="class-poll-details" data-poll-details="${t}" ${D?"open":""}>
    <summary>👩‍🏫 교실 수업용 거수 투표·인원수 기록하기 (필요할 때만 열기)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${G}명) <input id="${t==="transfer"?"participants-transfer":"participants"}" data-participants-input="${t}" type="text" inputmode="numeric" value="${S}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" class="secondary-btn" aria-pressed="${A}">${A?"👀 결과 공개하기":"🙈 결과 잠시 가리기"}</button>
      </div>
      <div class="class-poll-inputs">
        ${C.map((c,i)=>`<div class="poll-counter-card">
            <label>${a[i]} <input data-count="${c}" data-count-poll="${t}" type="text" inputmode="numeric" value="${A?"•":r[c]}" aria-label="${c} 선택 인원" autocomplete="off" ${A?"readonly":""}></label>
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
      <p class="class-poll-status" data-status-poll="${t}" role="status">${Et(t)}</p>
    </div>
  </details>`}function Ut(){const t=F(),[e,s]=t.denominators.first,r=ht[m]??ht.M01;return`
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${gt().map(l=>{const a=l.id===m,o=I.has(l.id);return`<button type="button" data-unit-id="${l.id}" class="unit-card-btn ${a?"unit-card-active":""}" aria-pressed="${a}">
      <span class="unit-stamp-tag">${o?"⭐ 클리어 완료!":a?"🔍 지금 탐구 중":"👆 눌러서 시작"}</span>
      <strong>${l.title}</strong>
      <span>${l.description}</span>
    </button>`}).join("")}
    </div>

    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${e}과 1/${s} 비교</h2>

      <div class="story-dilemma-card" role="region" aria-label="${r.badge}">
        <span class="story-badge">${r.badge}</span>
        <p class="question-lead">${r.lead}</p>
      </div>

      <p class="teacher-talk-banner">${nt.think}</p>

      ${Mt(e,s,!1,!N)}
      <div class="spoiler-hint-row">
        <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${N}">
          ${N?"🙈 자르기 전 모양으로 다시 가리기":"👀 자른 눈금 힌트 살짝 미리 보기"}
        </button>
      </div>

      ${dt("first",e,s)}
      ${ut("first",e,s)}

      <div class="reason-section">
        <h3>💭 왜 그렇게 생각했나요? (내 생각과 가장 비슷한 말풍선 고르기)</h3>
        <div class="actions reason-bubble-list">
          ${Xt.map((l,a)=>`<button type="button" data-reason="${a}" class="reason-bubble-btn" aria-label="${l}" aria-pressed="${L===String(a)}">
              <span class="student-bubble">${mt[a]}</span>
            </button>`).join("")}
        </div>
        ${U?`<p class="ai-linked-badge">🤖 로컬 AI 추천 탐구 연결됨: <strong>${U}</strong></p>`:""}
      </div>

      ${pt("first",e,s)}

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn">② 직접 실험하러 가기 →</button>
      </div>
    </div>`}function Ct(t){const e=t<p?">":t>p?"<":"=",s=t<p?`${t}등분 한 조각이 ${p}등분 한 조각보다 더 큽니다`:t>p?`${p}등분 한 조각이 ${t}등분 한 조각보다 더 큽니다`:"두 조각의 크기가 같습니다";return{barsHtml:`${st(t)}${st(p)}`,badgeHtml:`크기 비교: <strong>1/${t} ${e} 1/${p}</strong> (${s})`,discoveryHtml:z?'<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>':""}}function ft(){const[t]=F().denominators.first,{barsHtml:e,badgeHtml:s,discoveryHtml:r}=Ct(t),n=h.querySelector("#explore-exp2-bars");n&&(n.innerHTML=e);const l=h.querySelector("#explore-denom-output");l&&(l.textContent=`${p}등분 (1/${p})`);const a=h.querySelector("#explore-slider");a&&a.value!==String(p)&&(a.value=String(p));const o=h.querySelector('button[data-action="less"]');o&&(o.disabled=p<=Q);const c=h.querySelector('button[data-action="more"]');c&&(c.disabled=p>=Z),h.querySelectorAll("button[data-quick-denom]").forEach(u=>{const f=Number(u.dataset.quickDenom)===p;u.setAttribute("aria-pressed",String(f)),u.classList.toggle("quick-denom-active",f)});const i=h.querySelector("#explore-cmp-badge");i&&(i.innerHTML=s);const d=h.querySelector("#explore-discovery-2");d&&(d.innerHTML=r)}function zt(){const[t,e]=F().denominators.first,s=q(k.first,t,e,"first"),r=L!==""?mt[Number(L)]:"내 처음 생각을 직접 실험으로 확인해 볼까요?",n=600/t,l=600/e,a=Math.max(0,n-l),{barsHtml:o,badgeHtml:c,discoveryHtml:i}=Ct(t),d=Lt.map(u=>{const f=p===u;return`<button type="button" data-quick-denom="${u}" class="secondary-btn quick-denom-btn ${f?"quick-denom-active":""}" aria-pressed="${f}">👧 ${u}명이 나눌 때 (1/${u})</button>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 재미있는 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>나의 처음 생각</strong>: <strong>${s}</strong></p>
        <p class="hypothesis-sub">${r}</p>
      </div>

      <p class="teacher-talk-banner">${nt.explore}</p>

      <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
        <h3>실험 1 · 가위로 잘라 두 조각을 포개어 대어 보기</h3>
        <p>1/${t} 조각과 1/${e} 조각의 왼쪽 끝을 똑같이 맞추어 포개어 볼까요?</p>
        <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${T}">
          ${T?"✂️ 포개어 비교한 결과 닫기":"✂️ 1/"+t+" 조각과 1/"+e+" 조각 포개어 비교하기"}
        </button>

        ${T?`
          <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
            <svg viewBox="0 0 600 92" role="img" aria-label="1/${t} 조각과 1/${e} 조각을 겹쳐 길이 차이를 비교한 그림">
              <rect x="0" y="8" width="600" height="74" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <rect x="0" y="14" width="${n.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(535,n+8).toFixed(2)}" y="32" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${t} 한 조각</text>
              <rect x="0" y="46" width="${l.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <rect x="${l.toFixed(2)}" y="46" width="${a.toFixed(2)}" height="26" rx="4" fill="#fde2e2" stroke="#d9381e" stroke-width="2" stroke-dasharray="4 2"/>
              <text x="${Math.min(430,n+8).toFixed(2)}" y="64" font-size="13" font-weight="800" fill="#d9381e">← 이만큼 1/${t}이 더 길어요!</text>
              <line x1="${l.toFixed(2)}" y1="10" x2="${l.toFixed(2)}" y2="78" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
            </svg>
            <p class="answer">💡 <strong>발견 1</strong>: 왼쪽 끝을 맞추어 포개어 보니, 덜 나눈 <strong>1/${t}</strong> 조각이 <strong>1/${e}</strong> 조각보다 빨간 점선 칸만큼 확실히 더 깁니다!</p>
          </div>
        `:""}
      </section>

      <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
        <h3>실험 2 · 나누어 먹는 사람 수(분모)를 2명~12명 사이에서 바꿔 보기</h3>
        <p>빠른 인원 버튼을 누르거나 슬라이더를 움직여 더 많이 나눌 때 한 조각이 어떻게 변하는지 관찰해 보세요.</p>

        <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
          <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${$==="circle"}">${$==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
        </div>

        <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">
          ${d}
        </div>

        <div id="explore-exp2-bars" class="bar-pair">${o}</div>

        <div class="slider-experiment-controls">
          <button type="button" data-action="less" ${p<=Q?"disabled":""} aria-label="등분 수 줄이기">−</button>
          <input id="explore-slider" type="range" min="${Q}" max="${Z}" value="${p}" aria-label="나누는 조각 수 슬라이더">
          <output id="explore-denom-output" aria-live="polite">${p}등분 (1/${p})</output>
          <button type="button" data-action="more" ${p>=Z?"disabled":""} aria-label="등분 수 늘리기">＋</button>
        </div>

        <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${c}</p>
        <div id="explore-discovery-2" aria-live="polite">${i}</div>
      </section>

      <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
        <h3>😮 깜짝 실험 · 만약 원래 ${E()} 전체 크기가 서로 다르면 어떨까요?</h3>
        <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${H}">
          ${H?"😮 깜짝 함정 실험 닫기":"😮 깜짝 실험 열어 보기: 미니 간식의 1/2 vs 특대형 간식의 1/4"}
        </button>
        ${H?`
          <div class="trap-experiment-content" role="region" aria-label="전체 크기가 서로 다른 두 간식 비교">
            <svg viewBox="0 0 600 84" role="img" aria-label="작은 미니 간식의 1/2 조각(길이 100)과 특대형 간식의 1/4 조각(길이 140) 비교">
              <rect x="0" y="10" width="200" height="26" rx="4" fill="#fff" stroke="#153a69" stroke-width="2"/>
              <rect x="0" y="10" width="100" height="26" rx="4" fill="#ffca62" stroke="#153a69" stroke-width="2"/>
              <text x="212" y="28" font-size="13" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">작은 미니 ${E()}의 1/2 한 조각</text>
              <rect x="0" y="46" width="560" height="26" rx="4" fill="#fff" stroke="#153a69" stroke-width="2"/>
              <rect x="0" y="46" width="140" height="26" rx="4" fill="#7cc6fe" stroke="#153a69" stroke-width="2"/>
              <text x="150" y="64" font-size="13" font-weight="700" fill="#d9381e">특대형 점보 ${E()}의 1/4 한 조각 (더 큼!)</text>
            </svg>
            <p class="answer">💡 <strong>깜짝 발견!</strong> 원래 전체 크기가 다르면 <strong>1/4</strong>이 <strong>1/2</strong>보다 더 클 수도 있어요! 그래서 단위분수의 크기를 비교할 때는 반드시 <strong>"원래 전체의 크기가 똑같다"</strong>는 약속이 먼저 있어야 합니다.</p>
          </div>
        `:""}
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`}function Wt(){const[t,e]=F().denominators.first,[s,r]=F().denominators.transfer,n=V.filter(a=>et[a.id]===a.answer).length,l=V.map(a=>{const o=et[a.id],c=o===a.answer;return`<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${a.id+1}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${a.id+1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${a.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${o==="left"?"solo-choice-selected":""}" aria-pressed="${o==="left"}">1/${a.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${a.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${o==="right"?"solo-choice-selected":""}" aria-pressed="${o==="right"}">1/${a.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${o===null?"👆 더 큰 쪽을 터치!":c?"🎉 정답!":`💡 1/${Math.min(a.leftDenom,a.rightDenom)}이 더 커요!`}</span>
    </div>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 실험 후 내 생각 확인과 분수 대결</h2>

      <p class="teacher-talk-banner">${nt.check}</p>

      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기: 같은 ${E()}에서 1/${t}과 1/${e} 중 어느 쪽이 더 클까요?</h3>
        <p class="first-memory-tag">💭 1단계에서 고른 내 처음 생각: <strong>${q(k.first,t,e,"first")}</strong></p>
        ${dt("again",t,e)}
        ${ut("again",t,e)}
        ${pt("again",t,e)}
      </section>

      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 한 걸음 더! 새로운 문제: 같은 전체에서 <strong>1/${r}</strong>과 <strong>1/${s}</strong> 중 어느 쪽이 더 클까요?</h3>
        <p class="transfer-caution-note">🔍 보기 순서를 잘 보고 더 큰 조각을 골라 보세요!</p>
        ${Mt(r,s,!0)}
        ${dt("transfer",s,r)}
        ${ut("transfer",s,r)}
        ${pt("transfer",s,r)}
      </section>

      <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
        <h3>3) ⚡ 번개 미니게임 · 어느 조각이 더 클까요? (더 큰 분수 카드를 콕 찍어 보세요!)</h3>
        <div class="duel-rounds-list">
          ${l}
        </div>
        <p class="duel-score-banner" role="status">🎯 미니게임 현재 점수: <strong>${n} / ${V.length}</strong> 정답 ${n===V.length?"🏆 퍼펙트 클리어!":""}</p>
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`}function Yt(){I.add(m);const t=F(),[e,s]=t.denominators.first,[r,n]=t.denominators.transfer,l=P?"작아집니다!":M==="bigger"?"커집니다(?)":M==="same"?"같습니다(?)":"______",a=k.again===W("again"),o=k.transfer===W("transfer"),c=a&&o?"🏆 최고예요! 직접 실험을 통해 단위분수의 크기 비교 원리를 완벽하게 내 것으로 만들었어요!":a||o?"🌟 참 잘했어요! 실험을 통해 같은 전체를 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!":"🌱 끝까지 스스로 실험하고 생각하며 단위분수의 비밀을 탐구했어요!",i=J(S),d=i&&b.first?K(b.first,i):null,u=i&&b.again?K(b.again,i):null,f=i&&b.transfer?K(b.transfer,i):null,w=[];if(d&&u&&i){const y=It(d.counts.A,u.counts.A,i);w.push(`처음·재선택 정답(1/${e}) 인원: <strong>${d.counts.A}/${i}명 → ${u.counts.A}/${i}명</strong> (${y>=0?"+":""}${y.toFixed(1)}%p)`)}f&&i&&w.push(`응용 문제 정답(1/${r}, B번) 인원: <strong>${f.counts.B}/${i}명</strong>`);const X=w.length>0?`<p class="comparison">👩‍🏫 <strong>학급 전체 집계 요약</strong>: ${w.join(" · ")}</p>`:"",ot=P?'<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 똑같이 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>':M==="bigger"||M==="same"?'<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 2단계 실험에서 나누는 사람 수를 12명으로 늘렸을 때 한 조각의 크기가 어떻게 변했는지 떠올려 보세요!</p>':"",B=gt(),R=B.find(y=>!I.has(y.id))??B[(B.findIndex(y=>y.id===m)+1)%B.length],it=B.map(y=>{const Y=I.has(y.id);return`<div class="stamp-item ${Y?"stamp-done":""}">
      <span class="stamp-icon">${Y?"🎖️ 클리어!":"🔒 미도전"}</span>
      <strong>${y.title}</strong>
    </div>`}).join("");return`
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 내 생각의 성장 카드와 마스터 스탬프</h2>

      <p class="teacher-talk-banner">${nt.result}</p>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${c}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 내 생각 (1/${e} vs 1/${s})</span>
            <strong>${q(k.first,e,s,"first")}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${a?"journey-correct":""}">
            <span class="journey-label">② 실험 후 내 생각 (1/${e} vs 1/${s})</span>
            <strong>${q(k.again,e,s,"again")} ${a?"⭐":""}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${o?"journey-correct":""}">
            <span class="journey-label">③ 응용 문제 (1/${n} vs 1/${r})</span>
            <strong>${q(k.transfer,r,n,"transfer")} ${o?"⭐":""}</strong>
          </div>
        </div>
        ${X}
      </div>

      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>🧩 단어 카드를 골라 오늘의 단위분수 규칙을 완성해 보세요!</h3>
        <div class="notebook-line">
          <p>"크기가 같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${l} ]</strong>"</p>
        </div>
        <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
          <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn ${M==="bigger"?"rule-card-wrong":""}" aria-pressed="${M==="bigger"}">📈 점점 커집니다</button>
          <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${P?"solo-choice-selected":""}" aria-pressed="${P}">📉 작아집니다!</button>
          <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn ${M==="same"?"rule-card-wrong":""}" aria-pressed="${M==="same"}">🟰 항상 똑같습니다</button>
        </div>
        ${ot}
      </div>

      <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
        <h3>🎖️ 분수 탐구 스탬프 투어 (${I.size} / ${B.length} 이야기 클리어!)</h3>
        <div class="stamp-grid">
          ${it}
        </div>
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄하기</button>
        <button type="button" data-action="next-unit" data-next-unit-id="${R.id}" class="primary-next-btn">🚀 다음 이야기(${R.title.split("·")[0].trim()}) 도전하기 →</button>
        <button type="button" data-action="restart" class="secondary-btn">🔄 처음부터 다시 하기</button>
      </div>
    </div>`}function Vt(){switch(x){case"think":return Ut();case"explore":return zt();case"check":return Wt();case"result":return Yt()}}function Kt(){const t=yt(),e=kt();return`<header>
    <p class="eyebrow">${vt?"로컬 AI 보조 수업":"초등 수학 분수 탐구"} · 단위분수 크기 비교</p>
    <h1>생각의 갈림길 AI</h1>
    <p>직접 나누고 겹쳐 보며 분수의 크기를 스스로 깨닫는 4단계 탐구</p>
    <div class="header-controls">
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${e}" type="button">${e?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${t}" type="button">${t?"☀️":"🌙"}</button>
    </div>
  </header>`}function Qt(){const t=v.indexOf(x);return`<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${v.map((e,s)=>{const r=s<t,n=s===t;return`<button type="button" class="${r?"step-pill done":n?"step-pill current":"step-pill"}" data-step-index="${s}" aria-current="${n?"step":"false"}">${ct[e]}</button>`}).join("")}
    </div>
  </nav>`}function g(t=!1){x!=="check"&&($==="numberline"||$==="cup")&&($="bar");const e=ct[x];if(h.innerHTML=[Kt(),Qt(),`<section id="step" role="region" aria-label="${e}">${Vt()}<p id="error" role="alert">${j}</p></section>`,'<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>',"<footer>이 화면의 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>"].join(""),tt?.sync(x==="think"),t){h.querySelector("#step h2")?.focus();const s=h.querySelector("#step-announce");s&&(s.textContent=`${ct[x]} 단계로 이동했습니다.`)}}function xt(){h.querySelectorAll(".class-poll-status[data-status-poll]").forEach(t=>{const e=t.dataset.statusPoll;t.textContent=Et(e)}),h.querySelectorAll("input[data-participants-input]").forEach(t=>{t!==document.activeElement&&t.value!==S&&(t.value=S)})}h.addEventListener("toggle",t=>{const e=t.target;e instanceof HTMLDetailsElement&&e.classList.contains("class-poll-details")&&(D=e.open)},!0);h.addEventListener("input",t=>{const e=t.target;if(e.id==="explore-slider"){p=Number(e.value),z=!0,ft();return}if(e.id==="participants"||e.dataset.participantsInput){S=e.value,D=!0,xt();return}if(e.dataset.count&&e.dataset.countPoll){if(A)return;const s=e.dataset.countPoll,r=e.dataset.count;b[s]??=rt(),b[s][r]=e.value,D=!0,xt()}});window.addEventListener("keydown",t=>{if(!t.altKey)return;const e=document.activeElement?.tagName;if(e==="INPUT"||e==="TEXTAREA")return;const s=v.indexOf(x);t.key==="ArrowRight"&&s<v.length-1?(t.preventDefault(),x=v[s+1],g(!0)):t.key==="ArrowLeft"&&s>0&&(t.preventDefault(),x=v[s-1],g(!0))});h.addEventListener("click",t=>{const e=t.target.closest("button");if(!e)return;if(e.id==="theme-toggle"){const r=yt()?"light":"dark";document.documentElement.setAttribute("data-theme",r),e.textContent=r==="dark"?"☀️":"🌙",e.setAttribute("aria-pressed",String(r==="dark"));return}if(e.id==="scale-toggle"){const r=kt()?"normal":"large";document.documentElement.setAttribute("data-scale",r),e.textContent=r==="large"?"🔍 기본":"🔍 큰글씨",e.setAttribute("aria-pressed",String(r==="large"));return}if(e.dataset.stepIndex!==void 0){const r=Number(e.dataset.stepIndex);Number.isInteger(r)&&r>=0&&r<v.length&&(x=v[r],j="",g(!0));return}if(e.dataset.unitId){m=e.dataset.unitId,_(!0,!0);return}if(e.dataset.quickDenom!==void 0){p=Number(e.dataset.quickDenom),z=!0,ft();return}if(e.dataset.duelRound!==void 0&&e.dataset.duelPick){const r=Number(e.dataset.duelRound);et[r]=e.dataset.duelPick,g();return}if(e.dataset.ruleChoice){const r=e.dataset.ruleChoice;M=r,P=r==="smaller"?!P:!1,g();return}if(e.dataset.votePoll&&e.dataset.voteChoice&&e.dataset.voteDelta){const r=e.dataset.votePoll,n=e.dataset.voteChoice,l=Number(e.dataset.voteDelta);b[r]??={A:"0",B:"0",C:"0",D:"0"};for(const f of C)b[r][f].trim()===""&&(b[r][f]="0");const a=C.filter(f=>f!==n).reduce((f,w)=>f+(parseInt(b[r][w],10)||0),0),o=parseInt(b[r][n],10)||0,c=Math.max(0,G-a),i=Math.max(0,Math.min(c,o+l));b[r][n]=String(i);const d=a+i,u=J(S);(!u||d>u)&&(S=String(Math.max(1,Math.min(G,d)))),D=!0,g();return}if(e.dataset.pickPoll&&e.dataset.pickChoice){const r=e.dataset.pickPoll,n=e.dataset.pickChoice;k[r]=n,j="",g();return}if(e.dataset.reason!==void 0){L=e.dataset.reason,U="",g();return}const s=e.dataset.action;if(s==="toggle-model")$=$==="circle"?"bar":"circle",g();else if(s==="toggle-spoiler")N=!N,g();else if(s==="toggle-numberline")$=$==="numberline"?"bar":"numberline",g();else if(s==="toggle-cup")$=$==="cup"?"bar":"cup",g();else if(s==="toggle-overlap")T=!T,g();else if(s==="toggle-trap")H=!H,g();else if(s==="toggle-poll-blind")A=!A,D=!0,g();else if(s==="less"||s==="more")p=Math.max(Q,Math.min(Z,p+(s==="more"?1:-1))),z=!0,ft();else if(s==="toggle-notebook-blank")P=!P,g();else if(s==="fill-zeros"){const r=e.dataset.targetPoll||"first";b[r]??=rt();for(const n of C)b[r][n].trim()===""&&(b[r][n]="0");D=!0,g()}else if(s==="fill-sample"){const r=e.dataset.targetPoll||"first",n=J(S)??20,l=W(r),a=l==="A"?"B":"A",o=Math.round(r==="first"?n*.4:n*.8),c=Math.round(r==="first"?n*.45:n*.1),i=Math.round(n*.05),d=Math.max(0,n-o-c-i),u={A:"0",B:"0",C:String(i),D:String(d)};u[l]=String(o),u[a]=String(c),b[r]=u,D=!0,g()}else if(s==="next"){const r=v.indexOf(x);r<v.length-1&&(x=v[r+1],j="",g(!0))}else if(s==="back"){const r=v.indexOf(x);r>0&&(x=v[r-1],j="",g(!0))}else s==="next-unit"?(m=e.dataset.nextUnitId||"M02",_(!0,!0),window.scrollTo?.({top:0})):s==="print-summary"?window.print():s==="restart"&&(_(),window.scrollTo?.({top:0}))});window.addEventListener("pagehide",()=>_());window.addEventListener("pageshow",t=>{t.persisted&&_()});p=F().denominators.first[1];g();vt&&Ft(async()=>{const{createLessonAiPanel:t}=await import("./lesson-ai-panel-BoDNsCOK.js");return{createLessonAiPanel:t}},__vite__mapDeps([0,1,2])).then(({createLessonAiPanel:t})=>{tt=t(h,(e,s)=>{L=e==="A"?"0":e==="B"?"1":"2",U=s,g()}),tt.sync(x==="think")});
