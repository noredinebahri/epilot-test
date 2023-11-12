orangeCommonApp.app.service('blocNoteService', function blocNoteService($http) {

    this.getAll = function (type,codeAlliance) {
        var url = codeAlliance ?
            epilotproperties.getWebServiceUrl() + "Note/GetAll/" + type + '/' + codeAlliance
            : epilotproperties.getWebServiceUrl() + "Note/GetAll/" + type + '/';

        return $http.get(url);
    }

    this.count = function () {
        var url = epilotproperties.getWebServiceUrl() + "Note/Count/";
        return $http.get(url);
    }

    this.read = function (id) {
        var url = epilotproperties.getWebServiceUrl() + "Note/Read/" + id;
        return $http.get(url);
    }

    this.delete = function (id) {
        var url = epilotproperties.getWebServiceUrl() + "Note/Delete/" + id;
        return $http.get(url);
    }

    this.save = function (item) {
        var url = epilotproperties.getWebServiceUrl() + "Note/Save/";
        return $http.post(url, item);
    }

    this.actors = function (search) {
        var url = epilotproperties.getWebServiceUrl() + "Note/SearchActor/" + search;
        return $http.get(url);
    }

    this.saveCommentaire = function (commentaire) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/Save";
        return $http.post(url, commentaire);
    }

    this.getAllCommentaires = function (idNote) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/GetAll/" + idNote;
        return $http.get(url);
    }

    this.deleteCommentaire = function (idNote) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/Delete/" + idNote;
        return $http.get(url);
    }

    this.readCommentaire = function (idNote) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/Read/" + idNote;
        return $http.get(url);
    }

    this.getAllFavoris = function () {
        var url = epilotproperties.getWebServiceUrl() + "NoteFavoris/GetAll/";
        return $http.get(url);
    }

    this.saveFavoris = function (favori) {
        var url = epilotproperties.getWebServiceUrl() + "NoteFavoris/Save";
        return $http.post(url, favori);
    }

    this.deleteFavoris = function (id) {
        var url = epilotproperties.getWebServiceUrl() + "NoteFavoris/Delete/" + id;
        return $http.get(url);
    }

});