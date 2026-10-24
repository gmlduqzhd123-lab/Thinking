const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lesson-ai-panel-D2jl9MuX.js","assets/errors-S67X06TO.js","assets/constants-CYr9ulPU.js"])))=>i.map(i=>d[i]);
import{D as F,a as L,b as ut}from"./constants-CYr9ulPU.js";const pt="modulepreload",ft=function(t){return"/Thinking/"+t},Z={},bt=function(e,s,n){let r=Promise.resolve();if(s&&s.length>0){let u=function(i){return Promise.all(i.map(d=>Promise.resolve(d).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");r=u(s.map(i=>{if(i=ft(i),i in Z)return;Z[i]=!0;const d=i.endsWith(".css"),x=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${x}`))return;const v=document.createElement("link");if(v.rel=d?"stylesheet":pt,d||(v.as="script"),v.crossOrigin="",v.href=i,l&&v.setAttribute("nonce",l),document.head.appendChild(v),d)return new Promise((_,V)=>{v.addEventListener("load",_),v.addEventListener("error",()=>V(new Error(`Unable to preload CSS for ${i}`)))})}))}function a(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return r.then(o=>{for(const l of o||[])l.status==="rejected"&&a(l.reason);return e().catch(a)})},A=["A","B","C","D"];function X(){return{A:"",B:"",C:"",D:""}}function Y(t){return/^(?:[1-9]|[1-5][0-9]|60)$/.test(t)?Number(t):null}function R(t,e){if(!Number.isInteger(e)||e<1||e>60||A.some(r=>!/^(?:0|[1-9]\d*)$/.test(t[r])))return null;const s=Object.fromEntries(A.map(r=>[r,Number(t[r])])),n=A.reduce((r,a)=>r+s[a],0);return n>e?null:{counts:s,noResponse:e-n}}function G(t,e,s){return(e-t)/s*100}function gt(t){if(!Number.isInteger(t)||t<2||t>12)throw new RangeError("denominator must be 2–12");return Array.from({length:t},(e,s)=>({start:s/t,end:(s+1)/t}))}const B=new Map;function O(t){if(B.has(t.id))throw new Error(`Unit "${t.id}" is already registered.`);B.set(t.id,t)}function $t(t){const e=B.get(t);if(!e)throw new Error(`Unit "${t}" not found. Registered: ${[...B.keys()].join(", ")}`);return e}function Q(){return[...B.values()]}const ht={id:"M01",title:"🥖 초코바 나누기 · 단위분수 기초 비교 (1/3과 1/5)",description:"길이가 같은 초코바와 리본을 똑같이 나누어 1/3과 1/5 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 나누기",text:"같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모가 커지면 한 조각도 커진다는 생각을 살핍니다."},{id:"B",title:"나누는 수 바꾸기",text:"전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.",hint:"분모와 한 조각 크기의 관계를 설명해 봅니다."},{id:"C",title:"전체 다시 만들기",text:"1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.",hint:"분모가 무엇을 뜻하는지 확인합니다."}],examples:[{id:"E1",text:"5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 길이를 더 많이 나누면 한 조각은 작아져요.",expected:"B"},{id:"E3",text:"두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.",expected:"hold"},{id:"E4",text:"분모가 무엇을 뜻하는지 모르겠어요.",expected:"C"},{id:"E5",text:"어떤 물건인지도 모르고 길이 정보가 없어요.",expected:"hold"},{id:"E6",text:"오늘 날씨가 좋아서 운동장에 갔어요.",expected:"hold"}],denominators:{first:[3,5],transfer:[4,6]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},xt={id:"M02",title:"🍕 피자 조각 고르기 · 단위분수 심화 비교 (1/4과 1/7)",description:"크기가 같은 피자와 리본을 똑같이 나누어 1/4과 1/7 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"같은 전체 세밀하게 나누기",text:"같은 길이의 전체를 4등분과 7등분해 한 조각의 길이를 직접 비교합니다.",hint:"분모 7이 4보다 크니까 1/7이 크다는 생각을 살핍니다."},{id:"B",title:"등분 수와 조각 크기 규칙 찾기",text:"등분 수를 4에서 7로 늘릴 때 한 조각의 크기가 어떻게 변하는지 규칙을 찾습니다.",hint:"나누는 횟수가 늘어날수록 한 조각이 작아지는 이유를 설명해 봅니다."},{id:"C",title:"단위분수 모아 전체 확인하기",text:"1/4 네 조각과 1/7 일곱 조각을 각각 모아 처음 전체와 같은지 확인합니다.",hint:"단위분수가 전체의 몇 분의 일인지 의미를 되짚습니다."}],examples:[{id:"E1",text:"7이 4보다 크니까 1/7 조각이 더 크다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 여러 번 나눌수록 한 조각은 줄어들어요.",expected:"B"},{id:"E3",text:"전체 크기가 서로 다르면 1/4과 1/7을 바로 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/7이 전체를 어떻게 나눈 것인지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"문제에 그림이나 길이 설명이 전혀 없어요.",expected:"hold"},{id:"E6",text:"점심시간에 친구들과 축구를 했어요.",expected:"hold"}],denominators:{first:[4,7],transfer:[5,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아|여러 번 나눌수록.{0,12}줄어",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}},vt={id:"M03",title:"🎀 색테이프 자르기 · 단위분수 응용 비교 (1/2과 1/6)",description:"길이가 같은 색테이프와 리본을 똑같이 나누어 1/2과 1/6 한 조각의 크기를 비교합니다.",cards:[{id:"A",title:"반으로 나누기와 여섯으로 나누기",text:"같은 길이의 전체를 2등분과 6등분해 한 조각의 길이를 직접 비교합니다.",hint:"6이 2보다 크니까 1/6이 더 크다는 생각을 점검합니다."},{id:"B",title:"등분 배수와 조각 크기 관계",text:"2등분한 조각을 다시 3등분하면 6등분이 된다는 점을 통해 조각 크기를 관찰합니다.",hint:"나누는 수가 커질수록 한 조각이 얼마나 작아지는지 살펴봅니다."},{id:"C",title:"단위분수 개수로 전체 채우기",text:"1/2 두 조각과 1/6 여섯 조각을 모아 같은 전체가 되는지 확인합니다.",hint:"분모가 전체를 똑같이 나눈 조각 수임을 확인합니다."}],examples:[{id:"E1",text:"6이 2보다 훨씬 크니까 1/6 조각이 더 길다고 생각해요.",expected:"A"},{id:"E2",text:"같은 전체를 더 많이 나누면 한 조각의 길이는 짧아져요.",expected:"B"},{id:"E3",text:"전체 리본의 길이가 서로 다르면 비교할 수 없어요.",expected:"hold"},{id:"E4",text:"1/6이 무엇을 나타내는지 잘 모르겠어요.",expected:"C"},{id:"E5",text:"길이에 대한 설명이 없어서 알기 어려워요.",expected:"hold"},{id:"E6",text:"쉬는 시간에 물 마시러 다녀왔어요.",expected:"hold"}],denominators:{first:[2,6],transfer:[3,8]},holdPatterns:[{pattern:"전체.{0,8}(서로 다르|다르)|서로 다른 전체",reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{pattern:"더 많이 나누면.{0,12}(작아|짧아)|더 많이 나눌수록.{0,12}(작아|짧아)",reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{pattern:"모르겠|정보가 없|알 수 없",reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],thresholds:{minSimilarity:.48,minMargin:.045}};Q().length===0&&(O(ht),O(xt),O(vt));const $=["think","explore","check","result"],q={think:"1. 생각 고르기",explore:"2. 직접 실험하기",check:"3. 다시 점검하기",result:"4. 오늘의 발견"},mt=["분모가 클수록 조각이 크다고 생각함","더 많이 나눌수록 조각이 작아진다고 생각함","전체가 같은지 확인이 필요함"],tt=['💬 "분모 숫자가 더 크니까 한 조각도 더 클 것 같아요!"','💬 "같은 전체를 더 많이 나누면 한 조각은 더 작아질 것 같아요!"','💬 "두 리본의 원래 전체 길이가 똑같은지 먼저 확인해야 해요!"'],f=document.querySelector("#lesson-app"),et=f.dataset.aiEnabled==="true";let H,D="M01",b="bar",g="think",m={first:null,again:null,transfer:null},P="",j="",M=!1,c=5,N=!1,S=!1,w=!1,y="20",h={first:null,again:null,transfer:null},E="";function k(){return $t(D)}function st(){return document.documentElement.getAttribute("data-theme")==="dark"}function nt(){return document.documentElement.getAttribute("data-scale")==="large"}function I(t=!1){H?.dispose(),t||(D="M01"),b="bar",g="think",m={first:null,again:null,transfer:null},P="",j="",M=!1,c=k().denominators.first[1],N=!1,S=!1,w=!1,y="20",h={first:null,again:null,transfer:null},E="",p()}function yt(t){const r=2*Math.PI/t,a=-Math.PI/2,o=a+r,l=80+60*Math.cos(a),u=80+60*Math.sin(a),i=80+60*Math.cos(o),d=80+60*Math.sin(o),x=r>Math.PI?1:0,v=`M 80 80 L ${l.toFixed(2)} ${u.toFixed(2)} A 60 60 0 ${x} 1 ${i.toFixed(2)} ${d.toFixed(2)} Z`,_=Array.from({length:t},(V,lt)=>{const K=a+lt*r,ct=80+60*Math.cos(K),dt=80+60*Math.sin(K);return`<line x1="80" y1="80" x2="${ct.toFixed(2)}" y2="${dt.toFixed(2)}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.8"/>`}).join("");return`<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${t}">
      <circle cx="80" cy="80" r="60" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <path d="${v}" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${_}
      <circle cx="80" cy="80" r="60" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 전체의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function kt(t){const r=528/t,a=36+r,o=Array.from({length:t+1},(l,u)=>{const i=(36+u*r).toFixed(2),d=u===0||u===t;return`<line x1="${i}" y1="${d?22:28}" x2="${i}" y2="${d?54:48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${d?3:2}"/>`}).join("");return`<figure class="fraction fraction-numberline">
    <svg viewBox="0 0 600 78" role="img"
      aria-label="0에서 1까지를 ${t}등분하고 첫 눈금을 표시한 수직선 모형, 1/${t}">
      <rect x="36" y="31" width="${r.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      <line x1="36" y1="38" x2="564" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${o}
      <circle cx="${a.toFixed(2)}" cy="38" r="6" fill="#d9381e"/>
      <text x="36" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="${a.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${t}</text>
      <text x="564" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text>
    </svg>
    <figcaption>0~1 수직선의 <strong>1/${t}</strong> 눈금</figcaption>
  </figure>`}function wt(t){const a=120/t,o=136-a,l=Array.from({length:t-1},(u,i)=>{const d=(16+(i+1)*120/t).toFixed(2);return`<line x1="48" y1="${d}" x2="112" y2="${d}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`}).join("");return`<figure class="fraction fraction-cup">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${t}등분하고 한 눈금만큼 채운 들이 모형, 1/${t}">
      <rect x="40" y="16" width="80" height="120" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="42" y="${o.toFixed(2)}" width="76" height="${a.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${l}
      <rect x="40" y="16" width="80" height="120" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 컵의 <strong>1/${t}컵</strong></figcaption>
  </figure>`}function T(t){if(b==="circle")return yt(t);if(b==="numberline")return kt(t);if(b==="cup")return wt(t);const e=gt(t),s=600/t,n=e.slice(1).map(r=>`<line x1="${600*r.start}" y1="10" x2="${600*r.start}" y2="58" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>`).join("");return`<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${t}등분하고 첫 한 조각을 칠한 분수 막대, 1/${t}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="0" y="10" width="${s}" height="48" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${n}
    </svg>
    <figcaption>같은 전체의 <strong>1/${t}</strong> (${t}조각 중 한 조각)</figcaption>
  </figure>`}function rt(t,e,s=!1){return`<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${b==="circle"}">${b==="circle"?"📏 막대 모양으로 보기":"🍕 둥근 피자 모양으로 보기"}</button>
      ${s?`<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${b==="numberline"}">📐 수직선으로 보기</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${b==="cup"}">🥤 주스 컵으로 보기</button>`:""}
    </div>
    <div class="bar-pair">${T(t)}${T(e)}</div>`}function C(t,e,s){return t?{A:`1/${e}이 더 크다`,B:`1/${s}이 더 크다`,C:"두 조각의 크기가 같다",D:"아직 잘 모르겠다"}[t]:"아직 선택하지 않음"}function U(t,e,s){const n=m[t],r=[`A. 1/${e} 조각이 더 크다`,`B. 1/${s} 조각이 더 크다`,"C. 두 조각의 크기가 같다","D. 아직 잘 모르겠다"];return`<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${A.map((a,o)=>`<button type="button" data-pick-poll="${t}" data-pick-choice="${a}" class="solo-choice-btn ${n===a?"solo-choice-selected":""}" aria-pressed="${n===a}">${r[o]}</button>`).join("")}
  </div>`}function z(t,e,s){const n=m[t];return n?t==="first"?`<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각으로 <strong>"${C(n,e,s)}"</strong>을(를) 골랐어요!</p>`:n==="A"?`<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 더 적게 나눈 <strong>1/${e}</strong> 한 조각이 <strong>1/${s}</strong> 한 조각보다 더 큽니다.</p>`:n==="B"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 분모 숫자 ${s}이 ${e}보다 크지만, 같은 전체를 더 여러 조각으로 나누면 한 조각의 크기는 오히려 작아져요! 따라서 <strong>1/${e}</strong>이 더 큽니다.</p>`:n==="C"?`<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 나눈 조각 수가 ${e}등분과 ${s}등분으로 서로 다르기 때문에 한 조각의 크기도 달라요. 덜 나눈 <strong>1/${e}</strong>이 더 큽니다.</p>`:`<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 같은 전체를 덜 나눈 조각일수록 한 조각의 크기가 더 커요. 따라서 <strong>1/${e}</strong> 조각이 <strong>1/${s}</strong> 조각보다 더 큽니다.</p>`:""}function W(t,e,s){const n=h[t]??X(),r=[`A (1/${e})`,`B (1/${s})`,"C (같다)","D (모름)"];return`<details class="class-poll-details" data-poll-details="${t}" ${w?"open":""}>
    <summary>👩‍🏫 교실 수업용 인원수 기록하기 (필요할 때만 열기)</summary>
    <div class="class-poll-body">
      <label>참여 인원(1~${ut}명) <input id="participants" data-participants-input="${t}" type="text" inputmode="numeric" value="${y}" autocomplete="off"></label>
      <div class="class-poll-inputs">
        ${A.map((a,o)=>`<label>${r[o]} <input data-count="${a}" data-count-poll="${t}" type="text" inputmode="numeric" value="${n[a]}" aria-label="${a} 선택 인원" autocomplete="off"></label>`).join("")}
      </div>
      <div class="poll-helpers">
        <button type="button" data-action="fill-zeros" data-target-poll="${t}" class="secondary-btn">빈 칸 0으로 채우기</button>
        <button type="button" data-action="fill-sample" data-target-poll="${t}" class="secondary-btn">예시 인원 채우기</button>
      </div>
      <p class="class-poll-status" data-status-poll="${t}" role="status">${it(t)}</p>
    </div>
  </details>`}function Et(){const t=k(),[e,s]=t.denominators.first;return`
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${Q().map(r=>{const a=r.id===D;return`<button type="button" data-unit-id="${r.id}" class="unit-card-btn ${a?"unit-card-active":""}" aria-pressed="${a}">
      <strong>${r.title}</strong>
      <span>${r.description}</span>
    </button>`}).join("")}
    </div>

    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${e}과 1/${s} 비교</h2>
      <p class="question-lead">크기가 똑같은 두 전체에서 <strong>1/${e}</strong> 한 조각과 <strong>1/${s}</strong> 한 조각 중 어느 쪽이 더 클까요?</p>
      ${rt(e,s)}
      ${U("first",e,s)}
      ${z("first",e,s)}

      <div class="reason-section">
        <h3>💭 왜 그렇게 생각했나요? (내 생각과 가장 비슷한 말풍선 고르기)</h3>
        <div class="actions reason-bubble-list">
          ${mt.map((r,a)=>`<button type="button" data-reason="${a}" class="reason-bubble-btn" aria-label="${r}" aria-pressed="${P===String(a)}">
              <span class="student-bubble">${tt[a]}</span>
            </button>`).join("")}
        </div>
        ${j?`<p class="ai-linked-badge">🤖 로컬 AI 추천 탐구 연결됨: <strong>${j}</strong></p>`:""}
      </div>

      ${W("first",e,s)}

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn">② 직접 실험하러 가기 →</button>
      </div>
    </div>`}function at(t){const e=t<c?">":t>c?"<":"=",s=t<c?`${t}등분 한 조각이 ${c}등분 한 조각보다 더 큽니다`:t>c?`${c}등분 한 조각이 ${t}등분 한 조각보다 더 큽니다`:"두 조각의 크기가 같습니다";return{barsHtml:`${T(t)}${T(c)}`,badgeHtml:`크기 비교: <strong>1/${t} ${e} 1/${c}</strong> (${s})`,discoveryHtml:N?'<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>':""}}function ot(){const[t]=k().denominators.first,{barsHtml:e,badgeHtml:s,discoveryHtml:n}=at(t),r=f.querySelector("#explore-exp2-bars");r&&(r.innerHTML=e);const a=f.querySelector("#explore-denom-output");a&&(a.textContent=`${c}등분 (1/${c})`);const o=f.querySelector("#explore-slider");o&&o.value!==String(c)&&(o.value=String(c));const l=f.querySelector('button[data-action="less"]');l&&(l.disabled=c<=F);const u=f.querySelector('button[data-action="more"]');u&&(u.disabled=c>=L);const i=f.querySelector("#explore-cmp-badge");i&&(i.innerHTML=s);const d=f.querySelector("#explore-discovery-2");d&&(d.innerHTML=n)}function it(t){const e=h[t]??X(),s=Y(y),n=s?R(e,s):null;return n?`집계 완료: 정답(A) ${n.counts.A}/${s}명 · 미응답 ${n.noResponse}명`:"학급 인원 집계를 기록하려면 숫자를 입력하세요."}function At(){const[t,e]=k().denominators.first,s=C(m.first,t,e),n=P!==""?tt[Number(P)]:"내 처음 생각을 직접 실험으로 확인해 볼까요?",r=600/t,a=600/e,{barsHtml:o,badgeHtml:l,discoveryHtml:u}=at(t);return`
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 두 가지 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>나의 처음 생각</strong>: <strong>${s}</strong></p>
        <p class="hypothesis-sub">${n}</p>
      </div>

      <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
        <h3>실험 1 · 가위로 잘라 두 조각을 포개어 대어 보기</h3>
        <p>1/${t} 조각과 1/${e} 조각의 왼쪽 끝을 똑같이 맞추어 겹쳐 볼까요?</p>
        <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${M}">
          ${M?"✂️ 포개어 비교한 결과 닫기":"✂️ 1/"+t+" 조각과 1/"+e+" 조각 포개어 비교하기"}
        </button>

        ${M?`
          <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
            <svg viewBox="0 0 600 82" role="img" aria-label="1/${t} 조각과 1/${e} 조각을 겹쳐 길이를 비교한 그림">
              <rect x="0" y="8" width="600" height="66" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <rect x="0" y="12" width="${r.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(540,r+8).toFixed(2)}" y="30" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${t} 한 조각</text>
              <rect x="0" y="44" width="${a.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(540,a+8).toFixed(2)}" y="62" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${e} 한 조각</text>
              <line x1="${a.toFixed(2)}" y1="8" x2="${a.toFixed(2)}" y2="74" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
            </svg>
            <p class="answer">💡 <strong>발견 1</strong>: 왼쪽 끝을 맞추어 포개어 보니, 덜 나눈 <strong>1/${t}</strong> 조각이 <strong>1/${e}</strong> 조각보다 확실히 더 깁니다!</p>
          </div>
        `:""}
      </section>

      <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
        <h3>실험 2 · 나누는 조각 수(분모)를 2~12 사이에서 직접 바꿔 보기</h3>
        <p>아래 슬라이더나 <strong>− / ＋</strong> 버튼을 움직여 전체를 더 많이 나눌 때 한 조각이 어떻게 변하는지 관찰해 보세요.</p>

        <div id="explore-exp2-bars" class="bar-pair">${o}</div>

        <div class="slider-experiment-controls">
          <button type="button" data-action="less" ${c<=F?"disabled":""} aria-label="등분 수 줄이기">−</button>
          <input id="explore-slider" type="range" min="${F}" max="${L}" value="${c}" aria-label="나누는 조각 수 슬라이더">
          <output id="explore-denom-output" aria-live="polite">${c}등분 (1/${c})</output>
          <button type="button" data-action="more" ${c>=L?"disabled":""} aria-label="등분 수 늘리기">＋</button>
        </div>

        <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${l}</p>
        <div id="explore-discovery-2" aria-live="polite">${u}</div>
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`}function Mt(){const[t,e]=k().denominators.first,[s,n]=k().denominators.transfer;return`
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 실험 후 내 생각 확인과 응용</h2>

      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기: 1/${t}과 1/${e} 중 어느 쪽이 더 클까요?</h3>
        <p class="first-memory-tag">💭 1단계에서 고른 내 처음 생각: <strong>${C(m.first,t,e)}</strong></p>
        ${U("again",t,e)}
        ${z("again",t,e)}
        ${W("again",t,e)}
      </section>

      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 한 걸음 더! 새로운 문제: 같은 전체에서 <strong>1/${s}</strong>과 <strong>1/${n}</strong> 중 어느 쪽이 더 클까요?</h3>
        ${rt(s,n,!0)}
        ${U("transfer",s,n)}
        ${z("transfer",s,n)}
        ${W("transfer",s,n)}
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`}function St(){const t=k(),[e,s]=t.denominators.first,[n,r]=t.denominators.transfer,a=S?"작아집니다!":"______",o=m.again==="A",l=m.transfer==="A",u=o&&l?"🏆 최고예요! 직접 실험을 통해 단위분수의 크기 비교 원리를 완벽하게 내 것으로 만들었어요!":o||l?"🌟 참 잘했어요! 실험을 통해 같은 전체를 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!":"🌱 끝까지 스스로 실험하고 생각하며 단위분수의 비밀을 탐구했어요!",i=Y(y),d=i&&h.first?R(h.first,i):null,x=i&&h.again?R(h.again,i):null,v=d&&x&&i?`<p class="comparison">👩‍🏫 <strong>학급 전체 집계 변화</strong>: 정답(1/${e}) 선택 인원이 <strong>${d.counts.A}/${i}명</strong>에서 <strong>${x.counts.A}/${i}명</strong>으로 바뀌었습니다 (${G(d.counts.A,x.counts.A,i)>=0?"+":""}${G(d.counts.A,x.counts.A,i).toFixed(1)}%p).</p>`:"";return`
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 내 생각의 성장 카드</h2>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${u}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 내 생각 (1/${e} vs 1/${s})</span>
            <strong>${C(m.first,e,s)}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${o?"journey-correct":""}">
            <span class="journey-label">② 실험 후 내 생각 (1/${e} vs 1/${s})</span>
            <strong>${C(m.again,e,s)} ${o?"⭐":""}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${l?"journey-correct":""}">
            <span class="journey-label">③ 응용 문제 (1/${n} vs 1/${r})</span>
            <strong>${C(m.transfer,n,r)} ${l?"⭐":""}</strong>
          </div>
        </div>
        ${v}
      </div>

      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>📝 오늘 내가 발견한 단위분수의 규칙</h3>
        <div class="notebook-line">
          <p>"크기가 같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${a} ]</strong>"</p>
          <button type="button" data-action="toggle-notebook-blank" class="secondary-btn" aria-pressed="${S}">
            ${S?"빈칸 다시 가리기":"정답 빈칸 채우기"}
          </button>
        </div>
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄하기</button>
        <button type="button" data-action="restart" class="primary-next-btn">🔄 처음부터 다른 단원 해보기</button>
      </div>
    </div>`}function Ct(){switch(g){case"think":return Et();case"explore":return At();case"check":return Mt();case"result":return St()}}function Pt(){const t=st(),e=nt();return`<header>
    <p class="eyebrow">${et?"로컬 AI 보조 수업":"초등 수학 분수 탐구"} · 단위분수 크기 비교</p>
    <h1>생각의 갈림길 AI</h1>
    <p>직접 나누고 겹쳐 보며 분수의 크기를 스스로 깨닫는 4단계 탐구</p>
    <div class="header-controls">
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${e}" type="button">${e?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${t}" type="button">${t?"☀️":"🌙"}</button>
    </div>
  </header>`}function Bt(){const t=$.indexOf(g);return`<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${$.map((e,s)=>{const n=s<t,r=s===t;return`<button type="button" class="${n?"step-pill done":r?"step-pill current":"step-pill"}" data-step-index="${s}" aria-current="${r?"step":"false"}">${q[e]}</button>`}).join("")}
    </div>
  </nav>`}function p(t=!1){g!=="check"&&(b==="numberline"||b==="cup")&&(b="bar");const e=q[g];if(f.innerHTML=[Pt(),Bt(),`<section id="step" role="region" aria-label="${e}">${Ct()}<p id="error" role="alert">${E}</p></section>`,'<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>',"<footer>이 화면의 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>"].join(""),H?.sync(g==="think"),t){f.querySelector("#step h2")?.focus();const s=f.querySelector("#step-announce");s&&(s.textContent=`${q[g]} 단계로 이동했습니다.`)}}function J(){f.querySelectorAll(".class-poll-status[data-status-poll]").forEach(t=>{const e=t.dataset.statusPoll;t.textContent=it(e)}),f.querySelectorAll("input[data-participants-input]").forEach(t=>{t!==document.activeElement&&t.value!==y&&(t.value=y)})}f.addEventListener("toggle",t=>{const e=t.target;e instanceof HTMLDetailsElement&&e.classList.contains("class-poll-details")&&(w=e.open)},!0);f.addEventListener("input",t=>{const e=t.target;if(e.id==="explore-slider"){c=Number(e.value),N=!0,ot();return}if(e.id==="participants"||e.dataset.participantsInput){y=e.value,w=!0,J();return}if(e.dataset.count&&e.dataset.countPoll){const s=e.dataset.countPoll,n=e.dataset.count;h[s]??=X(),h[s][n]=e.value,w=!0,J()}});window.addEventListener("keydown",t=>{if(!t.altKey)return;const e=document.activeElement?.tagName;if(e==="INPUT"||e==="TEXTAREA")return;const s=$.indexOf(g);t.key==="ArrowRight"&&s<$.length-1?(t.preventDefault(),g=$[s+1],p(!0)):t.key==="ArrowLeft"&&s>0&&(t.preventDefault(),g=$[s-1],p(!0))});f.addEventListener("click",t=>{const e=t.target.closest("button");if(!e)return;if(e.id==="theme-toggle"){const n=st()?"light":"dark";document.documentElement.setAttribute("data-theme",n),e.textContent=n==="dark"?"☀️":"🌙",e.setAttribute("aria-pressed",String(n==="dark"));return}if(e.id==="scale-toggle"){const n=nt()?"normal":"large";document.documentElement.setAttribute("data-scale",n),e.textContent=n==="large"?"🔍 기본":"🔍 큰글씨",e.setAttribute("aria-pressed",String(n==="large"));return}if(e.dataset.stepIndex!==void 0){const n=Number(e.dataset.stepIndex);Number.isInteger(n)&&n>=0&&n<$.length&&(g=$[n],E="",p(!0));return}if(e.dataset.unitId){D=e.dataset.unitId,I(!0);return}if(e.dataset.pickPoll&&e.dataset.pickChoice){const n=e.dataset.pickPoll,r=e.dataset.pickChoice;m[n]=r,E="",p();return}if(e.dataset.reason!==void 0){P=e.dataset.reason,j="",p();return}const s=e.dataset.action;if(s==="toggle-model")b=b==="circle"?"bar":"circle",p();else if(s==="toggle-numberline")b=b==="numberline"?"bar":"numberline",p();else if(s==="toggle-cup")b=b==="cup"?"bar":"cup",p();else if(s==="toggle-overlap")M=!M,p();else if(s==="less"||s==="more")c=Math.max(F,Math.min(L,c+(s==="more"?1:-1))),N=!0,ot();else if(s==="toggle-notebook-blank")S=!S,p();else if(s==="fill-zeros"){const n=e.dataset.targetPoll||"first";h[n]??=X();for(const r of A)h[n][r].trim()===""&&(h[n][r]="0");w=!0,p()}else if(s==="fill-sample"){const n=e.dataset.targetPoll||"first",r=Y(y)??20,a=Math.round(n==="first"?r*.4:r*.8),o=Math.round(n==="first"?r*.45:r*.1),l=Math.round(r*.05),u=Math.max(0,r-a-o-l);h[n]={A:String(a),B:String(o),C:String(l),D:String(u)},w=!0,p()}else if(s==="next"){const n=$.indexOf(g);n<$.length-1&&(g=$[n+1],E="",p(!0))}else if(s==="back"){const n=$.indexOf(g);n>0&&(g=$[n-1],E="",p(!0))}else s==="print-summary"?window.print():s==="restart"&&(I(),window.scrollTo?.({top:0}))});window.addEventListener("pagehide",()=>I());window.addEventListener("pageshow",t=>{t.persisted&&I()});c=k().denominators.first[1];p();et&&bt(async()=>{const{createLessonAiPanel:t}=await import("./lesson-ai-panel-D2jl9MuX.js");return{createLessonAiPanel:t}},__vite__mapDeps([0,1,2])).then(({createLessonAiPanel:t})=>{H=t(f,(e,s)=>{P=e==="A"?"0":e==="B"?"1":"2",j=s,p()}),H.sync(g==="think")});
