using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.WebControls;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Extensions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Orange.EPilot.Layouts.Orange.EPilot.Pages
{
    public partial class SitePermission : LayoutsPageBase
    {
 
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

            StringBuilder sb = new StringBuilder();
            foreach (SPWeb subSite in SPContext.Current.Site.AllWebs)
            {

                
                 sb.Append("<h1>" + subSite.Title + "</h1>");

                 sb.Append("<table>");
                 sb.Append("<th>Utilisateur/Groupe</th> <th>Permissions</th>");
                 SPRoleAssignmentCollection roles = subSite.RoleAssignments;
                            foreach (SPRoleAssignment role in roles)
                            {
                                sb.Append("<tr>");
                                sb.Append("<td><p>"+ role.Member.Name +"</p></td>");
                                sb.Append("<td>");
                                SPRoleDefinitionBindingCollection bindings = role.RoleDefinitionBindings;
                                foreach (SPRoleDefinition binding in bindings)
	                            {
		                            sb.Append("<p>"+ binding.Name +"</p>");
	                            }
                                sb.Append("</td>");
                                sb.Append("</tr>");
                            }

                   sb.Append("</table>");
                }

                permissionContainer.Text = sb.ToString();


            }

        
    }
}