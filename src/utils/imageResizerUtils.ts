import type { ImageData } from '../types/imageResizer';

// 24px 단위로 가장 가까운 비율을 계산하는 함수
export function calculateRecommendedRatio(width: number, height: number): { width: number; height: number } {
  const baseSize = 24;
  
  // 현재 이미지 비율 계산
  const aspectRatio = width / height;
  
  // 24px 단위로 가능한 비율들을 생성 (1:1부터 10:10까지)
  let bestRatio = { width: 1, height: 1 };
  let minDifference = Infinity;
  
  for (let w = 1; w <= 10; w++) {
    for (let h = 1; h <= 10; h++) {
      const ratioAspect = w / h;
      const difference = Math.abs(aspectRatio - ratioAspect);
      
      if (difference < minDifference) {
        minDifference = difference;
        bestRatio = { width: w, height: h };
      }
    }
  }
  
  return bestRatio;
}

// 이미지 데이터 메모리 정리 함수
export function cleanupImageData(imageData: ImageData): void {
  if (imageData.squareCanvas) {
    imageData.squareCanvas.width = 0;
    imageData.squareCanvas.height = 0;
    imageData.squareCanvas = null;
  }
  if (imageData.resizeCanvas) {
    imageData.resizeCanvas.width = 0;
    imageData.resizeCanvas.height = 0;
    imageData.resizeCanvas = null;
  }
  if (imageData.ratioCanvas) {
    imageData.ratioCanvas.width = 0;
    imageData.ratioCanvas.height = 0;
    imageData.ratioCanvas = null;
  }
  if (imageData.originalImage) {
    imageData.originalImage.src = '';
    imageData.originalImage = null as any;
  }
  imageData.recommendedRatio = null;
}

// 비율을 파싱하는 함수
export function parseRatio(ratioString: string): { width: number; height: number } {
  const match = ratioString.match(/^(\d+):(\d+)$/);
  if (!match) {
    throw new Error('올바른 비율 형식을 입력해주세요 (예: 1:3, 2:1)');
  }
  return {
    width: parseInt(match[1]),
    height: parseInt(match[2])
  };
}


