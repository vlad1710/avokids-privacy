// Shows the <article lang="xx"> for ?lang=xx, else the browser language, else English.
(function () {
  var names = { en: "English", uk: "Українська", ru: "Русский", es: "Español", el: "Ελληνικά" };
  var articles = Array.prototype.slice.call(document.querySelectorAll("article[lang]"));
  var available = articles.map(function (a) { return a.getAttribute("lang"); });

  function pick() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && available.indexOf(q) >= 0) return q;
    var langs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).slice(0, 2).toLowerCase();
      if (available.indexOf(l) >= 0) return l;
    }
    return "en";
  }

  function show(lang) {
    articles.forEach(function (a) { a.classList.toggle("active", a.getAttribute("lang") === lang); });
    document.documentElement.lang = lang;
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    var url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    document.querySelectorAll("a[data-keep-lang]").forEach(function (a) {
      var u = new URL(a.getAttribute("href"), location.href);
      u.searchParams.set("lang", lang);
      a.href = u.pathname + u.search;
    });
  }

  var nav = document.querySelector("nav.langs");
  var buttons = available.map(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.dataset.lang = l;
    b.textContent = names[l] || l;
    b.addEventListener("click", function () { show(l); });
    nav.appendChild(b);
    return b;
  });
  show(pick());
})();
// /support#delete: jump to the deletion section of the language that is shown
(function () {
  if (location.hash !== "#delete") return;
  var h = document.querySelector("article.active .anchor-delete");
  if (h) h.scrollIntoView();
})();
