import { useEffect, useRef, useState } from "react";
import SectionHeading from "../common/SectionHeading";
import TrendyPlantCard from "./TrendyPlantCard";
import { api } from "../../services/api";

const TrendyPlants = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    api.get("/trendy")
      .then(({ data }) => setPlants(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        mx-auto mt-16 w-full max-w-[1400px]
        px-4

        sm:mt-20
        sm:px-6

        md:mt-24
        md:px-8

        lg:px-10

        xl:px-16

        2xl:px-24

        min-[1400px]:mt-[7vw]
        min-[1400px]:max-w-[88vw]
        min-[1400px]:px-[6vw]
      "
    >
      <SectionHeading>
        Our Trendy Plants
      </SectionHeading>

      <div
        className="
          mt-16 flex flex-col gap-16

          sm:mt-20
          sm:gap-20

          lg:mt-24

          min-[1400px]:mt-[9vw]
          min-[1400px]:gap-[9vw]
        "
      >
        {plants.map((plant, index) => (
          <div
            key={plant._id || plant.itemId}
            className={
              isVisible
                ? "animate-trendy-section-reveal"
                : "translate-y-12 opacity-0"
            }
            style={{
              animationDelay: isVisible
                ? `${index * 0.2}s`
                : "0s",
            }}
          >
            <TrendyPlantCard {...plant} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendyPlants;