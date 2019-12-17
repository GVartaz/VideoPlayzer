const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbGV:v17003937@clustergv-ms4c6.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

var db;

var dataLayer = {
    init : function(cb){

        client.connect(function(err){
            if(err) throw err;

            db = client.db("dbGV");
            cb();
        });

    },

    getUser : function(user,cb){
        db.collection("Users").findOne(user,function(err,docs) {
            cb(docs);
        });
    },

    getLogin : function(login,cb){
        db.collection("Users").findOne({"login" : login},function(err,docs) {
            cb(docs);
        });
    },

    createUser : function(user,cb){
        db.collection("Users").insertOne(user,function(err,result){
            cb();
        })
    },

    getPlaylistSet : function(user,cb){

        db.collection("Playlist").find({"auteur" : user}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    getVideoSetPlaylist : function(playlist,cb){
        db.collection("VideoPlaylist").find({"playlist" :playlist}).toArray(function(err,docs){
            cb(docs);
        })
    },

    getVideosById : function(liste,cb){
        ObjectID = require('mongodb').ObjectID;
        var ids = [];
        liste.forEach(function(item){
            ids.push(new ObjectID(item.video));
        })
        //})
        //cb(listes);*/
        db.collection("Videos").find({"_id" : {$in: ids}}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    insertPlaylist : function(list,cb){
        db.collection("Playlist").insertOne(list,function(err,result){
            cb();
        })
    },

    insertVideoToPlaylist: function (object,cb){
        db.collection("VideoPlaylist").insertOne(object,function(err,result){
            cb();
        })
    },

    getPlaylist : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Playlist").findOne(ident,function(err,docs){
            cb(docs);
        })
    },

    deletePlaylist : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Playlist").deleteOne(ident,function(err,result){
            cb();
        })
    },

    getVideoSetVideo : function(video,cb){
        db.collection("VideoPlaylist").find({"video" :video}).toArray(function(err,docs){
            cb(docs);
        })
    },

    deleteVideoFromPlaylist : function(id,cb){
        var ident = {
            _id : id
        }
        db.collection("VideoPlaylist").deleteOne(ident,function(err,result){
            cb();
        })
    },

    deleteVideosFromPlaylist : function(playlist,cb){
        db.collection("VideoPlaylist").deleteMany({"playlist": playlist},function(err,result){
            cb();
        })
    },

    getTaskSet : function(liste,cb){

        db.collection("Tasks").find({"liste" : liste}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    getTaskSet2 : function(liste,login,cb){
        var listes = [];
        liste.forEach(function(item){
            listes.push(item.name);
        })
        db.collection("Tasks").find({"liste" : {$in: listes},"createur" : login}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    insertVideo : function(video,cb){
        db.collection("Videos").insertOne(video,function(err,result){
            cb();
        })
    },

    /*cherche dans la base de données les videos en rapport avec l'id
      Renvoie la liste de toutes les videos */
    getVideos : function (id,cb){
        db.collection("Videos").find({"user": id}).toArray(function(err,docs){
            cb(docs);
        })
    },

    getTask : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Tasks").findOne(ident,function(err,docs) {
            cb(docs);
        });
    },

    insertTask : function(task,cb){
        db.collection("Tasks").insertOne(task,function(err,result){
            cb();
        })
    },

    updateTask : function(id, task, cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        //console.log(ident);
        db.collection("Tasks").updateOne(ident, {$set: task}, function(err, result) {
            cb();
        });           
    },

    deleteFav : function(id,cb){
        db.collection("Videos").deleteOne({"id":id},function(err,result){
            cb();
        })
    },

    deleteTask : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Tasks").deleteOne(ident,function(err,result){
            cb();
        })
    },

    deleteTasks : function(list,cb){
        db.collection("Tasks").deleteMany({"liste": list},function(err,result){
            cb();
        })
    }

}

module.exports = dataLayer;