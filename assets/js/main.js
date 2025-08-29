const itemList = document.getElementById('itemList')
const shopList = document.getElementById('itemList');
const arsenalList = document.getElementById('early-game');

function updateTotalCost() {
    const arsenalItems = arsenalList.querySelectorAll('li');
    let totalCost = 0;

    arsenalItems.forEach(item => {
        const cost = parseInt(item.dataset.goldTotal, 10);
        if (!isNaN(cost)) {
            totalCost += cost;
        }
    });

    const totalCostElement = document.getElementById('total-cost');
    totalCostElement.textContent = `Gold: ${totalCost}`;
}

function createItemOnShop(item) {
    return `
        <li class="item" data-gold-total="${item.goldTotal}">
            <img src="https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${item.imageFull}" alt="${item.name}">
            <div class="price">
                ${item.goldTotal}
            </div>
        </li>
    `;
}

function populateFilteredItems(items) {
    
        const newHtml = items.map(createItemOnShop).join('');

        itemList.innerHTML += newHtml;
}

function filterItemsByMap(items) {
    const summonersRiftId = 11;

    return items.filter(item => item.maps[summonersRiftId] === true);
}

function filterItemsByIsActive(items) {
    const summonersRiftId = '11';

    return items.filter(item => {
        const isPurchasable = item.goldPurchasable === true;

        const hasPlaintext = item.description && item.description.includes("<mainText>");

        const noChampionBound = item.requiredChampion == undefined;

        const isActiveOnMap = item.maps[summonersRiftId] === true;

        const notInGameModified = 
            item.name !== 'Armaguarda Despedaçada' && 
            item.name !== 'Marcha Célere' &&
            item.name !== 'Grevas Bélicas' &&
            item.name !== 'Mobilização Blindada' &&
            item.name !== 'Sempre Avante' &&
            item.name !== 'Lucidez Escarlate' &&
            item.name !== 'Sapatos Enfeitiçados' &&
            item.name !== 'Suco de Chapéu' &&
            item.name !== 'Esmagadores Acorrentados';
        
        return isPurchasable && hasPlaintext && noChampionBound && notInGameModified && isActiveOnMap;
    });
}

shopList.addEventListener('click', event => {
    const clickedItem = event.target.closest('.item');

    if (!clickedItem) {
        return;
    }

    const itemCost = clickedItem.dataset.goldTotal;
    const imgSrc = clickedItem.querySelector('img').src;
    
    const newItemLi = document.createElement('li');
    newItemLi.classList.add('item');
    newItemLi.setAttribute('data-gold-total', itemCost);

    newItemLi.innerHTML = `
        <img src="${imgSrc}">
        <div class="price">
            ${itemCost}
        </div>
    `;

    arsenalList.appendChild(newItemLi);

    updateTotalCost();
});

arsenalList.addEventListener('click', event => {
    const clickedItem = event.target.closest('li');
    if (!clickedItem) return;

    clickedItem.remove();

    updateTotalCost();
});

document.addEventListener('DOMContentLoaded', async function() {
    const itemsObject = await lolAPI.getItems();
    const itemsArray = Object.values(itemsObject);

        const customItems = itemsArray.map(item => {
        const customItem = new Item();
        customItem.id = item.id;
        customItem.name = item.name;
        customItem.depth = item.depth;
        customItem.description = item.description;
        customItem.maps = item.maps;
        customItem.requiredChampion = item.requiredChampion;
        customItem.goldBase = item.gold.base;
        customItem.goldTotal = item.gold.total;
        customItem.goldPurchasable = item.gold.purchasable;
        customItem.imageFull = item.image.full;
        customItem.imageSprite = item.image.sprite;
        customItem.from = item.from;
        customItem.into = item.into;
        customItem.stats = item.stats;
        customItem.tags = item.tags;
        return customItem;
    });

    const activeItems = filterItemsByIsActive(customItems);

    const sortedItems = activeItems.sort((a, b) => {
        const goldComparison = a.goldTotal - b.goldTotal;
        if (goldComparison !== 0) {
            return goldComparison;
        }

        return a.name.localeCompare(b.name);
    });

    populateFilteredItems(sortedItems);

    console.log(sortedItems);
});