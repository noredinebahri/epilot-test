using Microsoft.SharePoint;
using Microsoft.SharePoint.Publishing;
using Orange.Common.Library.Constants;
using System;
using System.Text;
using System.Web.UI;

namespace Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot
{
    public partial class ReportIframe : UserControl
    {
        #region Events

        protected void Page_Load(object sender, EventArgs e)
        {
            GenerateReportIframe();
        }

        #endregion Events

        #region Methods

        protected void GenerateReportIframe()
        {
            PublishingPage currentPage = PublishingPage.GetPublishingPage(SPContext.Current.ListItem);

            if (currentPage != null)
            {
                string reportUrl = currentPage.ListItem[Constantes.Fields.Generic.Url] as string;
                if (!string.IsNullOrEmpty(reportUrl))
                {
                    StringBuilder sb = new StringBuilder();
                    sb.Append("<iframe src='" + reportUrl + "' width='100%'></iframe>");

                    this.Controls.Add(new LiteralControl(sb.ToString()));
                }
            }
        }

        #endregion Methods
    }
}