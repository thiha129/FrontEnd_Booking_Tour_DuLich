const DEFAULT_API = "http://localhost:4000/api/v1";
const PRODUCTION_API = "https://backend-booking-tour-dulich.onrender.com/api/v1";

export const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_API : DEFAULT_API);

if (
  process.env.NODE_ENV === "production" &&
  BASE_URL.includes("vercel.app")
) {
  console.error(
    "[config] REACT_APP_API_URL must be your Render backend, not a Vercel URL. " +
      "Use: https://backend-booking-tour-dulich.onrender.com/api/v1",
  );
}
