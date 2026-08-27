import cartIcon from "../../assets/icons/cart.png";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../features/cart/cartSlice";
import { formatINR, toINRAmount } from "../../utils/currency";

const TrendyPlantCard = ({
  image,
  alt,
  title,
  description,
  price,
  itemId,
  _id,
  reverse = false,
}) => {
  const dispatch = useDispatch();
  const imagePosition = reverse
    ? `
        md:right-4
        lg:right-8
        xl:right-10
        min-[1400px]:right-[5vw]
      `
    : `
        md:left-4
        lg:left-8
        xl:left-10
        min-[1400px]:left-[5vw]
      `;

  return (
    <article
      className={`
        group relative flex min-h-[280px] flex-col items-center
        overflow-visible rounded-[40px]

        border border-white/10
        bg-white/5
        px-6 py-10
        backdrop-blur-md

        transition-all duration-500 ease-out
        hover:border-white/20
        hover:bg-white/[0.07]

        sm:min-h-[320px]
        sm:rounded-[55px]
        sm:px-8

        md:min-h-[350px]
        md:justify-between
        md:rounded-[70px]
        md:p-10

        ${reverse ? "md:flex-row-reverse" : "md:flex-row"}

        lg:rounded-[80px]

        min-[1400px]:min-h-[30vw]
        min-[1400px]:rounded-[7vw]
        min-[1400px]:p-[5vw]
      `}
    >
      {/* ================= PLANT IMAGE ================= */}
      <div
        className="
          pointer-events-none relative z-20 flex h-[180px] w-full
          items-center justify-center

          sm:h-[210px]

          md:absolute
          md:inset-0
          md:h-auto
          md:w-auto
          md:block
        "
      >
        <img
          src={image}
          alt={alt}
          className={`
            relative h-[290px] w-auto max-w-none
            object-contain

            transition-transform duration-500 ease-out
            group-hover:scale-105

            sm:h-[360px]

            md:absolute
            md:top-[-80px]
            md:h-[430px]

            lg:top-[-112px]
            lg:h-[500px]

            xl:top-[-128px]
            xl:h-[580px]

            min-[1400px]:top-[-12vw]
            min-[1400px]:h-[46vw]

            ${imagePosition}
          `}
        />
      </div>

      {/* ================= IMAGE SPACE ================= */}
      <div className="hidden md:block md:w-[43%] lg:w-[45%]" />

      {/* ================= TEXT CONTENT ================= */}
      <div
        className="
          relative z-10 mt-4 w-full max-w-md

          md:mt-0
          md:w-[50%]

          min-[1400px]:max-w-[38vw]
        "
      >
        <h3
          className="
            text-xl font-bold leading-tight text-white

            sm:text-2xl
            md:text-3xl
            xl:text-4xl

            min-[1400px]:text-[3.8vw]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3 text-xs leading-relaxed text-white/70

            sm:mt-4
            sm:text-sm

            md:text-base

            min-[1400px]:mt-[1.8vw]
            min-[1400px]:text-[1.3vw]
          "
        >
          {description}
        </p>

        <span
          className="
            mt-4 block text-lg font-bold text-white

            sm:mt-5
            sm:text-xl

            md:text-2xl

            min-[1400px]:mt-[2vw]
            min-[1400px]:text-[2.5vw]
          "
        >
          {formatINR(price)}
        </span>

        {/* ================= ACTION BUTTONS ================= */}
        <div
          className="
            mt-5 flex items-center gap-3

            sm:gap-4

            min-[1400px]:mt-[2.5vw]
            min-[1400px]:gap-[1.8vw]
          "
        >
          {/* Explore Button */}
          <Link
            to="/products"
            className="
              rounded-lg border border-white/70
              bg-transparent

              px-6 py-2.5

              text-xs font-medium text-white

              transition-all duration-300

              hover:scale-[1.03]
              hover:border-white
              hover:bg-white
              hover:text-[#162315]

              active:scale-[0.97]

              sm:px-8
              sm:py-3
              sm:text-sm

              min-[1400px]:px-[3.5vw]
              min-[1400px]:py-[1.3vw]
              min-[1400px]:text-[1.2vw]
            "
          >
            Explore
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            aria-label={`Add ${title} to cart`}
            onClick={() => dispatch(addToCart({
              id: `trendy-${itemId || _id}`,
              name: title,
              description,
              price: toINRAmount(price),
              image,
            }))}
            className="
              flex h-10 w-10 items-center justify-center

              rounded-lg
              border border-white/70
              bg-transparent

              transition-all duration-300

              hover:scale-110
              hover:border-white
              hover:bg-white/10

              active:scale-95

              sm:h-11
              sm:w-11

              min-[1400px]:h-[4vw]
              min-[1400px]:w-[4vw]
              min-[1400px]:rounded-[1vw]
            "
          >
            <img
              src={cartIcon}
              alt=""
              className="
                h-4 w-4 object-contain

                sm:h-5 sm:w-5

                min-[1400px]:h-[1.8vw]
                min-[1400px]:w-[1.8vw]
              "
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TrendyPlantCard;