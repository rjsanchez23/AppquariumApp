$(document).ready(function(){

    var validator =
    {
        email : function(mail)
        {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
        },
        password: function(password)
        {
            return /(?:^[\wÑñ]{2,}$)/.test(password);
        },
        name: function(name)
        {
            /^[a-z0-9_\-\s]{3,20}$/.test(name);
        },
        surname: function(surname)
        {
            /^[a-z0-9_\-\s]{3,30}$/.test(surname);
        }

    };


    $('a[href="#sendEmailModal"]').on('click', function(event){
        var target = event.currentTarget.closest('tr');
        var email = $(target).data('to');
        $('#sendEmail').data('to', email);
    });

    if($('#wysiwyg').length)
    {
        var ckeditor_user_message = CKEDITOR.replace('wysiwyg');
    }

    $("a.remove-user").on('click', function(event){
        event.preventDefault();
        var form = $(this).closest('td').find('form');
        form.submit();
    });

    $("#sendEmail").on('click', function(event){
        event.preventDefault();
        var message = CKEDITOR.instances['wysiwyg'].getData();
        var to = $(this).data('to');
        if(!validator.email(to)) notify_e( 'La dirección de correo es incorrecta' );
        bootbox.confirm("Estas seguro de que quieres enviar el siguiente correo a : " + to + " ?", function(result) {
            if(result && message.length > 10)
            {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: $('form[name="email-message"]').attr("action"),
                    dataType: 'json',
                    data: JSON.stringify({ 'message' : message, 'to' : to }),
                    success: function (data) {
                        if(data.success)
                        {
                            notify_s( data.success );
                            ckeditor_user_message.setData();
                        }
                        if(data.error) notify_e( data.error );
                    },
                    error: function (xhr, error) {
                        notify_e("No se ha podido enviar el correo, intentalo mas tarde");
                    }
                });
            } else
            {
                notify_e("Error", "Porfavor escriba un mensaje de al menos 10 caracteres");
            }
        });
        $.pnotify.defaults.history = false;
        $.pnotify.defaults.delay = 3000;

    });

    if($('#newsletter-wysiwyg').length)
    {
        var ckeditor_newsletter = CKEDITOR.replace('newsletter-wysiwyg');
    }

    $("#clean-newsletter").on('click',function(event){
        event.preventDefault();
        ckeditor_newsletter.setData();
    });

    $("#send-newsletter").on('click', function(event){
        event.preventDefault();
        var message = CKEDITOR.instances['newsletter-wysiwyg'].getData();
        bootbox.confirm("Estas seguro de que quieres enviar el siguiente correo a todos los usuarios subscritos ?", function(result) {
            if(result && message.length > 50)
            {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: $('form[name="newsletter-form"]').attr("action"),
                    dataType: 'json',
                    data: JSON.stringify({ 'message' : message }),
                    success: function (data) {
                        if(data.success) notify_s( data.success );
                        if(data.error) notify_e( data.error );
                    },
                    error: function (xhr, error) {
                        notify_e("No se ha podido enviar el correo, intentalo mas tarde");
                    }
                });
            } else
            {
                notify_e("Error", "Porfavor redacte una newsletter de al menos 50 caracteres");
            }
        });

        $.pnotify.defaults.history = false;
        $.pnotify.defaults.delay = 3000;

    });

    function notify_s(title, text) {
        $.pnotify({title: title, text: text, opacity: 1, type: 'success'});
    }
    function notify_e(title, text) {

        $.pnotify({title: title, text: text, opacity: 1, type: 'error'});
    }
});