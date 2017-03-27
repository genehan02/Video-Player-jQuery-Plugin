# Video Player. A jQuery Plugin

Simple video player

## How to Use
```javascript
  $(document).ready(function(){
    var video = $(".vpp-container").videoPlayerPlugin({
      videoSources: {
        "video/mp4": "videos/big_buck_bunny.mp4",
        "video/webm": "videos/big_buck_bunny.webm",
        "video/ogg": "videos/big_buck_bunny.ogv"
      },
      autoPlay: true // default is false
    });
  });
```

