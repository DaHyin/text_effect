import React from 'react';
import './EffectPanel.css';
import type { TextEffect } from '../types';

interface GlobalEffectPanelProps {
  effect: TextEffect;
  onChange: (effect: Partial<TextEffect>) => void;
}

export function GlobalEffectPanel({ effect, onChange }: GlobalEffectPanelProps) {
  const handleGlobalChange = (updates: Partial<TextEffect>) => {
    onChange(updates);
  };

  const handleBackgroundImageChange = (updates: Partial<typeof effect.backgroundImage>) => {
    handleGlobalChange({
      backgroundImage: { ...effect.backgroundImage, ...updates }
    });
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      handleBackgroundImageChange({ imageUrl, enabled: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="effect-group-section" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
        전역 효과
      </h3>
      
      {/* 캔버스 크기 (24px 단위) */}
      <div className="effect-group">
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#666' }}>
          캔버스 크기 (24px 단위)
        </h4>
        <div className="effect-row-3col">
          <div className="effect-group-inline">
            <label className="effect-label">
              가로: {effect.gridCols}칸 ({effect.gridCols * 24}px)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={effect.gridCols}
              onChange={(e) => handleGlobalChange({ gridCols: Number(e.target.value) })}
              className="effect-slider"
            />
          </div>

          <div className="effect-group-inline">
            <label className="effect-label">
              세로: {effect.gridRows}칸 ({effect.gridRows * 24}px)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={effect.gridRows}
              onChange={(e) => handleGlobalChange({ gridRows: Number(e.target.value) })}
              className="effect-slider"
            />
          </div>
        </div>
      </div>
      
      {/* 그림자 효과 */}
      <div className="effect-group">
        <label className="effect-checkbox-label">
          <input
            type="checkbox"
            checked={effect.shadow.enabled}
            onChange={(e) => handleGlobalChange({ shadow: { ...effect.shadow, enabled: e.target.checked } })}
            className="effect-checkbox"
          />
          그림자 효과
        </label>
        
        {effect.shadow.enabled && (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                그림자 색상
              </label>
              <input
                type="color"
                value={effect.shadow.color}
                onChange={(e) => handleGlobalChange({ shadow: { ...effect.shadow, color: e.target.value } })}
                className="effect-color"
              />
            </div>
            
            <div className="effect-row-3col">
              <div className="effect-group-inline">
                <label className="effect-label">
                  그림자 블러: {effect.shadow.blur}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={effect.shadow.blur}
                  onChange={(e) => handleGlobalChange({ shadow: { ...effect.shadow, blur: Number(e.target.value) } })}
                  className="effect-slider"
                />
              </div>
              <div className="effect-group-inline">
                <label className="effect-label">
                  그림자 X: {effect.shadow.offsetX}px
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={effect.shadow.offsetX}
                  onChange={(e) => handleGlobalChange({ shadow: { ...effect.shadow, offsetX: Number(e.target.value) } })}
                  className="effect-slider"
                />
              </div>
              <div className="effect-group-inline">
                <label className="effect-label">
                  그림자 Y: {effect.shadow.offsetY}px
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={effect.shadow.offsetY}
                  onChange={(e) => handleGlobalChange({ shadow: { ...effect.shadow, offsetY: Number(e.target.value) } })}
                  className="effect-slider"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 배경 이미지 */}
      <div className="effect-group">
        <label className="effect-checkbox-label">
          <input
            type="checkbox"
            checked={effect.backgroundImage.enabled}
            onChange={(e) => handleBackgroundImageChange({ enabled: e.target.checked })}
            className="effect-checkbox"
          />
          배경 이미지
        </label>
        
        {effect.backgroundImage.enabled && (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                style={{ display: 'none' }}
                id="background-image-upload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('background-image-upload')?.click()}
                className="effect-button"
              >
                배경 이미지 선택
              </button>
            </div>
            
            {effect.backgroundImage.imageUrl && (
              <>
                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      X 위치: {effect.backgroundImage.offsetX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={effect.backgroundImage.offsetX}
                      onChange={(e) => handleBackgroundImageChange({ offsetX: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      Y 위치: {effect.backgroundImage.offsetY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={effect.backgroundImage.offsetY}
                      onChange={(e) => handleBackgroundImageChange({ offsetY: Number(e.target.value) })}
                      className="effect-slider"
                    />
                  </div>
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      크기: {(effect.backgroundImage.scale * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={effect.backgroundImage.scale * 100}
                      onChange={(e) => handleBackgroundImageChange({ scale: Number(e.target.value) / 100 })}
                      className="effect-slider"
                    />
                  </div>
                </div>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <label className="effect-label">
                    투명도: {(effect.backgroundImage.opacity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={effect.backgroundImage.opacity}
                    onChange={(e) => handleBackgroundImageChange({ opacity: Number(e.target.value) })}
                    className="effect-slider"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

