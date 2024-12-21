function createTable(buttons, rows, prestId, password, sendActionFunction) {
    const columns = buttons?.length + 2;

    clearTable();
    const tableContainer = document.getElementById('table-container');

    // Create table element
    const table = document.createElement('table');
    table.setAttribute("id", "ipTable");

    // Create the header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const ipHeader = document.createElement('th');
    ipHeader.textContent = 'IP';
    headerRow.appendChild(ipHeader);

    const aliasHeader = document.createElement('th');
    aliasHeader.textContent = 'Alias';
    headerRow.appendChild(aliasHeader);

    buttons.forEach((buttonName, colIndex) => {
        const th = document.createElement('th');
        const button = document.createElement('button');
        button.textContent = buttonName;
        button.addEventListener('click', () => {
            const activeRows = [];
            table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
                const checkbox = row.cells[colIndex + 2].querySelector('input[type="checkbox"]');
                const rowName = row.cells[0].innerHTML;
                console.log(rowName);
                if (checkbox && checkbox.checked) {
                    activeRows.push(rowName);
                }
            });
            sendActionFunction(prestId, buttonName?.replace("'", ""), activeRows, password);
            console.log(`Active checkboxes under '${buttonName}':`, activeRows);
        });

        th.appendChild(button);
        headerRow.appendChild(th);
    });

    const lastHeader = document.createElement('th');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';

    const select = document.createElement('select');
    select.id = 'repeats_select';

    const button = document.createElement('button');
    button.textContent = 'Go';
    button.addEventListener('click', () => {
        const activeRows = [];
        table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
            const checkbox = row.cells[columns - 1].querySelector('input[type="checkbox"]');
            const rowName = row.cells[0].innerHTML;
            if (checkbox && checkbox.checked) {
                activeRows.push(rowName);
            }
        });

        sendPushButton(select.value, input.value, activeRows, password);
    });

    lastHeader.appendChild(document.createTextNode('Repeats '));
    lastHeader.appendChild(input);
    lastHeader.appendChild(select);
    lastHeader.appendChild(button);
    headerRow.appendChild(lastHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the body rows
    const tbody = document.createElement('tbody');

    rows.forEach(rowObj => {
        const row = document.createElement('tr');

        // Add IP column
        const ipCell = document.createElement('td');
        ipCell.textContent = rowObj.ip;
        row.appendChild(ipCell);

        // Add Alias column
        const aliasCell = document.createElement('td');
        aliasCell.textContent = rowObj.rowName || '';
        row.appendChild(aliasCell);

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

function fillRepeatOptions(options) {
    const removeOptions = (selectElement) => {
        var i, L = selectElement?.options?.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    const selectElement = document.getElementById('repeats_select');
    console.log(selectElement);
    removeOptions(selectElement);

    // Fill buttons
    options?.forEach(optionEl => {
        const option = document.createElement('option');
        option.value = optionEl;
        option.textContent = optionEl;
        selectElement.appendChild(option);
    });
}

function clearTable() {
    const table = document.getElementById('ipTable');
    table?.remove();
}