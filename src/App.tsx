import { useState } from 'react';
import { TextEffectComponent } from './components/TextEffect';
import { ImageResizer } from './components/ImageResizer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'text' | 'image'>('text');

  return (
    <div className="app">
      {/* 상단 탭 네비게이션 */}
      <div className="page-tabs">
        <button
          className={`page-tab ${currentPage === 'text' ? 'active' : ''}`}
          onClick={() => setCurrentPage('text')}
        >
          🎨 텍스트 이펙트
        </button>
        <button
          className={`page-tab ${currentPage === 'image' ? 'active' : ''}`}
          onClick={() => setCurrentPage('image')}
        >
          🖼️ 이미지 크기 조절기
        </button>
      </div>

      {currentPage === 'text' ? <TextEffectComponent /> : <ImageResizer />}
    </div>
  );
}

export default App;

