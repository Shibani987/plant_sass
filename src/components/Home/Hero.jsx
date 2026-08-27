import { Play } from "lucide-react";
import ronnieImage from "../../assets/images/reviews/Ronnie Hamill.png";

const Hero = () => {
  const handleBuyNow = () => {
    document.getElementById("top-selling")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="
        relative flex flex-col justify-between
        pt-8 sm:pt-10 lg:pt-16 xl:pt-20 2xl:pt-24
      "
    >
      {/* ================= HERO CONTENT ================= */}
      <div className="max-w-xl lg:max-w-none">
        {/* ================= HEADING ================= */}
        <div className="animate-[fadeInLeft_0.8s_ease-out_forwards] opacity-0">
          <h1
            className="
              text-4xl font-semibold tracking-tight text-white
              sm:text-5xl
              md:text-6xl
              lg:whitespace-nowrap lg:text-7xl
              xl:text-8xl
              2xl:text-9xl
            "
          >
            Earth’s Exhale
          </h1>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div
          className="
            animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]
            opacity-0
          "
        >
          <p
            className="
              mt-3 max-w-lg text-xs leading-relaxed text-white/70
              sm:mt-4 sm:text-sm
              lg:text-sm
              xl:mt-5 xl:max-w-xl xl:text-base
              2xl:mt-6 2xl:max-w-2xl 2xl:text-lg
            "
          >
            "Earth Exhale" symbolizes the purity and vitality of the Earth's
            natural environment and its essential role in sustaining life.
          </p>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div
          className="
            mt-6 flex flex-wrap items-center gap-4
            opacity-0
            animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]

            sm:mt-8 sm:gap-6
            xl:mt-10 xl:gap-8
            2xl:mt-12 2xl:gap-10
          "
        >
          {/* BUY NOW */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="
              rounded-[10px] border border-white bg-transparent
              px-6 py-2.5 text-xs font-normal text-white
              backdrop-blur-md

              transition-all duration-300
              hover:-translate-y-1
              hover:bg-white
              hover:text-black

              sm:px-8 sm:py-3 sm:text-sm
              xl:px-10 xl:py-4 xl:text-base
              2xl:px-12 2xl:py-5 2xl:text-lg
            "
          >
            Buy Now
          </button>

          {/* LIVE DEMO */}
          <button
            type="button"
            aria-label="Watch live demo"
            className="
              group flex items-center gap-2
              text-xs font-normal text-white/90

              transition-all duration-300
              hover:text-white

              sm:gap-3 sm:text-sm
              xl:gap-4 xl:text-base
              2xl:gap-5 2xl:text-lg
            "
          >
            <span
              className="
                flex h-9 w-9 items-center justify-center rounded-full
                border border-white/30 bg-transparent

                transition-all duration-300
                group-hover:scale-110
                group-hover:border-white

                sm:h-10 sm:w-10
                xl:h-12 xl:w-12
                2xl:h-14 2xl:w-14
              "
            >
              <Play
                size={16}
                className="
                  fill-white pl-0.5
                  xl:h-5 xl:w-5
                  2xl:h-6 2xl:w-6
                "
              />
            </span>

            <span className="font-[Indie_Flower]">
              Live Demo...
            </span>
          </button>
        </div>
      </div>

      {/* ================= FLOATING REVIEW CARD ================= */}
      <div
        className="
          relative mt-10 w-full max-w-[280px]
          rounded-2xl border border-white/20 bg-white/5
          p-4 backdrop-blur-md

          opacity-0
          animate-[fadeInUp_0.9s_ease-out_0.6s_forwards]

          sm:mt-12 sm:max-w-xs
          xl:mt-16 xl:max-w-[380px] xl:rounded-3xl xl:p-5
          2xl:mt-20 2xl:max-w-[460px] 2xl:p-7
        "
      >
        {/* ================= CUSTOM BORDERS ================= */}
        <svg
          className="
            pointer-events-none absolute left-0 top-0 z-50 overflow-visible
            xl:h-[120px] xl:w-[170px]
            2xl:h-[150px] 2xl:w-[210px]
          "
          width="140"
          height="100"
          viewBox="0 0 140 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M 0 100 L 0 16 Q 0 0 16 0 L 140 0"
            stroke="#F5F1E8"
            strokeWidth="0.3"
          />
        </svg>

        <svg
          className="
            pointer-events-none absolute bottom-0 right-0 z-50 overflow-visible
            xl:h-[120px] xl:w-[170px]
            2xl:h-[150px] 2xl:w-[210px]
          "
          width="140"
          height="100"
          viewBox="0 0 140 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M 0 100 L 124 100 Q 140 100 140 84 L 140 0"
            stroke="#6B7280"
            strokeWidth="0.3"
          />
        </svg>

        {/* ================= REVIEWER INFO ================= */}
        <div className="flex items-center gap-3 xl:gap-4 2xl:gap-5">
          <img
            src={ronnieImage}
            alt="Ronnie Hamill"
            className="
              h-9 w-9 rounded-full object-cover
              sm:h-10 sm:w-10
              xl:h-12 xl:w-12
              2xl:h-16 2xl:w-16
            "
          />

          <div>
            <h4
              className="
                text-xs font-semibold text-white
                sm:text-sm
                xl:text-base
                2xl:text-xl
              "
            >
              Ronnie Hamill
            </h4>

            <div
              className="flex text-xs xl:text-sm 2xl:text-base"
              aria-label="4.5 out of 5 stars"
            >
              <span className="text-amber-400">★★★★</span>

              <span
                className="
                  bg-gradient-to-r
                  from-amber-400
                  from-50%
                  to-white/30
                  to-50%
                  bg-clip-text
                  text-transparent
                "
              >
                ★
              </span>
            </div>
          </div>
        </div>

        {/* ================= REVIEW TEXT ================= */}
        <p
          className="
            mt-2 text-xs leading-relaxed text-white/60
            xl:mt-3 xl:text-sm
            2xl:mt-4 2xl:text-base
          "
        >
          I can't express how thrilled I am with my new natural plants!
          They bring such a fresh and vibrant energy to my home.
        </p>
      </div>
    </div>
  );
};

export default Hero;