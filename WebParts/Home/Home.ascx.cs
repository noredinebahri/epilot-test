using System;
using System.ComponentModel;
using System.Web.UI.WebControls.WebParts;

namespace Orange.EPilot.WebParts.Home
{
    [ToolboxItemAttribute(false)]
    public partial class Home : WebPart
    {
        private string _moduleId;

        [WebBrowsable(true),
        WebDisplayName("Id module"),
        WebDescription("Dientifiant technique du module"),
        Category("EPilot"),
        Personalizable(PersonalizationScope.Shared)]
        public string ModuleId
        {
            get
            {
                return this._moduleId;
            }
            set
            {
                this._moduleId = value;
            }
        }

        // Uncomment the following SecurityPermission attribute only when doing Performance Profiling on a farm solution
        // using the Instrumentation method, and then remove the SecurityPermission attribute when the code is ready
        // for production. Because the SecurityPermission attribute bypasses the security check for callers of
        // your constructor, it's not recommended for production purposes.
        // [System.Security.Permissions.SecurityPermission(System.Security.Permissions.SecurityAction.Assert, UnmanagedCode = true)]
        public Home()
        {
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            InitializeControl();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
        }
    }
}
