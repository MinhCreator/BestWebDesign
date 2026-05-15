import  express  from 'express'
import get from 'axios';
import { load }  from 'cheerio';
import "dotenv/config"
import { writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 1000;


async function crawlRaceArticle(url) {
    // const url = 'https://irace.vn/8-loai-vitamin-va-duong-chat-giup-toi-uu-hoa-viec-chay-bo/';

    try {
        console.log(`Fetching data from ${url}...`);
        
        // 1. Fetch the HTML content using axios
        const response = await get(url);
        const html = response.data;

        // 2. Load the HTML into cheerio for parsing
        const cheerioParser = load(html);

        // 3. Extract the Title
        const title = cheerioParser('h1.tdb-title-text').text().trim();

        // 4. Extract Featured Image
        const featuredImage = cheerioParser('.tdb_single_featured_image img').attr('src');

        // 5. Extract Breadcrumbs
        const breadcrumbs = [];
        cheerioParser('.tdb_breadcrumbs span a, .tdb_breadcrumbs .tdb-bred-no-url-last').each((i, el) => {
            const text = cheerioParser(el).text().trim();
            if (text) breadcrumbs.push(text);
        });

        // 6. Extract Categories
        const categories = [];
        cheerioParser('.tdb_single_categories .tdb-entry-category').each((i, el) => {
            categories.push(cheerioParser(el).text().trim());
        });

        // 7. Extract Tags
        const tags = [];
        cheerioParser('.tdb_single_tags .tdb-tags a').each((i, el) => {
            tags.push(cheerioParser(el).text().trim());
        });
        
        // 8. Extract the article paragraphs and images
        const content = [];
        cheerioParser('.tdb_single_content p').each((index, element) => {
            const paragraphText = cheerioParser(element).text().trim();
            if (paragraphText) {
                content.push(paragraphText);
            }
        });

        // 8.5. Extract the article images
        const contentImages = [];
        cheerioParser('.tdb_single_content img').each((index, element) => {
            const imgSrc = cheerioParser(element).attr('src');
            if (imgSrc && !contentImages.includes(imgSrc) && !imgSrc.includes('product.hstatic.net') && !imgSrc.includes('cdn.hstatic.net')) {
                contentImages.push(imgSrc);
            }
        });

        // 9. Extract Related Posts
        const relatedPosts = [];
        cheerioParser('.tdb_single_related .td-module-title a').each((i, el) => {
            relatedPosts.push({
                title: cheerioParser(el).text().trim(),
                link: cheerioParser(el).attr('href')
            });
        });

        // 10. Print the extracted data as JSON
        const crawledData = {
            title,
            featuredImage,
            breadcrumbs,
            categories,
            tags,
            relatedPosts,
            contentImages,
            content
        };
        const filePath = join(__dirname, '/data/blog.json');
        await writeFile(filePath, JSON.stringify(crawledData, null, 2), 'utf8');
        
        console.log("fetching completed...")
        // console.log(JSON.stringify(crawledData, null, 2));
        return JSON.stringify(crawledData, null, 2);        

    } catch (error) {
        console.error('An error occurred while crawling:', error.message);
    }
}

app.get('/api/blog', async (req, res) => {
    try {
        const url = req.query.url || "";
        await crawlRaceArticle(url);
        const filePath = join(__dirname, '/data/blog.json');
        const blog = await readFile(filePath, 'utf8');
        res.json(JSON.parse(blog))
    } catch (error) {
        res.status(500).json({ status: error.message, error: 'No cached data yet' })
    }

})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

