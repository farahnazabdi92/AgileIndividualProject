document.addEventListener("DOMContentLoaded", () => {
  const demoCard = document.querySelector("#style-demo-card");
  const demoStatus = document.querySelector(".demo-status");
  const demoButtons = document.querySelectorAll(".demo-btn");

  if (!demoCard || !demoStatus || demoButtons.length === 0) {
    return;
  }

  const styles = {
    default: {
      className: "demo-style-default",
      label: "Default",
    },
    warm: {
      className: "demo-style-warm",
      label: "Warm Focus",
    },
    cool: {
      className: "demo-style-cool",
      label: "Cool Focus",
    },
    bold: {
      className: "demo-style-bold",
      label: "Bold Focus",
    },
  };

  const updateStyle = (styleKey) => {
    const style = styles[styleKey];
    if (!style) {
      return;
    }

    demoCard.classList.remove(
      styles.default.className,
      styles.warm.className,
      styles.cool.className,
      styles.bold.className
    );
    demoCard.classList.add(style.className);
    demoStatus.textContent = `Current style: ${style.label}.`;

    demoButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.style === styleKey);
    });
  };

  demoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateStyle(button.dataset.style);
    });
  });

  updateStyle("default");
});
