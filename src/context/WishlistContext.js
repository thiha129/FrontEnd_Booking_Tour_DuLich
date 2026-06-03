import { createContext, useContext, useEffect, useState } from "react";

const WISHLIST_KEY = "travel_wishlist";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (tourId) =>
    wishlist.some((tour) => tour._id === tourId);

  const addToWishlist = (tour) => {
    setWishlist((prev) => {
      if (prev.some((t) => t._id === tour._id)) return prev;
      return [...prev, tour];
    });
  };

  const removeFromWishlist = (tourId) => {
    setWishlist((prev) => prev.filter((t) => t._id !== tourId));
  };

  const toggleWishlist = (tour) => {
    if (isInWishlist(tour._id)) {
      removeFromWishlist(tour._id);
    } else {
      addToWishlist(tour);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export default WishlistContext;
