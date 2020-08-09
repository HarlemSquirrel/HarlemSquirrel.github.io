function formattedDate(date) {
  // YYYYMMDD
  return date.toISOString().split('T')[0].replace(/-/gi, '')
}

function print_resume() {
  var date = new Date()
  var element = document.querySelector('body')
  // var element = document.querySelector('body').cloneNode(true)
  var opt = {
    margin:       [1.2, 1],
    enableLinks:  true,
    filename:     'kevin_mccormack_resume_' + formattedDate(date) + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'cm', format: 'letter', orientation: 'portrait' }
  };

  var currentClass = element.className
  element.className = "pdf"

  html2pdf().set(opt).from(element).save().then(function () {
    element.className = currentClass
  })
}

document.getElementById('downloadPDF').onclick = print_resume
