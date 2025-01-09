
function fillPresetsTable(presets, options, password) {
    // Get a reference to the container where the table will be inserted
    const container = document.getElementById('presets-table');

    // Clear existing content in the container
    container.innerHTML = '';

    // Create the table element
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    // Create the first row (header row)
    const headerRow = document.createElement('tr');

    // Add "Repats" cell
    const repatsCell = document.createElement('td');
    repatsCell.textContent = 'Repats';
    repatsCell.style.border = '1px solid black';
    repatsCell.style.padding = '8px';
    headerRow.appendChild(repatsCell);

    // Add number input cell
    const numberInputCell = document.createElement('td');
    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInputCell.appendChild(numberInput);
    numberInputCell.style.border = '1px solid black';
    numberInputCell.style.padding = '8px';
    headerRow.appendChild(numberInputCell);

    // Add dropdown input cell
    const dropdownCell = document.createElement('td');
    const dropdown = document.createElement('select');
    dropdown.id = 'repeats-select';
    dropdownCell.appendChild(dropdown);
    dropdownCell.style.border = '1px solid black';
    dropdownCell.style.padding = '8px';
    headerRow.appendChild(dropdownCell);

    // Add "Go" button cell
    const goButtonCell = document.createElement('td');
    const goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButtonCell.appendChild(goButton);
    goButtonCell.style.border = '1px solid black';
    goButtonCell.style.padding = '8px';
    headerRow.appendChild(goButtonCell);

    table.appendChild(headerRow);

    // Find the maximum number of buttons across all presets
    const maxButtons = Math.max(...presets.map(preset => preset.buttons.length));

    // Populate the table with data rows
    presets.forEach(preset => {
        const row = document.createElement('tr');

        // Add name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = preset.name;
        nameCell.style.border = '1px solid black';
        nameCell.style.padding = '8px';
        row.appendChild(nameCell);

        // Add buttons for each button name in the preset
        preset.buttons.forEach(button_ => {
            const buttonName = button_?.name;
            const buttonCell = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = buttonName;
            button.addEventListener('click', () => {
                const checkedIps = getCheckedIps();
                console.log(`Preset ID: ${preset.id}, Button: ${buttonName}, ips: ${checkedIps}`);
                activatePreset(preset.id, buttonName, checkedIps, password);
            });
            buttonCell.appendChild(button);
            buttonCell.style.border = '1px solid black';
            buttonCell.style.padding = '8px';
            row.appendChild(buttonCell);
        });

        // Add "Delete" button as the last button
        const deleteButtonCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            console.log(`Preset ID: ${preset.id}, Button: Delete`);
        });
        deleteButtonCell.appendChild(deleteButton);
        deleteButtonCell.style.border = '1px solid black';
        deleteButtonCell.style.padding = '8px';
        row.appendChild(deleteButtonCell);

        // Fill the remaining cells with empty cells if needed
        for (let i = preset.buttons.length + 1; i < maxButtons + 1; i++) {
            const emptyCell = document.createElement('td');
            emptyCell.style.border = '1px solid black';
            emptyCell.style.padding = '8px';
            row.appendChild(emptyCell);
        }

        table.appendChild(row);
    });

    // Append the table to the container
    container.appendChild(table);
    fillRepeatOptions(options);
}

function fillRepeatOptions(options) {
    const removeOptions = (selectElement) => {
        var i, L = selectElement?.options?.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    const selectElement = document.getElementById('repeats-select');
    console.log(options);
    removeOptions(selectElement);

    // Fill buttons
    options?.forEach(optionEl => {
        const option = document.createElement('option');
        option.value = optionEl;
        option.textContent = optionEl;
        selectElement.appendChild(option);
    });
}