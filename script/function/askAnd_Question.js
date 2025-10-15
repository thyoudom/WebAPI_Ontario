$(document).ready(function() {
    // --- Configuration ---
    const API_URL = 'https://api.ontario.edu.kh/API/askAndQuestion/askAndQuestion_CRUD.php'; // The path to your PHP API file
    const IMAGE_BASE_URL = 'Images/'; // The path to your image upload folder
    let dataTable;
    let quillEN, quillKH;

    // --- 1. Quill Editor Setup ---
    quillEN = new Quill('#description_EN_editor', { theme: 'snow' });
    quillKH = new Quill('#description_KH_editor', { theme: 'snow' });

    // Sync Quill content to hidden textarea before form submission
    $('#crudForm').on('submit', function() {
        $('#description_EN_input').val(quillEN.root.innerHTML);
        $('#description_KH_input').val(quillKH.root.innerHTML);
    });

    // --- 2. DataTables Initialization (Read) ---
    dataTable = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": false, // Use client-side for simplicity, or true for large datasets
        "ajax": {
            "url": API_URL + '?action=read',
            "type": "GET",
            "dataSrc": "data"
        },
        "columns": [
            { "data": "id", className: 'battambang-regular text-center',
                render: function (data, type, row, meta) {
                    return meta.row + 1; // Auto-incrementing value
                }
            },
            { "data": "desc_en_short", "render": function(data, type, row) {
                // Display the short description
                return data + '...';
            }},
            { "data": "status" },
            { 
                "data": "images",
                "render": function(data, type, row) {
                    if (data) {
                        return '<img src="' + IMAGE_BASE_URL + data + '" alt="Image" style="width:50px;height:50px;object-fit:cover;">';
                    }
                    return 'No Image';
                }
            },
            { "data": "create_by" },
            { 
                "data": "id",
                "render": function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info edit-btn" data-id="${data}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${data}">Delete</button>
                    `;
                }
            }
        ]
    });

    // --- 3. CRUD: Create/Update (Form Submission) ---
    $('#crudForm').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const action = $('#action').val();
        
        $.ajax({
            url: API_URL,
            type: 'POST',
            data: new FormData(this),
            processData: false, // required for FormData
            contentType: false, // required for FormData
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    alert(response.message);
                    $('#crudModal').modal('hide');
                    dataTable.ajax.reload(); // Reload the table data
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('An error occurred while communicating with the server.');
            }
        });
    });

    // --- 4. CRUD: Get Single Record (Edit Button Click) ---
    $('#dataTable').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        
        // Reset form and set to update mode
        $('#crudModalLabel').text('Edit Record');
        $('#action').val('update');
        $('#dataId').val(id);
        $('#submitBtn').text('Save Changes');
        $('#images').prop('required', false); // Image is optional on update

        $.get(API_URL, { action: 'get_single', id: id }, function(response) {
            if (response.status === 'success') {
                const data = response.data;
                
                // Set Quill content
                quillEN.root.innerHTML = data.description_EN;
                quillKH.root.innerHTML = data.description_KH;

                // Set other fields
                $('#status').val(data.status);
                $('#currentImage').val(data.images);

                // Show image preview
                if (data.images) {
                    $('#imagePreview').html('<img src="' + IMAGE_BASE_URL + data.images + '" alt="Current Image" style="width:100px; height:auto;">');
                } else {
                    $('#imagePreview').html('No current image.');
                }

                $('#crudModal').modal('show');
            } else {
                alert('Could not fetch data: ' + response.message);
            }
        }, 'json');
    });

    // --- 5. CRUD: Delete Record (Delete Button Click) ---
    $('#dataTable').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        if (confirm('Are you sure you want to delete this record and its image?')) {
            $.post(API_URL, { action: 'delete', id: id }, function(response) {
                if (response.status === 'success') {
                    alert(response.message);
                    dataTable.ajax.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            }, 'json').fail(function() {
                alert('An error occurred during deletion.');
            });
        }
    });

    // --- 6. Modal Reset on 'Add New' Click or Modal Hide ---
    $('#addNewBtn').on('click', function() {
        $('#crudModalLabel').text('Create New Record');
        $('#action').val('create');
        $('#dataId').val('');
        $('#currentImage').val('');
        $('#submitBtn').text('Save Record');
        $('#images').prop('required', true); // Image required on create

        // Reset Quill editors
        quillEN.setContents([]);
        quillKH.setContents([]);

        // Reset form fields
        $('#crudForm')[0].reset();
        $('#imagePreview').html('');
    });

    // Reset on modal close
    $('#crudModal').on('hidden.bs.modal', function () {
        $('#crudForm')[0].reset();
        $('#imagePreview').html('');
    });

});