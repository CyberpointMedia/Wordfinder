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

$(document).ready(function() {
    // show hide password
    $('.toggle-password').click(function() {
        $(this).toggleClass("show-password");
        var input = $("#password");
        input.attr('type') === 'password' ? input.attr('type', 'text') : input.attr('type', 'password')
    });

    // generate user password:
    $("#generate-pw").click(function() {
        $(this).next("#show-generate-pw").removeClass("hidden");
    });
    $("#cancelBtn").click(function() {
        $(this).parent("#show-generate-pw").addClass("hidden");
        $(".toggle-password").removeClass("show-password");
    });

    //page settings on add new page start 
    $("#pageSettings").click(function() {
        $("#settingSidebar").toggleClass("show");
    });
    $("#closeSetting").click(function() {
        $("#settingSidebar").removeClass("show");
    });

    //page settings on add new page end 
});

// add profile picture
var loadFile = function(event) {

    var input = event.target;
    var file = input.files[0];
    var type = file.type;

    var output = document.getElementById('preview_img');


    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};



// add title on add new page 
jQuery(function($) {
    $("#title").focusout(function() {
        var element = $(this);
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
    });
});

$("#title").keypress(function(event) {
    // if (event.which === 13) {
    //     performSearch();
    // }
    // alert("hello");
    $("#top-bttns").children("button").removeClass("cursor-not-allowed");
    $("#top-bttns").children("button").removeClass("opacity-25");
});