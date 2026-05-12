import Hero from '@components/Home/Hero';
import RaceSlider from '@components/Home/RaceSlider';
import CommunitySection from '@components/Home/CommunitySection';
import TrainingSection from '@components/Home/TrainingSection';
import '@css/Home.css'

const Home = () => {
  return (
    <div className="home-page bg-surface">
      <Hero />
      <RaceSlider />
      <CommunitySection />
      <TrainingSection />
    </div>
  )
}

export default Home