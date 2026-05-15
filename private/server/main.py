import json
import os
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from module.NewCrawl import crawl_irace_news 
from module.tip_and_trick import crawl_irace_triathlon 
from module.utilities import getPost
from module.crawl_article import crawl_single_article
app = FastAPI()
outputPath = "/output"

canAccess = [
    "http://localhost:2007",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=canAccess,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/articles")
async def articles() -> dict:
    try:
        with open(f"{os.getcwd()}{outputPath}/articles.json", "r", encoding="utf-8") as f:
            jsonLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            return jsonLoaded
    except:
        crawl_irace_news()
        with open(f"{os.getcwd()}{outputPath}/articles.json", "r", encoding="utf-8") as f:
            jsonLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            return  jsonLoaded
    else:
        raise HTTPException(status_code=404, detail="Not Found")

@app.get("/api/posts")
async def posts() -> dict:
    try:
        with open(f"{os.getcwd()}{outputPath}/post.json", "r", encoding="utf-8") as f:
            postLoaded ={f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            return postLoaded
    except:
        crawl_irace_triathlon()
        with open(f"{os.getcwd()}{outputPath}/post.json", "r", encoding="utf-8") as f:
            postLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            return 
    else:
        raise HTTPException(status_code=404, detail="Not Found")

@app.get("/api/posts/")
async def limit(page: int, limit: int) -> dict:
    try:
        with open(f"{os.getcwd()}{outputPath}/post.json", "r", encoding="utf-8") as f:
            postLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            postLimit = getPost(page, limit, postLoaded)
            return {f"article-{index + 1}": data for index, data in enumerate(postLimit)}
    except:
        crawl_irace_triathlon()
        with open(f"{os.getcwd()}{outputPath}/post.json", "r", encoding="utf-8") as f:
            postLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            postLimit = getPost(page, limit, postLoaded)
            return {f"article-{index + 1}": data for index, data in enumerate(postLimit)}
    else:
        raise HTTPException(status_code=404, detail="Not Found")

@app.get("/api/blog")
async def blog(url: str = ""):
    if not url:
        raise HTTPException(status_code=400, detail="url query parameter is required")
    try:
        output_dir = f"{os.getcwd()}{outputPath}/"
        data = crawl_single_article(url, output_dir=output_dir)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    status = {"status": "ok"}
    not_ok = {"status": "offline"}
    return {
        "article": f"{status if articles != {} and articles != {'detail': 'Not Found'} else not_ok}",
        "post": f"{status if posts != {} and posts != {'detail': 'Not Found'} else not_ok}",    
        "post_limit": f"{status if limit(1, 4) != {} and limit(1, 4) != {'detail': 'Not Found'} else not_ok}",
        "blog": f"{status if blog('') != {} and blog('') != {'detail': 'Not Found'} else not_ok}"    
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


