var rp = require('request-promise');
var cheerio = require('cheerio');
var Horseman = require('node-horseman');
var horseman = new Horseman();

var folsomURL = function(){
  return 'http://1015.com/calendar/';
}

var options = {
    uri: folsomURL(),
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        // Process html like you would with jQuery...
        var events = $('div.single-event');

        for (var i = 0; i < events.length; i++) {
          var eventInfo = $(events[i]).find('span.truncate').text();
          // some events are sold out
          var ticketButton = $(events[i]).find('a.buytickets');
          link = ticketButton.attr('href');
          (function findPrice(eventInfo){
            var horseman = new Horseman();
            horseman
              .open(link)
              .text('tr.ticket_row .ticket_type_name')
              .then(function(price){
                console.log("Event Info: ", eventInfo);
                price = price || 'Sold Out';
                console.log(" Price: ", price);
                horseman.close();
              })
              .catch(function (err) {
                console.log("Event Info: ", eventInfo)
                console.log("Possibly Sold Out");
              })
          })(eventInfo);
        };

    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    });


//   users.forEach( function( user ){
//   var horseman = new Horseman();
//   horseman
//     .open('http://mobile.twitter.com/' + user)
//     .text('.UserProfileHeader-stat--followers .UserProfileHeader-statCount')
//     .then(function(text){
//     console.log( user + ': ' + text );
//       horseman.close();
//     });
// });


// ticketButtons.forEach( function( ticketButton ){
//   var horseman = new Horseman();
//   horseman
//     .open(folsomURL())
//     .text(ticketButton)
//     .log()
//     .then(function(text){
//     console.log( text );
//       horseman.close();
//     });
// });