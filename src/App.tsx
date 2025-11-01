import { useState } from 'react';
import { nanoid } from 'nanoid';
import { TextInput } from './components/TextInput';
import { FontSelector } from './components/FontSelector';
import { FontUpload } from './components/FontUpload';
import { EffectPanel } from './components/EffectPanel';
import { GlobalEffectPanel } from './components/GlobalEffectPanel';
import { BlockEffectPanel } from './components/BlockEffectPanel';
import { Canvas } from './components/Canvas';
import { ExportButton } from './components/ExportButton';
import type { TextEffect } from './types';
import './App.css';

const initialEffect: TextEffect = {
  textMode: 'single',
  text: '텍스트 이펙트',
  fontSize: 48,
  fontFamily: 'Noto Sans KR',
  letterSpacing: 0,
  paddingX: 30,
  paddingY: 0,
  textColor: '#000000',
  useTextGradient: false,
  shadow: {
    enabled: false,
    color: '#000000',
    blur: 3,
    offsetX: 0,
    offsetY: 0,
  },
  stroke: {
    enabled: false,
    width: 2,
    color: '#000000',
    useGradient: false,
    gradient: {
      enabled: false,
      type: 'linear',
      colors: ['#667eea', '#764ba2'],
      angle: 0,
      centerX: 50,
      centerY: 50,
      radius: 50,
    },
    useImage: false,
    imageUrl: null,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    texture: {
      enabled: false,
      imageUrl: null,
      blendMode: 'screen',
      opacity: 0.5,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    },
  },
  gradient: {
    enabled: false,
    type: 'linear',
    colors: ['#667eea', '#764ba2'],
    angle: 0,
    centerX: 50,
    centerY: 50,
    radius: 50,
  },
  imageFill: {
    enabled: false,
    imageUrl: null,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  },
  texture: {
    enabled: false,
    imageUrl: null,
    blendMode: 'screen',
    opacity: 0.5,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  },
  backgroundImage: {
    enabled: false,
    imageUrl: null,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
  },
};

function App() {
  const [effect, setEffect] = useState<TextEffect>(initialEffect);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  const handleChange = (newEffect: Partial<TextEffect>) => {
    setEffect({ ...effect, ...newEffect });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
        <h1>🎨 텍스트 이펙트 생성기</h1>
        <p className="header-subtitle">
          폰트와 효과를 선택하고 PNG로 다운로드하세요
        </p>
          </div>
          <ExportButton effect={effect} />
        </div>
      </header>
      
      <main className="main">
        <div className="main-container">
          {/* 왼쪽 컬럼: 텍스트 입력 및 미리보기 */}
          <div className="left-column">
            <div className="input-section">
              {/* 텍스트 모드 탭 */}
              <div className="input-item">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleChange({ textMode: 'single' })}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '2px solid',
                      borderColor: effect.textMode === 'single' ? '#667eea' : '#e0e0e0',
                      backgroundColor: effect.textMode === 'single' ? '#667eea' : '#fff',
                      color: effect.textMode === 'single' ? '#fff' : '#333',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: effect.textMode === 'single' ? 600 : 400,
                    }}
                  >
                    단일 문자열
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange({ textMode: 'multiple' })}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '2px solid',
                      borderColor: effect.textMode === 'multiple' ? '#667eea' : '#e0e0e0',
                      backgroundColor: effect.textMode === 'multiple' ? '#667eea' : '#fff',
                      color: effect.textMode === 'multiple' ? '#fff' : '#333',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: effect.textMode === 'multiple' ? 600 : 400,
                    }}
                  >
                    추가 문자열
                  </button>
                </div>
              </div>

              {/* 단일 모드: 기존 텍스트 입력 */}
              {effect.textMode === 'single' && (
                <div className="input-item">
              <TextInput
                value={effect.text}
                onChange={(text) => handleChange({ text })}
              />
            </div>
              )}

              {/* 다중 모드: 추후 추가 */}
              {effect.textMode === 'multiple' && (
                <div className="input-item">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>텍스트 블록</label>
                      {effect.textBlocks && effect.textBlocks.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextNumber = (effect.textBlocks?.length || 0) + 1;
                            const newBlock = {
                              id: nanoid(),
                              text: `새 텍스트 ${nextNumber}`,
                              fontSize: effect.fontSize,
                              fontFamily: effect.fontFamily,
                              letterSpacing: effect.letterSpacing,
                              textColor: effect.textColor,
                              offsetX: 0,
                              offsetY: 0,
                              stroke: { enabled: false, width: 2, color: '#000000' },
                              imageFill: { enabled: false, imageUrl: null, offsetX: 0, offsetY: 0, scale: 1 },
                              texture: { enabled: false, imageUrl: null, blendMode: 'screen' as const, opacity: 0.5, offsetX: 0, offsetY: 0, scale: 1 },
                            };
                            const newBlocks = [...(effect.textBlocks || []), newBlock];
                            handleChange({ textBlocks: newBlocks });
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#667eea',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          +
                        </button>
                      )}
                    </div>
                    {(!effect.textBlocks || effect.textBlocks.length === 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          const newBlock = {
                            id: nanoid(),
                            text: '새 텍스트 1',
                            fontSize: effect.fontSize,
                            fontFamily: effect.fontFamily,
                            letterSpacing: effect.letterSpacing,
                            textColor: effect.textColor,
                            offsetX: 0,
                            offsetY: 0,
                            stroke: { enabled: false, width: 2, color: '#000000' },
                            imageFill: { enabled: false, imageUrl: null, offsetX: 0, offsetY: 0, scale: 1 },
                            texture: { enabled: false, imageUrl: null, blendMode: 'screen' as const, opacity: 0.5, offsetX: 0, offsetY: 0, scale: 1 },
                          };
                          handleChange({ textBlocks: [newBlock] });
                        }}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#667eea',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        + 블록 추가
                      </button>
                    )}
                    {effect.textBlocks?.map((block, index) => (
                      <div key={block.id} style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>블록 {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newBlocks = effect.textBlocks?.filter(b => b.id !== block.id) || [];
                              handleChange({ textBlocks: newBlocks });
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#fee',
                              border: '1px solid #fcc',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}
                          >
                            삭제
                          </button>
                        </div>
                        <input
                          type="text"
                          value={block.text}
                          onChange={(e) => {
                            const newBlocks = effect.textBlocks?.map(b =>
                              b.id === block.id ? { ...b, text: e.target.value } : b
                            );
                            handleChange({ textBlocks: newBlocks });
                          }}
                          placeholder="텍스트를 입력하세요"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem',
                          }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                              X: {block.offsetX}px
                            </label>
                            <input
                              type="range"
                              min="-200"
                              max="200"
                              value={block.offsetX}
                              onChange={(e) => {
                                const newBlocks = effect.textBlocks?.map(b =>
                                  b.id === block.id ? { ...b, offsetX: parseInt(e.target.value) } : b
                                );
                                handleChange({ textBlocks: newBlocks });
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                              Y: {block.offsetY}px
                            </label>
                            <input
                              type="range"
                              min="-200"
                              max="200"
                              value={block.offsetY}
                              onChange={(e) => {
                                const newBlocks = effect.textBlocks?.map(b =>
                                  b.id === block.id ? { ...b, offsetY: parseInt(e.target.value) } : b
                                );
                                handleChange({ textBlocks: newBlocks });
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                        
                        {/* 폰트 크기, 자간 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                              폰트: {block.fontSize}px
                            </label>
                            <input
                              type="range"
                              min="24"
                              max="200"
                              value={block.fontSize}
                              onChange={(e) => {
                                const newBlocks = effect.textBlocks?.map(b =>
                                  b.id === block.id ? { ...b, fontSize: parseInt(e.target.value) } : b
                                );
                                handleChange({ textBlocks: newBlocks });
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                              자간: {block.letterSpacing}em
                            </label>
                            <input
                              type="range"
                              min="-0.1"
                              max="1"
                              step="0.01"
                              value={block.letterSpacing}
                              onChange={(e) => {
                                const newBlocks = effect.textBlocks?.map(b =>
                                  b.id === block.id ? { ...b, letterSpacing: parseFloat(e.target.value) } : b
                                );
                                handleChange({ textBlocks: newBlocks });
                              }}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                        
                        {/* 글자색 */}
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                            글자색
                          </label>
                          <input
                            type="color"
                            value={block.textColor}
                            onChange={(e) => {
                              const newBlocks = effect.textBlocks?.map(b =>
                                b.id === block.id ? { ...b, textColor: e.target.value } : b
                              );
                              handleChange({ textBlocks: newBlocks });
                            }}
                            style={{ width: '100%', height: '2rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {effect.textMode === 'single' && (
                <>
                  <div className="input-item">
              <FontSelector
                value={effect.fontFamily}
                onChange={(fontFamily) => handleChange({ fontFamily })}
              />
            </div>
                  <div className="input-item">
              <FontUpload />
                  </div>
                </>
              )}
            </div>
            <div className="preview-section">
              <Canvas effect={effect} onChange={handleChange} />
            </div>
          </div>

          {/* 오른쪽 컬럼: 효과 설정 */}
          <div className="right-column">
            <div className="settings-section">
              {effect.textMode === 'multiple' ? (
                <>
                  <GlobalEffectPanel effect={effect} onChange={handleChange} />
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      블록 선택
                    </label>
                    {effect.textBlocks && effect.textBlocks.length > 0 ? (
                      <select
                        value={selectedBlockIndex ?? ''}
                        onChange={(e) => setSelectedBlockIndex(e.target.value ? parseInt(e.target.value) : null)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <option value="">블록을 선택하세요</option>
                        {effect.textBlocks.map((block, idx) => (
                          <option key={block.id} value={idx}>
                            블록 {idx + 1}: {block.text}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>블록을 추가해주세요.</p>
                    )}
          </div>

                  {selectedBlockIndex !== null && effect.textBlocks && (
                    <BlockEffectPanel
                      effect={effect}
                      blockIndex={selectedBlockIndex}
                      onChange={handleChange}
                    />
                  )}
                </>
              ) : (
            <EffectPanel effect={effect} onChange={handleChange} />
              )}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

