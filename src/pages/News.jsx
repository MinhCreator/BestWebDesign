import React, { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Loading from "@components/news/Loading";
import { AppConfig } from "@config/app.config";
import "@css/News.css";

const style = [{}, {}];

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        // FastAPI returns {0: {...}, 1: {...}, ...} — convert to array
        const articles = Object.values(json);
        setNewsData(articles);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="news-page min-h-screen bg-slate-50">
      <Navbar />

      <div className="site">
        <main className="news-container">
          <div className="main-column">
            <section className="event-section">
              <div className="event-header upcoming">
                <h2>Upcoming Running Events</h2>
              </div>

              <div className="event-list">
                <article className="event-card">
                  <img src="/src/public/marathon1.jpg" />
                  <div className="event-info">
                    <h3>Da Nang International Marathon 2026</h3>
                    <p>Date: May 25, 2026</p>
                    <p>Location: Da Nang</p>
                  </div>
                </article>

                <article className="event-card">
                  <img src="/src/public/marathon2.jpg" />
                  <div className="event-info">
                    <h3>Hue Half Marathon</h3>
                    <p>Date: June 10, 2026</p>
                    <p>Location: Hue</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="event-section">
              <div className="event-header live">
                <h2>Ongoing Running Events</h2>
              </div>

              <div className="event-list">
                <article className="event-card">
                  <img src="/src/public/live1.jpg" />
                  <div className="event-info">
                    <h3>Quang Tri Community Run</h3>
                    <p>Status: Live Now</p>
                    <p>Distance: 10km</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="event-section">
              <div className="event-header past">
                <h2>Past Running Events</h2>
              </div>

              <div className="event-list">
                <article className="event-card">
                  <img src="/src/public/past1.jpg" />
                  <div className="event-info">
                    <h3>Ho Chi Minh Marathon 2025</h3>
                    <p>Finished: Dec 2025</p>
                    <p>Winner: Nguyen Van A</p>
                  </div>
                </article>

                <article className="event-card">
                  {/* <img src="/src/public/past2.jpg" />
                  <div className="event-info">
                    <h3>Vietnam Trail Challenge</h3>
                    <p>Finished: Nov 2025</p>
                    <p>Distance: 42km</p>
                  </div> */}
                </article>
              </div>
            </section>
          </div>

          <aside className="sidebar-column">
            <div className="sidebar-box">
              <div className="sidebar-tabs">
                <div className="tab active">News</div>
              </div>

              <div className="sidebar-content">
                {loading && <Loading />}
                {error && <p className="sidebar-error">Failed to load news: {error}</p>}
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
                    )
                  }
                  return <Loading />
                })}
              </div>

              <div className="sidebar-footer">
                <button className="btn-more"> View More </button>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default News;
