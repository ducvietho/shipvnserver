module.exports = function(app){
    var feedController = require('../controllers/FeedController');
    //http://shipvn.com/api/5/group1
    app.route('/api/feed/list/:limit/:group')
        .get(feedController.list_feed);

    //http://shipvn.com/api/5
    app.route('/api/feed/list/:limit')
        .get(feedController.list_feed_all);

    //http://shipvn.com/api/654654654_1043435454
    app.route('/api/feed/:feedId')
        .get(feedController.read_a_feed);
};