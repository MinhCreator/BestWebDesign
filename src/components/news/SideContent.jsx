import { React, useEffect, useState } from "react";
import Loading from "@views/spinner/Loading";
import Post from "../../api/Post";

const SideContent = () => {
  const [activeTab, setActiveTab] = useState("news");

  function showTab(id) {
    setActiveTab(id);
  }

  return (
    <>
      <div className="sidebar">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "news" ? "active" : ""}`}
            onClick={() => showTab("news")}
          >
            Latest News
          </button>
          <button
            className={`tab-btn ${activeTab === "upcomingRace" ? "active" : ""}`}
            onClick={() => showTab("upcomingRace")}
          >
            Upcoming Races
          </button>
        </div>
        <div
          className={`tab-content ${activeTab === "news" ? "active" : ""}`}
          id="news"
        >
          {/* <div className="sidebar-list"> */}
          <Post />
          {/* <div className="sidebar-item">
              <div className="small-image" />
              <div className="sidebar-info">
                <h4>Vietnam Half Marathon Breaks New Record</h4>
                <span>July 18, 2026</span>
              </div>
            </div> */}
          {/* <div className="sidebar-item">
              <div className="small-image" />
              <div className="sidebar-info">
                <h4>HCMC Run 2026 Registration Opens</h4>
                <span>August 05, 2026</span>
              </div>
            </div>
            <div className="sidebar-item">
              <div className="small-image" />
              <div className="sidebar-info">
                <h4>Best Accessories for Runners</h4>
                <span>August 12, 2026</span>
              </div>
            </div>
          </div> */}
        </div>
        <div
          className={`tab-content ${activeTab === "upcomingRace" ? "active" : ""}`}
          id="upcomingRace"
        >
          <div className="sidebar-list">
            <div className="event-item">
              <div className="event-image" />
              <div className="event-info">
                <h4>Da Nang Marathon 2026</h4>
                <span>January 20, 2026</span>
              </div>
            </div>
            <div className="event-item">
              <div className="event-image" />
              <div className="event-info">
                <h4>Hue Heritage Run</h4>
                <span>March 5, 2026</span>
              </div>
            </div>
            <div className="event-item">
              <div className="event-image" />
              <div className="event-info">
                <h4>Vietnam Mountain Marathon</h4>
                <span>April 18, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideContent;
