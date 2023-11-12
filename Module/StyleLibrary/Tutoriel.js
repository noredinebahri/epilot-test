// ==========================================
// TUTORIELS
// ==========================================


// PERFCO - Presentation ddashboard personnalisé
//----------------------------

var tuto_custom_dashboard = {
    id: "{243d3669-efc1-45eb-b594-fe6269900a5e}",
    nom: "Dashboard personnalisé",
    pattern: "perfco/_layouts/15/Orange.EPilot/Pages/CustomDashboard.aspx",
    type: "onready",
    steps: [
        {
            "onBeforeStart": function () {
                setTimeout(function () {
                    $("#aide .aide-top-button")[0].click();
                }, 1000);
            },
            "selector": "#suiteBarLeft .site-title",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Cet écran vous permet de créer votre propre dashboard."
        }, {
            "selector": "#trigger",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "En bas à droite de l’écran, ce bouton\
                            <br /> vous permettra d’accéder aux différentes vignettes."
        }, {
            "onBeforeStart": function () {
                if ($("#trigger > div > .fa-plus").length == 1) {
                    $('#trigger').trigger('click');
                }
            },
            "selector": "#vignettes-library",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Le panneau de présentation des différentes vignettes."
        }, {
            "selector": "#categorie-vignette-select",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Les catégories des différentes vignettes."
        }, {
            "selector": "#categories-list",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "La liste des différentes vignettes."
        }, {
            "selector": "#categories-list li:first > label > input",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "<br /> -	Cocher pour rajouter une  vignette.\
                            <br /> -	Décocher pour retirer une vignette."
        }, {
            "selector": "#categories-list li:first > div > a",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "<br /> -	Survoler avec la souris pour visualiser la vignette."
        }, {
            "selector": "#save",
            "skipButton": { text: "Terminer" },
            "description": "En bas à droite de l’écran, ce bouton\
                            <br /> vous permettra d’enregistrer votre dashboard personnalisé."
        }
    ]
};

// PERFCO - Presentation de la navigation dans le module perfco
//----------------------------

var tuto_perfco_navigation = {
    id: "{2A46542D-2525-446E-9212-371D5A1EF639}",
    nom: "Naviguer dans Perfco",
    pattern: "perfco",
    type: "onready",
    steps: [
        {
            "selector": "#suiteBarLeft .site-title",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Sur ce bandeau noir, vous pouvez maintenant facilement identifier ou vous vous situez dans l’application :\
                            <br />Le module, la rubrique, l’acteur sélectionné (et l’agence associée)."
        }, {
            "selector": ".com-nav-top",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "En haut à gauche de l’écran,  le nouveau menu de navigation \
                            <br /> vous permettra d’accéder aux différents modules en fonction de vos habilitations."
        }, {
            "onBeforeStart": function () {
                $('.com-nav-top').click();
            },
            "selector": ".tiles.open",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Le panneau de présentation des différents modules en fonction de vos habilitations."
        }, {
            "onBeforeStart": function () {
                if ($('.tiles.open').length > 0) { $('.com-nav-top').click(); }
            },
            "selector": "#DeltaPlaceHolderLeftNavBar",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Sur la gauche de l’écran, vous disposez d’une barre de navigation flottante \
                        <br /> vous permettant de naviguer dans les différentes rubriques \
                        <br /> et sous rubriques du module sélectionné."
        }, {
            "onBeforeStart": function () {
                if ($('.tiles.open').length > 0) { $('.com-nav-top').click(); }
                if ($('#nav-items .fa-home').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "selector": "#nav-items .fa-home",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Le Dashboard est maintenant votre point d’entrée unique. \
                            <br /> Il consolide l’ensemble de vos indicateurs clés de performance \
                            <br /> autour de la couverture client, du chiffre d’affaire et des placements (PO et PIPE). \
                            <br /> En un clin d’œil, visualisez votre avancement sur la période et identifiez \
                            <br /> vos axes de travail pour sécuriser votre atteinte d’objectifs."
        }, {
            "onBeforeStart": function () {
                if ($('#nav-items .fa-rocket').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "selector": "#nav-items .fa-rocket",
            "description": "L’accès à la rubrique couverture client."
        }, {
            "onBeforeStart": function () {
                if ($('#nav-items .fa-thermometer-half').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "selector": "#nav-items .fa-thermometer-half",
            "description": "L’accès aux placements."
        }, {
            "onBeforeStart": function () {
                if ($('#nav-items .fa-map').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "selector": "#nav-items .fa-map",
            "description": "L’accès à la rubrique CAP (Plans d’Actions)."
        }, {
            "onBeforeStart": function () {
                if ($('#nav-items .fa-chart-line').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "selector": "#nav-items .fa-chart-line",
            "description": "L’accès à la rubrique CA & Parcs."
        },
        {
            "selector": ".com-topnav-alerts",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "En haut à droite (sur le bandeau noir), de nouvelles fonctionnalités vous permettrons (via le volet)\
                        <br /> -	De rechercher ou de sélectionner des acteurs vente (selon vos droits)\
                        <br /> -	D’être informé en temps réel sur les alertes ou nouveautés relatives aux différents modules\
                        <br /> -	D’accéder à l’aide en ligne."
        },
        {
            "selector": "#notification .notification-top-button div",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "shape": "circle",
            "description": "Ce picto vous donnera accès à la liste des informations et alertes \
                        <br /> qui vous seront stipulées par une pastille rouge avec un chiffre afin de mieux être alertée.",
            "timeout": 100
        }, {
            "onBeforeStart": function () {
                if ($('#hierarchie .hierarchie-top-button:not(.hidden)').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "selector": "#hierarchie .hierarchie-top-button",
            "description": "Cet autre picto permet d'accéder à votre barre de hierarchie."
        }, {
            "onBeforeStart": function () {
                if ($('#aide .aide-top-button').length == 0) { enjoyhint_instance.trigger('next'); }
            },
            "skipButton": { text: "Terminer" },
            "selector": "#aide .aide-top-button",
            "description": "Et pour finir à la rubrique aides et tutoriaux."
        }
    ]
};


// PERFCO -  Presentation de la refonte du plan d'action
//----------------------------

var tuto_perfco_refonteplanaction = {
    id: "{13C74AA5-C6EE-433E-AFDF-215E89C65911}",
    nom: "Refonte du plan d'action",
    pattern: "perfco/_layouts/15/Orange.EPilot/Pages/PlanAction.aspx",
    type: "click",
    steps: [
        {
            "selector": ".left-panel",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "CAP vous propose un affichage en 3 volets <br /> à gauche vous pouvez définir la vue que vous  souhaitez appliquer"
        }, {
            "onBeforeStart": function () {
                $('.com-button-open-top').click();
                $('.left-panel .plan-action-button:nth-child(1)').click();
            },
            "selector": ".left-panel .plan-action-button:nth-child(3)",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "La vue par porteur vous permet de consulter vos actions par porteur. (c’est la vue pas défaut des ICS)"
        }, {
            "selector": ".left-panel .plan-action-button:nth-child(2)",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "La vue par cible vous permet de visualiser vos actions à partir des cibles identifiées sur votre périmètre client  <br /> <br />\
                    Plusieurs choix sont à votre disposition pour l’affichage de vos cibles <br />\
                    Par domaine: BU MOBILITE, CONNECTIVITE… <br />\
                    Par priorité commerciale: 2.2 HAUT DEBIT, 3.1INFRASTRUCTURE… <br />\
                    Par brique stratégique: SOCLE, ESSENTIEL, OPTIONNEL <br />\
                    Par type : CONQUETE, MIGRATION…"
        }, {
            "selector": ".left-panel .plan-action-button:nth-child(1)",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "La vue par client vous permet de visualiser vos actions à partir des clients de votre périmètre"
        }, {
            "selector": ".left-panel .section-input-filter",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "À n’importe quel moment, vous pouvez effectuer une recherche rapide <br />\
                Par raison sociale ou par SIREN si vous êtes sur la vue par client <br />\
                Par nom de cible si vous êtes dans la vue par cible <br />\
                Par nom de porteur si vous êtes dans la vue par porteur <br />\ "
        }, {
            "onBeforeStart": function () {
                $('.left-panel .section-actions div:nth-child(4)').click();
                $($('.left-panel .bloc-niveau-1:first-child')[0]).click();
            },
            "selector": ".left-panel .section-filters",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Vous pouvez aussi filtrer vos clients par TAG <br /> ou par responsable de compte si vous manager ou ICS"
        }, {
            "onBeforeStart": function () {
                $('.left-panel .section-actions div:nth-child(4)').click();
            },
            "selector": ".right-panel .actions-results",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "<text style='color:#000'>En cliquant sur un client par exemple, vous pouvez  \
                <br />consulter ses actions à traiter , en cours de traitement ou déjà traitées.<text>"
        }, {
            "selector": ".right-panel .bouton-ajouter-action",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Vous pouvez aussi ajouter une action de nouvelles actions"
        }, {
            "selector": ".complement-panel .step-informations",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "À droite, vous pouvez consulter les informations de votre client selctionné,  <br /> ses TAGs par exemple et aussi télécharger ses informations PARC disponibles par domaine"
        }, {
            "onBeforeStart": function () {
                $('.right-panel.col-xs-6 .panel-heading').click();
            },
            "selector": ".complement-panel .step-commentaires",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Vous pouvez aussi consulter ou créer des notes sur ce même client. <br /> Chaque note créée est partagée avec tous les utilisateurs"
        }, {
            "selector": ".right-panel .tuile-action:nth-child(1)",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Chaque action est représentée par une vignette"
        }, {
            "onBeforeStart": function () {
                $('.right-panel .panel-body:nth-child(1) .tuile-action:nth-child(1) .date-fin button').click();
            },
            "selector": ".right-panel .panel-body:nth-child(1) .tuile-action:nth-child(1) .date-fin",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Des accès rapides vous permettent de changer la date de fin de l’action"
        }, {
            "onBeforeStart": function () {
                $('.right-panel .panel-body:nth-child(1) .tuile-action:nth-child(1).zone-porteur button').click();
            },
            "selector": ".right-panel .panel-body:nth-child(1) .tuile-action:nth-child(1) .zone-porteur",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "De désigner un autre porteur avec un commentaire"
        }, {
            "onBeforeStart": function () {
                $('.right-panel .panel-body:nth-child(1) .tuile-action:nth-child(1) .zone-porteur button').click();
            },
            "selector": ".right-panel .panel-body:nth-child(1) .tuile-action:nth-child(1) .zone-statut",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "De vérifier/ compléter son rattachement aux affaires ou <br /> Consulter les Rdv/CTA rattachés"
        }, {
            "selector": ".left-panel .exporter-button",
            "skipButton": { text: "Terminer" },
            "description": "Vous pouvez exporter à n’importe quel moment vos actions actives sur le trimestre en cours"
        }
    ]
}

// PERFCO - Engagement ambition
//----------------------------

var tuto_perfco_engagementAmbition = {
    id: "{80349903-3fb4-413c-9121-d1879b3a344a}",
    nom: "Saisir ses engagements PO",
    pattern: "perfco/_layouts/15/Orange.EPilot/Pages/PrevisionSaisie.aspx",
    type: "click",
    steps: [
        {
            "selector": ".selection-periode .btn-group button",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "En haut de l’écran un menu déroulant vous permettra <br /> d’accéder aux différentes périodes à saisir ou analyser "
        },
        {
            "onBeforeStart": function () {
                if ($('.titre-consultation h3 span svg').length == 0)
                    enjoyhint_instance.trigger('next');

                $('.com-button-open-top').click();
            },

            "selector": ".titre-consultation h3 span svg",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Sous la période vous pourrez à tout moment <br /> télécharger les données de prévisions et engagements"
        },
        {
            "onBeforeStart": function () {
                if ($('.lien-equipe').length == 0) {
                    enjoyhint_instance.trigger('next');
                } else if ($('.mon-equipe-resultat').length == 0) {
                    $('.lien-equipe').click();
                }
            },
            "selector": ".panel-left .mes-previsions .prevision-titre:first-child",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "En première lecture vous visualiserez toutes les priorités par ordre croissant ce qui vous permettra de : \
                    <br /> - connaître votre engagement et ambition ou celui de votre équipe si vous êtes manager \
                    <br /> - visualiser les données (indicateurs) vous aidant prendre vos décisions \
                    <br /> - saisir ceux que vous déciderez après compréhension des enjeux et possibilités."
        },
        {
            "selector": ".mon-equipe-resultat",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Le chevron vous permettra : \
                <br /> - de comprendre en tant que manager les saisies de chaque \
                <br /> acteur de votre équipe et de les modifier ci-besoin,\
                <br /> <br /> - de faire le point avec chaque vendeur sur ses engagements \
                <br /> et ambitions, de les comprendre et les modifier à la hausse ou à la baisse"
        },
        {
            "selector": ".consolidation .prevision-tab",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Sur la gauche des jauges et indicateurs vous permettront : \
                    <br /> - de visualiser rapidement votre situation sur la PO en cours, \
                    <br /> - de voir où vous en êtes par rapport à vos engagements, ambitions et objectifs \
                    <br /> - et surtout de constater immédiatement l’impact des données saisies"
        },
        {
            "onBeforeStart": function () {
                $('.prevision-titre .vue-par-prio').click();
            },
            "selector": ".consolidation .prevision-tab:nth-child(2)",
            "skipButton": { text: "Terminer" },
            "description": "Dans le total P1/P2/P3/P4 vue par priorité vous permettra \
                     <br /> - de visualiser chaque groupe de priorité individuellement, \
                     <br /> - de voir où vous en êtes par rapport à vos engagements, ambitions et objectifs."
        },
    ]
}

// CAPA - Presentation de gestion de la ventilation
//----------------------------
var tuto_capa_ventilation = {
    id: "{13C74AA5-C6EE-433E-AFDF-215E89C65900}",
    nom: "Ventiler son delta CA",
    pattern: "perfco/_layouts/15/Orange.EPilot/Pages/Ventilation.aspx",
    type: "click",
    steps: [
        {
            "onBeforeStart": function () {
                setTimeout(function () {
                    $("#aide .aide-top-button")[0].click();
                    $("#left-panel .section-actions .ventilation-button")[0].click();
                }, 1000);
            },
            "selector": "#left-panel .section-header",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Cet écran vous permet de compléter et ventiler votre delta CA afin de fiabiliser vos prévisions d’atterrissage en terme de chiffre d’affaire sur le semestre."
        },
        {
            "onBeforeStart": function () {
                $("#left-panel .section-actions > div:last").click();
            },
            "selector": "#left-panel .section-filters",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Cet onglet vous permet de rechercher les lignes d’affaires <br /> sur lesquelles vous souhaitez ventiler du delta CA."
        },
        {
            "onBeforeStart": function () {
                $("#left-panel .section-actions > div:last").click();

                if ($('div.bloc-niveau-1').length == 0)
                    enjoyhint_instance.trigger('next');
                else
                    $('div.bloc-niveau-1')[0].click();
            },
            "selector": "#left-panel .list-items",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Ce volet vous permet de sélectionner les lignes d’affaires <br /> sur lesquelles vous souhaitez ventiler du delta CA.\
                        <br /> Par défaut, un filtre est appliqué sur les lignes d’affaires signées <br /> et perdues sur le mois en cours, le mois précédant et le mois suivant."
        },
        {
            "selector": "#left-panel .section-actions",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Vous pouvez classer ces lignes d’affaires par client, par affaire ou par type de ventilation (automatique, manuelle, non ventilée)."
        },
        {
            "onBeforeStart": function () {
                if ($('#left-panel .sous-bloc-indicateurs').length == 0)
                    enjoyhint_instance.trigger('next');

                if ($("#left-panel .bloc-niveau-3").length != 0)
                    $("#left-panel .bloc-niveau-3 div:first").click();
            },
            "selector": "#left-panel .sous-bloc-indicateurs:first",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Des icônes sont à votre disposition pour identifier en un coup d’œil :\
                            <br /> -	les lignes d’affaires déjà ventilées (en automatique ou en manuel) et celles qui restent à ventiler\
                            <br /> -	Le statut de la ligne d’affaire (en cours, signée, perdue ou abandonnée)."
        },
        {
            "onBeforeStart": function () {
                if ($(".switch .slider.round").length == 0)
                    enjoyhint_instance.trigger('next');

            },
            "selector": ".switch .slider.round",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Une fois la ligne d’affaire sélectionnée, vous pouvez compléter ou modifier la ventilation du delta CA. <br /> \
                Pour passer en mode modification sur une ligne d’affaire ventilée en automatique, il vous suffit de cliquer sur le curseur noir « Automatique/manuel ». <br /> \
                A noter que les lignes d’affaires en statut en cours doivent restées taguées en ventilation « automatique » <br /> \
                afin d’assurer la prise ne compte des modifications faites depuis lina."
        },
        {
            "onBeforeStart": function () {
                if ($("#right-panel .fiche-affaire .panel-body").length == 0)
                    enjoyhint_instance.trigger('next');

            },
            "selector": "#right-panel .fiche-affaire .panel-body",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Vous pouvez ainsi renseigner ou modifier le delta CA global récurrent et non récurrent <br /> \
                            ainsi que le taux de concrétisation et ventiler le delta CA sur les 24 mois qui suivent la date de signature de la ligne d’affaire."
        },
        {
            "onBeforeStart": function () {
                if ($("#left-panel .section-button-add").length == 0)
                    enjoyhint_instance.trigger('next');

            },
            "selector": "#left-panel .section-button-add",
            "event_type": "next",
            "nextButton": { text: "Suivant" },
            "skipButton": { text: "Terminer" },
            "description": "Dans le cas où je souhaite saisir du delta CA sur un client pour lequel je n’ai pas de ligne d’affaire crée dans le CRM, <br />\
                        j’ai la possibilité sur cet écran de le faire très facilement grâce au bouton « Ajouter une ligne hors affaire »."
        },
        {
            "onBeforeStart": function () {
                if ($("#right-panel .section-information").length == 0)
                    enjoyhint_instance.trigger('next');

            },
            "selector": "#right-panel .section-information",
            "skipButton": { text: "Terminer" },
            "description": "Cet encart vous indique quand votre saisie sera impactée dans votre CA prévisionnel au niveau des rapports de pilotage."
        }


    ]
}


var tutoriels = [tuto_perfco_navigation, tuto_perfco_refonteplanaction, tuto_perfco_engagementAmbition, tuto_capa_ventilation, tuto_custom_dashboard];

var playTuto = function (workflow) {
    var tutoService = angular.injector(['ng', 'orangeCommonApp']).get("tutorielService");

    if (workflow && workflow.steps) {
        var enjoyhint_instance = new EnjoyHint({
            onEnd: function onEnd() {
                tutoService.save({ Guid: workflow.id, Nom: workflow.nom });
            },
            onSkip: function onSkip() {
                tutoService.save({ Guid: workflow.id, Nom: workflow.nom });
            }
        });

        enjoyhint_instance.setScript(workflow.steps);
        enjoyhint_instance.runScript();
    }
}

// ==========================================
// INITALISATION
// ==========================================
$(document).ready(function () {
    var tutoService = angular.injector(['ng', 'orangeCommonApp']).get("tutorielService");
    setTimeout(function () {
        tutoriels.forEach(function (tuto) {
            if (document.URL.toString().toLowerCase().indexOf(tuto.pattern.toLowerCase()) !== -1 && tuto.type == "onready") {
                tutoService.avu(tuto.id).then(function (result) {
                    if (result && result.data == false) {
                        playTuto(tuto);
                    }
                });
            }
        });
    }, 2000);
});


