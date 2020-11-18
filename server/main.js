// https://github.com/illuspas/Node-Media-Server

import { Meteor } from 'meteor/meteor';

import '../lib/collections'

const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  relay: {
  ffmpeg: '/usr/local/bin/ffmpeg',
  tasks: [
    {
      app: 'live',
      mode: 'push',
      edge: 'rtmp://a.rtmp.youtube.com/live2/',
      appendName: false
    },
    {
      app: 'live',
      mode: 'push',
      edge: 'rtmps://live-api-s.facebook.com:443/rtmp/',
      appendName: false
    },
    {
      app: 'live',
      mode: 'push',
      edge: 'rtmp://live-lis.twitch.tv/app/',
      appendName: false
    }
  ]
}
};

var nms = new NodeMediaServer(config)
nms.run();

theIP = new ReactiveVar();

Meteor.startup(() => {
  // var basicAuth = new HttpBasicAuth("smartium", "live");
  // basicAuth.protect();
});

Meteor.methods({
  'getServerIP'(){
    require('dns').lookup(require('os').hostname(), Meteor.bindEnvironment(function (err, add, fam) {
      theIP.set(add);
    }))

    return theIP.get();
  },

  'getStream'(id){
    return Streams.findOne(id);
  }
});
