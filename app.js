fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('rankingTable');
    const genderFilter = document.getElementById('genderFilter');
    const weightFilter = document.getElementById('weightFilter');

    const uniqueWeightClasses = [...new Set(data.map(a => a.weightClass))];
    uniqueWeightClasses.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w;
      opt.textContent = w;
      weightFilter.appendChild(opt);
    });

    function renderTable(filteredData) {
      tableBody.innerHTML = '';
      filteredData.sort((a, b) => b.total - a.total)
        .forEach((athlete, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="py-2 px-4 text-center">${index + 1}</td>
            <td class="py-2 px-4">${athlete.name}</td>
            <td class="py-2 px-4">${athlete.gender}</td>
            <td class="py-2 px-4">${athlete.weightClass}</td>
            <td class="py-2 px-4">${athlete.snatch}</td>
            <td class="py-2 px-4">${athlete.cleanJerk}</td>
            <td class="py-2 px-4">${athlete.total}</td>
          `;
          tableBody.appendChild(row);
        });
    }

    function applyFilters() {
      const gender = genderFilter.value;
      const weightClass = weightFilter.value;
      const filtered = data.filter(a => 
        (!gender || a.gender === gender) && 
        (!weightClass || a.weightClass === weightClass)
      );
      renderTable(filtered);
    }

    genderFilter.addEventListener('change', applyFilters);
    weightFilter.addEventListener('change', applyFilters);

    renderTable(data);
  });