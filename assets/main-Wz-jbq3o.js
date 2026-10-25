import{M as v,I as U}from"./constants-CYr9ulPU.js";import{e as H,c as D,a as W,m as Q,g as $,b as K,s as V,d as z}from"./errors-S67X06TO.js";const G=[{test:/전체.{0,8}(서로 다르|다르)|서로 다른 전체/,reason:"전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다."},{test:/더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아/,reason:"같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다."},{test:/모르겠|정보가 없|알 수 없/,reason:"설명 정보가 부족해 이유를 더 확인해야 합니다."}],f={minSimilarity:.48,minMargin:.045};function B(e,n="",r){const s=r?.minSimilarity??f.minSimilarity,o=r?.minMargin??f.minMargin,i=[...e].sort((p,I)=>I.similarity-p.similarity);for(const p of G)if(p.test.test(n))return{hold:!0,reason:p.reason,scores:i};return!i.length||i[0].similarity<s?{hold:!0,reason:"관련성이 낮습니다.",scores:i}:i.length>1&&i[0].similarity-i[1].similarity<o?{hold:!0,reason:"후보의 의미가 서로 가깝습니다.",scores:i}:{hold:!1,reason:"",scores:i}}const X=document.querySelector("#app"),t=e=>document.getElementById(e);let h,M=0,C=0,k=!1,x,d=f.minSimilarity,c=f.minMargin,g,E;function a(e){t("state").textContent=`모델 상태: ${e}`}function l(e){g=void 0;const n=t("result");n.removeAttribute("data-hold"),n.textContent=e}function S(){x&&clearTimeout(x),x=void 0}function u(){S(),h?.terminate(),h=void 0,k=!1,t("infer").disabled=!0,t("cancel").disabled=!0;const e=document.getElementById("batch-eval");e&&(e.disabled=!0)}function m(){C++,M++,S()}function Y(e,n){const r=t("progress"),s=t("progress-fill"),o=t("progress-text");if(!r||!s||!o)return;r.hidden=!1,s.style.width=`${e}%`,s.setAttribute("aria-valuenow",String(e));const i=n&&n.split("/").pop()||"";o.textContent=i?`${i} · ${e}%`:`${e}%`}function b(){const e=document.getElementById("progress");e&&(e.hidden=!0)}function J(){const e=document.documentElement.getAttribute("data-theme")==="dark",n=document.documentElement.getAttribute("data-scale")==="large";return`<header>
    <p class="eyebrow">초등 수학 탐구 · 로컬 AI 카드 추천</p>
    <h1>생각의 갈림길 AI</h1>
    <p>정답을 알려 주는 AI가 아니라, 생각을 바꾸는 탐구를 돕는 AI</p>
    <div class="header-controls">
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${n}" type="button">${n?"🔍 기본":"🔍 큰글씨"}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${e}" type="button">${e?"☀️":"🌙"}</button>
    </div>
  </header>`}function Z(){return`<section class="notice">
    <strong>단위분수 크기 비교 · 로컬 AI 탐구 지원</strong>
    <p>길이가 같은 두 리본에서 1/3과 1/5 한 조각을 비교합니다.
       학생 개인정보 없이 수학 개념 설명을 입력하면 알맞은 탐구 카드를 추천합니다.</p>
  </section>`}function ee(){return`<section>
    <h2>개념 설명 입력</h2>
    <label for="query">학생 이름·번호·개인 사정 없이 수학 개념상의 혼동만 적어 주세요.</label>
    <textarea id="query" maxlength="${v}" rows="3"
      placeholder="예: 분모가 커지면 한 조각도 커진다고 생각해요."></textarea>
    <p id="count">0/${v}자</p>
    <p class="hint">개인정보 필터는 보조 장치이며 완전한 익명화를 보장하지 않습니다.</p>
    <div class="buttons">
      <button id="prepare">모델 준비</button>
      <button id="infer" disabled>추천 실행</button>
      <button id="cancel" disabled>취소</button>
      <button id="reset">초기화</button>
      <button id="basic">기본 카드 보기</button>
      <button id="close">종료</button>
    </div>
    <p id="state" role="status">모델 상태: 미준비</p>
    <div id="progress" class="progress-container" hidden>
      <div class="progress-track">
        <div id="progress-fill" class="progress-fill" role="progressbar"
          aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="width: 0%"></div>
      </div>
      <p id="progress-text" class="progress-text"></p>
    </div>
    <p id="timing"></p>
  </section>`}function te(){return`<section id="result" aria-live="polite">
    <h2>결과</h2>
    <p>모델 준비 후 일반적인 개념 설명을 입력해 주세요.</p>
  </section>`}function ne(){return`<section>
    <h2>예시 질문 모음</h2>
    <p>자주 나오는 학생 생각 예시를 눌러 바로 테스트해 볼 수 있습니다.</p>
    <ul id="examples"></ul>
    <div class="benchmark-panel" role="region" aria-label="임계값 시뮬레이터 및 일괄 검증">
      <h3>임계값 시뮬레이터 &amp; 일괄 검증</h3>
      <div class="slider-group">
        <label for="threshold-sim">최소 유사도 (<output id="threshold-sim-val">${d.toFixed(2)}</output>)
          <input id="threshold-sim" type="range" min="0.20" max="0.80" step="0.01" value="${d}">
        </label>
        <label for="threshold-margin">최소 격차 (<output id="threshold-margin-val">${c.toFixed(3)}</output>)
          <input id="threshold-margin" type="range" min="0.000" max="0.200" step="0.005" value="${c}">
        </label>
      </div>
      <div class="buttons">
        <button id="threshold-reset" type="button" class="secondary-btn">임계값 초기화</button>
        <button id="batch-eval" type="button" disabled>가상 질의 일괄 검증</button>
      </div>
      <div id="batch-table-container" aria-live="polite"></div>
    </div>
  </section>`}function re(){return"<footer>입력과 결과는 실행 메모리에만 둡니다. 유사도는 정답 확률이나 학생 진단 정확도가 아닙니다.</footer>"}function se(){X.innerHTML=[J(),Z(),ee(),te(),ne(),re()].join("")}function _(e,n,r){const s=t("result");s.dataset.hold=String(e.hold),s.replaceChildren();const o=document.createElement("h2");o.textContent=e.hold?"이유를 더 확인해야 합니다":"AI 의미 비교 후보 · 교사 검토",s.append(o);const i=document.createElement("p");i.textContent=e.hold?e.reason:"탐구 카드의 의미 유사도 순서입니다. 교사 확인 후 수업에 활용합니다.",s.append(i);const p=document.createElement("ol");p.className="score-list";for(const A of e.scores){const R=W.find(P=>P.id===A.id),y=document.createElement("li");y.dataset.cardId=R.id;const T=document.createElement("span");T.className="score-label",T.textContent=R.title,y.append(T);const N=document.createElement("div");N.className="similarity-track";const w=document.createElement("div");w.className="similarity-fill",w.style.width=`${Math.max(0,Math.min(100,A.similarity*100))}%`,N.append(w),y.append(N);const L=document.createElement("span");L.className="score-value",L.textContent=A.similarity.toFixed(3),y.append(L),p.append(y)}s.append(p);const I=document.createElement("p");I.textContent=`기본 키워드 검색: ${K(n)} · 준비 후 추론 ${Math.round(r)}ms`,s.append(I)}function ie(){g=void 0;const e=t("result");e.removeAttribute("data-hold"),e.replaceChildren();const n=document.createElement("h2");n.textContent="기본 탐구 카드",e.append(n);const r=document.createElement("ul");W.forEach(s=>{const o=document.createElement("li");o.textContent=`${s.title}: ${s.text}`,r.append(o)}),e.append(r)}function j(e,n){const r=document.getElementById("batch-table-container");if(!r)return;const s=e.filter(i=>i.pass).length,o=typeof n=="number"&&n>0?` · ${Math.round(n)}ms`:"";r.innerHTML=`
    <p class="batch-summary">일괄 검증 결과: <strong>${s}/${e.length}건 기대값 일치</strong> (최소 유사도 ${d.toFixed(2)}, 최소 격차 ${c.toFixed(3)}${o})</p>
    <div class="table-scroll">
      <table class="batch-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>기대값</th>
            <th>판정</th>
            <th>일치</th>
            <th>최고 유사도</th>
            <th>1·2위 격차</th>
          </tr>
        </thead>
        <tbody>
          ${e.map(i=>`<tr class="${i.pass?"batch-row-pass":"batch-row-fail"}">
            <td>${i.id}</td>
            <td>${i.expected}</td>
            <td>${i.predicted}</td>
            <td>${i.pass?"✅":"⚠️"}</td>
            <td>${i.topSimilarity.toFixed(3)}</td>
            <td>${i.margin.toFixed(3)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`}function q(){const e={minSimilarity:d,minMargin:c};if(g){const n=B(g.scores,g.queryText,e);_(n,g.queryText,g.inferMs)}if(E){const n=E.map(r=>{const s=B(r.scores,r.text,e),o=s.hold?"hold":s.scores[0]?.id??"hold";return{...r,predicted:o,pass:o===r.expected,reason:s.reason}});E=n,j(n)}}function F(){d=f.minSimilarity,c=f.minMargin,E=void 0;const e=document.getElementById("threshold-sim"),n=document.getElementById("threshold-margin"),r=document.getElementById("threshold-sim-val"),s=document.getElementById("threshold-margin-val"),o=document.getElementById("batch-table-container");e&&(e.value=String(d)),n&&(n.value=String(c)),r&&(r.textContent=d.toFixed(2)),s&&(s.textContent=c.toFixed(3)),o&&o.replaceChildren()}function oe(){u(),h=new Worker(new URL("/Thinking/assets/ai.worker-FgzQgApa.js",import.meta.url),{type:"module"}),h.onmessage=({data:e})=>{if(!(e.requestId!==M||e.sessionRevision!==C)){if(e.type==="progress"&&typeof e.percent=="number"){Y(e.percent,e.file||"");return}if((e.type==="ready"||e.type==="result"||e.type==="batch-result")&&e.contract!==Q){m(),u(),b(),a("실패"),l("모델과 카드 색인의 버전이 일치하지 않습니다. 기본 카드로 계속해 주세요.");return}if(e.type==="ready")k=!0,t("infer").disabled=!1,t("batch-eval").disabled=!1,t("cancel").disabled=!0,b(),a("준비됨"),t("timing").textContent=[`모델 준비 전체 ${Math.round(e.prepareMs||0)}ms`,`파일 로딩 ${Math.round(e.downloadMs||0)}ms`,`초기화 ${Math.round(e.initMs||0)}ms`,`카드 색인 ${Math.round(e.indexedMs||0)}ms`,"(브라우저 로컬 측정)"].join(" · ");else if(e.type==="result"&&e.result){S(),t("cancel").disabled=!0,t("infer").disabled=!1,t("batch-eval").disabled=!1,a("준비됨");const n=t("query").value,r=e.inferMs||0;g={scores:e.result.scores,queryText:n,inferMs:r},_(e.result,n,r)}else if(e.type==="batch-result"&&e.items)S(),t("cancel").disabled=!0,t("infer").disabled=!1,t("batch-eval").disabled=!1,a("준비됨"),E=e.items,j(e.items,e.batchMs||0);else if(e.type==="error"){u(),b(),a("실패");const n=e.errorCode??"UNKNOWN";l($(n))}}},h.onerror=()=>{u(),b(),a("실패"),l($("WORKER_INIT"))}}function ae(){if(!D()){l($("WASM_UNSUPPORTED")),a("실패");return}m(),oe(),a("준비 중"),l("같은 출처의 모델과 WASM을 준비하고 있습니다."),t("cancel").disabled=!1,h.postMessage({type:"prepare",requestId:M,sessionRevision:C})}function le(){const n=t("query").value.trim();if(!k||!n){l("설명을 입력하고 모델을 준비해 주세요.");return}if(V(n)){const r=z(n);l(`연락처·식별 번호${r?`(${r})`:""}로 보이는 입력은 사용할 수 없습니다. 일반적인 개념 설명만 적어 주세요.`);return}m(),a("추론 중"),t("infer").disabled=!0,t("batch-eval").disabled=!0,t("cancel").disabled=!1,l("의미를 비교하고 있습니다."),h.postMessage({type:"infer",requestId:M,sessionRevision:C,text:n,thresholds:{minSimilarity:d,minMargin:c}}),x=setTimeout(()=>{m(),u(),a("실패"),l($("INFERENCE_TIMEOUT"))},U)}function de(){!k||!h||(m(),a("추론 중"),t("infer").disabled=!0,t("batch-eval").disabled=!0,t("cancel").disabled=!1,h.postMessage({type:"batch-eval",requestId:M,sessionRevision:C,thresholds:{minSimilarity:d,minMargin:c}}),x=setTimeout(()=>{m(),u(),a("실패"),l($("INFERENCE_TIMEOUT"))},U*3))}function ce(){m(),u(),b(),a("취소"),l("요청을 취소했습니다. 기본 카드로 계속할 수 있습니다.")}function ue(){m(),u(),b(),F(),t("query").value="",t("count").textContent=`0/${v}자`,t("timing").textContent="",a("미준비"),l("초기화했습니다. 이전 결과는 사용할 수 없습니다.")}function me(){m(),u(),b(),F(),t("query").value="",t("count").textContent=`0/${v}자`,t("timing").textContent="",a("미준비"),l("종료했습니다. 수업 입력과 결과를 메모리에서 비웠습니다.")}function he(){const e=t("query"),n=t("result"),r=t("state"),s=n.hasAttribute("data-hold"),o=r.textContent?.includes("추론 중");t("count").textContent=`${e.value.length}/${v}자`,(s||o)&&m(),o&&(u(),a("취소")),(s||o)&&l("입력을 수정했습니다. 이전 추천은 무효입니다. 다시 실행해 주세요.")}function O(){m(),u(),b(),F(),t("query").value="",t("count").textContent=`0/${v}자`,t("timing").textContent="",a("미준비"),l("이전 입력과 추천을 지웠습니다. 모델을 다시 준비해 주세요.")}se();t("prepare").addEventListener("click",ae);t("infer").addEventListener("click",le);t("batch-eval").addEventListener("click",de);t("cancel").addEventListener("click",ce);t("reset").addEventListener("click",ue);t("close").addEventListener("click",me);t("basic").addEventListener("click",ie);t("query").addEventListener("input",he);t("threshold-sim").addEventListener("input",e=>{d=Number(e.target.value),t("threshold-sim-val").textContent=d.toFixed(2),q()});t("threshold-margin").addEventListener("input",e=>{c=Number(e.target.value),t("threshold-margin-val").textContent=c.toFixed(3),q()});t("threshold-reset").addEventListener("click",()=>{d=f.minSimilarity,c=f.minMargin,t("threshold-sim").value=String(d),t("threshold-margin").value=String(c),t("threshold-sim-val").textContent=d.toFixed(2),t("threshold-margin-val").textContent=c.toFixed(3),q()});t("theme-toggle").addEventListener("click",()=>{const e=document.documentElement,r=e.getAttribute("data-theme")==="dark"?"light":"dark";e.setAttribute("data-theme",r),t("theme-toggle").textContent=r==="dark"?"☀️":"🌙",t("theme-toggle").setAttribute("aria-pressed",String(r==="dark"))});t("scale-toggle").addEventListener("click",()=>{const e=document.documentElement,r=e.getAttribute("data-scale")==="large"?"normal":"large";e.setAttribute("data-scale",r),t("scale-toggle").textContent=r==="large"?"🔍 기본":"🔍 큰글씨",t("scale-toggle").setAttribute("aria-pressed",String(r==="large"))});const pe=t("examples");H.forEach(e=>{const n=document.createElement("li"),r=document.createElement("button");r.textContent=`${e.id}: ${e.text}`,r.addEventListener("click",()=>{const s=t("query");s.value=e.text,s.dispatchEvent(new Event("input"))}),n.append(r),pe.append(n)});window.addEventListener("pagehide",O);window.addEventListener("pageshow",e=>{e.persisted&&O()});
