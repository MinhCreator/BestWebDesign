from calendar import c
import json
import os
import re
from bs4 import BeautifulSoup
import requests


def crawl_irace_triathlon():
    url = "https://irace.vn/triathlon/chay-bo-cung-irace-vi/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Newspaper theme uses modules like td_module_flex_1, tdb_module_loop, etc.
    # We use a regex to find all divs that look like article containers
    article_containers = soup.find_all('div', class_=re.compile(r"td[b]?_module_"))
    
    articles = []

    for container in article_containers:
        # 1. Title and Link
        # Look for the link inside h2, h3, or a directly
        link_tag = container.find('a', rel='bookmark')
        if not link_tag:
            link_tag = container.select_one('.entry-title a, .td-module-title a, .tdb-module-title a')
        
        if link_tag:
            title = link_tag.get('title') or link_tag.get_text(strip=True)
            link = link_tag.get('href')
        else:
            continue # Skip if no link/title

        # 2. Excerpt
        # Sometimes it's in .td-excerpt or similar
        excerpt_tag = container.find(['div', 'p'], class_=re.compile(r"excerpt|post-text-content"))
        excerpt = excerpt_tag.get_text(strip=True) if excerpt_tag else ""

        # 3. Date
        # Look for <time> element
        date_tag = container.find('time')
        date = ""
        if date_tag:
            date = date_tag.get('datetime') or date_tag.get_text(strip=True)

        # 4. Image
        # Check for <img> tag or <span> with background image
        img_url = ""
        # Look for data-img-url first (common in this theme)
        img_element = container.find(['span', 'img'], attrs={"data-img-url": True})
        if img_element:
            img_url = img_element.get('data-img-url')
        
        if not img_url:
            img_tag = container.find('img')
            if img_tag:
                img_url = img_tag.get('data-src') or img_tag.get('src') or ""

        articles.append({
            "title": title,
            "link": link,
            "excerpt": excerpt,
            "date": date,
            "image_url": img_url
        })

    # Deduplicate articles based on link (sometimes things are listed twice in different blocks)
    unique_articles = []
    seen_links = set()
    for article in articles:
        if article['link'] not in seen_links:
            unique_articles.append(article)
            seen_links.add(article['link'])

    print(f"Successfully crawled {len(unique_articles)} articles.")
    # Save to JSON
    with open(f'{os.getcwd()}/output/post.json', 'w', encoding='utf-8') as f:
        json.dump(unique_articles, f, ensure_ascii=False, indent=4)
    print("Data saved to post.json")

    # Print first few articles for verification
    # for index, article in enumerate(unique_articles):
    #     print(f"\n--- Article {index+1} ---")
    #     print(f"Title: {article['title']}")
    #     print(f"Link: {article['link']}")
    #     print(f"image_url: {article['image_url']}")
    #     print(f"Date: {article['date']}")

    # Source - https://stackoverflow.com/a/5236499
# Posted by phynfo, modified by community. See post 'Timeline' for change history
# Retrieved 2026-05-04, License - CC BY-SA 4.0

# Posted by phynfo, modified by community. See post 'Timeline' for change history
# Retrieved 2026-05-04, License - CC BY-SA 4.0
# with open(f"{os.getcwd()}/private/server/post.json", "r", encoding="utf-8") as f:
#     jsons = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
#     key = list(jsons.keys())
#     print(jsons[key[0]]["title"])
if __name__ == "__main__":
    crawl_irace_triathlon()