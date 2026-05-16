import json
import os
import re


def getPost(start: int, end: int, article: dict) -> dict:
    if start < 0:
        start = 0
    if end > len(article):
        end = len(article)

    # for pageCard in range(start, end):
    return [article[f"article-{pageCard + 1}"] for pageCard in range(start, end)]

"""
test function
"""
# with open(f"{os.getcwd()}/private/server/post.json", "r", encoding="utf-8") as f:
#             postLoaded = {f"article-{index + 1}": data for index, data in enumerate(json.load(f))}
            
#             afterPro = getPost(0, 2, postLoaded)
#             print({f"article-{index + 1}": data for index, data in enumerate(afterPro)})