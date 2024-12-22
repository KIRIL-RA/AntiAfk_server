// Buttons selector
let ips = [];
let buttonNames = [];
let selectedPresed = '';
let keys = '';

const passwordField = document.getElementById("password-field");
const connectButton = document.getElementById("loginB");
const selectPreset = document.getElementById("preset_select");
const openModalButton = document.getElementById('openModalButton');

firstInit();

async function firstInit() {
    openModalButton.style.visibility = "hidden";
    selectPreset.style.visibility = "hidden";
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

    connectSocket(password, clearConnectionData, async (_ips) => {
        // Get keys
        const keysResp = await getKeys(password);
        keys = Object.keys(keysResp.data);
        setKeyOptions(keys);

        ips = _ips;
        await createTable(buttonNames, ips, selectedPresed, password, activatePreset, keys);

        // Fill repeats
        fillRepeatOptions(keyOptions);
    });

    presetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendPreset(password);
        await presetsFill(password);
    });
}

// Fill preset 
async function presetsFill(password) {
    const preset = await getPresets(password);
    console.log(preset);
    if (preset?.msg != undefined) {
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
    if (presetData.data == null) {
        alert("Preset not founded");
        return;
    }

    // Extracting buttons
    const buttons = presetData?.data?.buttons;
    buttonNames = buttons?.map(item => item.name);

    selectedPresed = presetId;
    createTable(buttonNames, ips, selectedPresed, password, activatePreset);

    // Fill repeats
    fillRepeatOptions(keyOptions); 
}

function fillPresets(preset, password) {
    const removeOptions = (selectElement) => {
        var i, L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    const selectElement = document.getElementById('presetSelect');
    removeOptions(selectElement);

    // Fill presets
    preset?.data.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.id; // id пресета
        option.textContent = preset.name; // name пресета
        selectElement.appendChild(option);
    });

    // Hadler for selector
    selectElement.addEventListener('change', async (event) => {
        const selectedId = event.target.value;
        await handleChangePreset(selectedId, password);

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

function setHeaderButtons(state) {
    passwordField.disabled = state;
    connectButton.disabled = state;

    openModalButton.style.visibility = state ? "visible" : "hidden";
    selectPreset.style.visibility = state ? "visible" : "hidden";
}