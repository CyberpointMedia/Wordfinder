! function() { var t = sessionStorage.getItem("__SIMPLE_CONFIG__"),
        e = { direction: "ltr", theme: "light", topbar: { color: "light" }, sidenav: { color: "light", view: "default" } }; const i = document.getElementsByTagName("html")[0];
    (config = Object.assign(JSON.parse(JSON.stringify(e)), {})).direction = i.getAttribute("dir") || e.direction, config.theme = i.getAttribute("data-mode") || e.theme, config.topbar.color = i.getAttribute("data-topbar-color") || e.topbar.color, config.sidenav.color = i.getAttribute("data-sidenav-color") || e.sidenav.color, config.sidenav.view = i.getAttribute("data-sidenav-view") || e.sidenav.view, window.defaultConfig = JSON.parse(JSON.stringify(config)), null !== t && (config = JSON.parse(t)), (window.config = config) && (i.setAttribute("dir", config.direction), i.setAttribute("data-mode", config.theme), i.setAttribute("data-topbar-color", config.topbar.color), i.setAttribute("data-sidenav-color", config.sidenav.color), window.innerWidth <= 1140 ? i.setAttribute("data-sidenav-view", "mobile") : i.setAttribute("data-sidenav-view", config.sidenav.view)) }();