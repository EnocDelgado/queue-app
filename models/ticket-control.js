const path = require('path');
const fs = require('fs');


class Ticket {
    constructor( number, desk ){
        this.number = number;
        this.desk = desk;
    }
}

class TicketControl {

    constructor() {
        this.last = 0;
        // this is to know if we have the same date in database
        this.today = new Date().getDate();
        // handle tickets
        this.tickets = [];
        this.last4th = [];

        this.init();
    }

    // when invoke toJson we create this object
    get toJson() {
        return {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            last4th: this.last4th
        }
    }

    // initialize our server
    init() {
        // convert to JSON object JS
        const { last, today, tickets, last4th } = require('../db/data.json');
        // Verify if exist an ticket
        if ( today === this.today ) {
            this.tickets    = tickets;
            this.last       = last;
            this.last4th    = last4th;
        } else {
            // is other day
            this.saveDB();
        }
    }

    // save our tickets
    saveDB() {

        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );
    }

    // next Turn
    next() {
        // generate a new number 
        this.last += 1;
        // add the list
        const ticket = new Ticket( this.last, null );
        this.tickets.push( ticket );

        this.saveDB();

        return 'Ticket: ' + ticket.number;
    }

    attenderTicket( desk ) {
        // validate if exists any ticket
        if ( this.tickets.length === 0 ) {
            return null;            
        } 
        // remove and return the first ticket
        const ticket = this.tickets.shift(); // this.tickets[0]
        ticket.desk = desk;

        // add a new ticket to the beginning 
        this.last4th.unshift( ticket );

        // Verify that last4th are 4
        if ( this.last4th.length > 4 ) {
            // go last arrat position and revome it
            this.last4th.splice(-1,1)
        }

        this.saveDB();

        return ticket;
    }
}


module.exports = TicketControl;