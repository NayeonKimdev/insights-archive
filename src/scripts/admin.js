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
    
    // 이미지가 있으면 base64로 변환하여 저장
    if (selectedImage) {
        const base64Image = await imageToBase64(selectedImage);
        newInsight.image = base64Image;
    }
    
    await saveInsight(newInsight);
    
    // 저장 완료 후 메인 페이지로 이동
    alert('✅ 저장 완료! 메인 페이지에서 확인하세요.');
    window.location.href = 'index.html';
});

function generateId() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 4);
    return `${date}-${random}`;
}

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function saveInsight(insight) {
    try {
        // 기존 localStorage 데이터 로드
        const stored = localStorage.getItem('insights');
        let allInsights = stored ? JSON.parse(stored) : [];
        
        // 새 인사이트 추가
        allInsights.push(insight);
        
        // localStorage에 저장
        localStorage.setItem('insights', JSON.stringify(allInsights));
        
        // JSON 파일에도 시도 (실패해도 무시)
        try {
            const response = await fetch('../data/insights.json');
            if (response.ok) {
                const data = await response.json();
                data.insights.push(insight);
                // 실제 파일 저장은 불가능하지만 시도는 함
            }
        } catch (e) {
            // 무시
        }
        
    } catch (error) {
        console.error('Error saving insight:', error);
        alert('⚠️ 저장 중 오류가 발생했습니다.');
    }
}

// 페이지 로드 시 localStorage의 대기 중인 인사이트 확인
window.addEventListener('DOMContentLoaded', () => {
    const pending = localStorage.getItem('pendingInsights');
    if (pending) {
        console.log('대기 중인 인사이트:', JSON.parse(pending));
    }
});

