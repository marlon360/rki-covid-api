module.exports = {
    title: 'Robert Koch-Institut API (v2)',
    description: 'An API to fetch COVID-19 data from RKI via JSON',
    dest: 'dist/docs',
    base: '/docs/',
    themeConfig: {
        sidebar: [
            '/',
            '/endpoints/germany'
          ],
        search: true,
        nav: [{
            text: 'Home',
            link: '/'
        },
        {
            text: 'Endpoints',
            ariaLabel: 'Endpoints Menu',
            items: [
                { text: 'Germany', link: '/endpoints/germany.md' },
            ]
        },
        {
            text: 'GitHub',
            link: 'https://github.com/marlon360/rki-covid-api'
        }
        ]
    }
}