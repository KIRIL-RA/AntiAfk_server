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

async function testInit() {
    const testIps = [
        { ip: "192.168.1.1", name: "name" }
    ];
    openModalButton.style.visibility = "hidden";
    selectPreset.style.visibility = "hidden";

    fillIpsTable(testIps, 'token', (ips_) => {
        console.log(ips_);
    });
    // Example usage
    const presets = [
        {
            name: 'Preset 1',
            id: 1,
            buttons: ['Button A', 'Button B']
        },
        {
            name: 'Preset 2',
            id: 2,
            buttons: ['Button X', 'Button Y', 'Button Z', 'Button W']
        },
        {
            name: 'Preset 3',
            id: 3,
            buttons: ['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5']
        }
    ];
    fillPresetsTable(presets, ['k', 'y']);
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
        // Fill ip's
        ips = _ips;
        await fillIpsTable(ips, password);
    });

    presetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendPreset(password);
        await presetsFill(password);
    });
}

// Fill preset 
async function presetsFill(password) {
    // Get presets
    const preset = await getPresets(password);
    console.log(preset);
    if (preset?.msg != undefined) {
        clearConnectionData(preset.msg);
        return;
    }

    // Get keys
    const keysResp = await getKeys(password);
    const keys = Object.keys(keysResp.data);

    console.log(preset);
    fillPresetsTable(preset.data, keys, password);
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