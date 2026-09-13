// 1. Inject the core engine
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

// 2. Listen for blocked threats and save to storage
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data || event.data.type !== "SIGGUARD_BLOCKED") return;
  
  chrome.storage.local.get({ blockedCount: 0 }, (data) => {
    chrome.storage.local.set({ blockedCount: data.blockedCount + 1 });
  });
});