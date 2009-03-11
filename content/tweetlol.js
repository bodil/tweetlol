var lastTweet = 0;
var tweetsPerPage = 50;
var tweetTimer = null;
var replyingTo = null;

var nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);

var urlRe = /https?:\/\/[^ ):]+/;
var urliseRe = /(https?:\/\/[^ ):]+|[@#][a-zA-Z0-9_]+;?)/;

$(document).ready(function() {
    $("#tweetbox").keyup(tweetInput);
    $("#tweetbox").keydown(tweetInputVerify);
    $("#login input[name='save']").click(loginSave);
    $("ul.tabbar li").click(function(event) {
        $("ul.tabbar li").each(function() {
            if (this == event.target) $(this).addClass("active");
            else $(this).removeClass("active");
        });
        updateTabs();
    });
    updateTabs();
    updateLayout();
    $(window).resize(updateLayout);
//    if (getLogin() == null) {
//        $("div#login").slideDown("normal");
//    } else {
        refreshTweets();
        //populateTweets([{"user":{"description":"Founding partner and digital strategist at Sermo Consulting in Oslo, Norway,  digital media enthusiast, sports and trivia nut.","followers_count":962,"url":"http:\/\/www.sermo.no","name":"Fredrik Johnsen","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/60595425\/FJ1_normal.jpg","screen_name":"frjohnsen","location":"Oslo, Norway","id":809141},"text":"Reading: \"Alle feminister er traktorlesber \u00ab A curly life\" (http:\/\/twitthis.com\/t9aj8u)","in_reply_to_screen_name":null,"in_reply_to_user_id":null,"created_at":"Sun Mar 08 12:20:15 +0000 2009","in_reply_to_status_id":null,"truncated":false,"id":1296166980,"favorited":false,"source":"<a href=\"http:\/\/twitthis.com\">TwitThis<\/a>"},{"user":{"description":"Founding partner and digital strategist at Sermo Consulting in Oslo, Norway,  digital media enthusiast, sports and trivia nut.","followers_count":962,"url":"http:\/\/www.sermo.no","name":"Fredrik Johnsen","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/60595425\/FJ1_normal.jpg","screen_name":"frjohnsen","location":"Oslo, Norway","id":809141},"text":"Sharing: #Us now: Som bekjent av gutta i Sermo og som sosial medieentusiast, ble jeg invitert til v\u00e5rens.. http:\/\/tinyurl.com\/dn43v8","in_reply_to_user_id":null,"created_at":"Sun Mar 08 12:19:25 +0000 2009","in_reply_to_screen_name":null,"in_reply_to_status_id":null,"truncated":false,"id":1296165357,"favorited":false,"source":"<a href=\"http:\/\/twitterfeed.com\">twitterfeed<\/a>"},{"truncated":false,"user":{"description":"Interactive Marketer at Metronet Norge.","screen_name":"ChristerEngh","followers_count":179,"url":"http:\/\/www.metronet.no","name":"Christer Engh","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/77908314\/n778150713_5707049_4209_normal.jpg","location":"Oslo, Norway","id":14623077},"favorited":false,"text":"is leaving for mc messa in an hour","in_reply_to_screen_name":null,"in_reply_to_user_id":null,"created_at":"Sun Mar 08 12:12:33 +0000 2009","id":1296152511,"in_reply_to_status_id":null,"source":"web"},{"user":{"description":"supported by backstage.bbc.co.uk","url":"http:\/\/menti.net\/?p=17","name":"BBC World News","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/22159482\/bbc_logo_2_normal.gif","followers_count":10058,"screen_name":"bbcworld","location":"London, UK","id":742143},"text":"Pope Benedict XVI confirms he will visit Israel, the Palestinian territories and Jordan, from 8-15 May. http:\/\/tinyurl.com\/c9kem5","in_reply_to_status_id":null,"created_at":"Sun Mar 08 12:10:57 +0000 2009","in_reply_to_user_id":null,"truncated":false,"in_reply_to_screen_name":null,"favorited":false,"id":1296149544,"source":"<a href=\"http:\/\/twitterfeed.com\">twitterfeed<\/a>"},{"user":{"description":"22 year old digital media production student and co-founder of the media and production company Drumroll.","followers_count":388,"url":"http:\/\/ronny-andre.no","name":"Ronny-Andr\u00e9","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/51721911\/Bilde_6_bigger_normal.jpg","screen_name":"rebellion","location":"Kolbotn, Norway","id":814471},"text":"Hot tips: \u00c5 fly med British Airways til London er like billig som Norwegian hvis du bestiller \u00e9n m\u00e5ned+ i forveien!","in_reply_to_user_id":null,"created_at":"Sun Mar 08 12:06:10 +0000 2009","in_reply_to_status_id":null,"truncated":false,"in_reply_to_screen_name":null,"id":1296141093,"favorited":false,"source":"<a href=\"http:\/\/iconfactory.com\/software\/twitterrific\">twitterrific<\/a>"},{"user":{"description":"Interactive Marketer at Metronet Norge.","followers_count":178,"url":"http:\/\/www.metronet.no","name":"Christer Engh","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/77908314\/n778150713_5707049_4209_normal.jpg","screen_name":"ChristerEngh","location":"Oslo, Norway","id":14623077},"text":"Gratulerer med kvinnedagen alle kvinner","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:54:59 +0000 2009","in_reply_to_status_id":null,"in_reply_to_screen_name":null,"truncated":false,"id":1296120630,"favorited":false,"source":"web"},{"favorited":false,"user":{"description":"supported by backstage.bbc.co.uk","followers_count":10058,"url":"http:\/\/menti.net\/?p=17","name":"BBC World News","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/22159482\/bbc_logo_2_normal.gif","screen_name":"bbcworld","location":"London, UK","id":742143},"in_reply_to_user_id":null,"text":"Both Sri Lanka's military and rebel forces say there has been a surge in fighting in recent days, with scores .. http:\/\/tinyurl.com\/bku6wf","in_reply_to_screen_name":null,"created_at":"Sun Mar 08 11:52:00 +0000 2009","truncated":false,"id":1296115940,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/twitterfeed.com\">twitterfeed<\/a>"},{"truncated":false,"in_reply_to_screen_name":null,"user":{"description":"Sermo Consulting, Digital Strategist, Web 2.0\/Digital\/Social Media enthusiast","screen_name":"meriksen","followers_count":1317,"url":"http:\/\/www.sermo.no","name":"Marius Eriksen","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/52913613\/Marius_Eriksen_normal.jpg","location":"Oslo, Norway","id":1037351},"favorited":false,"text":"Hjelpeogtr\u00f8stemeg... To meter sn\u00f8 i hagen n\u00e5. http:\/\/twitpic.com\/1xiki","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:45:43 +0000 2009","id":1296105116,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/www.atebits.com\/software\/tweetie\/\">Tweetie<\/a>"},{"favorited":false,"user":{"description":"","followers_count":291,"url":"http:\/\/www.copyriot.se\/","name":"rasmusfleischer","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/76678583\/Bild_540_normal.jpg","screen_name":"rasmusfleischer","location":"Stockholm","id":18955455},"text":"Gaaaah, jag beh\u00f6ver en revisor som kan deklarera \u00e5t mig och min lilla firma och mina kvittoh\u00f6gar. N\u00e5gon?","created_at":"Sun Mar 08 11:35:15 +0000 2009","in_reply_to_user_id":null,"in_reply_to_screen_name":null,"in_reply_to_status_id":null,"id":1296087241,"truncated":false,"source":"web"},{"in_reply_to_screen_name":null,"user":{"description":"","followers_count":120,"url":"http:\/\/rodtoslo.no\/","name":"R\u00f8dt Oslo","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/88366171\/1R\u00f8dt-logo-1f_uten_normal.jpg","screen_name":"RodtOslo","location":"Oslo, Norge","id":17183306},"text":"gratulerer alle, b\u00e5de kvinner og menn, med dagen! Ser dere p\u00e5 Youngstorget kl. 14!","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:32:18 +0000 2009","in_reply_to_status_id":null,"truncated":false,"id":1296082771,"favorited":false,"source":"web"},{"truncated":false,"user":{"description":"Please join me over on the &quot;Open Source Twitter&quot; http:\/\/identi.ca\/forteller. You can update both with http:\/\/ping.fm or http:\/\/hellotxt.com","screen_name":"forteller","followers_count":572,"url":"http:\/\/forteller.net\/","name":"B\u00f8rge","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/82202683\/Snusmumriken80_normal.png","location":"Oslo, Norway","id":13712},"favorited":false,"text":"Dugg: Obama Channels Cheney on Warrantless Wiretapping: \n Obama adopts Bush view on the powers of the presi.. http:\/\/cli.gs\/WtQSPS","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:31:42 +0000 2009","in_reply_to_screen_name":null,"id":1296081790,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/identi.ca\/\">Identica<\/a>"},{"in_reply_to_screen_name":null,"user":{"description":"Please join me over on the &quot;Open Source Twitter&quot; http:\/\/identi.ca\/forteller. You can update both with http:\/\/ping.fm or http:\/\/hellotxt.com","followers_count":572,"url":"http:\/\/forteller.net\/","name":"B\u00f8rge","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/82202683\/Snusmumriken80_normal.png","screen_name":"forteller","location":"Oslo, Norway","id":13712},"text":"Dugg: Israel annexing East Jerusalem, says EU: \n A confidential EU report accuses the Israeli government of.. http:\/\/cli.gs\/T6MDJN","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:31:38 +0000 2009","in_reply_to_status_id":null,"truncated":false,"id":1296081697,"favorited":false,"source":"<a href=\"http:\/\/identi.ca\/\">Identica<\/a>"},{"user":{"description":"Teknologiredakt\u00f8r p\u00e5 DinSide.no.","followers_count":755,"url":"http:\/\/paljoakim.com\/blog","name":"P\u00e5l Joakim Olsen","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/25016842\/pj_2006_normal.jpg","screen_name":"paljoakim","location":"Moss, Oslo, Norway","id":6417362},"text":"Hvem kan anbefale en god hamburger i Fredrikstad? :)","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:28:53 +0000 2009","in_reply_to_screen_name":null,"in_reply_to_status_id":null,"truncated":false,"id":1296077214,"favorited":false,"source":"<a href=\"http:\/\/www.destroytoday.com\/?p=Project&id=DestroyTwitter\">DestroyTwitter<\/a>"},{"user":{"description":"Perpetual student","followers_count":440,"url":"http:\/\/josefsen.org","name":"Morten Josefsen","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/16351982\/stanton_small_normal.jpg","screen_name":"mgjosefsen","location":"Orly (Orly, France)","id":60983},"text":"@frmartinsen at hun tar den andre sl\u00e5r bare tilbake p\u00e5 henne selv.","in_reply_to_user_id":13828192,"created_at":"Sun Mar 08 11:25:42 +0000 2009","in_reply_to_status_id":1295837420,"truncated":false,"in_reply_to_screen_name":"frmartinsen","id":1296071905,"favorited":false,"source":"<a href=\"http:\/\/twitterfon.net\/\">TwitterFon<\/a>"},{"truncated":false,"user":{"description":"Teknologiredakt\u00f8r p\u00e5 DinSide.no.","screen_name":"paljoakim","followers_count":755,"url":"http:\/\/paljoakim.com\/blog","name":"P\u00e5l Joakim Olsen","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/25016842\/pj_2006_normal.jpg","location":"Moss, Oslo, Norway","id":6417362},"favorited":false,"text":"Litt frem og tilbake her, men vi m\u00e5 sjekke \"vannstanden\" p\u00e5 sykehuset etterp\u00e5 uansett.","in_reply_to_screen_name":null,"in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:16:53 +0000 2009","id":1296056634,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/www.destroytoday.com\/?p=Project&id=DestroyTwitter\">DestroyTwitter<\/a>"},{"truncated":false,"user":{"description":"Manager and Consultant at Colt Kommunikasjon. Social Media enthusiast. Blogger. Ex roadcyclist. Finance Masters on the way.","screen_name":"skipet","followers_count":1013,"url":"http:\/\/coltpr.no","name":"Mr Theodor Marinius ","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/70001548\/twitter2jpg_normal.jpg","location":"Oslo, Norway","id":16418188},"favorited":false,"text":"s\u00f8ndag morra blues...","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:16:45 +0000 2009","in_reply_to_screen_name":null,"id":1296056417,"in_reply_to_status_id":null,"source":"web"},{"truncated":false,"in_reply_to_screen_name":null,"user":{"description":"supported by backstage.bbc.co.uk","screen_name":"bbcworld","followers_count":10052,"url":"http:\/\/menti.net\/?p=17","name":"BBC World News","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/22159482\/bbc_logo_2_normal.gif","location":"London, UK","id":742143},"favorited":false,"text":"Prison authorities in the US state of Georgia who launched a manhunt for an escaped inmate catch him sneaking .. http:\/\/tinyurl.com\/abzoa9","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:11:00 +0000 2009","id":1296046367,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/twitterfeed.com\">twitterfeed<\/a>"},{"truncated":false,"user":{"description":"Please join me over on the &quot;Open Source Twitter&quot; http:\/\/identi.ca\/forteller. You can update both with http:\/\/ping.fm or http:\/\/hellotxt.com","screen_name":"forteller","followers_count":572,"url":"http:\/\/forteller.net\/","name":"B\u00f8rge","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/82202683\/Snusmumriken80_normal.png","location":"Oslo, Norway","id":13712},"favorited":false,"text":"100 yrs of the International Womens Day! Congrats! Unfortunately still a lot of work to do, both @ home and abroad. !Feminism has no borders","in_reply_to_screen_name":null,"in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:10:40 +0000 2009","id":1296045825,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/identi.ca\/\">Identica<\/a>"},{"truncated":false,"user":{"description":"Partiet R\u00f8dt mener en annen verden er mulig; uten utbytting, undertrykkelse og n\u00f8d.","screen_name":"raudt","followers_count":358,"url":"http:\/\/raudt.no\/","name":"raudt","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/69510427\/logo_normal.png","location":"Norge","id":17685876},"favorited":false,"text":"R\u00f8dt hilser kvinnedagen - http:\/\/ping.fm\/pUsxS","in_reply_to_screen_name":null,"in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:10:25 +0000 2009","id":1296045402,"in_reply_to_status_id":null,"source":"<a href=\"http:\/\/www.ping.fm\/\">Ping.fm<\/a>"},{"user":{"description":"","followers_count":291,"url":"http:\/\/www.copyriot.se\/","name":"rasmusfleischer","protected":false,"profile_image_url":"http:\/\/s3.amazonaws.com\/twitter_production\/profile_images\/76678583\/Bild_540_normal.jpg","screen_name":"rasmusfleischer","location":"Stockholm","id":18955455},"text":"\u00d6ppet bygge av motion till Ordfronts st\u00e4mma, mot F\u00f6rl\u00e4ggaref\u00f6reningen. Var s\u00e5 god och delta! http:\/\/tinyurl.com\/ordfront","in_reply_to_user_id":null,"created_at":"Sun Mar 08 11:08:46 +0000 2009","in_reply_to_screen_name":null,"in_reply_to_status_id":null,"truncated":false,"id":1296042663,"favorited":false,"source":"web"}]);
//    }
});

function loginSave() {
    var username = $("div#login input[name='username']").val();
    var password = $("div#login input[name='password']").val();
    if (!username || !password) {
        $("div#login td.error").text("Try again...");
        return;
    }
    $("div#login td.error").text("Logging in...");
    $("div#login input[name='save']").attr("disabled", "true");
    $.ajax({
        url: "http://twitter.com/account/verify_credentials.json",
        dataType: "text",
        username: username,
        password: password,
        success: function(data) {
            $("div#login").slideUp("normal");
            $("div#login td.error").text("");
            $("div#login input[name='save']").removeAttr("disabled");
            setLogin(username, password);
            refreshTweets();
        },
        error: function(error) {
            $("div#login input[name='save']").removeAttr("disabled");
            $("div#login td.error").text("Bad login!");
        }
    });
}

function getLogin() {
    var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);

    try {
        var logins = myLoginManager.findLogins({}, "chrome://tweetlol", null, "Twitter Auth");
        for (var i = 0; i < logins.length; i++) {
           return logins[i];
        }
        return null;
    } catch(e) {
        return null;
    }
}

function clearLogin() {
    var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);
    try {
        var logins = myLoginManager.findLogins({}, "chrome://tweetlol", null, "Twitter Auth");
        for (var i = 0; i < logins.length; i++) {
            myLoginManager.removeLogin(logins[i]);
        }
    } catch(e) {
        return null;
    }
}

function setLogin(username, password) {
    clearLogin();
    var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);
    var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                                                 Components.interfaces.nsILoginInfo,
                                                 "init");

    var loginInfo = new nsLoginInfo("chrome://tweetlol", null, "Twitter Auth", username, password, "", "");
    myLoginManager.addLogin(loginInfo);
}

function tweetInput(event) {
    if (event.keyCode == 13) {
        postUpdate($(event.target).val());
        $(event.target).val("");
    }
    updateInputCount();
}

function tweetInputVerify(event) {
    if (event.keyCode > 31 && getInputCount() >= 140) {
        event.preventDefault();
    }
}

function updateInputCount() {
    $("div.toolbar span.tweet").text(140 - getInputCount());
    if (replyingTo && len == 0) replyingTo = null;
}

function getInputCount() {
    var tweet = $("#tweetbox").val();
    tweet = gsub(tweet, urlRe, function(match) { return shortenUrl(match[0]) });
    return tweet.length;
}

function updateLayout() {
    var height = document.documentElement.clientHeight;
    height -= $("ul.tabbar").outerHeight();
    height -= $("div.toolbar").outerHeight();
    $("div.view").height(height);
}

function updateTabs() {
    $("ul.tabbar li").each(function() {
        var view = $("#" + $(this).attr("id") + "View");
        if ($(this).hasClass("active")) $(view).show();
        else $(view).hide();
    });
}

function log(msg) {
    Application.console.log("tweetlol: " + msg);
}

function nsUrl(spec) {
  var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  return ios.newURI(spec, null, null);
}

function newTab(url) {
    Application.activeWindow.open(nsUrl(url));
    return false;
}

function url(url, text) {
    var link = $('<a/>');
    link.text(text);
    link.attr("href", url);
    fixUrl(link);
    return link;
}

function fixUrl(url) {
    url.find("a").andSelf().filter("a[href]").click(function(event) {
        return newTab(event.target.href);
    });
    return url;
}

// From Prototype, much stripped:
function gsub(source, pattern, replacement) {
    var result = '', match;
    
    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }
 
    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += replacement(match);
        source = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
}

function asyncGsub(callback, source, pattern, replacement) {
    function recurse(front, back) {
        var match = back.match(pattern);
        if (match) {
            var newFront = front + back.slice(0, match.index);
            var newBack = back.slice(match.index + match[0].length);
            replacement(match, function(repl) {
                recurse(newFront + repl, newBack);
            });
        } else {
            callback(front + back);
        }
    }
    recurse("", source);
}

function urlise(text) {
    return gsub(text, urliseRe, function(url) {
        url = url[1];
        if (url[0] == "@")
            return '@<a href="http://twitter.com/' + url.substring(1) + '">' + url.substring(1) + '</a>';
        if (url[0] == "#")
            if (url[url.length-1] == ";")
                return url;
            else
                return '#<a href="http://search.twitter.com/?q=' + url.substring(1) + '">' + url.substring(1) + '</a>';
        return '<a href="' + url + '">link</a>';
    });
}

function readableTime(t) {
    t = Math.round(t / 1000);
    if (t < 60)
        return t + " second" + ((t == 1) ? "" : "s");
    t = Math.round(t / 60);
    if (t < 59)
        return t + " minute" + ((t == 1) ? "" : "s");
    t = Math.round(t / 60);
    if (t < 24)
        return t + " hour" + ((t == 1) ? "" : "s");
    t = Math.round(t / 24);
        return t + " day" + ((t == 1) ? "" : "s");
}

function timeSince(date) {
    var now = new Date();
    return readableTime(now.getTime() - date);
}
  
function tweetToDOM(tweet) {
    var item = $('<li class="entry"/>').attr("id", tweet.id);
    item.append($('<img class="portrait" width="48" height="48"/>').attr("src", tweet.user.profile_image_url));
    var entry = $('<div class="entry"/>');
    var header = $('<p class="postinfo"/>');
    header.append(url("http://twitter.com/"+tweet.user.screen_name, tweet.user.name));
    var extra = $('<p class="like"/>');
    if (tweet.in_reply_to_status_id) {
        extra.append('in reply to ');
        extra.append(url("http://twitter.com/" + tweet.in_reply_to_screen_name + "/status/"
                         + tweet.in_reply_to_status_id, tweet.in_reply_to_screen_name));
    }
    extra.append(" via ");
    if (tweet.source.charAt(0) == "<")
        extra.append(fixUrl($(tweet.source)));
    else
        extra.append(tweet.source);
    var time = Date.parse(tweet.created_at);
    extra.append(' <span class="time" time="' + time + '"></span> ago');
    var toolbar = $('<p class="toolbar"/>');
    var reply = $('<img src="icons/reply.gif" title="Reply to this"/>');
    toolbar.append(reply);
    var retweet = $('<img src="icons/retweet.gif" title="Retweet this"/>');
    toolbar.append(retweet);
    toolbar.append('<br/>')
    var dm = $('<img src="icons/dm.gif" title="Direct message"/>');
    toolbar.append(dm);
    var favourite = $('<img src="icons/favourite' + (tweet.favorited ? "_on" : "") + '.gif" title="Favourite this"/>');
    toolbar.append(favourite);
    entry.append(header);
    entry.append(fixUrl($('<p class="post"/>').html(urlise(tweet.text))));
    entry.append(toolbar);
    entry.append(extra);
    item.append(entry);
    
    reply.click(function(event) { actionReply(tweet, item, event); });
    retweet.click(function(event) { actionRetweet(tweet, item, event); });
    dm.click(function(event) { actionDM(tweet, item, event); });
    favourite.click(function(event) { actionFavourite(tweet, item, favourite, event); });
    
    return item;
}

function actionReply(tweet, item, event) {
    var box = $("#tweetbox");
    box.val("@" + tweet.user.screen_name + " ");
    box.focus();
    replyingTo = { user: tweet.user.screen_name, id: tweet.id };
    updateInputCount();
}

function actionDM(tweet, item, event) {
    var box = $("#tweetbox");
    box.val("d " + tweet.user.screen_name + " ");
    box.focus();
    replyingTo = null;
    updateInputCount();
}

function actionRetweet(tweet, item, event) {
    var box = $("#tweetbox");
    box.val("RT @" + tweet.user.screen_name + ": " + tweet.text);
    box.focus();
    replyingTo = { user: tweet.user.screen_name, id: tweet.id };
    updateInputCount();
}

function actionFavourite(tweet, item, fave, event) {
    if (fave.attr("src").indexOf("_on") == -1) {
        fave.attr("src", "icons/favourite_on.gif");
        $.ajax({
            url: "http://twitter.com/favorites/create/" + tweet.id + ".json",
            type: "POST",
            dataType: "text",
            error: function(request, error) {
                log(error);
            },
            success: function(data) {}
        });
    } else {
        fave.attr("src", "icons/favourite.gif");
        $.ajax({
            url: "http://twitter.com/favorites/destroy/" + tweet.id + ".json",
            type: "POST",
            dataType: "text",
            error: function(request, error) {
                log(error);
            },
            success: function(data) {}
        });
    }
}

function shortenUrl(url, callback) {
    if (!callback) {
        if (url.length < 18) return url;
        return "http://is.gd/xxxxx";
    }
    if (url.length < 18) {
        callback(url);
    } else {
        $.ajax({
            url: "http://is.gd/api.php",
            data: { longurl: url },
            dataType: "text",
            error: function() { callback(url); },
            success: function(data) { callback(data); }
        });
    }
}

function populateTweets(tweets) {
    $.each(tweets.reverse(), function() {
        $("#friendEntries").prepend(tweetToDOM(this));
        if (this.id > lastTweet) lastTweet = this.id;
    });
    $("#friendEntries li:gt(" + (tweetsPerPage-1) + ")").remove();
    $("span.time").each(function() {
        $(this).text(timeSince(parseInt($(this).attr("time"))));
    });
}

function refreshTweets() {
    data = { count: tweetsPerPage };
    if (lastTweet > 0) data.since_id = lastTweet;
    $.ajax({
        url: "http://twitter.com/statuses/friends_timeline.json",
        data: data,
        dataType: "text",
        error: function(request, error) {
            log(error);
        },
        success: function(data) {
            populateTweets(nativeJSON.decode(data));
        }
    });
    if (tweetTimer !== null) clearTimeout(tweetTimer);
    tweetTimer = setTimeout(refreshTweets, 120000);
}

function postUpdate(tweet, reply) {
    $("div.toolbar span.tweet").text("...");
    asyncGsub(function(text) {
        var data = { status: text };
        if (reply) data.in_reply_to_status_id = reply;
        else if (replyingTo) {
            var re = "@" + replyingTo.user;
            if (text.indexOf(re) != -1)
                data.in_reply_to_status_id = replyingTo.id;
            replyingTo = null;
        }
        $.ajax({
            url: "http://twitter.com/statuses/update.json",
            data: data,
            dataType: "text",
            type: "POST",
            error: function(request, error, trace) {
                log(error);
                log(trace);
            },
            success: function(data) {
                updateInputCount();
                populateTweets([nativeJSON.decode(data)]);
            }
        });
    }, tweet, urlRe, function(match, callback) { shortenUrl(match[0], callback); });
}
