import RuneApi from './RunescapeApi';

class LevenschteinSearch {
    static api = new RuneApi();

    static _min = (d0, d1, d2, bx, ay) =>
    {
      return d0 < d1 || d2 < d1 //IF DELETION OR INSERTION VALUES ARE LESS THAN SUBSTITUTION COST
          ? d0 > d2             //IF DELETION COST IS GREATER THAN INSERTION COST
              ? d2 + 1          //return the insertion cost
              : d0 + 1          //return the delection cost
          : bx === ay           //IF THE CHARACTERS MATCH
              ? d1              //return 'd1' (effectively not changing the lev distance)
              : d1 + 1;         //return 'd1 +1' (effectively increasing the lev distance by 1 for substitution)
    }

    //Compares two strings and returns an integer metric of similarity. 0 indicates exact match.
    //To read about the levenschtein algorithm: https://en.wikipedia.org/wiki/Levenshtein_distance
    static levenshteinDistance = (a, b) => {

            //Return 0 if the strings are equivalent
            //This is a short circuit case
            if (a === b) {
                return 0;
            }
        
            //For the algorithm to work properly, arrange the smaller word to be 'a'
            //and the larger word to be 'b'
            if (a.length > b.length) {
                var tmp = a;
                a = b;
                b = tmp;
            }
        
            //Grab the lengths of each word
            var la = a.length;
            var lb = b.length;
        
            //------------THIS CODE CHUNK HELP ELIMINATE UNNEEDED PROCESSING ON MATCHING WORDS-------
            //Limit by the length of the shortest word 'a' --
            //parse backwards through the words, if the characters match
            //reduce the 'length' of the words to process
            while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
                la--;
                lb--;
            }
        
            //Create an offset variable for processing from the begining of the words
            var offset = 0;
        
            //Start from index of 0 and move forward to index of last while loop
            //If the characters match increase the offset to start the levenschtein processing
            while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
                offset++;
            }
        
            //I will now call these "Effective Length's"
            //Adjust for characters not needed to process for the begining of the words
            la -= offset;
            lb -= offset;
        
            //Should word 'a' match the characters of word 'b', returning word 'b's effective length
            //will be the same result as processing with the levenschtien algorithm
            if (la === 0 || lb < 3) {
                return lb;
            }

            //------------END OF CODE LENGTH TO REDUCE PROCESSING TIME------------------------------
        
            //-------------------------BEGIN THE LEVENSCHTEIN ALGORITHM PORTION---------------------
            //Define all variables to be used -- Only instantiate x as 0
            var x = 0;
            var y;
            var d0;
            var d1;
            var d2;
            var d3;
            var dd;
            var dy;
            var ay;
            var bx0;
            var bx1;
            var bx2;
            var bx3;
        
            var vector = [];
        
            //Instantiate the vector such that the vector is of the form 
            //[value1,charcode at first letter to compare, value2, ....]
            for (y = 0; y < la; y++) {
                vector.push(y + 1);
                //The offset + y will return charcode of the first letter
                // to not match between both words, of word 'a'
                vector.push(a.charCodeAt(offset + y));
            }
        
            //After instantiating the vector, grab it's length
            //It's length should be 2*la
            var len = vector.length - 1;
        
            //Oh shit whats going on here....well let's see
            //Don't know why he didn't instantiate x here like he did y....???
            //This loop will run from 0 to longest word - 3
            for (; x < lb - 3;) {
                //Grab the first 4 charcodes of word 'b' starting at the previously set offset
                //Also set variables d0 - d3 as the indices of those charcode values - the offset
                //These are the base return values of the levenschtein algorithm, it is assumed
                //that the characters we are comparing need at least a substitution to match, which
                //would be a +1 to the lev-distance for each index that doesn't match.
                bx0 = b.charCodeAt(offset + (d0 = x));
                bx1 = b.charCodeAt(offset + (d1 = x + 1));
                bx2 = b.charCodeAt(offset + (d2 = x + 2));
                bx3 = b.charCodeAt(offset + (d3 = x + 3));
                //THIS IS A LIMITING VARIABLE FOR EITHER AND INSERTION, DELETION, OR SUBSTITUTION
                dd = (x += 4);
                //ANOTHER FOR LOOP! YAY! sigh...
                //Loop over the length of the initialized array 'vector'
                //Increment y by 2 every loop
                for (y = 0; y < len; y += 2) {
                //grab the initialization value and then the charcode of 
                //the corresponding index + offset of word 'a'
                //THIS IS WHY WE ARE INCREMENTING THE LOOP BY 2 INSTEAD OF 1
                dy = vector[y];
                ay = vector[y + 1];
                //Take the comparison characters (bx0, ay) and the 
                //dy is the previous lev-distance value?
                //d0 is the substitution cost????
                //d1 is the deletion cost???
                //WHERE DO THE COSTS GO?????/
                d0 = this._min(dy, d0, d1, bx0, ay);
                //NOW COMPARE THE LETTER FROM 'a' WORD WITH THE NEXT LETTER OF WORD 'b'
                d1 = this._min(d0, d1, d2, bx1, ay);
                //AND SO ON
                d2 = this._min(d1, d2, d3, bx2, ay);
                //AND SO FORTH
                dd = this._min(d2, d3, dd, bx3, ay);
                //Store the lowest value of insertions, deletions, substitutions back to the
                //lev-distance placeholder for the character from the array
                vector[y] = dd;
                //Shift values for next loop
                d3 = d2;
                d2 = d1;
                d1 = d0;
                d0 = dy;
                //--------THIS CODE TESTS LETTERS OF WORD 'a' AGAINST LETTERS FROM WORD 'b'
                //--------AT THE SAME INDEX AS WORD 'a'S LETTER, AND 3 SPACES FURTHER
                //--------IS THIS AN ASSUMPTION THAT ANY FURTHER COMPARISONS ARE TOO EXPENSIVE
                //--------FOR THE LEV-DISTANCE??? OR IS IT AN INHERENT PROPERTY OF THE LEV-ALGORITHM???
                }
            }
        
            //Another for loop. the fuck does this do?
            //Does it have something to do with letters in word 'b' that don't
            //have letter to compare to in word 'a' at the same indicies?/???
            for (; x < lb;) {
                bx0 = b.charCodeAt(offset + (d0 = x));
                dd = ++x;
                for (y = 0; y < len; y += 2) {
                dy = vector[y];
                vector[y] = dd = this._min(dy, d0, dd, bx0, vector[y + 1]);
                d0 = dy;
                }
            }
        
            return dd;
        /*let rowAbv, rowBel = [];
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
        return rowAbv[rowAbv.length - 1];*/
    }

    //Compares the searchTerm to a saved list of items and returns the closest matches.
    //TODO: Single letter searchterms pair with items containing "+1" or other short
    //      words the best, even without a precise letter match. Should implement
    //      a priority order such that if the best levenschtein distance is the result
    //      of word length without a match, that result loses priority.
    static getCloseNames = (searchTerm) => {
        const splitSearchTerm = searchTerm.split(" ");
        let closeItems = [];

        //Remove all itemnames with '+' or '(' in the name
        const itemNames = this.api.getItemNames().filter(name => (name.indexOf('+') === -1 && (name.indexOf('(') === -1)));

        //Iterate through each item name and sort into return array
        itemNames.forEach(element => {
            const splitString = element.split(" ");
            const distArr = [];
            for (let j = 0; j < splitSearchTerm.length; j++) {
                let distArr2 = [];
                for (let i = 0; i < splitString.length; i++) {

                    //Had to add 1 to make the lowest distance score a 1 -- Makes the
                    //word index weighting algorithm more robust
                    distArr2.push((this.levenshteinDistance(splitSearchTerm[j].toLowerCase(),splitString[i].toLowerCase()) + 1) * (Math.abs(i-j)+1));
                }
                distArr.push(this.bubbleSort(distArr2));
            }
            this.insertItem([this.bubbleSort2(distArr), element], closeItems);
        });

        //Return list of search suggestions
        return closeItems.reduce((obj, currentshit) => {
            obj.names.push(currentshit[1]);
            obj.shit.push(currentshit[0]);
            return obj
        },{ names: [], shit: [] });
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
                    } else if (itemArr[j+1][k] > itemArr[j][k]) {
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
        let length = orderedItems.length < 5;

        //Iterate through all current ordered items of max length 5
        for (let i = 0; i < 5; i++) {

            //Check for an uninitialized index location in ordered items
            if (typeof orderedItems[i] === 'undefined') {
                orderedItems.push(newItem);
                break;
            }

            //Grab the distance array of the i^th ordered item
            const oldOrderArray = orderedItems[i][0];

            //NOTE: Both arrays have the same first level array lengths (splitSearchTerm.length)
            //In order to iterate over the best matches first, we must compare the first index
            //of the second level arrays then the second index's and so forth.
            //Grab the shortest second level array length so we don't compare past existing indices
            let shortestLen = newOrderArray[0].length < oldOrderArray[0].length ? newOrderArray[0].length : oldOrderArray[0].length;
            for (let k = 0; flag === false && k < shortestLen; k++) {
                let flag2 = false;

                //Now check each first level array against each other at index k
                for (let m = 0; flag === false && m < newOrderArray.length; m++) {
                    if (newOrderArray[m][k] < oldOrderArray[m][k]) {
                        flag = true;
                    } else if (newOrderArray[m][k] > oldOrderArray[m][k]) {
                        flag2 = true;
                        break;
                    }
                }
                if (flag2) {
                    break;
                }
            }

            //Splice new item and remove last item from list
            if (flag) {
                orderedItems.splice(i,0,newItem);
                if (!length) {
                    orderedItems.pop();
                }
                break;
            }
        }

        //Don't really need to return this because we've been working on a reference...
        return orderedItems;
    }
}

export default LevenschteinSearch;