import test from 'node:test';
import assert from 'node:assert/strict';
import { sensitive, detectSensitiveType } from '../src/privacy.ts';

test('phone numbers are detected as sensitive', () => {
  assert.equal(sensitive('010-1234-5678'), true);
  assert.equal(sensitive('01012345678'), true);
  assert.equal(sensitive('02-123-4567'), true);
  assert.equal(sensitive('031 234 5678'), true);
});

test('email addresses are detected as sensitive', () => {
  assert.equal(sensitive('teacher@example.com'), true);
  assert.equal(sensitive('user.name+tag@school.ac.kr'), true);
});

test('resident registration numbers are detected as sensitive', () => {
  assert.equal(sensitive('990101-1234567'), true);
  assert.equal(sensitive('9901011234567'), true);
});

test('student attendance numbers are detected as sensitive', () => {
  assert.equal(sensitive('3번 학생이 이렇게 말했어요'), true);
  assert.equal(sensitive('12번이 질문했어요'), true);
});

test('student name patterns are detected as sensitive', () => {
  assert.equal(sensitive('김철수 학생이 혼동합니다'), true);
  assert.equal(sensitive('박영희이가 잘 모르겠대요'), true);
  assert.equal(sensitive('이수진에게 물어봤어요'), true);
});

test('school name patterns are detected as sensitive', () => {
  assert.equal(sensitive('서울초등학교에서 수업합니다'), true);
  assert.equal(sensitive('강남초등 아이들이'), true);
});

test('grade-class patterns are detected as sensitive', () => {
  assert.equal(sensitive('3학년 2반 아이들이'), true);
});

test('normal math descriptions are not sensitive', () => {
  assert.equal(sensitive('분모가 커지면 한 조각도 커진다고 생각해요.'), false);
  assert.equal(sensitive('5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.'), false);
  assert.equal(sensitive('같은 길이를 더 많이 나누면 한 조각은 작아져요.'), false);
  assert.equal(sensitive('두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.'), false);
  assert.equal(sensitive(''), false);
});

test('edge cases for sensitive filter', () => {
  // Short numbers should not trigger
  assert.equal(sensitive('3과 5를 비교해요'), false);
  // Numbers within math context
  assert.equal(sensitive('1/3은 1/5보다 큽니다'), false);
});

test('detectSensitiveType returns correct type', () => {
  assert.equal(detectSensitiveType('010-1234-5678'), '전화번호');
  assert.equal(detectSensitiveType('test@example.com'), '이메일');
  assert.equal(detectSensitiveType('990101-1234567'), '주민등록번호');
  assert.equal(detectSensitiveType('3번 학생'), '출석번호');
  assert.equal(detectSensitiveType('김철수 학생이'), '학생 이름');
  assert.equal(detectSensitiveType('서울초등학교'), '학교 이름');
  assert.equal(detectSensitiveType('3학년 2반'), '학년·반');
  assert.equal(detectSensitiveType('분모가 크면 조각이 크다'), null);
});
