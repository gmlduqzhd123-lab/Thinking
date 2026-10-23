/**
 * Service Worker — 오프라인 지원.
 * 앱 셸은 Cache-First, 모델 파일은 StaleWhileRevalidate.
 * 이 파일은 public/에 위치하며 Vite가 그대로 복사합니다.
 */

const CACHE_NAME = 'thinking-forks-v1';
const APP_SHELL = [
  './',
  './index.html',
  './lesson.html',
];

// 설치: 앱 셸 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// 활성화: 이전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// 가져오기: 전략 분기
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 모델/WASM 파일: StaleWhileRevalidate
  if (url.pathname.includes('/models/') || url.pathname.includes('/wasm/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 앱 셸 및 정적 자산: Cache-First
  if (event.request.mode === 'navigate' || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached || fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
      )
    );
    return;
  }

  // 기타 요청: 네트워크 우선
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
