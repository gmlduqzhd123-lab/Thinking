/**
 * 프로젝트 전체에서 사용하는 상수 중앙 관리.
 * 매직 넘버를 코드 전체에 흩뿌리지 않고 이 파일에서 관리합니다.
 */

/** AI 추론 요청 제한 시간 (ms). */
export const INFERENCE_TIMEOUT_MS = 10_000;

/** 교사 입력 최대 글자 수. */
export const MAX_QUERY_LENGTH = 160;

/** 참여 인원 허용 범위. */
export const MIN_PARTICIPANTS = 1;
export const MAX_PARTICIPANTS = 60;

/** 분수 막대 등분 수 허용 범위. */
export const DENOMINATOR_MIN = 2;
export const DENOMINATOR_MAX = 12;

/** 수업 타이머 갱신 주기 (ms). */
export const TIMER_INTERVAL_MS = 250;

/** 타이머 연장 시간 (초). */
export const TIMER_EXTEND_SECONDS = 300;

/** 수업 기본 시간 (분). */
export const DEFAULT_MINUTES = 20;

/** 수업 시간 선택지 (분). */
export const MINUTES_OPTIONS = [10, 20, 40] as const;
