import RuneApi from './RunescapeApi';

class LevenschteinSearch {
    //Compares two strings and returns an integer metric of similarity. 0 indicates exact match.
    //TODO: Discover if it matters which term is larger. If it matters, sort the larger term into
    //      the proper slot.
    levenshteinDistance = (searchTerm, existingTerm) => {
        let rowAbv = new Array((searchTerm.length > existingTerm.length) ? searchTerm.length : existingTerm.length + 1);
        const rowBel = new Array((searchTerm.length > existingTerm.length) ? searchTerm.length : existingTerm.length + 1);
        
        for (let i = 0; i < rowAbv.length; i++) {
            rowAbv[i] = i;
        }
        for (let i = 0; i < searchTerm.length; i++) {
            rowBel[0] = i + 1;

            for (let j = 0; j < existingTerm.length; j++) {
                //Min of (deletion, insertion, substitution) costs.
                rowBel[j+1] = Math.min(rowAbv[j+1] + 1, rowBel[j] + 1, ((searchTerm[i] == existingTerm[j]) ? rowAbv[j] : rowAbv[j] + 1));
            }
            for (let j = 0; j < rowAbv.length; j++) {
                rowAbv[j] = rowBel[j];
            }
        }
        return rowAbv[rowAbv.length - 1];
    }

    //Compares the searchTerm to a saved list of items and returns the closest matches.
    //TODO: Single letter searchterms pair with items containing "+1" or other short
    //      words the best, even without a precise letter match. Should implement
    //      a priority order such that if the best levenschtein distance is the result
    //      of word length without a match, that result loses priority.
    getCloseNames = (searchTerm) => {
        const splitSearchTerm = searchTerm.split(" ");
        let closeItems = [[new Array(splitSearchTerm.length), "a"],
                        [new Array(splitSearchTerm.length), "b"],
                        [new Array(splitSearchTerm.length), "c"],
                        [new Array(splitSearchTerm.length), "d"],
                        [new Array(splitSearchTerm.length), "e"]];
        const itemNames = new RuneApi().getItemNames();

        if (searchTerm === "") {
            return closeItems;
        }

        itemNames.forEach(element => {
            const splitString = element.split(" ");
            const distArr = [];
            splitSearchTerm.forEach(term => {
                var distance = 1000;
                for (let i = 0; i < splitString.length; i++) {
                    //TODO: Should find out if having a larger string in one input or another
                    //      causes improper levenschtein distance calculations. The algorithm
                    //      indicates this may be the case...Hence the code snippets below.
                    //const distVal = this.levenshteinDistance(term.toLowerCase(),splitString[i].toLowerCase());
                    const distVal = term.length < splitString[i].length ? 
                                    this.levenshteinDistance(term.toLowerCase(),splitString[i].toLowerCase()) :
                                    this.levenshteinDistance(splitString[i].toLowerCase(),term.toLowerCase());
                    if (distVal < distance) {
                        distance = distVal;
                    }
                }
                distArr.push(distance);
            });
            this.insertItem(this.bubbleSort(distArr), element, closeItems);
        });
        closeItems.forEach(item => console.log(item));
        return closeItems;
    }

    //It's a bubble sort!
    bubbleSort = (itemArr) => {
        for (let i = 0; i < itemArr.length - 1; i++) {
            if (itemArr[i+1] < itemArr[i]) {
                let temp = itemArr[i];
                itemArr[i] = itemArr[i+1];
                itemArr[i+1] = temp;
            }
        }
        return itemArr;
    }

    //Takes a levenschtein array & item name, inserts into appropriate index of sorted items.
    //TODO: Have a double array of levenschtein distances for better ordering?
    insertItem = (itemOrder, itemName, orderedItems) => {
        for (let i = 0; i < orderedItems.length; i++) {
            const element = orderedItems[i][0];
            let j = itemOrder.length > element.length ? element.length : itemOrder.length;
            let flag = false;
            for (let k = 0; flag == false && k < j; k++) {
                if (itemOrder[k] < element[k] || typeof element[k] === 'undefined') {
                    flag = true;
                    orderedItems.splice(i,0,[itemOrder, itemName]);
                    orderedItems.pop();
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
    }
}

export default LevenschteinSearch;