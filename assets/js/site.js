document.addEventListener("DOMContentLoaded", () => {
  const currentPage = document.body.dataset.page;
  if (!currentPage) {
    return;
  }

  const navLinks = document.querySelectorAll(".site-nav .nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
});
