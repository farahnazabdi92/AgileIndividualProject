document.addEventListener("DOMContentLoaded", () => {
  // Shared volunteer photo modal: populate image/caption from clicked thumbnail data attributes.
  const modal = document.querySelector("#volunteer-modal");
  const modalImage = document.querySelector("#volunteer-modal-image");
  const modalCaption = document.querySelector("#volunteer-modal-caption");
  let lastTrigger = null;

  if (!modal || !modalImage || !modalCaption) {
    return;
  }

  const buttons = document.querySelectorAll(".volunteer-thumb");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      lastTrigger = button;
      const image = button.dataset.image;
      const caption = button.dataset.caption;
      if (image) {
        modalImage.src = image;
        modalImage.alt = caption || "Volunteer photo";
      }
      modalCaption.textContent = caption || "";
    });
  });

  // Move focus off modal descendants before Bootstrap marks the modal aria-hidden on close.
  modal.addEventListener("hide.bs.modal", () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && modal.contains(activeElement)) {
      activeElement.blur();
    }
  });

  // Restore focus to the thumbnail that opened the modal for predictable keyboard flow.
  modal.addEventListener("hidden.bs.modal", () => {
    if (lastTrigger instanceof HTMLElement && document.contains(lastTrigger)) {
      lastTrigger.focus();
    }
  });
});
