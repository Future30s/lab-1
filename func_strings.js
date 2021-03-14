"use strict";

function shrinkStrings(strArray) {
    for (let i = 0;i < strArray.length;i++) {
        let s = strArray[i];
        let l = s.length;
        if (l < 4)
            continue;
        strArray[i] = s.substring(0, 2) + s.substring(l - 2, l);
    }
}

let s = ["aibc", "bibibi", "cicici"];
shrinkStrings(s);
console.log(s);
debugger;