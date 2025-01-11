document.addEventListener('DOMContentLoaded', () => {
    const treeContainer = document.getElementById('tree');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const downloadBtn = document.getElementById('download-btn');

    // 模拟数据
    const achievements = {
        "工作": ["项目管理", "团队协作", "代码编写"],
        "学业": ["数学竞赛获奖", "英语六级通过", "论文发表"],
        "生活": ["马拉松完成", "摄影技能", "烹饪美食"],
        "杂项": ["学习新语言", "旅行各国", "志愿服务"]
    };

    function renderTree(data) {
        treeContainer.innerHTML = ''; // 清空现有内容
        for (const category in data) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = `category ${category.toLowerCase()}`;
            categoryDiv.classList.add('active'); // 默认全部显示

            const categoryHeader = document.createElement('h2');
            categoryHeader.textContent = category;
            categoryDiv.appendChild(categoryHeader);

            const itemsList = document.createElement('ul');
            data[category].forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.className = 'item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `${category}-${item}`;
                checkbox.id = `${category}-${item}`;

                const label = document.createElement('label');
                label.htmlFor = `${category}-${item}`;
                label.textContent = item;

                itemLi.appendChild(checkbox);
                itemLi.appendChild(label);
                itemsList.appendChild(itemLi);
            });
            categoryDiv.appendChild(itemsList);
            treeContainer.appendChild(categoryDiv);
        }
    }

    renderTree(achievements);

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(button => button.classList.remove('active'));
            categories.forEach(category => category.classList.remove('active'));

            btn.classList.add('active');
            const selectedCategory = btn.getAttribute('data-category');
            if (selectedCategory === '全部') {
                document.querySelectorAll('.category').forEach(category => category.classList.add('active'));
            } else {
                document.querySelector(`.category.${selectedCategory}`).classList.add('active');
            }
        });
    });

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