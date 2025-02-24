const getQueryParam = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Specifically for CFP
const trustedOrigins = [
  "https://site-kkdli.powerappsportals.com",         // WLSQ DEV
  "https://site-tt3fl.powerappsportals.com",         // WLSQ UAT
  // "https://wlsq-referral-form.powerappsportals.com", // WLSQ PROD
  "https://site-q89tn.powerappsportals.com",         // MLC Dev
  "https://site-jtiyc.powerappsportals.com",         // MLC UAT
  "https://mlc-enquiry-form.powerappsportals.com"    // MLC Prod
]

let ignoreMessages;

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("enquiry-form");
  const urlParam = getQueryParam("url");
  ignoreMessages = getQueryParam("ignore");
  if (iframe && urlParam) {
    iframe.src = decodeURIComponent(urlParam);
  } else {
    console.log("Append the URL to be used as the iframe's source as a query parameter with the key 'url'; eg cjbadger.github.io/iframe-webform?url=https://example.com");
  }
});


const EnquiryFormResizeHandler = () => {
  if (ignoreMessages) {
    return;
  }
  window.addEventListener("message", (event) => {
    if (!trustedOrigins.includes(event.origin)) {
      console.log(`${event.origin} is not a trusted origin`);
      return;
    }
      console.log(`${event.origin} is a trusted origin`);
    const enquiryFormIframe = document.getElementById("enquiry-form");
    if ((event.data?.iframeHeight) && (enquiryFormIframe)) {
      enquiryFormIframe.style.height = event.data?.iframeHeight + "px";
    }
  });
};

EnquiryFormResizeHandler();



