import { differenceInCalendarDays } from "date-fns";

export const BOOKING_SERVICE_FEE = 10;

export const getBookingNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  if (end <= start) return 0;
  return Math.max(differenceInCalendarDays(end, start), 1);
};

export const getBookingSubtotal = (price, nights, guestSize) => {
  if (!nights || nights < 1) return 0;
  const guests = Math.max(Number(guestSize) || 1, 1);
  return Number(price) * nights * guests;
};

export const getBookingTotal = (price, nights, guestSize, serviceFee = BOOKING_SERVICE_FEE) => {
  const subtotal = getBookingSubtotal(price, nights, guestSize);
  if (!subtotal) return 0;
  return subtotal + serviceFee;
};
