const CANVAS_WEBCAM_MOCK_ID = "canvas-webcam-mock";
let initialized = false;

window.addEventListener("message", (event) => {
  if (!initialized) {
    mockWebcamWithImage(event.data.text);
  } else {
    updateWebcamWithImage(event.data.text);
  }
});

function getIframeWindow() {
  return document.querySelector("iframe").contentWindow;
}

function getIframeBody() {
  return document.querySelector("iframe").contentDocument;
}

function setupCanvasForWebcamMock() {
  const iframeDoc = getIframeBody();

  let canvas = iframeDoc.querySelector("video");
  if (canvas) canvas.parentNode.removeChild(canvas);
  canvas = iframeDoc.createElement("canvas");
  canvas.setAttribute(
    "style",
    "height:10px;width:10px;position:absolute;z-index:-1;top:0;"
  );
  canvas.setAttribute("id", CANVAS_WEBCAM_MOCK_ID);

  iframeDoc.querySelector("body").appendChild(canvas);
}

function draw(img, message) {
  const iframeWin = getIframeWindow();
  const iframeDoc = getIframeBody();

  const canvas = iframeDoc.getElementById(CANVAS_WEBCAM_MOCK_ID);

  if (!canvas)
    throw new Error(
      "Could not find canvas to draw image to, please make sure you are calling this helper after setting up the canvas"
    );

  const canvasCtx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;

  canvasCtx.setTransform(
    message.scale,
    0,
    0,
    message.scale,
    canvasCtx.canvas.width / 2,
    canvasCtx.canvas.height / 2
  );
  canvasCtx.drawImage(img, -img.width / 2, -img.height / 2); // draw the image offset by half
  canvasCtx.fillStyle = `rgba(0, 0, 0, ${message.brightness})`;
  canvasCtx.fillRect(-img.width / 2, -img.height / 2, canvas.width, canvas.height);
}

function updateWebcamWithImage(message) {
  const img = new Image();

  img.onload = function () {
    draw(img, message);
  };

  img.setAttribute("src", message.data);
}

function mockWebcamWithImage(message) {
  const iframeWin = getIframeWindow();
  const iframeDoc = getIframeBody();

  const canvas = iframeDoc.getElementById(CANVAS_WEBCAM_MOCK_ID);

  if (!canvas)
    throw new Error(
      "Could not find canvas to draw image to, please make sure you are calling this helper after setting up the canvas"
    );

  iframeWin.navigator.mediaDevices.getUserMedia = () => {
    const stream = canvas.captureStream();
    const img = new Image();

    img.onload = function () {
      draw(img, message);
    };

    img.setAttribute("src", message.data);
    return Promise.resolve(stream);
  };

  initialized = true;
}

setupCanvasForWebcamMock();
