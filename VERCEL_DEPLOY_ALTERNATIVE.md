# Vercel 배포 - 대체 방법

## "Add New Project"가 안 보일 때

### 방법 1: 대시보드에서 직접 찾기

1. Vercel 로그인 후 대시보드 페이지 확인
2. 상단에 다음 중 하나가 보일 수 있습니다:
   - **"New Project"** 버튼
   - **"Import Project"** 버튼
   - **"Create"** 또는 **"Create Project"** 버튼
   - **"Add..."** 드롭다운 메뉴
   - **"Projects"** 탭 클릭 → 상단의 "+" 버튼

3. 또는 왼쪽 사이드바에서:
   - **"Projects"** 클릭
   - 상단의 **"Add New..."** 또는 **"New Project"** 버튼

---

### 방법 2: 직접 URL로 접속

브라우저에서 직접 접속:
```
https://vercel.com/new
```

또는:
```
https://vercel.com/dashboard
```
→ 상단의 "New Project" 버튼 클릭

---

### 방법 3: 저장소 직접 연결

1. **https://vercel.com/new** 접속
2. GitHub 저장소 목록이 보임
3. **`DaHyin/text_effect`** 찾아서 클릭
4. "Import" 또는 "Deploy" 클릭

---

### 방법 4: Vercel CLI 사용 (가장 확실함)

터미널에서:
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 폴더에서 실행
vercel
```

처음 실행 시:
- Set up and deploy? → **Y**
- Which scope? → **DaHyin** 선택
- Link to existing project? → **N**
- Project name? → **text-effect** (원하는 이름)
- In which directory? → **./**
- Want to override settings? → **N**

배포 완료 후 프로덕션 배포:
```bash
vercel --prod
```

---

## 현재 보이는 화면 확인

Vercel 대시보드에서 보이는 버튼이나 메뉴가 있으면 알려주세요:
- "New Project"
- "Import Project"
- "Create"
- "+" 아이콘
- 기타 버튼

어떤 화면이 보이는지 알려주시면 더 정확히 안내해드릴 수 있습니다!

