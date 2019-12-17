'use strict';

var demoApp = angular.module('demoApp', []);

demoApp.controller('InscriptionController',function ($scope, $http){

    $scope.formLogin = {};

    $scope.createUser = function(){
        var login = document.getElementById("adresse");
        var pwd = document.getElementById("password");
        var confirmPsw = document.getElementById("confirmed_password");
        var agree = document.getElementById("agreement");
        if(login.value == ""){
            login.style.borderColor = "#FF0000";
        }
        else if(login.value.indexOf("@") == -1){
            login.style.bordercolor = "#FF0000";
            alert("Adresse invalide");
        }
        else if(pwd.value == ""){
            pwd.style.borderColor = "#FF0000";
        }
        else if(pwd.value != confirmPsw.value){
            confirmPsw.style.borderColor = "#FF0000";
            alert("Les mots de passe ne correspondent pas");
        }
        
        else if(!agree.checked){
            alert("Veuillez cocher la case pour valider les termes")
        }
         else{
            login.style.borderColor = null;
            pwd.style.borderColor = null;
            $http.post('/addUser',$scope.formLogin).then(function(resp){
                if(resp.data == false){
                    login.style.borderColor = "#FF0000";
                    alert("Identifiant déjà utilisé. Veuillez en choisir un autre");
                    login.value = "";
                    pwd.value = "";
                } else {
                    $scope.formLogin = {};
                    window.location.href = "./index.html";
                    alert("Inscription réussie");
                }
            });
        }
    };
});

demoApp.controller('LoginController',function ($scope, $http){

    $scope.formLogin = {};

    $scope.connexion = function(){
        var login = document.getElementById("login");
        var pwd = document.getElementById("password");
        if(login.value == ""){
            login.style.borderColor = "#FF0000";
        }
        if(pwd.value == ""){
            pwd.style.borderColor = "#FF0000";
        }
        if(login.value != "" && pwd.value != "" ){
            login.style.borderColor = null;
            pwd.style.borderColor = null;
            $http.post('/connexion',$scope.formLogin).then(function(resp){
                if(resp.data == false){
                    alert("Identifiants incorrects");
                    login.value = "";
                    pwd.value = "";
                } else {
                    $scope.formLogin = {};
                    window.location.href = "./search.html";
                    alert("Connexion réussie");
                }
            });
        }
    };
});

demoApp.controller('SearchController',function($scope,$http){
    $scope.formVideo = {};

    $scope.createList = function (){
        document.getElementById("videos").style.display = "block";
        $http.post('/search',$scope.formVideo).then(function(resp){
            console.log(resp.data.videos);
            $scope.videoSet = resp.data.videos.results;
            document.getElementById("favorites").style.display = "none";
        })
    }

    $scope.showFavorite = function(){
        document.getElementById("videos").style.display = "none";
        document.getElementById("favorites").style.display = "block";
    }

     /**Fonction qui affiche la list des favoris*/ 
    $http.get('/favorites').then(function(resp){
        console.log(resp.data);
        $scope.favoriteSet = resp.data.videos;
        $scope.playlistSet = resp.data.playlists;
    })
    

    $http.get('/getUser').then(function(resp){
        $scope.user = resp.data;
    });

    $scope.open = function (id){
        $http.post('/open/'+id).then(function(resp){
            window.location.href = "./play.html";
        })
    }

    $scope.logout = function (){
        $http.post('/logout',$scope.formLogin).then(function(resp){
            $scope.formLogin = {};
            window.location.href = "./index.html";
        }
    )};

    $scope.addFav = function (id){
        $http.post('/addFav/'+id).then(function(resp){
            $scope.user = resp.data;
        })
        window.location.reload();
        this.showFavorite();
    }

    $scope.videoToPlaylist = function(id,id_select){
         var Indata = {'id':id, 'id_select':id_select}
         $http.post('/addVideoToPlaylist/'+Indata)
         .then(function(resp){
         })
    }

    $scope.deleteFav = function (id){
        $http.delete('/deleteFav/'+id).then(function(resp){
            $scope.user = resp.data;
            window.location.reload();
        }
    )};

});

demoApp.controller('PlayController',function ($scope, $http,$sce){

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $http.get('/play').then(function(resp){
        $scope.video = resp.data.video;
        $scope.user = resp.data.user;
    })

    $scope.logout = function (){
        $http.post('/logout',$scope.formLogin).then(function(resp){
            $scope.formLogin = {};
            window.location.href = "./index.html";
        }
    )};

});

demoApp.controller('PlaylistController',function ($scope, $http){

    $scope.logout = function (){
        $http.post('/logout',$scope.formLogin).then(function(resp){
            $scope.formLogin = {};
            window.location.href = "./index.html";
        }
    )};

    $scope.createPlaylist = function (){
        if(document.getElementById("newListe").value == "") {
            document.getElementById("liste-warning").innerHTML = "Vous devez donner un nom à votre liste";
        } else {
            document.getElementById("liste-warning").innerHTML = "";
            $http.post('/addPlaylist',$scope.formListe).then(function(resp){
                $scope.formListe = {};
                if(resp.data == true){
                    window.location.reload();
                } else {
                    document.getElementById("liste-warning").innerHTML = "Erreur lors de l'ajout";
                }
                
            });
        }
    };
    
    $scope.openPlaylist = function(id){
        $http.post('/openPlaylist/'+id).then(function(resp){
            document.getElementById("videoPlaylist").style.display = "block";
            $scope.videoSet = resp.data;
        })
    }

    $http.get('/getPlaylistSet').then(function(resp){
        $scope.playlistSet = resp.data.playlistSet;
        $scope.user = resp.data.user;
    });

    $scope.open = function (id){
        $http.post('/open/'+id).then(function(resp){
            window.location.href = "./play.html";
        })
    }

    $scope.deletePlaylist = function(id){
        $http.delete('/deletePlaylist/'+id).then(function(resp){
            $scope.playlistSet = resp.data.playlistSet;
        })
    }

    $scope.deleteFromPlaylist = function(id){
        $http.delete('/deleteFromPlaylist/'+id).then(function(resp){
            $scope.videoSet = resp.data;
        })
    }

});

demoApp.controller('MainController',function ($scope, $http){

    $scope.formListe = {};
    $scope.formData = {};
    $scope.formLogin = {};

    $http.get('/getTaskSet').then(function(resp){
        $scope.taskSet = resp.data.taskSet;
        $scope.listSet = resp.data.listeSet;
        $scope.user = resp.data.user;
    });

    $scope.createList = function (){
        if(document.getElementById("newListe").value == "") {
            document.getElementById("liste-warning").innerHTML = "Vous devez donner un nom à votre liste";
        } else {
            document.getElementById("liste-warning").innerHTML = "";
            $http.post('/addList',$scope.formListe).then(function(resp){
                $scope.formListe = {};
                $scope.taskSet = resp.data.taskSet;
                $scope.listSet = resp.data.listeSet;
                $scope.user = resp.data.user;
            });
        }
    };

    $scope.deleteList = function (id){
        $http.delete('/deleteList/'+id).then(function(resp){
            $scope.taskSet = resp.data.taskSet;
            $scope.listSet = resp.data.listeSet;
            $scope.user = resp.data.user;
        }
    )};

    $scope.createTodo = function (){
        if(document.getElementById("newTache").value == "") {
            document.getElementById("select-warning").innerHTML = "Vous devez donner un nom à votre tache";
        } else {
            $http.post('/addTask',$scope.formData).then(function(resp){
            if(resp.data == false){
                document.getElementById("select-warning").innerHTML = "Vous devez associer une liste à cette tache";
            } else {
                document.getElementById("select-warning").innerHTML = "";
                
                    $scope.formData = {};
                    $scope.taskSet = resp.data.taskSet;
                    $scope.listSet = resp.data.listeSet;
                    $scope.user = resp.data.user;
            
                }
            })
        }
    };

    $scope.deleteTodo = function (id){
        $http.delete('/deleteTask/'+id).then(function(resp){
            $scope.taskSet = resp.data.taskSet;
            $scope.listSet = resp.data.listeSet;
            $scope.user = resp.data.user;
        }
    )};

    $scope.openEdit = function (id){
        var text = document.getElementById("text"+id);
        var btnValid = document.getElementById("btn"+id);
        var btnEdit = document.getElementById("modif"+id);
        btnEdit.style.display = "none";
        text.value = "";
        text.style.display = "inline";
        btnValid.style.display = "inline";
    };

    $scope.update = function (id){
        var text = document.getElementById("text"+id);
        var btnValid = document.getElementById("btn"+id);
        var btnEdit = document.getElementById("modif"+id);
        btnEdit.style.display = "inline";
        text.style.display = "none";
        btnValid.style.display = "none";
        $http.put('/updateTask/'+id,$scope.formData).then(function(resp){
            $scope.taskSet = resp.data.taskSet;
            $scope.listSet = resp.data.listeSet;
            $scope.user = resp.data.user;
        }
    )};

    $scope.switch = function (id){
        $http.put('/updateCB/'+id,$scope.formData).then(function(resp){
            $scope.taskSet = resp.data.taskSet;
            $scope.listSet = resp.data.listeSet;
            $scope.user = resp.data.user;
        }
    )};

    

});