document.addEventListener('DOMContentLoaded', () => {
    const treeContainer = document.getElementById('tree');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const downloadBtn = document.getElementById('download-btn');

    // 读取 achievements.json 文件
    fetch('achievements.json')
        .then(response => response.json())
        .then(data => {
            renderTree(data);
        })
        .catch(error => console.error('Error loading achievements:', error));

    // 渲染树形结构
    function renderTree(data) {
        for (const category in data) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';

            const categoryHeader = document.createElement('h2');
            categoryHeader.textContent = category;
            categoryDiv.appendChild(categoryHeader);

            const itemsList = document.createElement('ul');
            itemsList.className = 'items';

            data[category].forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.className = 'item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `${category}-${item}`;
                checkbox.id = `${category}-${item}`;
                checkbox.checked = localStorage.getItem(`${category}-${item}`) === 'true';

                const label = document.createElement('label');
                label.htmlFor = `${category}-${item}`;
                label.textContent = item;

                itemLi.appendChild(checkbox);
                itemLi.appendChild(label);

                itemsList.appendChild(itemLi);

                checkbox.addEventListener('change', () => {
                    localStorage.setItem(`${category}-${item}`, checkbox.checked);
                });
            });

            categoryDiv.appendChild(itemsList);
            treeContainer.appendChild(categoryDiv);
        }
    }

    // 搜索功能
    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchQuery = searchInput.value.toLowerCase();
        const labels = document.querySelectorAll('.item label');

        labels.forEach(label => {
            const text = label.textContent.toLowerCase();
            if (text.includes(searchQuery)) {
                label.classList.add('highlight');
            } else {
                label.classList.remove('highlight');
            }
        });
    }

    // 下载本地存储数据
    downloadBtn.addEventListener('click', () => {
        const data = {};
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'achievements.json';
        a.click();
        URL.revokeObjectURL(url);
    });
});