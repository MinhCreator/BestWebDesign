import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from module.NewCrawl import crawl_irace_news
app = FastAPI()


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


@app.get("/api")
async def api() -> dict:
    try:
        with open(f"{os.getcwd()}/articles.json", "r", encoding="utf-8") as f:
            return {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
    except:
        await crawl_irace_news()
        with open(f"{os.getcwd()}/articles.json", "r", encoding="utf-8") as f:
            return {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}

    else:
        raise HTTPException(status_code=404, detail="Not Found")



if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    app.run()