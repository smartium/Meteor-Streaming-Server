// https://github.com/illuspas/Node-Media-Server

import { Meteor } from 'meteor/meteor';

import '../lib/collections'

const NodeMediaServer = require('node-media-server');


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
  },

  'startServer'(str1url, str1key, str2url, str2key, str3url, str3key){
    const config1 = {
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
      }
    };

    const config2 = {
      rtmp: {
        port: 1936,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
      },
      http: {
        port: 8008,
        allow_origin: '*'
      },
      relay: {
        ffmpeg: '/usr/local/bin/ffmpeg',
        tasks: [
          {
            app: 'live',
            mode: 'static',
            edge: 'rtmp://localhost:1935/live/wtecpro',
            name: 'wtecpro'
          },
          {
            app: 'live2',
            mode: 'push',
            edge: `${str1url}/${str1key}`,
            appendName: false
          }
        ]
      }
    };

    const config3 = {
      rtmp: {
        port: 1937,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
      },
      http: {
        port: 8009,
        allow_origin: '*'
      },
      relay: {
        ffmpeg: '/usr/local/bin/ffmpeg',
        tasks: [
          {
            app: 'live3',
            mode: 'static',
            edge: 'rtmp://localhost:1935/live/wtecpro',
            name: 'wtecpro'
          },
          {
            app: 'live',
            mode: 'push',
            edge: `${str2url}/${str2key}`,
            appendName: false
          }
        ]
      }
    };

    var nms1 = new NodeMediaServer(config1)
    nms1.run();

    var nms2 = new NodeMediaServer(config2)
    nms2.run();

    var nms3 = new NodeMediaServer(config3)
    nms3.run();
  }
});
