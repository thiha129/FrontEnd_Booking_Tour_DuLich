import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "../utils/config";

const WISHLIST_KEY = "travel_wishlist";

const WishlistContext = createContext(null);

const readLocalWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const { user, initializing } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(readLocalWishlist);
  const [syncing, setSyncing] = useState(false);
  const syncedUserId = useRef(null);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  useEffect(() => {
    if (initializing) return;

    if (!user) {
      syncedUserId.current = null;
      setWishlist(readLocalWishlist());
      return;
    }

    if (syncedUserId.current === user._id) return;

    const sync = async () => {
      setSyncing(true);
      try {
        const localIds = readLocalWishlist()
          .map((t) => t?._id)
          .filter(Boolean);

        const res = await fetch(`${BASE_URL}/wishlist/sync`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ tourIds: localIds }),
        });
        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          setWishlist(result.data);
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(result.data));
          syncedUserId.current = user._id;
        }
      } catch (err) {
        console.error("Wishlist sync failed:", err);
      } finally {
        setSyncing(false);
      }
    };

    sync();
  }, [user, initializing]);

  const isInWishlist = (tourId) =>
    wishlist.some((tour) => String(tour._id) === String(tourId));

  const addToWishlist = async (tour) => {
    if (!tour?._id) return;

    setWishlist((prev) => {
      if (prev.some((t) => String(t._id) === String(tour._id))) return prev;
      return [...prev, tour];
    });

    if (!user) return;

    try {
      const res = await fetch(`${BASE_URL}/wishlist/${tour._id}`, {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok && Array.isArray(result.data)) {
        setWishlist(result.data);
      }
    } catch (err) {
      console.error("Add wishlist failed:", err);
    }
  };

  const removeFromWishlist = async (tourId) => {
    setWishlist((prev) =>
      prev.filter((t) => String(t._id) !== String(tourId)),
    );

    if (!user) return;

    try {
      const res = await fetch(`${BASE_URL}/wishlist/${tourId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok && Array.isArray(result.data)) {
        setWishlist(result.data);
      }
    } catch (err) {
      console.error("Remove wishlist failed:", err);
    }
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
        syncing,
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
