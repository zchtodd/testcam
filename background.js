chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./foreground.js"],
      })
      .then(() => {
	  	chrome.runtime.sendMessage(tabId, () => {});
      })
      .catch((err) => console.log(err));
  }
});
