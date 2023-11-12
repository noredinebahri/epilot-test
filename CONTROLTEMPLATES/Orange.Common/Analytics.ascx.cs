using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Framework.Cache;
using System;
using System.Web.UI;

namespace Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot
{
    public partial class Analytics : UserControl
    {
        #region Events

        protected void Page_Load(object sender, EventArgs e)
        {
            this.InitialiseAnalyticsControls();
        }

        #endregion Events

        #region Methods

        

        protected void InitialiseAnalyticsControls()
        {
            try
            {
                
                var googleAnalyticsKey = GetPropertyBagValue(Constantes.PropertyBag.Site.Analytics.AnalyticsGoogle);
                var msApplicationInsight = GetPropertyBagValue(Constantes.PropertyBag.Site.Analytics.AnalyticsMS);

                this.Controls.AddAt(0,new LiteralControl(string.Format("<script> var googleAnalyticsKey='{0}' </script>", googleAnalyticsKey)));
                this.Controls.AddAt(0,new LiteralControl(string.Format("<script> var msApplicationInsight='{0}' </script>", msApplicationInsight)));

                LogManager.LogInfo("Property [GlobalProperties_PropertyCiblageRefDocFolderBaseUrl] : Retrieve from site");
                       
                       
            }
            catch (Exception exp)
            {
                LogManager.LogError(string.Format("Error occurred while retrieving analytics keys. Exception: {0}", exp));
            }
        }

        private string GetPropertyBagValue(string propertyKey)
        {
            string propertyValue = null;

            if (SPContext.Current.Site.RootWeb.Properties.ContainsKey(propertyKey))
            {
                propertyValue = SPContext.Current.Site.RootWeb.Properties[propertyKey];
            }

            return propertyValue;
        }
        

        #endregion Methods
    }
}