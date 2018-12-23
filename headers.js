var tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function () {
  chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", function () {
  chrome.debugger.detach({ tabId: tabId });
});

var requests = {};
var reqDownload = [];

function onEvent(debuggeeId, message, params) {
  filterReq = document.getElementById("myText").value;
  if (tabId != debuggeeId.tabId)
    return;

  if (message == "Network.requestWillBeSent") {
    var requestDiv = requests[params.requestId];
    if (!requestDiv) {
      var requestDiv = document.createElement("div");
      requestDiv.className = "request";
      requests[params.requestId] = requestDiv;
      var urlLine = document.createElement("div");
      urlLine.textContent = params.request.url;
    }
    if (urlLine.textContent.includes(filterReq)) {
      var requestLine = document.createElement("div");
      requestLine.textContent = parseURL(params.request.url);
      requestDiv.appendChild(requestLine);
      document.getElementById("container").appendChild(requestDiv);
      reqDownload.push(requestLine.textContent);
    }
  } else if (message == "Network.responseReceived") {
    return;
  }
}

function parseURL(url) {
  var result = {};
  var match = url.match(/(?<=b=)(.*)(?=&f)/);
  if (!match)
    return result;
  result.coords = match;
  return result.coords[0];
}

function download() {
  console.log(reqDownload);
}