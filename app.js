fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    const genderFilter = document.getElementById("genderFilter");
    const weightFilter = document.getElementById("weightFilter");
    const teamFilter = document.getElementById("teamFilter");
    const tableBody = document.getElementById("rankingTable");

    const weightClasses = [...new Set(data.map((a) => a.weightClass))];
    weightClasses.forEach((w) => {
      const option = document.createElement("option");
      option.value = w;
      option.textContent = w;
      weightFilter.appendChild(option);
    });

    function renderTable() {
      const tbody = document.getElementById("rankingTable");
      tbody.innerHTML = "";
    
      const gender = document.getElementById("genderFilter").value;
      const weightClass = document.getElementById("weightFilter").value;
      const team = document.getElementById("teamFilter").value;
    
      let filtered = lifters.filter(l =>
        (gender ? l.gender === gender : true) &&
        (weightClass ? l.weightClass === weightClass : true) &&
        (team ? l.team === team : true)
      );
    
      filtered = filtered.map(l => ({
        ...l,
        sinclair: getSinclairScore(l.bodyweight, l.total, l.gender)
      }));
    
      if (currentSort === "total") {
        filtered.sort((a, b) => b.total - a.total);
      } else {
        filtered.sort((a, b) => b.sinclair - a.sinclair);
      }
    
      // ✅ Handle empty filter result
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="text-center py-6 text-gray-500 italic">
              No lifters match the selected filters.
            </td>
          </tr>
        `;
        return;
      }
    
      filtered.forEach((l, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="px-3 py-2">${i + 1}</td>
          <td class="px-3 py-2">${l.name}</td>
          <td class="px-3 py-2">${l.gender}</td>
          <td class="px-3 py-2">${l.bodyweight.toFixed(1)}</td>
          <td class="px-3 py-2">${l.weightClass}</td>
          <td class="px-3 py-2">${l.snatch}</td>
          <td class="px-3 py-2">${l.cleanJerk}</td>
          <td class="px-3 py-2 font-semibold" style="display: ${currentSort === 'total' ? 'table-cell' : 'none'};">${l.total}</td>
          <td class="px-3 py-2 font-semibold" style="display: ${currentSort === 'sinclair' ? 'table-cell' : 'none'};">${l.sinclair}</td>
          <td class="px-3 py-2">${l.team}</td>
        `;
        tbody.appendChild(tr);
      });
    }
    

    genderFilter.addEventListener("change", renderTable);
    weightFilter.addEventListener("change", renderTable);
    teamFilter.addEventListener("change", renderTable);
    document.getElementById("resetBtn").addEventListener("click", () => {
      genderFilter.value = "";
      weightFilter.value = "";
      teamFilter.value = "";
      renderTable();
    });

    renderTable();
  });
