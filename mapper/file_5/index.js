const fs = require("fs");
const path = require("path")

const headers = ["Orden","TPV","fecha","Creador","Estado","Negocio","Moneda","Precio"];
const name = "TVGASLTNOVIEMBRE.csv";
const result = [];

let file = fs.readFileSync(path.resolve('mapper','file_5',name));
file = file.toString();
file = file.split("\n");
file.forEach((item) => {
    item = item.split("\r")[0];
    item = item.split(";");
    const items = {};
    headers.forEach((header, i) => {
        items[header] = item[i];
    });
    result.push(items);
});

module.exports = result