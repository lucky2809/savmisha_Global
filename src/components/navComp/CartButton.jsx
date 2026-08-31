import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import useCartStore from "../../store/useCartStore";
import useUserStore from "../../store/userStore";

export default function CartButton({ className = "" }) {
  const items = useCartStore((s) => s.items);
  const token = useUserStore((s) => s.token);

  // The cart is only meaningful to a signed-in customer, and admins do not
  // order from their own catalogue.
  if (!token) return null;

  const lineCount = items.length;

  return (
    <Link
      to="/cart"
      aria-label={`Cart${lineCount ? `, ${lineCount} items` : ""}`}
      className={`relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100 ${className}`}
    >
      <MdOutlineShoppingCart className="h-6 w-6" />

      {lineCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
          {lineCount > 9 ? "9+" : lineCount}
        </span>
      )}
    </Link>
  );
}
