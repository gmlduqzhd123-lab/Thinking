/**
 * 단원 레지스트리.
 * UnitConfig를 등록·조회하여 멀티 단원 수업을 지원합니다.
 */
import type { UnitConfig } from './unit-types';

const registry = new Map<string, UnitConfig>();

/** 단원을 레지스트리에 등록합니다. */
export function registerUnit(config: UnitConfig): void {
  if (registry.has(config.id)) {
    throw new Error(`Unit "${config.id}" is already registered.`);
  }
  registry.set(config.id, config);
}

/** ID로 단원을 조회합니다. 미등록 시 에러. */
export function getUnit(id: string): UnitConfig {
  const unit = registry.get(id);
  if (!unit) {
    throw new Error(`Unit "${id}" not found. Registered: ${[...registry.keys()].join(', ')}`);
  }
  return unit;
}

/** 등록된 모든 단원 목록을 반환합니다. */
export function listUnits(): UnitConfig[] {
  return [...registry.values()];
}

/** 레지스트리를 비웁니다. 테스트용. */
export function clearRegistry(): void {
  registry.clear();
}
