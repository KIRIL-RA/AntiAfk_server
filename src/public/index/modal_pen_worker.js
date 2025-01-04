function openModal(ip, alias, password) {
    
    const modal = document.getElementById('modal-pen');
    const overlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalInput = document.getElementById('modal-input');

    modalTitle.textContent = `Change name for ${ip}`;
    modalInput.value = alias || '';

    modal.style.display = 'block';
    overlay.style.display = 'block';

    const updateName = () =>{
        const rows = document.querySelectorAll('tbody tr');
        const newAlias = modalInput.value;

        rows.forEach(row => {
            if (row?.cells[0]?.querySelectorAll('span')[0]?.textContent?.trim() === ip) {
                row.cells[1].textContent = newAlias;
            }
        });

        console.log(ip);
        setIpName(ip, newAlias, password);
        document.getElementById('modal-apply').removeEventListener('click', updateName, true);
        closeModal();
    }

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-apply').addEventListener('click', updateName, true);
}

function closeModal() {
    console.log("click");
    const modal = document.getElementById('modal-pen');
    const overlay = document.getElementById('modal-overlay');

    modal.style.display = 'none';
    overlay.style.display = 'none';
}
