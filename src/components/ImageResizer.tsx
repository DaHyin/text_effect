import { useState, useRef, useEffect } from 'react';
import type { ImageData, ImageResizerTabType } from '../types/imageResizer';
import { calculateRecommendedRatio, cleanupImageData, parseRatio } from '../utils/imageResizerUtils';
import { downloadImage, downloadCurrentTabImages, downloadCurrentTabAsZip } from '../utils/imageResizerDownload';
import './ImageResizer.css';

export function ImageResizer() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentTab, setCurrentTab] = useState<ImageResizerTabType>('recommend');
  const [currentRatio, setCurrentRatio] = useState<{ width: number; height: number }>({ width: 1, height: 1 });
  const [ratioInput, setRatioInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지들을 로드하는 함수
  const loadImages = (files: File[]) => {
    const imageList: ImageData[] = [];
    
    images.forEach(imageData => {
      cleanupImageData(imageData);
    });
    
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`파일 "${file.name}"이 너무 큽니다. (최대 10MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`파일 "${file.name}"은 이미지 파일이 아닙니다.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      alert('유효한 이미지 파일이 없습니다.');
      return;
    }
    
    let loadedCount = 0;
    
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const recommendedRatio = calculateRecommendedRatio(img.width, img.height);
          const imageData: ImageData = {
            id: index,
            name: file.name,
            originalImage: img,
            squareCanvas: null,
            resizeCanvas: null,
            ratioCanvas: null,
            recommendedRatio: recommendedRatio
          };
          
          imageList.push(imageData);
          loadedCount++;
          
          if (loadedCount === validFiles.length) {
            setImages(imageList);
          }
        };
        img.onerror = () => {
          alert(`이미지 "${file.name}" 로드에 실패했습니다.`);
          loadedCount++;
          if (loadedCount === validFiles.length && imageList.length > 0) {
            setImages(imageList);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        alert(`파일 "${file.name}" 읽기에 실패했습니다.`);
        loadedCount++;
        if (loadedCount === validFiles.length && imageList.length > 0) {
          setImages(imageList);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 원본 이미지를 표시하는 함수
  const displayOriginalImage = (imageData: ImageData, canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    canvas.width = imageData.originalImage.width;
    canvas.height = imageData.originalImage.height;
    
    ctx.drawImage(imageData.originalImage, 0, 0);
  };

  // 개별 이미지를 1:1 비율로 변환하는 함수
  const convertToSquare = (imageId: number, retryCount = 0) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setImages(prev => {
          const imageData = prev.find(img => img.id === imageId);
          if (!imageData) return prev;

          const canvas = document.getElementById(`square-${imageId}`) as HTMLCanvasElement;
          if (!canvas) {
            // 최대 5번까지 재시도
            if (retryCount < 5) {
              setTimeout(() => convertToSquare(imageId, retryCount + 1), 100);
            }
            return prev;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) return prev;
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          const size = Math.max(imageData.originalImage.width, imageData.originalImage.height);
          
          canvas.width = size;
          canvas.height = size;
          
          ctx.clearRect(0, 0, size, size);
          
          const x = (size - imageData.originalImage.width) / 2;
          const y = (size - imageData.originalImage.height) / 2;
          
          ctx.drawImage(imageData.originalImage, x, y);
          
          return prev.map(img => 
            img.id === imageId ? { ...img, squareCanvas: canvas } : img
          );
        });
      });
    });
  };

  // 개별 이미지를 480x720으로 변환하는 함수
  const convertTo480x720 = (imageId: number, retryCount = 0) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setImages(prev => {
          const imageData = prev.find(img => img.id === imageId);
          if (!imageData) return prev;

          const canvas = document.getElementById(`resize-${imageId}`) as HTMLCanvasElement;
          if (!canvas) {
            // 최대 5번까지 재시도
            if (retryCount < 5) {
              setTimeout(() => convertTo480x720(imageId, retryCount + 1), 100);
            }
            return prev;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) return prev;
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          const targetWidth = 480;
          const targetHeight = 720;
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          
          const imgRatio = imageData.originalImage.width / imageData.originalImage.height;
          const targetRatio = targetWidth / targetHeight;
          
          let drawWidth, drawHeight, x, y;
          
          if (imgRatio > targetRatio) {
            drawWidth = targetWidth;
            drawHeight = targetWidth / imgRatio;
            x = 0;
            y = targetHeight - drawHeight;
          } else {
            drawHeight = targetHeight;
            drawWidth = targetHeight * imgRatio;
            x = (targetWidth - drawWidth) / 2;
            y = 0;
          }
          
          ctx.drawImage(imageData.originalImage, x, y, drawWidth, drawHeight);
          
          return prev.map(img => 
            img.id === imageId ? { ...img, resizeCanvas: canvas } : img
          );
        });
      });
    });
  };

  // 개별 이미지를 비율로 변환하는 함수
  const convertToRatio = (imageId: number, customRatio?: { width: number; height: number }, retryCount = 0) => {
    let ratio: { width: number; height: number };
    
    if (customRatio) {
      ratio = customRatio;
      setCurrentRatio(ratio);
    } else {
      const ratioInputValue = ratioInput.trim();
      if (!ratioInputValue) {
        alert('비율을 입력해주세요 (예: 1:3, 2:1)');
        return;
      }
      try {
        ratio = parseRatio(ratioInputValue);
        setCurrentRatio(ratio);
      } catch (error) {
        alert((error as Error).message);
        return;
      }
    }
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setImages(prev => {
          const imageData = prev.find(img => img.id === imageId);
          if (!imageData) return prev;

          const canvas = document.getElementById(`ratio-${imageId}`) as HTMLCanvasElement;
          if (!canvas) {
            // 최대 5번까지 재시도
            if (retryCount < 5) {
              setTimeout(() => convertToRatio(imageId, customRatio, retryCount + 1), 100);
            }
            return prev;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) return prev;
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          const baseSize = 24;
          const targetWidth = ratio.width * baseSize;
          const targetHeight = ratio.height * baseSize;
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          
          const imgRatio = imageData.originalImage.width / imageData.originalImage.height;
          const targetRatio = targetWidth / targetHeight;
          
          let drawWidth, drawHeight, x, y;
          
          if (imgRatio > targetRatio) {
            drawWidth = targetWidth;
            drawHeight = targetWidth / imgRatio;
            x = 0;
            y = targetHeight - drawHeight;
          } else {
            drawHeight = targetHeight;
            drawWidth = targetHeight * imgRatio;
            x = (targetWidth - drawWidth) / 2;
            y = 0;
          }
          
          ctx.drawImage(imageData.originalImage, x, y, drawWidth, drawHeight);
          
          return prev.map(img => 
            img.id === imageId ? { ...img, ratioCanvas: canvas } : img
          );
        });
      });
    });
  };

  // 추천 비율을 적용하는 함수
  const applyRecommendedRatio = (imageId: number, retryCount = 0) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setImages(prev => {
          const imageData = prev.find(img => img.id === imageId);
          if (!imageData || !imageData.recommendedRatio) return prev;

          const ratio = imageData.recommendedRatio!;
          
          const canvas = document.getElementById(`ratio-${imageId}`) as HTMLCanvasElement;
          if (!canvas) {
            // 최대 5번까지 재시도
            if (retryCount < 5) {
              setTimeout(() => applyRecommendedRatio(imageId, retryCount + 1), 100);
            }
            return prev;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) return prev;
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          const baseSize = 24;
          const targetWidth = ratio.width * baseSize;
          const targetHeight = ratio.height * baseSize;
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          
          const imgRatio = imageData.originalImage.width / imageData.originalImage.height;
          const targetRatio = targetWidth / targetHeight;
          
          let drawWidth, drawHeight, x, y;
          
          if (imgRatio > targetRatio) {
            drawWidth = targetWidth;
            drawHeight = targetWidth / imgRatio;
            x = 0;
            y = targetHeight - drawHeight;
          } else {
            drawHeight = targetHeight;
            drawWidth = targetHeight * imgRatio;
            x = (targetWidth - drawWidth) / 2;
            y = 0;
          }
          
          ctx.drawImage(imageData.originalImage, x, y, drawWidth, drawHeight);
          
          return prev.map(img => 
            img.id === imageId ? { ...img, ratioCanvas: canvas } : img
          );
        });
      });
    });
  };

  // 모든 이미지를 1:1 비율로 변환
  const convertAllToSquare = () => {
    images.forEach(imageData => {
      convertToSquare(imageData.id);
    });
  };

  // 모든 이미지를 480x720으로 변환
  const convertAllTo480x720 = () => {
    images.forEach(imageData => {
      convertTo480x720(imageData.id);
    });
  };

  // 모든 이미지를 비율로 변환
  const convertAllToRatio = () => {
    const ratioInputValue = ratioInput.trim();
    if (!ratioInputValue) {
      alert('비율을 입력해주세요 (예: 1:3, 2:1)');
      return;
    }

    try {
      const ratio = parseRatio(ratioInputValue);
      images.forEach(imageData => {
        convertToRatio(imageData.id, ratio);
      });
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // 모든 추천 비율을 적용
  const applyAllRecommendedRatios = () => {
    images.forEach((imageData) => {
      if (imageData.recommendedRatio) {
        applyRecommendedRatio(imageData.id);
      }
    });
  };

  // 이미지를 제거하는 함수
  const removeImage = (imageId: number) => {
    const imageData = images.find(img => img.id === imageId);
    if (imageData) {
      cleanupImageData(imageData);
    }
    
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  // 다운로드 버튼 활성화 여부 확인
  const hasConvertedImages = () => {
    switch (currentTab) {
      case 'recommend':
        return images.some(img => img.ratioCanvas && img.recommendedRatio);
      case 'square':
        return images.some(img => img.squareCanvas);
      case 'resize':
        return images.some(img => img.resizeCanvas);
      case 'custom':
        return images.some(img => img.ratioCanvas);
      default:
        return false;
    }
  };

  // 이미지 로드 후 원본 표시 및 자동 변환
  useEffect(() => {
    if (images.length === 0) return;
    
    // DOM이 완전히 렌더링될 때까지 대기
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          images.forEach(imageData => {
            // 원본 표시
            displayOriginalImage(imageData, `original-${imageData.id}`);
            
            // 자동으로 각 변환 미리보기 생성
            convertToSquare(imageData.id);
            convertTo480x720(imageData.id);
            
            // 추천 비율이 있으면 자동 적용
            if (imageData.recommendedRatio) {
              applyRecommendedRatio(imageData.id);
            }
          });
        });
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [images]);

  return (
    <div className="image-resizer">
      <div className="image-resizer-content">
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                loadImages(files);
              }
            }}
          />
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            📁 이미지 여러개 선택하기
          </button>
          <div className="info-box">
            <h4>📋 기능 안내</h4>
            <ul>
              <li><strong>다중 선택:</strong> Ctrl/Cmd 키를 누른 상태로 여러 이미지 선택 가능</li>
              <li><strong>탭 기능:</strong> 각 변환 기능을 탭으로 구분하여 선택 가능</li>
              <li><strong>고품질 처리:</strong> 다단계 리샘플링으로 이미지 손실 최소화</li>
              <li><strong>무손실 저장:</strong> PNG 형식으로 최고 품질 저장</li>
            </ul>
          </div>
        </div>

        <div className="image-list">
          {images.map((imageData) => (
            <div key={imageData.id} className="image-item">
              <h4>📷 {imageData.name} ({imageData.originalImage.width}×{imageData.originalImage.height})</h4>
              {imageData.recommendedRatio && (
                <div className="recommendation-box">
                  <span className="recommendation-text">
                    💡 추천 비율: <strong>{imageData.recommendedRatio.width}:{imageData.recommendedRatio.height}</strong> ({imageData.recommendedRatio.width * 24}×{imageData.recommendedRatio.height * 24}px)
                  </span>
                  <button
                    className="recommendation-btn"
                    onClick={() => applyRecommendedRatio(imageData.id)}
                  >
                    🎯 추천 비율 적용
                  </button>
                </div>
              )}
              <div className="image-preview-grid">
                <div className="preview-item">
                  <h5>원본</h5>
                  <canvas id={`original-${imageData.id}`} className="preview-canvas"></canvas>
                </div>
                <div className="preview-item">
                  <h5>1:1 비율</h5>
                  <canvas id={`square-${imageData.id}`} className="preview-canvas"></canvas>
                </div>
                <div className="preview-item">
                  <h5>480x720</h5>
                  <canvas id={`resize-${imageData.id}`} className="preview-canvas"></canvas>
                </div>
                <div className="preview-item">
                  <h5>비율 변환</h5>
                  <canvas id={`ratio-${imageData.id}`} className="preview-canvas"></canvas>
                </div>
              </div>
              <div className="image-controls">
                <button className="control-btn" onClick={() => convertToSquare(imageData.id)}>
                  🔲 1:1 변환
                </button>
                <button className="control-btn" onClick={() => convertTo480x720(imageData.id)}>
                  📏 480x720 변환
                </button>
                <button className="control-btn" onClick={() => convertToRatio(imageData.id)}>
                  📐 비율 변환
                </button>
                <button
                  className="control-btn download-btn"
                  onClick={() => downloadImage(imageData, 'square', currentRatio)}
                  disabled={!imageData.squareCanvas}
                >
                  💾 1:1 다운로드
                </button>
                <button
                  className="control-btn download-btn"
                  onClick={() => downloadImage(imageData, 'resize', currentRatio)}
                  disabled={!imageData.resizeCanvas}
                >
                  💾 480x720 다운로드
                </button>
                <button
                  className="control-btn download-btn"
                  onClick={() => downloadImage(imageData, 'ratio', currentRatio)}
                  disabled={!imageData.ratioCanvas}
                >
                  💾 비율 다운로드
                </button>
                <button
                  className="control-btn remove-btn"
                  onClick={() => removeImage(imageData.id)}
                >
                  🗑️ 제거
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 탭 시스템 */}
        <div className="tab-container">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${currentTab === 'recommend' ? 'active' : ''}`}
              onClick={() => setCurrentTab('recommend')}
            >
              🎯 추천 비율
            </button>
            <button
              className={`tab-btn ${currentTab === 'square' ? 'active' : ''}`}
              onClick={() => setCurrentTab('square')}
            >
              🔲 1:1 비율
            </button>
            <button
              className={`tab-btn ${currentTab === 'resize' ? 'active' : ''}`}
              onClick={() => setCurrentTab('resize')}
            >
              📏 480x720
            </button>
            <button
              className={`tab-btn ${currentTab === 'custom' ? 'active' : ''}`}
              onClick={() => setCurrentTab('custom')}
            >
              📐 커스텀 비율
            </button>
          </div>

          {/* 추천 비율 탭 */}
          <div className={`tab-content ${currentTab === 'recommend' ? 'active' : ''}`}>
            <div className="tab-header">
              <h3>🎯 자동 추천 비율 변환</h3>
              <p>이미지 업로드 시 자동으로 24px 단위의 최적 비율을 추천합니다.</p>
            </div>
            <div className="tab-controls">
              <button
                className="control-btn"
                onClick={applyAllRecommendedRatios}
                disabled={images.length === 0}
              >
                🎯 모든 추천 비율 적용
              </button>
            </div>
          </div>

          {/* 1:1 비율 탭 */}
          <div className={`tab-content ${currentTab === 'square' ? 'active' : ''}`}>
            <div className="tab-header">
              <h3>🔲 1:1 정사각형 변환</h3>
              <p>이미지를 정사각형으로 변환합니다. 긴 쪽을 기준으로 하며 빈 공간은 투명하게 처리됩니다.</p>
            </div>
            <div className="tab-controls">
              <button
                className="control-btn"
                onClick={convertAllToSquare}
                disabled={images.length === 0}
              >
                🔲 모든 이미지를 1:1 비율로 변환
              </button>
            </div>
          </div>

          {/* 480x720 탭 */}
          <div className={`tab-content ${currentTab === 'resize' ? 'active' : ''}`}>
            <div className="tab-header">
              <h3>📏 480x720 크기 변환</h3>
              <p>이미지를 480x720 픽셀 크기로 변환합니다. 아래 정렬되며 빈 공간은 투명하게 처리됩니다.</p>
            </div>
            <div className="tab-controls">
              <button
                className="control-btn"
                onClick={convertAllTo480x720}
                disabled={images.length === 0}
              >
                📏 모든 이미지를 480x720으로 변환
              </button>
            </div>
          </div>

          {/* 커스텀 비율 탭 */}
          <div className={`tab-content ${currentTab === 'custom' ? 'active' : ''}`}>
            <div className="tab-header">
              <h3>📐 커스텀 비율 변환</h3>
              <p>원하는 비율을 입력하여 24px 단위로 변환합니다. (예: 1:3 → 24x72px)</p>
            </div>
            <div className="tab-controls">
              <div className="ratio-input-section">
                <label htmlFor="ratioInput">비율 입력 (예: 1:3, 2:1):</label>
                <input
                  type="text"
                  id="ratioInput"
                  value={ratioInput}
                  onChange={(e) => setRatioInput(e.target.value)}
                  placeholder="1:3"
                  className="ratio-input"
                />
                <button
                  className="control-btn"
                  onClick={convertAllToRatio}
                  disabled={images.length === 0}
                >
                  📐 비율로 변환
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 다운로드 섹션 */}
        <div className="download-section">
          <h3>💾 다운로드</h3>
          <p>현재 탭에서 변환된 이미지를 다운로드할 수 있습니다.</p>
          <ul className="download-info">
            <li><strong>📁 개별 파일:</strong> 각 이미지를 별도 파일로 다운로드 (브라우저가 여러 파일을 차단할 수 있음)</li>
            <li><strong>📦 ZIP 파일:</strong> 모든 이미지를 하나의 압축 파일로 다운로드 (권장)</li>
          </ul>
          <div className="download-controls">
            <button
              className="control-btn"
              onClick={() => downloadCurrentTabImages(images, currentTab, currentRatio)}
              disabled={!hasConvertedImages()}
            >
              📁 개별 파일로 다운로드
            </button>
            <button
              className="control-btn"
              onClick={() => downloadCurrentTabAsZip(images, currentTab, currentRatio)}
              disabled={!hasConvertedImages()}
            >
              📦 한 번에 ZIP으로 다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


