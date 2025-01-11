document.addEventListener('DOMContentLoaded', () => {
    const treeContainer = document.getElementById('tree');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const downloadBtn = document.getElementById('download-btn');
    const levelDisplay = document.getElementById('level-display'); 
    levelDisplay.id = 'level-display';
    levelDisplay.style.marginTop = '20px';
    levelDisplay.style.textAlign = 'center';
    document.body.appendChild(levelDisplay);

    // 读取 achievements.json 文件
    fetch('achievements.json')
        .then(response => response.json())
        .then(data => {
            renderTree(data);
            updateLevel(data); // 初始加载时更新等级
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
                    updateLevel(data); // 每次成就状态改变时更新等级
                });
            });

            categoryDiv.appendChild(itemsList);
            treeContainer.appendChild(categoryDiv);
        }
    }

    // 更新等级
    function updateLevel(data) {
        let totalAchievements = 0;
        let completedAchievements = 0;

        for (const category in data) {
            data[category].forEach(item => {
                totalAchievements++;
                if (localStorage.getItem(`${category}-${item}`) === 'true') {
                    completedAchievements++;
                }
            });
        }

        const level = calculateLevel(completedAchievements, totalAchievements);
        localStorage.setItem('level', level); // 保存等级到本地存储
        levelDisplay.textContent = `当前等级: ${level}`;
    }

    // 计算等级
    function calculateLevel(completed, total) {
        const percentage = (completed / total) * 100;
        if (percentage >= 100) return 'lv.6:挂!';
        if (percentage >= 80) return 'lv.5:这个入是挂!';
        if (percentage >= 60) return 'lv.4:人生的赢家';
        if (percentage >= 40) return 'lv.3:少数';
        if (percentage >= 20) return 'lv.2:懵懂';
        return 'lv.1:还没出生';
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