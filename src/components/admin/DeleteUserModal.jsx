import React from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useLanguage } from "../../i18n/LanguageContext";

const DeleteUserModal = ({ isOpen, user, onClose, onConfirm, deleting }) => {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      className="admin-delete-modal"
      zIndex={1400}
    >
      <ModalBody className="admin-delete-modal__body">
        <span className="admin-delete-modal__icon">
          <i className="ri-user-unfollow-line"></i>
        </span>
        <h3>{t("admin.deleteUserTitle")}</h3>
        <p>{t("admin.deleteUserMessage", { name: user?.username || user?.email || "" })}</p>
        {user && (
          <div className="admin-delete-modal__preview">
            <span className="admin-delete-user-modal__avatar">
              {(user.username || user.email || "U").slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{user.username}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        )}
        <div className="admin-delete-modal__actions">
          <Button
            type="button"
            className="btn secondary__btn"
            onClick={onClose}
            disabled={deleting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            className="btn admin-delete-modal__confirm-btn"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <i className="ri-loader-4-line admin-delete-modal__spin"></i>
                {t("admin.deleting")}
              </>
            ) : (
              <>
                <i className="ri-delete-bin-line"></i>
                {t("admin.deleteUserConfirm")}
              </>
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteUserModal;
