const getQueryParam = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("enquiry-form");
  const urlParam = getQueryParam("url");
  if (iframe && urlParam) {
    iframe.src = decodeURIComponent(urlParam);
  } else {
    console.log("Append the URL to be used as the iframe's source as a query parameter with the key 'url'; eg cjbadger.github.io/iframe-webform?url=https://example.com");
  }
});

const trustedOrigins = [
  "https://site-q89tn.powerappsportals.com", // Dev
  "https://site-jtiyc.powerappsportals.com/
  "https://mlc-enquiry-form.powerappsportals.com" // Prod
]

window.addEventListener("message", function(event) {
  if (!trustedOrigins.includes(event.origin) {
    return;
  }

  const enquiryFormIframe = document.getElementById("enquiry-form");
  if (event.data?.iframeHeight) {
    iframe.style.height = event.data?.iframeHeight + "px";
  }
});
