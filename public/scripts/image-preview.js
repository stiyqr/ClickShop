const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');
const resetButtonElement = document.getElementById('reset-button');

function clearImagePreview() {
    imagePreviewElement.style.display = 'none';
}

function updateImagePreview() {
    const files = imagePickerElement.files;
    console.log("hey!");

    if (!files || files.length === 0) {
        imagePreviewElement.style.display = 'none';
        return;
    }

    const pickedFile = files[0];

    // generate url that is local to user's device (since the file is still in user's device, not in server)
    imagePreviewElement.src = URL.createObjectURL(pickedFile);
    imagePreviewElement.style.display = 'block';
}

resetButtonElement.addEventListener('click', clearImagePreview);
imagePickerElement.addEventListener('change', updateImagePreview);