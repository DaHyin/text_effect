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

    // 칸수 기반으로 캔버스 크기 계산
    const GRID_SIZE = 24;
    let width: number;
    let height: number;
    
    if (effect.textMode === 'multiple') {
      let gridCols = effect.canvasGridCols || 25;
      let gridRows = effect.canvasGridRows || 17;
      
      // 범위 제한 (5-100칸)
      if (gridCols < 5) gridCols = 5;
      if (gridCols > 100) gridCols = 100;
      if (gridRows < 5) gridRows = 5;
      if (gridRows > 100) gridRows = 100;
      
      width = gridCols * GRID_SIZE;
      height = gridRows * GRID_SIZE;
    } else {
      // 단일 모드: 칸수 기반으로 캔버스 크기 계산
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


