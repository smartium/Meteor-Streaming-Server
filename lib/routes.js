FlowRouter.route( '/', {
  action: function() {
    BlazeLayout.render( 'applicationLayout', { main: 'home' } );
  },
  name: 'Home'
});

FlowRouter.route( '/live/:_id', {
  action: function(params) {
    BlazeLayout.render( 'applicationLayout', { main: 'livePlayer' } );
  },
  name: 'Live'
});


// FlowRouter.route( '/live', {
//   action: function(params) {
//     BlazeLayout.render( 'applicationLayout', { main: 'livePlayer' } );
//   },
//   name: 'Live'
// });
