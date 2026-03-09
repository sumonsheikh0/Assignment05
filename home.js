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


//API add //
const issuesGrid = document.getElementById('issues-grid');
const issueCount = document.getElementById('issueCount');

async function loadIssues() {
  try {
    const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const result = await response.json();

    if (result.status === "success") {
      allIssues = result.data;
      displayIssues(allIssues);
    }
  } catch (error) {
    console.error("API Error:", error);
    issuesGrid.innerHTML = `<p class="text-red-500 p-5">Data could not be loaded.</p>`;
  }
}

// info card design
function displayIssues(issues) {
  issueCount.innerText = `${issues.length} Issues`;
  issuesGrid.innerHTML = '';

  issues.forEach(issue => {
    const isOpen = issue.status.toLowerCase() === 'open';
    const statusColor = isOpen ? 'bg-[#22C55E]' : 'bg-[#6322F5]';
    const iconColor = isOpen ? 'text-[#22C55E]' : 'text-[#6322F5]';
    const statusIcon = isOpen ? 'fa-regular fa-circle-dot' : 'fa-regular fa-circle-check';


    const priority = issue.priority.toLowerCase();
    let priorityStyle = 'bg-gray-100 text-gray-600';
    if (priority === 'high') priorityStyle = 'bg-[#FEECEC] text-[#EF4444]';
    else if (priority === 'medium') priorityStyle = 'bg-[#FFF6D1] text-[#F59E0B]';

    const cardHTML = `
            <div class="issue-card relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow" data-id="${issue.id}">
                <div class="absolute top-0 left-0 w-full h-[4px] ${statusColor} rounded-t-2xl" ></div>
                
                <div class="flex justify-between items-center mb-4 mt-2">
                    <div class="${iconColor} text-lg">
                        <i class="${statusIcon}"></i>
                    </div>
                    <span class="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${priorityStyle}">
                        ${issue.priority}
                    </span>
                </div>

                <h3 class="font-bold text-[#111827] text-[15px] mb-2 leading-tight uppercase">
                    ${issue.title}
                </h3>
                <p class="text-[12px] text-gray-400 mb-4 line-clamp-3">
                    ${issue.description}
                </p>

                <div class="flex flex-wrap gap-2 mb-6">
                    ${issue.labels.map(label => {
      let labelColor = "bg-[#FEE2E2] text-[#EF4444] border-[#FCA5A5]";
      let icon = "fa-bug";

      if (label.toLowerCase().includes('enhancement')) {
        labelColor = "bg-[#DCFCE7] text-[#22C55E] border-[#86EFAC]";
        icon = "fa-wand-magic-sparkles";
      }

      if (label.toLowerCase().includes('help wanted')) {
        labelColor = "bg-[#FFF6D1] text-[#F59E0B] border-[#D97706]";
        icon = "fa-regular fa-handshake";
      }
      if (label.toLowerCase().includes('documentation')) {
        labelColor = "bg-[#FEE2E2] text-[#F59E0B] border-[#D97706]";
        icon = "fa-regular fa-file";
      }

      if (label.toLowerCase().includes('good first issue')) {
        labelColor = "bg-blue-200 text-blue-700 border-blue-700";
        icon = "fa-solid fa-circle-exclamation";
      }

      return `
<span class="flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-bold uppercase ${labelColor}">
<i class="fa-solid ${icon}"></i> ${label}
</span>
`;
    }).join('')}
                </div>

                <div class="mt-auto pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-medium">
                    <p>#${issue.id} by ${issue.author}</p>
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    issuesGrid.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// filter issue setup
function filterIssues(status) {
  if (status === 'all') {
    displayIssues(allIssues);
  } else {
    const filtered = allIssues.filter(i => i.status.toLowerCase() === status);
    displayIssues(filtered);
  }
}


loadIssues();

//pop up 

document.addEventListener("click", function (e) {

  const card = e.target.closest(".issue-card");

  if (!card) return;

  const issueId = card.dataset.id;

  openIssuePopup(issueId);

});

async function openIssuePopup(id) {

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);

  const result = await res.json();

  const issue = result.data;

  showModal(issue);

}


function showModal(issue) {

  document.getElementById("modalTitle").innerText = issue.title;

  document.getElementById("modalDescription").innerText = issue.description;

  document.getElementById("modalAuthor").innerText = `Opened by ${issue.author}`;

  document.getElementById("modalAssignee").innerText = `${issue.author}`;



  document.getElementById("issueModal").classList.remove("hidden");

  const status = issue.status.toLowerCase();

  const statusBadge = document.getElementById("modalStatus");

  statusBadge.innerText = issue.status;

  const priorityBadge = document.getElementById("modalPriority");

  priorityBadge.innerText = issue.priority;

  const priority = issue.priority.toLowerCase();

  if (priority === "high") {
    priorityBadge.className =
      "bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase";
  }

  else if (priority === "medium") {
    priorityBadge.className =
      "bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase";
  }

  else {
    priorityBadge.className =
      "bg-gray-300 text-black px-3 py-1 rounded-full text-xs font-bold uppercase";
  }

  // eine edit kora lagbe

  if (status === "open") {
    statusBadge.className =
      "bg-green-600 text-white px-2 py-1 text-xs rounded-full font-semibold";

  }
  else {
    statusBadge.className =
      "bg-purple-600 text-white px-2 py-1 text-xs rounded-full font-semibold";
  }

  // label add on pop up

  const labelsContainer = document.getElementById("modalLabels");

  labelsContainer.innerHTML = issue.labels.map(label => {

    let labelColor = "bg-[#FEE2E2] text-[#EF4444] border-[#FCA5A5]";
    let icon = "fa-bug";

    if (label.toLowerCase().includes('enhancement')) {
      labelColor = "bg-[#DCFCE7] text-[#22C55E] border-[#86EFAC]";
      icon = "fa-wand-magic-sparkles";
    }

    if (label.toLowerCase().includes('help wanted')) {
      labelColor = "bg-[#FFF6D1] text-[#F59E0B] border-[#D97706]";
      icon = "fa-handshake";
    }

    if (label.toLowerCase().includes('documentation')) {
      labelColor = "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]";
      icon = "fa-file";
    }

    if (label.toLowerCase().includes('good first issue')) {
      labelColor = "bg-blue-200 text-blue-700 border-blue-700";
      icon = "fa-circle-exclamation";
    }

    return `
<span class="flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-bold uppercase ${labelColor}">
<i class="fa-solid ${icon}"></i> ${label}
</span>
`;

  }).join('');

}

document.getElementById("closeModal").addEventListener("click", function () {

  document.getElementById("issueModal").classList.add("hidden");

});
