﻿<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AnalyticsConfig.aspx.cs" Inherits="Orange.EPilot.Layouts.Orange.EPilot.Pages.AnalyticsConfig" DynamicMasterPageFile="~masterurl/default.master" %>

<%@ Register TagPrefix="wssuc" TagName="InputFormSection" Src="~/_controltemplates/15/InputFormSection.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="InputFormControl" Src="~/_controltemplates/15/InputFormControl.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="ButtonSection" Src="~/_controltemplates/15/ButtonSection.ascx" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <asp:Label runat="server" ID="lblErrorMessage" Visible="false"></asp:Label>
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
        <wssuc:InputFormSection runat="server" Collapsible="true"  Title="GoogleAnalytics" Description="Clé de configuration Google Analytics (ex : UA-11111111-1">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtGoogleAnalytics"></asp:TextBox>
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>
       
        <wssuc:ButtonSection runat="server">
            <template_buttons>
		        <asp:Button runat="server" class="ms-ButtonHeightWidth" OnClick="btnOk_Click" Text="<%$Resources:wss,multipages_okbutton_text%>" id="btnOk" accesskey="<%$Resources:wss,okbutton_accesskey%>" />
	        </template_buttons>
        </wssuc:ButtonSection>
    </table>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    Configuration des statistiques
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Configuration des statistiques
</asp:Content>