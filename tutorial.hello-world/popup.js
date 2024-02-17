let accThis;
let childEle;

const addItem = document.querySelector('.add-item');
let allItem = [];


// 取得 storage 中的資料
async function renderData() {
    allItem = [];
    let { message, item } = await chrome.storage.session.get(['message', 'item']);
    allItem = item
    // console.log('allItem', allItem);
    document.querySelector('.acc-wrapper').innerHTML = '';
    if (allItem) {
        // 排序
        allItem = allItem.sort((a, b) => a.id - b.id)
        for (const item of allItem) {

            document.querySelector('.acc-wrapper').innerHTML +=
                '<div class="acc-container">' +
                '<div class="acc-toggle">' +
                `<label><input class="item-name" data-id="${item.id}" value="${item.name}"></label>` +
                '<div class="right-block">' +
                '<span class="acc-indicator"></span>' +
                `<button class="button remove-item" data-id="${item.id}">刪除</button>` +
                '</div>' +
                '</div>' +
                '<div class="acc-body">' +
                `<textarea class="text-content" name="message-area" data-id="${item.id}" id="message-area-${item.id}" value="${item.content}" autofocus></textarea>` +
                '</div>' +
                '</div>'
        }


        const allAccordion = document.querySelectorAll('.acc-toggle');
        const remove = document.querySelectorAll('.remove-item');
        const itemName = document.querySelectorAll('.item-name');
        const textContent = document.querySelectorAll('.text-content');

        // 添加事件
        allAccordion.forEach(function (toggle) {
            toggle.addEventListener('click', accFunction);
        });
        remove.forEach(function (toggle) {
            toggle.addEventListener('click', removeItem);
        });
        itemName.forEach(function (toggle) {
            toggle.addEventListener('change', editItemNameInput);
        });
        textContent.forEach(function (toggle) {
            toggle.addEventListener('change', submitContent);
            // render出資料
            allItem.forEach(item => {
                if (item.id === parseInt(toggle.dataset.id)) {
                    toggle.value = item.content ?? '';
                }
            })
        });
    }
}

// 由於每次重新打開 popup，就等同打開新視窗，所以使用 onload 重新取得資料
window.onload = () => {
    renderData();
}

// 新增item
addItem.addEventListener('click', () => {
    // 添加 id作為儲存在local的item
    if (!allItem || allItem.length === 0) { //如果沒有資料,重頭開始新增
        chrome.storage.session.set({ item: [{ id: 0, name: '', content: '' }] })
    } else {
        const maxIdObject = allItem.reduce(function (max, obj) {
            return obj.id > max.id ? obj : max;
        }, allItem[0]);
        let maxId = parseInt(maxIdObject.id) + 1;
        allItem.push({ id: maxId, name: '', content: '' });
        chrome.storage.session.set({ item: allItem });
    }
    renderData();
})

// 刪除item
function removeItem(e) {
    const target = e.target;
    const resultItem = allItem.filter(item => item.id !== parseInt(target.dataset.id));
    chrome.storage.session.set({ item: resultItem });
    renderData();
}

// 修改item name
function editItemNameInput(e) {
    const input = e.target;
    const targetContent = this.parentElement.parentElement.nextSibling.childNodes[0].value;
    // 找到當前的item
    const targetInput = allItem.filter(item => item.id === parseInt(input.dataset.id));
    let editItem = allItem.filter(item => item.id !== parseInt(input.dataset.id));
    editItem.push({ id: parseInt(input.dataset.id), name: input.value, content: targetInput.content });
    chrome.storage.session.set({ item: editItem });
    renderData();
}

// 輸入content
function submitContent(e) {
    const targetContent = e.target;
    // 取得該item的名字
    const itemName = this.parentElement.parentElement.childNodes[0].childNodes[0].childNodes[0].value;
    let editContent = allItem.filter(item => item.id !== parseInt(targetContent.dataset.id));
    editContent.push({ id: parseInt(targetContent.dataset.id), name: itemName, content: targetContent.value });
    chrome.storage.session.set({ item: editContent });
    renderData();
}

// 展開/關閉item
function accFunction(e) {
    const clickTarget = e.target;
    // 點到刪除按鈕不作動
    if (!clickTarget.classList.contains('remove-item') && !clickTarget.classList.contains('item-name')) {
        // storing function this in variable
        accThis = this;
        childEle = this.parentElement.parentElement;
        if (this.parentElement.classList.contains('acc-open') === true) {
            // Close the clicked accordion
            this.parentElement.classList.remove('acc-open');
            this.parentElement.querySelector('.acc-body').classList.remove('acc-body-active');
        } else {
            // Close the sibling accordions
            closeSiblings();
            // Open the clicked accordion
            this.parentElement.classList.add('acc-open');
            this.parentElement.querySelector('.acc-body').classList.add('acc-body-active');
        }
    }

}

// 關閉其他的item
function closeSiblings() {
    for (let i = 0; i <= childEle.childElementCount - 1; i++) {
        if (childEle.children[i].classList.contains('acc-open') === true) {
            // checking all the parents children with "acc-body-active" class
            for (let j = 0; j <= childEle.children[i].childElementCount - 1; j++) {
                if (childEle.children[i].children[j].classList.contains('acc-body-active') === true) {
                    // closing 'acc-body-active' by removing 'acc-body-active' class
                    childEle.children[i].classList.remove('acc-open');
                    childEle.children[i].children[j].classList.remove('acc-body-active');
                }
            }
        }
    }
}
