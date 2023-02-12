// HTML References
const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')

// To know if exists a desk
const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('desk') ) {
    window.location = 'index.html';
    throw new Error('Desk is required')
}

// To know in what desk I am

const desk = searchParams.get('desk')
lblDesk.innerText = desk;

divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
  
    btnAttend.disabled = false; // button able

});

socket.on('disconnect', () => {

    btnAttend.disabled = true; // button disabled
});

// Display last ticket
socket.on('pending-tickets', ( pending ) => {

    if ( pending === 0 ) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pending;
    }
})


btnAttend.addEventListener( 'click', () => {
    
    socket.emit( 'ticket-attend', { desk }, ({ ok, ticket, msg }) => {
        if ( !ok ) {
            lblTicket.innerText = ' Nobody'
            return divAlert.style.display = '';
        }

        lblTicket.innerText = ' Ticket ' + ticket.number;
    })
    // socket.emit( 'next-ticket', null, ( ticket ) => {
    //     lblDesk.innerText = ticket;
    // });
})