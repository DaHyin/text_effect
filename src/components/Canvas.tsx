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
  const [scale, setScale] = useState(1);

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
    
    let canvasWidth: number;
    let canvasHeight: number;
    
    // 다중 모드인 경우 미리보기 칸수 사용
    if (effect.textMode === 'multiple') {
      let gridCols = effect.canvasGridCols || 4;
      let gridRows = effect.canvasGridRows || 1;
      
      // 범위 제한 (1-1000칸)
      if (gridCols < 1) gridCols = 1;
      if (gridCols > 1000) gridCols = 1000;
      if (gridRows < 1) gridRows = 1;
      if (gridRows > 1000) gridRows = 1000;
      
      canvasWidth = gridCols * GRID_SIZE;
      canvasHeight = gridRows * GRID_SIZE;
    } else {
      // 단일 모드: 칸수 기반으로 캔버스 크기 계산
      const size = calculateCanvasSize(effect);
      canvasWidth = size.width;
      canvasHeight = size.height;
    }
    
    // 컨테이너 사용 가능한 공간 계산 (padding 제외)
    const containerPadding = 32; // 2rem = 32px
    const availableWidth = container.offsetWidth - containerPadding * 2;
    const availableHeight = container.offsetHeight - containerPadding * 2;
    
    // 캔버스 크기 제한 (메모리 최적화)
    const MAX_CANVAS_SIZE = 1000; // 최대 캔버스 크기 (px)
    const MAX_PREVIEW_SCALE = 2; // 최대 확대 배율 (메모리 최적화)
    
    // 원본 크기가 너무 크면 제한
    let limitedCanvasWidth = Math.min(canvasWidth, MAX_CANVAS_SIZE);
    let limitedCanvasHeight = Math.min(canvasHeight, MAX_CANVAS_SIZE);
    
    // 스케일 계산
    let calculatedScale = 1;
    let renderScale = 1; // 실제 렌더링 해상도 배율
    
    if (limitedCanvasWidth < availableWidth && limitedCanvasHeight < availableHeight) {
      // 캔버스가 작으면 확대 (2배, 3배, 4배...)
      const widthScale = availableWidth / limitedCanvasWidth;
      const heightScale = availableHeight / limitedCanvasHeight;
      const maxScale = Math.min(widthScale, heightScale);
      
      // 2배, 3배, 4배 등으로 확대 (최대 2배로 제한)
      calculatedScale = Math.min(Math.max(2, Math.floor(maxScale)), MAX_PREVIEW_SCALE);
      // 화질 개선: 확대 시 해상도를 높여서 렌더링 (최대 2배까지)
      renderScale = Math.min(calculatedScale, MAX_PREVIEW_SCALE);
    } else if (limitedCanvasWidth > availableWidth || limitedCanvasHeight > availableHeight) {
      // 캔버스가 크면 축소 (1/2, 1/4, 1/8...)
      const widthScale = availableWidth / limitedCanvasWidth;
      const heightScale = availableHeight / limitedCanvasHeight;
      const minScale = Math.min(widthScale, heightScale);
      
      // 1/2, 1/4, 1/8 등으로 축소
      let scaleFactor = 1;
      while (scaleFactor * 2 <= 1 / minScale) {
        scaleFactor *= 2;
      }
      calculatedScale = 1 / scaleFactor;
      renderScale = 1; // 축소 시에는 원본 해상도 유지
    }
    
    setScale(calculatedScale);
    
    // previewScale: 확대 시 실제 크기로 렌더링, 축소 시는 1 (CSS로 축소)
    const previewScale = calculatedScale > 1 ? Math.min(calculatedScale, MAX_PREVIEW_SCALE) : 1;
    
    // 캔버스 해상도 설정 (확대 시 실제 크기로 렌더링, 최대 크기 제한)
    const renderWidth = Math.min(limitedCanvasWidth * previewScale, MAX_CANVAS_SIZE * MAX_PREVIEW_SCALE);
    const renderHeight = Math.min(limitedCanvasHeight * previewScale, MAX_CANVAS_SIZE * MAX_PREVIEW_SCALE);
    
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    
    // 컨텍스트 설정
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 고품질 이미지 스무딩
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    
    // 캔버스 CSS 크기 설정 (표시 크기)
    const displayWidth = limitedCanvasWidth * calculatedScale;
    const displayHeight = limitedCanvasHeight * calculatedScale;
    
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.style.maxWidth = '100%'; // 컨테이너를 넘지 않도록 제한
    canvas.style.maxHeight = '100%';
    canvas.style.margin = '0 auto'; // 중앙 정렬
    canvas.style.display = 'block';
    
    // drawTextOnCanvas 호출 (previewScale 전달하여 실제 크기로 렌더링)
    drawTextOnCanvas(canvas, effect, limitedCanvasWidth, limitedCanvasHeight, previewScale);
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
                min="1"
                max="1000"
                value={effect.canvasGridCols || 4}
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
                  if (value < 1) value = 1;
                  if (value > 1000) value = 1000;
                  if (!isNaN(value)) {
                    onChange({ canvasGridCols: value });
                  }
                }}
                className="canvas-size-input-field"
              />
              <span className="canvas-size-unit">칸 ({(effect.canvasGridCols || 4) * 24}px)</span>
            </div>
            <span className="canvas-size-separator">×</span>
            <div className="canvas-size-item">
              <label className="canvas-size-label">세로:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={effect.canvasGridRows || 1}
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
                  if (value < 1) value = 1;
                  if (value > 1000) value = 1000;
                  if (!isNaN(value)) {
                    onChange({ canvasGridRows: value });
                  }
                }}
                className="canvas-size-input-field"
              />
              <span className="canvas-size-unit">칸 ({(effect.canvasGridRows || 1) * 24}px)</span>
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
        {scale !== 1 && (
          <div className="canvas-scale-indicator">
            {scale > 1 ? `${scale}배로 확대 중` : `${1 / scale}분의 1로 축소 중`}
          </div>
        )}
      </div>
    </div>
  );
}


