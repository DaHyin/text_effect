# GitHub 업로드 가이드

## 현재 상황
- 원격 저장소: https://github.com/DaHyin/text_effect
- 브랜치: main
- 코드는 로컬에 커밋 완료

## 업로드 방법

### 방법 1: 브라우저 인증 (가장 쉬움)

1. 터미널에서 다음 명령 실행:
```bash
git push -u origin main
```

2. 브라우저가 열리면 GitHub 로그인

3. 인증 완료 후 자동으로 푸시됨

---

### 방법 2: Personal Access Token 사용

1. GitHub에서 토큰 생성:
   - https://github.com/settings/tokens 접속
   - "Generate new token (classic)" 클릭
   - 이름 입력 (예: "text-effect")
   - 권한: `repo` 체크
   - "Generate token" 클릭
   - **토큰을 복사해두세요! (다시 볼 수 없음)**

2. 푸시 시 토큰 사용:
```bash
git push -u origin main
# Username: DaHyin 입력
# Password: (복사한 토큰 붙여넣기)
```

또는 URL에 토큰 포함:
```bash
git remote set-url origin https://[토큰]@github.com/DaHyin/text_effect.git
git push -u origin main
```

---

### 방법 3: GitHub Desktop 사용

1. GitHub Desktop 설치: https://desktop.github.com/
2. 파일 → Add Local Repository
3. 현재 폴더 선택
4. Publish repository 클릭

---

## 확인

업로드 후 https://github.com/DaHyin/text_effect 에서 확인하세요!

