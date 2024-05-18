// frontend file (home.js)

document.addEventListener("DOMContentLoaded", function() {
    const uploadForm = document.getElementById('uploadForm');

    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('fileToUpload').files[0];
        if (!fileInput) {
            console.error('No file selected');
            return;
        }

        // Add code to interact with the blockchain
        const formData = new FormData();
        formData.append('fileToUpload', fileInput);

        try {
            // Upload document to server
            const response = await fetch('http://localhost:3000/user/profile/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Include authorization token if needed
                }
            });

            if (!response.ok) {
                throw new Error('Failed to upload file.');
            }

            // Fetch documents from server
            await fetchDocuments();
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle upload error
        }
    });

    // Fetch and display documents in user profile
    fetchDocuments();

    async function fetchDocuments() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/user/profile/files`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}` // Include authorization token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch files.');
            }

            const data = await response.json();
            const files = data.files;
            const documentList = document.getElementById('documentList');

            // Clear existing document list
            documentList.innerHTML = '';

            files.forEach(filename => {
                const newRow = document.createElement('tr');
                const newCell = document.createElement('td');

                // Event listener to download the file
                newCell.addEventListener('click', function(){
                    downloadFile(filename);
                });

                newCell.textContent = filename;
                newRow.appendChild(newCell);
                documentList.appendChild(newRow);
            });
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('An error occurred while fetching files.');
        }
    }

    function downloadFile(filename) {
        // Send a GET request to the server to download the document
        fetch(`http://localhost:3000/user/profile/files/download?filename=${filename}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Include authorization token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to download document');
            }
            return response.blob(); // Convert response to Blob object
        })
        .then(blob => {
            // Create a new Blob URL for the document
            const url = URL.createObjectURL(blob);
            // Open the document in a new tab
            window.open(url, '_blank');
        })
        .catch(error => {
            console.error('Error downloading document:', error);
            alert('An error occurred while downloading the document.');
        });
    }
});
