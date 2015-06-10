/* CALENDAR */



var events = [];
eventsjs.forEach(function(entry) {
   
    events.push(
        {
            title: entry.title,
            start: new Date(entry.date*1000),
            id: entry.id

        }
    );
});



var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

var calendar = $('#calendar').fullCalendar({
    lang: 'es',
    monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
    header: {
        left: 'prev,next',
        center: 'title',
        right: ''

    },
    selectable: true,
    selectHelper: true,
    select: function(start, end, allDay) {
        var title = prompt('Nuevo Aviso:');
        if (title) {
            storeEvent({title: title, start: start, date : start.unix() })

        }
        calendar.fullCalendar('unselect');
    },
    eventClick: function(calEvent, jsEvent, view) {

        var r = confirm("¿Está seguro de que desea eliminar el recordatorio?");
        if (r == true) {
            $('#calendar').fullCalendar('removeEvents', calEvent._id);
            deleteEvent(calEvent)
        }
    },
    eventDrop: function(event) {


        deleteEvent(event);
        storeEvent({title:event.title, start:event.start, date:event.start.unix(),id: event.id});


    },
    editable: true,
    events: events
});

function storeEvent( event){
    console.log(event);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url:"/aquarium/calendar/events/"+aquarium,
        dataType: 'json',
        data: JSON.stringify(event),
        success: function (data) {


            if(typeof event.id === 'undefined') {
                event.id = data.id;

                $('#calendar').fullCalendar('renderEvent', event, true);
            }

        },
        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function deleteEvent(event){

    $.ajax({
        type: "POST",
        url:"/aquarium/calendar/remove/"+event.id,
        dataType: 'json',
        success: function (data) {

        },
        error: function (xhr, error) {
            console.log(xhr.responseText);
        }
    });
}
