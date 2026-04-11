// Demo 1: switch CSS classes to show presentation changes over fixed HTML content.
const initStyleToggleDemo = () => {
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
};

// Demo 2: guided DOM sandbox that maps directly to tutorial + quiz fundamentals.
const initDomSandbox = () => {
  // Control inputs.
  const semanticSelect = document.querySelector("#sandbox-semantic-select");
  const titleInput = document.querySelector("#sandbox-title-input");
  const textInput = document.querySelector("#sandbox-text-input");
  const styleSelect = document.querySelector("#sandbox-style-select");
  const listToggle = document.querySelector("#sandbox-list-toggle");
  const itemInput = document.querySelector("#sandbox-item-input");
  const addItemButton = document.querySelector("#sandbox-add-item");
  const removeItemButton = document.querySelector("#sandbox-remove-item");
  const controlStatus = document.querySelector("#sandbox-control-status");

  // Live preview targets.
  const previewShell = document.querySelector("#sandbox-preview-shell");
  const previewTitle = document.querySelector("#sandbox-preview-title");
  const previewText = document.querySelector("#sandbox-preview-text");
  const previewList = document.querySelector("#sandbox-preview-list");
  const actionButton = document.querySelector("#sandbox-action-btn");
  const actionStatus = document.querySelector("#sandbox-action-status");
  const output = document.querySelector("#sandbox-output");

  let structure = document.querySelector("#sandbox-structure");

  if (
    !semanticSelect ||
    !titleInput ||
    !textInput ||
    !styleSelect ||
    !listToggle ||
    !itemInput ||
    !addItemButton ||
    !removeItemButton ||
    !controlStatus ||
    !previewShell ||
    !previewTitle ||
    !previewText ||
    !previewList ||
    !actionButton ||
    !actionStatus ||
    !output ||
    !structure
  ) {
    return;
  }

  const styleClasses = {
    soft: "sandbox-style-soft",
    focus: "sandbox-style-focus",
    contrast: "sandbox-style-contrast",
  };

  let actionCount = 0;

  const renderSnapshot = () => {
    // Show a readable DOM summary so learners can connect UI changes to structure.
    const tagName = structure.tagName.toLowerCase();
    const title = previewTitle.textContent.trim();
    const text = previewText.textContent.trim();
    const activeClass = Object.values(styleClasses).find((className) =>
      structure.classList.contains(className)
    );
    const listVisible = !previewList.hidden;
    const points = Array.from(previewList.querySelectorAll("li"))
      .map((item) => item.textContent.trim())
      .filter(Boolean);

    const lines = [
      `<${tagName} class="sandbox-preview-card ${activeClass || styleClasses.soft}">`,
      `  <h4>${title}</h4>`,
      `  <p>${text}</p>`,
      `  <ul ${listVisible ? "" : 'hidden="hidden"'}>`,
      ...points.map((point) => `    <li>${point}</li>`),
      "  </ul>",
      "</" + tagName + ">",
    ];

    output.textContent = lines.join("\n");
  };

  const setSemanticTag = (targetTag) => {
    if (!targetTag || structure.tagName.toLowerCase() === targetTag) {
      return;
    }

    const next = document.createElement(targetTag);
    next.id = structure.id;
    next.className = structure.className;

    while (structure.firstChild) {
      // Preserve child content while swapping semantic container type.
      next.appendChild(structure.firstChild);
    }

    structure.replaceWith(next);
    structure = next;
    previewShell.setAttribute("data-semantic-tag", targetTag);
  };

  const setStyleClass = (styleKey) => {
    const className = styleClasses[styleKey] || styleClasses.soft;
    structure.classList.remove(...Object.values(styleClasses));
    structure.classList.add(className);
  };

  const setControlStatus = (message) => {
    controlStatus.textContent = message;
  };

  semanticSelect.addEventListener("change", () => {
    // Semantic element update (HTML concept).
    setSemanticTag(semanticSelect.value);
    renderSnapshot();
  });

  titleInput.addEventListener("input", () => {
    // Text content update (DOM manipulation concept).
    const nextTitle = titleInput.value.trim();
    previewTitle.textContent = nextTitle || "DOM Practice Card";
    renderSnapshot();
  });

  textInput.addEventListener("input", () => {
    const nextText = textInput.value.trim();
    previewText.textContent =
      nextText ||
      "This preview starts with semantic HTML, then CSS and JavaScript update it in real time.";
    renderSnapshot();
  });

  styleSelect.addEventListener("change", () => {
    // Class update (CSS selector/class concept).
    setStyleClass(styleSelect.value);
    renderSnapshot();
  });

  listToggle.addEventListener("change", () => {
    // Attribute-driven visibility change.
    previewList.hidden = !listToggle.checked;
    renderSnapshot();
  });

  addItemButton.addEventListener("click", () => {
    const value = itemInput.value.trim();
    if (!value) {
      setControlStatus("Enter a checklist point before adding.");
      return;
    }

    const li = document.createElement("li");
    li.textContent = value;
    previewList.appendChild(li);
    itemInput.value = "";
    setControlStatus("Checklist point added.");
    renderSnapshot();
  });

  removeItemButton.addEventListener("click", () => {
    const lastItem = previewList.lastElementChild;
    if (!lastItem) {
      setControlStatus("No checklist points left to remove.");
      return;
    }
    lastItem.remove();
    setControlStatus("Last checklist point removed.");
    renderSnapshot();
  });

  actionButton.addEventListener("click", () => {
    // Event handler example for the JavaScript fundamentals section.
    actionCount += 1;
    actionStatus.textContent = `Action status: JavaScript click handler ran ${actionCount} time${actionCount === 1 ? "" : "s"}.`;
    structure.classList.toggle("sandbox-is-active");
    renderSnapshot();
  });

  setSemanticTag(semanticSelect.value);
  setStyleClass(styleSelect.value);
  renderSnapshot();
};

document.addEventListener("DOMContentLoaded", () => {
  // Keep both demos independent so one failure does not break the other.
  initStyleToggleDemo();
  initDomSandbox();
});
