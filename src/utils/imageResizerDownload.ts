import JSZip from 'jszip';
import type { ImageData, ImageResizerTabType } from '../types/imageResizer';

export function downloadImage(imageData: ImageData, type: 'square' | 'resize' | 'ratio', currentRatio: { width: number; height: number }): void {
  try {
    let canvas: HTMLCanvasElement | null;
    let filename: string;
    
    if (type === 'square') {
      canvas = imageData.squareCanvas;
      filename = `${imageData.name.replace(/\.[^/.]+$/, '')}_square.png`;
    } else if (type === 'resize') {
      canvas = imageData.resizeCanvas;
      filename = `${imageData.name.replace(/\.[^/.]+$/, '')}_480x720.png`;
    } else if (type === 'ratio') {
      canvas = imageData.ratioCanvas;
      let ratioText: string;
      if (imageData.recommendedRatio) {
        ratioText = `${imageData.recommendedRatio.width}x${imageData.recommendedRatio.height}`;
      } else {
        ratioText = `${currentRatio.width}x${currentRatio.height}`;
      }
      filename = `${imageData.name.replace(/\.[^/.]+$/, '')}_${ratioText}.png`;
    } else {
      console.error('알 수 없는 다운로드 타입:', type);
      return;
    }
    
    if (!canvas) {
      console.error('변환된 이미지가 없습니다:', type);
      return;
    }
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('다운로드 중 오류 발생:', error);
    alert('다운로드 중 오류가 발생했습니다.');
  }
}

export function downloadCurrentTabImages(images: ImageData[], currentTab: ImageResizerTabType, currentRatio: { width: number; height: number }): void {
  switch (currentTab) {
    case 'recommend':
      images.forEach(imageData => {
        if (imageData.ratioCanvas && imageData.recommendedRatio) {
          downloadImage(imageData, 'ratio', currentRatio);
        }
      });
      break;
    case 'square':
      images.forEach(imageData => {
        if (imageData.squareCanvas) {
          downloadImage(imageData, 'square', currentRatio);
        }
      });
      break;
    case 'resize':
      images.forEach(imageData => {
        if (imageData.resizeCanvas) {
          downloadImage(imageData, 'resize', currentRatio);
        }
      });
      break;
    case 'custom':
      images.forEach(imageData => {
        if (imageData.ratioCanvas) {
          downloadImage(imageData, 'ratio', currentRatio);
        }
      });
      break;
  }
}

export async function downloadCurrentTabAsZip(
  images: ImageData[], 
  currentTab: ImageResizerTabType, 
  currentRatio: { width: number; height: number }
): Promise<void> {
  const zip = new JSZip();
  let folderName = '';
  let hasFiles = false;
  
  switch (currentTab) {
    case 'recommend':
      folderName = '추천_비율';
      images.forEach(imageData => {
        if (imageData.ratioCanvas && imageData.recommendedRatio) {
          const baseName = imageData.name.replace(/\.[^/.]+$/, '');
          const ratioText = `${imageData.recommendedRatio.width}x${imageData.recommendedRatio.height}`;
          const ratioData = imageData.ratioCanvas.toDataURL('image/png', 1.0).split(',')[1];
          zip.file(`${baseName}_${ratioText}.png`, ratioData, {base64: true});
          hasFiles = true;
        }
      });
      break;
    case 'square':
      folderName = '1x1_비율';
      images.forEach(imageData => {
        if (imageData.squareCanvas) {
          const baseName = imageData.name.replace(/\.[^/.]+$/, '');
          const squareData = imageData.squareCanvas.toDataURL('image/png', 1.0).split(',')[1];
          zip.file(`${baseName}_square.png`, squareData, {base64: true});
          hasFiles = true;
        }
      });
      break;
    case 'resize':
      folderName = '480x720';
      images.forEach(imageData => {
        if (imageData.resizeCanvas) {
          const baseName = imageData.name.replace(/\.[^/.]+$/, '');
          const resizeData = imageData.resizeCanvas.toDataURL('image/png', 1.0).split(',')[1];
          zip.file(`${baseName}_480x720.png`, resizeData, {base64: true});
          hasFiles = true;
        }
      });
      break;
    case 'custom':
      folderName = '커스텀_비율';
      images.forEach(imageData => {
        if (imageData.ratioCanvas) {
          const baseName = imageData.name.replace(/\.[^/.]+$/, '');
          const ratioText = `${currentRatio.width}x${currentRatio.height}`;
          const ratioData = imageData.ratioCanvas.toDataURL('image/png', 1.0).split(',')[1];
          zip.file(`${baseName}_${ratioText}.png`, ratioData, {base64: true});
          hasFiles = true;
        }
      });
      break;
  }
  
  if (!hasFiles) {
    alert('현재 탭에서 변환된 이미지가 없습니다. 먼저 이미지를 변환해주세요.');
    return;
  }
  
  try {
    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${folderName}_이미지들_${new Date().toISOString().slice(0, 10)}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('ZIP 파일 생성 중 오류:', error);
    alert('ZIP 파일 생성 중 오류가 발생했습니다.');
  }
}


