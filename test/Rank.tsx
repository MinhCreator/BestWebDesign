import React from "react";

export default function Rank() {
  return (
    <section className="leaderboard">
      <h1>I RUN LEADERBOARD</h1>

      <div className="filter-wrapper">
        <div className="filter-group">
          <label>All Distance</label>
          <select>
            <option>All Distance</option>
            <option>5KM</option>
            <option>10KM</option>
            <option>21KM Half Marathon</option>
            <option>42KM Marathon</option>
          </select>
        </div>

        <div className="filter-group">
          <label>All Event</label>
          <select>
            <option>All Event</option>
            <option>Da Nang Marathon</option>
            <option>Ho Chi Minh City Run</option>
            <option>Tokyo Marathon</option>
            <option>New York Marathon</option>
          </select>
        </div>
      </div>

      <div className="top-runner">
        <div className="top-card second">
          <div className="runner">
            <img src="../images/Avatar/2.svg" alt="" />
          </div>
          <h2>Yohan Blake</h2>
          <p>TOP 2</p>
        </div>

        <div className="top-card first">
          <div className="runner">
            <img src="../images/Avatar/1.svg" alt="" />
          </div>
          <h2>Li Wei</h2>
          <p>TOP 1</p>
        </div>

        <div className="top-card third">
          <div className="runner">
            <img src="../images/Avatar/3.svg" alt="" />
          </div>
          <h2>Yuki Kawauchi</h2>
          <p>TOP 3</p>
        </div>
      </div>

      <div className="table-box">
        <div className="table-header">
          <span>Rank</span>
          <span>Name</span>
          <span>Nation</span>
          <span>Time Run</span>
        </div>

        <div className="table-row">
          <span className="rank gold">1</span>
          <span>Li Wei</span>
          <span className="nation">
            China
            <img src="../images/Flags/china.svg" alt="" />
          </span>
          <span>01:49:32</span>
        </div>

        <div className="table-row">
          <span className="rank silver">2</span>
          <span>Yohan Blake</span>
          <span className="nation">
            Jamaica
            <img src="../images/Flags/Jamaica.svg" alt="" />
          </span>
          <span>01:54:11</span>
        </div>

        <div className="table-row">
          <span className="rank bronze">3</span>
          <span>Yuki Kawauchi</span>
          <span className="nation">
            Japan
            <img src="../images/Flags/japan.svg" alt="" />
          </span>
          <span>01:58:47</span>
        </div>

        <div className="table-row">
          <span className="rank">4</span>
          <span>Nguyễn Minh Quân</span>
          <span className="nation">
            Vietnam
            <img src="../images/Flags/vietnam.svg" alt="" />
          </span>
          <span>02:03:15</span>
        </div>

        <div className="table-row">
          <span className="rank">5</span>
          <span>Barry Allen</span>
          <span className="nation">
            USA
            <img src="../images/Flags/USA.svg" alt="" />
          </span>
          <span>02:06:42</span>
        </div>

        <div className="table-row">
          <span className="rank">6</span>
          <span>Bùi Ngô Đại Thắng</span>
          <span className="nation">
            Vietnam
            <img src="../images/Flags/vietnam.svg" alt="" />
          </span>
          <span>02:12:56</span>
        </div>
      </div>
    </section>
  );
}
