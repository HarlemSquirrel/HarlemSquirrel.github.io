/**
 * Returns the date in the format "YYYYMMDD".
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */

const formattedDate = date => date.toISOString().slice(0, 10).replace(/-/g, '');

function printResume() {
  const date = new Date();
  const bodyElement = document.querySelector('body');
  const { className } = bodyElement;

  bodyElement.className = 'pdf';

  const pdfOptions = {
    margin: [1.2, 1],
    enableLinks: true,
    filename: `kevin_mccormack_resume_${formattedDate(date)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
  };

  html2pdf().set(pdfOptions).from(bodyElement).save().then(() => {
      bodyElement.className = className;
    })
    .catch(error => console.error('Error generating PDF:', error));
}

document.getElementById('downloadPDF').onclick = printResume;
