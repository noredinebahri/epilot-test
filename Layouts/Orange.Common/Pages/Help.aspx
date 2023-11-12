<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Help.aspx.cs" Inherits="Orange.EPilot.Layouts.Orange.EPilot.Pages.Help" DynamicMasterPageFile="~masterurl/default.master" %>

<%@ Register TagPrefix="wssuc" TagName="InputFormSection" Src="~/_controltemplates/15/InputFormSection.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="InputFormControl" Src="~/_controltemplates/15/InputFormControl.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="ButtonSection" Src="~/_controltemplates/15/ButtonSection.ascx" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
         <wssuc:InputFormSection runat="server" Title="Version EPilot" Description="Version de l'application EPilot. (Version Web)">
            <template_inputformcontrols>
			    <tr>
                    <td>
                        <asp:Label ID="lblVersion" runat="server"  />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="Cache de données" Description="Aide à vider le cache de navigateur pour réinitialiser les données WebAPI sauvegardées">
            <template_inputformcontrols>
			    <tr>
                    <td>
                        <asp:Button ID="Button_ClearCache" runat="server" UseSubmitBehavior="false" Text="Vider le cache WebAPI" CssClass="btn"
                            OnClientClick="localStorage.clear(); alert('Le cache de navigateur est réinitialisé'); return false;" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>
    </table>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    Aide
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Aide
</asp:Content>