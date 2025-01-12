const modalProcess = document.getElementById('process-preset');
const cancelButtonProcess = document.getElementById('cancelButtonPro');
const addButtonProcess = document.getElementById('addButtonPro');
const presetFormProcess = document.getElementById('process-preset-form');

function initializeFormProcess() {
    // Reset preset name
    presetFormProcess.reset();

    // Clear and reset fields
    fieldsContainer.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        addRow();
    }
}

cancelButtonProcess.addEventListener('click', () => {
    modalProcess.classList.remove('active');
});

async function sendProcessPreset(password) {
    const formData = new FormData(presetFormProcess);
    const name = formData.get('presetName');
    const filePath = formData.get('filePath');

    const result = {
        name: name,
        path: filePath
    };

    await createProcessPrest(result.name, result.path, password).catch(e=>{alert(e)});
    modalProcess.classList.remove('active');
}