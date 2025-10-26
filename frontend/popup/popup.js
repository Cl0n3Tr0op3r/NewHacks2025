document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Fetching current tab URL...!!!!";

  try {
    console.log("HEREEE")
    // Get active tab information
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-tldr" });

    console.log("Tab object:", tab);

    if (tab && tab.url) {
      status.textContent = `Current Reddit URL!!:\n${tab.url}`;
    } else {
      status.textContent = "Unable to retrieve URL. Try reloading the page or extension.";
    }

    const output = document.getElementById("output");
    const resp = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tab.url })
    });
    const data = await resp.json();
    output.textContent = data.message
    

  } catch (err) {
    console.error("Error fetching tab:", err);
    output.textContent = "Error fetching current tab URL.";
  }

});
