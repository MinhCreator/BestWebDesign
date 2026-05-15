import Breadcrumbs from "@components/ui/Breadcrumbs";
import MainContent from "@components/news/MainContent";
import SideContent from "@components/news/SideContent";
import "@css/News.css";

const News = () => {
  return (
    <>
      <div className="container gap-3 p-10">
        {/* <Breadcrumbs /> */}
        <MainContent />
        <SideContent />
      </div>
    </>
  );
};

export default News;
