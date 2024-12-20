
const modal = document.getElementById('modal');
const cancelButton = document.getElementById('cancelButton');
const fieldsContainer = document.getElementById('fieldsContainer');
const addButton = document.getElementById('addButton');
const presetForm = document.getElementById('presetForm');

let keyOptions = ["Enter", "Space", "Esc"]; // Default options for keys

function initializeForm() {
    // Reset preset name
    presetForm.reset();

    // Clear and reset fields
    fieldsContainer.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        addRow();
    }
}

function addRow() {
    const rows = fieldsContainer.getElementsByClassName('row');
    if (rows.length < 7) {
        const row = document.createElement('div');
        row.classList.add('row');

        row.innerHTML = `
                    <input type="text" name="commandName[]" placeholder="Command name">
                    <select class="actionSelector" name="action[]">
                        <option value="press">Press</option>
                        <option value="open">Open</option>
                    </select>
                    <select name="key[]">
                        ${keyOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                `;

        fieldsContainer.appendChild(row);
        attachActionChangeHandler(row.querySelector('.actionSelector'));
    } else {
        alert('You can only add up to 7 fields.');
    }
}

openModalButton.addEventListener('click', () => {
    initializeForm();
    modal.classList.add('active');
});

cancelButton.addEventListener('click', () => {
    modal.classList.remove('active');
});

addButton.addEventListener('click', addRow);

presetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(presetForm);
    const name = formData.get('presetName');
    const buttons = [];

    const commandNames = formData.getAll('commandName[]');
    const actions = formData.getAll('action[]');
    const keys = formData.getAll('key[]');
    const values = formData.getAll('value[]');

    commandNames.forEach((commandName, index) => {
        const button = {
            name: commandName,
            type: actions[index],
            action: actions[index] === 'open' ? values[index] : keys[index]
        };
        buttons.push(button);
    });

    const result = {
        name: name,
        buttons: buttons
    };

    console.log(result);
    alert('Form submitted! Check the console for data.');
    modal.classList.remove('active');
});

function attachActionChangeHandler(selector) {
    selector.addEventListener('change', function () {
        const parent = this.parentElement;
        const keySelector = parent.querySelector('select[name="key[]"]');
        const textField = parent.querySelector('input[name="value[]"]');

        if (this.value === 'open') {
            if (!textField) {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'value[]';
                input.placeholder = 'Enter URL or text';
                if (keySelector) keySelector.remove();
                parent.appendChild(input);
            }
        } else {
            if (!keySelector) {
                const select = document.createElement('select');
                select.name = 'key[]';
                select.innerHTML = keyOptions.map(option => `<option value="${option}">${option}</option>`).join('');
                if (textField) textField.remove();
                parent.appendChild(select);
            }
        }
    });
}

document.querySelectorAll('.actionSelector').forEach(attachActionChangeHandler);

function setKeyOptions(options) {
    keyOptions = options;
}

// Example usage of setKeyOptions to update options dynamically
setKeyOptions(["Tab", "Shift", "Ctrl"]);