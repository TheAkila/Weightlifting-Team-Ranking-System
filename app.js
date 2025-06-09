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

    window.lifters = data;

    function toggleColumnVisibility() {
      const showCols = (cols, show) => {
        cols.forEach(col => {
          document.querySelectorAll(`.col-${col}`).forEach(el => {
            el.style.display = show ? 'table-cell' : 'none';
          });
        });
      };

      if (currentSort === 'sinclair') {
        showCols(["gender", "bw", "snatch", "cj", "total", "team"], false);
        showCols(["sinclair"], true);
      } else {
        showCols(["gender", "bw", "snatch", "cj", "total", "team"], true);
        showCols(["sinclair"], false);
      }
    }

    function renderTable() {
      const tbody = document.getElementById("rankingTable");
      tbody.innerHTML = "";

      const gender = genderFilter.value;
      const weightClass = weightFilter.value;
      const team = teamFilter.value;

      let filtered = lifters.filter(l =>
        (!gender || l.gender === gender) &&
        (!weightClass || l.weightClass === weightClass) &&
        (!team || l.team === team)
      );

      filtered = filtered.map(l => ({
        ...l,
        sinclair: getSinclairScore(l.bodyweight, l.total, l.gender).toFixed(2)
      }));

      if (currentSort === "total") {
        filtered.sort((a, b) => b.total - a.total);
      } else {
        filtered.sort((a, b) => b.sinclair - a.sinclair);
      }

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
          <td class="px-3 py-2 col-rank">${i + 1}</td>
          <td class="px-3 py-2 col-name">${l.name}</td>
          <td class="px-3 py-2 col-gender">${l.gender}</td>
           <td class="px-3 py-2 hidden">${l.bodyweight.toFixed(1)}</td>
          <td class="px-3 py-2 col-wclass">${l.weightClass}</td>
          <td class="px-3 py-2 col-snatch">${l.snatch}</td>
          <td class="px-3 py-2 col-cj">${l.cleanJerk}</td>
          <td class="px-3 py-2 col-total font-semibold">${l.total}</td>
          <td class="px-3 py-2 col-sinclair font-semibold">${l.sinclair}</td>
          <td class="px-3 py-2 col-team">${l.team}</td>
        `;
        tbody.appendChild(tr);
      });

      toggleColumnVisibility();
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
