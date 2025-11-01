import { useRef } from 'react';
import './EffectPanel.css';
import type { TextEffect } from '../types';

interface EffectPanelProps {
  effect: TextEffect;
  onChange: (effect: Partial<TextEffect>) => void;
}

export function EffectPanel({ effect, onChange }: EffectPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textureFileInputRef = useRef<HTMLInputElement>(null);
  const strokeTextureFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onChange({
        imageFill: {
          ...effect.imageFill,
          imageUrl,
          enabled: true,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onChange({
        texture: {
          ...effect.texture,
          imageUrl,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStrokeTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onChange({
        stroke: {
          ...effect.stroke,
          texture: {
            ...effect.stroke.texture,
            imageUrl,
          },
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* 폰트 크기, 자간, 글자색을 3col로 배치 */}
      <div className="effect-row-3col">
        <div className="effect-group-inline">
          <label className="effect-label">
            폰트 크기: {effect.fontSize}px
          </label>
          <input
            type="range"
            min="7"
            max="100"
            value={effect.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="effect-slider"
          />
        </div>

        <div className="effect-group-inline">
          <label className="effect-label">
            자간: {effect.letterSpacing}em
          </label>
          <input
            type="range"
            min="-0.1"
            max="1"
            step="0.01"
            value={effect.letterSpacing}
            onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
            className="effect-slider"
          />
        </div>

        <div className="effect-group-inline">
          <label 
            className="effect-label"
            style={{ color: effect.useTextGradient || effect.imageFill.enabled ? '#dc2626' : '#374151' }}
          >
            글자색
          </label>
          <input
            type="color"
            value={effect.textColor}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="effect-color"
            disabled={effect.useTextGradient || effect.imageFill.enabled}
            style={{
              cursor: effect.useTextGradient || effect.imageFill.enabled ? 'not-allowed' : 'pointer',
              borderColor: effect.useTextGradient || effect.imageFill.enabled ? '#fca5a5' : '#e0e0e0',
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            title={effect.useTextGradient || effect.imageFill.enabled ? '그라디언트나 이미지 채우기가 활성화되어 있습니다' : ''}
          />
        </div>
      </div>

      {/* 캔버스 크기 (24px 단위) */}
      <div className="effect-row-3col">
        <div className="effect-group-inline">
          <label className="effect-label">
            가로 칸수
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={effect.gridCols}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value)) {
                onChange({ gridCols: value });
              }
            }}
            onBlur={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 1000) value = 1000;
              if (!isNaN(value)) {
                onChange({ gridCols: value });
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          />
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
            {effect.gridCols}칸 ({effect.gridCols * 24}px)
          </div>
        </div>

        <div className="effect-group-inline">
          <label className="effect-label">
            세로 칸수
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={effect.gridRows}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value)) {
                onChange({ gridRows: value });
              }
            }}
            onBlur={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 1000) value = 1000;
              if (!isNaN(value)) {
                onChange({ gridRows: value });
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          />
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
            {effect.gridRows}칸 ({effect.gridRows * 24}px)
          </div>
        </div>
      </div>

      {/* 텍스트 색상 섹션 */}
      <div className="effect-group-section">
        <div className="effect-group">
          <label className="effect-checkbox-label">
            <input
              type="checkbox"
              checked={effect.useTextGradient}
              onChange={(e) => onChange({ 
                useTextGradient: e.target.checked,
                gradient: e.target.checked ? { ...effect.gradient, enabled: true } : effect.gradient
              })}
              className="effect-checkbox"
            />
            텍스트 그라디언트
          </label>
        </div>

        {/* 그라디언트 설정 */}
        {effect.useTextGradient && effect.gradient && (
        <>
          <div className="effect-row-3col">
            <div className="effect-group-inline">
              <label className="effect-label">그라디언트 타입</label>
              <select
                value={effect.gradient.type}
                onChange={(e) =>
                  onChange({
                    gradient: { ...effect.gradient, type: e.target.value as 'linear' | 'radial' },
                  })
                }
                className="effect-select"
              >
                <option value="linear">선형</option>
                <option value="radial">방사형</option>
              </select>
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                색상 1
              </label>
              <input
                type="color"
                value={effect.gradient.colors[0]}
                onChange={(e) => {
                  const newColors = [...effect.gradient!.colors];
                  newColors[0] = e.target.value;
                  onChange({ gradient: { ...effect.gradient!, colors: newColors } });
                }}
                className="effect-color"
              />
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                색상 2
              </label>
              <input
                type="color"
                value={effect.gradient.colors[1]}
                onChange={(e) => {
                  const newColors = [...effect.gradient!.colors];
                  newColors[1] = e.target.value;
                  onChange({ gradient: { ...effect.gradient!, colors: newColors } });
                }}
                className="effect-color"
              />
            </div>
          </div>

          <div className="effect-row-3col">
            <div className="effect-group-inline">
              <label className="effect-label">
                {effect.gradient.type === 'linear' ? '각도' : '크기'}: {effect.gradient.type === 'linear' ? effect.gradient.angle : effect.gradient.radius?.toFixed(0) || 50}%
              </label>
              <input
                type="range"
                min={effect.gradient.type === 'linear' ? "0" : "10"}
                max={effect.gradient.type === 'linear' ? "360" : "200"}
                value={effect.gradient.type === 'linear' ? effect.gradient.angle || 0 : effect.gradient.radius || 50}
                onChange={(e) =>
                  onChange({
                    gradient: {
                      ...effect.gradient!,
                      [effect.gradient!.type === 'linear' ? 'angle' : 'radius']: Number(e.target.value),
                    },
                  })
                }
                className="effect-slider"
              />
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                중심 X: {effect.gradient.centerX?.toFixed(0) || 50}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={effect.gradient.centerX || 50}
                onChange={(e) =>
                  onChange({
                    gradient: { ...effect.gradient!, centerX: Number(e.target.value) },
                  })
                }
                className="effect-slider"
              />
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                중심 Y: {effect.gradient.centerY?.toFixed(0) || 50}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={effect.gradient.centerY || 50}
                onChange={(e) =>
                  onChange({
                    gradient: { ...effect.gradient!, centerY: Number(e.target.value) },
                  })
                }
                className="effect-slider"
              />
            </div>
          </div>
        </>
        )}
      </div>

      {/* 그림자 섹션 */}
      <div className="effect-group-section">
        <div className="effect-group">
          <div className="effect-checkbox-with-color">
            <label className="effect-checkbox-label">
              <input
                type="checkbox"
                checked={effect.shadow.enabled}
                onChange={(e) =>
                  onChange({
                    shadow: { ...effect.shadow, enabled: e.target.checked },
                  })
                }
                className="effect-checkbox"
              />
              그림자 효과
            </label>
            {effect.shadow.enabled && (
              <input
                type="color"
                value={effect.shadow.color}
                onChange={(e) =>
                  onChange({
                    shadow: { ...effect.shadow, color: e.target.value },
                  })
                }
                className="effect-color-inline"
              />
            )}
          </div>
        </div>

        {/* 그림자 옵션 */}
        {effect.shadow.enabled && (
          <div className="effect-row-3col">
          <div className="effect-group-inline">
            <label className="effect-label">
              그림자 블러: {effect.shadow.blur}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={effect.shadow.blur}
              onChange={(e) =>
                onChange({
                  shadow: { ...effect.shadow, blur: Number(e.target.value) },
                })
              }
              className="effect-slider"
            />
          </div>

          <div className="effect-group-inline">
            <label className="effect-label">
              그림자 X: {effect.shadow.offsetX}px
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={effect.shadow.offsetX}
              onChange={(e) =>
                onChange({
                  shadow: { ...effect.shadow, offsetX: Number(e.target.value) },
                })
              }
              className="effect-slider"
            />
          </div>

          <div className="effect-group-inline">
            <label className="effect-label">
              그림자 Y: {effect.shadow.offsetY}px
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={effect.shadow.offsetY}
              onChange={(e) =>
                onChange({
                  shadow: { ...effect.shadow, offsetY: Number(e.target.value) },
                })
              }
              className="effect-slider"
            />
          </div>
        </div>
        )}
      </div>

      {/* 테두리 섹션 */}
      <div className="effect-group-section">
        <div className="effect-group">
          <div className="effect-checkbox-with-color">
            <label className="effect-checkbox-label">
              <input
                type="checkbox"
                checked={effect.stroke.enabled}
                onChange={(e) =>
                  onChange({
                    stroke: { ...effect.stroke, enabled: e.target.checked },
                  })
                }
                className="effect-checkbox"
              />
              테두리 효과
            </label>
            {effect.stroke.enabled && !effect.stroke.useImage && !effect.stroke.useGradient && (
              <input
                type="color"
                value={effect.stroke.color}
                onChange={(e) =>
                  onChange({
                    stroke: { ...effect.stroke, color: e.target.value },
                  })
                }
                className="effect-color-inline"
              />
            )}
          </div>
        </div>

        {/* 테두리 옵션 */}
        {effect.stroke.enabled && (
          <>
            <div className="effect-group">
              <label className="effect-label">
                테두리 두께: {effect.stroke.width}px
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={effect.stroke.width}
                onChange={(e) =>
                  onChange({
                    stroke: { ...effect.stroke, width: Number(e.target.value) },
                  })
                }
                className="effect-slider"
              />
            </div>

            {/* 테두리 그라디언트 체크박스 */}
            <div className="effect-group">
              <label className="effect-checkbox-label">
                <input
                  type="checkbox"
                  checked={effect.stroke.useGradient}
                  onChange={(e) =>
                    onChange({
                      stroke: { ...effect.stroke, useGradient: e.target.checked },
                    })
                  }
                  className="effect-checkbox"
                />
                테두리 그라디언트
              </label>
            </div>

            {/* 테두리 그라디언트 설정 */}
            {effect.stroke.useGradient && effect.stroke.gradient && (
              <>
                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">그라디언트 타입</label>
                    <select
                      value={effect.stroke.gradient.type}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            gradient: { ...effect.stroke.gradient!, type: e.target.value as 'linear' | 'radial' },
                          },
                        })
                      }
                      className="effect-select"
                    >
                      <option value="linear">선형</option>
                      <option value="radial">방사형</option>
                    </select>
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      색상 1
                    </label>
                    <input
                      type="color"
                      value={effect.stroke.gradient.colors[0]}
                      onChange={(e) => {
                        const newColors = [...effect.stroke.gradient!.colors];
                        newColors[0] = e.target.value;
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            gradient: { ...effect.stroke.gradient!, colors: newColors },
                          },
                        });
                      }}
                      className="effect-color"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      색상 2
                    </label>
                    <input
                      type="color"
                      value={effect.stroke.gradient.colors[1]}
                      onChange={(e) => {
                        const newColors = [...effect.stroke.gradient!.colors];
                        newColors[1] = e.target.value;
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            gradient: { ...effect.stroke.gradient!, colors: newColors },
                          },
                        });
                      }}
                      className="effect-color"
                    />
                  </div>
                </div>

                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      {effect.stroke.gradient.type === 'linear' ? '각도' : '크기'}: {effect.stroke.gradient.type === 'linear' ? effect.stroke.gradient.angle : effect.stroke.gradient.radius?.toFixed(0) || 50}%
                    </label>
                    <input
                      type="range"
                      min={effect.stroke.gradient.type === 'linear' ? "0" : "10"}
                      max={effect.stroke.gradient.type === 'linear' ? "360" : "200"}
                      value={effect.stroke.gradient.type === 'linear' ? effect.stroke.gradient.angle || 0 : effect.stroke.gradient.radius || 50}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            gradient: {
                              ...effect.stroke.gradient!,
                              [effect.stroke.gradient!.type === 'linear' ? 'angle' : 'radius']: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      중심 X: {effect.stroke.gradient.centerX?.toFixed(0) || 50}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={effect.stroke.gradient.centerX || 50}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            gradient: { ...effect.stroke.gradient!, centerX: Number(e.target.value) },
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      중심 Y: {effect.stroke.gradient.centerY?.toFixed(0) || 50}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={effect.stroke.gradient.centerY || 50}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            gradient: { ...effect.stroke.gradient!, centerY: Number(e.target.value) },
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 테두리 그라디언트 체크박스 */}
            <div className="effect-group">
              <label className="effect-checkbox-label">
                <input
                  type="checkbox"
                  checked={effect.stroke.useGradient}
                  onChange={(e) =>
                    onChange({
                      stroke: { ...effect.stroke, useGradient: e.target.checked },
                    })
                  }
                  className="effect-checkbox"
                />
                테두리 그라디언트
              </label>
            </div>

            {/* 테두리 이미지 채우기 체크박스 */}
            <div className="effect-group">
              <label className="effect-checkbox-label">
                <input
                  type="checkbox"
                  checked={effect.stroke.useImage}
                  onChange={(e) =>
                    onChange({
                      stroke: { ...effect.stroke, useImage: e.target.checked },
                    })
                  }
                  className="effect-checkbox"
                />
                테두리 이미지 채우기
              </label>
            </div>

            {/* 테두리 이미지 선택 */}
            {effect.stroke.useImage && (
              <>
                <div className="effect-group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const imageUrl = e.target?.result as string;
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            imageUrl,
                          },
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="image-upload-button"
                >
                  📁 테두리 이미지 선택
                </button>
              </div>

              {/* 테두리 이미지 옵션 */}
              {effect.stroke.imageUrl && (
                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      X 위치: {effect.stroke.offsetX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={effect.stroke.offsetX}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            offsetX: Number(e.target.value),
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      Y 위치: {effect.stroke.offsetY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={effect.stroke.offsetY}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            offsetY: Number(e.target.value),
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      크기: {(effect.stroke.scale * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={effect.stroke.scale * 100}
                      onChange={(e) =>
                        onChange({
                          stroke: {
                            ...effect.stroke,
                            scale: Number(e.target.value) / 100,
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* 테두리 질감 */}
          <div className="effect-group">
            <label className="effect-checkbox-label">
              <input
                type="checkbox"
                checked={effect.stroke.texture.enabled}
                onChange={(e) =>
                  onChange({
                    stroke: {
                      ...effect.stroke,
                      texture: {
                        ...effect.stroke.texture,
                        enabled: e.target.checked,
                      },
                    },
                  })
                }
                className="effect-checkbox"
              />
              테두리 질감
            </label>
          </div>

          {/* 테두리 질감 이미지 선택 */}
          {effect.stroke.texture.enabled && (
            <>
              <div className="effect-group">
                <input
                  ref={strokeTextureFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStrokeTextureUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => strokeTextureFileInputRef.current?.click()}
                  className="image-upload-button"
                >
                  📁 테두리 질감 이미지 선택
                </button>
              </div>

              {/* 테두리 질감 옵션 */}
              {effect.stroke.texture.imageUrl && (
                <>
                  <div className="effect-row-3col">
                    <div className="effect-group-inline">
                      <label className="effect-label">블렌딩 모드</label>
                      <select
                        value={effect.stroke.texture.blendMode}
                        onChange={(e) =>
                          onChange({
                            stroke: {
                              ...effect.stroke,
                              texture: {
                                ...effect.stroke.texture,
                                blendMode: e.target.value as 'multiply' | 'overlay' | 'screen',
                              },
                            },
                          })
                        }
                        className="effect-select"
                      >
                        <option value="multiply">Multiply (어둡게)</option>
                        <option value="overlay">Overlay (대비 강화)</option>
                        <option value="screen">Screen (밝게)</option>
                      </select>
                    </div>

                    <div className="effect-group-inline">
                      <label className="effect-label">
                        불투명도: {(effect.stroke.texture.opacity * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.stroke.texture.opacity * 100}
                        onChange={(e) =>
                          onChange({
                            stroke: {
                              ...effect.stroke,
                              texture: {
                                ...effect.stroke.texture,
                                opacity: Number(e.target.value) / 100,
                              },
                            },
                          })
                        }
                        className="effect-slider"
                      />
                    </div>

                    <div className="effect-group-inline">
                      <label className="effect-label">
                        크기: {(effect.stroke.texture.scale * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={effect.stroke.texture.scale * 100}
                        onChange={(e) =>
                          onChange({
                            stroke: {
                              ...effect.stroke,
                              texture: {
                                ...effect.stroke.texture,
                                scale: Number(e.target.value) / 100,
                              },
                            },
                          })
                        }
                        className="effect-slider"
                      />
                    </div>
                  </div>

                  <div className="effect-row-3col">
                    <div className="effect-group-inline">
                      <label className="effect-label">
                        X 위치: {effect.stroke.texture.offsetX}px
                      </label>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={effect.stroke.texture.offsetX}
                        onChange={(e) =>
                          onChange({
                            stroke: {
                              ...effect.stroke,
                              texture: {
                                ...effect.stroke.texture,
                                offsetX: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="effect-slider"
                      />
                    </div>

                    <div className="effect-group-inline">
                      <label className="effect-label">
                        Y 위치: {effect.stroke.texture.offsetY}px
                      </label>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={effect.stroke.texture.offsetY}
                        onChange={(e) =>
                          onChange({
                            stroke: {
                              ...effect.stroke,
                              texture: {
                                ...effect.stroke.texture,
                                offsetY: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="effect-slider"
                      />
                    </div>

                    <div className="effect-group-inline">
                      {/* 빈 공간 */}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>

    {/* 이미지 채우기 섹션 */}
      <div className="effect-group-section">
        <div className="effect-group">
          <div className="effect-checkbox-with-color">
            <label className="effect-checkbox-label">
              <input
                type="checkbox"
                checked={effect.imageFill.enabled}
                onChange={(e) =>
                  onChange({
                    imageFill: {
                      ...effect.imageFill,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="effect-checkbox"
              />
              이미지 채우기
            </label>
            {effect.imageFill.enabled && (
              <button
                type="button"
                onClick={handleClick}
                className="image-upload-button"
              >
                📁 이미지 선택
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* 이미지 채우기 옵션 */}
        {effect.imageFill.enabled && effect.imageFill.imageUrl && (
          <div className="effect-row-3col">
            <div className="effect-group-inline">
              <label className="effect-label">
                X 위치: {effect.imageFill.offsetX}px
              </label>
              <input
                type="range"
                min="-200"
                max="200"
                value={effect.imageFill.offsetX}
                onChange={(e) =>
                  onChange({
                    imageFill: {
                      ...effect.imageFill,
                      offsetX: Number(e.target.value),
                    },
                  })
                }
                className="effect-slider"
              />
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                Y 위치: {effect.imageFill.offsetY}px
              </label>
              <input
                type="range"
                min="-200"
                max="200"
                value={effect.imageFill.offsetY}
                onChange={(e) =>
                  onChange({
                    imageFill: {
                      ...effect.imageFill,
                      offsetY: Number(e.target.value),
                    },
                  })
                }
                className="effect-slider"
              />
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                크기: {(effect.imageFill.scale * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={effect.imageFill.scale * 100}
                onChange={(e) =>
                  onChange({
                    imageFill: {
                      ...effect.imageFill,
                      scale: Number(e.target.value) / 100,
                    },
                  })
                }
                className="effect-slider"
              />
            </div>
          </div>
        )}
      </div>

      {/* 텍스트 질감 섹션 */}
      <div className="effect-group-section">
        <div className="effect-group">
          <label className="effect-checkbox-label">
            <input
              type="checkbox"
              checked={effect.texture.enabled}
              onChange={(e) =>
                onChange({
                  texture: {
                    ...effect.texture,
                    enabled: e.target.checked,
                  },
                })
              }
              className="effect-checkbox"
            />
            텍스트 질감
          </label>
        </div>

        {/* 질감 이미지 선택 */}
        {effect.texture.enabled && (
          <>
            <div className="effect-group">
              <input
                ref={textureFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleTextureUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => textureFileInputRef.current?.click()}
                className="image-upload-button"
              >
                📁 질감 이미지 선택
              </button>
            </div>

            {/* 블렌딩 모드 및 불투명도 */}
            {effect.texture.imageUrl && (
              <>
                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">블렌딩 모드</label>
                    <select
                      value={effect.texture.blendMode}
                      onChange={(e) =>
                        onChange({
                          texture: {
                            ...effect.texture,
                            blendMode: e.target.value as 'multiply' | 'overlay' | 'screen',
                          },
                        })
                      }
                      className="effect-select"
                    >
                      <option value="multiply">Multiply (어둡게)</option>
                      <option value="overlay">Overlay (대비 강화)</option>
                      <option value="screen">Screen (밝게)</option>
                    </select>
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      불투명도: {(effect.texture.opacity * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={effect.texture.opacity * 100}
                      onChange={(e) =>
                        onChange({
                          texture: {
                            ...effect.texture,
                            opacity: Number(e.target.value) / 100,
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      크기: {(effect.texture.scale * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={effect.texture.scale * 100}
                      onChange={(e) =>
                        onChange({
                          texture: {
                            ...effect.texture,
                            scale: Number(e.target.value) / 100,
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>
                </div>

                <div className="effect-row-3col">
                  <div className="effect-group-inline">
                    <label className="effect-label">
                      X 위치: {effect.texture.offsetX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={effect.texture.offsetX}
                      onChange={(e) =>
                        onChange({
                          texture: {
                            ...effect.texture,
                            offsetX: Number(e.target.value),
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    <label className="effect-label">
                      Y 위치: {effect.texture.offsetY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={effect.texture.offsetY}
                      onChange={(e) =>
                        onChange({
                          texture: {
                            ...effect.texture,
                            offsetY: Number(e.target.value),
                          },
                        })
                      }
                      className="effect-slider"
                    />
                  </div>

                  <div className="effect-group-inline">
                    {/* 빈 공간 */}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* 배경 이미지 섹션 */}
      <div className="effect-group-section">
        <div className="effect-group">
          <div className="effect-checkbox-with-color">
            <label className="effect-checkbox-label">
              <input
                type="checkbox"
                checked={effect.backgroundImage.enabled}
                onChange={(e) =>
                  onChange({
                    backgroundImage: {
                      ...effect.backgroundImage,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="effect-checkbox"
              />
              배경 이미지
            </label>
            {effect.backgroundImage.enabled && (
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (event: Event) => {
                    const file = (event.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const imageUrl = e.target?.result as string;
                        onChange({
                          backgroundImage: {
                            ...effect.backgroundImage,
                            imageUrl,
                          },
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="image-upload-button"
              >
                📁 배경 이미지 선택
              </button>
            )}
          </div>
        </div>

        {/* 배경 이미지 옵션 */}
        {effect.backgroundImage.enabled && effect.backgroundImage.imageUrl && (
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
                onChange={(e) =>
                  onChange({
                    backgroundImage: {
                      ...effect.backgroundImage,
                      offsetX: Number(e.target.value),
                    },
                  })
                }
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
                onChange={(e) =>
                  onChange({
                    backgroundImage: {
                      ...effect.backgroundImage,
                      offsetY: Number(e.target.value),
                    },
                  })
                }
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
                onChange={(e) =>
                  onChange({
                    backgroundImage: {
                      ...effect.backgroundImage,
                      scale: Number(e.target.value) / 100,
                    },
                  })
                }
                className="effect-slider"
              />
            </div>

            <div className="effect-group-inline">
              <label className="effect-label">
                투명도: {(effect.backgroundImage.opacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={effect.backgroundImage.opacity * 100}
                onChange={(e) =>
                  onChange({
                    backgroundImage: {
                      ...effect.backgroundImage,
                      opacity: Number(e.target.value) / 100,
                    },
                  })
                }
                className="effect-slider"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


