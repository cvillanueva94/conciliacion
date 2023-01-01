const intersection = (a, b) =>  a.filter(x => b.includes(x));
const difference = (a, b) => a.filter(x => !b.includes(x));
const symmetricDifference = (a, b) => a.filter(x => !b.includes(x)).concat(b.filter(x => !a.includes(x)));
