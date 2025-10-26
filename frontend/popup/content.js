console.log("✅ content.js loaded on", window.location.href);

chrome.runtime.onMessage.addListener((msg) => {
  console.log("TLDR msg recieved")
  if (msg.action === "toggle-tldr") {
    const postBody = document.querySelector("shreddit-post-text-body");
    if (postBody) {
      if (!postBody.dataset.tldrApplied) {
        // hide the original text
        postBody.style.display = "none";

        // create and insert TL;DR div
        const tldr = document.createElement("div");
        tldr.id = "tldr-inline";
        tldr.textContent = "📄 TL;DR: UofT is tough, but burnout isn’t worth it. Balance > grind.";
        Object.assign(tldr.style, {
          background: "#fffbe6",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          marginTop: "8px",
          color: "#333",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.5",
        });

        // insert right before the original element
        postBody.insertAdjacentElement("beforebegin", tldr);
        postBody.dataset.tldrApplied = "1";
      } else {
        // restore original
        const injected = document.getElementById("tldr-inline");
        if (injected) injected.remove();
        postBody.style.display = "";
        delete postBody.dataset.tldrApplied;
      }
    } else {
      console.warn("⚠️ Could not find <shreddit-post-text-body>");
    }
  }
});
