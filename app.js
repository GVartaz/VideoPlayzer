var dataLayer = require('./dataLayer.js');
var dataLayerVideos = require('./server/dataLayerVideos.js');
var express = require('express');
var session = require('express-session');
const app = express();
const port = 5000;
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const Youtube = require("./server/api-streaming/Youtube");
app.use(express.static('public'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
   
  app.use(function (req, res, next) {
 
    next()
  })


dataLayer.init(function(){
    console.log("Connectiong to db");
    app.listen(process.env.PORT || 5000)
    console.log("App listening on port "+port);
});

app.post("/search", function(req, res){
    var that = this;
    //get param
    var slug;

    try {
        slug = req.body.search;

        if (!slug) throw "";
    } catch (e) {
        res.send("MISSING_PARAMS");
        return;
    }

    //slug = this.deslugify(slug);

    Youtube.search(slug.toString().toLowerCase(),10).then(function (data) {
        res.send({videos : data})
    }).catch(function (err) {
        res.send(err);
    })

});

app.post("/favorites", function(req, res){
    var that = this;
    //get param
    var slug;

    try {
        slug = req.body.search;

        if (!slug) throw "";
    } catch (e) {
        res.send("MISSING_PARAMS");
        return;
    }

    //slug = this.deslugify(slug);

    Youtube.search(slug.toString().toLowerCase(),10).then(function (data) {
        res.send({videos : data})
    }).catch(function (err) {
        res.send(err);
    })

});

app.post("/connexion",function(req,res){
    var user = {
        login : req.body.login,
        pwd : req.body.pwd
    };
    dataLayer.getUser(user,function(data){
        if(data != null) {
            req.session.user = data;
            res.send(data);
        } else {
            res.send(false);
            //console.log("Vos identifiants sont incorrects. Veuillez réssayer.");
        }
    });
})

app.get("/getUser",function(req,res){
    var user = req.session.user;
    res.send(user);
})

app.get("/play",function(req,res){
    var v = req.session.video;
    req.session.video = {};
    res.send({user: req.session.user,video: v});
})

app.post("/logout",function(req,res){
    req.session.user = {};
    res.send({success:true});
});

app.post("/addUser",function(req,res){
    var user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        login : req.body.login,
        pwd : req.body.pwd
    };
    dataLayer.getLogin(user.login,function(data){
        if(data == null) {
            dataLayer.createUser(user,function(){
                res.send({success:true});
            });
        } else {
            res.send(false);
        }
    });
})

app.post("/addFav/:id",function(req,res){
    var u = req.session.user;
    Youtube.getVideoById(req.params.id).then(function(video) {
        dataLayer.insertVideo(Youtube.normalize(video,u._id),function(){
            res.send(u);
        })
    }).catch(function (err) {
        res.send(err);
    })
})

app.post("/open/:id",function(req,res){
    var u = req.session.user;
    Youtube.getVideoById(req.params.id).then(function(video) {
        req.session.video = Youtube.normalize(video,null);
        res.send(u);
    }).catch(function (err) {
        res.send(err);
    })
})
/*on recupere l'id des vidéos, on cherche dans la base de donnée les videos en rapport avec l'user
et on appelle youtube avec l'id des videos, on les renvoie */ 
app.get("/favorites",function(req,res){
    var user = req.session.user._id;
    
    dataLayer.getVideos(user,function(data){
        res.send(data);
    })
})


app.delete("/deleteFav/:id",function(req,res){
    var id = req.params.id;
    dataLayer.deleteFav(id,function(){
        res.send(req.session.user);
    })
})


app.get("/getTaskSet",function(req,res){
    var user = req.session.logUser;
    var liste;
    dataLayer.getListSet(user,function(data){
        liste = data;
        dataLayer.getTaskSet2(liste,user,function(data){
            res.send({taskSet: data,listeSet: liste,user: user});
        })
    });
})

app.post("/addList",function(req,res){
    var list = {
        name : req.body.name,
        auteur : req.session.logUser
    };
    dataLayer.insertList(list,function(){
        var liste;
        var user = req.session.logUser;
        dataLayer.getListSet(user,function(data){
            liste = data;
            dataLayer.getTaskSet2(liste,user,function(data){
                res.send({taskSet: data,listeSet: liste,user: user});
            })
        });
    });
})

app.post("/addTask",function(req,res){
    var task = {
        text : req.body.text,
        date : new Date().toLocaleDateString(),
        createur : req.session.logUser,
        liste : req.body.select,
        done : false
    };
    if(task.liste == undefined){
        res.send(false);
    } else {
        dataLayer.insertTask(task,function(){
            var user = req.session.logUser;
            var liste;
            dataLayer.getListSet(user,function(data){
                liste = data;
                dataLayer.getTaskSet2(liste,user,function(data){
                    res.send({taskSet: data,listeSet: liste,user: user});
                })
            });
        });
    }
})

app.delete("/deleteList/:id",function(req,res){
    var id = req.params.id;
    dataLayer.getList(id,function(data){
        var list = data.name;
        dataLayer.deleteTasks(list,function(){
            dataLayer.deleteList(id,function(){
                var liste;
                var user = req.session.logUser;
                dataLayer.getListSet(user,function(data){
                    liste = data;
                    dataLayer.getTaskSet2(liste,user,function(data){
                        res.send({taskSet: data,listeSet: liste,user: user});
                    })
                });
            });
        });
    });
})

app.delete("/deleteTask/:id",function(req,res){
    var id = req.params.id;
    dataLayer.deleteTask(id,function(){
        var user = req.session.logUser;
        var liste;
        dataLayer.getListSet(user,function(data){
            liste = data;
            dataLayer.getTaskSet2(liste,user,function(data){
                res.send({taskSet: data,listeSet: liste,user: user});
            })
        });
    });
})

//update task
app.put("/updateTask/:id", function(req, res) {
    var id = req.params.id;
        var task = { 
        text : req.body.modif,
        date : new Date().toLocaleDateString()
    };
    dataLayer.updateTask(id, task,function(){
        var user = req.session.logUser;
        var liste;
        dataLayer.getListSet(user,function(data){
            liste = data;
            dataLayer.getTaskSet2(liste,user,function(data){
                res.send({taskSet: data,listeSet: liste,user: user});
            })
        });
    });
});

app.put("/updateCB/:id", function(req, res) {
    var id = req.params.id;
    var task;
    dataLayer.getTask(id,function(data){
        task = data;
        task.done = !task.done;
        dataLayer.updateTask(id, task,function(){
            var user = req.session.logUser;
            var liste;
            dataLayer.getListSet(user,function(data){
                liste = data;
                dataLayer.getTaskSet2(liste,user,function(data){
                    res.send({taskSet: data,listeSet: liste,user: user});
                })
            });
        });
    })
});
