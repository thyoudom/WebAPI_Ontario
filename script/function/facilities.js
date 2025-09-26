const btnsubmit = document.getElementById('saveBtn');
const create_by = document.getElementById('createby');
const create_date = document.getElementById('createdate');
const updat_date = document.getElementById('updatedate');
const Active = document.getElementById('ActiveClass');
const current_image_preview = document.getElementById('current_image_preview');
const loggedEmail = sessionStorage.getItem('loggedInUserEmail');
$(document).ready(function () {
    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow'
    });
    const btnsubmit = document.getElementById('saveBtn')
    // Initialize DataTables
    const dataTable = $('#bannerTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "https://api.ontario.edu.kh/FACILITIES.php?action=read", // API endpoint for reading data
            "type": "GET"
        },
        "columns": [
            {
                "data": "id", className: 'battambang-regular',
                render: function (data, type, row, meta) {
                    return meta.row + 1; // Auto-incrementing value
                }
            },
            { "data": "title", className: 'battambang-regular' },
            {
                "data": "description", className: 'battambang-regular',
                "render": function (data) {
                    // Display a truncated version of the description
                    return data.length > 50 ? data.substr(0, 50) + '...' : data;
                }
            },
            {
                "data": "image_file",
                "render": function (data, type, row) {
                    if (data) {
                        return `<img src="https://api.ontario.edu.kh/${data}" alt="Banner Image" style="height: 50px; width:40px">`;
                    }
                    return '';
                }
            },
            { "data": "status", className: 'battambang-regular' },
            { "data": "create_by", "visible": false },
            { "data": "create_date", "visible": false },
            { "data": "update_date", "visible": false },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${data.id}"><i class="bi bi-pencil-square"></i>Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${data.id}"><i class="bi bi-trash3"></i> Delete</button>
                    `;
                }
            }
        ]
    });

    // Reset modal form on hide
    $('#bannerModal').on('hidden.bs.modal', function () {
        $('#bannerForm')[0].reset();
        $('#banner_id').val('');
        quill.root.innerHTML = '';
        $('#bannerModalLabel').text('Add Banner');
        $('#saveBtn').text('Save changes');
        $('#current_image_preview').hide();
    });

    // Handle "Add New Banner" button click
    $('#addBannerBtn').on('click', function () {
        // Set current date/time for new record
        const now = new Date();
        const formattedDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        $('#create_date').val(formattedDate);
        $('#update_date').val(formattedDate);
    });

    // Handle form submission (Create/Update)
    $('#bannerForm').on('submit', function (e) {
        e.preventDefault();
        btnsubmit.disabled = true;
        btnsubmit.innerHTML = '<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span><span role="status">Loading...</span>';

        // Get content from Quill editor and set it to the hidden input
        $('#description').val(quill.root.innerHTML);

        const formData = new FormData(this);
        const bannerId = $('#banner_id').val();
        const action = bannerId ? 'update' : 'create';


        $.ajax({
            url: `https://api.ontario.edu.kh/FACILITIES.php?action=${action}`,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                Cleardata();
                $('#bannerModal').modal('hide');
                var table = $('#bannerTable').DataTable();
                table.ajax.reload(); // Reload the data table
            }, error: function (errormesage) {
                toastr.error('Error: ' + data.message)
            }

        });
    });

    // Handle "Edit" button click
    $(document).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        $.ajax({
            url: `https://api.ontario.edu.kh/FACILITIES.php?action=read&id=${id}`,
            type: 'GET',
            success: function (response) {
                const data = JSON.parse(JSON.stringify(response));
                const create_by = document.getElementById('createby');
                const create_date = document.getElementById('createdate');
                const updat_date = document.getElementById('updatedate');
                create_by.style.display = 'none';
                create_date.style.display = 'none';
                updat_date.style.display = 'none';
                $('#bannerModal').modal('show');
                if (data.status === 'success' && data.data.length > 0) {
                    const banner = data.data[0];
                    $('#banner_id').val(banner.id);
                    $('#title').val(banner.title);
                    quill.root.innerHTML = banner.description;
                    $('#status').val(banner.status);
                    $('#create_by').val(loggedEmail);
                    $('#create_date').val(banner.create_date);
                    $('#update_date').val(banner.update_date);

                    if (banner.image_file) {
                        $('#image_preview_img').attr('src', 'https://api.ontario.edu.kh/' + banner.image_file);
                        $('#current_image_preview').show();
                    } else {
                        $('#current_image_preview').hide();
                    }

                    $('#bannerModalLabel').text('Edit Banner');
                    $('#saveBtn').text('Update changes');
                    $('#bannerModal').modal('show');
                } else {
                    alert('Banner not found.');
                }
            }
        });
    });

    // Handle "Delete" button click
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm('Are you sure you want to delete this banner?')) {
            $.ajax({
                url: `https://api.ontario.edu.kh/FACILITIES.php?action=delete&id=${id}`,
                type: 'POST',
                success: function (result) {
                    var table = $('#bannerTable').DataTable();
                    table.ajax.reload(); // Reload the data table
                },
                error: function (errormessage) {
                    toastr.error("This Item is already exists in Database", "Service Response");
                }

            });
        }
    });


    $(document).on('click', '.status-toggle', function () {

    });
});
$('.update-status').on('click', function () {
    let $row = $(this).closest('tr');

    // Extract values from the cells within that row
    let name = $row.find('td:eq(1)').text(); // First td (index 0)
});
function Aprove(id, title) {
    const titleA = document.getElementById('title');
    titleA = title.val()
    var currentStatus = $(this).data('status');
    var newStatus = (currentStatus === 'Active') ? 'Inactive' : 'Active';
    alert(titleAs)
    $.ajax({
        url: `https://api.ontario.edu.kh/FACILITIES.php?action=update&id=${id}`, // This is your server-side script
        type: 'POST',
        data: { id: id, status: newStatus, },
        success: function (response) {
            if (response.success) {
                var table = $('#bannerTable').DataTable();
                table.ajax.reload(); // Reload the data table
            } else {
                var table = $('#bannerTable').DataTable();
                table.ajax.reload(); // Reload the data table
            }
        },
        error: function () {
            alert('An error occurred. Please try again.');
        }
    });
}
function Disable(id, title) {
    var currentStatus = $(this).data('status');
    var newStatus = (currentStatus === 'Inactive') ? 'Active' : 'Inactive';
    $.ajax({
        url: `https://api.ontario.edu.kh/FACILITIES.php?action=update&id=${id}`, // This is your server-side script
        type: 'POST',
        data: { id: id, status: newStatus, },
        success: function (response) {
            if (response.success) {
                var table = $('#bannerTable').DataTable();
                table.ajax.reload(); // Reload the data table
            } else {
                var table = $('#bannerTable').DataTable();
                table.ajax.reload(); // Reload the data table
            }
        },
        error: function () {
            alert('An error occurred. Please try again.');
        }
    });
}
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

function Cleardata() {
    var enable = "Enable";
    btnsubmit.disabled = false;
    create_by.style.display = 'none';
    create_date.style.display = 'none';
    updat_date.style.display = 'none';
    Active.style.display = 'none';
    current_image_preview.style.display = 'block'
    $('#id').val('');
    $('#title').val('');
    $('#description').val('');
    $('#status').val('Active');
    $('#create_by').val(loggedEmail);
    $('#create_date').val('');
    $('#update_date').val('');
    $('#image_preview_img').attr('src', 'https://w7.pngwing.com/pngs/819/548/png-transparent-photo-image-landscape-icon-images-thumbnail.png')
    $('#title').focus();
    // var action = '';
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.innerHTML = '<i class="bi bi-plus-circle-fill"></i> Create';
}
$(document).ready(function () {
    // Function to fetch data and display cards
    
});
