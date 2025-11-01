import React, { useRef } from 'react';
import './EffectPanel.css';
import './FontSelector.css';
import type { TextEffect } from '../types';

interface BlockEffectPanelProps {
  effect: TextEffect;
  blockIndex: number;
  onChange: (effect: Partial<TextEffect>) => void;
}

export function BlockEffectPanel({ effect, blockIndex, onChange }: BlockEffectPanelProps) {
  const block = effect.textBlocks?.[blockIndex];
  const [isFontOpen, setIsFontOpen] = React.useState(false);
  const [customFonts, setCustomFonts] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const updateCustomFonts = () => {
      document.fonts.ready.then(() => {
        const allFonts = Array.from(document.fonts);
        const popularFonts = ['Noto Sans KR', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Poppins', 'Oswald', 'Raleway', 'Merriweather'];
        const customFontNames = allFonts
          .map(font => font.family)
          .filter(name => !popularFonts.some(pf => pf === name));
        setCustomFonts([...new Set(customFontNames)]);
      });
    };
    updateCustomFonts();
    const interval = setInterval(updateCustomFonts, 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!block) {
    return <div>블록을 선택해주세요.</div>;
  }
  
  const handleBlockChange = (updates: Partial<typeof block>) => {
    const newBlocks = effect.textBlocks?.map((b, idx) =>
      idx === blockIndex ? { ...b, ...updates } : b
    );
    onChange({ textBlocks: newBlocks });
  };
  
  const handleGlobalChange = (updates: Partial<TextEffect>) => {
    onChange(updates);
  };
  
  const handleStrokeChange = (updates: Partial<typeof block.stroke>) => {
    handleBlockChange({
      stroke: { ...block.stroke, ...updates }
    });
  };
  
  const handleImageFillChange = (updates: Partial<typeof block.imageFill>) => {
    handleBlockChange({
      imageFill: { ...block.imageFill, ...updates }
    });
  };
  
  const handleTextureChange = (updates: Partial<typeof block.texture>) => {
    handleBlockChange({
      texture: { ...block.texture, ...updates }
    });
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      handleImageFillChange({ imageUrl, enabled: true });
    };
    reader.readAsDataURL(file);
  };
  
  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      handleTextureChange({ imageUrl, enabled: true });
    };
    reader.readAsDataURL(file);
  };

  const popularFonts = [
    { name: 'Noto Sans KR', displayName: 'Noto Sans KR' },
    { name: 'Roboto', displayName: 'Roboto' },
    { name: 'Open Sans', displayName: 'Open Sans' },
    { name: 'Lato', displayName: 'Lato' },
    { name: 'Montserrat', displayName: 'Montserrat' },
    { name: 'Playfair Display', displayName: 'Playfair Display' },
    { name: 'Poppins', displayName: 'Poppins' },
    { name: 'Oswald', displayName: 'Oswald' },
    { name: 'Raleway', displayName: 'Raleway' },
    { name: 'Merriweather', displayName: 'Merriweather' },
  ];
  
  const allFonts = [...popularFonts, ...customFonts.map(name => ({ name, displayName: name }))];

  return (
    <div>
      {/* 블록별 효과 섹션 */}
      <div className="effect-group-section">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
          블록 {blockIndex + 1} 효과
        </h3>
        
        {/* 폰트 선택 */}
        <div style={{ marginBottom: '1rem' }}>
          <label className="font-selector-label">폰트 선택</label>
          <div className="font-selector">
            <button
              type="button"
              className="font-selector-button"
              onClick={() => setIsFontOpen(!isFontOpen)}
            >
              {block.fontFamily}
              <span className={`font-selector-arrow ${isFontOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>
            {isFontOpen && (
              <div className="font-selector-dropdown">
                {customFonts.length > 0 && (
                  <div className="font-selector-category">
                    <span className="font-selector-category-title">🎨 커스텀 폰트</span>
                  </div>
                )}
                {customFonts.map((fontName) => (
                  <button
                    key={fontName}
                    type="button"
                    className={`font-selector-option ${
                      block.fontFamily === fontName ? 'active' : ''
                    }`}
                    onClick={() => {
                      handleBlockChange({ fontFamily: fontName });
                      setIsFontOpen(false);
                    }}
                  >
                    <span style={{ fontFamily: fontName }}>
                      {fontName}
                    </span>
                  </button>
                ))}
                
                {customFonts.length > 0 && (
                  <div className="font-selector-category">
                    <span className="font-selector-category-title">📚 Google Fonts</span>
                  </div>
                )}
                {popularFonts.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    className={`font-selector-option ${
                      block.fontFamily === font.name ? 'active' : ''
                    }`}
                    onClick={() => {
                      handleBlockChange({ fontFamily: font.name });
                      setIsFontOpen(false);
                    }}
                  >
                    <span style={{ fontFamily: font.name }}>
                      {font.displayName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 테두리 */}
        <div className="effect-group">
          <label className="effect-checkbox-label">
            <input
              type="checkbox"
              checked={block.stroke.enabled}
              onChange={(e) => handleStrokeChange({ enabled: e.target.checked })}
              className="effect-checkbox"
            />
            테두리 효과
          </label>
          
          {block.stroke.enabled && (
            <>
              <div className="effect-row-3col">
                <div className="effect-group-inline">
                  <label className="effect-label">테두리 색상</label>
                  <input
                    type="color"
                    value={block.stroke.color}
                    onChange={(e) => handleStrokeChange({ color: e.target.value })}
                    className="effect-color"
                  />
                </div>
                <div className="effect-group-inline">
                  <label className="effect-label">
                    테두리 두께: {block.stroke.width}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={block.stroke.width}
                    onChange={(e) => handleStrokeChange({ width: Number(e.target.value) })}
                    className="effect-slider"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      
      {/* 이미지 채우기 */}
      <div className="effect-group">
        <label className="effect-checkbox-label">
          <input
            type="checkbox"
            checked={block.imageFill.enabled}
            onChange={(e) => handleImageFillChange({ enabled: e.target.checked })}
            className="effect-checkbox"
          />
          이미지 채우기
        </label>
        
        {block.imageFill.enabled && (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id={`block-image-upload-${blockIndex}`}
              />
              <button
                type="button"
                onClick={() => document.getElementById(`block-image-upload-${blockIndex}`)?.click()}
                className="effect-button"
              >
                이미지 업로드
              </button>
            </div>
            
            {block.imageFill.imageUrl && (
              <>
                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      X: {block.imageFill.offsetX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={block.imageFill.offsetX}
                      onChange={(e) => handleImageFillChange({ offsetX: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      Y: {block.imageFill.offsetY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={block.imageFill.offsetY}
                      onChange={(e) => handleImageFillChange({ offsetY: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      크기: {block.imageFill.scale}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={block.imageFill.scale}
                      onChange={(e) => handleImageFillChange({ scale: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {/* 질감 효과 */}
      <div className="effect-group">
        <label className="effect-checkbox-label">
          <input
            type="checkbox"
            checked={block.texture.enabled}
            onChange={(e) => handleTextureChange({ enabled: e.target.checked })}
            className="effect-checkbox"
          />
          질감 효과
        </label>
        
        {block.texture.enabled && (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleTextureUpload}
                style={{ display: 'none' }}
                id={`block-texture-upload-${blockIndex}`}
              />
              <button
                type="button"
                onClick={() => document.getElementById(`block-texture-upload-${blockIndex}`)?.click()}
                className="effect-button"
              >
                질감 이미지 업로드
              </button>
            </div>
            
            {block.texture.imageUrl && (
              <>
                <div className="effect-group-inline" style={{ marginBottom: '0.5rem' }}>
                  <label className="effect-label">블렌딩 모드</label>
                  <select
                    value={block.texture.blendMode}
                    onChange={(e) => handleTextureChange({ blendMode: e.target.value as any })}
                    className="effect-select"
                  >
                    <option value="screen">밝게</option>
                    <option value="multiply">어둡게</option>
                    <option value="overlay">오버레이</option>
                  </select>
                </div>
                
                <div className="effect-group-inline" style={{ marginBottom: '0.5rem' }}>
                  <label className="effect-label">
                    불투명도: {Math.round(block.texture.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={block.texture.opacity}
                    onChange={(e) => handleTextureChange({ opacity: Number(e.target.value) })}
                    className="effect-slider"
                  />
                </div>
                
                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      X: {block.texture.offsetX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={block.texture.offsetX}
                      onChange={(e) => handleTextureChange({ offsetX: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      Y: {block.texture.offsetY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={block.texture.offsetY}
                      onChange={(e) => handleTextureChange({ offsetY: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      크기: {block.texture.scale}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={block.texture.scale}
                      onChange={(e) => handleTextureChange({ scale: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}

