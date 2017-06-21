var mongoose = require('mongoose');
var Feed = mongoose.model('Feeds');
var constant = require('../helper/constant.js');
var allConstant = constant.getAll();
var facebook = require('../models/facebook');
var accessToken = constant.getAccessToken();
var cheerio = require('cheerio');

realTime();
function realTime() {
    for (var i = 0; i < allConstant.length; i++) {
        setInterval(function (i) {
            addFeedFromFb(allConstant[i].idGroup);
        }, 5000, i);
    }
}
function getIdGroup(group) {
    for (var i = 0; i < allConstant.length; i++) {
        if (allConstant[i].type === group) {
            return allConstant[i].idGroup;
        }
    }
    return 0;
}
function getStatusFromIdGroup(idGroup) {
    for (var i = 0; i < allConstant.length; i++) {
        if (allConstant[i].idGroup === idGroup) {
            return allConstant[i].status;
        }
    }
    return 'public';
}
exports.list_feed_all = function (req, res) {
    var limit = parseInt(req.params.limit);
    if(limit>20||limit<0){
        limit=20;
    }
    var q = Feed.find({}).sort({created_date: -1}).limit(limit);
    q.exec(function (err, feed) {
        if (err) {
            res.send(err);
        }
        var data = [];
        for (var i = 0; i < feed.length; i++) {
            data.push(feed[i]);
        }
        res.json({feed: {data: data}});
    });
};
exports.list_feed = function (req, res) {
    var limit = parseInt(req.params.limit);
    if(limit>20 || limit<0){
        limit=20;
    }
    var group = req.params.group;
    var idGroup = getIdGroup(group);
    if (idGroup !== 0) {
        var q = Feed.find({idGroup: idGroup}).sort({created_date: -1}).limit(limit);
        q.exec(function (err, feed) {
            if (err) {
                res.send(err);
            }
            var data = [];
            for (var i = 0; i < feed.length; i++) {
                data.push(feed[i]);
            }
            res.json({feed: {data: data}});
        });
    }
};
function addFeedFromFb(idGroup) {
    if (getStatusFromIdGroup(idGroup) === 'private') {
        facebook_html_feed(idGroup);
    } else {
        var path = '/' + constant.getVersion(getStatusFromIdGroup(idGroup)) + '/' + idGroup + constant.getPathApi();
        facebook.get(accessToken, path, function (d) {
            var data = JSON.parse(d).data;
            var length = Object.keys(data).length;
            for (var i = 0; i < length; i++) {
                if (!isExist(data[i].id)) {
                    saveFeed(parseFeed(data[i].from.name, data[i].from.id, data[i].message, data[i].id, idGroup));
                } else {
                    // console.log(1);
                }
            }
        });
    }

}

exports.read_a_feed = function (req, res) {
    Feed.find({id: req.params.feedId}, function (err, feed) {
        if (err) {
            res.send(err);
        }
        res.json({feed: {data: [feed]}});
    });
};

function saveFeed(temp) {
    var new_feed = new Feed(temp);
    new_feed.save(function (err, feed) {
        if (err) {
            console.log(err);
        } else {

        }
    });
}

function facebook_html_feed(idGroup) {
    var Spooky = require('spooky');

    var spooky = new Spooky({
            casper: {
                logLevel: 'debug',
                verbose: true
            }
        }
        , function (err) {
            if (err) {
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }

            spooky.create({
                pageSettings: {
                    loadImages: false,//The script is much faster when this field is set to false
                    loadPlugins: false,
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.4'
                }
            });

            //First step is to open Facebook
            spooky.start("https://facebook.com")

            spooky.then(function () {
                console.log("Facebook website opened");
            });


            //Now we have to populate username and password, and submit the form
            spooky.then(function () {
                console.log("Login using username and password");
                this.evaluate(function () {
                    //tai khoan va mat khau facebook da tham gia vao cac nhom tren facebook
                    document.getElementById("email").value = "thanhtung.tvg01@gmail.com";
                    document.getElementById("pass").value = "nguyentung956";
                    document.getElementById("loginbutton").children[0].click();
                });
            });

            //Wait to be redirected to the Home page, and then make a screenshot
            if (idGroup === allConstant[0].idGroup) {
                spooky.then(function () {
                    this.open('https://www.facebook.com/groups/shiptimnguoinguoitimship/')
                });
            } else if (idGroup === allConstant[1].idGroup) {
                spooky.then(function () {
                    this.open('https://www.facebook.com/groups/shipship/')
                });
            }

            //Return html
            spooky.then(function () {
                this.emit('body', this.getHTML());
            });
            spooky.run();

        });

    spooky.on('error', function (e, stack) {
        console.error(e);

        if (stack) {
            console.log(stack);
        }
    });

    spooky.on('console', function (line) {
        console.log(line);

    });

    spooky.on('hello', function (greeting) {
        console.log(greeting);
    });

    spooky.on('log', function (log) {
        if (log.space === 'remote') {
            console.log(log.message.replace(/ \- .*/, ''));
        }
    });

    spooky.on('body', function (body) {
        var $ = cheerio.load(body);
        // 3, 5
        var code = $('code[id^="u_0_"]');
        for (var i = 0; i < code.length; i++) {
            var datax = code[i].children[0].data;
            var selector = cheerio.load('<div id="test">' + datax + '</div>');
            var t = selector('#test').find('._58jw');
            var le = t.length;
            if (le > 0) {

                for (var j = 0; j < le; j++) {
                    //Get p has class _58fw
                    var pTagChild = t.get(j).children[0].children;
                    var message = '';
                    for (var k = 0; k < pTagChild.length; k++) {
                        if (pTagChild[k].type === 'text') {
                            message += pTagChild[k].data + ' ';
                        }
                    }

                    var oneFeed = t.get(j).parent.parent.parent.parent.parent.parent;
                    var idFeed = oneFeed.attribs['data-ft'].split(',')[1].split(':')[1];
                    idFeed = idGroup + '_' + idFeed.substring(1, idFeed.length - 1);
                    // console.log(idFeed);

                    if (!isExist(idFeed)) {
                        var aTagUser = t.get(j).parent.parent.children[0].children[0].children[0];
                        var idUser = aTagUser.attribs['data-hovercard'].split('?')[1].split('&')[0].substr(3);
                        // console.log(idUser);
                        var username = aTagUser.children[0].children[0].attribs['aria-label'];
                        // console.log(username);
                        var feedJson = parseFeed(username, idUser, message, idFeed, idGroup);
                        saveFeed(feedJson);
                    } else {
                        console.log(2);
                    }
                    // console.log(feedJson);
                }
            }
        }
        // console.log(body);
        console.log($('title').text());
    });
}

function isExist(idFeed) {
    Feed.find({id: idFeed}).exec(function (err, results) {
        var count = results.length;
        if (count === 0) {
            return false;
        } else
            return true;
    });
    return false;
}
function parseFeed(name, idUser, message, idFeed, idGroup) {
    // console.log(feedJson);
    return {
        from: {
            name: name,
            id: idUser
        },
        message: message,
        created_date: Date.now(),
        id: idFeed,
        idGroup: idGroup
    };
}
