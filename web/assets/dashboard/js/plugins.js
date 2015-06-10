$(document).ready(function () {


    $("#tabs").tabs();
    $('.tabs').on("click", function () {

        $("#tabs").tabs("option", "active", $(this).data("index"));
        $('.tabs a').removeClass("active");
        $('a', this).addClass("active");

    });

    $(".scroll").mCustomScrollbar();
    $('#confirmModalParameter').on('click', function () {
        $('#fmultiselect').multiSelect('addOption', {
            value: $('#newParam').val(),
            text: $('#newParam').val(),
            index: 0
        });
    });
    $("#popup_newParameter").dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });


    $('#multiselect-addNew').click(function () {
        $("#popup_newParameter").dialog('open');


        return false;
    });

    var multiselect = $("#fmultiselect");

    if (multiselect.length > 0) {
        multiselect.multiSelect({
            selectableHeader: "<div class='multipleselect-header'>Parámetros</div>",
            selectionHeader: "<div class='multipleselect-header'>Parámetros seleccionados</div>"

        });
        $('#multiselect-selectAll').click(function () {
            multiselect.multiSelect('select_all');
            return false;
        });
        $('#multiselect-deselectAll').click(function () {
            multiselect.multiSelect('deselect_all');
            return false;
        });

    }
    if ($(".tags").length > 0)
        $(".tags").tagsInput({
            'width': '100%',
            'height': 'auto'
        });


    // File uploader
    if ($("#uploader_v5").length > 0) {
        var href = window.location.pathname;
        var aquarium = '/uploadImage/' + href.substr(href.lastIndexOf('/') + 1);

        var uploader = $("#uploader_v5").pluploadQueue({
            runtimes: 'html5',
            url: aquarium,
            max_file_size: '10mb',
            multiple_queues: true,
            unique_names: true,
            dragdrop: true,

            resize: {width: 705, height: 700, quality: 90},

            filters: [
                {title: "Image files", extensions: "jpg,gif,png"}
            ],
            init: {


                FileUploaded: function (up, file, info) {
                    // Called when file has finished uploading

                    console.log(info.response);
                    obj = JSON.parse(info.response);
                    var item = $('<div class="col-md-4 padding-bottom10" style="height: 250px;"></div>').appendTo($("#imageContainer"));
                    var image = $(new Image()).appendTo(item);
                    var input = $(' <input type="checkbox"  class="checkbox"/>').appendTo(item);


                    var preloader = new mOxie.Image();
                    var imgSrc = '/assets/dashboard/img/uploads/' + obj.name;
                    preloader.onload = function () {
                        input.prop("id", obj.id);
                        image.prop("src", imgSrc);
                        image.prop("style", "height: 100%");
                        image.prop("class", "col-md-12 img-thumbnail img-responsive center-block");
                    };
                    preloader.load(file.getSource());
                },

                Error: function (up, args) {
                    // Called when error occurs
                    console.log('[Error] ', args);
                }
            }
        });


    }

    $("form").validationEngine('attach', {promptPosition: "topLeft"});

    var wizard = $("#wizard");
    if (wizard.length > 0) {
        wizard.validationEngine('attach', {promptPosition: "topLeft"});
        wizard.stepy({
            backLabel: 'Atras',
            nextLabel: 'Siguiente',
            next: function () {

                if (!$("#wizard").validationEngine('validate')) {
                    return false
                }

                if (multiselect.val() != null) {

                    $('#paramWrapper').children('div').each(function (key, value) {

                        if ($.inArray($(value).attr('id').replace(/\s/g, ''), multiselect.val()) < 0) {
                            $(value).remove();
                        }
                    });
                    multiselect.val().forEach(function (parameter) {

                        if ($('#' + parameter.replace(/\s/g, '')).length <= 0) {
                            var copy = $("#paramTemplate").clone(true);
                            copy.attr('id', parameter.replace(/\s/g, ''));
                            copy.removeAttr('style');
                            copy.find('.attrName').html(parameter + ":");
                            copy.find('.attrMax').children('input').attr('name', parameter + "_max");
                            copy.find('.attrMin').children('input').attr('name', parameter + "_min");
                            $('#paramWrapper').append(copy);
                        }


                    });
                }else{
                    $('#paramWrapper').html("");
                }

            }
        });

    }
    $(".onlyNumbers").on("keypress", function (evt) {

        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57));
    });

    $("#btnMeasureModal").on("click", function (evt) {
        $(".spinnerContainer").show();
        var jsonStr = JSON.stringify($("#paramsMeasures").serializeArray());
        $('#fModal').modal('hide');
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: $("#paramsMeasures").attr("action"),
            dataType: 'json',
            data: jsonStr,
            success: function (data) {
                console.log(data);
                data.forEach(function (parameter) {

                    var icon = checkParams(parameter);

                    var parsedDate = new Date(parseInt(parameter.max_date) * 1000);
                    if ( isNaN( parsedDate.getTime() ) ) {
                        parsedDate = new Date();
                    }

                    parsedDate = parsedDate.getDate() + '/' + (parsedDate.getMonth() + 1) + '/' + parsedDate.getFullYear();
                    var paramElement = $("#parameter_" + parameter.value_range_id);
                    paramElement.find(".date").html(parsedDate);
                    paramElement.find(".value").html(parameter.value);
                    paramElement.find(".centered").attr('class', icon);
                    paramElement.find(".solution").data('content', '<a href="">Ver solucíón</a>');

                });
                $(".spinnerContainer").hide();
            },
            error: function (xhr, error) {
                console.log(xhr.responseText);
                notify_e('Error', 'No ha sido posible guardar las mediciones');
            }
        });
        evt.preventDefault();
    });


    // Scroll up plugin
    $.scrollUp({scrollText: '^'});
    // eof scroll up plugin

    $.datepicker.regional['es'] = {
        closeText: "Cerrar",
        prevText: '<Ant',
        nextText: 'Sig>',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
    $('#dateParam').datepicker({maxDate: '0'});

    $("#deleteImages").on("click", function () {

        var arrayCheckbox = [];
        var checkbox = $("#imageContainer").find('input:checked');
        checkbox.each(function (key, value) {
            arrayCheckbox.push(value.id);
            $("#" + value.id).parent().remove();
        });
        var jsonStr = JSON.stringify(arrayCheckbox);
        console.log(jsonStr);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: '/deleteImages',
            dataType: 'json',
            data: jsonStr,
            error: function (xhr) {
                console.debug(xhr.responseText);
            }
        });

    });

    $(".aquariumRemove").on("click", function (evt) {


        evt.preventDefault();

        var url = $("#RemoveAquariumModal form").attr("action", $(this).attr("href"));
        $('#RemoveAquariumModal').modal('show');


    });


    $("#aquariumDeleteBtn").on("click", function () {
        $(".spinnerContainer").show();
        $.ajax({
            type: "POST",
            url: $(this).closest("form").attr("action"),
            dataType: 'json',
            success: function (data) {
                $(".spinnerContainer").hide();
                $("#tabs").tabs("option", "active", 0);

                $("#tabs-" + data.result).remove();
                $("#tab-li-" + data.result).parent().remove();
                notify_s('El acuario ha sido eliminado');

            },
            error: function (xhr, error) {
                notify_e('El acuario no se ha elimnado');
            }
        });
    });

    $.pnotify.defaults.history = false;
    $.pnotify.defaults.delay = 5000;
    $('[data-toggle="popover"]').popover({html:true, container:'body'});



});


$('#imgInput').on('change', readProfilePicture);
$('#fos_user_profile_form_image').on('change', readProfilePicture);
$('#imgbutton').on('click', openBrowser);



function readProfilePicture() {

    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) return;

    if (/^image/.test( files[0].type))
    {
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onloadend = function()
        {
            $("#avatar-preview").attr('src', this.result);
        }
    }else{
        alert("Error: Extensión de archivo inválida");
    }
}



function openBrowser(evt) {

    $('#imgInput').trigger("click");
    evt.preventDefault();
}


$(".listDeleteButton").on("click", function (evt) {

    var url = $(this).data("path");
    $("#deleteModal form").attr("action", url);
});

$("#btnDeleteInhabitant").on("click", function (evt) {
    $("#deleteModal").modal("hide");


    $.ajax({
        type: "POST",
        url: $("#deleteModal form").attr("action"),
        success: function (data) {
            $("#" + data.alias + "_" + data.id).remove();

            notify_s("Eliminado correctamente!", "El habitante " + data.alias + " ya no pertenece al acuario");
        },
        error: function (xhr, error) {
            console.debug(xhr.responseText);
            notify_e("Error al borrar habitante", " ");
        }
    });
    evt.preventDefault();


});

$(".accessoryDeleteBtn").on("click", function (evt) {

    var url = $(this).data("path");
    $("#accessoryDeleteModal form").attr("action", url);
});

$("#deleteAccessory").on("submit", function (evt) {
    $("#accessoryDeleteModal").modal("hide");
    $(".spinnerContainer").show();

    console.log($("#accessoryDeleteModal form").attr("action"));

   $.ajax({
        type: "POST",
        url: $("#accessoryDeleteModal form").attr("action"),
        success: function (data) {
            console.log(data);
             $("#row_" + data.id).remove();
            $(".spinnerContainer").hide();
            notify_s("Eliminado correctamente!");
        },
        error: function (xhr, error) {
            console.debug(xhr.responseText);
            $(".spinnerContainer").hide();
            notify_e("Error al borrar habitante", " ");
        }
    });
    evt.preventDefault();


});


$('#newBlogPostModal').on('shown.bs.modal', function () {

    var url = $(this).data("path");
    $('#btnNewBlogPost').data("path", url);
    if ($("#wysiwyg").length > 0) {
        editor = $("#wysiwyg").cleditor({width: "100%", height: "100%"})[0].focus();
        editor.refresh();

    }

});

$('#btnNewBlogPost').on('click', function (evt) {
    $(".spinnerContainer").show();
    var comment = $($(".cleditorMain iframe")[0].contentWindow.document).find("body").html();
    editor.clear();
    evt.preventDefault();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: $("#newBlogPost").attr("action"),
        dataType: 'json',
        data: JSON.stringify({"comment": comment}),
        success: function (data) {
            console.log(data);
            var cloneTemplate = $("#logTemplate").clone();
            cloneTemplate.removeAttr("id");
            cloneTemplate.removeClass("hide");
            var date = new Date(parseInt(data.date) * 1000);
            var options = {"weekday": "long", "year": "numeric", "month": "long", "day": "numeric"};
            parsedDate = date.toLocaleDateString("en-US", options);
            cloneTemplate.children(".logDate").html(parsedDate);
            cloneTemplate.children(".logComment").html(data.comment);
            cloneTemplate.find(".removeLogPost").attr("href", "/inhabitant/blog/delete/"+data.id);
            $("#logTemplate").parent().prepend(cloneTemplate);
            $(".spinnerContainer").hide();
            notify_s("El diario ha sido actualizado con éxito");
        },
        error: function (xhr, error) {
            console.debug(xhr.responseText);
            notify_e("No se pudo actualizar el diario");
        }
    });
});


$('.news').on('click',".removeLogPost", function (evt) {
    $(".spinnerContainer").show();
    var toDelete = $(this);
    console.log($(this).attr("href"));
    $.ajax({
        type: "POST",
        url: $(this).attr("href"),
        dataType: 'json',
        success: function (data) {
            toDelete.closest(".item").remove();
            $(".spinnerContainer").hide();
            notify_s("El post ha sido eliminado con éxito");
        },
        error: function (xhr, error) {
            console.debug(xhr.responseText);
            notify_e("No se pudo eliminar el post");
        }
    });
    return false;

});


$('#paramSelector, #periodSelector').on('change', function (evt) {
    $(".spinnerContainer").show();
    var paramId = $('#paramSelector').val();
    var periodId = $('#periodSelector').val();


    var paramPeriodObject = JSON.stringify({"paramId": paramId, "periodId": periodId});



    $.ajax({
        type: "POST",
        url: "/aquarium/statistics",
        dataType: "json",
        data: paramPeriodObject,
        success: function (data) {

            console.log(data);
            var date = [];
            var number = [];

            jQuery.each(data, function (key, val) {
                date.push(val.date);
                number.push(val.value);
            });
            $(".spinnerContainer").hide();
            lineChart.destroy();

            var lineChartData = {
                labels: date,
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0.5)",
                        strokeColor : "rgba(151,187,205,1)",
                        pointColor : "rgba(151,187,205,1)",
                        pointStrokeColor : "#fff",
                        data: number
                    }
                ]
            };
            var opts = {
                bezierCurveTension : 0,
                responsive: true

            };

            lineChart = $("#lineChart");

            var lctx = lineChart.get(0).getContext("2d");
            lineChart = new Chart(lctx).Line(lineChartData, opts);


        },
        error: function (xhr, error) {
            console.debug(xhr.responseText);
        }

    });


});


function checkParams(parameter) {

    var paramValue = parseFloat(parameter.value);
    var paramMaxValue = parseFloat(parameter.max_value);
    var paramMinValue = parseFloat(parameter.min_value);
    if (parameter.value != null) {
        if ((paramValue >= paramMinValue) && (paramValue <= paramMaxValue)) {
            notify_s(parameter.name + ' correcto', 'El nivel de ' + parameter.name + ' está correcto');
            return "glyphicon glyphicon-thumbs-up centered green";
        } else if (paramValue < paramMinValue) {
            notify_e('¡Cuidado!', 'El nivel de ' + parameter.name + ' está demasiado bajo');

        } else {
            notify_e('¡Cuidado!', 'El nivel de ' + parameter.name + ' está demasiado alto');

        }

    }
    return "glyphicon glyphicon-thumbs-down centered red";

}


function notify(title, text) {
    $.pnotify({title: title, text: text, opacity: 1, addclass: 'palert'});
}

function notify_s(title, text) {
    $.pnotify({title: title, text: text, opacity: 1, type: 'success'});
}

function notify_i(title, text) {
    $.pnotify({title: title, text: text, opacity: 1, type: 'info'});
}

function notify_e(title, text) {

    $.pnotify({title: title, text: text, opacity: 1, type: 'error'});
}