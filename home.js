const filterButtons = document.querySelectorAll('.filter-btn');

function setActiveButton(clickedButton) {
  filterButtons.forEach(btn => {

    btn.classList.remove('bg-[#6322F5]', 'text-white');
    btn.classList.add('bg-white', 'border', 'text-gray-800');
  });


  clickedButton.classList.remove('bg-white', 'border', 'text-gray-800');
  clickedButton.classList.add('bg-[#6322F5]', 'text-white');
}


filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    setActiveButton(this);


    const status = this.innerText.toLowerCase();
    filterIssues(status);
  });
});