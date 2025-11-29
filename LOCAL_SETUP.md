# 로컬에서 사이트 실행하기

## 🚀 방법 1: Python 로컬 서버 (가장 간단)

### Windows에서:

1. **터미널 열기**
   - 프로젝트 폴더에서 우클릭 > "Git Bash Here" 또는 PowerShell 열기

2. **Python 서버 실행**
```bash
# Python 3가 설치되어 있다면
python -m http.server 8000

# 또는
python3 -m http.server 8000
```

3. **브라우저에서 열기**
   - 브라우저 주소창에 입력: `http://localhost:8000/public/index.html`
   - 또는: `http://127.0.0.1:8000/public/index.html`

### 서버 중지
- 터미널에서 `Ctrl + C` 누르기

---

## 🌐 방법 2: Node.js http-server

### 설치 (처음 한 번만)
```bash
npm install -g http-server
```

### 실행
```bash
# 프로젝트 루트에서
http-server -p 8000
```

### 브라우저에서 열기
- `http://localhost:8000/public/index.html`

---

## 📁 방법 3: VS Code Live Server 확장

1. **VS Code에서 확장 설치**
   - 확장 아이콘 클릭 (왼쪽 사이드바)
   - "Live Server" 검색 후 설치

2. **파일 열기**
   - `public/index.html` 파일을 VS Code에서 열기

3. **서버 실행**
   - 파일에서 우클릭 > "Open with Live Server"
   - 또는 하단 상태바의 "Go Live" 버튼 클릭

---

## ⚠️ 중요: 왜 직접 더블클릭하면 안 되나요?

HTML 파일을 직접 더블클릭하면:
- ❌ 상대 경로 (`../src/styles/gallery.css`)가 작동하지 않음
- ❌ JavaScript에서 JSON 파일을 불러올 수 없음 (CORS 오류)
- ❌ 모든 기능이 제대로 작동하지 않음

**반드시 로컬 서버를 통해 실행해야 합니다!**

---

## 🎯 빠른 시작 (추천)

가장 간단한 방법:

```bash
# 1. 프로젝트 폴더로 이동
cd c:\Users\0o01k\Desktop\insights-archive

# 2. Python 서버 실행
python -m http.server 8000

# 3. 브라우저에서 열기
# http://localhost:8000/public/index.html
```

---

## 🔍 문제 해결

### Python이 없다고 나올 때
- Python 설치: https://www.python.org/downloads/
- 또는 Node.js 방법 사용

### 포트가 이미 사용 중일 때
- 다른 포트 사용: `python -m http.server 8080`
- 브라우저에서: `http://localhost:8080/public/index.html`

### 파일을 찾을 수 없다고 나올 때
- 터미널에서 현재 위치 확인: `pwd` (Linux/Mac) 또는 `cd` (Windows)
- 프로젝트 루트 폴더(`insights-archive`)에 있는지 확인

