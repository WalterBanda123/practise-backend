
function pgIdGenerator() {
    let id = (Math.random() * Math.PI).toPrecision(16).toString().replace('.', '');
    id = parseInt(id)
    return id
}
module.exports = pgIdGenerator