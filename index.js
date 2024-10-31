document.addEventListener("DOMContentLoaded", function () {
  const appBlocks = document.querySelectorAll(".app-block");
  const opened = new Set();

  appBlocks.forEach((element) => {
    let tooltip;

    element.addEventListener("mouseover", function () {
      // Create and add tooltip if not already present
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.textContent = element.id;
        element.appendChild(tooltip);
      }

      // Scale current and neighboring elements
      applyTransform(element, 1.4, -20);
      applyNeighborTransforms(element, 1.25, -10);
    });

    element.addEventListener("mouseout", function () {
      // Remove tooltip if present
      if (tooltip) {
        element.removeChild(tooltip);
        tooltip = null;
      }

      // Reset transformations
      resetTransform(element);
      resetNeighborTransforms(element);
    });

    element.addEventListener("click", function () {
      if (opened.has(element.id)) return;

      opened.add(element.id);
      const activeDot = document.createElement("div");
      activeDot.className = "app-active";
      element.appendChild(activeDot);

      const appContainer = createAppContainer(element.id);

      appContainer
        .querySelector(".close")
        .addEventListener("click", function () {
          appContainer.classList.add("closing");
          element.removeChild(activeDot);

          appContainer.addEventListener("animationend", function () {
            appContainer.remove();
            opened.delete(element.id);
          });
        });

      document.body.appendChild(appContainer);
    });
  });

  function applyTransform(element, scale, translateY) {
    element.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    element.style.transition = "transform 0.2s";
  }

  function applyNeighborTransforms(element, scale, translateY) {
    const prev = element.previousElementSibling;
    const next = element.nextElementSibling;

    if (prev) applyTransform(prev, scale, translateY);
    if (next) applyTransform(next, scale, translateY);
  }

  function resetTransform(element) {
    element.style.transform = "";
  }

  function resetNeighborTransforms(element) {
    resetTransform(element.previousElementSibling);
    resetTransform(element.nextElementSibling);
  }

  function createAppContainer(id) {
    const appContainer = document.createElement("div");
    appContainer.className = "app-container opening";
    appContainer.id = id;

    appContainer.innerHTML = `
        <div class="close">X</div>
        <div class="content">
          <h1>${id}</h1>
          <h2>Mac Docker</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
            purus nec nunc tincidunt ultricies.
          </p>
        </div>`;

    return appContainer;
  }
});
