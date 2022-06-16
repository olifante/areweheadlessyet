/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    i18n: {
        locales: ['en-gb', 'nl-nl', 'pt-pt'],
        defaultLocale: 'en-gb',
        localeDetection: false,
    },
    sassOptions: {
        // allow all scss files access to these files
        prependData: `@import "/styles/variables.scss"; @import "/styles/mixins.scss"; @import "/styles/fonts.scss"; `,
    },
};
