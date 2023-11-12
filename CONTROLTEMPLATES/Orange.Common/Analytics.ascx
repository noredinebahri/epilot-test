<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Analytics.ascx.cs" Inherits="Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot.Analytics" %>



        <!--  Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js"></script>
        <script>
            if (googleAnalyticsKey) {
                var userService = angular.injector(['ng', 'orangeCommonApp']).get("userService");

                var userPopulation = userService.getCurrent().PopulationLibelle;
                var userFonction = userService.getCurrent().FonctionCode;
                var userAgence = userService.getCurrent().AgenceLibelle;
                var url = window.location.pathname;
                window.dataLayer = window.dataLayer || [];

                function gtag() { dataLayer.push(arguments); }

                gtag('js', new Date());
                gtag('config', googleAnalyticsKey);

                gtag('event',
                    userPopulation, {
                        'event_category': 'Population',
                        'event_label': userPopulation
                    });
                gtag('event',
                    userFonction, {
                        'event_category': 'Fonction',
                        'event_label': userFonction
                    });
                gtag('event',
                    url, {
                        'event_category': 'URL',
                        'event_label': url
                    });
                gtag('event',
                    userAgence, {
                        'event_category': 'Agence',
                        'event_label': userAgence
                    });
                gtag('send', 'pageview');
            }
        </script>
