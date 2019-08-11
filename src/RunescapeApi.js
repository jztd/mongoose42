class RuneApi {
    static categoriesApi = "https://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?";
    static categories = {
        Miscellaneous: 0,
        Ammo: 1,
        Arrows: 2,
        Bolts: 3,
        ConstructionMaterials: 4,
        ConstructionProjects: 5
    };

    currentItems = {};

    getItem = (ItemSearchTerm) => {

        if (!ItemSearchTerm) {
            this.currentItems = {};
            return Promise.resolve({});
        }
        if (!isEmpty(this.currentItems)) {
            return Promise.resolve(getItemFromCache(ItemSearchTerm));
        }

        return new Promise((resolve, reject) => {
            const firstLetter = ItemSearchTerm[0];
            Promise.all(Object.keys(cate)).then(() => {
                return Promise.resolve(this.getItemFromCache(ItemSearchTerm));
            });
        });
    }

    getItemFromCache = (ItemSearchTerm) => {
        return this.currentItems[ItemSearchTerm];
    }

    getItemsFromCategory = (category) => {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', categoriesApi + this.currentItems[category]);

            request.onload = () => {
                if (request.status == 200) {
                    
                }
            }
        });
    }




}

export default RuneApi;