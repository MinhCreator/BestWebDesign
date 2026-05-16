import React from "react";

const Hero = () => {
  return (
    <div className="hero-banner ">
      <div className="ml-20 ">
        <h1 className="text-5xl">
          <span className="text-emerald-400">Discover </span>
          <span className="bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent text-5xl font-bold">
            Viet Nam{" "}
            <svg
              className="w-15 h-15"
              enableBackground="new 0 0 512 512"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <circle cx="256" cy="256" fill="#d80027" r="256" />
              <path
                d="m256 133.565 27.628 85.029h89.405l-72.331 52.55 27.628 85.03-72.33-52.551-72.33 52.551 27.628-85.03-72.33-52.55h89.404z"
                fill="#ffda44"
              />
            </svg>
          </span>{" "}
          <br />
          <span className="ml-10 text-[#c2fe0c]">running events. </span>
        </h1>
        <p className="ml-10 mt-2 mb-2 font-bold text-xl">
          Learn about and register for top running events.
        </p>
      </div>
    </div>
  );
};

export default Hero;
