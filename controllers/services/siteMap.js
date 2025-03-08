const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const path = require("path")
const fs = require('fs');
const getProfileForSiteMap = require('./getProfilesForSiteMap');

const siteMap = async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');

        const smStream = new SitemapStream({ hostname: 'https://asfischolar.org' });
        const pipeline = smStream.pipe(createGzip());

        // Add dynamic URLs
        smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/dashboard', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/feed', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/library', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/Directory', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/Tutorials', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/Podcasts', changefreq: 'daily', priority: 1.0 });


        smStream.write({ url: '/aboutUS', changefreq: 'weekly', priority: 0.8 });
        smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
        smStream.write({ url: '/register', changefreq: 'monthly', priority: 0.5 });
        smStream.write({ url: '/login', changefreq: 'monthly', priority: 0.5 });
        smStream.write({ url: '/home', changefreq: 'monthly', priority: 0.5 });




        // get user profiles from the database
        const pages = await getProfileForSiteMap();
        pages.forEach(page => smStream.write({ url: `/v/${page.username}`, changefreq: 'weekly', priority: 0.7 }));

        smStream.end();

        streamToPromise(pipeline).then(sm => {
           // Define the correct path to the public directory in the parent folder
        // const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml.gz');
        const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml.gz');


        fs.writeFileSync(sitemapPath, sm);
        });

        pipeline.pipe(res).on('error', (err) => { throw err; });
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}

module.exports = siteMap
