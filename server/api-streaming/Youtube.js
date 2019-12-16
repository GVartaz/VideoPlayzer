var searchYT = require('youtube-search');
const apiKeyYoutube = 'AIzaSyBMJSr7HrSphkNRWwYW8oG-Pedf9LcAxDE';
const YouTubeAPI  = require("simple-youtube-api");
const youtubeAPI = new YouTubeAPI(apiKeyYoutube);


class Youtube {
    constructor() {

    }

    search(keyWords, maxResults, pageToken = null){
        var opts = {
            maxResults: maxResults,
            key: apiKeyYoutube,
            regionCode: 'FR',
            pageToken : pageToken,
            type: 'video'
        };

        return new Promise(function (resolve, reject) {
            searchYT(keyWords, opts).then(function (results) {
                results.results.map(function (video) {
                    video.brand = "Youtube";
                    video.embedurl = "http://www.youtube.com/embed/"+video.id;
                });
                resolve(results);
            }).catch(function(err){
                reject(err);
            })
        })
    };

    getVideoById(id){
        return new Promise(function (resolve, reject) {
            youtubeAPI.getVideoByID(id).then(function (results) {
                resolve(results);
            }).catch(function(err){
                reject(err);
            })
        })
    };

    normalize(video,user){
        var result = {};

        result.id = video.id;
        result.title = video.title;
        result.description = video.description


        /*result.thumbnails = {};
        result.thumbnails.default = {};
        result.thumbnails.medium = {};
        result.thumbnails.high = {};

        if(typeof video.thumbnails.default.url !== 'undefined'){
            result.thumbnails.default.url = video.thumbnails.default.url;
            result.thumbnails.default.width = video.thumbnails.default.width;
            result.thumbnails.default.height = video.thumbnails.default.height;
        }


        if(typeof video.thumbnails.medium.url !== 'undefined'){
            result.thumbnails.medium.url = video.thumbnails.medium.url;
            result.thumbnails.medium.width = video.thumbnails.medium.width;
            result.thumbnails.medium.height = video.thumbnails.medium.height;
        }


        if(typeof video.thumbnails.high.url !== 'undefined'){
            result.thumbnails.high.url = video.thumbnails.high.url;
            result.thumbnails.high.width = video.thumbnails.high.width;
            result.thumbnails.high.height = video.thumbnails.high.height;
        }*/

        result.channel = video.channel.title;

        result.embedurl = "http://www.youtube.com/embed/"+video.id;

        result.publishedAt = video.publishedAt;

        result.brand = "Youtube";

        result.user = user;

        return result;
    }
}

module.exports = new Youtube();