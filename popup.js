document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({ blockedCount: 0 }, (result) => {
    document.getElementById('counter').innerText = result.blockedCount;
  });
});