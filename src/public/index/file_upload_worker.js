function initFileUpload(password) {
    const uploadButton = document.getElementById('uploadExeButton');
    const fileInput = document.getElementById('exeFileInput');

    // Remove existing event listeners
    const newUploadButton = uploadButton.cloneNode(true);
    uploadButton.parentNode.replaceChild(newUploadButton, uploadButton);

    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);

    // Add event listener to upload button to trigger file input click
    newUploadButton.addEventListener('click', function() {
        newFileInput.click();
    });

    // Add new event listener for file upload
    newFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch(`/upload_file?token=${password}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('File uploaded successfully:', data);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                alert(error);
            });
        }
    });
}