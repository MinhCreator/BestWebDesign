import { React } from "react";
import Loading from "../views/spinner/Loading";
import { useArticles } from "../hooks/useArticles";

const Post = () => {
  const { data: articles, isLoading, error } = useArticles();

  if (isLoading) return <Loading />;
  if (error) return <Loading />;

  return (
    <>
      <div className="sidebar-list max-h-230">
        {articles.length === 0 && (
          <p className="sidebar-empty">No news available.</p>
        )}
        {articles.map((article, index) => {
          if (article.image_url != "") {
            return (
              <div className="sidebar-item" key={index}>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="small-image w-auto h-auto">
                    {article.image_url && (
                      <img src={article.image_url} alt={article.title} />
                    )}
                  </div>
                  <div className="sidebar-info">
                    <h4>{article.title}</h4>
                    <span>{article.date}</span>
                  </div>
                </a>
              </div>
            );
          }
          return <Loading />;
        })}
      </div>
    </>
  );
};

export default Post;
