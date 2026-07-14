(function () {
  var wrap = document.getElementById("qr-wrap");
  var canvas = document.getElementById("qr-canvas");

  if (!wrap || !canvas || typeof QRCode === "undefined") {
    return;
  }

  // Set your live URL in index.html → data-qr-url="" before printing cards.
  // Leave empty to use the current page URL once deployed.
  var configuredUrl = (wrap.dataset.qrUrl || "").trim();
  var pageUrl = window.location.href.split("#")[0];
  var qrUrl = configuredUrl || pageUrl;

  var size = Math.round(
    Math.min(Math.max(window.innerHeight * 0.1, 56), 80)
  );

  QRCode.toCanvas(
    canvas,
    qrUrl,
    {
      width: size,
      margin: 1,
      color: {
        dark: "#3a322c",
        light: "#ffffff",
      },
    },
    function (error) {
      if (error) {
        wrap.hidden = true;
        return;
      }

      canvas.width = size;
      canvas.height = size;
    }
  );
})();
