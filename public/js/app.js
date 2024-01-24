lucide.createIcons();
class ThemeCustomizer {
    constructor() { this.html = document.getElementsByTagName("html")[0], this.config = {}, this.defaultConfig = window.config }
    initConfig() { this.defaultConfig = JSON.parse(JSON.stringify(window.defaultConfig)), this.config = JSON.parse(JSON.stringify(window.config)), this.setSwitchFromConfig() }
    initSidenav() {
        var e = window.location.href.split(/[?#]/)[0];
        document.querySelectorAll("ul.menu a.menu-link").forEach(t => {
            if (t.href === e) {
                t.classList.add("active");
                let e = t.parentElement.parentElement.parentElement;
                e && e.classList.contains("menu-item") && (t = e.querySelector("[data-hs-collapse]")) && (t = t.nextElementSibling) && HSCollapse.show(t)
            }
        });
        const i = document.querySelectorAll("ul.menu .sub-menu");
        i.forEach(e => { e.addEventListener("open.hs.collapse", t => { i.forEach(e => { e !== t.target && HSCollapse.hide(e) }) }) }), setTimeout(function() {
            var e, n, o, c, a, d, t = document.querySelector("ul.menu .active");

            function r() {
                e = d += 20, t = c, i = a;
                var e, t, i = (e /= o / 2) < 1 ? i / 2 * e * e + t : -i / 2 * (--e * (e - 2) - 1) + t;
                n.scrollTop = i, d < o && setTimeout(r, 20)
            }
            null != t && (e = document.querySelector(".app-menu .simplebar-content-wrapper"), t = t.offsetTop - 300, e && 100 < t && (o = 600, c = (n = e).scrollTop, a = t - c, d = 0, r()))
        }, 200)
    }
    reverseQuery(e, t) {
        for (; e;) {
            if (e.parentElement && e.parentElement.querySelector(t) === e) return e;
            e = e.parentElement
        }
        return null
    }
    changeThemeDirection(e) { this.config.direction = e, this.html.setAttribute("dir", e), this.setSwitchFromConfig() }
    changeThemeMode(e) { this.config.theme = e, this.html.setAttribute("data-mode", e), this.setSwitchFromConfig() }
    changeTopbarColor(e) { this.config.topbar.color = e, this.html.setAttribute("data-topbar-color", e), this.setSwitchFromConfig() }
    changeSidenavColor(e) { this.config.sidenav.color = e, this.html.setAttribute("data-sidenav-color", e), this.setSwitchFromConfig() }
    changeSidenavView(e, t = !0) { this.html.setAttribute("data-sidenav-view", e), t && (this.config.sidenav.view = e, this.setSwitchFromConfig()) }
    resetTheme() { this.config = JSON.parse(JSON.stringify(window.defaultConfig)), this.changeThemeDirection(this.config.direction), this.changeThemeMode(this.config.theme), this.changeTopbarColor(this.config.topbar.color), this.changeSidenavColor(this.config.sidenav.color), this.changeSidenavView(this.config.sidenav.view), this.adjustLayout() }
    initSwitchListener() {
        var i = this,
            e = document.getElementById("light-dark-mode"),
            e = (e && e.addEventListener("click", function(e) { "light" === i.config.theme ? i.changeThemeMode("dark") : i.changeThemeMode("light") }), document.querySelector("#button-toggle-menu")),
            e = (e && e.addEventListener("click", function() {
                var e = i.config.sidenav.view,
                    t = i.html.getAttribute("data-sidenav-view", e);
                "mobile" === t ? (i.showBackdrop(), i.html.classList.toggle("sidenav-enable")) : "hidden" == e ? "hidden" === t ? i.changeSidenavView("hidden" == e ? "default" : e, !1) : i.changeSidenavView("hidden", !1) : "condensed" === t ? i.changeSidenavView("condensed" == e ? "default" : e, !1) : i.changeSidenavView("condensed", !1)
            }), document.querySelectorAll("input[name=dir]").forEach(function(t) { t.addEventListener("change", function(e) { i.changeThemeDirection(t.value) }) }), document.querySelectorAll("input[name=data-mode]").forEach(function(t) { t.addEventListener("change", function(e) { i.changeThemeMode(t.value) }) }), document.querySelectorAll("input[name=data-topbar-color]").forEach(function(t) { t.addEventListener("change", function(e) { i.changeTopbarColor(t.value) }) }), document.querySelectorAll("input[name=data-sidenav-color]").forEach(function(t) { t.addEventListener("change", function(e) { i.changeSidenavColor(t.value) }) }), document.querySelectorAll("input[name=data-sidenav-view]").forEach(function(t) { t.addEventListener("change", function(e) { i.changeSidenavView(t.value) }) }), document.querySelector("#reset-layout"));
        e && e.addEventListener("click", function(e) { i.resetTheme() })
    }
    showBackdrop() {
        const e = document.createElement("div"),
            t = (e.id = "backdrop", e.classList = "transition-all fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80", document.body.appendChild(e), document.getElementsByTagName("html")[0] && (document.body.style.overflow = "hidden", 1140 < window.innerWidth && (document.body.style.paddingRight = "15px")), this);
        e.addEventListener("click", function(e) { t.html.classList.remove("sidenav-enable"), t.hideBackdrop() })
    }
    hideBackdrop() {
        var e = document.getElementById("backdrop");
        e && (document.body.removeChild(e), document.body.style.overflow = null, document.body.style.paddingRight = null)
    }
    initWindowSize() {
        var t = this;
        window.addEventListener("resize", function(e) { t.adjustLayout() })
    }
    adjustLayout() { window.innerWidth <= 1140 ? this.changeSidenavView("mobile", !1) : this.changeSidenavView(this.config.sidenav.view) }
    setSwitchFromConfig() {
        sessionStorage.setItem("__SIMPLE_CONFIG__", JSON.stringify(this.config)), document.querySelectorAll("#theme-customization input[type=checkbox]").forEach(function(e) { e.checked = !1 });
        var e, t, i, n, o = this.config;
        o && (e = document.querySelector("input[type=checkbox][name=dir][value=" + o.direction + "]"), t = document.querySelector("input[type=checkbox][name=data-mode][value=" + o.theme + "]"), i = document.querySelector("input[type=checkbox][name=data-topbar-color][value=" + o.topbar.color + "]"), n = document.querySelector("input[type=checkbox][name=data-sidenav-color][value=" + o.sidenav.color + "]"), o = document.querySelector("input[type=checkbox][name=data-sidenav-view][value=" + o.sidenav.view + "]"), e && (e.checked = !0), t && (t.checked = !0), i && (i.checked = !0), n && (n.checked = !0), o && (o.checked = !0))
    }
    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        } else {
            console.error(`Dropdown with ID ${dropdownId} not found.`);
        }
    }
    init() { this.initConfig(), this.initSidenav(), this.initSwitchListener(), this.initWindowSize(), this.adjustLayout(), this.setSwitchFromConfig() }
}(new ThemeCustomizer).init();
const themeCustomizer = new ThemeCustomizer();
themeCustomizer.init();