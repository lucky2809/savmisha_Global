import React, { useState } from "react";
import { Button } from "@mui/material";
import ModalLogiin from "../ModalComponent/ModalLogiin";
import useUserStore from "../../store/userStore";
import useCartStore from "../../store/useCartStore";

function AddCartButton({ product, variant, mainImage }) {
  const { addItem } = useCartStore();
  const { user } = useUserStore();
    const [loginOpen, setLoginOpen] = useState(false)
  

  const handleAdd = () => {
    if (!user) {
      // alert("Please login first!");
      setLoginOpen(true);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(variant?.retail_price),
      currency: "USD",
      image: mainImage,
      variant: variant,
      quantity: 1
    };

    addItem(cartItem);
    alert("Item added to cart!");
  };

  return (
    <div className="w-full">
    <Button
      variant="outlined"
      sx={{
        width: "100%",
        "&:hover": { bgcolor: "black", color: "white" },
      }}
      onClick={handleAdd}
    >
      Add To Cart
    </Button>

          <ModalLogiin modalNavLogin={loginOpen} setModalmodalNav={setLoginOpen} />

          </div>
    
  );
}

export default AddCartButton;
