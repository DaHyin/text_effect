import { useState } from 'react';

export function useFontUpload() {
  const [customFonts, setCustomFonts] = useState<Map<string, string>>(new Map());

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const fontUrl = e.target?.result as string;
        const fontName = file.name.replace(/\.[^/.]+$/, ''); // 확장자 제거
        
        // FontFace API로 폰트 로드
        const font = new FontFace(fontName, `url(${fontUrl})`);
        
        font.load().then(() => {
          document.fonts.add(font);
          setCustomFonts(prev => {
            const next = new Map(prev);
            next.set(fontName, fontUrl);
            return next;
          });
          alert(`폰트 "${fontName}"가 로드되었습니다!`);
        }).catch((error) => {
          console.error('폰트 로드 실패:', error);
          alert(`폰트 로드에 실패했습니다: ${error.message}`);
        });
      };
      
      reader.readAsDataURL(file);
    });
  };

  const getCustomFontNames = () => {
    return Array.from(customFonts.keys());
  };

  return {
    handleFontUpload,
    getCustomFontNames,
    customFonts
  };
}


