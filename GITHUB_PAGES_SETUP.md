# GitHub Pages 설정 가이드

## 📋 단계별 설정 방법

### 1단계: GitHub 저장소에 코드 푸시

```bash
# 현재 변경사항 커밋
git add .
git commit -m "Initial commit: Insights Gallery setup"
git push origin main
```

### 2단계: GitHub 저장소 설정

1. **GitHub 저장소 페이지로 이동**
   - 브라우저에서 `https://github.com/[사용자명]/insights-archive` 접속

2. **Settings 메뉴 클릭**
   - 저장소 상단 메뉴에서 "Settings" 클릭

3. **Pages 메뉴 찾기**
   - 왼쪽 사이드바에서 "Pages" 클릭
   - 또는 직접 URL: `https://github.com/[사용자명]/insights-archive/settings/pages`

4. **Source 설정**
   - "Source" 섹션에서:
     - **"Deploy from a branch"** 선택 (기본값)
     - **"Branch"** 드롭다운에서 `gh-pages` 또는 `main` 선택
     - **"Folder"** 드롭다운에서 `/ (root)` 선택
   - 또는
     - **"GitHub Actions"** 선택 (권장 - 자동 배포)

5. **저장**
   - "Save" 버튼 클릭

### 3단계: GitHub Actions로 자동 배포 (권장)

이미 `.github/workflows/deploy.yml` 파일이 설정되어 있으므로:

1. **Actions 탭 확인**
   - 저장소 상단 메뉴에서 "Actions" 클릭
   - 첫 푸시 후 워크플로우가 자동 실행됨

2. **배포 상태 확인**
   - "Actions" 탭에서 "Deploy to GitHub Pages" 워크플로우 클릭
   - 녹색 체크 표시가 나타나면 배포 완료

3. **사이트 URL 확인**
   - Settings > Pages에서 사이트 URL 확인
   - 일반적으로: `https://[사용자명].github.io/insights-archive/`

### 4단계: 사이트 접속

배포가 완료되면 (보통 1-2분 소요):
- 사이트 URL로 접속하여 확인
- 예: `https://[사용자명].github.io/insights-archive/`

## ⚠️ 주의사항

- 첫 배포는 최대 10분까지 걸릴 수 있습니다
- `main` 브랜치에 푸시할 때마다 자동으로 재배포됩니다
- 배포 상태는 Actions 탭에서 확인할 수 있습니다

## 🔧 문제 해결

### 배포가 안 될 때
1. Actions 탭에서 에러 메시지 확인
2. Settings > Pages에서 Source가 올바르게 설정되었는지 확인
3. 저장소가 Public인지 확인 (Private 저장소는 GitHub Pro 필요)

### 사이트가 404 에러일 때
1. 배포가 완료될 때까지 기다리기 (최대 10분)
2. URL이 정확한지 확인: `https://[사용자명].github.io/insights-archive/`
3. 브라우저 캐시 삭제 후 다시 시도

