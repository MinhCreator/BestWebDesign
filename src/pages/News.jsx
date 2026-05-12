import Breadcrumbs from "@components/ui/Breadcrumbs";
import Post from "@api/Post";
import "@css/News.css";

const News = () => {
  return (
    <div className="news-page bg-slate-50">
      <div className="site">
        <main className="news-container">
          <div className="main-column">
            <Breadcrumbs />
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
          <Post />
        </main>
      </div>
    </div>
  );
};

export default News;