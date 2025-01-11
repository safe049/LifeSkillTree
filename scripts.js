document.addEventListener('DOMContentLoaded', () => {
    const treeContainer = document.getElementById('tree');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');

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

    // 导出 XML 文件
    exportBtn.addEventListener('click', () => {
        const xmlContent = '<?xml version="1.0" encoding="UTF-8"?><achievements>';
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            xmlContent += `<${checkbox.name}>${checkbox.checked}</${checkbox.name}>`;
        });
        xmlContent += '</achievements>';

        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'achievements.xml';
        a.click();
        URL.revokeObjectURL(url);
    });

    // 导入 XML 文件
    importBtn.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const xmlContent = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
                const achievements = xmlDoc.getElementsByTagName('achievements')[0];
                for (let i = 0; i < achievements.children.length; i++) {
                    const item = achievements.children[i];
                    const checkbox = document.querySelector(`input[name="${item.nodeName}"]`);
                    if (checkbox) {
                        checkbox.checked = item.textContent === 'true';
                        localStorage.setItem(item.nodeName, item.textContent);
                    }
                }
            };
            reader.readAsText(file);
        }
    });
});