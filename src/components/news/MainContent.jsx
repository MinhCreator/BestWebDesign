import React from "react";

const mockdata = {
  featured: {
    tag: "Featured",
    title: "Latest Running News",
    description:
      "Stay updated with the newest running events, marathon highlights and athlete stories across Vietnam.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
  },
  cards: [
    {
      id: 1,
      category: "Marathon",
      title: "Vietnam Half Marathon Breaks New Record",
      description:
        "More than 10,000 runners joined the largest running event in Central Vietnam.",
      image:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400",
    },
    {
      id: 2,
      category: "Trail Run",
      title: "Vietnam Mountain Marathon Returns",
      description:
        "Sapa welcomes professional runners with new mountain challenges this season.",
      image:
        "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400",
    },
    {
      id: 3,
      category: "Training",
      title: "Summer Long Run Tips",
      description:
        "Essential advice to stay hydrated and improve endurance during hot weather.",
      image:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400",
    },
    {
      id: 4,
      category: "Community",
      title: "Da Nang Running Club Weekly Meetup",
      description:
        "Local runners gather every Saturday morning for a group run along My Khe Beach.",
      image:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400",
    },
    {
      id: 5,
      category: "Health",
      title: "5 Benefits of Morning Jogging",
      description:
        "Starting your day with a run boosts metabolism, mental clarity, and long-term endurance.",
      image:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400",
    },
    {
      id: 6,
      category: "Race Recap",
      title: "Ho Chi Minh City Marathon Highlights",
      description:
        "Over 15,000 participants joined the annual city marathon through iconic landmarks.",
      image:
        "https://images.unsplash.com/photo-1530549387789-4c1017266634?w=400",
    },
  ],
};

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="featured-news">
        <div
          className="image-box"
          style={{ backgroundImage: `url(${mockdata.featured.image})` }}
        />
        <div className="news-info">
          <span className="featured-tag">{mockdata.featured.tag}</span>
          <h1>{mockdata.featured.title}</h1>
          <p>{mockdata.featured.description}</p>
          <button className="explore-btn">Read More</button>
        </div>
      </div>
      <div className="news-grid">
        {mockdata.cards.map((card) => (
          <div className="card" key={card.id}>
            <div
              className="card-image"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="card-content">
              <span className="card-category">{card.category}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
