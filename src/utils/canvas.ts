import type { TextEffect } from '../types';

const GRID_SIZE = 24; // 24px 단위

export function calculateCanvasSize(effect: TextEffect): { width: number; height: number } {
  // 칸수 기반으로 캔버스 크기 계산
  const width = effect.gridCols * GRID_SIZE;
  const height = effect.gridRows * GRID_SIZE;
  
  return { width, height };
}

export function drawTextOnCanvas(
  canvas: HTMLCanvasElement,
  effect: TextEffect
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 투명 배경
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 캔버스 중심 위치 (칸수 기반이므로 패딩 없이 전체 사용)
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // 텍스트 영역 (전체 캔버스 사용)
  const textAreaWidth = canvas.width;
  const textAreaHeight = canvas.height;
  
  const maxWidth = textAreaWidth - 20; // 약간의 여유

  // 다중 모드 처리
  if (effect.textMode === 'multiple' && effect.textBlocks && effect.textBlocks.length > 0) {
    // 배경 이미지 먼저 그리기
    if (effect.backgroundImage?.enabled && effect.backgroundImage.imageUrl) {
      const bgImg = new Image();
      bgImg.src = effect.backgroundImage.imageUrl;
      if (bgImg.complete) {
        ctx.save();
        ctx.globalAlpha = effect.backgroundImage.opacity;
        const imgWidth = bgImg.width * effect.backgroundImage.scale;
        const imgHeight = bgImg.height * effect.backgroundImage.scale;
        const imgX = centerX + effect.backgroundImage.offsetX - imgWidth / 2;
        const imgY = centerY + effect.backgroundImage.offsetY - imgHeight / 2;
        ctx.drawImage(bgImg, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();
      }
    }

    // 각 블록 렌더링 - 그림자 먼저 (가장 뒤 레이어)
    effect.textBlocks.forEach((block) => {
      ctx.font = `${block.fontSize}px ${block.fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      const textX = centerX + block.offsetX;
      const textY = centerY + block.offsetY;
      
      // 그림자 (가장 뒤)
      if (effect.shadow?.enabled) {
        ctx.save();
        ctx.fillStyle = effect.shadow.color;
        ctx.shadowBlur = effect.shadow.blur * 2; // 블러 효과 강화
        ctx.shadowColor = effect.shadow.color;
        
        const baseX = textX + effect.shadow.offsetX;
        const baseY = textY + effect.shadow.offsetY;
        
        // 자간이 있으면 문자별 렌더링
        if (block.letterSpacing !== 0) {
          ctx.textAlign = 'left';
          const letters = block.text.split('');
          const extraSpacing = block.letterSpacing * block.fontSize;
          
          // 총 너비 계산
          let totalWidth = 0;
          letters.forEach((char) => {
            totalWidth += ctx.measureText(char).width;
          });
          totalWidth += extraSpacing * (letters.length - 1);
          
          const startX = baseX - totalWidth / 2;
          let currentX = startX;
          
          letters.forEach((char) => {
            const charWidth = ctx.measureText(char).width;
            
            // 확산 효과를 위해 여러 방향으로 그림자 그리기
            if (effect.shadow.blur > 0) {
              const spread = Math.max(2, Math.ceil(effect.shadow.blur));
              ctx.globalAlpha = 0.6;
              for (let dx = -spread; dx <= spread; dx++) {
                for (let dy = -spread; dy <= spread; dy++) {
                  if (dx === 0 && dy === 0) continue;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  if (distance <= spread) {
                    ctx.globalAlpha = 0.5 * (1 - distance / (spread + 1));
                    ctx.fillText(char, currentX + dx, baseY + dy);
                  }
                }
              }
            }
            
            // 메인 그림자
            ctx.globalAlpha = 0.8;
            ctx.fillText(char, currentX, baseY);
            
            currentX += charWidth + extraSpacing;
          });
        } else {
          // 확산 효과를 위해 여러 방향으로 그림자 그리기
          if (effect.shadow.blur > 0) {
            const spread = Math.max(2, Math.ceil(effect.shadow.blur));
            ctx.globalAlpha = 0.6;
            for (let dx = -spread; dx <= spread; dx++) {
              for (let dy = -spread; dy <= spread; dy++) {
                if (dx === 0 && dy === 0) continue;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= spread) {
                  ctx.globalAlpha = 0.5 * (1 - distance / (spread + 1));
                  ctx.fillText(block.text, baseX + dx, baseY + dy);
                }
              }
            }
          }
          
          // 메인 그림자
          ctx.globalAlpha = 0.8;
          ctx.fillText(block.text, baseX, baseY);
        }
        ctx.restore();
      }
    });
    
    // 각 블록 렌더링 - 테두리 (중간 레이어)
    effect.textBlocks.forEach((block) => {
      ctx.font = `${block.fontSize}px ${block.fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      const textX = centerX + block.offsetX;
      const textY = centerY + block.offsetY;
      
      // 테두리 (중간)
      if (block.stroke.enabled) {
        ctx.strokeStyle = block.stroke.color;
        ctx.lineWidth = block.stroke.width;
        ctx.lineJoin = 'round';
        
        // 자간이 있으면 문자별 렌더링
        if (block.letterSpacing !== 0) {
          ctx.textAlign = 'left';
          const letters = block.text.split('');
          const extraSpacing = block.letterSpacing * block.fontSize;
          
          // 총 너비 계산
          let totalWidth = 0;
          letters.forEach((char) => {
            totalWidth += ctx.measureText(char).width;
          });
          totalWidth += extraSpacing * (letters.length - 1);
          
          const startX = textX - totalWidth / 2;
          let currentX = startX;
          
          letters.forEach((char) => {
            const charWidth = ctx.measureText(char).width;
            ctx.strokeText(char, currentX, textY);
            currentX += charWidth + extraSpacing;
          });
        } else {
          ctx.strokeText(block.text, textX, textY);
        }
      }
    });
    
    // 각 블록 렌더링 - 텍스트/이미지/질감 (가장 앞 레이어)
    // 블록별 텍스트 레이어 캔버스 생성
    const blockTextLayerCanvas = document.createElement('canvas');
    blockTextLayerCanvas.width = canvas.width;
    blockTextLayerCanvas.height = canvas.height;
    const blockTextLayerCtx = blockTextLayerCanvas.getContext('2d')!;
    
    effect.textBlocks.forEach((block) => {
      blockTextLayerCtx.font = `${block.fontSize}px ${block.fontFamily}`;
      blockTextLayerCtx.textBaseline = 'middle';
      
      const textX = centerX + block.offsetX;
      const textY = centerY + block.offsetY;
      
      // 자간이 있으면 문자별 렌더링
      if (block.letterSpacing !== 0) {
        blockTextLayerCtx.textAlign = 'left';
        const letters = block.text.split('');
        const extraSpacing = block.letterSpacing * block.fontSize;
        
        // 총 너비 계산
        let totalWidth = 0;
        letters.forEach((char) => {
          totalWidth += blockTextLayerCtx.measureText(char).width;
        });
        totalWidth += extraSpacing * (letters.length - 1);
        
        const startX = textX - totalWidth / 2;
        let currentX = startX;
        
        // 각 문자별로 텍스트/이미지 채우기 렌더링
        letters.forEach((char) => {
          const charWidth = blockTextLayerCtx.measureText(char).width;
          
          // 문자용 임시 캔버스
          const charCanvas = document.createElement('canvas');
          charCanvas.width = canvas.width;
          charCanvas.height = canvas.height;
          const charCtx = charCanvas.getContext('2d')!;
          charCtx.font = blockTextLayerCtx.font;
          charCtx.textBaseline = 'middle';
          charCtx.textAlign = 'left';
          
          // 이미지 채우기
          if (block.imageFill.enabled && block.imageFill.imageUrl) {
            const img = new Image();
            img.src = block.imageFill.imageUrl;
            if (img.complete) {
              // 텍스트를 검은색으로 그리기 (마스크)
              charCtx.fillStyle = 'black';
              charCtx.fillText(char, currentX, textY);
              
              // 이미지 모양으로만 표시
              charCtx.globalCompositeOperation = 'source-in';
              
              const imgWidth = img.width * block.imageFill.scale;
              const imgHeight = img.height * block.imageFill.scale;
              const imgX = currentX + block.imageFill.offsetX - imgWidth / 2;
              const imgY = textY + block.imageFill.offsetY - imgHeight / 2;
              
              charCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
              charCtx.globalCompositeOperation = 'source-over';
            } else {
              // 이미지 로딩 중 - 기본 색상 사용
              charCtx.fillStyle = block.textColor;
              charCtx.fillText(char, currentX, textY);
            }
          } else {
            // 일반 텍스트 렌더링
            charCtx.fillStyle = block.textColor;
            charCtx.fillText(char, currentX, textY);
          }
          
          // 문자 캔버스를 블록 텍스트 레이어에 그리기
          blockTextLayerCtx.drawImage(charCanvas, 0, 0);
          
          // 질감 효과 처리
          if (block.texture.enabled && block.texture.imageUrl) {
            const textureImg = new Image();
            textureImg.src = block.texture.imageUrl;
            if (textureImg.complete) {
              // 질감용 임시 캔버스
              const charTextureCanvas = document.createElement('canvas');
              charTextureCanvas.width = canvas.width;
              charTextureCanvas.height = canvas.height;
              const textureCtx = charTextureCanvas.getContext('2d')!;
              
              // 텍스트를 검은색으로 마스크 생성
              textureCtx.fillStyle = 'black';
              textureCtx.font = blockTextLayerCtx.font;
              textureCtx.textBaseline = 'middle';
              textureCtx.textAlign = 'left';
              textureCtx.fillText(char, currentX, textY);
              
              // 질감 이미지를 텍스트 모양으로만 표시
              textureCtx.globalCompositeOperation = 'source-in';
              
              const imgWidth = textureImg.width * block.texture.scale;
              const imgHeight = textureImg.height * block.texture.scale;
              const imgX = currentX + block.texture.offsetX - imgWidth / 2;
              const imgY = textY + block.texture.offsetY - imgHeight / 2;
              
              textureCtx.drawImage(textureImg, imgX, imgY, imgWidth, imgHeight);
              textureCtx.globalCompositeOperation = 'source-over';
              
              // 질감을 블록 텍스트 레이어에 블렌딩
              blockTextLayerCtx.save();
              blockTextLayerCtx.globalCompositeOperation = block.texture.blendMode;
              blockTextLayerCtx.globalAlpha = block.texture.opacity;
              blockTextLayerCtx.drawImage(charTextureCanvas, 0, 0);
              blockTextLayerCtx.restore();
            }
          }
          
          currentX += charWidth + extraSpacing;
        });
      } else {
        // 자간이 없는 경우
        blockTextLayerCtx.textAlign = 'center';
        
        // 블록용 임시 캔버스
        const blockCanvas = document.createElement('canvas');
        blockCanvas.width = canvas.width;
        blockCanvas.height = canvas.height;
        const blockCtx = blockCanvas.getContext('2d')!;
        blockCtx.font = blockTextLayerCtx.font;
        blockCtx.textBaseline = 'middle';
        blockCtx.textAlign = 'center';
        
        // 이미지 채우기
        if (block.imageFill.enabled && block.imageFill.imageUrl) {
          const img = new Image();
          img.src = block.imageFill.imageUrl;
          if (img.complete) {
            // 텍스트를 검은색으로 그리기 (마스크)
            blockCtx.fillStyle = 'black';
            blockCtx.fillText(block.text, textX, textY);
            
            // 이미지 모양으로만 표시
            blockCtx.globalCompositeOperation = 'source-in';
            
            const imgWidth = img.width * block.imageFill.scale;
            const imgHeight = img.height * block.imageFill.scale;
            const imgX = textX + block.imageFill.offsetX - imgWidth / 2;
            const imgY = textY + block.imageFill.offsetY - imgHeight / 2;
            
            blockCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            blockCtx.globalCompositeOperation = 'source-over';
          } else {
            // 이미지 로딩 중 - 기본 색상 사용
            blockCtx.fillStyle = block.textColor;
            blockCtx.fillText(block.text, textX, textY);
          }
        } else {
          // 일반 텍스트 렌더링
          blockCtx.fillStyle = block.textColor;
          blockCtx.fillText(block.text, textX, textY);
        }
        
        // 블록 캔버스를 블록 텍스트 레이어에 그리기
        blockTextLayerCtx.drawImage(blockCanvas, 0, 0);
        
        // 질감 효과 처리
        if (block.texture.enabled && block.texture.imageUrl) {
          const textureImg = new Image();
          textureImg.src = block.texture.imageUrl;
          if (textureImg.complete) {
            // 질감용 임시 캔버스
            const blockTextureCanvas = document.createElement('canvas');
            blockTextureCanvas.width = canvas.width;
            blockTextureCanvas.height = canvas.height;
            const textureCtx = blockTextureCanvas.getContext('2d')!;
            
            // 텍스트를 검은색으로 마스크 생성
            textureCtx.fillStyle = 'black';
            textureCtx.font = blockTextLayerCtx.font;
            textureCtx.textBaseline = 'middle';
            textureCtx.textAlign = 'center';
            textureCtx.fillText(block.text, textX, textY);
            
            // 질감 이미지를 텍스트 모양으로만 표시
            textureCtx.globalCompositeOperation = 'source-in';
            
            const imgWidth = textureImg.width * block.texture.scale;
            const imgHeight = textureImg.height * block.texture.scale;
            const imgX = textX + block.texture.offsetX - imgWidth / 2;
            const imgY = textY + block.texture.offsetY - imgHeight / 2;
            
            textureCtx.drawImage(textureImg, imgX, imgY, imgWidth, imgHeight);
            textureCtx.globalCompositeOperation = 'source-over';
            
            // 질감을 블록 텍스트 레이어에 블렌딩
            blockTextLayerCtx.save();
            blockTextLayerCtx.globalCompositeOperation = block.texture.blendMode;
            blockTextLayerCtx.globalAlpha = block.texture.opacity;
            blockTextLayerCtx.drawImage(blockTextureCanvas, 0, 0);
            blockTextLayerCtx.restore();
          }
        }
      }
    });
    
    // 최종 합성: 그림자 -> 테두리 -> 텍스트 레이어
    // 그림자는 이미 메인 캔버스에 그려져 있음
    // 테두리도 이미 메인 캔버스에 그려져 있음
    // 텍스트 레이어 합성
    ctx.drawImage(blockTextLayerCanvas, 0, 0);
    
    return;
  }

  // 단일 모드 렌더링
  
  // 배경 이미지 먼저 그리기 (가장 뒤 레이어)
  if (effect.backgroundImage?.enabled && effect.backgroundImage.imageUrl) {
    const bgImg = new Image();
    bgImg.src = effect.backgroundImage.imageUrl;
    if (bgImg.complete) {
      ctx.save();
      ctx.globalAlpha = effect.backgroundImage.opacity;
      const imgWidth = bgImg.width * effect.backgroundImage.scale;
      const imgHeight = bgImg.height * effect.backgroundImage.scale;
      const imgX = centerX + effect.backgroundImage.offsetX - imgWidth / 2;
      const imgY = centerY + effect.backgroundImage.offsetY - imgHeight / 2;
      ctx.drawImage(bgImg, imgX, imgY, imgWidth, imgHeight);
      ctx.restore();
    }
  }
  
  ctx.font = `${effect.fontSize}px ${effect.fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  // 자간이 있으면 문자별 렌더링
  if (effect.letterSpacing !== 0) {
    const letters = effect.text.split('');
    const extraSpacing = effect.letterSpacing * effect.fontSize;
    
    // 총 너비 계산
    let totalWidth = 0;
    letters.forEach((char) => {
      totalWidth += ctx.measureText(char).width;
    });
    totalWidth += extraSpacing * (letters.length - 1);
    
    const startX = centerX - totalWidth / 2;
    let currentX = startX;
    
    // 그림자를 별도 캔버스에 그리기 (가장 뒤 레이어)
    let shadowCanvas: HTMLCanvasElement | null = null;
    if (effect.shadow.enabled) {
      shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = canvas.width;
      shadowCanvas.height = canvas.height;
      const shadowCtx = shadowCanvas.getContext('2d')!;
      shadowCtx.font = ctx.font;
      shadowCtx.textBaseline = 'middle';
      shadowCtx.textAlign = 'left';
      shadowCtx.fillStyle = effect.shadow.color;
      shadowCtx.shadowBlur = effect.shadow.blur * 2; // 블러 효과 강화
      shadowCtx.shadowColor = effect.shadow.color;
      
      letters.forEach((char) => {
        const charWidth = ctx.measureText(char).width;
        const baseX = currentX + effect.shadow.offsetX;
        const baseY = centerY + effect.shadow.offsetY;
        
        // 확산 효과를 위해 여러 방향으로 그림자 그리기
        if (effect.shadow.blur > 0) {
          const spread = Math.max(2, Math.ceil(effect.shadow.blur));
          shadowCtx.globalAlpha = 0.6;
          for (let dx = -spread; dx <= spread; dx++) {
            for (let dy = -spread; dy <= spread; dy++) {
              if (dx === 0 && dy === 0) continue;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance <= spread) {
                shadowCtx.globalAlpha = 0.5 * (1 - distance / (spread + 1));
                shadowCtx.fillText(char, baseX + dx, baseY + dy);
              }
            }
          }
        }
        
        // 메인 그림자
        shadowCtx.globalAlpha = 0.8;
        shadowCtx.fillText(char, baseX, baseY);
        
        currentX += charWidth + extraSpacing;
      });
    }
    
    // 테두리를 별도 캔버스에 그리기 (중간 레이어)
    let strokeCanvas: HTMLCanvasElement | null = null;
    if (effect.stroke.enabled) {
      currentX = startX; // 다시 초기화
      strokeCanvas = document.createElement('canvas');
      strokeCanvas.width = canvas.width;
      strokeCanvas.height = canvas.height;
      const strokeCtx = strokeCanvas.getContext('2d')!;
      strokeCtx.strokeStyle = effect.stroke.color;
      strokeCtx.lineWidth = effect.stroke.width;
      strokeCtx.lineJoin = 'round';
      strokeCtx.font = ctx.font;
      strokeCtx.textBaseline = 'middle';
      strokeCtx.textAlign = 'left';
      
      letters.forEach((char) => {
        const charWidth = ctx.measureText(char).width;
        strokeCtx.strokeText(char, currentX, centerY);
        currentX += charWidth + extraSpacing;
      });
    }
    
    // 텍스트/이미지/질감을 모두 담을 임시 캔버스 (가장 앞 레이어)
    const textLayerCanvas = document.createElement('canvas');
    textLayerCanvas.width = canvas.width;
    textLayerCanvas.height = canvas.height;
    const textLayerCtx = textLayerCanvas.getContext('2d')!;
    
    currentX = startX; // 다시 초기화
    
    letters.forEach((char) => {
      const charWidth = ctx.measureText(char).width;
      
      // 텍스트 렌더링을 위한 임시 캔버스
      const textCanvas = document.createElement('canvas');
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      const textCtx = textCanvas.getContext('2d')!;
      textCtx.font = ctx.font;
      textCtx.textBaseline = 'middle';
      textCtx.textAlign = 'left';
      
      // 이미지 채우기 또는 그라디언트/단색
      if (effect.imageFill.enabled && effect.imageFill.imageUrl) {
        const img = new Image();
        img.src = effect.imageFill.imageUrl;
        if (img.complete) {
          textCtx.fillStyle = 'black';
          textCtx.fillText(char, currentX, centerY);
          textCtx.globalCompositeOperation = 'source-in';
          
          const imgWidth = img.width * effect.imageFill.scale;
          const imgHeight = img.height * effect.imageFill.scale;
          const imgX = currentX + effect.imageFill.offsetX - imgWidth / 2;
          const imgY = centerY + effect.imageFill.offsetY - imgHeight / 2;
          
          textCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
          textCtx.globalCompositeOperation = 'source-over';
        } else {
          let fillStyle: string | CanvasGradient = effect.textColor;
          if (effect.useTextGradient && effect.gradient && effect.gradient.colors.length >= 2) {
            const gradient = effect.gradient.type === 'linear'
              ? createLinearGradient(textCtx, canvas.width, canvas.height, effect.gradient)
              : createRadialGradient(textCtx, canvas.width, canvas.height, effect.gradient);
            fillStyle = gradient;
          }
          textCtx.fillStyle = fillStyle;
          textCtx.fillText(char, currentX, centerY);
        }
      } else {
        let fillStyle: string | CanvasGradient = effect.textColor;
        if (effect.useTextGradient && effect.gradient && effect.gradient.colors.length >= 2) {
          const gradient = effect.gradient.type === 'linear'
            ? createLinearGradient(textCtx, canvas.width, canvas.height, effect.gradient)
            : createRadialGradient(textCtx, canvas.width, canvas.height, effect.gradient);
          fillStyle = gradient;
        }
        textCtx.fillStyle = fillStyle;
        textCtx.fillText(char, currentX, centerY);
      }
      
      // 텍스트 캔버스를 텍스트 레이어 캔버스에 그리기
      textLayerCtx.drawImage(textCanvas, 0, 0);
      
      // 질감 효과 처리 (텍스트 위에 블렌딩)
      if (effect.texture.enabled && effect.texture.imageUrl) {
        const textureImg = new Image();
        textureImg.src = effect.texture.imageUrl;
        if (textureImg.complete) {
          // 질감용 임시 캔버스
          const textureCanvas = document.createElement('canvas');
          textureCanvas.width = canvas.width;
          textureCanvas.height = canvas.height;
          const textureCtx = textureCanvas.getContext('2d')!;
          
          // 텍스트를 검은색으로 마스크 생성
          textureCtx.fillStyle = 'black';
          textureCtx.font = ctx.font;
          textureCtx.textBaseline = 'middle';
          textureCtx.textAlign = 'left';
          textureCtx.fillText(char, currentX, centerY);
          
          // 질감 이미지를 텍스트 모양으로만 표시
          textureCtx.globalCompositeOperation = 'source-in';
          
          const imgWidth = textureImg.width * effect.texture.scale;
          const imgHeight = textureImg.height * effect.texture.scale;
          const imgX = currentX + effect.texture.offsetX - imgWidth / 2;
          const imgY = centerY + effect.texture.offsetY - imgHeight / 2;
          
          textureCtx.drawImage(textureImg, imgX, imgY, imgWidth, imgHeight);
          textureCtx.globalCompositeOperation = 'source-over';
          
          // 질감을 텍스트 레이어 캔버스에 블렌딩
          textLayerCtx.save();
          textLayerCtx.globalCompositeOperation = effect.texture.blendMode;
          textLayerCtx.globalAlpha = effect.texture.opacity;
          textLayerCtx.drawImage(textureCanvas, 0, 0);
          textLayerCtx.restore();
        }
      }
      
      currentX += charWidth + extraSpacing;
    });
    
    // 최종 합성: 그림자 먼저, 그 다음 테두리, 마지막으로 텍스트 레이어
    if (shadowCanvas) {
      ctx.drawImage(shadowCanvas, 0, 0);
    }
    if (strokeCanvas) {
      ctx.drawImage(strokeCanvas, 0, 0);
    }
    ctx.drawImage(textLayerCanvas, 0, 0);
  } else {
    // 자간이 없으면 일반 렌더링
    // 그림자를 별도 캔버스에 그리기 (가장 뒤 레이어)
    let shadowCanvas: HTMLCanvasElement | null = null;
    if (effect.shadow.enabled) {
      shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = canvas.width;
      shadowCanvas.height = canvas.height;
      const shadowCtx = shadowCanvas.getContext('2d')!;
      shadowCtx.font = `${effect.fontSize}px ${effect.fontFamily}`;
      shadowCtx.textBaseline = 'middle';
      shadowCtx.textAlign = 'center';
      shadowCtx.fillStyle = effect.shadow.color;
      shadowCtx.shadowBlur = effect.shadow.blur * 2; // 블러 효과 강화
      shadowCtx.shadowColor = effect.shadow.color;
      
      const baseX = centerX + effect.shadow.offsetX;
      const baseY = centerY + effect.shadow.offsetY;
      
      // 확산 효과를 위해 여러 방향으로 그림자 그리기
      if (effect.shadow.blur > 0) {
        const spread = Math.max(2, Math.ceil(effect.shadow.blur));
        shadowCtx.globalAlpha = 0.6;
        for (let dx = -spread; dx <= spread; dx++) {
          for (let dy = -spread; dy <= spread; dy++) {
            if (dx === 0 && dy === 0) continue;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= spread) {
              shadowCtx.globalAlpha = 0.5 * (1 - distance / (spread + 1));
              shadowCtx.fillText(effect.text, baseX + dx, baseY + dy, maxWidth);
            }
          }
        }
      }
      
      // 메인 그림자
      shadowCtx.globalAlpha = 0.8;
      shadowCtx.fillText(effect.text, baseX, baseY, maxWidth);
    }
    
    // 테두리를 별도 캔버스에 그리기 (중간 레이어)
    let strokeCanvas: HTMLCanvasElement | null = null;
    if (effect.stroke.enabled) {
      strokeCanvas = document.createElement('canvas');
      strokeCanvas.width = canvas.width;
      strokeCanvas.height = canvas.height;
      const strokeCtx = strokeCanvas.getContext('2d')!;
      strokeCtx.strokeStyle = effect.stroke.color;
      strokeCtx.lineWidth = effect.stroke.width;
      strokeCtx.lineJoin = 'round';
      strokeCtx.font = `${effect.fontSize}px ${effect.fontFamily}`;
      strokeCtx.textBaseline = 'middle';
      strokeCtx.textAlign = 'center';
      strokeCtx.strokeText(effect.text, centerX, centerY, maxWidth);
      
    }
    
    // 텍스트/이미지/질감을 모두 담을 임시 캔버스 (가장 앞 레이어)
    const textLayerCanvas = document.createElement('canvas');
    textLayerCanvas.width = canvas.width;
    textLayerCanvas.height = canvas.height;
    const textLayerCtx = textLayerCanvas.getContext('2d')!;

    // 이미지 채우기
    if (effect.imageFill.enabled && effect.imageFill.imageUrl) {
      const img = new Image();
      img.src = effect.imageFill.imageUrl;
      if (img.complete) {
        // 텍스트를 검은색으로 그리기 (마스크)
        textLayerCtx.fillStyle = 'black';
        textLayerCtx.font = `${effect.fontSize}px ${effect.fontFamily}`;
        textLayerCtx.textBaseline = 'middle';
        textLayerCtx.textAlign = 'center';
        textLayerCtx.fillText(effect.text, centerX, centerY, maxWidth);
        
        // 이미지 모양으로만 표시
        textLayerCtx.globalCompositeOperation = 'source-in';
        
        const imgWidth = img.width * effect.imageFill.scale;
        const imgHeight = img.height * effect.imageFill.scale;
        const imgX = centerX + effect.imageFill.offsetX - imgWidth / 2;
        const imgY = centerY + effect.imageFill.offsetY - imgHeight / 2;
        
        textLayerCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        textLayerCtx.globalCompositeOperation = 'source-over';
      } else {
        // 이미지 로딩 중
        let fillStyle: string | CanvasGradient = effect.textColor;
        if (effect.useTextGradient && effect.gradient && effect.gradient.colors.length >= 2) {
          const gradient = effect.gradient.type === 'linear'
            ? createLinearGradient(textLayerCtx, canvas.width, canvas.height, effect.gradient)
            : createRadialGradient(textLayerCtx, canvas.width, canvas.height, effect.gradient);
          fillStyle = gradient;
        }
        textLayerCtx.font = `${effect.fontSize}px ${effect.fontFamily}`;
        textLayerCtx.textBaseline = 'middle';
        textLayerCtx.textAlign = 'center';
        textLayerCtx.fillStyle = fillStyle;
        textLayerCtx.fillText(effect.text, centerX, centerY, maxWidth);
      }
    } else {
      // 일반 텍스트 렌더링
      let fillStyle: string | CanvasGradient = effect.textColor;
      if (effect.useTextGradient && effect.gradient && effect.gradient.colors.length >= 2) {
        const gradient = effect.gradient.type === 'linear'
          ? createLinearGradient(textLayerCtx, canvas.width, canvas.height, effect.gradient)
          : createRadialGradient(textLayerCtx, canvas.width, canvas.height, effect.gradient);
        fillStyle = gradient;
      }
      textLayerCtx.font = `${effect.fontSize}px ${effect.fontFamily}`;
      textLayerCtx.textBaseline = 'middle';
      textLayerCtx.textAlign = 'center';
      textLayerCtx.fillStyle = fillStyle;
      textLayerCtx.fillText(effect.text, centerX, centerY, maxWidth);
    }
    
    // 질감 효과 처리 (텍스트 위에 블렌딩)
    if (effect.texture.enabled && effect.texture.imageUrl) {
      const textureImg = new Image();
      textureImg.src = effect.texture.imageUrl;
      if (textureImg.complete) {
        // 질감용 임시 캔버스
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = canvas.width;
        textureCanvas.height = canvas.height;
        const textureCtx = textureCanvas.getContext('2d')!;
        
        // 텍스트를 검은색으로 마스크 생성
        textureCtx.fillStyle = 'black';
        textureCtx.font = `${effect.fontSize}px ${effect.fontFamily}`;
        textureCtx.textBaseline = 'middle';
        textureCtx.textAlign = 'center';
        textureCtx.fillText(effect.text, centerX, centerY, maxWidth);
        
        // 질감 이미지를 텍스트 모양으로만 표시
        textureCtx.globalCompositeOperation = 'source-in';
        
        const imgWidth = textureImg.width * effect.texture.scale;
        const imgHeight = textureImg.height * effect.texture.scale;
        const imgX = centerX + effect.texture.offsetX - imgWidth / 2;
        const imgY = centerY + effect.texture.offsetY - imgHeight / 2;
        
        textureCtx.drawImage(textureImg, imgX, imgY, imgWidth, imgHeight);
        textureCtx.globalCompositeOperation = 'source-over';
        
        // 질감을 텍스트 레이어 캔버스에 블렌딩
        textLayerCtx.save();
        textLayerCtx.globalCompositeOperation = effect.texture.blendMode;
        textLayerCtx.globalAlpha = effect.texture.opacity;
        textLayerCtx.drawImage(textureCanvas, 0, 0);
        textLayerCtx.restore();
      }
    }
    
    // 최종 합성: 그림자 먼저, 그 다음 테두리, 마지막으로 텍스트 레이어
    if (shadowCanvas) {
      ctx.drawImage(shadowCanvas, 0, 0);
    }
    if (strokeCanvas) {
      ctx.drawImage(strokeCanvas, 0, 0);
    }
    ctx.drawImage(textLayerCanvas, 0, 0);
  }
}

function createLinearGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gradient: { angle?: number; colors: string[] }
): CanvasGradient {
  const angle = gradient.angle || 0;
  const angleRad = (angle * Math.PI) / 180;
  
  const diagonal = Math.sqrt(width ** 2 + height ** 2);
  const halfDiag = diagonal / 2;
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  const startX = centerX - halfDiag * Math.cos(angleRad);
  const startY = centerY - halfDiag * Math.sin(angleRad);
  const endX = centerX + halfDiag * Math.cos(angleRad);
  const endY = centerY + halfDiag * Math.sin(angleRad);
  
  const grad = ctx.createLinearGradient(startX, startY, endX, endY);
  
  gradient.colors.forEach((color, index) => {
    const stop = index / (gradient.colors.length - 1);
    grad.addColorStop(stop, color);
  });
  
  return grad;
}

function createRadialGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gradient: { colors: string[] }
): CanvasGradient {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  
  const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  
  gradient.colors.forEach((color, index) => {
    const stop = index / (gradient.colors.length - 1);
    grad.addColorStop(stop, color);
  });
  
  return grad;
}


