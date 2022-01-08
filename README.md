# PNGTuber Magic
A very scuffed PNGTuber avatar animator that reacts to sound. Outputs your avatar on a greenscreen or a bluescreen for you to capture and chroma key out in 
your streaming/recording software of choice!

## Get started
Just download the code and then open `index.html` in your browser. Add your avatar's images to the `src` directory for easier access, though any location will work.
If you have the two animation frames (mouth closed and mouth open) saved in the `src` directory, you can input 
`./nameOfMouthClosedImage.png` and `./nameOfMouthOpenImage.png` to the respective fields. In other cases, just copy the full path to the images.
Then accept the usage of your microphone if the browser asks and hit start!

## Settings

### Background color
Pick between a greenscreen or a bluescreen to use as the background for keying out the avatar.

### Speech threshold
How loud the incoming voice has to be in order for the app to register it as speech.

### Volume check interval
How often the app measures the volume, in milliseconds.

### Dark mode
This is on by default but if you want light mode, you can uncheck this.

Remember to save the settings for them to take effect! It is also best to stop the audio input when changing settings and if you change the interval or threshold, 
reloading the page might be necessary.

## Bugs?
Oh there will be bugs. If you find a bug feel free to open an issue detailing it and if you have a fix ready to go, feel free to open a pull request. 
Beware, the code is messy.

## Features?
While I can't guarantee that I will be continuing developing this much further, you never know! Open a feature request with what you wish to see and 
I'll try to get to it! Alternatively, you can just code the feature and submit a pull request, or open a pull request on any open feature requests.
