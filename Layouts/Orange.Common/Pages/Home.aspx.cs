using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using System.Collections.Generic;
using Orange.Common.Library.Entities;
using Orange.Common.Library.Framework.Cache;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Constants;
using System.Linq;

namespace Orange.EPilot.Layouts1.Orange.EPilot
{
    public partial class Home : LayoutsPageBase
    {
        #region Properties

        public string HiveImagePath
        {
            get
            {
                return SPContext.Current.Site.Url + "/_LAYOUTS/15/Orange.Common/Design/Images/";
            }
        }

        #endregion Properties

        #region Events

        protected void Page_Load(object sender, EventArgs e)
        {
            this.BuildGlobalNavigation();
        }

        #endregion Events

        #region Methods

        protected void BuildGlobalNavigation()
        {
            try
            {
                var globalNavList = new List<GlobalNav>();

                //Recupération de la global nav depuis la session de l'utilisateur
                var cacheGlobalNav = CacheControl.CacheObject.GetPrivateObject("GlobalNav_NavigationList");

                if (cacheGlobalNav != null)
                {
                    LogManager.LogInfo("Global Navigation : Retrieve from session");
                    globalNavList = (List<GlobalNav>)cacheGlobalNav;
                }
                else
                {
                    LogManager.LogInfo("Global Navigation : Retrieve from site");
                    SPSite site = SPContext.Current.Site;
                    SPWebCollection spWebCollection = site.RootWeb.GetSubwebsForCurrentUser();

                    foreach (SPWeb spWeb in spWebCollection)
                    {
                        if (spWeb.IsRootWeb)
                            continue;

                        var globalNavNode = new GlobalNav
                        {
                            Title = spWeb.Title,
                            Url = spWeb.Url,
                            Name = spWeb.Name
                        };

                        LogManager.LogInfo("Global Navigation web " + spWeb.Title);

                        // Set the icon
                        if (spWeb.Properties.ContainsKey(Constantes.PropertyBag.Web.ModuleColor))
                        {
                            globalNavNode.IconFont = spWeb.Properties[Constantes.PropertyBag.Web.ModuleIcon];
                        }

                        // Set the Color
                        if (spWeb.Properties.ContainsKey(Constantes.PropertyBag.Web.ModuleColor))
                        {
                            globalNavNode.ColorCode = spWeb.Properties[Constantes.PropertyBag.Web.ModuleColor];
                        }

                        // Set the Display Order
                        if (spWeb.Properties.ContainsKey(Constantes.PropertyBag.Web.ModuleOrder))
                        {
                            int displayOrder;
                            int.TryParse(spWeb.Properties[Constantes.PropertyBag.Web.ModuleOrder], out displayOrder);

                            globalNavNode.DisplayOrder = displayOrder;
                        }

                        globalNavList.Add(globalNavNode);

                        //Mise en place du cache pour 1h
                        CacheControl.CacheObject.AddPrivateObject("GlobalNav_NavigationList", globalNavList, CacheDuration.Medium);

                        //Libération des ressources
                        spWeb.Dispose();
                    }
                }
                LogManager.LogInfo("Global Navigation site count: " + globalNavList.Count.ToString());



                lvHomeGlobalNavigation.DataSource = globalNavList.OrderBy(gn => gn.DisplayOrder);
                lvHomeGlobalNavigation.DataBind();
            }
            catch (Exception exp)
            {
                LogManager.LogError(string.Format("Error occurred while building the Global Navigation. Exception: {0}", exp));
            }
        }

        #endregion Methods
    }
}
