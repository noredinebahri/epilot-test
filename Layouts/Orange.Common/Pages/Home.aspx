<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="Orange.EPilot.Layouts1.Orange.EPilot.Home" DynamicMasterPageFile="~masterurl/default.master" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div ng-app="orangeCommonApp" data-position="extended">
        <div id="home-nav" ng-controller="homeNavController as rc">
            <div>
                <h2 class="orange nav-home-title">Bienvenue sur Epilot</h2>
                <ul class="home-tiles row">
                    <asp:ListView ID="lvHomeGlobalNavigation" runat="server">
                        <ItemTemplate>
                            <li class="col-md-3">
                                <div style="background-color: <%# Eval("ColorCode") %>; color: <%# Eval("ColorCode")%>; border: 2px solid <%# Eval("ColorCode")%>;">
                                    <a id="<%# Eval("Name")%>" href="<%# Eval("Url")%>" target="_top" class="navTile">
                                        <div class="navTile-background">
                                            <p>
                                                <i class="<%# Eval("IconFont")%>"></i>
                                                <span>
                                                    <%# Eval("Title")%>
                                                </span>
                                            </p>

                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ItemTemplate>
                    </asp:ListView>
                </ul>
            </div>
            <div class="home-recherche-client" id="home-recherche-client" style="margin-top: 20px;">
                <h2 class="orange nav-home-title">Recherche Fiches</h2>

                <div class="nav-section-main">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="recherche-client-toggle-view" style="margin-top: 0px !important;">
                                <div class="toggle-view-left" ng-class="{ 'active' : rc.isClient }" ng-click="rc.toggleBtn(1)">
                                    Client
                                </div>
                                <div class="toggle-view-middle" ng-class="{ 'active' : rc.isActeur }" ng-click="rc.toggleBtn(2)">
                                    Acteur
                                </div>
                                <div class="toggle-view-right" ng-class="{ 'active' : rc.isProduit }" ng-click="rc.toggleBtn(3)">
                                    Produit
                                </div>
                            </div>

                        </div>
                        <div class="col-md-4" ng-if="rc.isClient">
                            <input type="text" ng-model="rc.siren"
                                ng-change="rc.onChange();"
                                class="form-control form-control-standard"
                                placeholder="Selectionner un client"
                                uib-typeahead="item as item.Libelle for item in rc.searchClient($viewValue)"
                                typeahead-editable="false"
                                typeahead-on-select="rc.onSelect($item, $model, $label)"
                                typeahead-min-length="3" required>
                        </div>
                        <div class="col-md-4" ng-if="rc.isActeur && !rc.isVendeur">
                            <input type="text" ng-model="rc.selectedActeur"
                                ng-change="rc.onChangeActeur();"
                                class="form-control form-control-standard"
                                placeholder="Selectionner un acteur"
                                uib-typeahead="item as item.NomActeur for item in rc.searchActeur($viewValue)"
                                typeahead-editable="false"
                                typeahead-on-select="rc.onSelectActeur($item, $model, $label)"
                                typeahead-min-length="3" required>
                        </div>
                        <div class="col-md-4" ng-if="rc.isActeur && rc.isVendeur">
                            Votre fiche acteur est disponible dans le menu
                        </div>
                        <div class="col-md-4" ng-if="rc.isProduit">
                            <input type="text" ng-model="rc.selectedProduit"
                                ng-change="rc.onChangeProduit();"
                                class="form-control form-control-standard"
                                placeholder="Selectionner un produit"
                                uib-typeahead="item as item.NomProduit for item in rc.searchProduit($viewValue)"
                                typeahead-editable="false"
                                typeahead-on-select="rc.onSelectProduit($item, $model, $label)"
                                typeahead-min-length="3" required>
                        </div>



                        <div class="col-md-1" ng-if="rc.isClient && rc.siren">
                            <span ng-init="popoverOpened=false" ng-mouseover="popoverOpened=true" ng-mouseleave="popoverOpened=false">
                                <span uib-popover-template="'client-info.html'"
                                    popover-trigger="none"
                                    popover-placement="left"
                                    popover-is-open="popoverOpened">
                                    <a href><i class="fas fa-info-circle" style="font-size: 26px; color: black;"></i></a>
                                </span>
                            </span>
                        </div>

                        <div class="col-md-1" ng-if="rc.isActeur && rc.selectedActeur">
                            <span ng-init="popoverOpened=false" ng-mouseover="popoverOpened=true" ng-mouseleave="popoverOpened=false">
                                <span uib-popover-template="'acteur-info.html'"
                                    popover-trigger="none"
                                    popover-placement="left"
                                    popover-is-open="popoverOpened">
                                    <a href><i class="fas fa-info-circle" style="font-size: 26px; color: black;"></i></a>
                                </span>
                            </span>
                        </div>

                        <div class="col-md-1" ng-if="rc.isProduit && rc.selectedProduit">
                            <span ng-init="popoverOpened=false" ng-mouseover="popoverOpened=true" ng-mouseleave="popoverOpened=false">
                                <span uib-popover-template="'produit-info.html'"
                                    popover-trigger="none"
                                    popover-placement="left"
                                    popover-is-open="popoverOpened">
                                    <a href><i class="fas fa-info-circle" style="font-size: 26px; color: black;"></i></a>
                                </span>
                            </span>
                        </div>


                        <div class="col-md-4" ng-if="rc.isClient && rc.siren" style="display: inline-flex;">
                            <div class="rch-btn-wrapper" style="margin-right: 20px;">
                                <a class="btn btn-orange-default" href="#" ng-click="rc.openFicheClient()" ng-disabled="!rc.isClientNew">Fiche Client (HORS CA)
                                </a>
                            </div>
                            <div class="rch-btn-wrapper">
                                <a class="btn btn-orange-default" href="#" ng-click="rc.openCaParc()" ng-disabled="!rc.isCapa">Fiche Client (CA)
                                </a>
                            </div>

                        </div>

                        <div class="col-md-4 recherche-acteur-result" ng-if="rc.isActeur && rc.selectedActeur" style="display: inline-flex;">
                            <div class="rch-btn-wrapper" style="margin-right: 10px;">
                                <a class="btn btn-orange-default" href="#" ng-click="rc.openFicheActeur()" ng-disabled="!rc.selectedActeur">Fiche Acteur
                                </a>
                            </div>

                            <div class="rch-btn-wrapper" style="margin-right: 10px;">
                                <a class="btn btn-orange-default" href="#" ng-click="rc.openBenchClient()" ng-disabled="!rc.selectedActeur">Bench Client
                                </a>
                            </div>
                            <div class="rch-btn-wrapper">
                                <a class="btn btn-orange-default" href="#" ng-click="rc.openBenchVendeur()" ng-disabled="!rc.selectedActeur">Bench Vendeur
                                </a>
                            </div>
                        </div>

                        <div class="col-md-4 recherche-produit-result" ng-if="rc.isProduit && rc.selectedProduit">
                            <div class="rch-btn-wrapper">
                                <a class="btn btn-orange-default" href="#" ng-click="rc.openFicheProduit()" ng-disabled="!rc.selectedProduit">Fiche Produit
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="home-favorites">
                 <div ng-repeat="bloc in rc.listBlocs">
                    <h2 class="orange nav-home-title">{{bloc.Libelle}}</h2>
                    <ul class="row">
                        <li class="col-md-3" ng-repeat="item in rc.listBlocsItems" ng-if="bloc.Id ==item.IdBloc">
                            <div ng-attr-style="background-color: {{item.Couleur}}">
                                <a href="{{item.Lien}}" target="_blank">
                                    <span>
                                        <i class="{{item.Icone}}"></i>
                                        <span>{{item.Libelle}}
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>

<%--                <div>
                    <h2 class="orange nav-home-title">Liens utiles</h2>
                    <ul class="row">
                        <li class="col-md-3">
                            <div class="green-background-color">
                                <a href="{{rc.baseUrl+ '/perfco/Pages/Placement.aspx'}}" target="_blank">
                                    <span>
                                        <i class="fa fa-tachometer-alt"></i>
                                        <span>Rapport placement
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                        <li class="col-md-3">
                            <div class="orange-background-color">
                                <a href="{{rc.baseUrl+ '/perfco/Pages/RapportCouverture.aspx'}}" target="_blank">
                                    <span>
                                        <i class="fa fa-rocket"></i>
                                        <span>Rapport couverture
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                        <li class="col-md-3">
                            <div class="blue-background-color">
                                <a href="{{rc.baseUrl+ '/perfco/_layouts/15/Orange.EPilot/Pages/CustomDashboard.aspx'}}" target="_blank">
                                    <span>
                                        <i class="fa fa-columns"></i>
                                        <span>Dashboard personnalisé
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                        <li class="col-md-3">
                            <div class="green-background-color">
                                <a href="{{rc.baseUrl+ '/tps/_layouts/15/Orange.TPS/Pages/Utilisateur/Dashboard.aspx'}}" target="_blank">
                                    <span>
                                        <i class="fa fa-home"></i>
                                        <span>Dashboard tps
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
                <div style="margin-top: 30px;">
                    <h2 class="orange nav-home-title">Vie de solution</h2>
                    <ul class="row">
                        <li class="col-md-3">
                            <div class="red-background-color">
                                <a href="#">
                                    <span>
                                        <i class="fa fa-bell"></i>
                                        <span>Alertes
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                        <li class="col-md-3">
                            <div class="purple-background-color">
                                <a href="#">
                                    <span>
                                        <i class="fas fa-newspaper"></i>
                                        <span>Modes op / Tutoriels
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                        <li class="col-md-3">
                            <div class="blue-background-color">
                                <a href="#">
                                    <span>
                                        <i class="fa fa-podcast"></i>
                                        <span>Webinars
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </li>
                    </ul>

                </div>--%>
            </div>

        </div>
    </div>

    <script type="text/ng-template" id="client-info.html">
                    <div ng-if="rc.isClient" style="width:450px;">
                        <div class="recherche-client-details" ng-if="rc.siren">
                            <h4>Détails Client</h4>
                            <ul>
                                <li>
                                    <b>AE</b> <span>{{rc.client.CodeAgence}}</span>
                                </li>
                                <li ng-if="rc.acteur.CodeDv !== '-1'">
                                    <b>DV</b> <span>{{rc.client.CodeDv}}</span>
                                </li>
                                <li ng-if="rc.client.CodeRdv !== '-1'">
                                    <b>RDV</b> <span>{{rc.client.CodeRdv}}</span>
                                </li>
                                <li>
                                    <b>Segment client</b> <span>{{rc.client.SegmentClient}}</span>
                                </li>
                            </ul>
                        </div>

                        <h1 style="color: grey !important">Parc <span style="color: grey !important; font-size: 16px">(source CAP)</span></h1>

                        <div id="recherche-client-parc-not-exist" ng-if="rc.parcNotExist">Données PARC non identifiées</div>

                        <div class="row" style="padding: 20px; padding-bottom: 0px;" ng-if="rc.domaines.length > 0">
                            <ul class="nav nav-pills col-xs-6">
                                <li class="recherche-client-domaine-element" ng-class="{active : $first}" ng-repeat="domaine in rc.domaines">
                                    <a class="recherche-client-domaine-result" href="#Tab_{{domaine.Id}}" data-toggle="tab">{{domaine.Domaine}}
                                    <span ng-click="rc.export(domaine.Id)" id="export-button">
                                        <i class="fas fa-download"></i>
                                    </span>
                                    </a>
                                </li>
                            </ul>

                            <div class="tab-content parc-list clearfix col-xs-6">
                                <div class="tab-pane" ng-class="{active : $first}"
                                    id="Tab_{{domaine.Id}}" ng-repeat="domaine in rc.domaines">
                                    <ul style="padding: 0;">
                                        <li ng-repeat="offre in domaine.Offres">
                                            <span>{{offre}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h1 style="color: grey !important; margin-top: 0px;" ng-if="rc.siren">Source PMD</h1>

                        <div class="btn-action" ng-click="rc.openPmdLink()" ng-if="rc.siren">
                            <a href="#">
                                <img src="/_layouts/15/Orange.Common/Design/Images/pmd_link.png" style="width: 100px; height: 100px;" />
                            </a>
                        </div>
                    </div>
    </script>

    <script type="text/ng-template" id="acteur-info.html">
                    <div class="recherche-acteur-result" ng-if="rc.isActeur && rc.selectedActeur">
                        <h4>Détails vendeur</h4>
                        <ul>
                            <li>
                                <b>AE</b> <span>{{rc.acteur.CodeAgence}}</span>
                            </li>
                            <li ng-if="rc.acteur.NomDv !== '-1'">
                                <b>DV</b> <span>{{rc.acteur.NomDv}}</span>
                            </li>
                            <li ng-if="rc.acteur.NomRdv !== '-1'">
                                <b>RDV</b> <span>{{rc.acteur.NomRdv}}</span>
                            </li>
                            <li>
                                <b>FONCTION</b> <span>{{rc.acteur.CodeFonction}}</span>
                            </li>
                        </ul>
                    </div>
    </script>

    <script type="text/ng-template" id="produit-info.html">
                    <div class="recherche-produit-result" ng-if="rc.isProduit && rc.selectedProduit">
                        <h4>Détails produit</h4>
                        <ul>
                            <li>
                                <b>Domaine CA</b> <span>{{rc.produit.DomaineCa}}</span>
                            </li>
                            <li>
                                <b>Sous Domaine CA</b> <span>{{rc.produit.SousDomaineCa}}</span>
                            </li>
                            <li>
                                <b>RC/CB</b> <span>{{rc.produit.RcCb}}</span>
                            </li>
                            <li>
                                <b>Domaine</b> <span>{{rc.produit.Domaine}}</span>
                            </li>
                            <li>
                                <b>Sous objectif</b> <span>{{rc.produit.SousObjectif}}</span>
                            </li>
                        </ul>
                    </div>
    </script>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    Accueil
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Accueil
</asp:Content>
