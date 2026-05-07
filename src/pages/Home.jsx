import Navbar from '@components/Navbar'
import Footer from '@components/Footer'
import Hero from '@components/Hero';
import RaceSlider from '@components/RaceSlider';
import CommunitySection from '@components/CommunitySection';
import TrainingSection from '@components/TrainingSection';
import '@css/Home.css'

const Home = () => {
  return (
    <div className="home-page min-h-screen bg-slate-50">
      <Navbar />

       <main className="pt-20">
        <Hero />
        <RaceSlider />
        <CommunitySection />
        <TrainingSection />
      </main>
      
      <Footer />
    </div>
  )
}

export default Home
