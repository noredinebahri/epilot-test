using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

namespace Orange.EPilot.WebParts.Iframe_SSRS
{
    public partial class Iframe_SSRSUserControl : UserControl
    {
        public string ReportUrl;
        public string ReportStyle;
        public string ReportModule;
        public string ReportIncludeParameter;
        public string ReportIsNewEpilot;
        public string ReportIsNewCapa;
        public string AngularController = "reportWPController";
        protected void Page_Load(object sender, EventArgs e)
        {
        }
    }
}
