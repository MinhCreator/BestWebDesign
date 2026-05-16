import os
import json
from typing import Optional
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def crawl_single_article(url: str, output_dir: Optional[str] = None) -> dict:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    print(f"Fetching article from {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        raise

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.select_one("h1.tdb-title-text")
    title = title.get_text(strip=True) if title else ""

    featured_img = soup.select_one(".tdb_single_featured_image img")
    raw_src = featured_img.get("src") if featured_img else None
    featured_image = str(raw_src) if raw_src else None
    if featured_image:
        featured_image = urljoin(url, featured_image)

    breadcrumbs = []
    for el in soup.select(".tdb_breadcrumbs span a, .tdb_breadcrumbs .tdb-bred-no-url-last"):
        text = el.get_text(strip=True)
        if text:
            breadcrumbs.append(text)

    categories = []
    for el in soup.select(".tdb_single_categories .tdb-entry-category"):
        text = el.get_text(strip=True)
        if text:
            categories.append(text)

    tags = []
    for el in soup.select(".tdb_single_tags .tdb-tags a"):
        text = el.get_text(strip=True)
        if text:
            tags.append(text)

    content = []
    for el in soup.select(".tdb_single_content p"):
        text = el.get_text(strip=True)
        if text:
            content.append(text)

    content_images = []
    for el in soup.select(".tdb_single_content img"):
        raw = el.get("src")
        src = str(raw) if raw else ""
        if src and src not in content_images:
            if "product.hstatic.net" not in src and "cdn.hstatic.net" not in src:
                content_images.append(urljoin(url, src))

    related_posts = []
    for el in soup.select(".tdb_single_related .td-module-title a"):
        raw_link = el.get("href")
        link = str(raw_link) if raw_link else None
        related_posts.append({
            "title": el.get_text(strip=True),
            "link": urljoin(url, link) if link else None
        })

    crawled_data = {
        "title": title,
        "featuredImage": featured_image,
        "breadcrumbs": breadcrumbs,
        "categories": categories,
        "tags": tags,
        "relatedPosts": related_posts,
        "contentImages": content_images,
        "content": content
    }

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(output_dir, "blog.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(crawled_data, f, ensure_ascii=False, indent=2)
        print(f"Saved to {file_path}")

    print("Fetching completed...")
    return crawled_data
