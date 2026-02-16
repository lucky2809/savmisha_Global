import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
  
function AddCardSection({ addItemIsOn, addItemIsOnHanlder }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);


  const token = localStorage.getItem("access_token");

  // Fetch Cart Items
  const getCartItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data.data || []);
    } catch (err) {
      console.log("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACK_END_URL}/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Failed to remove item:", err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACK_END_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch (err) {
      console.log("Failed to clear cart:", err);
    }
  };

  useEffect(() => {
    if (addItemIsOn) getCartItems();
  }, [addItemIsOn]);

  // ⭐ Calculate total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ⭐ Get currency from first product (whole cart same currency)
  const currency = cart[0]?.currency || "USD";


  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    navigate("/payment-page", {
      state: {
        cartItems: cart,
        totalAmount: cart.reduce((t, i) => t + i.price * i.quantity, 0),
      },
    });
  };


  return (
    <div
      className={`Add-card-main w-full flex justify-end fixed top-0 left-0 h-screen bg-black/20 z-40 transition-all 
      ${addItemIsOn ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="card w-[500px] h-screen bg-slate-100 px-2 flex flex-col shadow-xl">

        {/* Header */}
        <div className="border flex items-center justify-between py-5 px-2 border-none">
          <p className="text-xl font-semibold">Your Cart</p>

          <div className="flex items-center gap-3">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 text-sm font-semibold flex items-center gap-1 hover:text-red-800"
              >
                <FontAwesomeIcon icon={faTrash} /> Clear
              </button>
            )}

            <span className="h-9 w-9 bg-slate-200 hover:bg-slate-400/15 rounded-full flex justify-center items-center cursor-pointer">
              <FontAwesomeIcon
                fontSize={20}
                icon={faXmark}
                onClick={addItemIsOnHanlder}
              />
            </span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-1">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 font-semibold">
              Loading...
            </div>
          ) : cart.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 font-semibold">
              Your cart is empty
            </div>
          ) : (
            cart.map((item) => (
              <section
                key={item._id}
                className="w-full border p-2 rounded-md flex gap-4 mt-5 relative bg-white shadow-sm"
              >
                <div className="h-28 w-36">
                  <img
                    className="h-full w-full object-cover rounded-md"
                    src={item.image}
                    alt="product"
                  />
                </div>

                <div className="w-full">
                  <h1 className="font-semibold text-[18px]">{item.productName}</h1>

                  <span className="font-semibold text-xl">
                    {currency} {item.price}
                  </span>

                  <div className="text-base font-semibold mt-4 flex justify-between w-full items-center">
                    <span>Color: {item?.color || "White"}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </section>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-white">
            <div className="text-lg font-bold mb-3">
              Total: {currency} {totalPrice.toFixed(2)}
            </div>

            <button onClick={handleCheckout} className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddCardSection;
