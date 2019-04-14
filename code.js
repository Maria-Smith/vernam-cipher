keyTextbox = document.getElementById("key");
plainTextbox = document.getElementById("plaintext");
encodeButton = document.getElementById("cipher");
decodeButton = document.getElementById("decipher");
const cyr = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
const lat = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const punct = ['.', ',', ';', '/', '\\', '?', '!', '-', '(', ')', '[', ']', '"', "#", "$", "%", "^", "&", "*", "@"];
// TODO: handle white-spaces

function parseText(txt) {
    txt = txt.toLowerCase().trim().replace(/\s/g,"ß"); // identifier for whitespaces
    punct.forEach(p => {
        if (txt.includes(p)) {
            p = p.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape all special characters (? => \\?)
            let pReg = new RegExp(p, "g");
            txt = txt.replace(pReg, "");
        }
    });
    return txt;
}
function encode() {
    console.log("encode");
    const keyValue = keyTextbox.value;
    const txtValue = plainTextbox.value;
    // console.log(keyValue);
    // console.log(txtValue);
    
    var txt = parseText(txtValue);
    var key = parseText(keyValue);
    var cipher = [];
    var alphabet;
    if (key.length < txt.length) {
        key = key.repeat(Math.ceil(txt.length/key.length)).slice(0, txt.length); // multiply key letters and cut to fit txt length
    }
    if (lat.includes(txt.charAt(0))) { // language check
        alphabet = lat;
    } else {
        alphabet = cyr;
    }
    for (let i = 0; i < txt.length; i++) {
        if (txt.charAt(i) === "ß") { // ignore parsed whitespace identifiers (e.g. helloßworld)
            cipher.push("ß");
        } else {
            let txtChar = txt.charAt(i);
            let txtIndex = alphabet.indexOf(txtChar);
            let keyChar = key.charAt(i);
            let keyIndex = alphabet.indexOf(keyChar);
            if (txtIndex === -1 || keyIndex === -1) {
                console.log("Key and text alphabets don't match.");
                document.getElementById("warning").textContent = "ОШИБКА СТОП 000 (Key and text alphabets don't match.)";
                setTimeout(() => {
                    document.getElementById("warning").textContent = "";
                }, 1500);
                return false;
            }
            let sumIndex = txtIndex + keyIndex;
            if (sumIndex >= alphabet.length) { // cycle to the beginning when out of range
                sumIndex -= alphabet.length;
            }
            let sumChar = alphabet[sumIndex];
            cipher.push(sumChar);
        }
    }
    cipher = cipher.join('');
    // console.log(cipher);
    plainTextbox.value = cipher;
}
function decode() {
    console.log("decode");
    const keyValue = keyTextbox.value;
    const cipValue = plainTextbox.value;
    // console.log(key);
    // console.log(cip);
    
    var cip = parseText(cipValue);
    var key = parseText(keyValue);
    var plaintext = [];
    var alphabet;
    
    if (key.length < cip.length) {
        key = key.repeat(Math.ceil(cip.length/key.length)).slice(0, cip.length); // fit key to text length
    }
    if (lat.includes(cip.charAt(0))) { // language check
        alphabet = lat;
    } else {
        alphabet = cyr;
    }
    for (let i = 0; i < cip.length; i++) {
        if (cip.charAt(i) === "ß") {
            plaintext.push(" ");
        } else {
            let cipChar = cip.charAt(i);
            let cipIndex = alphabet.indexOf(cipChar);
            let keyChar = key.charAt(i);
            let keyIndex = alphabet.indexOf(keyChar);
            if (cipIndex === -1 || keyIndex === -1) {
                console.log("Key and text alphabets don't match.");
                document.getElementById("warning").textContent = "ОШИБКА СТОП 000 (Key and text alphabets don't match.)";
                setTimeout(() => {
                    document.getElementById("warning").textContent = "";
                }, 1500);
                return false;
            }
            let sumIndex = cipIndex - keyIndex;
            if (sumIndex < 0) { // cycle to the end when out of range
                sumIndex += alphabet.length;
            }
            let sumChar = alphabet[sumIndex];
            plaintext.push(sumChar);
        }
    }
    plaintext = plaintext.join('');
    plainTextbox.value = plaintext;
    // console.log(plaintext);
}
function copyText() {
    console.log("copy");
    plainTextbox.select();
    document.execCommand("copy");
    document.getElementById("warning").textContent = "copied!";
    setTimeout(() => {
        document.getElementById("warning").textContent = "";
    }, 1500);
}