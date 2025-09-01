import { getCollection } from 'astro:content';
import { allProjects } from '../lib/projectCollection';
import { projectCollections } from '../projects.config';
import convertToUrl from '../lib/util/convertToUrl';

async function _GET() {
  const siteUrl = import.meta.env.SITE;
  const writing = await getCollection("writing");
  const newsletter = await getCollection("newsletter");



  const result = `  
<?xml version="1.0" encoding="UTF-8"?>  
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">  
  <url>
        <loc>${siteUrl}/</loc>
    </url>
    <url>
        <loc>${siteUrl}/about/</loc>
    </url>
    <url>
        <loc>${siteUrl}/graphic/</loc>
    </url>
    <url>
        <loc>${siteUrl}/newsletter/</loc>
    </url>
    <url>
        <loc>${siteUrl}/subscribe/</loc>
    </url>
    <url>
        <loc>${siteUrl}/projects/</loc>
    </url>
  ${writing
    .map((post) => {
      const lastMod = (post.data.date).toISOString();
      return `<url><loc>${siteUrl}/writing/${post.id}/</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('\n')}  
  ${newsletter
    .map((post) => {
      const lastMod = (post.data.date).toISOString();
      return `<url><loc>${siteUrl}/newsletter/${post.id}/</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('\n')}  

  ${Object.keys(projectCollections)
    .map((collection) => {
      const lastMod = (new Date("2025-07-25")).toISOString();
      return `<url><loc>${siteUrl}/projects/${collection}?sort=type</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('\n')} 
  ${allProjects
    .map((project) => {
      const lastMod = (project.data.date).toISOString();
      return `<url><loc>${siteUrl}/projects/${project.data.date.getFullYear()}/${convertToUrl(project.data.title)}/</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('\n')} 
</urlset>  
  `.trim();

  return new Response(result, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}