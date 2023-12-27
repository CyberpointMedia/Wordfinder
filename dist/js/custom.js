$(document).ready(function() {
    $('#example').DataTable();

});


$('.selectAll').click(function(e) {
    var table = $(e.target).closest('table');
    $('tr input:checkbox', table).prop('checked', this.checked);
});