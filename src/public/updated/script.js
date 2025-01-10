// Buttons selector
let ips = [];
let buttonNames = [];
let selectedPresed = '';
let keys = '';

const passwordField = document.getElementById("password-field");
const connectButton = document.getElementById("loginB");
const modalButtons = document.getElementById('preset-buttons-blocks');
const openModalButton = document.getElementById('openModalButton');
const openProcessModalButton = document.getElementById('openProcessModalButton');

firstInit();

async function firstInit() {
    modalButtons.style.visibility = "hidden";
    connectButton.addEventListener('click', () => loginButton());
}

async function testInit() {
    const testIps = [
        { ip: "192.168.1.1", name: "name" }
    ];
    modalButtons.style.visibility = "hidden";

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

    // Modal windows buttons initialization
    openModalButton.addEventListener('click', () => {
        initializeFormProcess(password);
        initializeForm(password);
        modal.classList.add('active');
    });
    openProcessModalButton.addEventListener('click', function() {
        const modal = document.getElementById('process-preset');
        modal.classList.add('active');
    });

    // Getting preset
    await presetsFill(password);

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

    presetFormProcess.addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendProcessPreset(password);
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
    fillPresetsTable(preset.data, keys, password, presetsFill);
    setKeyOptions(keys);
    
}

function clearConnectionData(message) {
    message = message || "Connection failed";
    
    setHeaderButtons(false);
    clearProcessTable();
    clearTable();
    alert(message);
}

function setHeaderButtons(state) {
    passwordField.disabled = state;
    connectButton.disabled = state;

    modalButtons.style.visibility = state ? "visible" : "hidden";
}