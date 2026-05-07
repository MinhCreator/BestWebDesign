import Navbar from '@components/Navbar'
import Footer from '@components/Footer'
import Breadcrumbs from '@components/Breadcrumbs'
import '@css/Rank.css'

const Rank = () => {
  const leaderboardData = [
    { rank: 1, trend: '↑ 3', trendType: 'up', name: 'Ngô Minh Quân', nation: 'VietNam', flag: '/Flags/Vietnam.png', points: 999 },
    { rank: 2, trend: '↑ 1', trendType: 'up', name: 'Nguyễn Văn Thắng', nation: 'LGBT', flag: '/Flags/LGBT.png', points: 666 },
    { rank: 3, trend: '↓ 2', trendType: 'down', name: 'Bùi Võ Nhật Minh', nation: 'VietNam', flag: '/Flags/Vietnam.png', points: 333 },
    { rank: 4, trend: '↓ 2', trendType: 'down', name: 'Đặng Đại Khiêm', nation: 'Thailand', flag: '/Flags/Thailand.png', points: 300 },
    { rank: 5, trend: '↑ 36', trendType: 'up', name: 'Lê Đăng Anh Tuấn', nation: 'LGBT', flag: '/Flags/LGBT.png', points: 236 },
    { rank: 6, trend: '↓ 1', trendType: 'down', name: 'Nguyễn Tiến Trường', nation: 'LGBT', flag: '/Flags/LGBT.png', points: 222 },
  ]

  return (
    <div className="rank-page bg-white min-h-screen">
      <Navbar />

      <main className="rank-container">
        <Breadcrumbs />

        <h1 className="page-title uppercase">Endurance Hub Leaderboard</h1>

        <section className="podium">
          <div className="podium-card place-2">
            <img src="/Avatar/NguyenVanThang.png" alt="Hạng 2" />
          </div>
          <div className="podium-card place-1">
            <img src="/Avatar/NgoMinhQuan.png" alt="Hạng 1" />
          </div>
          <div className="podium-card place-3">
            <img src="/Avatar/BuiVoNhatMinh.png" alt="Hạng 3" />
          </div>
        </section>

        <section className="leaderboard">
          <div className="board-header">
            <div className="col-rank">Rank</div>
            <div className="col-name">Name</div>
            <div className="col-nation">Nation</div>
            <div className="col-point">Points</div>
          </div>

          {leaderboardData.map((item, index) => (
            <div key={index} className="board-row">
              <div className="col-rank">
                <span className="rank-num">{item.rank}</span>
                <span className={`trend ${item.trendType}`}>{item.trend}</span>
              </div>
              <div className="col-fullname">{item.name}</div>
              <div className="col-nation">
                <span className="nation-name">{item.nation}</span>
                <img src={item.flag} alt={item.nation} className="flag" />
              </div>
              <div className="col-numpoints">{item.points}</div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Rank
