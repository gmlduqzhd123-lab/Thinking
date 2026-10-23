/**
 * 에러 분류 체계.
 * Worker, 모델, WASM, 네트워크 등 에러를 구조화합니다.
 */

export type ErrorCode =
  | 'WORKER_INIT'
  | 'MODEL_DOWNLOAD'
  | 'WASM_UNSUPPORTED'
  | 'INFERENCE_TIMEOUT'
  | 'CONTRACT_MISMATCH'
  | 'NETWORK'
  | 'UNKNOWN';

/** 사용자 친화적 에러 메시지. */
export const errorMessages: Record<ErrorCode, string> = {
  WORKER_INIT: 'Web Worker를 시작하지 못했습니다. 브라우저를 새로 고침해 주세요.',
  MODEL_DOWNLOAD: '모델 파일을 불러오지 못했습니다. 네트워크를 확인해 주세요.',
  WASM_UNSUPPORTED: '이 브라우저는 WebAssembly를 지원하지 않습니다. Chrome 또는 Edge를 사용해 주세요.',
  INFERENCE_TIMEOUT: '추론이 10초를 넘어 기본 탐구로 전환합니다. 기본 카드를 열어 주세요.',
  CONTRACT_MISMATCH: '모델과 카드 색인의 버전이 일치하지 않습니다. 기본 카드로 계속해 주세요.',
  NETWORK: '네트워크 연결이 끊어졌습니다. 연결 후 다시 시도해 주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다. 기본 카드로 계속할 수 있습니다.',
};

/** WASM 지원 여부를 검사합니다. */
export function checkWasmSupport(): boolean {
  try {
    return typeof WebAssembly === 'object'
      && typeof WebAssembly.instantiate === 'function';
  } catch {
    return false;
  }
}

/** 에러 코드에서 사용자 메시지를 반환합니다. */
export function getUserMessage(code: ErrorCode): string {
  return errorMessages[code] ?? errorMessages.UNKNOWN;
}
