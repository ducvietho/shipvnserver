var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedSchema = new Schema(
    {
        from: {
            name: String,
            id: String
        },
        message: String,
        created_date: {
            type: Date,
            default: Date.now
        },
        id: String,
        idGroup:String
    }
);
module.exports = mongoose.model('Feeds', FeedSchema);