function sendMessage(message) {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const scale = document.getElementById("scale");
  const brightness = document.getElementById("brightness");
  const fileUpload = document.getElementById("idpicker");

  let fileData = "";

  updateFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      sendMessage({
        scale: scale.value,
        brightness: brightness.value,
        data: event.target.result,
      });
      fileData = event.target.result;
    });
    reader.readAsDataURL(file);
  };

  updateOther = (event) => {
    if (fileData.length) {
      sendMessage({
        scale: scale.value,
        brightness: brightness.value,
        data: fileData,
      });
    }
  };

  scale.addEventListener("keyup", updateOther);
  scale.addEventListener("change", updateOther);
  brightness.addEventListener("keyup", updateOther);
  brightness.addEventListener("change", updateOther);
  fileUpload.addEventListener("change", updateFile);
});
