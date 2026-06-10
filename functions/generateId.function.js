export function generarId() {
    const idNumber = Math.floor(Math.random() * 900000) + 100000;
    return `ext-${idNumber}`
}