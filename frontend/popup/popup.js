document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: "check-reddit-context" });
    console.log("📩 Reddit context:", response);

    const isSubreddit = response?.isSubreddit;

    const summarizeBtn = document.getElementById("summarizeBtn");
    const toggleFeed = document.getElementById("toggleFeed");
    

    if (isSubreddit) {
      // subreddit (feed) → show toggle button
      summarizeBtn.style.display = "none";
      toggleFeed.style.display = "block";
    } else {
      // thread → show summarize button
      summarizeBtn.style.display = "block";
      toggleFeed.style.display = "none";
    }
    

  } catch (err) {
    console.warn("⚠️ content.js not loaded, injecting...");
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["frontend/content.js"]
    });
  }
});



document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Fetching current tab URL...";

  try {
    console.log("HEREEE!!")
    // Get active tab information
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //await chrome.tabs.sendMessage(tab.id, { action: "toggle-tldr" });

    console.log("Tab object:", tab);

    if (!tab || !tab.url) {
        status.textContent = "Unable to retrieve URL. Try reloading the page or extension.";
    }

    const output = document.getElementById("output");
    console.log("stupid")
    const resp = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tab.url })
    });

    console.log("print 1")
    const data = await resp.json();
    console.log("print 2")

    output.textContent = data.message
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-tldr", 
        summaryText: data.message
    });
    console.log("print 3")

    

  } catch (err) {
    console.error("Error fetching tab:", err);
    output.textContent = "Error fetching current tab URL.";
  }

});

// --- Multi-thread feed: just toggle feed mode (no backend here) ---
document.getElementById("toggleFeed").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-tldr-feed" });
    console.log("🧩 Sent toggle-tldr-feed message");
  } catch (e) {
    console.warn("⚠️ content.js not loaded, injecting it...");
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-tldr-feed" });
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "feed-disabled") {
    const toggleFeed = document.getElementById("toggleFeed");
    if (toggleFeed) {
      toggleFeed.textContent = "Enable Feed TL;DR"; // reset label if you toggle text
    }
  }
});
