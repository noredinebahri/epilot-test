using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.WebControls;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Extensions;
using System;
using System.Collections.Generic;
using System.Web.UI.WebControls;

namespace Orange.EPilot.Layouts.Orange.EPilot.Pages
{
    public partial class DataBaseConfig : LayoutsPageBase
    {
        private Dictionary<TextBox, string> propertyReferences;

        protected Dictionary<TextBox, string> PropertyReferences
        {
            get
            {
                if (this.propertyReferences == null)
                {
                    this.propertyReferences = new Dictionary<TextBox, string>()
                                                  {
                                                    { this.txtEPilotWSUrl, Constantes.PropertyBag.Site.WebServices.EPilotWSUrl },
                                                    { this.txtPVVWSUrl, Constantes.PropertyBag.Site.WebServices.PVVWSUrl },
                                                    { this.txtCaParcWSUrl, Constantes.PropertyBag.Site.WebServices.CaParcWSUrl },
                                                    { this.txtTPSWSUrl, Constantes.PropertyBag.Site.WebServices.TpsWSUrl },
                                                    { this.txtDRCEPVCWSUrl, Constantes.PropertyBag.Site.WebServices.DrcePvcWSUrl },
                                                    { this.txtPVVFicheSSRSUrl, Constantes.PropertyBag.Site.ModulePVV.PVVFicheSSRSUrl },
                                                    { this.txtPVVFicheLibraryUrl, Constantes.PropertyBag.Site.ModulePVV.PVVFicheLibraryUrl },
                                                    { this.txtPVVFicheRealiseLibraryUrl, Constantes.PropertyBag.Site.ModulePVV.PVVFicheRealiseLibraryUrl },
                                                    { this.txtPVVFicheEvolutionRemunerationUrl, Constantes.PropertyBag.Site.ModulePVV.PVVFicheEvolutionRemunerationUrl },
                                                    { this.txtPVCFicheSSRSUrl, Constantes.PropertyBag.Site.ModulePVC.PVCFicheSSRSUrl },
                                                    { this.txtPVCFicheLibraryUrl, Constantes.PropertyBag.Site.ModulePVC.PVCFicheLibraryUrl },
                                                    { this.txtPVCFicheRealiseLibraryUrl, Constantes.PropertyBag.Site.ModulePVC.PVCFicheRealiseLibraryUrl },
                                                    { this.txtPVCFicheEvolutionRemunerationUrl, Constantes.PropertyBag.Site.ModulePVC.PVCFicheEvolutionRemunerationUrl },
                                                    { this.txtPVCFicheRealiseSSRSUrl, Constantes.PropertyBag.Site.ModulePVC.PVCFicheRealiseSSRSUrl },
                                                    { this.txtCiblageTemplateUrl, Constantes.PropertyBag.Site.ModuleCAP.CiblageTemplateUrl },
                                                    { this.txtPortfolioTemplateUrl, Constantes.PropertyBag.Site.ModuleCAP.PortfolioTemplateUrl },
                                                    { this.txtHierarchyTemplateUrl, Constantes.PropertyBag.Site.ModuleCAP.HierarchyTemplateUrl },
                                                    { this.txtPortefeuilleSharePointLibraryUrl, Constantes.PropertyBag.Site.ModuleCAP.PortefeuilleImportLibraryUrl },
                                                    { this.txtCiblageImportLibraryUrl, Constantes.PropertyBag.Site.ModuleCAP.CiblageImportLibraryUrl },
                                                    { this.txtCiblageRefDocImportLibraryUrl, Constantes.PropertyBag.Site.ModuleCAP.CiblageRefDocImportLibraryUrl },
                                                    { this.txtHierarchieSharePointLibraryUrl, Constantes.PropertyBag.Site.ModuleCAP.HierarchieImportLibraryUrl },
                                                    { this.txtPVVFicheRealiseSSRSUrl, Constantes.PropertyBag.Site.ModulePVV.PVVFicheRealiseSSRSUrl },
                                                    { this.txtTPSExportAlimentation, Constantes.PropertyBag.Site.ModuleTPS.ExportAlimentation },
                                                    { this.txtTPSExportTransco, Constantes.PropertyBag.Site.ModuleTPS.ExportTransco },
                                                    { this.txtTPSExpresso, Constantes.PropertyBag.Site.ModuleTPS.ExportExpresso },
                                                    { this.txtFicheClientRestrictedAccess, Constantes.PropertyBag.Site.Reports.FicheClientRestrictedAccess },
                                                    { this.txtFicheClientCaParcReportUrl, Constantes.PropertyBag.Site.Reports.FicheClientCaParcReportUrl },
                                                    { this.txtFicheClientReportUrl, Constantes.PropertyBag.Site.Reports.FicheClientReportUrl },
                                                    { this.txtFicheActeurReportUrl, Constantes.PropertyBag.Site.Reports.FicheActeurReportUrl },
                                                    { this.txtFicheProduitReportUrl, Constantes.PropertyBag.Site.Reports.FicheProduitReportUrl },
                                                    { this.txtBenchClientUrl, Constantes.PropertyBag.Site.Reports.BenchClientReportUrl },
                                                    { this.txtBenchVendeurUrl, Constantes.PropertyBag.Site.Reports.BenchVendeurReportUrl },
                                                    { this.txtPmdUrl, Constantes.PropertyBag.Site.Reports.PmdReportUrl }
                                                  };
                }

                return propertyReferences;
            }
        }

        protected void btnOk_Click(object sender, EventArgs e)
        {
            LogManager.LogMethodStart();

            // Privilege elevation to write to the SharePoint Config Database
            Guid siteUid = SPContext.Current.Site.ID;
            SPSecurity.RunWithElevatedPrivileges(() =>
                                                 {
                                                     using (SPSite site = new SPSite(siteUid))
                                                     {
                                                         site.RootWeb.AllowUnsafeUpdates = true;

                                                         foreach (var reference in this.PropertyReferences)
                                                         {
                                                             site.RootWeb.SetPropertyBagValue(reference.Key, reference.Value);
                                                         }

                                                         site.RootWeb.Properties.Update();
                                                         site.RootWeb.Update();

                                                         site.RootWeb.AllowUnsafeUpdates = false;
                                                     }
                                                 });

            // Redirects user to default page
            string components = Request.Url.GetComponents(UriComponents.Query, UriFormat.SafeUnescaped);
            SPUtility.Redirect(SPContext.Current.Web.Url, SPRedirectFlags.Default, this.Context, components);

            LogManager.LogMethodEnd();
        }

        /// <summary>
        /// Loads the page
        /// </summary>
        /// <param name="sender">Sender of the event</param>
        /// <param name="e">Event arguments</param>
        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.Page.IsPostBack)
            {
                return;
            }

            LogManager.LogMethodStart();

            foreach (var reference in this.PropertyReferences)
            {
                SPContext.Current.Site.RootWeb.GetPropertyBagValueToTextBox(reference.Key, reference.Value);
            }

            LogManager.LogMethodEnd();
        }
    }
}