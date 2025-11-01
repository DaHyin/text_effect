export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  scale: number = 1
): void {
  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = canvas.width * scale;
  scaledCanvas.height = canvas.height * scale;
  
  const ctx = scaledCanvas.getContext('2d');
  if (!ctx) return;
  
  ctx.scale(scale, scale);
  ctx.drawImage(canvas, 0, 0);
  
  scaledCanvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export function generateFilename(text: string): string {
  const sanitized = text
    .replace(/[^a-zA-Z0-9가-힣]/g, '_')
    .substring(0, 30);
  return `${sanitized || 'text-effect'}.png`;
}


