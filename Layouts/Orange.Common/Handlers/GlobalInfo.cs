using Microsoft.SharePoint;
using Orange.Common.Library.Constants;
using Orange.Common.Library.Diagnostics;
using Orange.Common.Library.Framework.Cache;
using System;
using System.Web;
using System.Web.Caching;

namespace Orange.EPilot.Layouts
{
    public class GlobalInfo : IHttpHandler
    {
        public bool IsReusable
        {
            // Retourne False si votre gestionnaire managé ne peut pas être réutilisé pour une autre demande.
            // Généralement, cette valeur est False au cas où vous conserveriez des informations d'état pour chaque demande.
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                LogManager.LogInfo("Entrée dans le HTTPHandler : ImportExportExcelHandler");

                if (SPContext.Current == null)
                {
                    LogManager.LogError("Contexte introuvable");

                    // Traitement KO
                    throw new Exception("Contexte introuvable.");
                }
                else
                {
                    SPWeb currentWeb = SPContext.Current.Site.RootWeb;

                    var urlWS = GetProperty(Constantes.PropertyBag.Site.WebServices.EPilotWSUrl);
                        context.Response.ContentType = "text/json";
                    context.Response.Write("{\"EPilotWS\": \" "+ urlWS  + " \"}");

                }
            }
            catch (Exception ex)
            {
                // Traitement KO
                LogManager.LogError(string.Format("ProcessRequest error : " + ex.Message, ex.InnerException));

                // on renvoi un flux erreur
                if (context != null && context.Response != null)
                {
                    // Traitement KO
                    context.Response.StatusCode = 500;
                    context.Response.Write(ex.Message);
                }
            }
        }


        private string GetProperty(string propertyName)
        {
            //Recupération de la clé dans le cache
            string cacheValue = CacheControl.CacheObject.GetSharedObject("GlobalProperties_" + propertyName) as string;

            if (!string.IsNullOrEmpty(cacheValue))
            {
                return cacheValue;
            }

            LogManager.LogInfo("Property [" + propertyName + "] : Retrieve from propertybag");
            //Récupération dans la property bag
            if (SPContext.Current.Site.RootWeb.Properties.ContainsKey(propertyName))
            {
                string propertyValue = SPContext.Current.Site.RootWeb.Properties[propertyName];
                CacheControl.CacheObject.AddSharedObject("GlobalProperties_" + propertyName, propertyValue, CacheDuration.Medium, null, CacheItemPriority.Default, null);

                return propertyValue;
            }

            return null;
        }

    }
}