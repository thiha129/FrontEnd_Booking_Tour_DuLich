import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "reactstrap";
import CommonSection from "../shared/CommonSection";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { useToast } from "../context/ToastContext";
import { BASE_URL } from "../utils/config";
import { uploadSingleImage } from "../utils/uploadImage";
import "../styles/profile.css";

const ProfilePage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user, dispatch, initializing } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    photo: "",
  });
  const [photoMode, setPhotoMode] = useState("url");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [saving, setSaving] = useState(false);
  const photoFileRef = useRef(null);
  const dateLocale = language === "vi" ? "vi-VN" : "en-US";

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      photo: user.photo || "",
    });
    setPhotoError(false);
  }, [user]);

  if (initializing) {
    return (
      <div>
        <CommonSection title={t("profile.title")} />
        <Container className="profile-page">
          <p className="profile-page__loading">{t("common.loading")}</p>
        </Container>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (id === "photo") setPhotoError(false);
  };

  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const url = await uploadSingleImage(file);
      setForm((prev) => ({ ...prev, photo: url }));
      setPhotoError(false);
    } catch {
      toast.error(t("profile.uploadFailed"));
      setPhotoError(true);
    } finally {
      setUploadingPhoto(false);
      if (photoFileRef.current) photoFileRef.current.value = "";
    }
  };

  const clearPhoto = () => {
    setForm((prev) => ({ ...prev, photo: "" }));
    setPhotoError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        photo: form.photo.trim(),
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || t("profile.saveFailed"));
      }

      dispatch({ type: "UPDATE_USER", payload: result.data });
      setForm((prev) => ({ ...prev, password: "" }));
      toast.success(t("profile.saveSuccess"));
    } catch (err) {
      toast.error(err.message || t("profile.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const initial = (form.username || form.email || "U").slice(0, 1).toUpperCase();
  const joinedLabel = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div>
      <CommonSection title={t("profile.title")} />
      <section className="profile-page">
        <Container>
          <div className="profile-layout">
            <aside className="profile-aside">
              <div className="profile-aside__card">
                <div className="profile-aside__avatar">
                  {form.photo && !photoError ? (
                    <img
                      src={form.photo}
                      alt={form.username}
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <h2>{form.username || user.username}</h2>
                <p>{form.email || user.email}</p>
                <span
                  className={`profile-role-badge profile-role-badge--${
                    user.role || "user"
                  }`}
                >
                  {user.role === "admin"
                    ? t("admin.userForm.roleAdmin")
                    : t("admin.userForm.roleUser")}
                </span>
                <ul className="profile-aside__stats">
                  <li>
                    <i className="ri-calendar-check-line"></i>
                    <div>
                      <span>{t("profile.memberSince")}</span>
                      <strong>{joinedLabel}</strong>
                    </div>
                  </li>
                  <li>
                    <i className="ri-mail-line"></i>
                    <div>
                      <span>{t("profile.emailLabel")}</span>
                      <strong>{user.email}</strong>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="profile-aside__links">
                <Link to={`/userinfo/${user._id}`} className="profile-quick-link">
                  <i className="ri-ticket-2-line"></i>
                  <span>
                    <strong>{t("profile.myBookings")}</strong>
                    <em>{t("profile.myBookingsDesc")}</em>
                  </span>
                  <i className="ri-arrow-right-s-line"></i>
                </Link>
                <Link to="/wishlist" className="profile-quick-link">
                  <i className="ri-heart-line"></i>
                  <span>
                    <strong>{t("profile.myWishlist")}</strong>
                    <em>{t("profile.myWishlistDesc")}</em>
                  </span>
                  <i className="ri-arrow-right-s-line"></i>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="profile-quick-link">
                    <i className="ri-dashboard-3-line"></i>
                    <span>
                      <strong>{t("nav.admin")}</strong>
                      <em>{t("profile.adminDesc")}</em>
                    </span>
                    <i className="ri-arrow-right-s-line"></i>
                  </Link>
                )}
              </div>
            </aside>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form__header">
                <h3>{t("profile.editTitle")}</h3>
                <p>{t("profile.editSubtitle")}</p>
              </div>

              <section className="profile-form__section">
                <h4>
                  <i className="ri-user-line"></i>
                  {t("profile.sections.account")}
                </h4>
                <div className="profile-form__grid">
                  <label className="profile-form__field">
                    <span>{t("admin.userForm.username")}</span>
                    <input
                      id="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      autoComplete="username"
                    />
                  </label>
                  <label className="profile-form__field">
                    <span>{t("admin.userForm.email")}</span>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </label>
                </div>
              </section>

              <section className="profile-form__section">
                <h4>
                  <i className="ri-image-line"></i>
                  {t("profile.sections.avatar")}
                </h4>
                <div className="profile-form__media-tabs">
                  <button
                    type="button"
                    className={photoMode === "url" ? "active" : ""}
                    onClick={() => setPhotoMode("url")}
                  >
                    <i className="ri-link"></i>
                    {t("admin.form.imageUrl")}
                  </button>
                  <button
                    type="button"
                    className={photoMode === "file" ? "active" : ""}
                    onClick={() => setPhotoMode("file")}
                  >
                    <i className="ri-upload-2-line"></i>
                    {t("admin.form.imageFile")}
                  </button>
                </div>
                {photoMode === "url" ? (
                  <input
                    id="photo"
                    value={form.photo}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="profile-form__input"
                  />
                ) : (
                  <div className="profile-form__file-picker">
                    <input
                      ref={photoFileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="profile-form__file-input"
                      onChange={handlePhotoFileChange}
                    />
                    <button
                      type="button"
                      className="profile-form__file-btn"
                      onClick={() => photoFileRef.current?.click()}
                      disabled={uploadingPhoto || saving}
                    >
                      {uploadingPhoto ? (
                        <>
                          <i className="ri-loader-4-line profile-spin"></i>
                          {t("admin.form.uploading")}
                        </>
                      ) : (
                        <>
                          <i className="ri-folder-image-line"></i>
                          {t("admin.userForm.choosePhoto")}
                        </>
                      )}
                    </button>
                  </div>
                )}
                {form.photo && (
                  <button
                    type="button"
                    className="profile-form__clear-photo"
                    onClick={clearPhoto}
                  >
                    <i className="ri-delete-bin-line"></i>
                    {t("admin.userForm.removePhoto")}
                  </button>
                )}
              </section>

              <section className="profile-form__section">
                <h4>
                  <i className="ri-lock-password-line"></i>
                  {t("profile.sections.security")}
                </h4>
                <label className="profile-form__field">
                  <span>{t("admin.userForm.passwordOptional")}</span>
                  <div className="profile-form__password">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder={t("admin.userForm.passwordHint")}
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? t("admin.userForm.hidePassword")
                          : t("admin.userForm.showPassword")
                      }
                    >
                      <i
                        className={
                          showPassword ? "ri-eye-off-line" : "ri-eye-line"
                        }
                      ></i>
                    </button>
                  </div>
                  <small>{t("admin.userForm.passwordHint")}</small>
                </label>
              </section>

              <div className="profile-form__actions">
                <Button
                  type="submit"
                  className="btn primary__btn"
                  disabled={saving || uploadingPhoto}
                >
                  {saving ? (
                    <>
                      <i className="ri-loader-4-line profile-spin"></i>
                      {t("admin.saving")}
                    </>
                  ) : (
                    <>
                      <i className="ri-save-3-line"></i>
                      {t("profile.saveChanges")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ProfilePage;
