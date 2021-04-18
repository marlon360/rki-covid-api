module.exports = {
    title: 'Robert Koch-Institut API (v2)',
    description: 'An API to fetch COVID-19 data from RKI via JSON',
    dest: 'dist/docs',
    base: '/docs/',
    themeConfig: {
        sidebar: [
            {
              title: 'Start',   // required
              path: '/',      // optional, link of the title, which should be an absolute path and must exist
              collapsable: false, // optional, defaults to true
              sidebarDepth: 1,    // optional, defaults to 1
              children: [
                '/'
              ]
            },
            {
              title: 'Endpoints',
              children: [{
                  title: 'Germany 🇩🇪',
                  path: '/endpoints/germany'
              },{
                  title: 'States',
                  path: '/endpoints/states'
              },{
                  title: 'Districts',
                  path: '/endpoints/districts'
              },{
                  title: 'Vaccinations 💉',
                  path: '/endpoints/vaccinations'
              },{
                  title: 'Maps 🗺',
                  path: '/endpoints/maps'
              },{
                  title: 'Testing',
                  path: '/endpoints/testing'
              }]
            }
        ],
        search: true,
        nav: [{
            text: 'Home',
            link: '/'
        },
        {
            text: 'GitHub',
            link: 'https://github.com/marlon360/rki-covid-api'
        }
        ]
    }
}