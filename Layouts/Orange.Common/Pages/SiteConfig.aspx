<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SiteConfig.aspx.cs" Inherits="Orange.EPilot.Layouts.Orange.EPilot.Pages.DataBaseConfig" DynamicMasterPageFile="~masterurl/default.master" %>

<%@ Register TagPrefix="wssuc" TagName="InputFormSection" Src="~/_controltemplates/15/InputFormSection.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="InputFormControl" Src="~/_controltemplates/15/InputFormControl.ascx" %>
<%@ Register TagPrefix="wssuc" TagName="ButtonSection" Src="~/_controltemplates/15/ButtonSection.ascx" %>

<asp:content id="PageHead" contentplaceholderid="PlaceHolderAdditionalPageHead" runat="server">
    <style type="text/css">
        input[type=text] {
            min-width: 400px;
        }
    </style>
</asp:content>

<asp:content id="Main" contentplaceholderid="PlaceHolderMain" runat="server">
    <asp:Label runat="server" ID="lblErrorMessage" Visible="false"></asp:Label>
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
            <td><h3>WebService</h3></td>
        </tr>
        <tr>
           <wssuc:InputFormSection runat="server" Title="EPilot WebApi Url" Description="Url du service web EPilot">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtEPilotWSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorEPilotWSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtEPilotWSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVV WebApi Url" Description="Url du service web PVV">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVVWSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPVVWSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPVVWSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAParc WebApi Url" Description="Url du service web Ca&Parc">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtCaParcWSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorCaParcWSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtCaParcWSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

            <wssuc:InputFormSection runat="server" Title="TPS WebApi Url" Description="Url du service web TPS">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtTPSWSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorTPSWSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtTPSWSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>
        <wssuc:InputFormSection runat="server" Title="DRCE - PVC WebApi Url" Description="Url du service web DRCE - PVC">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtDRCEPVCWSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorDRCEPVCWSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtDRCEPVCWSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>


        </tr>
       <tr>
           <td><h3>PVV</h3></td>
       </tr>
        <wssuc:InputFormSection runat="server" Title="PVV Fiche Objectif SSRS Rapport Url" Description="Url du rapport SSRS de la fiche objectif">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVVFicheSSRSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPVVFicheSSRSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPVVFicheSSRSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVV Fiche Realise SSRS Rapport Url" Description="Url du rapport SSRS de la fiche realise">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVVFicheRealiseSSRSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPVVFicheRealiseSSRSUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPVVFicheRealiseSSRSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>
        

        <wssuc:InputFormSection runat="server" Title="PVV Fiche évolution rémunération SSRS Rapport Url" Description="Url du rapport SSRS de la fiche évolution rémunération">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVVFicheEvolutionRemunerationUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPVVFicheEvolutionRemunerationUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPVVFicheEvolutionRemunerationUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVV Fiche Objectif Library Url" Description="Chemin vers la bibliothèque d'historisation des fichiers fiche objectif">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVVFicheLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPVVFicheLibraryUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPVVFicheLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVV Fiche Realise Library Url" Description="Chemin vers la bibliothèque d'historisation des fichiers fiche realises">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVVFicheRealiseLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPVVFicheRealiseLibraryUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPVVFicheRealiseLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

       <tr>
              <td><h3>PVC</h3></td>
       </tr>
        <wssuc:InputFormSection runat="server" Title="PVC Fiche Objectif SSRS Rapport Url" Description="Url du rapport SSRS de la fiche objectif">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVCFicheSSRSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator11" runat="server" ErrorMessage="*" ControlToValidate="txtPVCFicheSSRSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVC Fiche Realise SSRS Rapport Url" Description="Url du rapport SSRS de la fiche realise">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVCFicheRealiseSSRSUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator21" runat="server" ErrorMessage="*" ControlToValidate="txtPVCFicheRealiseSSRSUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>
        

        <wssuc:InputFormSection runat="server" Title="PVC Fiche évolution rémunération SSRS Rapport Url" Description="Url du rapport SSRS de la fiche évolution rémunération">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVCFicheEvolutionRemunerationUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator31" runat="server" ErrorMessage="*" ControlToValidate="txtPVCFicheEvolutionRemunerationUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVC Fiche Objectif Library Url" Description="Chemin vers la bibliothèque d'historisation des fichiers fiche objectif">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVCFicheLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator41" runat="server" ErrorMessage="*" ControlToValidate="txtPVCFicheLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="PVC Fiche Realise Library Url" Description="Chemin vers la bibliothèque d'historisation des fichiers fiche realises">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPVCFicheRealiseLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator51" runat="server" ErrorMessage="*" ControlToValidate="txtPVCFicheRealiseLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

         <tr>
            <td><h3>CAP</h3></td>
        </tr>
        <tr>

        <wssuc:InputFormSection runat="server" Title="CAP Admin - Ciblage template URL" Description="Chemin du fichier modèle utilisé pour les ciblages">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtCiblageTemplateUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorCiblageTemplateUrl" runat="server" ErrorMessage="*" ControlToValidate="txtCiblageTemplateUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAP Admin -Portefeuille template URL" Description="Chemin du fichier modèle utilisé pour les portefeuilles">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPortfolioTemplateUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPortfolioTemplateUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPortfolioTemplateUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAP Admin -Hierarchy template URL" Description="Chemin du fichier modèle utilisé pour les hiérarchies">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtHierarchyTemplateUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorHierarchyTemplateUrl" runat="server" ErrorMessage="*" ControlToValidate="txtHierarchyTemplateUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAP Admin -Portefeuille import files storage URL" Description="Chemin vers le répertoire désigné pour stocker les fichiers d'import">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtPortefeuilleSharePointLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatortPortfolioImportFolderUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPortefeuilleSharePointLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAP Admin - Ciblage import library URL" Description="Chemin vers la bibliothèque d'historisation des fichiers d'import ciblage">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtCiblageImportLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorCiblageImportLibraryUrl" runat="server" ErrorMessage="*" ControlToValidate="txtCiblageImportLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAP Admin - Ciblage reference document library URL" Description="Chemin vers la bibliothèque d'historisation des documents de référence">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtCiblageRefDocImportLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorCiblageRefDocImportLibraryUrl" runat="server" ErrorMessage="*" ControlToValidate="txtCiblageRefDocImportLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="CAP Admin - Hiérarchie document library URL" Description="Chemin vers la bibliothèque d'historisation des fichiers d'import des hiérarchies">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtHierarchieSharePointLibraryUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorHierarchieharePointLibraryUrl" runat="server" ErrorMessage="*" ControlToValidate="txtHierarchieSharePointLibraryUrl" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

            </tr>

        <tr>
            <td><h3>TPS</h3></td>
        </tr>
        <tr>

        <wssuc:InputFormSection runat="server" Title="TPS - Export Eforce Transco SSRS Url" Description="">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtTPSExportTransco"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorTPSExportTransco" runat="server" ErrorMessage="*" ControlToValidate="txtTPSExportTransco" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>

        <wssuc:InputFormSection runat="server" Title="TPS - Export Eforce Alimentation SSRS Url" Description="Chemin du fichier modèle utilisé pour les portefeuilles">
            <template_inputformcontrols>
			    <tr>
                    <td>
			            <asp:TextBox runat="server" ID="txtTPSExportAlimentation"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorTPSExportAlimentation" runat="server" ErrorMessage="*" ControlToValidate="txtTPSExportAlimentation" Font-Bold="true" ForeColor="Red" />
			        </td>
			    </tr>
		    </template_inputformcontrols>
        </wssuc:InputFormSection>
            
        <wssuc:InputFormSection runat="server" Title="TPS - Fiche Expresso Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtTPSExpresso"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorTPSExpresso" runat="server" ErrorMessage="*" ControlToValidate="txtTPSExpresso" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>
     </tr>

    <tr>
        <td><h3>Rapports</h3></td>
    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Fiche client droits d'accès restreint" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtFicheClientRestrictedAccess"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorFicheClientRestrictedAccess" runat="server" ErrorMessage="*" ControlToValidate="txtFicheClientRestrictedAccess" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Fiche client CA & PARC Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtFicheClientCaParcReportUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorFicheClientCaParcReportUrl" runat="server" ErrorMessage="*" ControlToValidate="txtFicheClientCaParcReportUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Fiche client Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtFicheClientReportUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorFicheClientReportUrl" runat="server" ErrorMessage="*" ControlToValidate="txtFicheClientReportUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Fiche Acteur Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtFicheActeurReportUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorFicheActeurReportUrl" runat="server" ErrorMessage="*" ControlToValidate="txtFicheActeurReportUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Fiche Produit Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtFicheProduitReportUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorFicheProduitReportUrl" runat="server" ErrorMessage="*" ControlToValidate="txtFicheProduitReportUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Bench Client Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtBenchClientUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorBenchClientUrl" runat="server" ErrorMessage="*" ControlToValidate="txtBenchClientUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - Bench Vendeur Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtBenchVendeurUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorBenchVendeurUrl" runat="server" ErrorMessage="*" ControlToValidate="txtBenchVendeurUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
    <tr>

        <wssuc:InputFormSection runat="server" Title="Rapport - PMD Url" Description="">
            <template_inputformcontrols>
                <tr>
                    <td>
                        <asp:TextBox runat="server" ID="txtPmdUrl"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="validatorPmdUrl" runat="server" ErrorMessage="*" ControlToValidate="txtPmdUrl" Font-Bold="true" ForeColor="Red" />
                    </td>
                </tr>
            </template_inputformcontrols>
        </wssuc:InputFormSection>

    </tr>
        <wssuc:ButtonSection runat="server">
            <template_buttons>
		        <asp:Button runat="server" class="ms-ButtonHeightWidth" OnClick="btnOk_Click" Text="<%$Resources:wss,multipages_okbutton_text%>" id="btnOk" accesskey="<%$Resources:wss,okbutton_accesskey%>" />
	        </template_buttons>
        </wssuc:ButtonSection>
    </table>
</asp:content>

<asp:content id="PageTitle" contentplaceholderid="PlaceHolderPageTitle" runat="server">
    EPilot & PVV - Paramètres généraux
</asp:content>

<asp:content id="PageTitleInTitleArea" contentplaceholderid="PlaceHolderPageTitleInTitleArea" runat="server">
    EPilot & PVV - Paramètres généraux
</asp:content>
