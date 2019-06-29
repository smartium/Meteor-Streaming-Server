import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../lib/collections'
import '../lib/routes';
import './main.html';
var flvjs = require('flv.js');

var streamName = new ReactiveVar();

// Reload._onMigrate(function() {
//   return [false];
// });

Template.body.onCreated(function bodyOnCreated() {
});

Template.livePlayer.onCreated(()=> {
  // stream = Streams.findOne(FlowRouter.getParam('_id')).name;

  // console.log();

  Meteor.call('getStream', FlowRouter.getParam('_id'), (err, res)=> {
    streamName.set(res.name);
    // streamName.set('eita');
  });


  Meteor.call('getServerIP', (err, ip)=> {
    if (err) {
      console.log('Deu erro no IP:');
      console.log(err);
    }
    else {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: `http://${ip}:8000/live/${streamName.get()}.flv`
          // url: `http://192.168.0.2:8000/live/${stream}.flv`
          // url: `ws://${ip}:8000/live/${streamName.get()}.flv`
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
      }
    }
  });
});

Template.body.helpers({
});

Template.body.events({
});

Template.home.helpers({
  epoch(){
    return 'stream' + new Date().valueOf();
  }
});

Template.home.events({
  'submit form'(e) {
    e.preventDefault();
    newStream = Streams.insert({
      owner: 'smartium',
      name: e.target.streamName.value,
      createdAt: new Date().valueOf()
    });
    FlowRouter.go(`/live/${newStream}`);
    // FlowRouter.go(`/live`);
  }
});

Template.livePlayer.helpers({
  stream(){
    return Streams.findOne(FlowRouter.getParam('_id')).name;
  }
});
