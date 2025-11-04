export interface ImageData {
  id: number;
  name: string;
  originalImage: HTMLImageElement;
  squareCanvas: HTMLCanvasElement | null;
  resizeCanvas: HTMLCanvasElement | null;
  ratioCanvas: HTMLCanvasElement | null;
  recommendedRatio: { width: number; height: number } | null;
}

export type ImageResizerTabType = 'recommend' | 'square' | 'resize' | 'custom';


