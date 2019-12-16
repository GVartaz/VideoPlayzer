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

    getListSet : function(login,cb){

        db.collection("List").find({"auteur" : login}).toArray(function(err,docs) {
            cb(docs);
        });
    },

    insertList : function(list,cb){
        db.collection("List").insertOne(list,function(err,result){
            cb();
        })
    },

    getList : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("List").findOne(ident,function(err,docs){
            cb(docs);
        })
    },

    deleteList : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("List").deleteOne(ident,function(err,result){
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

    getTask : function(id,cb){
        ObjectID = require('mongodb').ObjectID;
        var ident = {
            _id : new ObjectID(id)
        };
        db.collection("Tasks").findOne(ident,function(err,docs) {
            cb(docs);
        });
    },

    insertVideo : function(video,cb){
        db.collection("Videos").insertOne(video,function(err,result){
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