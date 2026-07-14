(function () {
  var notyf = new Notyf({
    duration: 2200,
    position: { x: "center", y: "bottom" },
    dismissible: true,
    ripple: true,
    types: [
      {
        type: "success",
        background: "#3a322c",
        icon: false,
      },
      {
        type: "error",
        background: "#96754f",
        icon: false,
      },
    ],
  });

  MicroModal.init({
    disableScroll: true,
    awaitOpenAnimation: true,
    awaitCloseAnimation: true,
    onShow: function () {
      document.body.classList.add("modal-open");
    },
    onClose: function () {
      document.body.classList.remove("modal-open");
    },
  });

  var clipboard = new ClipboardJS(".copy-trigger", {
    text: function (trigger) {
      var fieldId = trigger.getAttribute("data-copy");
      var field = document.getElementById(fieldId);
      return field ? field.textContent.trim() : "";
    },
  });

  clipboard.on("success", function (event) {
    var label = event.trigger.getAttribute("data-copy-label") || "Value";
    var hint = event.trigger.querySelector(".copy-hint__label");

    event.trigger.classList.add("is-copied");
    if (hint) {
      hint.textContent = "Copied!";
    }

    notyf.success(label + " copied to clipboard");

    setTimeout(function () {
      event.trigger.classList.remove("is-copied");
      if (hint) {
        hint.textContent = "Tap to copy";
      }
    }, 1800);

    event.clearSelection();
  });

  clipboard.on("error", function (event) {
    var label = event.trigger.getAttribute("data-copy-label") || "Value";
    notyf.error("Could not copy " + label.toLowerCase() + ". Select and copy manually.");
  });
})();
