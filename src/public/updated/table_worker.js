
function fillIpsTable(rows, password) {
    let ips = [];

    clearTable();
    const tableContainer = document.getElementById('ips-table');

    // Create table element
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.setAttribute("id", "ipTable");

    // Create the header row
    {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const ipHeader = document.createElement('th');
        ipHeader.textContent = 'IP';
        headerRow.appendChild(ipHeader);

        const aliasHeader = document.createElement('th');
        aliasHeader.textContent = 'Alias';
        headerRow.appendChild(aliasHeader);

        const lastHeader = document.createElement('th');
        headerRow.appendChild(lastHeader);

        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    // Add control row for checkboxes
    {
        const controlRow = document.createElement('tr');
        const controlCell = document.createElement('td');
        controlCell.textContent = 'Control';
        controlRow.appendChild(controlCell);

        const aliasCell = document.createElement('td');
        aliasCell.textContent = '';
        controlRow.appendChild(aliasCell);

        const lastControlCell = document.createElement('td');
        const lastControlCheckbox = document.createElement('input');
        lastControlCheckbox.type = 'checkbox';
        lastControlCheckbox.addEventListener('change', (e) => {
            const checked = e.target.checked;
            table.querySelectorAll('tbody tr').forEach(row => {
                const checkbox = row.cells[2].querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = checked;
                }
            });
        });
        lastControlCell.appendChild(lastControlCheckbox);
        controlRow.appendChild(lastControlCell);

        tbody.appendChild(controlRow);
    }

    // Create the body rows
    rows.forEach(rowObj => {
        const row = document.createElement('tr');

        // Add IP column
        const ipCell = document.createElement('td');
        const ipText = document.createElement('span');
        ipText.textContent = rowObj.ip;
        const editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.style.marginLeft = '10px';
        editButton.addEventListener('click', () => openModal(rowObj.ip, rowObj.name, password));
        ipCell.appendChild(ipText);
        ipCell.appendChild(editButton);
        row.appendChild(ipCell);

        // Add Alias column
        const aliasCell = document.createElement('td');
        aliasCell.textContent = rowObj.name || '';
        row.appendChild(aliasCell);

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
    applySort();
}

function clearTable() {
    const table = document.getElementById('ipTable');
    table?.remove();
}

function sortDescendingByIp(arr) {
    return arr.sort((a, b) => {
        const ipA = a.ip.split('f:').pop(); // Извлекаем IPv4
        const ipB = b.ip.split('f:').pop();
        const numA = ipA.split('.').reduce((acc, octet) => acc * 256 + parseInt(octet), 0); // Преобразуем в число
        const numB = ipB.split('.').reduce((acc, octet) => acc * 256 + parseInt(octet), 0);
        return numB - numA; // Сортировка по убыванию
    });
}

function applySort() {
    const tbody = document.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr')).slice(1);

    const rowObjects = rows.map(row => ({
        element: row,
        ip: row.cells[0].textContent.trim()
    }));

    const sortedIps = sortDescendingByIp(rowObjects);

    sortedIps.forEach(rowObj => tbody.appendChild(rowObj.element));
}

function getCheckedIps() {
    const checkedIps = [];
    const table = document.getElementById('ipTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 2; i < rows.length; i++) { // Start from 1 to skip the header row
        const cells = rows[i].getElementsByTagName('td');
        const checkbox = cells[cells.length - 1].querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            let ip = cells[0].textContent;
            ip = ip.replace(/[^0-9.]/g, ''); // Remove any non-numeric and non-dot characters
            checkedIps.push(ip);
        }
    }

    return checkedIps;
}