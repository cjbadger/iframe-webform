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
