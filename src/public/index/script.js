// Buttons selector
let ips = [];
let buttonNames = [];

const passwordField = document.getElementById("password-field");
const connectButton = document.getElementById("loginB");

connectButton.addEventListener('click', () => loginButton());

// Login button handler
async function loginButton() {
    const password = passwordField.value;

    passwordField.disabled = true;
    connectButton.disabled = true;

    // Getting preset
    await presetsFill(password);
    connectSocket(password, clearConnectionData, (_ips) => {
        console.log(_ips);
        ips = _ips;
        createTable(buttonNames, ips);
    });
}

// Fill preset 
async function presetsFill(password){
    const preset = await getPresets(password);
    if(preset?.msg != undefined){
        clearConnectionData(preset.msg);
        return;
    }

    fillPresets(preset, password);
}

async function handleChangePreset(presetId, password) {
    const presetData = await getPreset(presetId, password);
    if(presetData.data == null){
        alert("Preset not founded");
        return;
    }

    // Extracting buttons
    const buttons = presetData?.data?.buttons;
    buttonNames = buttons?.map(item => item.name);

    createTable(buttonNames, ips);
}

function fillPresets(preset, password){
    const selectElement = document.getElementById('presetSelect');

    // Fill presets
    preset?.data.forEach(preset => {
        const option = document.createElement('option');
            option.value = preset.id; // id пресета
            option.textContent = preset.name; // name пресета
            selectElement.appendChild(option);
    });

    // Hadler for selector
    selectElement.addEventListener('change', (event) => {
        const selectedId = event.target.value;
        handleChangePreset(selectedId, password);
        console.log('Выбранный ID пресета:', selectedId);
    });

    handleChangePreset(selectElement.value, password);
}

function clearConnectionData(message) {
    message = message || "Connection failed";
    passwordField.disabled = false;
    connectButton.disabled = false;

    clearTable();
    alert(message);
}

// Example Usage
//createTable(5, ['Button 1', 'Button 2', 'Button 3'], ['Row 1', 'Row 2', 'Row 3']);