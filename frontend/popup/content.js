console.log("✅ content.js loaded on", window.location.href);

window.addEventListener("error", (event) => {
  if (event.message.includes("Connection has been terminated")) {
    event.stopImmediatePropagation();
  }
});


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

  if (msg.action === "toggle-tldr-feed") {
    console.log("🧩 Feed TL;DR toggle triggered");

    const alreadyApplied = document.querySelector("[data-tldr-feed-applied]");

    if (!alreadyApplied) {
      applyTLDRToVisiblePreviews("UofT is hard, but you can manage with balance.");
      document.body.dataset.tldrFeedApplied = "1";
    } else {
      restorePreviews();
      delete document.body.dataset.tldrFeedApplied;
    }
  }
});


// --- Continuous scroll detection ---
let scrollTimer = null;

window.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);

  scrollTimer = setTimeout(() => {
    console.log("🧘 User stopped scrolling.");

    const allLinks = document.querySelectorAll("a");
    const postSet = new Set(); // store unique links

    allLinks.forEach(link => {
      const rect = link.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left >= 0 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      const href = link.href || "";
      const isRedditPost = href.match(/^https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\//);

      if (isVisible && isRedditPost) {
        // store base URL only (cut off after post ID)
        const basePostUrl = href.split("/comments/")[1]?.split("/")[0];
        if (basePostUrl) {
          postSet.add(href);
        }
      }
    });

    const visibleLinks = Array.from(postSet);
    console.log(`🧾 Found ${visibleLinks.length} visible Reddit post links:`, visibleLinks);
  }, 1000);
});
