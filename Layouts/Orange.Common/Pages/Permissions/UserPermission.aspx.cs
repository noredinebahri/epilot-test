using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.WebControls;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Orange.EPilot.Layouts.Orange.EPilot.Pages
{
    public partial class UserPermission : LayoutsPageBase
    {
        /// Loads the page
        /// </summary>
        /// <param name="sender">Sender of the event</param>
        /// <param name="e">Event arguments</param>
        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.Page.IsPostBack)
                return;

            if (!string.IsNullOrWhiteSpace(Request.QueryString["codeAlliance"]))
            {
                peoplePicker.Visible = false;
                btnRecherche.Visible = false;
                var nameParts = SPContext.Current.Web.CurrentUser.LoginName.Split('\\');
                var domaine = nameParts.Length > 1 ? nameParts[0] : string.Empty;
                var fullLogin = string.Format(@"{0}\{1}", domaine, Request.QueryString["codeAlliance"]);
                try
                {
                    SPContext.Current.Site.RootWeb.AllowUnsafeUpdates = true;
                    var user = SPContext.Current.Site.RootWeb.EnsureUser(fullLogin);
                    DisplayResult(user.LoginName);
                }
                catch
                {
                    permissionContainer.Text = "<table><tr><td>Aucune permission trouvé</td></tr></table>";
                }
                finally
                {
                    SPContext.Current.Site.RootWeb.AllowUnsafeUpdates = false;
                }
            }
        }


        private void DisplayResult(string userName)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table>");
            sb.Append("<th>Module</th> <th>Permissions</th>");
            var allWebs = GetAllWebsSafely();
            foreach (SPWeb subSite in allWebs)
            {
                sb.Append("<tr>");
                sb.Append("<td><b>" + subSite.Title + "</b></td>");

                var permissionInfo = subSite.GetUserEffectivePermissionInfo(userName);
                sb.Append("<td>");
                foreach (SPRoleAssignment role in permissionInfo.RoleAssignments)
                {
                    if (role.Member.Name != "Style Resource Readers")
                    {
                        sb.Append("<p>" + role.Member + " ( ");

                        SPRoleDefinitionBindingCollection bindings = role.RoleDefinitionBindings;
                        foreach (SPRoleDefinition binding in bindings)
                        {
                            sb.Append(binding.Name + ", ");
                        }
                        sb.Append(")</p>");
                    }

                }
                sb.Append("</td>");
                sb.Append("</tr>");

            }

            sb.Append("</table>");
            permissionContainer.Text = sb.ToString();
        }

        protected void btnRecherche_Click(object sender, EventArgs e)
        {
            SPUser user = null;
            ArrayList resolvedEntities = peoplePicker.ResolvedEntities;
            foreach (PickerEntity entity in resolvedEntities)
            {
                string loginName = entity.Key;
                user = SPContext.Current.Site.RootWeb.EnsureUser(loginName);
                break;
                // the picker in my sample is in single mode!
            }

            DisplayResult(user.LoginName);
        }

        private static IList<SPWeb> GetAllWebsSafely()
        {
            var allwebs = SPContext.Current.Web.Site.RootWeb.GetSubwebsForCurrentUser().ToList();
            allwebs.Add(SPContext.Current.Site.RootWeb);
            return allwebs;
        }
    }
}