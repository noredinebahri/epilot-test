using System;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;

namespace Orange.EPilot.WebParts.Iframe_SSRS
{
    [ToolboxItemAttribute(false)]
    public class Iframe_SSRS : WebPart
    {

        private string _iframeStyle;
        private string _iframeUrl;
        private Modules _hierarchieModule;


        public enum Modules
        {
            CAP,
            CAPA,
            AVV,
            PoleContrat,
            NewEpilot,
            NewCapa,
            Aucun
        };

        [WebBrowsable(true),
        WebDisplayName("Iframe style"),
        WebDescription("IFrame Style (default : width:100%;height:1000px)"),
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
        WebDisplayName("Iframe url"),
        WebDescription("IFrame Url"),
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



        [WebBrowsable(true),
            WebDisplayName("Hierarchie module"),
            WebDescription("Module (CAP, CAPA)"),
            Category("EPilot"),
            Personalizable(PersonalizationScope.Shared)]
        public Modules HierarchieModule
        {
            get
            {
                return this._hierarchieModule;
            }
            set
            {
                this._hierarchieModule = value;
            }
        }

        // Visual Studio might automatically update this path when you change the Visual Web Part project item.
        private const string _ascxPath = @"~/_CONTROLTEMPLATES/15/Orange.EPilot.WebParts/Iframe_SSRS/Iframe_SSRSUserControl.ascx";

        protected override void CreateChildControls()
        {
            Iframe_SSRSUserControl control = (Iframe_SSRSUserControl)Page.LoadControl(_ascxPath);
            control.ReportUrl = _iframeUrl;
            control.ReportIncludeParameter = "false";
            if (_hierarchieModule == Modules.CAP)
            {
                control.ReportIncludeParameter = "true";
                Controls.Add(new LiteralControl("<hierarchy-navigation ctrl-name='hierarchyNavigationPerfcoController' service-ctrl='cap'></hierarchy-navigation>"));
            }
            else if (_hierarchieModule == Modules.NewEpilot)
            {
                control.ReportIncludeParameter = "true";
                control.ReportIsNewEpilot = "true";
                Controls.Add(new LiteralControl("<hierarchy-navigation ctrl-name='hierarchyNavigationPerfcoController' service-ctrl='cap'></hierarchy-navigation>"));
            }
            else if (_hierarchieModule == Modules.CAPA)
            {
                control.ReportIncludeParameter = "true";
                Controls.Add(new LiteralControl("<hierarchy-navigation hierarchy-navigation ctrl-name='hierarchyNavigationPerfcoController' service-ctrl='capa'></hierarchy-navigation>"));
            }
            else if (_hierarchieModule == Modules.NewCapa)
            {
                control.ReportIncludeParameter = "true";
                control.ReportIsNewCapa = "true";
                Controls.Add(new LiteralControl("<hierarchy-navigation hierarchy-navigation ctrl-name='hierarchyNavigationPerfcoController' service-ctrl='newcapa'></hierarchy-navigation>"));
            }
            else if (_hierarchieModule == Modules.AVV)
            {
                control.ReportIncludeParameter = "true";
                control.AngularController = "reportAVVWPController";
                control.ReportModule = "avv";
                Controls.Add(new LiteralControl("<hierarchy-navigation hierarchy-navigation ctrl-name='hierarchyNavigationAvvController' service-ctrl='avv'></hierarchy-navigation>"));
            }
            else if (_hierarchieModule == Modules.PoleContrat)
            {
                control.ReportIncludeParameter = "true";
                control.AngularController = "reportAVVWPController";
                control.ReportModule = "polecontrat";
                Controls.Add(new LiteralControl("<hierarchy-navigation hierarchy-navigation ctrl-name='hierarchyNavigationAvvController' service-ctrl='polecontrat'></hierarchy-navigation>"));
            }

            string style = String.IsNullOrEmpty(_iframeStyle) ? "width:100%;height:1000px" : _iframeStyle;
            control.ReportStyle = style;
            Controls.Add(control);
        }
    }
}
