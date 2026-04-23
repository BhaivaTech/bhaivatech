const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'style.css');
const raw = fs.readFileSync(filePath, 'utf8');

let output = '';
let ruleBuffer = '';
let depth = 0;

function clean(text) {
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === '{') {
        const selectorPart = clean(ruleBuffer);
        output += (depth > 0 ? '  ' : '') + selectorPart + ' {';
        ruleBuffer = '';
        depth++;
    } else if (char === '}') {
        let content = clean(ruleBuffer);
        // Fix semicolons and colons in properties
        if (content.length > 0) {
            content = content.replace(/\s*;\s*/g, '; ');
            content = content.replace(/([a-zA-Z-])\s*:\s*([^;]+)/g, '$1: $2');
            output += content;
        }
        output += '}\n';
        ruleBuffer = '';
        depth--;
    } else {
        ruleBuffer += char;
    }
}

// Write result
fs.writeFileSync(filePath, output.trim());
console.log('Done');
