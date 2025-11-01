import { useRef } from 'react';
import { useFontUpload } from '../hooks/useFonts';
import './FontUpload.css';

export function FontUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFontUpload } = useFontUpload();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="font-upload-button"
      >
        📁 커스텀 폰트 업로드
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2,.eot"
        onChange={handleFontUpload}
        style={{ display: 'none' }}
        multiple
      />
    </>
  );
}


