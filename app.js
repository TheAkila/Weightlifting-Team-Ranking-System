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
      const gender = genderFilter.value;
      const weight = weightFilter.value;
      const team = teamFilter.value;

      const filtered = data
        .filter((a) => (gender ? a.gender === gender : true))
        .filter((a) => (weight ? a.weightClass === weight : true))
        .filter((a) => (team ? a.team === team : true))
        .sort((a, b) => b.total - a.total);

      tableBody.innerHTML = "";
      filtered.forEach((a, i) => {
        const row = document.createElement("tr");
        row.className = i === 0 ? "bg-yellow-100 font-bold" : "";
        row.innerHTML = `
          <td class="px-4 py-2">${i + 1}</td>
          <td class="px-4 py-2">${a.name}</td>
          <td class="px-4 py-2">${a.gender}</td>
          <td class="px-4 py-2">${a.weightClass}</td>
          <td class="px-4 py-2">${a.snatch}</td>
          <td class="px-4 py-2">${a.cleanJerk}</td>
          <td class="px-4 py-2">${a.total}</td>
          <td class="px-4 py-2">
            <span class="inline-block px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">${a.team}</span>
          </td>
        `;
        tableBody.appendChild(row);
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
