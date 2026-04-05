document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.querySelector("#question-container");
  const validationBox = document.querySelector("#validation-messages");
  const resultsBox = document.querySelector("#results-content");
  const rewardBox = document.querySelector("#reward-content");
  const historyList = document.querySelector("#history-list");
  const historyNotice = document.querySelector("#history-notice");
  const resultsSection = document.querySelector("#quiz-results");
  const submitButton = document.querySelector("#submit-quiz");
  const resetButton = document.querySelector("#reset-quiz");
  const clearHistoryButton = document.querySelector("#clear-history");
  const passThresholdEl = document.querySelector("#pass-threshold");
  const quizForm = document.querySelector("#quiz-form");

  if (
    !questionContainer ||
    !validationBox ||
    !resultsBox ||
    !rewardBox ||
    !historyList ||
    !quizForm ||
    !resultsSection
  ) {
    return;
  }

  const DATA_URL = "assets/data/quiz-questions.json";
  const STORAGE_KEY = "skilltrack.quiz.attempts";
  const REWARD_SOURCES = [
    {
      name: "Quotable API",
      url: "https://api.quotable.io/random?tags=technology",
      parse: (data) => {
        if (data && typeof data.content === "string") {
          return {
            text: data.content,
            author: typeof data.author === "string" ? data.author : "",
          };
        }
        return null;
      },
    },
    {
      name: "Type.fit Quotes",
      url: "https://type.fit/api/quotes",
      parse: (data) => {
        if (!Array.isArray(data) || data.length === 0) {
          return null;
        }
        const attempts = Math.min(data.length, 6);
        for (let i = 0; i < attempts; i += 1) {
          const candidate = data[Math.floor(Math.random() * data.length)];
          if (candidate && typeof candidate.text === "string") {
            return {
              text: candidate.text,
              author: typeof candidate.author === "string" ? candidate.author : "",
            };
          }
        }
        return null;
      },
    },
  ];

  let questions = [];
  let passThreshold = 70;
  let orderedQuestions = [];
  let started = false;
  let submitted = false;
  const answers = new Map();
  let beforeUnloadActive = false;

  const beforeUnloadHandler = (event) => {
    if (started && !submitted) {
      event.preventDefault();
      event.returnValue = "";
      return "";
    }
    return undefined;
  };

  const activateBeforeUnload = () => {
    if (beforeUnloadActive) {
      return;
    }
    window.addEventListener("beforeunload", beforeUnloadHandler);
    beforeUnloadActive = true;
  };

  const deactivateBeforeUnload = () => {
    if (!beforeUnloadActive) {
      return;
    }
    window.removeEventListener("beforeunload", beforeUnloadHandler);
    beforeUnloadActive = false;
  };

  const shuffleQuestions = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const createQuestionCard = (question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question-card";
    fieldset.dataset.questionId = question.id;

    const legend = document.createElement("legend");
    legend.textContent = `Question ${index + 1}: ${question.question}`;
    fieldset.appendChild(legend);

    const optionsWrapper = document.createElement("div");
    optionsWrapper.className = "option-list";

    question.options.forEach((optionText, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option-label";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${question.id}`;
      input.value = optionIndex;
      input.dataset.questionId = question.id;
      input.dataset.optionIndex = optionIndex.toString();

      input.addEventListener("change", () => {
        answers.set(question.id, optionIndex);
        started = true;
        activateBeforeUnload();
        fieldset.classList.remove("is-missing");
      });

      const span = document.createElement("span");
      span.textContent = optionText;

      label.appendChild(input);
      label.appendChild(span);
      optionsWrapper.appendChild(label);
    });

    fieldset.appendChild(optionsWrapper);
    return fieldset;
  };

  const renderQuestions = () => {
    questionContainer.innerHTML = "";
    orderedQuestions = shuffleQuestions(questions);
    orderedQuestions.forEach((question, index) => {
      questionContainer.appendChild(createQuestionCard(question, index));
    });
  };

  const showValidation = (missingQuestions) => {
    validationBox.classList.remove("is-hidden");
    validationBox.innerHTML = "";

    const intro = document.createElement("p");
    intro.textContent = "Please answer all questions before submitting. Missing:";
    validationBox.appendChild(intro);

    const list = document.createElement("ul");
    list.className = "validation-list";
    missingQuestions.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `Question ${item.index + 1}`;
      list.appendChild(li);
    });
    validationBox.appendChild(list);
  };

  const hideValidation = () => {
    validationBox.classList.add("is-hidden");
    validationBox.innerHTML = "<p>Answer every question before submitting.</p>";
  };

  const updateResults = (score, total, percentage, passed) => {
    resultsBox.innerHTML = `
      <p><strong>Score:</strong> ${score} / ${total}</p>
      <p><strong>Percentage:</strong> ${percentage}%</p>
      <p class="result-status ${passed ? "pass" : "fail"}">
        ${passed ? "Pass" : "Fail"}
      </p>
      <p>${passed ? "Great work. You have met the core fundamentals." : "Review the tutorial and try again."}</p>
    `;
  };

  const showRewardMessage = (message, source) => {
    rewardBox.innerHTML = `
      <p><strong>Reward:</strong> ${message}</p>
      ${source ? `<p class="reward-source">Source: ${source}</p>` : ""}
    `;
  };

  const showRewardPlaceholder = (text) => {
    rewardBox.innerHTML = `<p class="system-message">${text}</p>`;
  };

  const fetchReward = async () => {
    showRewardPlaceholder("Loading reward...");
    for (const source of REWARD_SOURCES) {
      try {
        const response = await fetch(source.url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Reward request failed.");
        }
        const data = await response.json();
        const reward = source.parse(data);
        if (!reward || typeof reward.text !== "string") {
          throw new Error("Reward data missing.");
        }
        const author = reward.author ? `- ${reward.author}` : "";
        showRewardMessage(`${reward.text} ${author}`.trim(), source.name);
        return;
      } catch (error) {
        // Try the next source.
      }
    }
    showRewardPlaceholder("Reward unavailable right now. Please try again later.");
  };

  const scrollToResults = () => {
    requestAnimationFrame(() => {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const createFireworks = () => {
    if (prefersReducedMotion()) {
      resultsBox.classList.add("is-celebrate");
      window.setTimeout(() => resultsBox.classList.remove("is-celebrate"), 900);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "celebration-canvas";
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { once: true });
    document.body.appendChild(canvas);

    const colors = ["#1e6f5c", "#c28b3c", "#4f8fb8", "#efc65f"];
    const rect = resultsSection.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.2;
    const bursts = 3;
    const particles = [];

    for (let b = 0; b < bursts; b += 1) {
      const angleOffset = (Math.PI * 2 * b) / bursts;
      for (let i = 0; i < 26; i += 1) {
        const angle = angleOffset + (Math.PI * 2 * i) / 26;
        const speed = 1.2 + Math.random() * 1.6;
        particles.push({
          x: originX,
          y: originY + b * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[i % colors.length],
        });
      }
    }

    let start = null;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!start) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy + 0.3;
        p.alpha -= 0.006;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        throw new Error("History data is not an array.");
      }
      return parsed;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  };

  const saveHistory = (history) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      // If storage fails, we silently skip persistence.
    }
  };

  const renderHistory = (history) => {
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyNotice.textContent = "No attempts yet.";
      historyNotice.style.display = "block";
      return;
    }

    historyNotice.style.display = "none";
    history.forEach((attempt) => {
      const item = document.createElement("li");
      item.className = "history-item";

      const timestamp = new Date(attempt.timestamp);
      const formattedTime = Number.isNaN(timestamp.getTime())
        ? "Unknown time"
        : timestamp.toLocaleString();

      item.innerHTML = `
        <strong>${attempt.passed ? "Pass" : "Fail"}</strong>
        ${attempt.score}/${attempt.total} (${attempt.percentage}%)
        <span>- ${formattedTime}</span>
      `;
      historyList.appendChild(item);
    });
  };

  const addAttemptToHistory = (attempt) => {
    const history = loadHistory();
    history.unshift(attempt);
    saveHistory(history);
    renderHistory(history);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitted) {
      return;
    }

    const questionCards = Array.from(document.querySelectorAll(".question-card"));
    const missing = orderedQuestions
      .map((question, index) => ({ id: question.id, index }))
      .filter((item) => !answers.has(item.id));

    questionCards.forEach((card) => card.classList.remove("is-missing"));

    if (missing.length > 0) {
      missing.forEach((item) => {
        const card = questionCards.find((element) => element.dataset.questionId === item.id);
        if (card) {
          card.classList.add("is-missing");
        }
      });
      showValidation(missing);
      validationBox.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    hideValidation();
    submitted = true;
    deactivateBeforeUnload();

    let score = 0;
    orderedQuestions.forEach((question) => {
      const selected = answers.get(question.id);
      if (selected === question.answerIndex) {
        score += 1;
      }
    });

    const percentage = Math.round((score / orderedQuestions.length) * 100);
    const passed = percentage >= passThreshold;
    updateResults(score, orderedQuestions.length, percentage, passed);

    addAttemptToHistory({
      timestamp: new Date().toISOString(),
      score,
      total: orderedQuestions.length,
      percentage,
      passed,
    });

    if (passed) {
      fetchReward();
      createFireworks();
    } else {
      showRewardPlaceholder("Pass the quiz to unlock a reward.");
    }

    scrollToResults();
  };

  const handleReset = () => {
    const inputs = questionContainer.querySelectorAll("input[type=\"radio\"]");
    inputs.forEach((input) => {
      input.checked = false;
    });
    const cards = questionContainer.querySelectorAll(".question-card");
    cards.forEach((card) => card.classList.remove("is-missing"));
    answers.clear();
    submitted = false;
    started = false;
    deactivateBeforeUnload();
    hideValidation();
    resultsBox.innerHTML = "<p class=\"system-message\">Submit the quiz to see your results.</p>";
    showRewardPlaceholder("A reward will appear here if you pass.");
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore storage errors but still update the UI.
    }
    renderHistory([]);
  };

  const showLoadError = (message) => {
    questionContainer.innerHTML = `<p class="system-message">${message}</p>`;
    submitButton.disabled = true;
    resetButton.disabled = true;
  };

  const init = async () => {
    hideValidation();
    renderHistory(loadHistory());

    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Question file unavailable.");
      }
      const data = await response.json();
      if (!data || !Array.isArray(data.questions) || data.questions.length < 10) {
        throw new Error("Question data is invalid.");
      }
      questions = data.questions;
      passThreshold = data.meta?.passThreshold ?? passThreshold;
      if (passThresholdEl) {
        passThresholdEl.textContent = `${passThreshold}%`;
      }
      renderQuestions();
    } catch (error) {
      showLoadError("Unable to load quiz questions. Please try again later.");
    }
  };

  quizForm.addEventListener("submit", handleSubmit);
  resetButton.addEventListener("click", handleReset);
  clearHistoryButton.addEventListener("click", handleClearHistory);

  init();
});
