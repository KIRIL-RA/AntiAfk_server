function createTable(buttons, rows) {
    const columns = buttons?.length+2;

    clearTable();
    const tableContainer = document.getElementById('table-container');
    
    // Create table element
    const table = document.createElement('table');
    table.setAttribute("id", "ipTable");

    // Create the header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const emptyHeader = document.createElement('th');
    headerRow.appendChild(emptyHeader);

    buttons.forEach((buttonName, colIndex) => {
        const th = document.createElement('th');
        const button = document.createElement('button');
        button.textContent = buttonName;
        button.addEventListener('click', () => {
            const activeRows = [];
            table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
                const checkbox = row.cells[colIndex + 1].querySelector('input[type="checkbox"]');
                const rowName = row.cells[0].innerHTML;
                console.log(rowName);
                if (checkbox && checkbox.checked) {
                    activeRows.push(`${rowName} ${rowIndex + 1}`);
                }
            });
            console.log(`Active checkboxes under '${buttonName}':`, activeRows);
        });
        th.appendChild(button);
        headerRow.appendChild(th);
    });

    const lastHeader = document.createElement('th');
    lastHeader.innerHTML = `Repeats <input type="number" min="1"> <select><option>Option 1</option><option>Option 2</option></select> <button>Go</button>`;
    headerRow.appendChild(lastHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the body rows
    const tbody = document.createElement('tbody');

    rows.forEach(rowName => {
        const row = document.createElement('tr');

        // Add checkbox and row name in the first column
        const firstCell = document.createElement('td');
        firstCell.appendChild(document.createTextNode(` ${rowName}`));
        row.appendChild(firstCell);

        // Add checkboxes for other columns except the last
        for (let i = 0; i < columns - 2; i++) {
            const cell = document.createElement('td');
            const columnCheckbox = document.createElement('input');
            columnCheckbox.type = 'checkbox';
            cell.appendChild(columnCheckbox);
            row.appendChild(cell);
        }

        // Add a cell for the last column
        const lastCell = document.createElement('td');
        const columnCheckbox = document.createElement('input');
        columnCheckbox.type = 'checkbox';
        lastCell.appendChild(columnCheckbox);
        row.appendChild(lastCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Append the table to the container
    tableContainer.appendChild(table);
}

function clearTable(){
    const table = document.getElementById('ipTable');
    table?.remove();
}