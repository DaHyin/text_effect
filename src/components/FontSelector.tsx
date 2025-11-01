import { useState, useEffect } from 'react';
import './FontSelector.css';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

// 인기 있는 Google Fonts 목록
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

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customFonts, setCustomFonts] = useState<string[]>([]);

  // document.fonts에서 커스텀 폰트 찾기
  useEffect(() => {
    const updateCustomFonts = () => {
      document.fonts.ready.then(() => {
        const allFonts = Array.from(document.fonts);
        const customFontNames = allFonts
          .map(font => font.family)
          .filter(name => !popularFonts.some(pf => pf.name === name));
        setCustomFonts([...new Set(customFontNames)]);
      });
    };

    updateCustomFonts();
    const interval = setInterval(updateCustomFonts, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const allFonts = [...popularFonts, ...customFonts.map(name => ({ name, displayName: name }))];

  return (
    <div className="font-selector-wrapper">
      <label className="font-selector-label">폰트 선택</label>
      <div className="font-selector">
        <button
          type="button"
          className="font-selector-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value}
          <span className={`font-selector-arrow ${isOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>
        {isOpen && (
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
                  value === fontName ? 'active' : ''
                }`}
                onClick={() => {
                  onChange(fontName);
                  setIsOpen(false);
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
                  value === font.name ? 'active' : ''
                }`}
                onClick={() => {
                  onChange(font.name);
                  setIsOpen(false);
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
  );
}


