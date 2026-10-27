import qrcode from 'qrcode-generator';

// Encode locally: lesson URLs are never sent to an external QR service.
qrcode.stringToBytes = (text: string) => Array.from(new TextEncoder().encode(text));

export function createLessonQrSvg(url: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(url, 'Byte');
  qr.make();
  const count = qr.getModuleCount();
  const size = count + 8; // Four-module quiet zone on every side.
  const cells: string[] = [];
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) cells.push(`M${col + 4} ${row + 4}h1v1h-1z`);
    }
  }
  return `<svg class="qr-code-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="수업 접속 QR 코드" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${cells.join('')}" fill="#000"/></svg>`;
}

export async function copyLessonUrl(url: string, clipboard: Pick<Clipboard, 'writeText'> | undefined): Promise<boolean> {
  try {
    if (!clipboard) return false;
    await clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
