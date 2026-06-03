import React from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useLanguage } from "../../i18n/LanguageContext";

const DeleteTourModal = ({ isOpen, tour, onClose, onConfirm, deleting }) => {
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
          <i className="ri-delete-bin-line"></i>
        </span>
        <h3>{t("admin.deleteTourTitle")}</h3>
        <p>{t("admin.deleteTourMessage", { title: tour?.title || "" })}</p>
        {tour?.photo && (
          <div className="admin-delete-modal__preview">
            <img src={tour.photo} alt={tour.title} />
            <div>
              <strong>{tour.title}</strong>
              <span>{tour.city}</span>
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
                {t("admin.deleteConfirm")}
              </>
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteTourModal;
