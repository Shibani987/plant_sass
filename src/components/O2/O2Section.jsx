import { useEffect, useRef, useState } from "react";
import SectionHeading from "../common/SectionHeading";
import O2Card from "./O2Card";
import { api } from "../../services/api";

const O2Section = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [o2Content, setO2Content] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef(null);

  const totalSlides = o2Content.length;
  const currentSlide = o2Content[currentIndex];

  useEffect(() => {
    api.get("/o2").then(({ data }) => setO2Content(data)).finally(() => setIsLoading(false));
  }, []);

  const goToNext = () => {
    if (!totalSlides) return;
    setCurrentIndex((prevIndex) => {
      return (prevIndex + 1) % totalSlides;
    });
  };

  const goToPrevious = () => {
    if (!totalSlides) return;
    setCurrentIndex((prevIndex) => {
      return (prevIndex - 1 + totalSlides) % totalSlides;
    });
  };

  /* Scroll Reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    const section = sectionRef.current;

    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  /* Preload Slide Images */
  useEffect(() => {
    o2Content.forEach(({ image }) => {
      const img = new Image();
      img.src = image;
    });
  }, [o2Content]);

  return (
    <section
      ref={sectionRef}
      className="
        w-full bg-[#162315]
        px-4 py-16
        sm:px-6 sm:py-20
        lg:px-10 lg:py-24
        xl:px-16
        min-[1400px]:px-[clamp(4rem,7vw,10rem)]
        min-[1400px]:py-[clamp(6rem,8vw,12rem)]
      "
    >
      <SectionHeading>Our Best O2</SectionHeading>

      {/* O2 Card */}
      <div
        className="
          mx-auto mt-16 w-full max-w-[1400px]
          sm:mt-20
          lg:mt-24
        "
      >
        <div
          className={
            isVisible
              ? "animate-o2-card-reveal"
              : "opacity-0"
          }
        >
          {currentSlide ? (
            <O2Card
              key={currentSlide._id}
              item={currentSlide}
              currentSlide={currentIndex + 1}
              totalSlides={totalSlides}
              onNext={goToNext}
              onPrevious={goToPrevious}
            />
          ) : !isLoading ? (
            <p className="py-20 text-center text-white/60">No best O2 content available yet.</p>
          ) : null}
        </div>
      </div>

      {/* Slide Dots */}
      <div
        className="
          mt-12 flex items-center justify-center gap-2
        "
      >
        {o2Content.map((item, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={item._id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-1.5 rounded-full
                transition-all duration-300
                ${
                  isActive
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }
              `}
            />
          );
        })}
      </div>
    </section>
  );
};

export default O2Section;