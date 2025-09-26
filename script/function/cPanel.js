 const API_URL = 'https://api.ontario.edu.kh/SliderAPI.php'; // IMPORTANT: Change this if your file is in a different location.

        // Get DOM elements
        const dataTableBody = document.getElementById('data-table-body');
        const addRecordBtn = document.getElementById('add-record-btn');
        const dataModal = new bootstrap.Modal(document.getElementById('data-modal'));
        const confirmModal = new bootstrap.Modal(document.getElementById('confirm-modal'));
        const messageModal = new bootstrap.Modal(document.getElementById('message-modal'));
        const modalLabel = document.getElementById('modalLabel');
        const dataForm = document.getElementById('data-form');
        const recordId = document.getElementById('record-id');
        const oldImageFile = document.getElementById('old-image-file');
        const nameInput = document.getElementById('name');
        const genderInput = document.getElementById('gender');
        const imageFileInput = document.getElementById('image-file');
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        const messageBody = document.getElementById('message-body');

        // Function to show the message modal
        function showMessage(message) {
            messageBody.textContent = message;
            messageModal.show();
        }

        // Fetch and display records from the API
        async function fetchRecords() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                const records = await response.json();
                
                // Clear existing table data
                dataTableBody.innerHTML = '';
                
                if (records.length > 0) {
                    records.forEach(record => {
                        const row = dataTableBody.insertRow();
                        let pach='https://ontario.edu.kh:2083/Images';
                        row.innerHTML = `
                            <td>${record.id}</td>
                            <td>${record.name}</td>
                            <td>${record.gender}</td>
                            <td>
                                <img src='https://api.ontario.edu.kh/Images/${record.image_file}' alt="Image of ${record.name}" class="table-image" onerror="this.onerror=null; this.src='';">
                            </td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${record.id}" data-name="${record.name}" data-gender="${record.gender}" data-image="${record.image_file}">
                                    <i class="bi bi-pencil-square"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${record.id}" data-image="${record.image_file}">
                                    <i class="bi bi-trash"></i> Delete
                                </button>
                            </td>
                        `;
                    });
                } else {
                    const row = dataTableBody.insertRow();
                    row.innerHTML = `<td colspan="5" class="text-center">No records found.</td>`;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                showMessage('Error fetching data. Check your API URL and server connection.');
            }
        }

        // Handle form submission (Add or Edit)
        dataForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isEdit = recordId.value !== '';
            const formData = new FormData();
            
            formData.append('name', nameInput.value);
            formData.append('gender', genderInput.value);
            
            // Append file if selected
            if (imageFileInput.files.length > 0) {
                formData.append('image_file', imageFileInput.files[0]);
            }

            let url = API_URL;
            let method = 'POST';

            if (isEdit) {
                // For editing, we use POST and a hidden field to simulate PUT
                formData.append('id', recordId.value);
                formData.append('_method', 'PUT');
                formData.append('old_image_file', oldImageFile.value);
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    body: formData
                });

                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message);
                    dataModal.hide();
                    dataForm.reset();
                    fetchRecords(); // Refresh the table
                } else {
                    showMessage('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showMessage('An error occurred during form submission.');
            }
        });

        // Event listener for opening the 'Add' modal
        addRecordBtn.addEventListener('click', () => {
            dataForm.reset();
            recordId.value = '';
            oldImageFile.value = '';
            modalLabel.textContent = 'Add New Record';
            imageFileInput.required = true; // Image is required for new records
            dataModal.show();
        });

        // Event listener for edit and delete buttons
        dataTableBody.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                const btn = e.target.closest('.edit-btn');
                recordId.value = btn.dataset.id;
                nameInput.value = btn.dataset.name;
                genderInput.value = btn.dataset.gender;
                oldImageFile.value = btn.dataset.image;
                
                modalLabel.textContent = 'Edit Record';
                imageFileInput.required = false; // Image is not required for edits
                dataModal.show();
            }

            if (e.target.closest('.delete-btn')) {
                const btn = e.target.closest('.delete-btn');
                const recordToDeleteId = btn.dataset.id;
                const imageToDelete = btn.dataset.image;
                
                // Show confirmation modal
                confirmModal.show();

                // Add a one-time listener for the delete confirmation button
                confirmDeleteBtn.onclick = async () => {
                    try {
                        const response = await fetch(API_URL, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: recordToDeleteId, image_file: imageToDelete })
                        });
                        console.log(recordToDeleteId)
                        if (!response.ok) throw new Error('Network response was not ok');
                        const result = await response.json();

                        if (result.success) {
                            showMessage(result.message);
                            confirmModal.hide();
                            fetchRecords(); // Refresh the table
                        } else {
                            showMessage('Error: ' + result.message);
                        }
                    } catch (error) {
                        console.error('Delete error:', error);
                        showMessage('An error occurred during deletion.');
                    }
                };
            }
        });

        // Initial fetch
        fetchRecords();