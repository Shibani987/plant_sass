import { useEffect, useState } from "react";
import CustomCard from "../common/CustomCard";
import { api } from "../../services/api";

const FeaturedCard = () => {
  const [plants, setPlants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get("/hero/featured")
      .then(({ data }) => setPlants(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (plants.length < 2) return undefined;
    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % plants.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [plants.length]);

  if (!plants.length) return null;

  const currentPlant = plants[currentIndex % plants.length];
  const goToNext = () => setCurrentIndex((index) => (index + 1) % plants.length);

  return (
    <div
      className="
        relative mx-auto w-full max-w-[320px] overflow-visible
        opacity-0
        animate-[fadeInUp_0.9s_ease-out_0.2s_forwards]

        sm:max-w-sm
        lg:mx-0

        min-[1500px]:max-w-[32vw]
      "
    >
      {/* ================= FEATURED CARD ================= */}
      <CustomCard
        className="
          relative h-[380px] w-full
          sm:h-[440px]
          min-[1500px]:h-[38vw]
        "
        contentClassName="
          relative h-full w-full p-5
          sm:p-6
          min-[1500px]:p-[2.4vw]
        "
      >
        {/* ================= CUSTOM TOP + SIDE BORDER ================= */}
        <svg
          className="
            pointer-events-none absolute inset-0 z-20
            h-full w-full
          "
          viewBox="0 0 400 440"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="
              M 1 390
              V 52
              Q 1 1, 52 1

              H 60
              C 100 1, 112 36, 200 44
              C 288 36, 300 1, 340 1
              H 348

              Q 399 1, 399 52
              V 390
            "
            stroke="#F5F1E8"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* ================= PLANT DETAILS ================= */}
        <div
          key={currentPlant.id}
          className="
            relative z-30 mx-6 mt-[190px] text-left

            opacity-0
            animate-[fadeInUp_0.6s_ease-out_forwards]

            sm:mx-10
            sm:mt-[220px]

            min-[1500px]:mx-[3.2vw]
            min-[1500px]:mt-[20vw]
          "
        >
          <span
            className="
              text-xs text-white/60
              min-[1500px]:text-[1.1vw]
            "
          >
            {currentPlant.category}
          </span>

          {/* ================= NAME + NEXT ARROW ================= */}
          <div
            className="
              flex items-center justify-between gap-2
              min-[1500px]:gap-[1vw]
            "
          >
            <h3
              className="
                text-base font-semibold text-white
                sm:text-lg
                min-[1500px]:text-[1.9vw]
              "
            >
              {currentPlant.name}
            </h3>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next plant"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-3xl font-light leading-none text-white/80 transition-all duration-300 hover:translate-x-1 hover:text-white sm:h-10 sm:w-10 sm:text-4xl"
            >
              ›
            </button>

          </div>

          {/* ================= BUY BUTTON ================= */}
          <button
            type="button"
            onClick={() => document.getElementById("top-selling")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="
              mt-3 rounded-md border border-white
              bg-transparent px-5 py-2
              text-xs text-white

              transition-all duration-300
              hover:-translate-y-1
              hover:bg-white
              hover:text-black

              sm:mt-4
              sm:px-6

              min-[1500px]:mt-[1.6vw]
              min-[1500px]:rounded-[0.7vw]
              min-[1500px]:px-[2.7vw]
              min-[1500px]:py-[1vw]
              min-[1500px]:text-[1.1vw]
            "
          >
            Buy Now
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
          {plants.map((plant, index) => (
            <button
              key={plant._id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to ${plant.name}`}
              className={`rounded-full transition-all duration-300 ${index === currentIndex ? "h-1.5 w-6 bg-white" : "h-1.5 w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>

      </CustomCard>

      {/* ================= CURRENT PLANT IMAGE ================= */}
      <div
        key={currentPlant.id}
        className="
          pointer-events-none absolute left-1/2 top-0 z-50
          h-56 w-full -translate-x-1/2

          opacity-0
          animate-[plantReveal_0.8s_ease-out_forwards]

          sm:h-64

          min-[1500px]:h-[27vw]
        "
      >
        <img
          src={currentPlant.image}
          alt={currentPlant.name}
          className="
            absolute left-1/2 top-0
            h-56 w-auto
            -translate-x-1/2
            -translate-y-[55px]
            scale-125
            object-contain
            drop-shadow-2xl

            sm:h-64
            sm:-translate-y-[80px]
            sm:scale-150

            min-[1500px]:h-[27vw]
            min-[1500px]:-translate-y-[9vw]
            min-[1500px]:scale-[1.55]
          "
        />
      </div>
    </div>
  );
};

export default FeaturedCard;