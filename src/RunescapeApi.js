class RuneApi {
    static categoriesApi = "https://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?";
    static categories = {
        Miscellaneous: 0,
        Ammo: 1,
        Arrows: 2,
        Bolts: 3,
        ConstructionMaterials: 4,
        ConstructionProjects: 5
    };

    currentItems = {};
    getItemFromCache = (ItemSearchTerm) => {
        return this.currentItems.thisResult;
    }

    getItem = (ItemSearchTerm) => {
        if (ItemSearchTerm === "") {
            this.currentItems = {};
            return Promise.resolve({});
        }
        if (!(Object.keys(this.currentItems).length === 0)) {
            return Promise.resolve(this.getItemFromCache(ItemSearchTerm));
        }

        return new Promise((resolve, reject) => {
            console.log(ItemSearchTerm);
            const firstLetter = ItemSearchTerm[0];
            let cats = Object.keys(RuneApi.categories);
            let promises = [];
            for (var i = 0; i < cats.length; i++) {
                promises.push(this.getItemsFromCategory(cats[i], firstLetter));
            }
            Promise.all(promises)
                .then(() => {
                    return Promise.resolve(this.getItemFromCache(ItemSearchTerm));
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }


    getItemsFromCategory = (category, firstLetter) => {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', RuneApi.categoriesApi + "category=" + RuneApi.categories[category] + "&alpha=" + firstLetter + "&page=1", true);
            request.onload = () => {
                if (request.status == 200) {
                    this.currentItems.thisResult = request.response;
                    return resolve();
                } else {
                    return reject("callout bad");
                }
            }

            request.send();
        });
    }




}

export default RuneApi;