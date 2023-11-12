<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserPermission.aspx.cs" Inherits="Orange.EPilot.Layouts.Orange.EPilot.Pages.UserPermission" DynamicMasterPageFile="~masterurl/default.master" %>

<%@ Register TagPrefix="wssuc" TagName="InputFormSection" Src="~/_controltemplates/15/InputFormSection.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="InputFormControl" Src="~/_controltemplates/15/InputFormControl.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="ButtonSection" Src="~/_controltemplates/15/ButtonSection.ascx" %>
<%@ Register TagPrefix="wssawc" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript">
        $("#iframe_user .com-topnav-alerts").remove();
    </script>
    <style type="text/css">
        input[type=text] {
            min-width: 400px;
        }
       table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even){background-color: #f2f2f2}

        th {
            background-color: #4CAF50;
            color: white;
        }
    </style>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <asp:Label runat="server" ID="lblErrorMessage" Visible="false"></asp:Label>


    
   <table border="0" cellspacing="0" cellpadding="0">
       <tr style="vertical-align:bottom;">
           <td style="width:400px;">     
               <wssawc:ClientPeoplePicker
                Required="true"
                ValidationEnabled="true"
                ID="peoplePicker"
                runat="server"
                InitialHelpText="<%$Resources:wss,aclinv_PickerIntialHelperText%>"
                VisibleSuggestions="3"
                Rows="1"
                AllowMultipleEntities="false"
                CssClass="ms-long ms-spellcheck-true" />
           </td>
           <td><asp:Button runat="server" class="ms-ButtonHeightWidth" Text="Rechercher"  OnClick="btnRecherche_Click" id="btnRecherche" accesskey="<%$Resources:wss,okbutton_accesskey%>" /></td>
       </tr>
   </table>
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
        <asp:Literal ID="permissionContainer" runat="server"></asp:Literal>
    </table>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    EPilot - Permissions d'un utilisateur
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    EPilot - Permissions d'un utilisateur
</asp:Content>