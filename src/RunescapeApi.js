class RuneApi {
    static categoriesApi = "https://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?";

    currentItems = [];
    constructor() {
        fetch("/allNames").then((response) => response.json()).then((jsonResult) => {
            console.log("Setting current Items");
            this.currentItems = jsonResult;
        });
    }

    getItemNames = () => {
        return this.currentItems;
    }

}

export default RuneApi;