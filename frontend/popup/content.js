console.log("✅ content.js loaded on", window.location.href);

let feedTldrEnabled = false;
const summarizedPosts = new Set(); // keeps track of which URLs we’ve already summarized
let lastUrl = window.location.href;

function checkUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    handleUrlChange(currentUrl);
  }
}

setInterval(checkUrlChange, 1000); // check every second

function handleUrlChange(url) {
  const isThread = /^https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\//.test(url);
  const isSubreddit = /^https:\/\/www\.reddit\.com\/r\/[^/]+\/?(?:\?.*)?$/.test(url) && !isThread;

  console.log("🌐 URL changed →", url, { isThread, isSubreddit });

  // If we were summarizing feed and user navigated into a single post
  if (feedTldrEnabled && isThread) {
    console.log("⛔ Switching to single post — disabling feed TL;DR.");
    feedTldrEnabled = false;
    restorePreviews();
    summarizedPosts.clear();

    // Optional: visually tell popup state changed
    chrome.runtime.sendMessage({ action: "feed-disabled" });
  }
}


chrome.runtime.onMessage.addListener((msg) => {
  const tldrText = msg.summaryText || "📄 No summary provided.";
  console.log(tldrText)
  console.log("TLDR msg recieved")

  if (msg.action === "toggle-tldr") {
    console.log("summarize button")
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

  feedTldrEnabled = !feedTldrEnabled; // flip the on/off flag

  if (feedTldrEnabled) {
      console.log("✅ Feed TL;DR is now ENABLED");
    } else {
      console.log("⛔ Feed TL;DR is now DISABLED — restoring previews");
      restorePreviews();
      summarizedPosts.clear(); // reset memory
    }

    const alreadyApplied = document.querySelector("[data-tldr-feed-applied]");
    if (!alreadyApplied) {
      const summaries = msg.summaries || {};
      applyTLDRToVisiblePreviews(summaries);
      document.body.dataset.tldrFeedApplied = "1";
    } else {
      restorePreviews();
      delete document.body.dataset.tldrFeedApplied;
    }
  }

});

// --- Return visible Reddit post URLs to popup.js ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "get-visible-urls") {
    const visibleLinks = [];
    document.querySelectorAll("a").forEach(link => {
      const rect = link.getBoundingClientRect();
      const href = link.href || "";
      const isVisible =
        rect.top >= 0 && rect.bottom <= window.innerHeight &&
        href.match(/^https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\//);

      if (isVisible) visibleLinks.push(href);
    });

    console.log("🧾 Sending visible Reddit post links:", visibleLinks);
    sendResponse({ urls: visibleLinks });
    return true; // Keeps the message channel open for async response
  }
});



// --- TL;DR for Reddit preview posts (multi-thread feed) ---
function applyTLDRToVisiblePreviews(summaries) {
  const posts = document.querySelectorAll("shreddit-post");
  posts.forEach(post => {
    const url = post.getAttribute("content-href"); // this holds the reddit post URL
    const tldrText = summaries[url];
    if (!tldrText) return; // skip if no summary

    const body = post.querySelector("shreddit-post-text-body");
    if (body && !body.dataset.tldrApplied) {
      body.dataset.originalText = body.innerText;
      body.innerText = `📄 TL;DR: ${tldrText}`;
      body.dataset.tldrApplied = "1";
    }
  });
}

function restorePreviews() {
  document.querySelectorAll("#tldr-inline").forEach(el => el.remove());

  const previews = document.querySelectorAll("shreddit-post-text-body");
  previews.forEach(preview => {
    preview.style.display = "";
    delete preview.dataset.tldrApplied;
  });

  console.log("🔄 Restored all previews to original text");
}




// --- Continuous scroll detection with TL;DR summarization (queue-limited) ---
let scrollTimer = null;
const summarizedQueue = []; // acts as queue (FIFO)
const MAX_QUEUE_SIZE = 10;  // keep only 10 most recent posts summarized

window.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(async () => {
    console.log("🧘 User stopped scrolling.");

    if (!feedTldrEnabled) {
      console.log("⏸️ Feed TL;DR disabled, skipping summarization.");
      return;
    }

    // 1️⃣ Collect visible Reddit post URLs
    const postSet = new Set();
    document.querySelectorAll("a").forEach(link => {
      const rect = link.getBoundingClientRect();
      const href = link.href || "";
      const isVisible =
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        href.match(/^https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\//);
      if (isVisible) postSet.add(href);
    });

    const visibleLinks = Array.from(postSet);
    console.log(`🧾 Visible Reddit posts: ${visibleLinks.length}`, visibleLinks);

    // 2️⃣ Summarize only new posts (and manage queue)
    for (const url of visibleLinks) {
      if (summarizedQueue.includes(url)) continue; // already summarized

      try {
        console.log("🟡 Summarizing:", url);
        const resp = await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });
        const data = await resp.json();
        console.log(`✅ Got TL;DR for ${url}:`, data.message);

        injectSummary(url, data.message);

        // Enqueue new summarized post
        summarizedQueue.push(url);

        // Maintain fixed queue size (remove oldest)
        if (summarizedQueue.length > MAX_QUEUE_SIZE) {
          const removed = summarizedQueue.shift();
          console.log(`🧹 Removed oldest summarized post: ${removed}`);
          // Optionally restore its preview:
          restoreSinglePost(removed);
        }

      } catch (err) {
        console.error(`❌ Failed TL;DR for ${url}`, err);
      }
    }
  }, 1000);
});


// --- Inject TL;DR box for one post in feed ---
function injectSummary(url, tldrText) {
  // Find the <shreddit-post> element that matches this URL
  const post = [...document.querySelectorAll("shreddit-post")]
    .find(p => p.getAttribute("content-href") === url);
  if (!post) return;

  // Locate the body inside it
  const body = post.querySelector("shreddit-post-text-body");
  if (!body || body.dataset.tldrApplied) return; // skip if already summarized

  // Hide the original preview
  body.style.display = "none";

  // Create TL;DR container
  const tldr = document.createElement("div");
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
  tldr.id = "tldr-inline";

  // Create header
  const header = document.createElement("div");
  header.textContent = "📄 TL;DR Summary";
  Object.assign(header.style, {
    fontWeight: "bold",
    fontSize: "15px",
    marginBottom: "6px",
  });

  // Create text element
  const text = document.createElement("div");
  text.textContent = tldrText || "No summary available.";

  // Combine elements
  tldr.appendChild(header);
  tldr.appendChild(text);

  // Insert before original post
  body.insertAdjacentElement("beforebegin", tldr);

  // Mark as summarized
  body.dataset.tldrApplied = "1";
}

function restoreSinglePost(url) {
  const post = [...document.querySelectorAll("shreddit-post")]
    .find(p => p.getAttribute("content-href") === url);
  if (!post) return;

  const body = post.querySelector("shreddit-post-text-body");
  const summary = post.querySelector("#tldr-inline");

  if (summary) summary.remove();
  if (body) {
    body.style.display = "";
    delete body.dataset.tldrApplied;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "check-reddit-context") {
    const url = window.location.href;

    // return TRUE if subreddit/feed, FALSE if single post
    const isThread = /^https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\//.test(url);
    const isSubreddit =
      /^https:\/\/www\.reddit\.com\/r\/[^/]+\/?(?:\?.*)?$/.test(url) && !isThread;

    const result = isSubreddit; // ✅ true = subreddit/feed, false = thread

    console.log("🔍 URL check:", { url, isSubreddit, isThread, result });
    sendResponse({ isSubreddit: result });

    return true;
  }
});

// URL change detector
