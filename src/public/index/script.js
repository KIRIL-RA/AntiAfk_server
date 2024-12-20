// Buttons selector
let ips = [];
let buttonNames = [];

const passwordField = document.getElementById("password-field");
const connectButton = document.getElementById("loginB");
const selectPreset = document.getElementById("preset_select");
const openModalButton = document.getElementById('openModalButton');

firstInit();

async function firstInit() {
    openModalButton.style.visibility = "hidden";
    selectPreset.style.visibility ="hidden";
    connectButton.addEventListener('click', () => loginButton());
}

// Login button handler
async function loginButton() {
    const password = passwordField.value;

    setHeaderButtons(true);

    // Getting preset
    await presetsFill(password);
    
    openModalButton.addEventListener('click', () => {
        initializeForm(password);
        modal.classList.add('active');
    });
    
    connectSocket(password, clearConnectionData, (_ips) => {
        console.log(_ips);
        ips = _ips;
        createTable(buttonNames, ips);
    });
}

// Fill preset 
async function presetsFill(password){
    const preset = await getPresets(password);
    console.log(preset);
    if(preset?.msg != undefined){
        clearConnectionData(preset.msg);
        return;
    }

    fillPresets(preset, password);

    // Get keys
    const keysResp = await getKeys(password);
    const keys = Object.keys(keysResp.data);
    setKeyOptions(keys);
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

    setHeaderButtons(false);
    clearTable();
    alert(message);
}

function setHeaderButtons(state){
    passwordField.disabled = state;
    connectButton.disabled = state;

    openModalButton.style.visibility = state ? "visible" : "hidden";
    selectPreset.style.visibility = state ? "visible" : "hidden";
}

// Example Usage
//createTable(5, ['Button 1', 'Button 2', 'Button 3'], ['Row 1', 'Row 2', 'Row 3']);