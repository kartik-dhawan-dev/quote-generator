const quotesContainer = document.getElementById(QUOTE_CONTAINER_ID);
const quotesContent = document.getElementById(QUOTE_CONTENT_ID);
const quotesAuthor = document.getElementById(QUOTE_AUTHOR_ID);

const newQuoteButton = document.getElementById(NEW_QUOTE_BUTTON_ID);
const copyQuoteButton = document.getElementById(COPY_QUOTE_BUTTON_ID);
const shareQuoteButton = document.getElementById(SHARE_QUOTE_BUTTON_ID);
const exportQuoteButton = document.getElementById(EXPORT_QUOTE_BUTTON_ID);

const toastContainer = document.getElementById(TOAST_CONTAINER_ID);

const sharePostOnX = (postContent) =>
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(postContent)}`,
    "_blank"
  );

const getRandomBackgroundURL = (quoteId) =>
  `https://picsum.photos/seed/${quoteId}/1920/1080`;

const renderQuotes = async () => {
  const quoteDetails = await fetchQuote();

  if (!quoteDetails) {
    quotesContent.innerText = "Error fetching quote";
    return;
  }

  const randomBackground = getRandomBackgroundURL(quoteDetails.id);

  quotesContainer.style.backgroundImage = `url(${randomBackground})`;
  quotesContent.innerText = quoteDetails.content;
  quotesAuthor.innerText = quoteDetails.author
    ? `~ ${quoteDetails.author}`
    : null;
};

const fetchQuote = async () => {
  try {
    const response = await fetch(RANDOM_QUOTE_API_URL);
    const responseJSON = await response.json();
    const quoteDetails = responseJSON.data;
    return quoteDetails;
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
};

const copyQuoteToClipboard = () => {
  const fullQuote = `${quotesContent.innerText} ${quotesAuthor.innerText}`;
  navigator.clipboard.writeText(fullQuote).then(() => {
    showToast("Quote copied to clipboard!");
  });
};

const showToast = (message) => {
  toastContainer.innerText = message;
  toastContainer.classList.remove("hidden");
  toastContainer.classList.add("opacity-100");

  setTimeout(() => {
    toastContainer.classList.add("hidden");
    toastContainer.classList.remove("opacity-100");
  }, TOAST_DURATION);
};

const shareQuoteOnTwitter = () => {
  const quoteContent = quotesContent.innerText;
  const quoteAuthor = quotesAuthor.innerText;

  sharePostOnX(`${quoteContent} ${quoteAuthor}`);
};

/**
 * @ref: 
 * https://medium.com/@tajammalmaqbool11/how-to-convert-your-html-dom-element-into-an-image-using-javascript-677d275294d8
 */
const exportQuoteAsImage = async () => {
  const quoteContainer = document.getElementById(QUOTE_CONTAINER_ID);

  htmlToImage
    .toPng(quoteContainer)
    .then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "quote.png";
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error("Oops, something went wrong!", error);
    });
};

newQuoteButton.addEventListener("click", renderQuotes);
copyQuoteButton.addEventListener("click", copyQuoteToClipboard);
shareQuoteButton.addEventListener("click", shareQuoteOnTwitter);
exportQuoteButton.addEventListener("click", exportQuoteAsImage);

renderQuotes();
