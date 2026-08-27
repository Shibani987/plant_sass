import { Link } from "react-router-dom";

const O2Card = ({
  item,
  currentSlide = 1,
  totalSlides = 1,
  onNext,
  onPrevious,
}) => {
  const {
    title,
    description1,
    description2,
    image,
  } = item;

  return (
    <article
      className="
        relative mx-auto w-full overflow-visible

        min-h-[560px]
        rounded-[28px]
        border border-white/15
        bg-white/[0.04]
        backdrop-blur-md

        sm:min-h-[600px]
        sm:rounded-[35px]

        md:min-h-[620px]

        lg:min-h-[430px]
        lg:rounded-[45px]

        xl:min-h-[460px]

        min-[1400px]:min-h-[clamp(460px,30vw,650px)]
      "
    >
      {/* ================= TOP LEFT BORDER ================= */}
      <span
        className="
          pointer-events-none absolute
          -left-px -top-px z-40

          h-16 w-20
          rounded-tl-[28px]
          border-l border-t border-white/30

          sm:h-20 sm:w-24
          sm:rounded-tl-[35px]

          lg:h-24 lg:w-28
          lg:rounded-tl-[45px]
        "
      />

      {/* ================= BOTTOM RIGHT BORDER ================= */}
      <span
        className="
          pointer-events-none absolute
          -bottom-px -right-px z-40

          h-16 w-20
          rounded-br-[28px]
          border-b border-r border-white/30

          sm:h-20 sm:w-24
          sm:rounded-br-[35px]

          lg:h-24 lg:w-28
          lg:rounded-br-[45px]
        "
      />

      {/* ================= PLANT IMAGE ================= */}
      <div
        className="
          pointer-events-none absolute
          left-1/2 top-0 z-20

          flex w-full
          -translate-x-1/2
          justify-center

          md:w-[75%]

          lg:left-[22%]
          lg:w-[50%]
        "
      >
        <img
          src={image}
          alt={title}
          className="
            relative z-20
            h-[390px]
            w-auto
            max-w-none
            -translate-y-[70px]
            object-contain
            drop-shadow-2xl

            sm:h-[450px]
            sm:-translate-y-[80px]

            md:h-[500px]
            md:-translate-y-[90px]

            lg:h-[750px]
            lg:-translate-y-[190px]

            xl:h-[880px]
            xl:-translate-y-[230px]

            min-[1400px]:h-[clamp(850px,48vw,1250px)]
            min-[1400px]:-translate-y-[clamp(210px,12vw,360px)]
          "
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className="
          relative z-30

          flex min-h-[560px]
          flex-col justify-end

          px-5 pb-8 pt-[300px]

          sm:min-h-[600px]
          sm:px-8
          sm:pb-10
          sm:pt-[330px]

          md:min-h-[620px]
          md:px-10
          md:pt-[360px]

          lg:ml-[48%]
          lg:min-h-[430px]
          lg:justify-center
          lg:px-7
          lg:pb-6
          lg:pt-6

          xl:min-h-[460px]
          xl:px-8
          xl:pr-12

          min-[1400px]:min-h-[clamp(460px,30vw,650px)]
          min-[1400px]:justify-center
          min-[1400px]:px-[clamp(2rem,3vw,5rem)]
          min-[1400px]:pr-[clamp(3rem,5vw,8rem)]
        "
      >
        <div
          className="
            w-full

            lg:max-w-[600px]

            min-[1400px]:max-w-[clamp(600px,40vw,1000px)]
          "
        >
          {/* ================= TITLE ================= */}
          <h3
            className="
              max-w-[500px]
              text-base font-semibold
              leading-snug text-white/80

              sm:text-xl
              xl:text-2xl

              min-[1400px]:max-w-[clamp(500px,38vw,900px)]
              min-[1400px]:text-[clamp(1.4rem,1.5vw,2.2rem)]
            "
          >
            {title}
          </h3>

          {/* ================= DESCRIPTION 1 ================= */}
          <p
            className="
              mt-4 max-w-[550px]
              text-xs font-medium
              leading-relaxed text-white/65

              sm:mt-5
              sm:text-sm

              xl:text-base

              min-[1400px]:mt-[clamp(1rem,1.3vw,1.8rem)]
              min-[1400px]:max-w-[clamp(550px,40vw,950px)]
              min-[1400px]:text-[clamp(0.95rem,1vw,1.4rem)]
            "
          >
            {description1}
          </p>

          {/* ================= DESCRIPTION 2 ================= */}
          <p
            className="
              mt-3 max-w-[550px]
              text-xs font-medium
              leading-relaxed text-white/65

              sm:mt-4
              sm:text-sm

              xl:text-base

              min-[1400px]:mt-[clamp(0.8rem,1vw,1.5rem)]
              min-[1400px]:max-w-[clamp(550px,40vw,950px)]
              min-[1400px]:text-[clamp(0.95rem,1vw,1.4rem)]
            "
          >
            {description2}
          </p>

          {/* ================= BUTTON + SLIDE CONTROL ================= */}
          <div
            className="
              mt-5 flex
              items-center justify-between
              gap-3

              sm:mt-6
              sm:gap-4

              min-[1400px]:mt-[clamp(1.5rem,2vw,3rem)]
            "
          >
            {/* ================= EXPLORE BUTTON ================= */}
            <Link
              to="/products"
              className="
                rounded-md
                border border-white/40

                px-5 py-1.5
                text-xs text-white/70

                transition duration-300
                hover:bg-white/10
                hover:text-white

                sm:px-7
                sm:py-2
                sm:text-sm

                min-[1400px]:rounded-lg
                min-[1400px]:px-[clamp(1.5rem,2vw,3rem)]
                min-[1400px]:py-[clamp(0.5rem,0.7vw,1rem)]
                min-[1400px]:text-[clamp(0.85rem,0.9vw,1.3rem)]
              "
            >
              Explore
            </Link>

            {/* ================= SLIDE INDICATOR ================= */}
            <div
              className="
                flex items-center
                gap-3 whitespace-nowrap

                text-xs text-white/60

                sm:gap-4

                min-[1400px]:gap-[clamp(0.8rem,1vw,1.5rem)]
                min-[1400px]:text-[clamp(0.8rem,0.9vw,1.2rem)]
              "
            >
              {/* PREVIOUS */}
              <button
                type="button"
                onClick={onPrevious}
                aria-label="Previous slide"
                className="
                  flex
                  items-center
                  justify-center

                  text-lg
                  leading-none
                  text-white/50

                  transition-all
                  duration-300

                  hover:-translate-x-1
                  hover:text-white

                  min-[1400px]:text-[clamp(1.2rem,1.5vw,2rem)]
                "
              >
                ‹
              </button>

              {/* CURRENT / TOTAL */}
              <span>
                {String(currentSlide).padStart(2, "0")}/
                {String(totalSlides).padStart(2, "0")}
              </span>

              {/* NEXT */}
              <button
                type="button"
                onClick={onNext}
                aria-label="Next slide"
                className="
                  flex
                  items-center
                  justify-center

                  text-lg
                  leading-none
                  text-white/70

                  transition-all
                  duration-300

                  hover:translate-x-1
                  hover:text-white

                  min-[1400px]:text-[clamp(1.2rem,1.5vw,2rem)]
                "
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default O2Card;