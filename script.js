(function () {
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 1800);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    var copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }

    return Promise.resolve(fallbackCopy(text));
  }

  function bindTap(element, handler) {
    if (!element) {
      return;
    }

    var lastTap = 0;

    function activate(event) {
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") {
        return;
      }

      if (event.type === "keydown") {
        event.preventDefault();
      }

      var now = Date.now();
      if (now - lastTap < 350) {
        return;
      }

      lastTap = now;
      handler(event);
    }

    element.addEventListener("pointerup", activate);
    element.addEventListener("keydown", activate);
  }

  document.querySelectorAll("[data-copy]").forEach(function (trigger) {
    bindTap(trigger, function () {
      var targetId = trigger.getAttribute("data-copy");
      var target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      var text = target.textContent.trim();
      var hint = trigger.querySelector(".copy-hint__label");

      copyText(text).then(function (success) {
        if (success) {
          trigger.classList.add("is-copied");
          if (hint) {
            hint.textContent = "Copied";
          }
          showToast("Copied");
          setTimeout(function () {
            trigger.classList.remove("is-copied");
            if (hint) {
              hint.textContent = "Tap to copy";
            }
          }, 1500);
        } else {
          showToast("Copy manually");
        }
      });
    });
  });

  var qrOpen = document.getElementById("qr-open");
  var qrModal = document.getElementById("qr-modal");
  var qrCloseButtons = document.querySelectorAll("[data-qr-close]");

  function openQrModal() {
    if (!qrModal) {
      return;
    }

    qrModal.classList.add("is-open");
    qrModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("qr-modal-open");
  }

  function closeQrModal() {
    if (!qrModal) {
      return;
    }

    qrModal.classList.remove("is-open");
    qrModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("qr-modal-open");
  }

  bindTap(qrOpen, openQrModal);

  qrCloseButtons.forEach(function (button) {
    bindTap(button, closeQrModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && qrModal && qrModal.classList.contains("is-open")) {
      closeQrModal();
    }
  });
})();
