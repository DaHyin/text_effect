# 배포 가이드

이 텍스트 이펙트 생성기를 웹에 공개하는 방법입니다.

---

## 🎯 Vercel 상세 가이드 (추천 ⭐)

### Vercel이란?

Vercel은 Next.js를 만든 회사에서 제공하는 **프론트엔드 최적화 배포 플랫폼**입니다. React, Vue, Svelte 등 모든 프레임워크를 지원하며, 특히 **개발자 경험이 뛰어난** 것으로 유명합니다.

### Vercel의 특징

✅ **자동 최적화**
- 코드를 자동으로 압축하고 최적화
- 이미지 최적화 (WebP 변환 등)
- 코드 스플리팅 자동 적용

✅ **글로벌 CDN**
- 전 세계 엣지 서버에서 서비스
- 사용자 위치에 가장 가까운 서버에서 자동 제공
- 초고속 로딩 속도

✅ **자동 HTTPS**
- Let's Encrypt 인증서 자동 발급 및 갱신
- SSL 설정 완전 자동화

✅ **프리뷰 배포**
- Pull Request마다 자동으로 미리보기 URL 생성
- 각 브랜치별로 별도 배포 가능

✅ **서버리스 함수 지원**
- API 라우트 자동 배포
- Edge Functions 지원

### Vercel 플랜 비교

#### Hobby (무료)
**가격:** 무료

**제한사항:**
- 월 100GB 대역폭
- 월 100시간 빌드 시간
- 개인 프로젝트만 가능
- 제한적 서버리스 함수 실행 시간
- 커스텀 도메인 무제한

**적합한 경우:**
- 개인 프로젝트
- 포트폴리오 사이트
- 소규모 서비스
- 트래픽이 적은 서비스

#### Pro (유료)
**가격:** 월 $20 (약 27,000원)

**제한사항:**
- 월 1TB 대역폭
- 월 6,000분 빌드 시간
- 상업적 사용 가능
- 팀 협업 기능
- 우선순위 지원
- 무제한 서버리스 함수
- 비밀 환경 변수 무제한

**적합한 경우:**
- 상업적 서비스
- 중소규모 트래픽
- 팀 협업이 필요한 경우
- 고객 지원이 필요한 경우

#### Enterprise (기업용)
**가격:** 문의 필요

**특징:**
- 무제한 대역폭
- 무제한 빌드 시간
- 24/7 전담 지원
- SLA 보장
- SSO (Single Sign-On)
- 고급 보안 기능

### Vercel 배포 방법

#### 방법 1: 웹 대시보드 (추천)

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/사용자명/저장소명.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - https://vercel.com 접속
   - "Sign Up" → GitHub 계정으로 로그인
   - "Add New Project" 클릭
   - GitHub 저장소 선택 → "Import"
   - 자동으로 설정 감지됨 (Vite):
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - "Deploy" 클릭
   - 완료! 자동으로 URL 생성 (예: `프로젝트명.vercel.app`)

3. **커스텀 도메인 추가**
   - 프로젝트 → Settings → Domains
   - 도메인 입력
   - DNS 설정 안내 따르기

#### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리에서
vercel

# 배포 완료!
```

**CLI 옵션:**
```bash
vercel --prod          # 프로덕션 배포
vercel --preview       # 프리뷰 배포
vercel ls              # 배포 목록 확인
vercel rm 프로젝트명    # 배포 삭제
```

#### 방법 3: GitHub 연동 (자동 배포)

1. Vercel에서 GitHub 저장소 연결
2. `main` 브랜치에 push하면 자동 배포
3. Pull Request 생성 시 자동으로 프리뷰 URL 생성

### Vercel 설정 파일 (선택사항)

프로젝트 루트에 `vercel.json` 생성:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Vercel 장단점

**장점:**
- ⚡ 매우 빠른 배포 속도
- 🎯 개발자 경험 우수
- 🔄 자동 CI/CD
- 📊 상세한 분석 대시보드
- 🌍 글로벌 CDN

**단점:**
- 무료 플랜의 대역폭 제한 (100GB/월)
- 서버리스 함수 제한 (무료 플랜)
- 백엔드 서비스 없음 (정적 사이트 + 서버리스 함수만)

---

## 🆓 무료 배포 옵션

### 1. Netlify

**장점:**
- 드래그 앤 드롭 배포 가능
- Vite 지원 우수
- 무료 커스텀 도메인
- 폼 처리 기능 (무료)

**무료 플랜:**
- 월 100GB 대역폭
- 300분 빌드 시간
- 커스텀 도메인 무제한

**유료 플랜:** Pro $19/월

**배포 방법:**

**방법 A: 드래그 앤 드롭**
1. `npm run build` 실행
2. https://app.netlify.com 접속
3. `dist` 폴더를 드래그 앤 드롭
4. 완료!

**방법 B: GitHub 연동**
- GitHub 저장소 연결
- 빌드 설정: `npm run build`, 출력: `dist`

---

### 2. Cloudflare Pages

**장점:**
- 매우 빠른 속도
- 무료 플랜이 넉넉함
- 무제한 대역폭 (무료)
- 무제한 빌드 시간 (무료)

**무료 플랜:**
- 무제한 대역폭
- 무제한 빌드 시간
- 커스텀 도메인 무제한

**유료 플랜:** Pro $20/월 (팀 기능)

**배포 방법:**
1. https://pages.cloudflare.com 접속
2. GitHub 저장소 연결
3. 빌드 설정: Vite, `npm run build`, `dist`

---

### 3. GitHub Pages

**장점:**
- 완전 무료
- GitHub 통합

**단점:**
- 설정이 복잡
- 빌드 시간 제한
- 서버리스 함수 없음

**배포 방법:**
- `.github/workflows/deploy.yml` 설정 필요
- `vite.config.ts`에서 `base` 설정 필요

---

## 💰 유료 배포 옵션

### 1. AWS (Amazon Web Services)

#### Amazon S3 + CloudFront

**용도:** 정적 웹사이트 호스팅

**구성:**
- **S3**: 파일 저장소 (월 $0.023/GB)
- **CloudFront**: CDN (월 $0.085/GB 전송)

**예상 비용:**
- 소규모 (10GB 전송/월): 약 $1-3
- 중규모 (100GB 전송/월): 약 $10-15
- 대규모 (1TB 전송/월): 약 $100-150

**장점:**
- 확장성 뛰어남
- AWS 생태계 통합
- 고급 설정 가능

**단점:**
- 설정 복잡
- 비용 관리 필요
- 초보자에게 어려움

**배포 방법:**
```bash
# AWS CLI 설치 후
aws s3 sync dist/ s3://버킷명 --delete
aws cloudfront create-invalidation --distribution-id 배포ID --paths "/*"
```

#### AWS Amplify (추천)

**가격:** 사용한 만큼 지불 (월 $1-50 예상)

**장점:**
- Vercel과 유사한 간편함
- GitHub 연동
- CI/CD 자동화
- 서버리스 함수 지원

**배포 방법:**
1. AWS Amplify 콘솔 접속
2. GitHub 저장소 연결
3. 자동 배포 설정

---

### 2. Google Cloud Platform (GCP)

#### Google Cloud Storage + Cloud CDN

**용도:** 정적 웹사이트 호스팅

**예상 비용:**
- 스토리지: 월 $0.026/GB
- CDN: 월 $0.08/GB 전송
- 소규모: 약 $1-5/월

**장점:**
- Google 인프라 활용
- 확장성 좋음

**단점:**
- 설정 복잡
- 초기 학습 곡선

#### Firebase Hosting

**가격:** 
- Spark (무료): 10GB 저장, 10GB 전송/월
- Blaze (사용량 기반): $0.026/GB 저장, $0.15/GB 전송

**장점:**
- Firebase 통합
- 간편한 배포
- 빠른 CDN

**배포 방법:**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

---

### 3. Microsoft Azure

#### Azure Static Web Apps

**가격:**
- 무료: 100GB 전송/월
- Standard: $9/월 + 사용량

**장점:**
- GitHub 통합 우수
- 서버리스 함수 포함
- 무료 플랜이 넉넉함

**배포 방법:**
1. Azure Portal에서 Static Web Apps 생성
2. GitHub 저장소 연결
3. 자동 배포

#### Azure Blob Storage + CDN

**예상 비용:**
- 저장소: 월 $0.0184/GB
- CDN: 월 $0.081/GB 전송
- 소규모: 약 $2-8/월

---

### 4. DigitalOcean

#### App Platform

**가격:** 
- Basic: $5/월 (1GB RAM, 1 vCPU)
- Professional: $12/월부터

**장점:**
- 간단한 가격 구조
- 예측 가능한 비용
- 개발자 친화적

**배포 방법:**
1. DigitalOcean 대시보드
2. App Platform → Create App
3. GitHub 저장소 선택

---

### 5. Railway

**가격:**
- 무료: $5 크레딧/월
- Hobby: $5/월
- Pro: $20/월

**장점:**
- 매우 간단한 설정
- 자동 HTTPS
- GitHub 연동

**배포 방법:**
1. https://railway.app 접속
2. GitHub 연결
3. 프로젝트 선택
4. 자동 배포

---

## 📊 플랫폼 비교표

| 플랫폼 | 무료 플랜 | 유료 시작 | 배포 난이도 | 속도 | 추천도 |
|--------|----------|----------|------------|------|--------|
| **Vercel** | ⭐⭐⭐ | $20/월 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐⭐⭐ | $19/월 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | ⭐⭐⭐⭐⭐ | $20/월 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AWS Amplify** | 없음 | 사용량 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Firebase Hosting** | ⭐⭐ | 사용량 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Azure Static Web Apps** | ⭐⭐⭐⭐ | $9/월 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **DigitalOcean** | 없음 | $5/월 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 추천 시나리오

### 개인 프로젝트 / 포트폴리오
→ **Vercel (무료)** 또는 **Cloudflare Pages**

### 소규모 상업 서비스 (< 100GB/월)
→ **Vercel Pro** 또는 **Netlify Pro**

### 중대형 서비스 (100GB+ /월)
→ **AWS Amplify** 또는 **Cloudflare Pages + 추가 서비스**

### 엔터프라이즈
→ **AWS** 또는 **Azure** (전담 지원 필요)

---

## 🚀 빠른 시작 가이드

### Vercel로 5분 안에 배포하기

1. **빌드 테스트**
   ```bash
   npm run build
   ```
   `dist` 폴더가 생성되는지 확인

2. **GitHub에 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/사용자명/저장소명.git
   git push -u origin main
   ```

3. **Vercel 배포**
   - https://vercel.com 접속
   - "Sign Up" → GitHub로 로그인
   - "Add New Project" → 저장소 선택
   - "Deploy" 클릭
   - 완료! URL 받기 (예: `프로젝트명.vercel.app`)

4. **커스텀 도메인 추가 (선택)**
   - 프로젝트 → Settings → Domains
   - 도메인 입력 후 DNS 설정

---

## 📋 배포 전 체크리스트

1. ✅ **빌드 테스트**
   ```bash
   npm run build
   ```
   - `dist` 폴더 생성 확인
   - 에러 없는지 확인

2. ✅ **로컬 프리뷰**
   ```bash
   npm run preview
   ```
   또는
   ```bash
   cd dist
   python -m http.server 8080
   ```
   - 브라우저에서 정상 작동 확인

3. ✅ **환경 변수 확인**
   - API 키나 비밀 값이 있다면 환경 변수로 설정

4. ✅ **README 업데이트**
   - 배포 URL 추가
   - 사용 방법 명시

---

## 💰 비용 예상

### 무료로 시작 가능한 경우
- 개인 프로젝트
- 월 100GB 이하 트래픽
- 포트폴리오/데모

**추천:** Vercel 무료 플랜

### 유료 플랜이 필요한 경우
- 상업적 서비스
- 월 100GB 이상 트래픽
- 팀 협업 필요

**비용 예상:**
- **소규모:** $20-30/월 (Vercel Pro, Netlify Pro)
- **중규모:** $50-100/월 (AWS Amplify, 사용량 기반)
- **대규모:** $100+/월 (AWS, Azure 직접 구성)

---

## 🆘 문제 해결

### 빌드 실패
- `npm install` 다시 실행
- Node.js 버전 확인 (18+ 권장)
- 빌드 로그 확인

### 배포 후 404 에러
- `vite.config.ts`에서 `base` 설정 확인
- SPA 라우팅 설정 확인 (Vercel은 자동 처리)

### 이미지가 로드되지 않음
- 상대 경로 사용 확인
- `base` 설정 확인

### 느린 로딩 속도
- 이미지 최적화
- 코드 스플리팅 확인
- CDN 사용 확인


