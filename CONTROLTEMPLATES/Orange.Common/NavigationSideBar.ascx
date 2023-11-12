<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="NavigationSideBar.ascx.cs" Inherits="Orange.EPilot.CONTROLTEMPLATES.Orange.EPilot.NavigationSideBar" %>

<script type="text/javascript">
    (function ($) {
        $(document).ready(function () {
            $("#com-nav-left #nav-toogle").click(function (e) {
                e.preventDefault();
                $("#s4-workspace").toggleClass("nav-left-open");
            });

            // Fixing empty page title value
            // TODO: Move it to the common script file
            if (!$('.page-title').text().trim().length) {
                $('.page-title').text($('title').text().trim());
            }

            // Adds separation line between the site navigation and the additional nav controls (if they exist)
            $('#ctl00_NavigationSideBar_Menu_TaxonomyNavigation_SkipLink').next().prepend('<hr>')

            //Expand du menu de Niveau 1
            $('.level1').click(function () {
                $(this).parent().toggleClass("level1Closed");
                $(this).find('.chevron').find('i').toggleClass('fa-angle-up fa-angle-down')
            });

            $('li.level1Closed').on('mouseover', function () {
                var $menuItem = $(this),
                    $submenuWrapper = $('> .menuHover', $menuItem);

                // grab the menu item's position relative to its positioned parent
                var menuItemPos = $menuItem.position();

                // place the submenu in the correct position relevant to the menu item
                $submenuWrapper.css({
                    top: menuItemPos.top + 62,
                    left: 50
                });
            });

        });
    })(jQuery);
</script>

<asp:Repeater runat="server" ID="menu" OnItemDataBound="menu_ItemDataBound">
    <HeaderTemplate>
        <ul id="nav-items" class="sidebar-nav nav-pills nav-stacked">
    </HeaderTemplate>
    <ItemTemplate>
        <li class="level1Closed">
            <a class="level1 <%# Convert.ToBoolean(Eval("Active")) ? "nodeActive" : "" %>" title="<%# Eval("Title") %>" href="<%# !String.IsNullOrEmpty(Eval("NavigateUrl") as string) ? Eval("NavigateUrl") : "#" %>" target="<%# Eval("Target") %>">
                <span class="menuIcon "><i class="fa <%# Eval("IconFont") %> " aria-hidden="true"></i></span>
                <span class="hideMenuClosed"><%# Eval("Title") %></span>
                <%# Eval("ChildItems") != null ? "<span class='chevron hideMenuClosed' style='float:right'><i class='fa fa-angle-down' aria-hidden='true'></i></span>" : "" %>
            </a>
            <asp:Repeater ID="submenu" runat="server">
                <HeaderTemplate>
                    <ul>
                </HeaderTemplate>
                <ItemTemplate>
                    <li>
                        <a class="level2 <%# Convert.ToBoolean(Eval("Active")) ? "nodeActive" : "" %>" href="<%# Eval("NavigateUrl") %>" target="<%# Eval("Target") %>">
                            <span><%# Eval("Title") %>  </span>
                        </a>
                    </li>
                </ItemTemplate>
                <FooterTemplate>
                    </ul>
                </FooterTemplate>
            </asp:Repeater>

            <ul class="menuHover">
                <a class="menuHoverTitle <%# String.IsNullOrEmpty(Eval("NavigateUrl") as string) ? "disabled" : "" %>" title="<%# Eval("Title") %>" href="<%# !String.IsNullOrEmpty(Eval("NavigateUrl") as string) ? Eval("NavigateUrl") : "#" %>" target="<%# Eval("Target") %>">
                   <span><%# Eval("Title") %>  </span>
                </a>
                <asp:Repeater ID="hovermenu" runat="server">
                    <HeaderTemplate>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <li>
                            <a href="<%# Eval("NavigateUrl") %>" target="<%# Eval("Target") %>">
                                <span><%# Eval("Title") %>  
                            </a>
                        </li>
                    </ItemTemplate>
                </asp:Repeater>
            </ul>
        </li>
    </ItemTemplate>
    <FooterTemplate>
        </ul>
    </FooterTemplate>
</asp:Repeater>