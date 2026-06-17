/* Routewright — progressive enhancement.
   1) Refresh the volatile GitHub numbers client-side, overwriting the baked
      snapshot. On any failure (rate limit, offline, repo still private) the
      baked values simply remain. No spinners, no layout shift.
   2) Reveal sections on scroll. */
(function () {
  "use strict";

  // ── GitHub live refresh ──────────────────────────────────────────────
  var OWNER = "{{ .Site.Params.ghOwner }}";
  var REPO = "{{ .Site.Params.ghRepo }}";
  var FIELDS = {
    stars: "stargazers_count",
    forks: "forks_count",
    issues: "open_issues_count",
    watchers: "subscribers_count"
  };

  var nf = (typeof Intl !== "undefined" && Intl.NumberFormat)
    ? new Intl.NumberFormat("en-US")
    : { format: function (n) { return String(n); } };

  function paint(repo) {
    Object.keys(FIELDS).forEach(function (key) {
      var val = repo[FIELDS[key]];
      if (typeof val !== "number") return;
      document.querySelectorAll('[data-gh="' + key + '"]').forEach(function (el) {
        el.textContent = nf.format(val);
        el.removeAttribute("data-pending");
      });
    });
  }

  function refresh() {
    if (!OWNER || !REPO || !window.fetch) return;
    var url = "https://api.github.com/repos/" + OWNER + "/" + REPO;
    fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (repo) { if (repo && repo.full_name) paint(repo); })
      .catch(function () { /* keep baked snapshot */ });
  }

  // ── scroll reveal ────────────────────────────────────────────────────
  function reveal() {
    var items = document.querySelectorAll(".fx");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState !== "loading") { refresh(); reveal(); }
  else document.addEventListener("DOMContentLoaded", function () { refresh(); reveal(); });
})();
