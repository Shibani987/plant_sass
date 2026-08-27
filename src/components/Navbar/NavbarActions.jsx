import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import cartIcon from "../../assets/icons/cart.png";
import { logout } from "../../features/auth/authSlice";

const NavbarActions = ({ isMenuOpen, setIsMenuOpen }) => {
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const user = useSelector((state) => state.auth.user);
  const dashboardPath = user?.role === "vendor" ? "/vendor" : user?.role === "super_admin" ? "/admin" : "/orders";

  return (
    <div
      className="
        ml-auto flex items-center

        gap-[18px]
        sm:gap-[22px]
        lg:gap-[25px]

        min-[1400px]:gap-[clamp(32px,2.5vw,60px)]
      "
    >
      {/* Search */}
      <Link
        to="/products"
        aria-label="Search"
        className="
          flex items-center justify-center
          text-white/90
          transition-all duration-200
          hover:scale-110 hover:text-white
        "
      >
        <Search
          size={21}
          strokeWidth={1.45}
          className="
            min-[1400px]:h-[clamp(25px,2vw,48px)]
            min-[1400px]:w-[clamp(25px,2vw,48px)]
          "
        />
      </Link>

      {/* Cart */}
      <Link
        to="/cart"
        aria-label="Shopping bag"
        className="
          relative flex items-center justify-center
          text-white/90
          transition-all duration-200
          hover:scale-110 hover:text-white
        "
      >
        <img
          src={cartIcon}
          alt=""
          className="
            block object-contain

            h-[22px] w-[22px]

            min-[1400px]:h-[clamp(27px,2vw,50px)]
            min-[1400px]:w-[clamp(27px,2vw,50px)]
          "
        />
        {cartCount > 0 && (
          <span className="absolute -right-2 -top-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#10190f] bg-[#e6b84a] px-1 text-[10px] font-black text-[#172312]">
            {cartCount}
          </span>
        )}
      </Link>

      {user ? (
        <div className="hidden items-center gap-2 sm:flex">
          <Link to={dashboardPath} className="max-w-[150px] text-right text-xs text-white/90 transition hover:text-white">
            <span className="block truncate font-bold">{user.name}</span>
            <span className="block text-[10px] uppercase tracking-[0.12em] text-white/60">{user.role.replace("_", " ")}</span>
          </Link>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="rounded-md border border-white/25 px-3 py-2 text-xs font-bold text-white/90 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="hidden rounded-md border border-white/25 px-3 py-2 text-xs font-bold text-white/90 transition hover:bg-white/10 sm:block"
        >
          Login
        </Link>
      )}

      {/* Animated Menu - Mobile + Desktop */}
      <button
        type="button"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
        className="
          flex items-center justify-center
          text-white/90
          transition hover:text-white
        "
      >
        <svg
          className="
            h-[20px] w-[26px]
            overflow-visible

            sm:h-[22px] sm:w-[28px]

            min-[1400px]:h-[clamp(24px,2vw,46px)]
            min-[1400px]:w-[clamp(32px,2.5vw,60px)]
          "
          viewBox="0 0 26 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line
            x1="2"
            y1="5"
            x2="24"
            y2="5"
            className={`
              origin-center
              transition-all
              duration-300
              ease-in-out
              ${
                isMenuOpen
                  ? "translate-y-[5px] rotate-45"
                  : ""
              }
            `}
          />

          <line
            x1="8"
            y1="15"
            x2="24"
            y2="15"
            className={`
              origin-center
              transition-all
              duration-300
              ease-in-out
              ${
                isMenuOpen
                  ? "-translate-y-[5px] -rotate-45"
                  : ""
              }
            `}
          />
        </svg>
      </button>
    </div>
  );
};

export default NavbarActions;
