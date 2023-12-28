// dataTable
$(document).ready(function() {
    $('#example').DataTable();

});

// select all input in datatable
$(document).ready(function() {
    $(".selectAll").click(function() {
        $("table tr input:checkbox").prop('checked', $(this).prop('checked'));
    });

    $("table tr input:checkbox").change(function() {
        if (!$(this).prop("checked")) {
            $(".selectAll").prop("checked", false);
        }
    });
});
// show hide password
$(document).ready(function() {
    $('.toggle-password').click(function() {
        $(this).toggleClass("show-password");
        var input = $("#password");
        input.attr('type') === 'password' ? input.attr('type', 'text') : input.attr('type', 'password')
    });
});