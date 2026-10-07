import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useLanguage } from "../../i18n/LanguageContext";
import { uploadSingleImage } from "../../utils/uploadImage";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  role: "user",
  photo: "",
};

const UserFormModal = ({ isOpen, user, onClose, onSubmit, submitting }) => {
  const { t, language } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoMode, setPhotoMode] = useState("url");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const photoFileRef = useRef(null);
  const isEdit = Boolean(user?._id);
  const dateLocale = language === "vi" ? "vi-VN" : "en-US";

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
        photo: user.photo || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setPhotoMode("url");
    setShowPassword(false);
    setPhotoError(false);
  }, [isOpen, user]);

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
    } catch (err) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      photo: form.photo.trim(),
    };

    if (form.password.trim()) {
      payload.password = form.password;
    } else if (!isEdit) {
      return;
    }

    onSubmit(payload);
  };

  const initial = (form.username || form.email || "U").slice(0, 1).toUpperCase();
  const joinedLabel = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size="lg"
      scrollable
      className="admin-tour-modal admin-user-modal"
      zIndex={1400}
    >
      <form className="admin-tour-modal__form" onSubmit={handleSubmit}>
        <div className="admin-tour-modal__header">
          <div className="admin-tour-modal__header-main">
            <span className="admin-tour-modal__icon">
              <i className={isEdit ? "ri-user-settings-line" : "ri-user-add-line"}></i>
            </span>
            <div>
              <h3>{isEdit ? t("admin.editUser") : t("admin.addUser")}</h3>
              <p>
                {isEdit
                  ? t("admin.userForm.editSubtitle")
                  : t("admin.userForm.addSubtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-tour-modal__close"
            onClick={onClose}
            aria-label={t("common.cancel")}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <ModalBody className="admin-tour-modal__body">
          <div className="admin-user-preview">
            <div className="admin-user-preview__avatar">
              {form.photo && !photoError ? (
                <img
                  src={form.photo}
                  alt={form.username || "avatar"}
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div className="admin-user-preview__meta">
              <h4>{form.username || t("admin.userForm.usernamePlaceholder")}</h4>
              <p>{form.email || t("admin.userForm.emailPlaceholder")}</p>
              <div className="admin-user-preview__tags">
                <span
                  className={`admin-role-badge admin-role-badge--${form.role || "user"}`}
                >
                  {form.role === "admin"
                    ? t("admin.userForm.roleAdmin")
                    : t("admin.userForm.roleUser")}
                </span>
                {joinedLabel && (
                  <span className="admin-user-preview__joined">
                    <i className="ri-calendar-line"></i>
                    {t("admin.userForm.joined", { date: joinedLabel })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-user-line"></i>
              {t("admin.userForm.sections.profile")}
            </h4>
            <div className="admin-tour-form__grid">
              <label className="admin-tour-form__field">
                <span>{t("admin.userForm.username")}</span>
                <input
                  id="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder={t("admin.userForm.usernamePlaceholder")}
                  required
                  autoComplete="username"
                />
              </label>
              <label className="admin-tour-form__field">
                <span>{t("admin.userForm.email")}</span>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("admin.userForm.emailPlaceholder")}
                  required
                  autoComplete="email"
                />
              </label>
            </div>
          </section>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-image-line"></i>
              {t("admin.userForm.sections.avatar")}
            </h4>
            <div className="admin-tour-form__grid">
              <div className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.userForm.photo")}</span>
                <div className="admin-tour-form__media-tabs">
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
                  />
                ) : (
                  <div className="admin-tour-form__file-picker">
                    <input
                      ref={photoFileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="admin-tour-form__file-input"
                      onChange={handlePhotoFileChange}
                    />
                    <button
                      type="button"
                      className="admin-tour-form__file-btn"
                      onClick={() => photoFileRef.current?.click()}
                      disabled={uploadingPhoto || submitting}
                    >
                      {uploadingPhoto ? (
                        <>
                          <i className="ri-loader-4-line admin-tour-modal__spin"></i>
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
                    className="admin-user-photo-clear"
                    onClick={clearPhoto}
                  >
                    <i className="ri-delete-bin-line"></i>
                    {t("admin.userForm.removePhoto")}
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-lock-password-line"></i>
              {t("admin.userForm.sections.security")}
            </h4>
            <div className="admin-tour-form__grid">
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>
                  {isEdit
                    ? t("admin.userForm.passwordOptional")
                    : t("admin.userForm.password")}
                </span>
                <div className="admin-user-password">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      isEdit
                        ? t("admin.userForm.passwordHint")
                        : "••••••••"
                    }
                    required={!isEdit}
                    minLength={isEdit ? undefined : 6}
                    autoComplete={isEdit ? "new-password" : "new-password"}
                  />
                  <button
                    type="button"
                    className="admin-user-password__toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? t("admin.userForm.hidePassword")
                        : t("admin.userForm.showPassword")
                    }
                  >
                    <i
                      className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
                    ></i>
                  </button>
                </div>
                <small className="admin-user-field-hint">
                  {isEdit
                    ? t("admin.userForm.passwordHint")
                    : t("admin.userForm.passwordMin")}
                </small>
              </label>
            </div>
          </section>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-shield-user-line"></i>
              {t("admin.userForm.sections.role")}
            </h4>
            <div className="admin-user-role-cards">
              <label
                className={`admin-user-role-card ${
                  form.role === "user" ? "is-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={() => setForm((prev) => ({ ...prev, role: "user" }))}
                />
                <span className="admin-user-role-card__icon">
                  <i className="ri-user-smile-line"></i>
                </span>
                <span className="admin-user-role-card__body">
                  <strong>{t("admin.userForm.roleUser")}</strong>
                  <em>{t("admin.userForm.roleUserDesc")}</em>
                </span>
              </label>
              <label
                className={`admin-user-role-card ${
                  form.role === "admin" ? "is-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, role: "admin" }))
                  }
                />
                <span className="admin-user-role-card__icon admin-user-role-card__icon--admin">
                  <i className="ri-admin-line"></i>
                </span>
                <span className="admin-user-role-card__body">
                  <strong>{t("admin.userForm.roleAdmin")}</strong>
                  <em>{t("admin.userForm.roleAdminDesc")}</em>
                </span>
              </label>
            </div>
          </section>
        </ModalBody>

        <div className="admin-tour-modal__footer">
          <Button
            type="button"
            className="btn secondary__btn admin-tour-modal__btn"
            onClick={onClose}
            disabled={submitting || uploadingPhoto}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="btn primary__btn admin-tour-modal__btn"
            disabled={submitting || uploadingPhoto}
          >
            {submitting ? (
              <>
                <i className="ri-loader-4-line admin-tour-modal__spin"></i>
                {t("admin.saving")}
              </>
            ) : (
              <>
                <i className={isEdit ? "ri-save-3-line" : "ri-add-line"}></i>
                {isEdit ? t("admin.saveChanges") : t("admin.createUser")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
