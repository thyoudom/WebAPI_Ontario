$(document).ready(function () {
    // --- API Configuration ---
    const btnsubmit = document.getElementById('submitBtn')
    const API_URL = 'https://api.ontario.edu.kh/curriculum.php'; // **<-- CHANGE THIS TO YOUR ACTUAL API PATH**
    const quill_EN = new Quill('#description_EN_editor', {
        theme: 'snow'
    });
    const quill_KH = new Quill('#description_KH_editor', {
        theme: 'snow'
    });
    const table = $('#curriculumTable').DataTable({
        "processing": true,
        "serverSide": false, // Use client-side processing for this example
        "ajax": {
            "url": API_URL + '?action=read',
            "dataSrc": "data"
        },
        "columns": [
            {
                "data": "id", className: 'battambang-regular text-center',
                render: function (data, type, row, meta) {
                    return meta.row + 1; // Auto-incrementing value
                }
            },
            { "data": "title_En", className: 'battambang-regular' },
            { "data": "title_KH", className: 'battambang-regular' },
            {
                "data": "images", className: 'battambang-regular text-center',
                "render": function (data, type, row) {
                    if (data) {
                        return `<img src="https://api.ontario.edu.kh/${data}" alt="Banner Image" style="height: 50px; width:40px">`;
                    }
                    return '';
                }
            },
            {
                "data": "status", className: 'battambang-regular text-center', "render": function (data) {
                    return data == '1' ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-secondary">Inactive</span>';
                }
            },
            {
                "data": null, "defaultContent": `
                <button class="btn btn-sm btn-warning edit-btn"><i class="bi bi-pencil-square"></i> Edit</button>
                <button class="btn btn-sm btn-danger delete-btn"><i class="bi bi-trash3"></i> Delete</button>
            `}
        ]
    });

    // --- Modal Reset on New Button Click ---
    $('#addNewBtn').on('click', function () {
        $('#curriculumModalLabel').text('Create Curriculum');
        $('#action').val('create');
        $('#curriculumForm')[0].reset();
        $('#curriculum_id').val('');
        quill_EN.setContents([]); // Clear Quill editor
        quill_KH.setContents([]);
        $('#currentImageContainer').hide();
        $('#image_preview_img').attr('src', 'https://w7.pngwing.com/pngs/819/548/png-transparent-photo-image-landscape-icon-images-thumbnail.png')
        $('#images').prop('required', true); // Require image on create
        btnsubmit.disabled = false;
        btnsubmit.innerHTML = '<i class="bi bi-plus-circle-fill"></i> Submit Data';

    });

    // --- EDIT Button Click Handler ---
    $('#curriculumTable tbody').on('click', '.edit-btn', function () {
        const data = table.row($(this).parents('tr')).data();
        const curriculumId = data.id;
        btnsubmit.disabled = false;
        btnsubmit.innerHTML = '<i class="bi bi-pencil-square"></i> Update Data</span>';
        // Fetch single record data
        $.get(API_URL + '?action=get_single&id=' + curriculumId, function (response) {
            $('#curriculumModalLabel').text('Update Curriculum');
            $('#action').val('update');
            $('#curriculum_id').val(response.id);
            $('#title_En').val(response.title_En);
            $('#title_KH').val(response.title_KH);
            $('#status').val(response.status);
            $('#image_preview_img').attr('src', '${}')

            // Set Quill content
            quill_EN.root.innerHTML = response.description_EN;
            quill_KH.root.innerHTML = response.description_KH;

            // Handle image display and optional requirement
            $('#images').prop('required', false); // Not required for update
            if (response.images) {
                $('#image_preview_img').attr('src','https://api.ontario.edu.kh/'+response.images); // Assumes API returns full path
            } else {
            }

            // Show modal
            $('#curriculumModal').modal('show');
        }).fail(function () {
            alert('Failed to fetch data for editing.');
        });
    });

    // --- DELETE Button Click Handler ---
    $('#curriculumTable tbody').on('click', '.delete-btn', function () {
        const data = table.row($(this).parents('tr')).data();
        const curriculumId = data.id;
        const messagedelete = curriculumId ? 'Deleted':'';
        if (confirm('Are you sure you want to delete curriculum ID ' + curriculumId + '?')) {
            $.ajax({
                url: API_URL + '?action=delete&id=' + curriculumId,
                type: 'DELETE', // DELETE method is better REST practice
                success: function (response) {
                    toastr.success('Your data has ' + messagedelete, messagedelete +' Successful');
                    table.ajax.reload(); // Reload DataTables
                },
                error: function (xhr) {
                    alert('Error deleting curriculum: ' + xhr.responseJSON.message);
                }
            });
        }
    });

    // --- Form Submission (CREATE and UPDATE) ---
    $('#curriculumForm').on('submit', function (e) {
        e.preventDefault();
        const prid = $('#curriculum_id').val();
        const messageAction = prid ? 'Updated' : 'Created';
        const messageActionheader = prid ? 'Updated' : 'Created';

        btnsubmit.disabled = true;
        btnsubmit.innerHTML = '<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span><span role="status">Uploading...</span>';

        // 1. Get content from Quill Editors and set hidden inputs
        $('#description_EN_hidden').val(quill_EN.root.innerHTML);
        $('#description_KH_hidden').val(quill_KH.root.innerHTML);

        const formData = new FormData(this); // Use FormData for file uploads

        $.ajax({
            url: API_URL,
            type: 'POST',
            data: formData,
            contentType: false, // Required for FormData
            processData: false, // Required for FormData
            success: function (response) {
                toastr.success('Your data has ' + messageAction, messageActionheader +' Successful');
                $('#curriculumModal').modal('hide');
                table.ajax.reload(); // Reload DataTables
            },
            error: function (xhr) {
                alert('Error processing request: ' + (xhr.responseJSON ? xhr.responseJSON.message : xhr.responseText));
            }
        });
    });

});
function readURL() {
    const preview = document.getElementById('image_preview_img'); // An <img> tag for preview
    const file = document.querySelector('input[type=file]').files[0]; // The selected file
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // Convert file to base64 string and set as src
        preview.src = reader.result;
        preview.style.display = 'block';
    }, false);

    if (file) {
        reader.readAsDataURL(file); // Read the file as a data URL
    }
}
