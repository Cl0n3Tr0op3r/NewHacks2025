document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.textContent = "Fetching current tab URL...";

  try {
    // Get active tab information
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("Tab object:", tab);

    if (tab && tab.url) {
      output.textContent = `Current Reddit URL:\n${tab.url}`;
    } else {
      output.textContent = "⚠️ Unable to retrieve URL. Try reloading the page or extension.";
    }
  } catch (err) {
    console.error("Error fetching tab:", err);
    output.textContent = "Error fetching current tab URL.";
  }
});
