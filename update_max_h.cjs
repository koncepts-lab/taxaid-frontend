const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.vue')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walk('./components'), ...walk('./pages')];

let replacedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Only target large max heights typical of popups (50vh to 99vh, 100vh)
    const regex = /max-h-\[([5-9][0-9]|100)vh\]/g;
    if (regex.test(content)) {
        content = content.replace(regex, 'max-h-[78vh]');
        changed = true;
    }

    // Target max-h-screen in Modals
    if (file.includes('Modal') || file.includes('Popup')) {
        const screenRegex = /max-h-screen/g;
        if (screenRegex.test(content)) {
            content = content.replace(screenRegex, 'max-h-[78vh]');
            changed = true;
        }
    }

    // specifically looking at the user's manual change in profile/index.vue:
    // it was max-h-[75vh] changed to max-h-[90vh]
    // The regex above will catch it.

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        replacedCount++;
    }
});

console.log('Total files updated:', replacedCount);
