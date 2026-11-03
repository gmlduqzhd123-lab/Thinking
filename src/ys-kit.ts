// 📲 앱 설치 · 📱 QR로 접속 — 엽쌤의 다른 앱과 같은 상단 버튼 (패들렛 정리함 방식을 옮김)
// CSP(script-src·style-src 'self')를 지키려고 인라인 스타일 없이 <dialog>와 lesson.css 클래스만 쓴다.
// 브라우저 정보만 읽고, 캐시·localStorage 등 기기 저장소는 쓰지 않는다 (CLAUDE.md 보호 규칙).

export type InstallEnv = { kind: string; ios: boolean; samsung?: boolean };
export type InstallGuide = { lead: string | null; external: string | null; steps: string[]; note: string | null };

export function installEnvironment({ userAgent: ua, platform, maxTouchPoints }: { userAgent: string; platform: string; maxTouchPoints: number }): InstallEnv {
  const ios = /iphone|ipad|ipod/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  if (/KAKAOTALK/i.test(ua)) return { kind: "kakao", ios };
  if (/NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp|; wv\)/i.test(ua)) return { kind: "in-app", ios };
  if (ios) return { kind: /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|Whale/i.test(ua) ? "ios-safari" : "ios-other", ios };
  if (/android/i.test(ua)) return { kind: "android", ios, samsung: /SamsungBrowser/i.test(ua) };
  if (/Firefox/i.test(ua)) return { kind: "firefox", ios };
  if (/Safari/i.test(ua) && !/Chrome|Chromium|Edg/i.test(ua)) return { kind: "mac-safari", ios };
  return { kind: "desktop", ios };
}

export function installGuide(env: InstallEnv): InstallGuide {
  const browser = env.ios ? "Safari" : "다른 브라우저";
  switch (env.kind) {
    case "kakao":
      return {
        lead: `카카오톡 안에서 연 화면에서는 앱을 설치할 수 없어요. 아래 버튼으로 ${env.ios ? "Safari" : "인터넷 브라우저"}에서 다시 열어 주세요.`,
        external: env.ios ? "Safari로 열기" : "브라우저로 열기",
        steps: [],
        note: `버튼이 안 되면 카카오톡 화면의 ⋮ 메뉴에서 ‘${browser}로 열기’를 누른 뒤 앱 설치를 다시 눌러 주세요.`,
      };
    case "in-app":
      return { lead: "이 앱(인앱 브라우저) 안에서는 설치할 수 없어요.", external: null, steps: ["화면의 ⋮ 또는 ⋯ 메뉴를 누르세요.", `‘${browser}로 열기’를 누르세요.`, "열린 화면에서 앱 설치를 다시 눌러 주세요."], note: null };
    case "ios-safari":
      return { lead: null, external: null, steps: ["Safari 아래쪽(아이패드는 위쪽) 공유 버튼(□↑)을 누르세요.", "목록을 내려 ‘홈 화면에 추가’를 누르세요.", "오른쪽 위 ‘추가’를 누르면 홈 화면에 아이콘이 생겨요."], note: null };
    case "ios-other":
      return { lead: "아이폰·아이패드는 Safari에서 설치하는 것이 가장 확실해요.", external: null, steps: ["이 주소를 Safari에서 열어 주세요.", "아래쪽 공유 버튼(□↑)을 누르세요.", "‘홈 화면에 추가’ → ‘추가’를 누르세요."], note: null };
    case "android":
      return { lead: null, external: null, steps: [`브라우저 ${env.samsung ? "아래쪽 ≡ 메뉴" : "오른쪽 위 ⋮ 메뉴"}를 누르세요.`, "‘앱 설치’ 또는 ‘홈 화면에 추가’를 누르세요.", "‘설치(추가)’를 누르면 홈 화면에 아이콘이 생겨요."], note: "메뉴에 설치 항목이 없으면 크롬이나 삼성 인터넷으로 열어 주세요." };
    case "firefox":
      return { lead: "파이어폭스는 앱 설치를 지원하지 않아요. 크롬이나 엣지로 이 주소를 열고 다시 눌러 주세요.", external: null, steps: [], note: null };
    case "mac-safari":
      return { lead: null, external: null, steps: ["Safari 메뉴 막대의 ‘파일’ 메뉴(또는 공유 버튼)를 누르세요.", "‘Dock에 추가’를 누르세요."], note: null };
    default:
      return { lead: null, external: null, steps: ["주소창 오른쪽의 설치 아이콘(⊕ 또는 🖥️)을 누르세요.", "안 보이면 오른쪽 위 ⋮ 메뉴 → ‘앱 설치’(엣지는 ⋯ → 앱 → ‘이 사이트를 앱으로 설치’)를 누르세요."], note: "이미 설치했다면 바탕화면이나 시작 메뉴에서 열 수 있어요." };
  }
}

/** 카카오톡에서 같은 화면을 기본 브라우저로 여는 주소. 해시·검색어를 빼서 자료가 섞이지 않게 한다. */
export function kakaoOpenExternalUrl(pageUrl: string): string {
  const url = new URL(pageUrl);
  url.hash = "";
  url.search = "";
  return `kakaotalk://web/openExternal?url=${encodeURIComponent(url.href)}`;
}

const PAGE_URL = 'https://gmlduqzhd123-lab.github.io/Thinking/';
type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };
let deferred: PromptEvent | null = null;

function standalone(): boolean {
  return window.matchMedia?.('(display-mode: standalone)').matches === true || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

function makeDialog(id: string, title: string): HTMLDialogElement {
  const dialog = el('dialog', 'ys-dialog');
  dialog.id = id;
  dialog.setAttribute('aria-labelledby', `${id}-title`);
  const h = el('h2', '', title);
  h.id = `${id}-title`;
  dialog.append(h);
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  return dialog;
}

function closeButton(dialog: HTMLDialogElement): HTMLButtonElement {
  const close = el('button', 'ys-dialog-close', '닫기');
  close.type = 'button';
  close.addEventListener('click', () => dialog.close());
  return close;
}

function qrDialog(): HTMLDialogElement {
  const existing = document.getElementById('ys-qr-dialog');
  if (existing instanceof HTMLDialogElement) return existing;
  const dialog = makeDialog('ys-qr-dialog', '📱 카메라로 찍어서 들어와요');
  const img = el('img', 'ys-qr-image');
  img.src = `${import.meta.env.BASE_URL}qr.svg`;
  img.alt = '생각의 갈림길 AI 주소 QR 코드';
  img.width = 420;
  img.height = 420;
  dialog.append(el('p', 'ys-dialog-sub', '생각의 갈림길 AI'), img, el('p', 'ys-qr-url', PAGE_URL.replace(/^https?:\/\//, '')),
    el('p', 'ys-dialog-sub', '휴대폰·태블릿 카메라를 QR 코드에 비추면 바로 열려요.'), closeButton(dialog));
  document.body.append(dialog);
  return dialog;
}

function installDialog(guide: InstallGuide): HTMLDialogElement {
  document.getElementById('ys-install-dialog')?.remove();
  const dialog = makeDialog('ys-install-dialog', '📲 앱으로 설치하기');
  if (guide.lead) dialog.append(el('p', 'ys-dialog-sub', guide.lead));
  if (guide.external) {
    const a = el('a', 'ys-dialog-close', guide.external);
    a.href = kakaoOpenExternalUrl(location.href);
    dialog.append(a);
  }
  if (guide.steps.length) {
    const ol = el('ol', 'ys-install-steps');
    ol.append(...guide.steps.map(text => el('li', '', text)));
    dialog.append(ol);
  }
  if (guide.note) dialog.append(el('p', 'ys-dialog-sub', guide.note));
  dialog.append(closeButton(dialog));
  document.body.append(dialog);
  return dialog;
}

export function installHidden(): boolean {
  return typeof window !== 'undefined' && standalone();
}

export async function openInstall(): Promise<void> {
  if (deferred) {
    const event = deferred;
    deferred = null;
    await event.prompt();
    try { await event.userChoice; } catch { /* 창을 닫아도 앱은 그대로 동작 */ }
    return;
  }
  installDialog(installGuide(installEnvironment(navigator))).showModal();
}

export function openQr(): void {
  qrDialog().showModal();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferred = event as PromptEvent; });
  window.addEventListener('appinstalled', () => { deferred = null; });
}
