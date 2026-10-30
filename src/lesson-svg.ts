import { fractionSegments } from './lesson-core';

export type VisualModel = 'bar' | 'circle' | 'numberline' | 'cup';

export interface SvgThemeContext {
  unitId: string;
  snackName: string;
  colors: { fill: string; bg: string; stroke: string };
  patternMode: boolean;
  visualModel: VisualModel;
}

export function miniFracSvg(denom: number): string {
  const w = Math.max(4, Math.round(34 / denom));
  return `<svg class="mini-frac-svg" viewBox="0 0 36 12" aria-hidden="true"><rect x="1" y="1" width="34" height="10" rx="2" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5"/><rect x="1" y="1" width="${w}" height="10" rx="1.5" fill="var(--lesson-bar-fill, #ffca62)"/></svg>`;
}

export function circleFractionSvg(denominator: number, undividedPreview: boolean, ctx: SvgThemeContext): string {
  const cx = 80;
  const cy = 80;
  const r = 60;
  const { fill, bg, stroke } = ctx.colors;

  if (undividedPreview) {
    const previewPattern = ctx.patternMode
      ? `<circle cx="${cx}" cy="${cy}" r="${r - 14}" fill="none" stroke="${stroke}" stroke-width="2" stroke-dasharray="4 4"/>`
      : '';
    return `<figure class="fraction fraction-circle ${ctx.patternMode ? 'pattern-active' : ''}"><svg data-svg-action="toggle-spoiler" tabindex="0" role="button" class="touchable-svg" viewBox="0 0 160 160" aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${denominator}명이 똑같이 나눌 예정)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="0.28" stroke="${stroke}" stroke-width="3" stroke-dasharray="6 4"/><circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-opacity="0.4"/>${previewPattern}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">✂️ 1/${denominator}은?</text></svg><figcaption><strong>1/${denominator}</strong> (${denominator}명 중 1조각)</figcaption></figure>`;
  }

  const angleStep = (2 * Math.PI) / denominator;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + angleStep;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = angleStep > Math.PI ? 1 : 0;
  const sectorPath = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  const midAngle = startAngle + angleStep / 2;
  const pepX = (cx + r * 0.52 * Math.cos(midAngle)).toFixed(2);
  const pepY = (cy + r * 0.52 * Math.sin(midAngle)).toFixed(2);
  const dividers = Array.from({ length: denominator }, (_, i) => {
    const a = startAngle + i * angleStep;
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(a)).toFixed(2)}" y2="${(cy + r * Math.sin(a)).toFixed(2)}" stroke="${stroke}" stroke-width="1.8"/>`;
  }).join('');
  const patternRing = ctx.patternMode
    ? `<path d="${sectorPath}" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3" stroke-dasharray="5 3"/>`
    : '';

  return `<figure class="fraction fraction-circle ${ctx.patternMode ? 'pattern-active' : ''}"><svg viewBox="0 0 160 160" role="img" aria-label="같은 크기의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${denominator}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}" stroke="${stroke}" stroke-width="3"/><path d="${sectorPath}" fill="${fill}"/>${patternRing}<circle cx="${pepX}" cy="${pepY}" r="${denominator >= 9 ? 3.2 : 4.5}" fill="#d9381e" fill-opacity="0.85"/>${dividers}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="3"/></svg><figcaption><strong>1/${denominator}</strong> (${denominator}조각 중 1조각)</figcaption></figure>`;
}

export function numberLineFractionSvg(denominator: number, patternMode: boolean): string {
  const startX = 36;
  const endX = 564;
  const width = endX - startX;
  const stepX = width / denominator;
  const firstX = startX + stepX;
  const ticks = Array.from({ length: denominator + 1 }, (_, i) => {
    const x = (startX + i * stepX).toFixed(2);
    const isEnd = i === 0 || i === denominator;
    return `<line x1="${x}" y1="${isEnd ? 22 : 28}" x2="${x}" y2="${isEnd ? 54 : 48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${isEnd ? 3 : 2}"/>`;
  }).join('');
  const patternTicks = patternMode
    ? `<line x1="${startX}" y1="35" x2="${firstX.toFixed(2)}" y2="35" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="4 3"/>`
    : '';

  return `<figure class="fraction fraction-numberline ${patternMode ? 'pattern-active' : ''}"><svg viewBox="0 0 600 78" role="img" aria-label="0에서 1까지를 ${denominator}등분하고 첫 눈금을 표시한 수직선 모형, 1/${denominator}"><rect x="${startX}" y="31" width="${stepX.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>${patternTicks}<line x1="${startX}" y1="38" x2="${endX}" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>${ticks}<circle cx="${firstX.toFixed(2)}" cy="38" r="6" fill="#d9381e"/><text x="${startX}" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text><text x="${firstX.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${denominator}</text><text x="${endX}" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text></svg><figcaption>0~1 수직선 <strong>1/${denominator}</strong></figcaption></figure>`;
}

export function cupFractionSvg(denominator: number, patternMode: boolean): string {
  const cupX = 40;
  const cupY = 16;
  const cupW = 80;
  const cupH = 120;
  const fillH = cupH / denominator;
  const fillY = cupY + cupH - fillH;
  const ticks = Array.from({ length: denominator - 1 }, (_, i) => {
    const y = (cupY + ((i + 1) * cupH) / denominator).toFixed(2);
    return `<line x1="${cupX + 8}" y1="${y}" x2="${cupX + cupW - 8}" y2="${y}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  }).join('');
  const cupPattern = patternMode
    ? `<line x1="${cupX + 6}" y1="${(fillY + fillH * 0.5).toFixed(2)}" x2="${cupX + cupW - 6}" y2="${(fillY + fillH * 0.5).toFixed(2)}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="5 3"/>`
    : '';

  return `<figure class="fraction fraction-cup ${patternMode ? 'pattern-active' : ''}"><svg viewBox="0 0 160 156" role="img" aria-label="같은 크기의 컵을 ${denominator}등분하고 한 눈금만큼 채운 들이 모형, 1/${denominator}"><rect x="${cupX}" y="${cupY}" width="${cupW}" height="${cupH}" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/><rect x="${cupX + 2}" y="${fillY.toFixed(2)}" width="${cupW - 4}" height="${fillH.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>${cupPattern}${ticks}<rect x="${cupX}" y="${cupY}" width="${cupW}" height="${cupH}" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/></svg><figcaption><strong>1/${denominator}컵</strong></figcaption></figure>`;
}

export function barFractionSvg(denominator: number, undividedPreview: boolean, ctx: SvgThemeContext): string {
  if (ctx.visualModel === 'circle') return circleFractionSvg(denominator, undividedPreview, ctx);
  if (ctx.visualModel === 'numberline') return numberLineFractionSvg(denominator, ctx.patternMode);
  if (ctx.visualModel === 'cup') return cupFractionSvg(denominator, ctx.patternMode);

  const { fill, bg, stroke } = ctx.colors;
  if (undividedPreview) {
    const previewPattern = ctx.patternMode
      ? `<line x1="14" y1="22" x2="586" y2="22" stroke="${stroke}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="6 4"/><line x1="14" y1="46" x2="586" y2="46" stroke="${stroke}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="2 5"/>`
      : '';
    return `<figure class="fraction ${ctx.patternMode ? 'pattern-active' : ''}"><svg data-svg-action="toggle-spoiler" tabindex="0" role="button" class="touchable-svg" viewBox="0 0 600 70" aria-label="아직 자르지 않은 전체 길이가 같은 ${ctx.snackName} 모형 (${denominator}명이 똑같이 나눌 예정)"><rect x="0" y="10" width="600" height="48" rx="8" fill="${fill}" fill-opacity="0.22" stroke="${stroke}" stroke-width="3" stroke-dasharray="8 5"/><line x1="14" y1="34" x2="586" y2="34" stroke="${stroke}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>${previewPattern}<text x="300" y="39" text-anchor="middle" font-size="15" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 ${ctx.snackName} 1개 · ✂️ 1/${denominator}은?</text></svg><figcaption><strong>1/${denominator}</strong> (${denominator}명 중 1조각)</figcaption></figure>`;
  }

  const segments = fractionSegments(denominator);
  const segmentWidth = 600 / denominator;
  const dividers = segments.slice(1).map(s =>
    `<line x1="${600 * s.start}" y1="10" x2="${600 * s.start}" y2="58" stroke="${stroke}" stroke-width="2"/>`
  ).join('');
  const themeDecoration = ctx.unitId === 'M01'
    ? `<rect x="6" y="16" width="${Math.max(8, segmentWidth - 12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`
    : ctx.unitId === 'M02'
      ? `<circle cx="${Math.min(580, segmentWidth * 0.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`
      : `<line x1="6" y1="34" x2="${Math.max(10, segmentWidth - 6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`;
  const patternOverlay = ctx.patternMode
    ? `<line x1="4" y1="22" x2="${Math.max(6, segmentWidth - 4).toFixed(2)}" y2="22" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2.5" stroke-dasharray="6 4"/><line x1="4" y1="46" x2="${Math.max(6, segmentWidth - 4).toFixed(2)}" y2="46" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2.5" stroke-dasharray="2 5"/>`
    : '';

  return `<figure class="fraction ${ctx.patternMode ? 'pattern-active' : ''}"><svg viewBox="0 0 600 70" role="img" aria-label="같은 길이의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 막대, 1/${denominator}"><rect x="0" y="10" width="600" height="48" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="3"/><rect x="0" y="10" width="${segmentWidth}" height="48" rx="4" fill="${fill}"/>${themeDecoration}${patternOverlay}${dividers}</svg><figcaption><strong>1/${denominator}</strong> (${denominator}조각 중 1조각)</figcaption></figure>`;
}

export function renderFlagNumberLineSvg(pinnedFlags: number[], flagDenoms: readonly number[]): string {
  const startX = 44;
  const endX = 556;
  const width = endX - startX;
  const sorted = [...pinnedFlags].sort((a, b) => a - b);
  const poleTops = [18, 30, 42];
  const flagsSvg = sorted.map((d, idx) => {
    const x = (startX + width / d).toFixed(2);
    const poleTop = poleTops[idx % poleTops.length];
    return `<g class="touchable-svg" tabindex="0" role="button" aria-label="1/${d} 깃발 토글" data-svg-flag="${d}"><line x1="${x}" y1="${poleTop}" x2="${x}" y2="56" stroke="#d9381e" stroke-width="2.2"/><circle cx="${x}" cy="56" r="4.5" fill="#d9381e"/><text x="${x}" y="${poleTop - 2}" text-anchor="middle" font-size="12" font-weight="800" fill="#d9381e">🚩1/${d}</text></g>`;
  }).join('');
  const tickHits = flagDenoms.map(d => {
    const x = (startX + width / d).toFixed(2);
    return `<circle class="svg-hit-slice" tabindex="0" role="button" aria-label="수직선 1/${d} 위치 깃발 꽂기" data-svg-flag="${d}" cx="${x}" cy="56" r="10" fill="transparent"/>`;
  }).join('');

  return `<figure class="flag-line-figure"><svg class="touchable-svg" viewBox="0 0 600 84" role="img" aria-label="0부터 1까지 수직선 위에 ${sorted.map(d => `1/${d}`).join(', ')} 깃발을 꽂아 위치를 비교한 모형"><line x1="${startX}" y1="56" x2="${endX}" y2="56" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3.5"/><line x1="${startX}" y1="42" x2="${startX}" y2="68" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/><line x1="${endX}" y1="42" x2="${endX}" y2="68" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>${flagsSvg}${tickHits}<text x="${startX}" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">0</text><text x="${endX}" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">1 (전체)</text></svg><figcaption>꽂힌 깃발(${sorted.length}개): <strong>${sorted.length > 0 ? sorted.map(d => `1/${d}`).join(' > ') : '없음'}</strong></figcaption></figure>`;
}
