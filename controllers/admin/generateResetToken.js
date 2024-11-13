async function generateResetToken(){
    let part1 = Math.floor(100000 + Math.random() * 900000);  // Generates a 4-digit number
    const uniqueCode = `${part1}`;
    return uniqueCode

}
module.exports = generateResetToken