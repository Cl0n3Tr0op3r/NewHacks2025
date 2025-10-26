console.log("✅ content.js loaded on", window.location.href);

chrome.runtime.onMessage.addListener((msg) => {
  const tldrText = msg.summaryText || "📄 No summary provided.";
  console.log(tldrText)
  console.log("TLDR msg recieved")
  if (msg.action === "toggle-tldr") {
    const postBody = document.querySelector("shreddit-post-text-body");
    if (postBody) {
      if (!postBody.dataset.tldrApplied) {
        // hide the original text
        postBody.style.display = "none";

        // create TL;DR container div
        const tldr = document.createElement("div");
        tldr.id = "tldr-inline";
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

        // create header element (goes above summary text)
        const header = document.createElement("div");
        header.textContent = "📄 TL;DR Summary";
        Object.assign(header.style, {
          fontWeight: "bold",
          fontSize: "15px",
          marginBottom: "6px",
        });

        // create main summary text
        const text = document.createElement("div");
        text.textContent = tldrText;

        // append both into the same background box
        tldr.appendChild(header);
        tldr.appendChild(text);

        // insert before original post
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
