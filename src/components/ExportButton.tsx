import { useCallback, useRef } from 'react';
import { calculateCanvasSize } from '../utils/canvas';
import { drawTextOnCanvas } from '../utils/canvas';
import { downloadCanvas, generateFilename } from '../utils/export';
import './ExportButton.css';
import type { TextEffect } from '../types';

interface ExportButtonProps {
  effect: TextEffect;
  scale?: number;
}

export function ExportButton({ effect, scale = 1 }: ExportButtonProps) {
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;

    // 다중 모드인 경우 고정 캔버스 크기 사용
    let width: number;
    let height: number;
    
    if (effect.textMode === 'multiple') {
      let widthValue = effect.canvasWidth || 600;
      let heightValue = effect.canvasHeight || 400;
      
      // 범위 제한 (50-1000)
      if (widthValue < 50) widthValue = 50;
      if (widthValue > 1000) widthValue = 1000;
      if (heightValue < 50) heightValue = 50;
      if (heightValue > 1000) heightValue = 1000;
      
      width = widthValue;
      height = heightValue;
    } else {
      // 단일 모드: 텍스트 크기에 맞춰 캔버스 크기 계산
      const size = calculateCanvasSize(effect);
      width = size.width;
      height = size.height;
    }
    
    canvas.width = width;
    canvas.height = height;

    // 이미지 로드 및 다운로드
    const performDownload = () => {
      drawTextOnCanvas(canvas, effect);

      // 다운로드
      const filename = generateFilename(effect.text);
      downloadCanvas(canvas, filename, scale);
    };

    // 이미지가 있는 경우 로드 대기
    const hasImageFill = effect.imageFill.enabled && effect.imageFill.imageUrl;
    const hasStrokeImage = effect.stroke.enabled && effect.stroke.useImage && effect.stroke.imageUrl;
    const hasTexture = effect.texture.enabled && effect.texture.imageUrl;
    const hasStrokeTexture = effect.stroke.enabled && effect.stroke.texture.enabled && effect.stroke.texture.imageUrl;
    const hasBackgroundImage = effect.backgroundImage?.enabled && effect.backgroundImage.imageUrl;
    
    const imagesToLoad = [hasImageFill, hasStrokeImage, hasTexture, hasStrokeTexture, hasBackgroundImage].filter(Boolean).length;
    
    if (imagesToLoad > 0) {
      let loadedCount = 0;
      
      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= imagesToLoad) performDownload();
      };
      
      if (hasImageFill) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = checkComplete;
        img.onerror = checkComplete;
        img.src = effect.imageFill.imageUrl!;
        // 브라우저 캐시에 이미지가 있는 경우 즉시 로드되므로 확인
        if (img.complete) {
          img.onload = null;
          img.onerror = null;
          checkComplete();
        }
      }
      
      if (hasStrokeImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = checkComplete;
        img.onerror = checkComplete;
        img.src = effect.stroke.imageUrl!;
        if (img.complete) {
          img.onload = null;
          img.onerror = null;
          checkComplete();
        }
      }
      
      if (hasTexture) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = checkComplete;
        img.onerror = checkComplete;
        img.src = effect.texture.imageUrl!;
        if (img.complete) {
          img.onload = null;
          img.onerror = null;
          checkComplete();
        }
      }
      
      if (hasStrokeTexture) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = checkComplete;
        img.onerror = checkComplete;
        img.src = effect.stroke.texture.imageUrl!;
        if (img.complete) {
          img.onload = null;
          img.onerror = null;
          checkComplete();
        }
      }
      
      if (hasBackgroundImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = checkComplete;
        img.onerror = checkComplete;
        img.src = effect.backgroundImage.imageUrl!;
        if (img.complete) {
          img.onload = null;
          img.onerror = null;
          checkComplete();
        }
      }
    } else {
      performDownload();
    }
  }, [effect, scale]);

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        className="export-button"
      >
        📥 PNG 다운로드
      </button>
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
    </>
  );
}


