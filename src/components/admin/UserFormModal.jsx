import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useLanguage } from "../../i18n/LanguageContext";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  role: "user",
};

const UserFormModal = ({ isOpen, user, onClose, onSubmit, submitting }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(user?._id);

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    } else if (!isEdit) {
      return;
    }

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size="md"
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
              <p>{isEdit ? t("admin.userForm.editSubtitle") : t("admin.userForm.addSubtitle")}</p>
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
          <section className="admin-tour-form__section">
            <div className="admin-tour-form__grid">
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.userForm.username")}</span>
                <input
                  id="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder={t("admin.userForm.usernamePlaceholder")}
                  required
                />
              </label>
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.userForm.email")}</span>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("admin.userForm.emailPlaceholder")}
                  required
                />
              </label>
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>
                  {isEdit ? t("admin.userForm.passwordOptional") : t("admin.userForm.password")}
                </span>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isEdit ? t("admin.userForm.passwordHint") : "••••••••"}
                  required={!isEdit}
                  minLength={isEdit ? undefined : 6}
                />
              </label>
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.userForm.role")}</span>
                <select id="role" value={form.role} onChange={handleChange}>
                  <option value="user">{t("admin.userForm.roleUser")}</option>
                  <option value="admin">{t("admin.userForm.roleAdmin")}</option>
                </select>
              </label>
            </div>
          </section>
        </ModalBody>

        <div className="admin-tour-modal__footer">
          <Button
            type="button"
            className="btn secondary__btn admin-tour-modal__btn"
            onClick={onClose}
            disabled={submitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="btn primary__btn admin-tour-modal__btn"
            disabled={submitting}
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
