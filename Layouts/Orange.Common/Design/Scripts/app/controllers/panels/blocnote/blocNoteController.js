orangeCommonApp.app.controller('blocNoteController', function blocNoteController($scope, $controller, $rootScope, moduleApp, blocNoteService, userService, statistiqueService, $uibModal) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;
    vm.ActeurConnecte = null;

    //PANEL GLOBAL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'bloc-note';
    vm.Panel.Open = false;
    vm.Panel.IndicateurNotesNonLu = 0;

    //TABS
    vm.Tabs = vm.Tabs || {};
    vm.Tabs.MesNotes = "tabMesNotes";
    vm.Tabs.Equipe = "tabEquipe";
    vm.Tabs.MonManager = "tabMonManager";
    vm.Tabs.Autres = "tabAutre";
    vm.Tabs.Current = vm.Tabs.MesNotes;
    vm.Tabs.Autre = vm.Tabs.Autre || {};
    vm.Tabs.Autre.Favoris = [];

    //FILTRE
    vm.Filtre = vm.Filtre || {};
    vm.Filtre.Text = null;

    //NOTE
    vm.Notes = vm.Notes || {};
    vm.Notes.UtilisateurCodeAlliance = null;
    vm.Notes.UtilisateurDisplayName = null;
    vm.Notes.List = [];
    vm.Notes.ListInternal = [];

    vm.Notes.NouvelleNote = vm.Notes.NouvelleNote || {};
    vm.Notes.NouvelleNote.IsOpened = false;
    vm.Notes.NouvelleNote.Current = {
        Titre: null,
        Texte: null,
        CodeDestinataire: null
    }
    vm.Notes.NouvelleNote.Acteur = null;

    vm.Notes.ModificationForm = vm.Notes.ModificationForm || {};
    vm.Notes.ModificationForm.IndexToEdit = -9;
    vm.Notes.TailleTexteReduit = 100;

    //COMMENTAIRES
    vm.Commentaires = vm.Commentaires || {};


    $controller('displayTopController', {
        $scope: vm
    });


    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    // PANEL
    vm.Panel.Display = function () {
        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open)
            vm.Notes.Load();

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture bloc note");
        }
    }

    //TABS
    vm.Tabs.Autre.Init = function () {
        blocNoteService.getAllFavoris().then(function (result) {
            vm.Tabs.Autre.Favoris = result.data;
        });
    }

    vm.Tabs.Autre.SearchUser = function (searchInput) {
        if (!searchInput) {
            return [];
        }

        return userService.getAllUsers(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.Tabs.Autre.Select = function (item) {
        if (item) {
            var exist = false;
            vm.Tabs.Autre.Favoris.forEach(function (fav) {
                if (fav.FavorisCodeAlliance == item.CodeAlliance) { exist = true; }
            });

            if (exist)
            {
                alert('L utilsateur est déja dans vos favoris.');
                vm.Tabs.Autre.selectedItem = null;
            }
            else {
                var favori = {
                    CodeAlliance: item.CodeAlliance,
                    FavorisCodeAlliance: item.CodeAlliance
                }

                blocNoteService.saveFavoris(favori).then(function (result) {
                    vm.Tabs.Autre.selectedItem = null;
                    vm.Tabs.Autre.Init();
                    vm.Notes.Load(vm.Tabs.Autres, item.CodeAlliance, item.NomPrenom);

                });

            }

        }
    }

    vm.Tabs.Autre.Delete = function (id) {
            blocNoteService.deleteFavoris(id).then(function (result) {
                vm.Tabs.Autre.Init();
            });
    }

    //FILTRE
    vm.Filtre.Search = function () {
        if (!vm.Filtre.Text) {
            vm.Notes.List = angular.copy(vm.Notes.ListInternal);
            return;
        }

        if (vm.Filtre.Text.length < 2) {
            return;
        }

        let tempNote = [];
        vm.Notes.ListInternal.forEach(function (note) {
            let date = moment(note.Date).format('DD/MM/YYYY');

            if (note.Titre.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || note.Texte.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || note.NomPrenomCreateur.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || note.NomPrenomDestinataire.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || date.toLowerCase().includes(vm.Filtre.Text.toLowerCase()))
                tempNote.push(note);
        });

        vm.Notes.List = tempNote;
    }

    //NOUVELLE NOTE
    vm.Notes.NouvelleNote.Display = function () {
        vm.Notes.NouvelleNote.IsOpened = true;
    }

    vm.Notes.NouvelleNote.Save = function (noteForm) {
        if (!noteForm.$valid) {
            return;
        }

        vm.Notes.NouvelleNote.Current.CodeDestinataire = vm.Notes.UtilisateurCodeAlliance ? vm.Notes.UtilisateurCodeAlliance : null;
        vm.Notes.NouvelleNote.Current.Texte = vm.formatTexteToHtml(vm.Notes.NouvelleNote.Current.Texte);

        blocNoteService.save(vm.Notes.NouvelleNote.Current)
            .then(function success(result) {
                vm.Notes.Load(vm.Tabs.Current, vm.Notes.UtilisateurCodeAlliance, vm.Notes.UtilisateurDisplayName );
                vm.Notes.NouvelleNote.Reset(noteForm);
            });
    }

    vm.Notes.NouvelleNote.Reset = function (noteForm) {
        vm.Notes.NouvelleNote.Current = {
            Titre: null,
            Texte: null,
            CodeDestinataire: null
        }
        vm.Notes.NouvelleNote.IsOpened = false;
        noteForm.$setPristine();
        noteForm.$setUntouched();
    }

    //NOTE
    vm.Notes.Load = function (panel, codeAlliance, displayName) {
        
        vm.Notes.ModificationForm.IndexToEdit = -9;

        panel = !panel ? vm.Tabs.MesNotes: panel;
        vm.Tabs.Current = panel;

        if (panel == vm.Tabs.MesNotes) {
            vm.Notes.UtilisateurCodeAlliance = vm.Notes.UtilisateurCodeAlliance = null;
        }
        else if (panel == vm.Tabs.MonManager)
        {
            vm.Notes.UtilisateurCodeAlliance = vm.ActeurConnecte.ManagerCode;
        }
        else {
            vm.Notes.UtilisateurCodeAlliance = codeAlliance;
            vm.Notes.UtilisateurDisplayName = displayName;
        }

        blocNoteService.getAll(panel,vm.Notes.UtilisateurCodeAlliance).then(function (result) {
            result.data.forEach(function (item) {
                item.Limite = vm.Notes.TailleTexteReduit;
            });

            vm.Notes.ListInternal = result.data;
            vm.Notes.List = angular.copy(vm.Notes.ListInternal);

            if (vm.Filtre.Text) {
                vm.Filtre.Search();
            }
        });
    }

    vm.Notes.Delete = function (id, index) {
        if (!vm.Notes.List[index].PeutModifier)
            return;

        blocNoteService.delete(id).then(function (result) {
            vm.Notes.List.splice(index, 1);

            var nwIndex = 0;
            for (var i = 0; i < vm.Notes.ListInternal.length; i++) {
                if (vm.Notes.ListInternal[i].Id == id) {
                    nwIndex = i;
                    break;
                }
            }
            vm.Notes.ListInternal.splice(nwIndex, 1);
        });
    }

    vm.Notes.EnSavoirPlus = function (index) {
        if (vm.Notes.List[index].Limite != vm.Notes.TailleTexteReduit)
            return;

        vm.Notes.List.forEach(function (item) {
            item.Limite = vm.Notes.TailleTexteReduit;
        });

        vm.Notes.List[index].Limite = 1200;
        vm.Commentaires.Get(vm.Notes.List[index]);

        if (!vm.Notes.List[index].Lu) {
            blocNoteService.read(vm.Notes.List[index].Id).then(function (item) {
                vm.Notes.List[index].Lu = true;
                vm.Notes.ListInternal[index].Lu = true;
                //vm.Panel.IndicateurNotesNonLu--;

                vm.Panel.IndicateurNotesNonLu=item.data;
            });
        }
    }

    vm.Notes.ModificationForm.Open = function (index) {
        if (!vm.Notes.List[index].PeutModifier)
            return;

        // Remise en forme du texte de la note précedente
        if (vm.Notes.List[vm.Notes.ModificationForm.IndexToEdit]) {
            vm.Notes.List[vm.Notes.ModificationForm.IndexToEdit].Texte = vm.formatTexteToHtml(vm.Notes.List[index].Texte);
        }
        // Modification de la mise en forme de la note à modifier
        vm.Notes.List[index].Texte = vm.formatTexteToInput(vm.Notes.List[index].Texte);
        vm.Notes.ModificationForm.IndexToEdit = index;
    }

    vm.Notes.ModificationForm.Save = function (index) {
        vm.Notes.List[index].Texte = vm.formatTexteToHtml(vm.Notes.List[index].Texte);
        blocNoteService.save(vm.Notes.List[index])
           .then(function success(result) {

               for (var i = 0; i < vm.Notes.ListInternal.length; i++) {
                   if (vm.Notes.ListInternal[i].Id == vm.Notes.List[index].Id) {
                       vm.Notes.ListInternal[i].Texte = vm.Notes.List[index].Texte;
                   }
               }
              
               vm.Notes.ModificationForm.IndexToEdit = -9;
           });
    }

    vm.Notes.ModificationForm.Cancel = function (index) {
        vm.Notes.List[index].Texte = vm.formatTexteToHtml(vm.Notes.List[index].Texte);
        vm.Notes.ModificationForm.IndexToEdit = -9;
    }

    // COMMENTAIRES
    vm.Commentaires.ChangeToRead = function(commentaire){
        commentaire.Lu = true;
    }
    vm.Commentaires.Save = function (index) {
        if (!vm.Notes.List[index].Commentaires) {
            vm.Notes.List[index].Commentaires = [];
        }

        if (!vm.Notes.List[index].Commentaire)
            return;

        var commentaire = {
            IdNote: vm.Notes.List[index].Id,
            Texte: vm.Notes.List[index].Commentaire,
        }

        blocNoteService.saveCommentaire(commentaire).then(function (result) {
            vm.Notes.List[index].Commentaires = result.data;
            vm.Notes.List[index].NombreCommentaires++;
        });

        // RAZ du champs où on stocke le commentaire à créer.
        vm.Notes.List[index].Commentaire = null;

        vm.Commentaires.AffecterNoteSource(vm.Notes.List[index].Id, vm.Notes.List[index].Commentaires);
    }

    vm.Commentaires.AffecterNoteSource = function (id, commentaires) {
        // On affiche la liste Notes.List pour les filtres, ne pas oublier de recharcher les commentaires sur la liste originale jamais filtrée

        vm.Notes.ListInternal.forEach(function (item) {
            if (item.Id == id) {
                item.Commentaires = commentaires;
            }
        });
    }

    vm.Commentaires.Get = function (note) {
        blocNoteService.getAllCommentaires(note.Id).then(function (result) {
            note.Commentaires = result.data;
            vm.Commentaires.AffecterNoteSource(note.Id, note.Commentaires);

            blocNoteService.readCommentaire(note.Id).then(function (result) {
                // Enleve le nombre de commentaires non lus de la bulle de notification.
                vm.Panel.IndicateurNotesNonLu = vm.Panel.IndicateurNotesNonLu - note.NombreCommentairesNonLus;
                note.NombreCommentairesNonLus = 0;
            });
        });
    }

    vm.Commentaires.Delete = function (indexNote, indexCommentaire) {
        var note = vm.Notes.List[indexNote];
        var commentaire = note.Commentaires[indexCommentaire];

        blocNoteService.deleteCommentaire(commentaire.Id).then(function (result) {
            note.Commentaires.splice(indexCommentaire, 1);
            note.NombreCommentaires--;

            vm.Notes.ListInternal.forEach(function (item) {
                var cpt = 0;
                if (item.Id == note.Id) {
                    for(var i=0; i<item.Commentaires.length; i++) {
                        if (item.Commentaires[i].Id == commentaire.Id) {
                            cpt = i;
                            break;
                        }
                    }
                    item.Commentaires = note.Commentaires;
                    return;
                }
            });

        });
    }

    //FORMAT
    vm.formatTexteToHtml = function (texte) {
        return texte.replace(/\r?\n/g, '<br />');
    }

    vm.formatTexteToInput = function (texte) {
        return texte.replace(/<br \/>/g, '\n')
    }

    vm.formatDestinataire = function (item) {
        if (!item)
            return "";
        if (item.indexOf(",") > 0)
            return "son équipe";

        return item;
    }

    //SCROLLBAR
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // WATCH
    // ==========================================

    // Gestion des acteurs
    $scope.$watch(
        function () {
            return sessionStorage.getItem("Epilot.Perfco.Actor");
        },
        function (newVal, oldVal) {
            vm.ActeurConnecte = JSON.parse(newVal);
        }, true);

    vm.jouerTutorielVideo = function () {
        //Ouverture de la modale video
        var detailModal = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/aide/aide-video.html?version=EPilotCurrentVersion',
            controller: 'aideVideoPopupController',
            controllerAs: 'vm',
            resolve: {
                videoTitre: function () { return 'Sirtaki'; },
                videoUrl: function () { return '/SiteCollectionDocuments/tuto8.mp4' },
                videoDuree: function () { return 'Trop long !!!'; }
            }
        });
    }

    // ==========================================
    // INIT
    // ==========================================

    vm.initializePage = function () {
        blocNoteService.count().then(function (result) {
            vm.Panel.IndicateurNotesNonLu = result.data;
        });

        vm.Tabs.Autre.Init();
    }

    vm.initializePage();
});