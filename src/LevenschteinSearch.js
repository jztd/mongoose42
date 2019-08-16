import RuneApi from './RunescapeApi';

class LevenschteinSearch {
    static api = new RuneApi();

    //Compares two strings and returns an integer metric of similarity. 0 indicates exact match.
    //To read about the levenschtein algorithm: https://en.wikipedia.org/wiki/Levenshtein_distance
    static levenshteinDistance = (searchTerm, existingTerm) => {
        let rowAbv, rowBel = [];
        let left, right = "";

        //Find longest term -- Set longest term for algorithm
        if (searchTerm < existingTerm) {
            rowAbv = new Array(existingTerm.length + 1);
            rowBel = new Array(existingTerm.length + 1);
            left = searchTerm;
            right = existingTerm;
        } else {
            rowAbv = new Array(searchTerm.length + 1);
            rowBel = new Array(searchTerm.length + 1);
            left = existingTerm;
            right = searchTerm;
        }

        //Perform Levenschtein Algorithm
        for (let i = 0; i < rowAbv.length; i++) {
            rowAbv[i] = i;
        }
        for (let i = 0; i < left.length; i++) {
            rowBel[0] = i + 1;
            for (let j = 0; j < right.length; j++) {
                rowBel[j+1] = Math.min(rowAbv[j+1] + 1, rowBel[j] + 1, ((left[i] === right[j]) ? rowAbv[j] : rowAbv[j] + 1));
            }
            for (let j = 0; j < rowAbv.length; j++) {
                rowAbv[j] = rowBel[j];
            }
        }

        //Return Levenschtein distance
        return rowAbv[rowAbv.length - 1];
    }

    //Compares the searchTerm to a saved list of items and returns the closest matches.
    //TODO: Single letter searchterms pair with items containing "+1" or other short
    //      words the best, even without a precise letter match. Should implement
    //      a priority order such that if the best levenschtein distance is the result
    //      of word length without a match, that result loses priority.
    static getCloseNames = (searchTerm) => {
        const splitSearchTerm = searchTerm.split(" ");
        let closeItems = [[new Array(splitSearchTerm.length), "a"],
                          [new Array(splitSearchTerm.length), "b"],
                          [new Array(splitSearchTerm.length), "c"],
                          [new Array(splitSearchTerm.length), "d"],
                          [new Array(splitSearchTerm.length), "e"]];
        const itemNames = this.api.getItemNames();

        //Return empty array for empty search terms
        if (searchTerm === "") {
            return [];
        }

        //Iterate through each item name and sort into return array
        itemNames.forEach(element => {
            const splitString = element.split(" ");
            const distArr = [];
            splitSearchTerm.forEach(term => {
                let distArr2 = [];
                for (let i = 0; i < splitString.length; i++) {
                    distArr2.push(this.levenshteinDistance(term.toLowerCase(),splitString[i].toLowerCase()));
                }
                distArr.push(this.bubbleSort(distArr2));
            });
            this.insertItem([this.bubbleSort2(distArr), element], closeItems);
            console.log("--------------------------------------------");
            closeItems.forEach(item => console.log(item));
        });

        //Return list of search suggestions
        return closeItems;
    }

    //It's a bubble sort! No....really, it works this time. I swear...
    static bubbleSort = (itemArr) => {
        for (let i = 0; i < itemArr.length - 1; i++) {
            for (let j = 0; j < itemArr.length - 1 - i; j++) {
                if (itemArr[j+1] < itemArr[j]) {
                    let temp = itemArr[j];
                    itemArr[j] = itemArr[j+1];
                    itemArr[j+1] = temp;
                }
            }
        }
        return itemArr;
    }

    //It's a 2D bubble sort! It can be quite finicky...
    //NOTE: If you get rid of the variable 'len' and just substitute its value
    //      directly, the sorting method fails.....no idea why.
    static bubbleSort2 = (itemArr) => {
        //Loop array.length - 1 times to complete the sort
        let len = itemArr[0].length;
        for (let i = 0; i < itemArr.length - 1; i++) {
            //j is the index of the first level of array
            for (let j = 0; j < itemArr.length - 1 - i; j++) {
                //k is the index of the second level of array
                for (let k = 0; k < len; k++) {
                    if (itemArr[j+1][k] < itemArr[j][k]) {
                        let temp = itemArr[j];
                        itemArr[j] = itemArr[j+1];
                        itemArr[j+1] = temp;
                        break;
                    } else if (itemArr[j+1][k] > itemArr[j][k]) { //This is the part i was missing...
                        break
                    }
                }
            }
        }
        return itemArr;
    }


    static insertItem = (newItem, orderedItems) => {
        //Grab the distance array of the new item
        let newOrderArray = newItem[0];
        //Create a flag that indicates the new item is a better match
        //than the old item being compared in the list of ordered items
        let flag = false;
        //Iterate through all current ordered items
        for (let i = 0; i < orderedItems.length; i++) {
            //Grab the distance array of the i^th ordered item
            const oldOrderArray = orderedItems[i][0];
            //Check for non-initialized old order array and set flag to true
            if (typeof oldOrderArray[0] === 'undefined') {
                flag = true;
            } else {
                //NOTE: Both arrays have the same first level array lengths (splitSearchTerm.length)
                //Iterate over the first level arrays and compare them in order
                //k is the index of the first level arrays to compare
                for (let k = 0; flag === false && k < newOrderArray.length; k++) {
                    let flag2 = false;                    
                    let shortestLen2 = newOrderArray[k].length < oldOrderArray[k].length ? newOrderArray[k].length : oldOrderArray[k].length;
                    for (let m = 0; flag === false && m < shortestLen2; m++) {
                        //Flag if new item is a better match than ordered item
                        if (newOrderArray[k][m] < oldOrderArray[k][m]) {
                            flag = true;
                        } else if (newOrderArray[k][m] > oldOrderArray[k][m]) {
                            flag2 = true;
                            break;
                        }
                    }
                    if (flag2) {
                        break;
                    }
                }
            }
            //Splice new item and remove last item from list
            if (flag) {
                orderedItems.splice(i,0,newItem);
                orderedItems.pop();
                break;
            }
        }
        //Don't really need to return this because we've been working on a reference...
        return orderedItems;
    }
}

export default LevenschteinSearch;