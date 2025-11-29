const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
let selectedImage = null;

// 드래그앤드롭
const fileSelectBtn = document.querySelector('.file-select-btn');
if (fileSelectBtn) {
    fileSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageInput.click();
    });
}

dropZone.addEventListener('click', () => imageInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0095f6';
    dropZone.style.background = '#f0f8ff';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#dbdbdb';
    dropZone.style.background = '#fafafa';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#dbdbdb';
    dropZone.style.background = '#fafafa';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImage(file);
});

function handleImage(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
    }
    
    selectedImage = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `
            <img src="${e.target.result}" style="max-width: 100%; border-radius: 8px; margin-top: 12px;">
            <button type="button" id="removeImage" style="margin-top: 8px; padding: 6px 12px; background: #efefef; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">이미지 제거</button>
        `;
        
        document.getElementById('removeImage').addEventListener('click', () => {
            selectedImage = null;
            imagePreview.innerHTML = '';
            imageInput.value = '';
        });
    };
    reader.readAsDataURL(file);
}

// 폼 제출
document.getElementById('insightForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const tagsInput = document.getElementById('tags').value.trim();
    const category = document.getElementById('category').value;
    
    if (!title || !content) {
        alert('제목과 내용은 필수입니다.');
        return;
    }
    
    const tags = tagsInput 
        ? tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];
    
    const newInsight = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        title: title,
        content: content,
        tags: tags,
        category: category,
        image: null
    };
    
    // 이미지가 있으면 처리 (로컬에서는 경로만 저장)
    if (selectedImage) {
        const imagePath = await saveImageLocally(selectedImage, newInsight.id);
        newInsight.image = imagePath;
    }
    
    await saveInsight(newInsight);
    
    alert('✅ 저장 완료!');
    window.location.href = 'index.html';
});

function generateId() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 4);
    return `${date}-${random}`;
}

async function saveImageLocally(file, insightId) {
    // 로컬에서는 파일명만 반환
    // 실제 배포 시에는 서버나 클라우드 스토리지에 업로드 필요
    const extension = file.name.split('.').pop() || 'jpg';
    return `data/images/${insightId}.${extension}`;
}

async function saveInsight(insight) {
    try {
        // 기존 데이터 로드
        const response = await fetch('../data/insights.json');
        let data = { insights: [] };
        
        if (response.ok) {
            data = await response.json();
        }
        
        // 새 인사이트 추가
        data.insights.push(insight);
        
        // 로컬 스토리지에 저장 (임시)
        // 실제로는 GitHub API나 서버를 통해 저장해야 함
        localStorage.setItem('pendingInsights', JSON.stringify(data.insights));
        
        // 사용자에게 안내
        console.log('인사이트가 준비되었습니다. data/insights.json 파일에 다음 내용을 추가하세요:');
        console.log(JSON.stringify(insight, null, 2));
        
        // GitHub Pages 환경에서는 직접 파일 수정이 불가능하므로
        // 사용자가 수동으로 추가하거나 GitHub API를 사용해야 함
        alert('💡 참고: GitHub Pages에서는 직접 파일 수정이 불가능합니다.\n\n로컬에서 개발하시거나, GitHub API를 통해 자동화하세요.\n\n현재는 localStorage에 임시 저장되었습니다.');
        
    } catch (error) {
        console.error('Error saving insight:', error);
        // 로컬 스토리지에 백업
        const stored = JSON.parse(localStorage.getItem('pendingInsights') || '[]');
        stored.push(insight);
        localStorage.setItem('pendingInsights', JSON.stringify(stored));
        
        alert('⚠️ 파일 저장에 실패했습니다. localStorage에 임시 저장되었습니다.\n\n로컬에서 data/insights.json 파일을 직접 수정하세요.');
    }
}

// 페이지 로드 시 localStorage의 대기 중인 인사이트 확인
window.addEventListener('DOMContentLoaded', () => {
    const pending = localStorage.getItem('pendingInsights');
    if (pending) {
        console.log('대기 중인 인사이트:', JSON.parse(pending));
    }
});

