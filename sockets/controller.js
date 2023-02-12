const { Socket } = require('socket.io');
const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();


const socketCotroller = ( socket ) => {
    
    // display last ticket when reload page and a client is connected
    socket.emit( 'last-ticket', ticketControl.last );
    socket.emit( 'current-status', ticketControl.last4th );
    socket.emit( 'pending-tickets', ticketControl.tickets.length);

    // Send information to server
    socket.on( 'next-ticket', ( payload, callback ) => {

        const next = ticketControl.next();
        callback( next );
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length);
    })

    // listen desk event
    socket.on( 'ticket-attend', ( { desk }, callback ) => {
        // verify if exist a desk
        if ( !desk ) {
            return callback({
                ok: false,
                msg: 'Desk is required'
            })
        }

        const ticket = ticketControl.attenderTicket( desk );

        // emit tickets
        socket.broadcast.emit( 'current-status', ticketControl.last4th );
        socket.emit( 'pending-tickets', ticketControl.tickets.length)
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length)


        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'There not pending tickets'
            })
        } else {
            callback({
                ok: true,
                ticket
        })
        }
    })
}


module.exports = {
    socketCotroller
}