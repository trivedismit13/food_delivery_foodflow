const fs = require('fs');
let c = fs.readFileSync('scratch/generate_v35.js', 'utf8');

c = c.replace(/const outputPath = path\.join.+?;/, "const outputPath = path.join(__dirname, '..', 'backend', 'src', 'main', 'resources', 'db', 'dev_migration', 'V35__seed_realistic_dev_data.sql');");

c = c.replace(/let sql =/, "let seed = 12345;\nfunction random() {\n    seed = (seed * 9301 + 49297) % 233280;\n    return seed / 233280;\n}\n\nlet sql =");

c = c.replace(/Math\.random\(\)/g, 'random()');

c = c.replace(/let phone = '98' \+ String\(Math\.floor\(random\(\) \* 100000000\)\)\.padStart\(8, '0'\);/g, "let phone = '98' + String(10000000 + i).padStart(8, '0');");
c = c.replace(/let phone = '99' \+ String\(Math\.floor\(random\(\) \* 100000000\)\)\.padStart\(8, '0'\);/g, "let phone = '99' + String(20000000 + creatorIds.length).padStart(8, '0');");

fs.writeFileSync('scratch/generate_v35.js', c);
