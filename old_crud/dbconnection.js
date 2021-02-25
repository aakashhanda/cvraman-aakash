var mongodb  = require('mongodb')
function connection(callback){
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/ShoppingCart';
    MongoClient.connect(url, callback)
}

module.exports = connection