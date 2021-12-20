chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.onActivated.addListener(({ windowId }) => {
    console.log("activated: ", windowId);
    load(windowId);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tab);
    load(tab.windowId);
  });
});

function load(windowId) {
  console.log("clicked");
  chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
    const url = tabs[0].url;
    const r = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im;
    if (url && url.match(r).length >= 1) {
      const protocolAndDomain = url.match(r).find((arg) => arg.includes("://"));
      const domain = url.match(r).find((arg) => !arg.includes("://"));
      if (domain.includes("reddit")) {
        chrome.cookies.getAll({ domain: `${domain}` }, function (cookies) {
          const showA = cookies.find((c) => c.name === "show_announcements");
          if (showA && showA.value.toLowerCase() == "yes") {
            manageCookie("delete", protocolAndDomain, showA);
            showA.value = "no";
            showA.domain = showA.domain.replace("www", "");
            manageCookie("set", protocolAndDomain, showA);
          }
        });
      }
    }
  });
}

function manageCookie(opt, url, cookie) {
  switch (opt) {
    case "delete":
      return chrome.cookies.remove({ url: `${url}/`, name: cookie.name });
    case "set":
      return chrome.cookies.set({
        url: `${url}/`,
        ...cookie,
      });
    default:
      return;
  }
}
