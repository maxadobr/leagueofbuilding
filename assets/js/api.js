const lolAPI = {}

const version = '15.17.1';
const lang = 'pt_BR';

function convertLolApiDetailToItem(itemDetails) {
    const item = new Item();

    item.id = itemDetails.id;
    item.name = itemDetails.name;
    item.depth = itemDetails.depth;
    item.description = itemDetails.description;
    item.maps = itemDetails.maps;
    item.goldBase = itemDetails.gold.base;
    item.goldTotal = itemDetails.gold.total;
    item.imageFull = itemDetails.image.full;
    item.imageSprite = itemDetails.image.sprite;
    item.from = itemDetails.from;
    item.into = itemDetails.into;
    item.stats = itemDetails.stats;
    item.tags = itemDetails.tags;
}

lolAPI.getItemDetails = async (item) => {
    const response = await fetch(item.url);
    const itemDetails = await response.json();
    return convertLolApiDetailToItem(itemDetails);
}

    lolAPI.getItems = async () => {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${lang}/item.json`

    try {
        const response = await fetch(url);
        const jsonBody = await response.json();
        return jsonBody.data;
    } catch (error) {
        console.error('Erro ao buscar dados dos itens.');
        return {};
    }

}