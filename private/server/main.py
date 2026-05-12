import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from module.NewCrawl import crawl_irace_news 
from module.tip_and_trick import crawl_irace_triathlon 
from module.utilities import getPost
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
        await crawl_irace_news()
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
        await crawl_irace_triathlon()
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
        await crawl_irace_triathlon()
        with open(f"{os.getcwd()}{outputPath}/post.json", "r", encoding="utf-8") as f:
            postLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            postLimit = getPost(page, limit, postLoaded)
            return {f"article-{index + 1}": data for index, data in enumerate(postLimit)}
    else:
        raise HTTPException(status_code=404, detail="Not Found")


if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    app.run()