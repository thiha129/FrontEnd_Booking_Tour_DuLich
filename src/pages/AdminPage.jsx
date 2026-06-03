import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import CommonSection from "../shared/CommonSection";
import { BASE_URL } from "../utils/config";
import { useLanguage } from "../i18n/LanguageContext";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import TourFormModal from "../components/admin/TourFormModal";
import DeleteTourModal from "../components/admin/DeleteTourModal";
import UserFormModal from "../components/admin/UserFormModal";
import DeleteUserModal from "../components/admin/DeleteUserModal";
import AdminCharts from "../components/admin/AdminCharts";
import "../styles/admin-page.css";

const TABS = ["overview", "tours", "bookings", "users"];
const BOOKING_STATUSES = ["pending", "success", "cancelled"];

const AdminPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user: currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [savingTour, setSavingTour] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTour, setDeletingTour] = useState(null);
  const [deletingTourLoading, setDeletingTourLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [savingUser, setSavingUser] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingUserLoading, setDeletingUserLoading] = useState(false);

  const loadData = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    if (silent) setRefreshing(true);
    setError("");

    try {
      const [toursRes, usersRes, bookingsRes] = await Promise.all([
        fetch(`${BASE_URL}/tours?limit=500`),
        fetch(`${BASE_URL}/users`, { credentials: "include" }),
        fetch(`${BASE_URL}/booking`, { credentials: "include" }),
      ]);

      const toursResult = await toursRes.json();
      const usersResult = await usersRes.json();
      const bookingsResult = await bookingsRes.json();

      if (!toursRes.ok) {
        throw new Error(toursResult.message || "Failed to load tours");
      }

      if (!usersRes.ok) {
        throw new Error(usersResult.message || "Failed to load users");
      }

      if (!bookingsRes.ok) {
        throw new Error(bookingsResult.message || "Failed to load bookings");
      }

      setTours(Array.isArray(toursResult.data) ? toursResult.data : []);
      setUsers(Array.isArray(usersResult.data) ? usersResult.data : []);
      setBookings(Array.isArray(bookingsResult.data) ? bookingsResult.data : []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTours = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const sortedTours = [...tours].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    if (!keyword) return sortedTours;

    return sortedTours.filter((tour) =>
      [tour.title, tour.city, tour.address]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [search, tours]);

  const filteredBookings = useMemo(() => {
    const keyword = bookingSearch.trim().toLowerCase();
    const sortedBookings = [...bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    if (!keyword) return sortedBookings;

    return sortedBookings.filter((booking) =>
      [booking.tourName, booking.fullName, booking.userEmail, booking.phone]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [bookingSearch, bookings]);

  const filteredUsers = useMemo(() => {
    const keyword = userSearch.trim().toLowerCase();
    const sortedUsers = [...users].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    if (!keyword) return sortedUsers;

    return sortedUsers.filter((user) =>
      [user.username, user.email, user.role]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [userSearch, users]);

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + (Number(booking.totalPrice) || 0), 0),
    [bookings],
  );

  const stats = useMemo(
    () => [
      {
        key: "tours",
        icon: "ri-map-2-line",
        label: t("admin.totalTours"),
        value: tours.length,
      },
      {
        key: "bookings",
        icon: "ri-calendar-check-line",
        label: t("admin.totalBookings"),
        value: bookings.length,
      },
      {
        key: "revenue",
        icon: "ri-money-dollar-circle-line",
        label: t("admin.totalRevenue"),
        value: `$${totalRevenue.toLocaleString()}`,
      },
      {
        key: "users",
        icon: "ri-group-line",
        label: t("admin.totalUsers"),
        value: users.length,
      },
    ],
    [tours, bookings, users, totalRevenue, t],
  );

  const openCreateTour = () => {
    setEditingTour(null);
    setTourModalOpen(true);
  };

  const openEditTour = (tour) => {
    setEditingTour(tour);
    setTourModalOpen(true);
  };

  const closeTourModal = () => {
    if (savingTour) return;
    setTourModalOpen(false);
    setEditingTour(null);
  };

  const saveTour = async (payload) => {
    setSavingTour(true);

    try {
      const isEdit = Boolean(editingTour?._id);
      const url = isEdit
        ? `${BASE_URL}/tours/${editingTour._id}`
        : `${BASE_URL}/tours`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || t("admin.saveFailed"));
      }

      if (isEdit) {
        setTours((prev) =>
          prev.map((tour) => (tour._id === editingTour._id ? result.data : tour)),
        );
        toast.success(t("admin.updateSuccess"));
      } else {
        setTours((prev) => [result.data, ...prev]);
        toast.success(t("admin.createSuccess"));
      }

      setTourModalOpen(false);
      setEditingTour(null);
    } catch (err) {
      toast.error(err.message || t("admin.saveFailed"));
    } finally {
      setSavingTour(false);
    }
  };

  const openDeleteTour = (tour) => {
    setDeletingTour(tour);
    setDeleteModalOpen(true);
  };

  const closeDeleteTourModal = () => {
    if (deletingTourLoading) return;
    setDeleteModalOpen(false);
    setDeletingTour(null);
  };

  const confirmDeleteTour = async () => {
    if (!deletingTour?._id) return;

    setDeletingTourLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/tours/${deletingTour._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || t("admin.deleteFailed"));

      setTours((prev) => prev.filter((tour) => tour._id !== deletingTour._id));
      toast.success(t("admin.deleteSuccess"));
      setDeleteModalOpen(false);
      setDeletingTour(null);
    } catch (err) {
      toast.error(err.message || t("admin.deleteFailed"));
    } finally {
      setDeletingTourLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    setUpdatingBookingId(bookingId);

    try {
      const res = await fetch(`${BASE_URL}/booking/${bookingId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || t("admin.bookingStatusFailed"));

      setBookings((prev) =>
        prev.map((booking) => (booking._id === bookingId ? result.data : booking)),
      );
      toast.success(t("admin.bookingStatusUpdated"));
    } catch (err) {
      toast.error(err.message || t("admin.bookingStatusFailed"));
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getBookingStatusLabel = (status) => {
    const key = status || "pending";
    return t(`booking.statuses.${key}`);
  };

  const openCreateUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    if (savingUser) return;
    setUserModalOpen(false);
    setEditingUser(null);
  };

  const saveUser = async (payload) => {
    setSavingUser(true);

    try {
      const isEdit = Boolean(editingUser?._id);
      const url = isEdit
        ? `${BASE_URL}/users/${editingUser._id}`
        : `${BASE_URL}/users`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || t("admin.userSaveFailed"));
      }

      if (isEdit) {
        setUsers((prev) =>
          prev.map((user) => (user._id === editingUser._id ? result.data : user)),
        );
        toast.success(t("admin.userUpdateSuccess"));
      } else {
        setUsers((prev) => [result.data, ...prev]);
        toast.success(t("admin.userCreateSuccess"));
      }

      setUserModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      toast.error(err.message || t("admin.userSaveFailed"));
    } finally {
      setSavingUser(false);
    }
  };

  const openDeleteUser = (user) => {
    if (user._id === currentUser?._id) {
      toast.warning(t("admin.cannotDeleteSelf"));
      return;
    }
    setDeletingUser(user);
    setDeleteUserModalOpen(true);
  };

  const closeDeleteUserModal = () => {
    if (deletingUserLoading) return;
    setDeleteUserModalOpen(false);
    setDeletingUser(null);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser?._id) return;

    setDeletingUserLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/${deletingUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || t("admin.userDeleteFailed"));

      setUsers((prev) => prev.filter((user) => user._id !== deletingUser._id));
      toast.success(t("admin.userDeleteSuccess"));
      setDeleteUserModalOpen(false);
      setDeletingUser(null);
    } catch (err) {
      toast.error(err.message || t("admin.userDeleteFailed"));
    } finally {
      setDeletingUserLoading(false);
    }
  };

  const dateLocale = language === "vi" ? "vi-VN" : "en-US";

  return (
    <div>
      <CommonSection title={t("admin.pageTitle")} />
      <section className="admin-page">
        <Container>
          <div className="admin-toolbar">
            <div className="admin-tabs">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={activeTab === tab ? "is-active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(`admin.tabs.${tab}`)}
                </button>
              ))}
            </div>
            <div className="admin-toolbar__actions">
              {activeTab === "tours" && (
                <button type="button" className="admin-add-btn" onClick={openCreateTour}>
                  <i className="ri-add-line"></i>
                  {t("admin.addTour")}
                </button>
              )}
              {activeTab === "users" && (
                <button type="button" className="admin-add-btn" onClick={openCreateUser}>
                  <i className="ri-user-add-line"></i>
                  {t("admin.addUser")}
                </button>
              )}
              <button
                type="button"
                className="admin-refresh-btn"
                onClick={() => loadData({ silent: true })}
                disabled={refreshing || loading}
              >
                <i className={`ri-refresh-line${refreshing ? " spin" : ""}`}></i>
                {t("admin.refresh")}
              </button>
            </div>
          </div>

          {loading && (
            <h4 className="loading-state text-center py-5">{t("common.loading")}</h4>
          )}
          {error && <p className="admin-error">{error}</p>}

          {!loading && !error && (
            <>
              {activeTab === "overview" && (
                <div className="admin-overview">
                  <div className="admin-stats-grid">
                    {stats.map((item) => (
                      <article className="admin-stat-card" key={item.key}>
                        <span className="admin-stat-card__icon">
                          <i className={item.icon}></i>
                        </span>
                        <h3>{item.value}</h3>
                        <p>{item.label}</p>
                      </article>
                    ))}
                  </div>

                  <AdminCharts bookings={bookings} />

                  <div className="admin-panel">
                    <h4>{t("admin.latestBookings")}</h4>
                    <div className="admin-list">
                      {filteredBookings.slice(0, 5).map((booking) => (
                        <div className="admin-list-item" key={booking._id}>
                          <div className="admin-list-item__icon">
                            <i className="ri-ticket-2-line"></i>
                          </div>
                          <div>
                            <h5>{booking.tourName}</h5>
                            <p>
                              {booking.fullName} · ${booking.totalPrice}
                            </p>
                          </div>
                          <Link to={`/userinfo/booking/${booking._id}`} className="admin-open-btn">
                            <i className="ri-external-link-line"></i>
                            {t("admin.open")}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tours" && (
                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <h4>{t("admin.manageTours")}</h4>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("admin.searchTours")}
                    />
                  </div>

                  <div className="admin-table admin-table--tours">
                    {filteredTours.map((tour) => (
                      <div className="admin-row admin-row--tours" key={tour._id}>
                        <div className="admin-row__tour">
                          <img src={tour.photo} alt={tour.title} />
                          <div>
                            <h5>{tour.title}</h5>
                            <p>
                              {tour.city} · {tour.distance} km
                            </p>
                          </div>
                        </div>
                        <span>${tour.price}</span>
                        <span>{tour.featured ? t("admin.featured") : t("admin.normal")}</span>
                        <div className="admin-row__actions">
                          <button type="button" onClick={() => openEditTour(tour)}>
                            {t("admin.edit")}
                          </button>
                          <Link to={`/tours/${tour._id}`} className="admin-open-btn">
                            <i className="ri-external-link-line"></i>
                            {t("admin.open")}
                          </Link>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => openDeleteTour(tour)}
                          >
                            {t("admin.delete")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <h4>{t("admin.manageBookings")}</h4>
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      placeholder={t("admin.searchBookings")}
                    />
                  </div>

                  <div className="admin-table admin-table--bookings">
                    {filteredBookings.map((booking) => (
                      <div className="admin-row admin-row--bookings" key={booking._id}>
                        <div>
                          <h5>{booking.tourName}</h5>
                          <p>{booking.fullName}</p>
                        </div>
                        <span>{booking.guestSize} {t("booking.guest")}</span>
                        <span>${Number(booking.totalPrice).toLocaleString()}</span>
                        <span>
                          {format(new Date(booking.checkIn), "dd/MM/yyyy")} -{" "}
                          {format(new Date(booking.checkOut), "dd/MM/yyyy")}
                        </span>
                        <span>
                          {new Date(booking.createdAt).toLocaleDateString(dateLocale)}
                        </span>
                        <select
                          className={`admin-booking-status admin-booking-status--${booking.status || "pending"}`}
                          value={booking.status || "pending"}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          disabled={updatingBookingId === booking._id}
                        >
                          {BOOKING_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {getBookingStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                        <Link to={`/userinfo/booking/${booking._id}`} className="admin-open-btn">
                          <i className="ri-external-link-line"></i>
                          {t("admin.open")}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <h4>{t("admin.manageUsers")}</h4>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={t("admin.searchUsers")}
                    />
                  </div>

                  <div className="admin-table admin-table--users">
                    {filteredUsers.map((user) => (
                      <div className="admin-row admin-row--users" key={user._id}>
                        <div className="admin-row__user">
                          <span>
                            {(user.username || user.email || "U").slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <h5>{user.username}</h5>
                            <p>{user.email}</p>
                          </div>
                        </div>
                        <span className={`admin-role-badge admin-role-badge--${user.role || "user"}`}>
                          {user.role === "admin" ? t("admin.userForm.roleAdmin") : t("admin.userForm.roleUser")}
                        </span>
                        <span>
                          {new Date(user.createdAt).toLocaleDateString(dateLocale)}
                        </span>
                        <div className="admin-row__actions">
                          <button type="button" onClick={() => openEditUser(user)}>
                            {t("admin.edit")}
                          </button>
                          <Link to={`/userinfo/${user._id}`} className="admin-open-btn">
                            <i className="ri-external-link-line"></i>
                            {t("admin.open")}
                          </Link>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => openDeleteUser(user)}
                            disabled={user._id === currentUser?._id}
                          >
                            {t("admin.delete")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      <TourFormModal
        isOpen={tourModalOpen}
        tour={editingTour}
        onClose={closeTourModal}
        onSubmit={saveTour}
        submitting={savingTour}
      />

      <DeleteTourModal
        isOpen={deleteModalOpen}
        tour={deletingTour}
        onClose={closeDeleteTourModal}
        onConfirm={confirmDeleteTour}
        deleting={deletingTourLoading}
      />

      <UserFormModal
        isOpen={userModalOpen}
        user={editingUser}
        onClose={closeUserModal}
        onSubmit={saveUser}
        submitting={savingUser}
      />

      <DeleteUserModal
        isOpen={deleteUserModalOpen}
        user={deletingUser}
        onClose={closeDeleteUserModal}
        onConfirm={confirmDeleteUser}
        deleting={deletingUserLoading}
      />
    </div>
  );
};

export default AdminPage;
