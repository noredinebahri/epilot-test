using Microsoft.SharePoint.Administration;
using Microsoft.SharePoint.WebControls;
using System;

namespace Orange.EPilot.Layouts.Orange.EPilot.Pages
{
    public partial class Help : LayoutsPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            //Recuperation du numéro de version EPilot
            SPFarm farm = SPFarm.Local;
            var epilotVersion = farm.Properties["EPilotVersion"];

            if(epilotVersion != null)
            {
                lblVersion.Text = epilotVersion.ToString();
            }

        }
    }
}