using Microsoft.SharePoint;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Entities;
using Orange.Common.Library.Helpers;
using System;
using System.ComponentModel;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls.WebParts;

namespace Orange.EPilot.Iframe_ContextEPilot
{
    [ToolboxItemAttribute(false)]
    public class Iframe_ContextEPilot : WebPart
    {
        private string _iframeStyle;
        private string _iframeUrl;

        [WebBrowsable(true),
        WebDisplayName("Iframe style"),
        WebDescription("IFrame Style (ex : width:100%, height:100%)"),
        Category("EPilot"),
        Personalizable(PersonalizationScope.Shared)]
        public string IFrameStyle
        {
            get
            {
                return this._iframeStyle;
            }
            set
            {
                this._iframeStyle = value;
            }
        }

        [WebBrowsable(true),
        WebDisplayName("Iframe url avec paramètres possibles ( {CurrentUser} )"),
        WebDescription("IFrame Url (ex : http://exemple.com?user={CurrentUser})"),
        Category("EPilot"),
        Personalizable(PersonalizationScope.Shared)]
        public string IFrameUrl
        {
            get
            {
                return this._iframeUrl;
            }
            set
            {
                this._iframeUrl = value;
            }
        }

        protected override void CreateChildControls()
        {
            try
            {
                if (string.IsNullOrEmpty(this.IFrameUrl))
                {
                    this.Controls.Add(new LiteralControl("Veuillez configurer l'url de l'Iframe dans les propriétés de la webpart."));
                }
                else
                {
                    string codeAlliance = SPContext.Current.Web.CurrentUser.LoginName.Split('\\').Last();
                    if (!string.IsNullOrWhiteSpace(codeAlliance) && codeAlliance.Length > 8)
                    {
                        codeAlliance = codeAlliance.Substring(0, 8);
                    }

                    string iframeUrlWithContext = this.IFrameUrl.Replace("{CurrentUser}", codeAlliance);

                    this.Controls.Add(new LiteralControl(string.Format("<iframe src='{0}' style='{1}'></iframe>", iframeUrlWithContext, this.IFrameStyle)));
                }
            }
            catch (Exception ex)
            {
                LogManager.LogError(string.Format("Iframe_Contexte_EPilot - OnLoad : Error occurred. Exception: {0}", ex));

                this.Controls.Add(new LiteralControl("ERREUR TECHNIQUE - Merci de contacter votre administrateur. "));
            }
        }
    }
}