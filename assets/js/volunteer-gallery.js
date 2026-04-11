document.addEventListener("DOMContentLoaded", () => {
  // Shared volunteer photo modal: populate image/caption from clicked thumbnail data attributes.
  const modal = document.querySelector("#volunteer-modal");
  const modalImage = document.querySelector("#volunteer-modal-image");
  const modalCaption = document.querySelector("#volunteer-modal-caption");

  if (!modal || !modalImage || !modalCaption) {
    return;
  }

  const buttons = document.querySelectorAll(".volunteer-thumb");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.dataset.image;
      const caption = button.dataset.caption;
      if (image) {
        modalImage.src = image;
        modalImage.alt = caption || "Volunteer photo";
      }
      modalCaption.textContent = caption || "";
    });
  });
});
