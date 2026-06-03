import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, ModalBody, Button } from "reactstrap";
import { useLanguage } from "../../i18n/LanguageContext";
import "../../styles/toast.css";

const AuthPromptModal = ({ isOpen, message, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const goToLogin = () => {
    onClose();
    navigate("/login", { state: { from: location } });
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered className="auth-prompt-modal" zIndex={1400}>
      <ModalBody className="auth-prompt-modal__body">
        <span className="auth-prompt-modal__icon">
          <i className="ri-user-follow-line"></i>
        </span>
        <h3>{t("modal.signInRequired")}</h3>
        <p>{message}</p>
        <div className="auth-prompt-modal__actions">
          <Button className="btn secondary__btn" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button className="btn primary__btn" onClick={goToLogin}>
            {t("modal.signIn")}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AuthPromptModal;
