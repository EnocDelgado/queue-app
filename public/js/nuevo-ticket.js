// HTML references
const lblNewTicket = document.querySelector('#lblNewTicket')
const btnCreate = document.querySelector('button')


const socket = io();

socket.on('connect', () => {
  
    btnCreate.disabled = false; // button able

});

socket.on('disconnect', () => {

    btnCreate.disabled = true; // button disabled
});

// Display last ticket
socket.on('last-ticket', ( last ) => {
    lblNewTicket.innerText = 'Ticket ' + last;
})


btnCreate.addEventListener( 'click', () => {
    
    socket.emit( 'next-ticket', null, ( ticket ) => {
        lblNewTicket.innerText = ticket;
    });
})