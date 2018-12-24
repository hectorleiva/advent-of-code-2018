const fs = require('fs');

const content = fs.readFileSync('./day5_input.txt');
const characterDifference = 32; // non-buffer data difference

let contentData = JSON.parse(JSON.stringify(content)).data; // { "type": "Buffer", "data": [30, 31, 32] }

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

while(contentData.some(compareDifferenceCases)) {
    characterDifferencePrev = 0;
    contentData = contentData.reduce((acc, curr) => {
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

console.log('contentData: ', contentData.map((v) => convertValueToString(v)));
console.log('contentData length: ', contentData.length);
