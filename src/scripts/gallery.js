let allInsights = [];
let filteredInsights = [];
let selectedTags = new Set();

async function loadInsights() {
    let insights = [];
    
    // 1. localStorage에서 데이터 로드
    const stored = localStorage.getItem('insights');
    if (stored) {
        try {
            insights = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing localStorage:', e);
        }
    }
    
    // 2. JSON 파일에서도 데이터 로드 (병합)
    try {
        const response = await fetch('../data/insights.json');
        if (response.ok) {
            const data = await response.json();
            // localStorage와 병합 (중복 제거)
            const fileInsights = data.insights || [];
            const existingIds = new Set(insights.map(i => i.id));
            fileInsights.forEach(insight => {
                if (!existingIds.has(insight.id)) {
                    insights.push(insight);
                }
            });
        }
    } catch (error) {
        console.log('JSON 파일을 불러올 수 없습니다. localStorage 데이터만 사용합니다.');
    }
    
    // 시간순 정렬
    allInsights = insights.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    filteredInsights = [...allInsights];
    
    renderTagFilters();
    renderGallery();
}

function renderTagFilters() {
    const allTags = [...new Set(allInsights.flatMap(i => i.tags))].sort();
    const container = document.getElementById('tagFilters');
    
    if (allTags.length === 0) {
        container.innerHTML = '<p style="color: #8e8e8e; font-size: 13px;">아직 태그가 없습니다.</p>';
        return;
    }
    
    container.innerHTML = allTags.map(tag => `
        <button class="tag-btn" data-tag="${tag}">${tag}</button>
    `).join('');
    
    container.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
                btn.classList.remove('active');
            } else {
                selectedTags.add(tag);
                btn.classList.add('active');
            }
            
            filterInsights();
        });
    });
}

function filterInsights() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredInsights = allInsights.filter(insight => {
        const matchesSearch = 
            insight.title.toLowerCase().includes(searchTerm) ||
            insight.content.toLowerCase().includes(searchTerm) ||
            insight.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesTags = selectedTags.size === 0 || 
            insight.tags.some(tag => selectedTags.has(tag));
        
        return matchesSearch && matchesTags;
    });
    
    renderGallery();
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    if (filteredInsights.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #8e8e8e;">
                <p style="font-size: 18px; margin-bottom: 8px;">검색 결과가 없습니다</p>
                <p style="font-size: 14px;">다른 키워드나 태그로 검색해보세요.</p>
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = filteredInsights.map(insight => {
        // 이미지가 base64인지 경로인지 확인
        const imageSrc = insight.image 
            ? (insight.image.startsWith('data:') ? insight.image : `../${insight.image}`)
            : null;
        
        // JSON 데이터 준비 (이미지는 축약)
        const jsonData = {
            id: insight.id,
            timestamp: insight.timestamp,
            title: insight.title,
            content: insight.content.substring(0, 100) + (insight.content.length > 100 ? '...' : ''),
            tags: insight.tags,
            category: insight.category || 'tech',
            image: imageSrc ? '📷 [Image attached]' : null
        };
        
        const jsonString = JSON.stringify(jsonData, null, 2);
        
        return `
        <div class="insight-card" onclick="openDetail('${insight.id}')">
            ${imageSrc ? `<div class="insight-thumbnail"><img src="${imageSrc}" alt="${insight.title}" onerror="this.style.display='none'"></div>` : ''}
            <div class="insight-content">
                <div class="json-viewer">
                    <pre class="json-code">${highlightJSON(jsonString)}</pre>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function highlightJSON(json) {
    // JSON 문자열을 HTML로 변환하면서 색상 적용
    return json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function openDetail(id) {
    const insight = allInsights.find(i => i.id === id);
    if (!insight) return;
    
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    const imageSrc = insight.image 
        ? (insight.image.startsWith('data:') ? insight.image : `../${insight.image}`)
        : null;
    
    modalBody.innerHTML = `
        ${imageSrc ? `<img src="${imageSrc}" alt="${insight.title}" class="modal-image" onerror="this.style.display='none'">` : ''}
        <h2 class="modal-title">${escapeHtml(insight.title)}</h2>
        <div class="modal-content-text">${escapeHtml(insight.content).replace(/\n/g, '<br>')}</div>
        <div class="modal-tags">
            ${insight.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="modal-meta">
            <span>${formatDate(insight.timestamp)}</span>
            <span class="category-badge">${insight.category || 'tech'}</span>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 모달 닫기
document.addEventListener('DOMContentLoaded', () => {
    loadInsights();
    
    document.getElementById('searchInput').addEventListener('input', filterInsights);
    
    const modal = document.getElementById('detailModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});

// 전역 함수로 노출
window.openDetail = openDetail;

