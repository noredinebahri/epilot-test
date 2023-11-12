<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SiteNavigationTiles.ascx.cs" Inherits="Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot.SiteNavigationTiles" %>


<div class="com-nav-top ms-dialogHidden">
    <div class="menu-icon">
        <i aria-hidden="true" class="fa fa-th"></i>
    </div>
    <ul class="tiles">
        <asp:ListView ID="lvGlobalNavigation" runat="server">
            <ItemTemplate>
                <li style="background-color: <%# Eval("ColorCode") %>; color: <%# Eval("ColorCode")%>; border:2px solid <%# Eval("ColorCode")%>; ">
                    <a id="<%# Eval("Name")%>" href="<%# Eval("Url")%>" target="_top"  class="navTile">
                        <div class="navTile-background <%# Convert.ToBoolean(Eval("Active")) ? "active" : "" %>">
                            <p>
                                <i class="<%# Eval("IconFont")%>"></i>
                                <span>
                                    <%# Eval("Title")%>
                                </span>
                            </p>

                        </div>
                    </a>
                </li>
            </ItemTemplate>
        </asp:ListView>
    </ul>
</div>

<script type="text/javascript">
    $('.com-nav-top').click(function (e) {
        e.stopPropagation();

        var menuOptions = $('.tiles');

        if (menuOptions.hasClass('open')) {
            menuOptions.fadeOut();
            menuOptions.removeClass('open');
        } else {
            menuOptions.fadeIn();
            menuOptions.addClass('open');
        }
    });
</script>
