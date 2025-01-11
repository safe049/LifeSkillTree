document.addEventListener('DOMContentLoaded', () => {
    const treeContainer = document.getElementById('tree');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const downloadBtn = document.getElementById('download-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // 读取 achievements.json 文件
    fetch('achievements.json')
        .then(response => response.json())
        .then(data => {
            renderTree(data);
            // 默认显示全部类别
            showCategory('全部');
        })
        .catch(error => console.error('Error loading achievements:', error));

    // 渲染树形结构
    function renderTree(data) {
        for (const category in data) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = `category ${category.toLowerCase()}`;

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

    // 分类切换功能
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的 active 类
            categoryBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的 active 类
            btn.classList.add('active');
            // 显示对应类别的成就
            showCategory(btn.dataset.category);
        });
    });

    function showCategory(category) {
        if (category === '全部') {
            document.querySelectorAll('.category').forEach(cat => cat.style.display = 'block');
        } else {
            document.querySelectorAll('.category').forEach(cat => {
                if (cat.classList.contains(category.toLowerCase())) {
                    cat.style.display = 'block';
                } else {
                    cat.style.display = 'none';
                }
            });
        }
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