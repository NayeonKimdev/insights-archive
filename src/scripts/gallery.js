let allInsights = [];
let filteredInsights = [];
let selectedTags = new Set();

async function loadInsights() {
    try {
        const response = await fetch('../data/insights.json');
        if (!response.ok) {
            throw new Error('데이터를 불러올 수 없습니다.');
        }
        const data = await response.json();
        allInsights = data.insights.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        filteredInsights = [...allInsights];
        
        renderTagFilters();
        renderGallery();
    } catch (error) {
        console.error('Error loading insights:', error);
        document.getElementById('gallery').innerHTML = 
            '<p style="text-align: center; padding: 40px; color: #8e8e8e;">데이터를 불러올 수 없습니다. data/insights.json 파일을 확인해주세요.</p>';
    }
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
    
    gallery.innerHTML = filteredInsights.map(insight => `
        <div class="insight-card" onclick="openDetail('${insight.id}')">
            ${insight.image ? `<img src="../${insight.image}" alt="${insight.title}" onerror="this.style.display='none'">` : ''}
            <div class="insight-content">
                <h3 class="insight-title">${escapeHtml(insight.title)}</h3>
                <p class="insight-text">${escapeHtml(insight.content)}</p>
                <div class="insight-tags">
                    ${insight.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <div class="insight-meta">
                    <span>${formatDate(insight.timestamp)}</span>
                    <span class="category-badge">${insight.category || 'tech'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    
    modalBody.innerHTML = `
        ${insight.image ? `<img src="../${insight.image}" alt="${insight.title}" class="modal-image" onerror="this.style.display='none'">` : ''}
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

