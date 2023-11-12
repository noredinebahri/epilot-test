using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using System.Web.Script.Serialization;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Entities;
using Orange.Common.Library.Framework.Cache;
using Orange.EPilot.ActionPlans.Helpers;
using System;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.UI;

namespace Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot
{
    public partial class GlobalProperties : UserControl
    {
        #region Events

        protected void Page_Load(object sender, EventArgs e)
        {
            this.InitialiseHiddenControls();
           //this.EnsureCurrentUserCookie();
        }

        #endregion Events

        #region Methods

        //protected void EnsureCurrentUserCookie()
        //{
        //    try
        //    {
        //        HttpCookie currentUserCookie = Request.Cookies[Constantes.Cookies.CurrentUserCodeAlliance];

        //        //Vérification de l'existence du cookie 'currrentUser'
        //        if (currentUserCookie == null ||
        //            string.IsNullOrWhiteSpace(currentUserCookie.Value) ||
        //            currentUserCookie.Value.Equals("null", StringComparison.InvariantCultureIgnoreCase))
        //        {
        //            string codeAlliance = SPContext.Current.Web.CurrentUser.LoginName.Split('\\').Last();
        //            if (!string.IsNullOrWhiteSpace(codeAlliance) && codeAlliance.Length > 8)
        //            {
        //                codeAlliance = codeAlliance.Substring(0, 8);
        //            }

        //            var url = string.Format("User/GetUserByCodeAlliance/{0}", codeAlliance);
        //            User userWS = WebApiHelper.HttpService.Get<User>(url);

        //            //Stockage dans un cookie
        //            string output = new JavaScriptSerializer().Serialize(userWS);
        //            HttpCookie userCookie = new HttpCookie(Constantes.Cookies.CurrentUserCodeAlliance);
        //            userCookie.Value = output;
        //            Response.Cookies.Add(userCookie);
        //        }
        //    }
        //    catch (Exception exp)
        //    {
        //        LogManager.LogError(string.Format("Error occurred while getting the current userId. Exception: {0}", exp));
        //    }
        //}

        protected void InitialiseHiddenControls()
        {
            try
            {
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.WebServices.EPilotWSUrl, "PropertyEPilotWebApiUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.WebServices.PVVWSUrl, "PropertyPVVWebApiUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.WebServices.DrcePvcWSUrl, "PropertyDrcePVCWebApiUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.WebServices.CaParcWSUrl, "PropertyCaParcWebApiUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.WebServices.TpsWSUrl, "PropertyTpsWebApiUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleCAP.CiblageTemplateUrl, "PropertyCiblageTemplateUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleCAP.PortefeuilleImportLibraryUrl, "PropertyPortfolioImportFolderUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleCAP.PortfolioTemplateUrl, "PropertyPortfolioTemplateUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleCAP.HierarchyTemplateUrl, "PropertyHierarchyTemplateUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModulePVV.PVVFicheEvolutionRemunerationUrl, "PropertyFicheEvolutionRemunerationUrl");

                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleTPS.ExportTransco, "PropertyTPSExportEforceTransco");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleTPS.ExportAlimentation, "PropertyTPSExportEforceAlimentation");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleTPS.ExportExpresso, "PropertyTPSExpresso");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.FicheClientCaParcReportUrl, "PropertyFicheClientCaParcReportUrl");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.FicheClientRestrictedAccess, "PropertyFicheClientRestrictedAccess");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.FicheClientReportUrl, "PropertyFicheClientReportUrl");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.FicheActeurReportUrl, "PropertyFicheActeurReportUrl");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.FicheProduitReportUrl, "PropertyFicheProduitReportUrl");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.BenchClientReportUrl, "PropertyBenchClientReportUrl");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.BenchVendeurReportUrl, "PropertyBenchVendeurReportUrl");
                this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.Reports.PmdReportUrl, "PropertyPmdReportUrl");

                bool isAdded = this.AddHiddenPropertyControl(Constantes.PropertyBag.Site.ModuleCAP.CiblageRefDocImportLibraryUrl, "PropertyCiblageRefDocLibraryUrl");
                if (isAdded)
                {
                    //Recupération des informations de la liste du cache
                    string cacheGPDocLibTitle = (string)CacheControl.CacheObject.GetSharedObject("GlobalProperties_PropertyCiblageRefDocLibraryTitle");
                    string cacheGPDocLibUrl = (string)CacheControl.CacheObject.GetSharedObject("GlobalProperties_PropertyCiblageRefDocFolderBaseUrl");

                    if (string.IsNullOrEmpty(cacheGPDocLibTitle) || string.IsNullOrEmpty(cacheGPDocLibTitle))
                    {
                        LogManager.LogInfo("Property [GlobalProperties_PropertyCiblageRefDocFolderBaseUrl] : Retrieve from site");
                        LogManager.LogInfo("Property [GlobalProperties_PropertyCiblageRefDocLibraryTitle] : Retrieve from site");
                        string refDocLibraryUrl = SPContext.Current.Site.RootWeb.Properties[Constantes.PropertyBag.Site.ModuleCAP.CiblageRefDocImportLibraryUrl];

                        using (SPSite site = new SPSite(refDocLibraryUrl))
                        using (SPWeb web = site.OpenWeb())
                        {
                            SPList ciblageLibrary = web.GetList(refDocLibraryUrl);
                            string folderBaseUrl = SPUrlUtility.CombineUrl(ciblageLibrary.RootFolder.ServerRelativeUrl, Constantes.Import.IMPORT_CIBLAGE_FILENAME_BASE);

                            this.AddHiddenControl("PropertyCiblageRefDocLibraryTitle", ciblageLibrary.Title);
                            this.AddHiddenControl("PropertyCiblageRefDocFolderBaseUrl", folderBaseUrl);

                            CacheControl.CacheObject.AddSharedObject("GlobalProperties_PropertyCiblageRefDocLibraryTitle", ciblageLibrary.Title, CacheDuration.Medium, null, System.Web.Caching.CacheItemPriority.Default, null);
                            CacheControl.CacheObject.AddSharedObject("GlobalProperties_PropertyCiblageRefDocFolderBaseUrl", folderBaseUrl, CacheDuration.Medium, null, System.Web.Caching.CacheItemPriority.Default, null);
                        }
                    }
                    else
                    {
                        LogManager.LogInfo("Property [GlobalProperties_PropertyCiblageRefDocFolderBaseUrl] : Retrieve from cache");
                        LogManager.LogInfo("Property [GlobalProperties_PropertyCiblageRefDocLibraryTitle] : Retrieve from cache");
                        this.AddHiddenControl("PropertyCiblageRefDocLibraryTitle", cacheGPDocLibTitle);
                        this.AddHiddenControl("PropertyCiblageRefDocFolderBaseUrl", cacheGPDocLibUrl);
                    }
                }
            }
            catch (Exception exp)
            {
                LogManager.LogError(string.Format("Error occurred while retrieving webservice Url. Exception: {0}", exp));
            }
        }

        private void AddHiddenControl(string controlId, string propertyValue)
        {
            this.Controls.Add(new LiteralControl(string.Format("<div id='{0}' style='display:none'>{1}</div>", controlId, propertyValue)));
        }

        private bool AddHiddenPropertyControl(string propertyName, string controlId)
        {
            //Recupération de la clé dans le cache
            string cacheValue = CacheControl.CacheObject.GetSharedObject("GlobalProperties_" + propertyName) as string;

            if (!string.IsNullOrEmpty(cacheValue))
            {
                LogManager.LogInfo("Property [" + propertyName + "] : Retrieve from cache");
                this.AddHiddenControl(controlId, cacheValue);

                return true;
            }

            LogManager.LogInfo("Property [" + propertyName + "] : Retrieve from propertybag");
            //Récupération dans la property bag
            if (SPContext.Current.Site.RootWeb.Properties.ContainsKey(propertyName))
            {
                string propertyValue = SPContext.Current.Site.RootWeb.Properties[propertyName];

                this.AddHiddenControl(controlId, propertyValue);

                CacheControl.CacheObject.AddSharedObject("GlobalProperties_" + propertyName, propertyValue, CacheDuration.Medium, null, CacheItemPriority.Default, null);

                return true;
            }

            return false;
        }

        #endregion Methods
    }
}