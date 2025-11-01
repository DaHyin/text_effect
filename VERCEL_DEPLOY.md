# Vercel 배포 단계별 가이드

## ✅ 1단계: GitHub 업로드 완료
- 저장소: https://github.com/DaHyin/text_effect
- 브랜치: main
- 코드 업로드 완료

## 🚀 2단계: Vercel 배포

### 방법 A: 웹 대시보드 (추천)

1. **Vercel 접속**
   - https://vercel.com 접속
   - "Sign Up" 클릭
   - GitHub 계정으로 로그인 (DaHyin 계정)

2. **프로젝트 추가**
   - 대시보드에서 "Add New..." 또는 "Add New Project" 클릭
   - "Import Git Repository" 선택
   - `DaHyin/text_effect` 저장소 찾기
   - "Import" 클릭

3. **프로젝트 설정 확인**
   - Framework Preset: **Vite** (자동 감지됨)
   - Build Command: `npm run build` (자동 설정됨)
   - Output Directory: `dist` (자동 설정됨)
   - Root Directory: `./` (기본값)

4. **배포 실행**
   - "Deploy" 버튼 클릭
   - 빌드 진행 상황 확인 (약 1-2분 소요)

5. **완료!**
   - 배포 완료 후 URL 받기 (예: `text-effect.vercel.app`)
   - 배포된 사이트 자동으로 열림

---

### 방법 B: Vercel CLI

터미널에서:
```bash
# Vercel CLI 설치 (한 번만)
npm install -g vercel

# 프로젝트 디렉토리에서
vercel

# 처음 실행 시:
# - Set up and deploy? Y
# - Which scope? (계정 선택)
# - Link to existing project? N
# - Project name? text-effect (원하는 이름)
# - In which directory is your code located? ./
# - Want to override settings? N

# 배포 완료!
```

프로덕션 배포:
```bash
vercel --prod
```

---

## 📝 배포 후 확인사항

✅ 사이트가 정상 작동하는지 확인
- https://text-effect.vercel.app (또는 할당받은 URL)

✅ 커스텀 도메인 추가 (선택)
- 프로젝트 → Settings → Domains
- 도메인 입력 (예: `texteffect.com`)
- DNS 설정 안내 따르기

---

## 🔄 자동 배포 설정

Vercel과 GitHub이 연결되면:
- `main` 브랜치에 push할 때마다 자동 배포
- Pull Request 생성 시 미리보기 URL 자동 생성

---

## 🎉 완료!

배포가 완료되면:
1. 공유 가능한 URL 받음
2. HTTPS 자동 적용
3. 글로벌 CDN으로 빠른 속도
4. 자동으로 최신 코드 반영

