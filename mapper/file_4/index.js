const fs = require("fs");
const path = require("path")

const headers = ["ID TM","DATE","ERROR","MESSAGE","cell","id tercero","Importe","Moneda","id Banco","cod proveedor","Banco"];
const name = "Guajiritos4.csv";
const result = [];

let file = fs.readFileSync(path.resolve('mapper','file_4',name));
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