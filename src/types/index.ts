export interface TextEffect {
  // 텍스트 모드
  textMode: 'single' | 'multiple';
  
  // 기본 설정 (단일 모드)
  text: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number; // 자간 (em 단위)
  gridCols: number; // 캔버스 가로 칸수 (24px 단위)
  gridRows: number; // 캔버스 세로 칸수 (24px 단위)
  
  // 색상
  textColor: string;
  useTextGradient: boolean;
  
  // 그림자
  shadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  
  // 테두리 (단일 모드에서만 사용)
  stroke: {
    enabled: boolean;
    width: number;
    color: string;
    useGradient: boolean;
    gradient?: {
      enabled: boolean;
      type: 'linear' | 'radial';
      colors: string[];
      angle?: number;
      centerX?: number;
      centerY?: number;
      radius?: number;
    };
    useImage: boolean;
    imageUrl: string | null;
    offsetX: number;
    offsetY: number;
    scale: number;
    texture: {
      enabled: boolean;
      imageUrl: string | null;
      blendMode: 'multiply' | 'overlay' | 'screen';
      opacity: number;
      offsetX: number;
      offsetY: number;
      scale: number;
    };
  };
  
  // 고급 효과 (단일 모드에서만 사용)
  gradient?: {
    enabled: boolean;
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
    centerX?: number;
    centerY?: number;
    radius?: number;
  };
  
  // 이미지 채우기 (단일 모드에서만 사용)
  imageFill: {
    enabled: boolean;
    imageUrl: string | null;
    offsetX: number;
    offsetY: number;
    scale: number;
  };
  
  // 질감 효과 (단일 모드에서만 사용)
  texture: {
    enabled: boolean;
    imageUrl: string | null;
    blendMode: 'multiply' | 'overlay' | 'screen';
    opacity: number;
    offsetX: number;
    offsetY: number;
    scale: number;
  };
  
  // 배경 이미지 (텍스트 뒤에)
  backgroundImage: {
    enabled: boolean;
    imageUrl: string | null;
    offsetX: number;
    offsetY: number;
    scale: number;
    opacity: number; // 0-1
  };
  
  // 다중 모드 캔버스 크기 (multiple 모드에서 사용)
  canvasGridCols?: number; // 미리보기 가로 칸수 (24px 단위)
  canvasGridRows?: number; // 미리보기 세로 칸수 (24px 단위)
  
  // 다중 텍스트 블록 (multiple 모드)
  textBlocks?: Array<{
    id: string;
    text: string;
    fontSize: number;
    fontFamily: string;
    letterSpacing: number;
    textColor: string;
    offsetX: number; // x 좌표 오프셋
    offsetY: number; // y 좌표 오프셋
    stroke: {
      enabled: boolean;
      width: number;
      color: string;
    };
    imageFill: {
      enabled: boolean;
      imageUrl: string | null;
      offsetX: number;
      offsetY: number;
      scale: number;
    };
    texture: {
      enabled: boolean;
      imageUrl: string | null;
      blendMode: 'multiply' | 'overlay' | 'screen';
      opacity: number;
      offsetX: number;
      offsetY: number;
      scale: number;
    };
  }>;
  
}

export interface FontOption {
  name: string;
  displayName: string;
  isCustom: boolean;
}


