import React, { useMemo } from "react";
import { format, subMonths } from "date-fns";
import { useLanguage } from "../../i18n/LanguageContext";

const AdminCharts = ({ bookings }) => {
  const { t, language } = useLanguage();

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = subMonths(new Date(), 5 - index);
      return {
        key: format(date, "yyyy-MM"),
        label: format(date, language === "vi" ? "MM/yyyy" : "MMM yyyy"),
        revenue: 0,
        count: 0,
      };
    });

    bookings.forEach((booking) => {
      if (!booking?.createdAt) return;
      const key = format(new Date(booking.createdAt), "yyyy-MM");
      const month = months.find((item) => item.key === key);
      if (!month) return;

      month.revenue += Number(booking.totalPrice) || 0;
      month.count += 1;
    });

    return months;
  }, [bookings, language]);

  const maxRevenue = Math.max(...monthlyData.map((item) => item.revenue), 1);
  const maxCount = Math.max(...monthlyData.map((item) => item.count), 1);

  return (
    <div className="admin-charts">
      <article className="admin-chart-card">
        <h4>{t("admin.chartRevenue")}</h4>
        <div className="admin-chart-bars">
          {monthlyData.map((item) => (
            <div className="admin-chart-bar" key={`rev-${item.key}`}>
              <span className="admin-chart-bar__value">${item.revenue.toLocaleString()}</span>
              <div className="admin-chart-bar__track">
                <div
                  className="admin-chart-bar__fill admin-chart-bar__fill--revenue"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="admin-chart-bar__label">{item.label}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="admin-chart-card">
        <h4>{t("admin.chartBookings")}</h4>
        <div className="admin-chart-bars">
          {monthlyData.map((item) => (
            <div className="admin-chart-bar" key={`count-${item.key}`}>
              <span className="admin-chart-bar__value">{item.count}</span>
              <div className="admin-chart-bar__track">
                <div
                  className="admin-chart-bar__fill admin-chart-bar__fill--bookings"
                  style={{ height: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="admin-chart-bar__label">{item.label}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

export default AdminCharts;
