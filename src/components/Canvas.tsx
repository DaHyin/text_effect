import { useEffect, useRef, useState } from 'react';
import { drawTextOnCanvas, calculateCanvasSize } from '../utils/canvas';
import './Canvas.css';
import type { TextEffect } from '../types';

interface CanvasProps {
  effect: TextEffect;
  onChange?: (effect: Partial<TextEffect>) => void;
}

export function Canvas({ effect, onChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    // 이미지가 있는 경우 이미지 로드 대기
    const hasImageFill = effect.imageFill?.enabled && effect.imageFill.imageUrl;
    const hasStrokeImage = effect.stroke?.enabled && effect.stroke?.useImage && effect.stroke?.imageUrl;
    const hasTexture = effect.texture?.enabled && effect.texture.imageUrl;
    const hasStrokeTexture = effect.stroke?.enabled && effect.stroke?.texture?.enabled && effect.stroke?.texture?.imageUrl;
    const hasBackgroundImage = effect.backgroundImage?.enabled && effect.backgroundImage.imageUrl;
    
    const imagesToLoad = [hasImageFill, hasStrokeImage, hasTexture, hasStrokeTexture, hasBackgroundImage].filter(Boolean).length;
    
    if (imagesToLoad > 0) {
      let loadedCount = 0;
      
      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount >= imagesToLoad) setImageLoaded(true);
      };
      
      if (hasImageFill) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.src = effect.imageFill.imageUrl!;
      }
      
      if (hasStrokeImage) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.src = effect.stroke.imageUrl!;
      }
      
      if (hasTexture) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.src = effect.texture.imageUrl!;
      }
      
      if (hasStrokeTexture) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.src = effect.stroke.texture.imageUrl!;
      }
      
      if (hasBackgroundImage) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.src = effect.backgroundImage.imageUrl!;
      }
    } else {
      setImageLoaded(true);
    }
  }, [
    effect.imageFill?.imageUrl, 
    effect.imageFill?.enabled, 
    effect.stroke?.imageUrl, 
    effect.stroke?.useImage, 
    effect.stroke?.enabled,
    effect.texture?.imageUrl,
    effect.texture?.enabled,
    effect.stroke?.texture?.imageUrl,
    effect.stroke?.texture?.enabled,
    effect.backgroundImage?.imageUrl,
    effect.backgroundImage?.enabled,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || !imageLoaded) return;

    // 칸수 기반으로 캔버스 크기 계산
    const GRID_SIZE = 24;
    
    // 다중 모드인 경우 미리보기 칸수 사용
    if (effect.textMode === 'multiple') {
      let gridCols = effect.canvasGridCols || 25;
      let gridRows = effect.canvasGridRows || 17;
      
      // 범위 제한 (5-100칸)
      if (gridCols < 5) gridCols = 5;
      if (gridCols > 100) gridCols = 100;
      if (gridRows < 5) gridRows = 5;
      if (gridRows > 100) gridRows = 100;
      
      const canvasWidth = gridCols * GRID_SIZE;
      const canvasHeight = gridRows * GRID_SIZE;
      
      // 컨테이너 크기 업데이트
      container.style.width = `${canvasWidth + 64}px`; // padding 포함 (2rem * 2 = 64px)
      container.style.height = `${canvasHeight + 64}px`;
      
      // 캔버스 해상도와 CSS 크기를 동일하게 설정 (스케일링 방지)
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.style.maxWidth = 'none';
      canvas.style.maxHeight = 'none';
      
      drawTextOnCanvas(canvas, effect);
      return;
    }

    // 단일 모드: 칸수 기반으로 캔버스 크기 계산
    const { width, height } = calculateCanvasSize(effect);
    
    canvas.width = width;
    canvas.height = height;
    
    // 단일 모드에서는 CSS 기본값 사용 (width: 100%, height: 300px)
    canvas.style.width = '';
    canvas.style.height = '';
    canvas.style.maxWidth = '';
    canvas.style.maxHeight = '';
    
    drawTextOnCanvas(canvas, effect);
  }, [effect, imageLoaded, effect.gridCols, effect.gridRows, effect.canvasGridCols, effect.canvasGridRows]);

  return (
    <div className="canvas-wrapper">
      {effect.textMode === 'multiple' && (
        <div className="canvas-size-input">
          <div className="canvas-size-row">
            <div className="canvas-size-item">
              <label className="canvas-size-label">가로:</label>
              <input
                type="number"
                min="5"
                max="100"
                value={effect.canvasGridCols || 25}
                onChange={(e) => {
                  if (!onChange) return;
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    onChange({ canvasGridCols: value });
                  }
                }}
                onBlur={(e) => {
                  if (!onChange) return;
                  let value = Number(e.target.value);
                  if (value < 5) value = 5;
                  if (value > 100) value = 100;
                  if (!isNaN(value)) {
                    onChange({ canvasGridCols: value });
                  }
                }}
                className="canvas-size-input-field"
              />
              <span className="canvas-size-unit">칸 ({(effect.canvasGridCols || 25) * 24}px)</span>
            </div>
            <span className="canvas-size-separator">×</span>
            <div className="canvas-size-item">
              <label className="canvas-size-label">세로:</label>
              <input
                type="number"
                min="5"
                max="100"
                value={effect.canvasGridRows || 17}
                onChange={(e) => {
                  if (!onChange) return;
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    onChange({ canvasGridRows: value });
                  }
                }}
                onBlur={(e) => {
                  if (!onChange) return;
                  let value = Number(e.target.value);
                  if (value < 5) value = 5;
                  if (value > 100) value = 100;
                  if (!isNaN(value)) {
                    onChange({ canvasGridRows: value });
                  }
                }}
                className="canvas-size-input-field"
              />
              <span className="canvas-size-unit">칸 ({(effect.canvasGridRows || 17) * 24}px)</span>
            </div>
          </div>
          <div className="canvas-description">
            ⓘ 추가 문자열인 경우 고정된 크기로 만들어진다 (24px 단위)
          </div>
        </div>
      )}
      <div ref={containerRef} className="canvas-container">
        <canvas 
          ref={canvasRef} 
          className="canvas"
          data-transparent={true}
        />
        <div className="canvas-label">미리보기</div>
      </div>
    </div>
  );
}


