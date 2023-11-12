using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.WebControls;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Extensions;
using System;

namespace Orange.EPilot.Layouts.Orange.EPilot.Pages
{
    public partial class AnalyticsConfig : LayoutsPageBase
    {
        /// <summary>
        /// Save the page
        /// </summary>
        /// <param name="sender">Sender of the event</param>
        /// <param name="e">Event arguments</param>
        public void btnOk_Click(object sender, EventArgs e)
        {
            LogManager.LogMethodStart();

            // Privilege elevation to write to the SharePoint Config Database
            Guid siteUid = SPContext.Current.Site.ID;
            SPSecurity.RunWithElevatedPrivileges(() =>
                                                 {
                                                     using (SPSite site = new SPSite(siteUid))
                                                     {
                                                         site.RootWeb.AllowUnsafeUpdates = true;

                                                         site.RootWeb.SetPropertyBagValue(this.txtGoogleAnalytics, Constantes.PropertyBag.Site.Analytics.AnalyticsGoogle);

                                                         site.RootWeb.Properties.Update();
                                                         site.RootWeb.Update();

                                                         site.RootWeb.AllowUnsafeUpdates = false;
                                                     }
                                                 });

            // Redirects user to the web homepage
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

            SPContext.Current.Site.RootWeb.GetPropertyBagValueToTextBox(this.txtGoogleAnalytics, Constantes.PropertyBag.Site.Analytics.AnalyticsGoogle);

            LogManager.LogMethodEnd();
        }
    }
}