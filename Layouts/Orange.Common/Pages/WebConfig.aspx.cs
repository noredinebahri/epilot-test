using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.WebControls;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Extensions;
using System;

namespace Orange.EPilot.Layouts.Orange.EPilot.Pages
{
    public partial class SiteConfig : LayoutsPageBase
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
            Guid webUid = SPContext.Current.Web.ID;
            SPSecurity.RunWithElevatedPrivileges(() =>
                                                 {
                                                     using (SPSite site = new SPSite(siteUid))
                                                     using (SPWeb currentWeb = site.OpenWeb(webUid))
                                                     {
                                                         currentWeb.AllowUnsafeUpdates = true;

                                                         currentWeb.SetPropertyBagValue(this.txtColorCode, Constantes.PropertyBag.Web.ModuleColor);
                                                         currentWeb.SetPropertyBagValue(this.txtIconFont, Constantes.PropertyBag.Web.ModuleIcon);
                                                         currentWeb.SetPropertyBagValue(this.txtDisplayOrder, Constantes.PropertyBag.Web.ModuleOrder);

                                                         currentWeb.Properties.Update();
                                                         currentWeb.Update();

                                                         currentWeb.AllowUnsafeUpdates = false;
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

            SPContext.Current.Web.GetPropertyBagValueToTextBox(this.txtColorCode, Constantes.PropertyBag.Web.ModuleColor);

            SPContext.Current.Web.GetPropertyBagValueToTextBox(this.txtIconFont, Constantes.PropertyBag.Web.ModuleIcon);

            SPContext.Current.Web.GetPropertyBagValueToTextBox(this.txtDisplayOrder, Constantes.PropertyBag.Web.ModuleOrder);

            LogManager.LogMethodEnd();
        }
    }
}