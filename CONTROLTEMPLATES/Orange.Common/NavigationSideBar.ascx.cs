using Microsoft.SharePoint;
using Microsoft.SharePoint.Publishing.Navigation;
using Microsoft.SharePoint.Taxonomy;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Framework.Cache;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot
{
    [Serializable]
    public class NavigationItem
    {

        public string Title { get; set; }
        public string Value { get; set; }
        public string IconFont { get; set; }
        public string NavigateUrl { get; set; }
        public bool Active { get; set; }
        public List<NavigationItem> ChildItems { get; set; }
        public string Target { get; set; }

        public NavigationItem(string title, string value, string iconFont, string navigateUrl)
        {
            Title = title;
            Value = value;
            IconFont = iconFont;
            NavigateUrl = navigateUrl;
            Target = null;
        }

    }

    public partial class NavigationSideBar : UserControl
    {
        private const string EMPTY_NAV_URL = "javascript:void(0);";

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (this.Page.IsPostBack)
                {
                    return;
                }

                List<NavigationItem> navItems = null;
                Guid webUid = SPContext.Current.Web.ID;

                //Recupération de la navigation du site en cache
                var cacheCurrentnav = CacheControl.CacheObject.GetPrivateObject("CurrentNav_" + webUid);

                if (cacheCurrentnav != null)
                {
                    LogManager.LogInfo("Navigation : Retrieve from session");
                    navItems = (List<NavigationItem>)cacheCurrentnav;
                }
                else
                {
                    LogManager.LogInfo("Navigation : Retrieve from managed metadata");

                    Guid siteUid = SPContext.Current.Site.ID;

                    SPSecurity.RunWithElevatedPrivileges(() =>
                    {
                        using (SPSite site = new SPSite(siteUid))
                        using (SPWeb web = site.OpenWeb(webUid))
                        {
                            navItems = this.LoadNavigationItems(web);

                            if(navItems.Count >0)
                            {
                                //Mise en session pour 1h
                                CacheControl.CacheObject.AddPrivateObject("CurrentNav_" + webUid, navItems, CacheDuration.Medium);
                            }
                        }
                    });
                }


               this.SetNavigationItemActive(ref navItems);

                menu.DataSource = navItems;
                menu.DataBind();

            }
            catch (Exception exp)
            {
                LogManager.LogError("Navigation : An error has occurred while retrieving site navigation.");
                LogManager.LogError(exp);
            }
        }


        private NavigationTerm FindNavigationTermRecursively(ReadOnlyCollection<NavigationTerm> navTermCollection, Guid termUid)
        {
            foreach (NavigationTerm navTerm in navTermCollection)
            {
                if (navTerm.Id == termUid)
                {
                    return navTerm;
                }

                NavigationTerm childNavTerm = this.FindNavigationTermRecursively(navTerm.Terms, termUid);
                if (childNavTerm != null)
                {
                    return childNavTerm;
                }
            }

            return null;
        }

        

        private List<NavigationItem> LoadNavigationItems(SPWeb web)
        {
            List<NavigationItem> navItems = new List<NavigationItem>();

            //Recupération du termstore associé au site
            TaxonomySession taxonomySession = TaxonomyNavigation.CreateTaxonomySessionForEdit(web);
            NavigationTermSet navTermSet = TaxonomyNavigation.GetTermSetForWeb(web, StandardNavigationProviderNames.CurrentNavigationTaxonomyProvider, true);

            if (navTermSet != null)
            {
                //Recupération des termes
                NavigationTermSet editableTermSet = navTermSet.GetAsEditable(taxonomySession);
                TermCollection terms = editableTermSet.GetTaxonomyTermSet().Terms;

                foreach (Term term in terms)
                {
                    if (term.Parent != null)
                    {
                        continue;
                    }

                    NavigationItem menuItem = this.ParseNavItem(term, editableTermSet);
                    if (menuItem != null)
                    {
                        navItems.Add(menuItem);
                    }
                }
            }
            else
            {
                LogManager.LogInfo("Navigation : Managed Metadata not configure for this site");
            }

            return navItems;
        }


        private NavigationItem ParseNavItem(Term term, NavigationTermSet navTermSet)
        {
            if (!this.UserHasAccessOnNavTerm(term))
            {
                return null;
            }

            //Mapping des éléments communs
            string title = term.Name;
            string value = term.Id.ToString();
            string navigateUrl = EMPTY_NAV_URL;

            if ((!term.LocalCustomProperties.TryGetValue("_Sys_Nav_SimpleLinkUrl", out navigateUrl) &&
                !term.LocalCustomProperties.TryGetValue("_Sys_Nav_TargetUrl", out navigateUrl)) ||
                string.IsNullOrWhiteSpace(navigateUrl))
            {
                NavigationTerm navTerm = this.FindNavigationTermRecursively(navTermSet.Terms, term.Id);
                if (navTerm != null)
                {
                    var friendlyUrl = navTerm.GetWebRelativeFriendlyUrl();
                    if (!string.IsNullOrWhiteSpace(friendlyUrl)) navigateUrl = friendlyUrl;
                     
                }
            }

            string iconFont = string.Empty;
            if (!term.CustomProperties.TryGetValue("IconFont", out iconFont))
            {
                term.LocalCustomProperties.TryGetValue("IconFont", out iconFont);
            }

            NavigationItem menuItem = new NavigationItem(title, value, iconFont, navigateUrl);

            string target = null;
            if (!term.CustomProperties.TryGetValue("Target", out target))
            {
                term.LocalCustomProperties.TryGetValue("Target", out target);
            }

            if (target != null) { menuItem.Target = target; }

            foreach (Term childTerm in term.Terms)
            {
                if (menuItem.ChildItems == null)
                    menuItem.ChildItems = new List<NavigationItem>();

                var item = this.ParseNavItem(childTerm, navTermSet);
                if (item != null)
                {
                    menuItem.ChildItems.Add(item);
                }
            }

            return menuItem;
        }

        private void SetNavigationItemActive(ref List<NavigationItem> menuItems)
        {
            var localPath = HttpContext.Current.Request.Url.LocalPath;

            foreach (var item in menuItems)
            {
                item.Active = false;
                var itemUrl = item.NavigateUrl.Split('?').First();
                if (itemUrl.EndsWith(localPath, StringComparison.InvariantCultureIgnoreCase))
                {
                    item.Active = true;
                }

                bool activeChild = false;

                if (item.ChildItems != null)
                {
                    foreach (var childItem in item.ChildItems)
                    {
                        childItem.Active = false;
                        var childItemUrl = childItem.NavigateUrl.Split('?').First();
                        if (childItemUrl.EndsWith(localPath, StringComparison.InvariantCultureIgnoreCase))
                        {
                            childItem.Active = true;
                            activeChild = true;
                        }
                    }
                }
                if (activeChild) item.Active = true;


                
            }

        }

        private bool UserHasAccessOnNavTerm(Term term)
        {
            bool accessUser = false;

            //Le sitecollection administrateur peut voir l'intégralité du menu
            if (SPContext.Current.Web.CurrentUser.IsSiteAdmin)
            {
                return true;
            }
            
            //Recupération des autorisations sur le terme
            string restrictedAcces = string.Empty;
            if (!term.CustomProperties.TryGetValue("RestrictedAccess", out restrictedAcces))
            {
                term.LocalCustomProperties.TryGetValue("RestrictedAccess", out restrictedAcces);
            }

            //Verification des autorisations
            if (!String.IsNullOrEmpty(restrictedAcces))
            {
                string[] acces = restrictedAcces.Split(';');
                var userGroups = SPContext.Current.Web.CurrentUser.Groups;

                foreach (SPGroup item in userGroups)
                {
                    var groupName = item.Name.ToUpper();
                    var groupMatch = acces.Where(a => a.ToUpper().Equals(groupName));
                    if (groupMatch.Count() != 0)
                    {
                        accessUser = true;
                    }
                }
            }
            else
            {
                //Pas de restriction configuré
                accessUser = true;
            }

            return accessUser;
        }

        protected void menu_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            // This is where you get the current data item, I am assuming here you are using a class/model, change this as required
            NavigationItem obj = (NavigationItem)e.Item.DataItem;

            if(obj != null)
            {
                Repeater rpt1 = (Repeater)e.Item.FindControl("submenu");
                rpt1.DataSource = obj.ChildItems;
                rpt1.DataBind();

                Repeater rpt2 = (Repeater)e.Item.FindControl("hovermenu");
                rpt2.DataSource = obj.ChildItems;
                rpt2.DataBind();
            }
        }
    }
}