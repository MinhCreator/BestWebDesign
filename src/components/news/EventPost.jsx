import { React, useEffect, useState } from "react";
// import Loading from "@components/news/Loading";
import Loading from "@views/spinner/Loading";

const Post = () => {
    const [newsData, setNewsData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("/api/posts");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            // FastAPI returns {0: {...}, 1: {...}, ...} — convert to array
            const articles = Object.values(json);
            setNewsData(articles);
          } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(true)
            setNewsData([])
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

  return (
    <>
      <aside className="sidebar-column">
        <div className="sidebar-box">
          <div className="sidebar-tabs">
            <div className="tab active">News</div>
          </div>

          <div className="sidebar-content">
            {loading && <Loading />}
            {error && (
              // <p className="sidebar-error">Failed to load news: {error}</p>
              <Loading />
            )}
            {!loading && !error && newsData.length === 0 && (
              <p className="sidebar-empty">No news available.</p>
            )}
            {newsData.map((article, index) => {
              if (article.image_url != "") {
                return (
                  <a
                    key={index}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-item"
                  >
                    {article.image_url && (
                      <img src={article.image_url} alt={article.title} />
                    )}
                    <h4>{article.title}</h4>
                  </a>
                );
              }
              return <Loading />;
            })}
          </div>

          <div className="sidebar-footer">
            <button className="btn-more"> View More </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Post;