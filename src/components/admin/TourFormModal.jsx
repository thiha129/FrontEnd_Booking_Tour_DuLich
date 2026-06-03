import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useLanguage } from "../../i18n/LanguageContext";
import { uploadSingleImage, uploadMultipleImages } from "../../utils/uploadImage";

const EMPTY_FORM = {
  title: "",
  city: "",
  address: "",
  distance: "",
  photo: "",
  desc: "",
  price: "",
  maxGroupSize: "",
  featured: false,
};

const TourFormModal = ({ isOpen, tour, onClose, onSubmit, submitting }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [photoError, setPhotoError] = useState(false);
  const [photoMode, setPhotoMode] = useState("url");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const coverFileRef = useRef(null);
  const galleryFileRef = useRef(null);
  const isEdit = Boolean(tour?._id);

  useEffect(() => {
    if (!isOpen) return;

    if (tour) {
      const gallery = Array.isArray(tour.photos) ? tour.photos.filter(Boolean) : [];
      setForm({
        title: tour.title || "",
        city: tour.city || "",
        address: tour.address || "",
        distance: tour.distance ?? "",
        photo: tour.photo || "",
        desc: tour.desc || "",
        price: tour.price ?? "",
        maxGroupSize: tour.maxGroupSize ?? "",
        featured: Boolean(tour.featured),
      });
      setGalleryPhotos(gallery);
      setGalleryUrlInput("");
      setPhotoError(false);
      setPhotoMode("url");
      return;
    }

    setForm(EMPTY_FORM);
    setGalleryPhotos([]);
    setGalleryUrlInput("");
    setPhotoError(false);
    setPhotoMode("url");
  }, [isOpen, tour]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    if (id === "photo") {
      setPhotoError(false);
    }
  };

  const addGalleryUrls = (urls) => {
    setGalleryPhotos((prev) => {
      const merged = [...prev];
      urls.forEach((url) => {
        const trimmed = url.trim();
        if (trimmed && !merged.includes(trimmed)) {
          merged.push(trimmed);
        }
      });
      return merged;
    });
  };

  const handleAddGalleryUrl = () => {
    const url = galleryUrlInput.trim();
    if (!url) return;
    addGalleryUrls([url]);
    setGalleryUrlInput("");
  };

  const handleGalleryUrlKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGalleryUrl();
    }
  };

  const removeGalleryPhoto = (index) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const moveGalleryPhoto = (index, direction) => {
    setGalleryPhotos((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoError(false);
    try {
      const url = await uploadSingleImage(file);
      setForm((prev) => ({ ...prev, photo: url }));
    } catch (err) {
      setPhotoError(true);
      alert(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGalleryFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploadingGallery(true);
    try {
      const urls = await uploadMultipleImages(files);
      addGalleryUrls(urls);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const photos = galleryPhotos.map((item) => item.trim()).filter(Boolean);

    onSubmit({
      title: form.title.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      distance: Number(form.distance),
      photo: form.photo.trim() || photos[0] || "",
      photos: photos.length > 0 ? photos : form.photo.trim() ? [form.photo.trim()] : [],
      desc: form.desc.trim(),
      price: Number(form.price),
      maxGroupSize: Number(form.maxGroupSize),
      featured: form.featured,
    });
  };

  const showPhotoPreview = form.photo.trim().length > 0 && !photoError;
  const isUploading = uploadingPhoto || uploadingGallery;

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size="lg"
      scrollable
      className="admin-tour-modal"
      zIndex={1400}
    >
      <form className="admin-tour-modal__form" onSubmit={handleSubmit}>
        <div className="admin-tour-modal__header">
          <div className="admin-tour-modal__header-main">
            <span className="admin-tour-modal__icon">
              <i className={isEdit ? "ri-edit-2-line" : "ri-map-pin-add-line"}></i>
            </span>
            <div>
              <h3>{isEdit ? t("admin.editTour") : t("admin.addTour")}</h3>
              <p>{isEdit ? t("admin.form.editSubtitle") : t("admin.form.addSubtitle")}</p>
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
            <h4 className="admin-tour-form__section-title">
              <i className="ri-information-line"></i>
              {t("admin.form.sections.basic")}
            </h4>
            <div className="admin-tour-form__grid">
              <label className="admin-tour-form__field">
                <span>{t("admin.form.title")}</span>
                <input
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={t("admin.form.titlePlaceholder")}
                  required
                />
              </label>
              <label className="admin-tour-form__field">
                <span>{t("admin.form.city")}</span>
                <input
                  id="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder={t("admin.form.cityPlaceholder")}
                  required
                />
              </label>
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.form.address")}</span>
                <input
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t("admin.form.addressPlaceholder")}
                  required
                />
              </label>
            </div>
          </section>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-price-tag-3-line"></i>
              {t("admin.form.sections.pricing")}
            </h4>
            <div className="admin-tour-form__grid admin-tour-form__grid--3">
              <label className="admin-tour-form__field">
                <span>{t("admin.form.distance")}</span>
                <div className="admin-tour-form__input-wrap">
                  <input
                    id="distance"
                    type="number"
                    min="0"
                    value={form.distance}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                  <span className="admin-tour-form__suffix">km</span>
                </div>
              </label>
              <label className="admin-tour-form__field">
                <span>{t("admin.form.price")}</span>
                <div className="admin-tour-form__input-wrap">
                  <input
                    id="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                  <span className="admin-tour-form__suffix">$</span>
                </div>
              </label>
              <label className="admin-tour-form__field">
                <span>{t("admin.form.maxGroupSize")}</span>
                <input
                  id="maxGroupSize"
                  type="number"
                  min="1"
                  value={form.maxGroupSize}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
              </label>
            </div>
          </section>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-image-line"></i>
              {t("admin.form.sections.media")}
            </h4>
            <div className="admin-tour-form__grid">
              <div className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.form.photo")}</span>
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
                      ref={coverFileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="admin-tour-form__file-input"
                      onChange={handleCoverFileChange}
                    />
                    <button
                      type="button"
                      className="admin-tour-form__file-btn"
                      onClick={() => coverFileRef.current?.click()}
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
                          {t("admin.form.chooseFile")}
                        </>
                      )}
                    </button>
                    {form.photo.trim() && (
                      <p className="admin-tour-form__file-hint">{form.photo}</p>
                    )}
                  </div>
                )}
                {showPhotoPreview && (
                  <div className="admin-tour-form__photo-preview">
                    <img
                      src={form.photo.trim()}
                      alt=""
                      onError={() => setPhotoError(true)}
                      onLoad={() => setPhotoError(false)}
                    />
                  </div>
                )}
              </div>

              <div className="admin-tour-form__field admin-tour-form__full admin-tour-form__gallery">
                <div className="admin-tour-form__gallery-head">
                  <span>{t("admin.form.photos")}</span>
                  {galleryPhotos.length > 0 && (
                    <span className="admin-tour-form__gallery-count">
                      {t("admin.form.galleryCount").replace(
                        "{{count}}",
                        String(galleryPhotos.length)
                      )}
                    </span>
                  )}
                </div>
                <p className="admin-tour-form__hint">{t("admin.form.photosHint")}</p>

                <div className="admin-tour-form__gallery-add">
                  <input
                    type="text"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    onKeyDown={handleGalleryUrlKeyDown}
                    placeholder={t("admin.form.galleryUrlPlaceholder")}
                  />
                  <button
                    type="button"
                    className="admin-tour-form__gallery-add-btn"
                    onClick={handleAddGalleryUrl}
                    disabled={!galleryUrlInput.trim() || submitting}
                  >
                    <i className="ri-add-line"></i>
                    {t("admin.form.addGalleryImage")}
                  </button>
                </div>

                <div className="admin-tour-form__gallery-actions">
                  <input
                    ref={galleryFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="admin-tour-form__file-input"
                    onChange={handleGalleryFileChange}
                  />
                  <button
                    type="button"
                    className="admin-tour-form__file-btn"
                    onClick={() => galleryFileRef.current?.click()}
                    disabled={uploadingGallery || submitting}
                  >
                    {uploadingGallery ? (
                      <>
                        <i className="ri-loader-4-line admin-tour-modal__spin"></i>
                        {t("admin.form.uploading")}
                      </>
                    ) : (
                      <>
                        <i className="ri-gallery-upload-line"></i>
                        {t("admin.form.chooseFiles")}
                      </>
                    )}
                  </button>
                </div>

                {galleryPhotos.length === 0 ? (
                  <div className="admin-tour-form__gallery-empty">
                    <i className="ri-image-add-line"></i>
                    <p>{t("admin.form.galleryEmpty")}</p>
                  </div>
                ) : (
                  <ul className="admin-tour-form__gallery-list">
                    {galleryPhotos.map((url, index) => (
                      <li key={`${url}-${index}`} className="admin-tour-form__gallery-item">
                        <div className="admin-tour-form__gallery-thumb">
                          <img src={url} alt="" />
                          <span className="admin-tour-form__gallery-index">{index + 1}</span>
                        </div>
                        <p className="admin-tour-form__gallery-url" title={url}>
                          {url}
                        </p>
                        <div className="admin-tour-form__gallery-item-actions">
                          <button
                            type="button"
                            className="admin-tour-form__gallery-move"
                            onClick={() => moveGalleryPhoto(index, -1)}
                            disabled={index === 0}
                            aria-label="Move up"
                          >
                            <i className="ri-arrow-up-s-line"></i>
                          </button>
                          <button
                            type="button"
                            className="admin-tour-form__gallery-move"
                            onClick={() => moveGalleryPhoto(index, 1)}
                            disabled={index === galleryPhotos.length - 1}
                            aria-label="Move down"
                          >
                            <i className="ri-arrow-down-s-line"></i>
                          </button>
                          <button
                            type="button"
                            className="admin-tour-form__gallery-remove"
                            onClick={() => removeGalleryPhoto(index)}
                            aria-label={t("admin.form.removeGalleryImage")}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="admin-tour-form__section">
            <h4 className="admin-tour-form__section-title">
              <i className="ri-file-text-line"></i>
              {t("admin.form.sections.description")}
            </h4>
            <div className="admin-tour-form__grid">
              <label className="admin-tour-form__field admin-tour-form__full">
                <span>{t("admin.form.desc")}</span>
                <textarea
                  id="desc"
                  rows="4"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder={t("admin.form.descPlaceholder")}
                  required
                />
              </label>
              <div className="admin-tour-form__featured admin-tour-form__full">
                <div>
                  <strong>{t("admin.form.featured")}</strong>
                  <p>{t("admin.form.featuredHint")}</p>
                </div>
                <label className="admin-tour-form__toggle">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  <span className="admin-tour-form__toggle-track"></span>
                </label>
              </div>
            </div>
          </section>
        </ModalBody>

        <div className="admin-tour-modal__footer">
          <Button
            type="button"
            className="btn secondary__btn admin-tour-modal__btn"
            onClick={onClose}
            disabled={submitting || isUploading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="btn primary__btn admin-tour-modal__btn"
            disabled={submitting || isUploading || !form.photo.trim()}
          >
            {submitting ? (
              <>
                <i className="ri-loader-4-line admin-tour-modal__spin"></i>
                {t("admin.saving")}
              </>
            ) : (
              <>
                <i className={isEdit ? "ri-save-3-line" : "ri-add-line"}></i>
                {isEdit ? t("admin.saveChanges") : t("admin.createTour")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TourFormModal;
