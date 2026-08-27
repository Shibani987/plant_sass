import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PlantCard from "./PlantCard";
import SectionHeading from "../common/SectionHeading";
import { api } from "../../services/api";
import { addToCart } from "../../features/cart/cartSlice";

const TopSelling = () => {
  const dispatch = useDispatch();
  const [trendingPlants, setTrendingPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => {
        setTrendingPlants(
          data
            .filter((product) => product.tags?.includes("Trending"))
            .map((product) => ({
              id: product._id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.images?.[0],
            })),
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddToCart = (plant) => {
    dispatch(addToCart(plant));
  };

  /* ================= SCROLL REVEAL OBSERVER ================= */

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    const currentSection = sectionRef.current;

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
      id="top-selling"
      className="
        mx-auto w-full
        max-w-[1400px]
        px-4 py-16

        sm:px-6 sm:py-20
        lg:px-10 lg:py-24
        xl:px-16

        min-[1400px]:max-w-[clamp(1600px,88vw,2400px)]
        min-[1400px]:px-[clamp(4rem,6vw,10rem)]
        min-[1400px]:py-[clamp(6rem,8vw,12rem)]
      "
    >
      {/* ================= SECTION HEADING ================= */}

      <SectionHeading>
        Our Top Selling Plants
      </SectionHeading>

      {/* ================= PLANT CARDS ================= */}

      <div
        className="
          mt-16
          grid grid-cols-1
          gap-16

          sm:grid-cols-2
          sm:gap-10

          lg:mt-20
          lg:grid-cols-3
          lg:gap-8

          xl:gap-10

          min-[1400px]:mt-[clamp(6rem,8vw,12rem)]
          min-[1400px]:gap-[clamp(2.5rem,3vw,5rem)]
        "
      >
        {trendingPlants.map((plant, index) => (
          <div
            key={plant.id}
            className={
              isVisible
                ? "animate-top-selling-reveal"
                : "opacity-0"
            }
            style={{
              animationDelay: `${index * 150}ms`,
            }}
          >
            <PlantCard
              plant={plant}
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
        {!isLoading && trendingPlants.length === 0 && (
          <p className="col-span-full text-center text-white/60">No trending plants available yet.</p>
        )}
      </div>

    </section>
  );
};

export default TopSelling;