const fs = require('fs');

const content = fs.readFileSync('./day5_input.txt');
const characterDifference = 32; // non-buffer data difference

const contentData = JSON.parse(JSON.stringify(content)).data; // { "type": "Buffer", "data": [30, 31, 32] }

const convertValueToString = (val) => {
    return String.fromCharCode(val);
}

const sameCharacterDifferentCase = (a, b) => {
    if (Math.abs((a - b)) == characterDifference) {
        return true;
    }
    return false;
}

let characterDifferencePrev = 0;
const compareDifferenceCases = (curr) => {
    const result = sameCharacterDifferentCase(curr, characterDifferencePrev);
    characterDifferencePrev = curr;
    return result;
}

const alphabet = []
for (var i = 65; i < 91; i++) {
    alphabet.push(
        {
            "upperCaseVal": i,
            "lowerCaseVal": i + characterDifference
        }
    )
}

const removeAlphabetLettersFromArray = (contentVal, alphabetVals) => {
    const { upperCaseVal, lowerCaseVal } = alphabetVals;
    return contentVal.filter((v) => {
        if (v != upperCaseVal && v != lowerCaseVal) {
            return true;
        }

        return false;
    });
}

const alphabetResult = [];

async function processAlphabet(alphabet) {
    for (const alphabetCouple of alphabet) {
        const alphabetCoupleResponse = await processContentData(contentData, alphabetCouple);
        alphabetResult.push(alphabetCoupleResponse);
    }

    alphabetResult.sort((a, b) => {
        if (b.contentDataLength > a.contentDataLength) {
            return -1;
        }
        if (a.contentDataLength > b.contentDataLength) {
            return 1;
        }
        if (a.contentDataLength == b.contentDataLength) {
            return 0;
        }
    });

    console.log('alphabetResultWithLowestCombo: ', alphabetResult[0]);
}

async function processContentData(contentData, alphabetCouple) {
    let contentDataCopy = [ ...contentData ];

    contentDataCopy = removeAlphabetLettersFromArray(contentDataCopy, alphabetCouple);

    while(contentDataCopy.some(compareDifferenceCases)) {
        characterDifferencePrev = 0;

        contentDataCopy = contentDataCopy.reduce((acc, curr) => {
            if (compareDifferenceCases(curr)) {
                delete acc[acc.length - 1];
                characterDifferencePrev = acc[acc.length - 1];
                return acc;
            }
            acc.push(curr);
            characterDifferencePrev = acc[acc.length - 1];
            return acc;
        }, []).filter((v) => v !== null);

        characterDifferencePrev = 0;
    }

    return {
        "alphabetCouple": {
            "uppercaseVal": convertValueToString(alphabetCouple.upperCaseVal),
            "lowercaseVal": convertValueToString(alphabetCouple.lowerCaseVal)
        },
        "contentDataLength": contentDataCopy.length
    };
}

processAlphabet(alphabet);
