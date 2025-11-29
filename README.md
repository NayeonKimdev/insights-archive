# Insights Archive

매일 발견한 인사이트를 체계적으로 수집하고 관리하는 개인 지식 갤러리입니다.

## ✨ 주요 기능

- 📝 **간편한 등록**: 폼을 통해 빠르게 인사이트 등록
- 🏷️ **태그 기반 분류**: 태그로 지식을 체계적으로 관리
- 🎨 **인스타 피드 스타일**: 시각적으로 탐색 가능한 갤러리 레이아웃
- 🔍 **검색 및 필터**: 제목, 내용, 태그로 빠른 검색
- 📱 **반응형 디자인**: 모바일부터 데스크톱까지 최적화

## 🚀 시작하기

### 로컬 개발

1. 저장소 클론
```bash
git clone <repository-url>
cd insights-archive
```

2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# 또는 Node.js (http-server)
npx http-server
```

3. 브라우저에서 열기
```
http://localhost:8000/public/index.html
```

### GitHub Pages 배포

1. 저장소 설정에서 Pages 활성화
2. Source를 "GitHub Actions"로 설정
3. `main` 브랜치에 푸시하면 자동 배포

## 📁 프로젝트 구조

```
insights-archive/
├── public/
│   ├── index.html          # 메인 갤러리 페이지
│   └── admin.html          # 인사이트 등록 폼
├── src/
│   ├── styles/
│   │   ├── gallery.css     # 갤러리 스타일
│   │   └── admin.css       # 폼 스타일
│   └── scripts/
│       ├── gallery.js      # 갤러리 로직
│       └── admin.js        # 등록 로직
├── data/
│   └── insights.json       # 인사이트 데이터 저장소
└── .github/
    └── workflows/
        └── deploy.yml      # 자동 배포 워크플로우
```

## 📝 데이터 형식

인사이트는 `data/insights.json`에 다음 형식으로 저장됩니다:

```json
{
  "insights": [
    {
      "id": "20251129-001",
      "timestamp": "2025-11-29T14:30:00+09:00",
      "title": "인사이트 제목",
      "content": "상세 내용",
      "tags": ["태그1", "태그2"],
      "category": "tech",
      "image": "data/images/20251129-001.jpg"
    }
  ]
}
```

## 🎯 사용 방법

1. **인사이트 등록**
   - `admin.html`에서 새 인사이트 추가
   - 제목, 내용, 태그, 카테고리 입력
   - 이미지 선택 (선택사항)

2. **갤러리 탐색**
   - `index.html`에서 모든 인사이트 확인
   - 검색창으로 키워드 검색
   - 태그 버튼으로 필터링
   - 카드 클릭으로 상세 내용 확인

## 🔮 향후 계획

- [ ] AI를 통한 자동 메타데이터 생성
- [ ] 이미지 업로드 자동화 (Cloudinary/ImgBB 연동)
- [ ] GitHub API를 통한 자동 저장
- [ ] 다크 모드 지원
- [ ] 인사이트 통계 및 분석

## 📄 라이선스

MIT License
