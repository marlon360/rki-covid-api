module.exports = {
  title: "Robert Koch-Institut COVID-19 API - von Marlon Lückert",
  description:
    "Eine REST API (JSON), die alle relevanten Zahlen zur Corona Lage in Deutschland liefert, basierend auf den Daten des RKI. Inzidenzen, Fälle, Hospitalisierung, Altersgruppen, Impfquote.",
  dest: "dist/docs",
  base: "/docs/",
  head: [
    [
      "script",
      {
        async: "",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1283448820212568",
        crossorigin: "anonymous",
      },
    ],
  ],
  themeConfig: {
    sidebar: [
      {
        title: "Start", // required
        path: "/", // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: ["/"],
      },
      {
        title: "Endpoints",
        children: [
          {
            title: "Germany 🇩🇪",
            path: "/endpoints/germany",
          },
          {
            title: "States",
            path: "/endpoints/states",
          },
          {
            title: "Districts",
            path: "/endpoints/districts",
          },
          {
            title: "Vaccinations 💉",
            path: "/endpoints/vaccinations",
          },
          {
            title: "Maps 🗺",
            path: "/endpoints/maps",
          },
          {
            title: "Testing",
            path: "/endpoints/testing",
          },
        ],
      },
    ],
    search: true,
    nav: [
      {
        text: "Home",
        link: "/",
      },
      {
        text: "GitHub",
        link: "https://github.com/marlon360/rki-covid-api",
      },
    ],
  },
};
