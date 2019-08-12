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
        console.log(ItemSearchTerm);
        if (ItemSearchTerm === "") {
            console.log("returning early");
            this.currentItems = {};
            return Promise.resolve({});
        }
        if (!(Object.keys(this.currentItems).length === 0)) {
            return Promise.resolve(this.getItemFromCache(ItemSearchTerm));
        }

        return new Promise((resolve, reject) => {
            console.log("search term in api");
            console.log(ItemSearchTerm);
            const firstLetter = ItemSearchTerm[0];
            let cats = Object.keys(RuneApi.categories);
            let promises = [];
            for (var i = 0; i < cats.length; i++) {
                promises.push(this.getItemsFromCategory(cats[i], firstLetter));
            }
            console.log("promises");
            console.log(promises);
            Promise.all(promises)
                .then(() => {
                    console.log('returning from promise all');
                    console.log();
                    return Promise.resolve(this.getItemFromCache(ItemSearchTerm));
                })
                .catch((err) => {
                    console.log(err);
                });
            console.log("after promise all");

        });
    }


    getItemsFromCategory = (category, firstLetter) => {
        console.log('In getItemsFromCategory');
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.withCredentials = true;
            request.open('GET', RuneApi.categoriesApi + "category=" + RuneApi.categories[category] + "&alpha=" + firstLetter + "&page=1", true);
            console.log(request);
            // console.log(RuneApi.categoriesApi + "category=" + this.categories[category] + "&alpha=" + firstLetter + "&page=1");
            request.onload = () => {
                console.log('loaded');
                if (request.status == 200) {
                    this.currentItems.thisResult = request.response;
                    console.log(request.response);
                    return resolve();
                } else {
                    console.log(request.response);
                    return reject("callout bad");
                }
            }

            request.send();
        });
    }




}

export default RuneApi;