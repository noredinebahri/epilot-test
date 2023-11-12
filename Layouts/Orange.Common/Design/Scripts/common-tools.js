//===================================================================================================================
// EPilot - Fonctions génériques
//===================================================================================================================

//------------------------------------------
// Logger
//------------------------------------------
var logger = {
    logError: function (message, data, showMessageFromInput) {
        //Affichage de l'erreur dans la console
        console.error(message, data);
        //Affichage de l'erreur à l'utilisateur
        $('#errorNotificationBar').show();
        $('#errorNotificationBar').empty();
        $('#errorNotificationBar').append(showMessageFromInput ? message : 'Une erreur technique est survenue. Merci de contacter votre administrateur.');
    },
    logSuccess: function (message) {
        $('#successNotificationBar').show();
        $('#successNotificationBar').empty();
        $('#successNotificationBar').append(message);
        console.log(message);
    },
    logInfo: function (message, data) {
        //Affichage de l'erreur dans la console
        if (data) {
            console.log(message, data);
        }
        else {
            console.log(message);
        }
    }
}

//------------------------------------------
// Properties
//------------------------------------------
var epilotproperties = {
    getWebServiceUrl: function () {
        var webServiceUrl = $('#PropertyEPilotWebApiUrl').text();
        return webServiceUrl;
    }
}

var pvvproperties = {
    getWebServiceUrl: function () {
        var webServiceUrl = $('#PropertyPVVWebApiUrl').text();
        return webServiceUrl;
    }
}

var caParcProperties = {
    getWebServiceUrl: function () {
        var webServiceUrl = $('#PropertyCaParcWebApiUrl').text();
        console.log(webServiceUrl);
        return webServiceUrl;
    }
}


var tpsProperties = {
    getWebServiceUrl: function () {
        var webServiceUrl = $('#PropertyTpsWebApiUrl').text();
        console.log(webServiceUrl);
        return webServiceUrl;
    }
}

var drcePvcproperties = {
    getWebServiceUrl: function () {
        var webServiceUrl = $('#PropertyDrcePVCWebApiUrl').text();
        return webServiceUrl;
    }
}

//------------------------------------------
// QueryString
//------------------------------------------
var queryString = {
    getCurrent: function () {
        //Recupération de la querystring
        var vars = [], hash;
        var q = document.URL.split('?')[1];
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0].toLowerCase()] = hash[1];
            }
        }
        return vars;
    },
    getValue: function (param) {
        return queryString.getCurrent()[param];
    }
}

//------------------------------------------
// Cookies
//------------------------------------------
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

//------------------------------------------
// Function - Reference
//------------------------------------------

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    // URLs starting with http://, https://, file:// or ftp://
    replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/f])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    // Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    // If there are hrefs in the original text, let's split
    // the text up and only work on the parts that don't have urls yet.
    var count = inputText.match(/<a href/g) || [];

    if (count.length > 0) {
        // Keep delimiter when splitting
        var splitInput = inputText.split(/(<\/a>)/g);
        for (var i = 0 ; i < splitInput.length ; i++) {
            if (splitInput[i].match(/<a href/g) == null) {
                splitInput[i] = splitInput[i].replace(replacePattern1, '<a href="$1" target="_blank">$1</a>').replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>').replace(replacePattern3, '<a href="mailto:$1">$1</a>');
            }
        }
        var combinedReplacedText = splitInput.join('');
        return combinedReplacedText;
    } else {
        return replacedText;
    }
}
