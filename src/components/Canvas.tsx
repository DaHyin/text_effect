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

    // 다중 모드인 경우 미리보기 크기로 고정
    if (effect.textMode === 'multiple') {
      let canvasWidth = effect.canvasWidth || 600;
      let canvasHeight = effect.canvasHeight || 400;
      
      // 범위 제한 (50-1000)
      if (canvasWidth < 50) canvasWidth = 50;
      if (canvasWidth > 1000) canvasWidth = 1000;
      if (canvasHeight < 50) canvasHeight = 50;
      if (canvasHeight > 1000) canvasHeight = 1000;
      
      // 컨테이너 크기 업데이트
      container.style.width = `${canvasWidth + 64}px`; // padding 포함 (2rem * 2 = 64px)
      container.style.height = `${canvasHeight + 64}px`;
      
      // 캔버스 해상도와 CSS 크기를 동일하게 설정 (스케일링 방지)
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      // CSS 크기를 정확히 설정하여 스케일링 방지
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.style.maxWidth = 'none';
      canvas.style.maxHeight = 'none';
      
      drawTextOnCanvas(canvas, effect);
      return;
    }

    // 단일 모드: 텍스트 크기에 맞춰 캔버스 크기 계산
    let { width: textWidth, height: textHeight } = calculateCanvasSize(effect);
    
    // 배경 이미지가 있는 경우 실제 이미지 크기도 고려하되, 비율 유지
    if (effect.backgroundImage?.enabled && effect.backgroundImage.imageUrl) {
      const img = new Image();
      img.src = effect.backgroundImage.imageUrl;
      
      const adjustCanvasSize = () => {
        const imgWidth = img.width * effect.backgroundImage.scale;
        const imgHeight = img.height * effect.backgroundImage.scale;
        
        // 텍스트를 기준으로 최대 크기 제한 (최대 3배까지만)
        const maxWidth = textWidth * 3;
        const maxHeight = textHeight * 3;
        
        // 이미지가 너무 크면 비율을 유지하며 제한
        let finalImgWidth = imgWidth;
        let finalImgHeight = imgHeight;
        
        if (imgWidth > maxWidth || imgHeight > maxHeight) {
          const widthRatio = maxWidth / imgWidth;
          const heightRatio = maxHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio);
          
          finalImgWidth = imgWidth * ratio;
          finalImgHeight = imgHeight * ratio;
        }
        
        textWidth = Math.max(textWidth, finalImgWidth + 60); // 패딩 포함
        textHeight = Math.max(textHeight, finalImgHeight + 60);
      };
      
      if (img.complete) {
        adjustCanvasSize();
      } else {
        img.onload = () => {
          adjustCanvasSize();
          
          const containerWidth = container.offsetWidth;
          const containerHeight = container.offsetHeight;
          
          const canvasWidth = Math.max(containerWidth, textWidth);
          const canvasHeight = Math.max(containerHeight, textHeight);
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          
          drawTextOnCanvas(canvas, effect);
        };
      }
    }
    
    // 컨테이너와 텍스트 크기 중 더 큰 값 사용
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    const canvasWidth = Math.max(containerWidth, textWidth);
    const canvasHeight = Math.max(containerHeight, textHeight);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // 단일 모드에서는 CSS 기본값 사용 (width: 100%, height: 300px)
    canvas.style.width = '';
    canvas.style.height = '';
    canvas.style.maxWidth = '';
    canvas.style.maxHeight = '';
    
    drawTextOnCanvas(canvas, effect);
  }, [effect, imageLoaded, effect.canvasWidth, effect.canvasHeight]);

  return (
    <div className="canvas-wrapper">
      {effect.textMode === 'multiple' && (
        <div className="canvas-size-input">
          <div className="canvas-size-row">
            <div className="canvas-size-item">
              <label className="canvas-size-label">가로:</label>
              <input
                type="number"
                min="50"
                max="1000"
                value={effect.canvasWidth || 600}
                onChange={(e) => {
                  if (!onChange) return;
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    onChange({ canvasWidth: value });
                  }
                }}
                onBlur={(e) => {
                  if (!onChange) return;
                  let value = Number(e.target.value);
                  if (value < 50) value = 50;
                  if (value > 1000) value = 1000;
                  if (!isNaN(value)) {
                    onChange({ canvasWidth: value });
                  }
                }}
                className="canvas-size-input-field"
              />
              <span className="canvas-size-unit">px</span>
            </div>
            <span className="canvas-size-separator">×</span>
            <div className="canvas-size-item">
              <label className="canvas-size-label">세로:</label>
              <input
                type="number"
                min="50"
                max="1000"
                value={effect.canvasHeight || 400}
                onChange={(e) => {
                  if (!onChange) return;
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    onChange({ canvasHeight: value });
                  }
                }}
                onBlur={(e) => {
                  if (!onChange) return;
                  let value = Number(e.target.value);
                  if (value < 50) value = 50;
                  if (value > 1000) value = 1000;
                  if (!isNaN(value)) {
                    onChange({ canvasHeight: value });
                  }
                }}
                className="canvas-size-input-field"
              />
              <span className="canvas-size-unit">px</span>
            </div>
          </div>
          <div className="canvas-description">
            ⓘ 추가 문자열인 경우 고정된 크기로 만들어진다
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


