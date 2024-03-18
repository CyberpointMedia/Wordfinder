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
var loadFile2 = function(event) {

    var input = event.target;
    var file = input.files[0];
    var type = file.type;

    var output = document.getElementById('preview_img2');


    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};
// add another image upload
var loadFile2 = function(event) {
    var input = event.target;
    var file = input.files[0];
    var type = file.type;
    var output = document.getElementById('feature_img');
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

    // sidebar toggled
    $('#button-toggle-menu').click(function() {
        // Get the current value of the data-sidenav-view attribute
        var currentValue = $('html').attr('data-sidenav-view');

        // Toggle the value
        if (currentValue === 'default') {
            $('html').attr('data-sidenav-view', 'condensed');
        } else {
            $('html').attr('data-sidenav-view', 'default');
        }
    });

    if ($(window).width() <= 1024) {
        $('#button-toggle-menu2').click(function() {
            var currentValue2 = $('html').attr('data-sidenav-view');
            // Toggle the value
            if (currentValue2 === 'mobile') {
                $('html').attr('data-sidenav-view', 'default');
            } else {
                $('html').attr('data-sidenav-view', 'mobile');
            }
        });
    }
});

$("#title").keypress(function(event) {
    // if (event.which === 13) {
    //     performSearch();
    // }
    // alert("hello");
    $("#top-bttns").children("button").removeClass("cursor-not-allowed");
    $("#top-bttns").children("button").removeClass("opacity-25");
});
$("#page_name").keypress(function(event) {
    // if (event.which === 13) {
    //     performSearch();
    // }
    // alert("hello");
    $("#top-bttns").children("button").removeClass("cursor-not-allowed");
    $("#top-bttns").children("button").removeClass("opacity-25");
});


// featured image set in add new page start
const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Set featured image";
pictureImage.innerHTML = pictureImageTxt;

inputFile.addEventListener("change", function(e) {
    const inputTarget = e.target;
    const file = inputTarget.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function(e) {
            const readerTarget = e.target;

            const img = document.createElement("img");
            img.src = readerTarget.result;
            img.classList.add("picture__img");

            pictureImage.innerHTML = "";
            pictureImage.appendChild(img);
        });

        reader.readAsDataURL(file);
    } else {
        pictureImage.innerHTML = pictureImageTxt;
    }
});
// featured image set in add new page end

// datetimepicker calendar start 
flatpickr("#datetimePicker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    onClose: function(selectedDates, dateStr, instance) {
        // Close the calendar after selecting a date
        instance.close("#datetimePicker");
    },
    onChange: function(selectedDates, dateStr, instance) {
        // Update the text of the button with the chosen date
        document.getElementById("datetimePicker").innerText = dateStr;
    },
});
// datetimepicker calendar end


// selected sections shows in another div
$(document).ready(function() {
    // Initialize Select2 with additional options for searching
    $('#mySelect').select2({
        placeholder: "Search sections...",
        width: '100%',
        tags: true, // Allow adding custom tags
        tokenSeparators: [',', ' '] // Allow multiple tags to be entered separated by commas or spaces
    });

    // Set default value(s)
    var defaultValues = ['option2', 'option3'];
    $('#mySelect').val(defaultValues).trigger('change');

    // Update displayed values as a list when the selection changes
    $('#mySelect').on('change', function() {
        var selectedValues = $(this).val();
        var $selectedValuesList = $('#selectedValuesList');

        // Clear previous list items
        $selectedValuesList.empty();

        // Append new list items for selected values
        if (selectedValues && selectedValues.length > 0) {
            selectedValues.forEach(function(value) {
                $('<li>').text(value).appendTo($selectedValuesList);
            });
        } else {
            $('<li>').text('None').appendTo($selectedValuesList);
        }
    });

});