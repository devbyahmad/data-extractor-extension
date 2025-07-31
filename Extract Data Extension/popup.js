document.getElementById("extractBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: extractInfo,
    },
    (results) => {
      const [emails, phones] = results[0].result;
      const output = `Emails:\n${emails.join("\n")}\n\nPhones:\n${phones.join("\n")}`;
      document.getElementById("output").value = output;
    }
  );
});

function extractInfo() {
  const pageText = document.body.innerText;

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
  const phoneRegex = /\+?\d[\d\s\-().]{7,}\d/g;

  const emails = pageText.match(emailRegex) || [];
  const phones = pageText.match(phoneRegex) || [];

  return [Array.from(new Set(emails)), Array.from(new Set(phones))];
}
