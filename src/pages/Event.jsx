import Navbar from '@components/Navbar'
import Footer from '@components/Footer'
import '@css/Event.css'
import Breadcrumbs from '@components/Breadcrumbs'

const Event = () => {
  const stats = [
    { label: 'DISTANCE', value: '6.21', unit: 'Miles', pct: '100%', color: 'orange', icon: 'fa-route' },
    { label: 'DURATION', value: '0:49:15', unit: '', pct: '75%', color: 'blue', icon: 'fa-clock' },
    { label: 'AVG PACE', value: '7:56', unit: '/mile', pct: '80%', color: 'green', icon: 'fa-running' },
    { label: 'AVG HR', value: '158', unit: 'BPM', pct: '85%', color: 'red', icon: 'fa-heartbeat' },
    { label: 'ELEVATION', value: '320', unit: 'ft', pct: '60%', color: 'purple', icon: 'fa-mountain' },
    { label: 'CALORIES', value: '300', unit: 'kcal', pct: '65%', color: 'orange-dark', icon: 'fa-fire' },
  ]

  const splits = [
    { km: 1, pace: '5:12', hr: 145 },
    { km: 2, pace: '5:05', hr: 152 },
    { km: 3, pace: '4:58', hr: 158, fastest: true },
    { km: 4, pace: '5:15', hr: 162 },
    { km: 5, pace: '5:20', hr: 165 },
  ]

  return (
    <div className="event-page min-h-screen">
      <Navbar />

      <main className="event-container">
        <div className="main-column">
        <Breadcrumbs />
          <div className="box">
            <div className="box-header">Marathon route</div>
            <div className="map-content">
              <img
                src="http://navitelvietnam.com/wp-content/uploads/2016/03/wp_ss_20160311_0001.png"
                alt="GPS Route"
                className="gps-image"
              />
            </div>
          </div>

          <div className="box">
            <div className="box-header">CHỈ SỐ HIỆU SUẤT THEO QUÃNG ĐƯỜNG</div>
            <div className="placeholder-box h-[250px] flex items-center justify-center text-slate-400 font-medium bg-slate-50">
              Performance Chart Area
            </div>
          </div>
        </div>

        <div className="side-column">
          <div className="box stats-main-box">
            <div className="box-header">THỐNG KÊ HOẠT ĐỘNG CHÍNH</div>
            <div className="stats-list">
              {stats.map((stat, index) => (
                <div key={index} className={`stat-item ${stat.color}`}>
                  <div className="s-label">{stat.label}</div>
                  <div className="s-logo text-slate-500">
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <div className="s-right">
                    <span className="s-value">
                      {stat.value} {stat.unit && <small>{stat.unit}</small>}
                    </span>
                    <div className="circle-box">
                      <svg viewBox="0 0 36 36">
                        <path
                          className="c-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="c-fill"
                          strokeDasharray={`${stat.pct.replace('%', '')}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="pct">{stat.pct}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="box">
            <div className="box-header">PHÂN TÍCH CHẶNG (KM SPLITS)</div>
            <div className="split-table-container">
              <table className="split-table">
                <thead>
                  <tr>
                    <th>KM</th>
                    <th>PACE</th>
                    <th>NHỊP TIM</th>
                  </tr>
                </thead>
                <tbody>
                  {splits.map((split, index) => (
                    <tr key={index} className={split.fastest ? 'fastest' : ''}>
                      <td>{split.km}</td>
                      <td>{split.pace}</td>
                      <td>{split.hr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Event
