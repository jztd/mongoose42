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

    currentItems = [];
    getItemFromCache = (ItemSearchTerm) => {
        return this.currentItems;
    }

    getItemNames = () => {
        return [
            "Nature Rune",
            "Death Rune",
            "Law Rune",
            "Runeite Helmet",
            "Medium Runite Helmet",
            "Adamant Pickaxe +1",
            "Runeite Pickaxe",
            "Party Hat",
            "Santa Hat",
            "H'oWeen Mask"
        ];
    }

    getItem = (ItemSearchTerm) => {
        if (ItemSearchTerm === "") {
            this.currentItems = [];
            return Promise.resolve("");
        }
        if (!this.currentItems.length === 0) {
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
                .then((response) => {
                    return resolve(response);
                })
                .catch((err) => {
                    console.log(`RuneServer Error: ${err}`);
                    return reject(err);
                });
        });
    }

    getItemsFromCategory = (category, firstLetter) => {
        return fetch(`/item?category=${RuneApi.categories[category]}&alpha=${firstLetter}&page=1`)
            .then((response) => {
                console.log('fetch returning');
                return response.text();
            }
        );
        // return fetch(`${RuneApi.categoriesApi}category=${RuneApi.categories[category]}&alpha=${firstLetter}&page=1`);
    }




}

export default RuneApi;