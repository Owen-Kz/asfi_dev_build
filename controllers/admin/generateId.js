async function generateID(){
    let part1 = Math.floor(1000 + Math.random() * 9000);  // Generates a 4-digit number
    let part2 = Math.floor(1000 + Math.random() * 9000);  // Generates another 4-digit number
    const uniqueCode = `sha-${part1}-${part2}`;
    return uniqueCode

}
module.exports = generateID