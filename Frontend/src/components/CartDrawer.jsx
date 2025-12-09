import React from "react";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeItem, clearCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-45 z-80 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-darkBg shadow-lg p-6 z-99 flex flex-col transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white text-2xl font-bold">Your Cart</h2>
          <button
            className="bg-transparent border-none text-white text-2xl cursor-pointer hover:opacity-80 transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <p className="text-gray-300">Your cart is empty</p>
        ) : (
          <>
            {/* Cart Items List */}
            <ul className="list-none p-0 flex-1 overflow-y-auto">
              {cart.map((item) => {
                const itemName = item.name || `${item.brand} ${item.model}`;
                const itemImage = item.image || item.image_url;

                return (
                  <li key={item.id} className="flex items-center gap-3 bg-white bg-opacity-5 p-3 rounded-lg mb-3">
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-14 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-14 h-14 object-cover rounded bg-gray-400 flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-white font-bold">{itemName}</p>
                      <div className="text-gray-300 text-sm flex items-center gap-2">
                        <button
                          className="bg-transparent border border-white border-opacity-10 text-white w-7 h-7 rounded inline-flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-5 transition"
                          onClick={() => decreaseQty(item.id)}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="bg-transparent border border-white border-opacity-10 text-white w-7 h-7 rounded inline-flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-5 transition"
                          onClick={() => increaseQty(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="text-white font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className="bg-transparent border border-red-400 text-red-400 px-2 py-1 rounded text-sm cursor-pointer hover:bg-red-400 hover:text-white transition"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="pt-3 border-t border-white border-opacity-10">
              <p className="text-white font-bold mb-3">
                Total: ${total.toFixed(2)}
              </p>

              <button
                className="w-full bg-primary border-none px-7 py-3 text-white rounded-md cursor-pointer font-medium hover:bg-primaryDark transition"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}