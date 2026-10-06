import { format } from "date-fns";
import { BOOKING_SERVICE_FEE, getBookingNights } from "./bookingPrice";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMoney = (amount) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return "$0";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value, pattern = "dd/MM/yyyy") => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return format(date, pattern);
};

/**
 * Prints a booking invoice via a hidden iframe (no pop-up window).
 * Labels should be pre-translated by the caller.
 */
export const getInvoiceLabels = (t) => ({
  title: t("booking.invoiceTitle"),
  company: "Travel Booking",
  invoiceNo: t("booking.invoiceNo"),
  issuedAt: t("booking.invoiceIssuedAt"),
  bookingRef: t("booking.bookingRef"),
  bookedAt: t("booking.bookedAt"),
  status: t("booking.status"),
  statusSuccess: t("booking.statuses.success"),
  customer: t("booking.invoiceCustomer"),
  fullName: t("booking.fullName"),
  phone: t("booking.phone"),
  email: t("booking.email"),
  tourDetails: t("booking.invoiceTourDetails"),
  tourName: t("thankYou.tourLabel"),
  checkIn: t("booking.checkIn"),
  checkOut: t("booking.checkOut"),
  guests: t("booking.guest"),
  nights: t("booking.nights"),
  paymentSummary: t("booking.invoicePayment"),
  subtotal: t("booking.invoiceSubtotal"),
  serviceCharge: t("booking.serviceCharge"),
  total: t("booking.total"),
  footer: t("booking.invoiceFooter"),
  print: t("booking.invoicePrint"),
});

export const exportBookingInvoice = (booking, labels = {}) => {
  if (!booking || booking.status !== "success") {
    throw new Error("Invoice can only be exported for successful bookings");
  }

  const ref = String(booking._id || "").slice(-8).toUpperCase();
  const nights = getBookingNights(booking.checkIn, booking.checkOut);
  const total = Number(booking.totalPrice) || 0;
  const serviceFee = BOOKING_SERVICE_FEE;
  const subtotal = Math.max(total - serviceFee, 0);
  const issuedAt = format(new Date(), "dd/MM/yyyy HH:mm");
  const bookedAt = booking.createdAt
    ? formatDate(booking.createdAt, "dd/MM/yyyy HH:mm")
    : "--";

  const L = {
    title: labels.title || "Invoice",
    company: labels.company || "Travel Booking",
    invoiceNo: labels.invoiceNo || "Invoice No.",
    issuedAt: labels.issuedAt || "Issued at",
    bookingRef: labels.bookingRef || "Booking code",
    bookedAt: labels.bookedAt || "Booked at",
    status: labels.status || "Status",
    statusSuccess: labels.statusSuccess || "Success",
    customer: labels.customer || "Customer",
    fullName: labels.fullName || "Full name",
    phone: labels.phone || "Phone",
    email: labels.email || "Email",
    tourDetails: labels.tourDetails || "Tour details",
    tourName: labels.tourName || "Tour",
    checkIn: labels.checkIn || "Check in",
    checkOut: labels.checkOut || "Check out",
    guests: labels.guests || "Guests",
    nights: labels.nights || "Nights",
    paymentSummary: labels.paymentSummary || "Payment summary",
    subtotal: labels.subtotal || "Subtotal",
    serviceCharge: labels.serviceCharge || "Service charge",
    total: labels.total || "Total",
    footer: labels.footer || "Thank you for booking with Travel Booking.",
    print: labels.print || "Print / Save PDF",
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(L.title)} - ${escapeHtml(ref)}</title>
  <style>
    :root {
      --ink: #1f2937;
      --muted: #6b7280;
      --line: #e5e7eb;
      --accent: #f7a325;
      --bg: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: var(--ink);
      background: #fff;
    }
    .invoice {
      max-width: 760px;
      margin: 0 auto;
      background: var(--bg);
      padding: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--accent);
    }
    .brand {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: 0.02em;
    }
    .brand span {
      display: block;
      margin-top: 4px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--muted);
    }
    .meta {
      text-align: right;
      font-size: 0.92rem;
      line-height: 1.6;
      color: var(--muted);
    }
    .meta strong { color: var(--ink); }
    .section {
      margin-top: 28px;
    }
    .section h3 {
      margin: 0 0 12px;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 24px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px dashed var(--line);
      font-size: 0.95rem;
    }
    .row span { color: var(--muted); }
    .row strong { color: var(--ink); font-weight: 600; text-align: right; }
    .totals {
      margin-top: 8px;
      border: 1px solid var(--line);
      border-radius: 10px;
      overflow: hidden;
    }
    .totals .row {
      padding: 12px 16px;
      border-bottom: 1px solid var(--line);
      margin: 0;
    }
    .totals .row:last-child {
      border-bottom: none;
      background: #fffbeb;
      font-size: 1.05rem;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid var(--line);
      text-align: center;
      color: var(--muted);
      font-size: 0.9rem;
    }
    @media print {
      body { padding: 0; }
      .invoice { max-width: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="brand">
        ${escapeHtml(L.company)}
        <span>${escapeHtml(L.title)}</span>
      </div>
      <div class="meta">
        <div>${escapeHtml(L.invoiceNo)}: <strong>INV-${escapeHtml(ref)}</strong></div>
        <div>${escapeHtml(L.issuedAt)}: <strong>${escapeHtml(issuedAt)}</strong></div>
        <div>${escapeHtml(L.bookingRef)}: <strong>${escapeHtml(ref)}</strong></div>
        <div>${escapeHtml(L.status)}: <strong>${escapeHtml(L.statusSuccess)}</strong></div>
      </div>
    </div>

    <div class="section">
      <h3>${escapeHtml(L.customer)}</h3>
      <div class="grid">
        <div class="row"><span>${escapeHtml(L.fullName)}</span><strong>${escapeHtml(booking.fullName)}</strong></div>
        <div class="row"><span>${escapeHtml(L.phone)}</span><strong>${escapeHtml(booking.phone)}</strong></div>
        <div class="row"><span>${escapeHtml(L.email)}</span><strong>${escapeHtml(booking.userEmail || "--")}</strong></div>
        <div class="row"><span>${escapeHtml(L.bookedAt)}</span><strong>${escapeHtml(bookedAt)}</strong></div>
      </div>
    </div>

    <div class="section">
      <h3>${escapeHtml(L.tourDetails)}</h3>
      <div class="grid">
        <div class="row"><span>${escapeHtml(L.tourName)}</span><strong>${escapeHtml(booking.tourName)}</strong></div>
        <div class="row"><span>${escapeHtml(L.guests)}</span><strong>${escapeHtml(booking.guestSize)}</strong></div>
        <div class="row"><span>${escapeHtml(L.checkIn)}</span><strong>${escapeHtml(formatDate(booking.checkIn))}</strong></div>
        <div class="row"><span>${escapeHtml(L.checkOut)}</span><strong>${escapeHtml(formatDate(booking.checkOut))}</strong></div>
        <div class="row"><span>${escapeHtml(L.nights)}</span><strong>${escapeHtml(nights)}</strong></div>
      </div>
    </div>

    <div class="section">
      <h3>${escapeHtml(L.paymentSummary)}</h3>
      <div class="totals">
        <div class="row"><span>${escapeHtml(L.subtotal)}</span><strong>${escapeHtml(formatMoney(subtotal))}</strong></div>
        <div class="row"><span>${escapeHtml(L.serviceCharge)}</span><strong>${escapeHtml(formatMoney(serviceFee))}</strong></div>
        <div class="row"><span>${escapeHtml(L.total)}</span><strong>${escapeHtml(formatMoney(total))}</strong></div>
      </div>
    </div>

    <div class="footer">${escapeHtml(L.footer)}</div>
  </div>
</body>
</html>`;

  printInvoiceHtml(html);
};

const printInvoiceHtml = (html) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "invoice-print");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDoc = frameWindow?.document;
  if (!frameWindow || !frameDoc) {
    iframe.remove();
    throw new Error("Unable to prepare invoice for printing");
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  let printed = false;
  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };

  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    try {
      frameWindow.focus();
      frameWindow.print();
    } finally {
      window.setTimeout(cleanup, 1000);
    }
  };

  // Give the browser a moment to render before opening the print dialog
  window.setTimeout(triggerPrint, 250);
};
