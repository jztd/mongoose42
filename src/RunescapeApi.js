class RuneApi {
    static categoriesApi = "https://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?";

    static currentItems = [];
    constructor() {
        fetch("/allNames").then((response) => response.json()).then((jsonResult) => {
            if(RuneApi.currentItems.length === 0) {
                RuneApi.currentItems = jsonResult;
            }
        });
    }

    getItemNames = () => {
        return RuneApi.currentItems;
    }

    getItemInfo = (itemName) => {
        return new Promise((resolve, reject) => {
            console.log("sending: " + itemName);
            fetch("/item?name="+itemName).then(response => response.json()).then(json => {
                console.log("resolving " + json);
                resolve(json);
            })
            .catch(error => {
                console.log(error);
            });
        });
    }
}

export default RuneApi;