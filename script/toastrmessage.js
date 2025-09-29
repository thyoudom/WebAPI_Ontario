
function showToast(type) {
    const title = 'Action Complete';
    let message = '';

    switch (type) {
        case 'success':
            message = 'The operation was completed successfully.';
            toastr.success(message, title);
            break;
        case 'info':
            message = 'A new setting has been applied.';
            toastr.info(message, title);
            break;
        case 'warning':
            message = 'Data submission may contain errors.';
            toastr.warning(message, title);
            break;
        case 'error':
            message = 'An unexpected server error occurred.';
            toastr.error(message, title);
            break;
        default:
            toastr.info('Default toast message.');
    }
}
// Global Toastr Configuration
toastr.options = {
    "closeButton": true,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "timeOut": "5000",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
