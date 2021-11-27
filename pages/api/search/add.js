// For the default version
const algoliasearch = require('algoliasearch');

module.exports = async (req, res) => {

    const item = JSON.parse(req.body);

    const client = algoliasearch('F6SFDRTOQW', '81207a396379716cfb00f72046a469b0');
    const index = client.initIndex('items_index');

    await index.saveObject(item, { autoGenerateObjectIDIfNotExist: true })
        .then(() => {
            res.status(200);
            res.json({status: 200, message: "Added to index"});
        }).catch(err => {
            console.log(err);
            res.status(400).json({error: err});
        });
}
