document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.textContent = "Fetching current tab URL...";

  try {
    console.log("HEREEE")
    // Get active tab information
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("Tab object:", tab);

    if (tab && tab.url) {
      output.textContent = `Current Reddit URL!!:\n${tab.url}`;
    } else {
      output.textContent = "⚠️ Unable to retrieve URL. Try reloading the page or extension.";
    }
    // const resp = await fetch("https://localhost:3000", {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ url: tab.url })
    // });

    const resp = await fetch(`http://localhost:3000/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
    const data = await resp.json();
    output.textContent = data
    
  } catch (err) {
    console.error("Error fetching tab:", err);
    output.textContent = "Error fetching current tab URL.";
  }

});
