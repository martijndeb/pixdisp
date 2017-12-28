A small application to drive LED matrix dusplays, such as the pimoroni unicorn, from nodejs. Intends to become a digital graffiti/guestbook system.

Make sure you are on a recent nodejs version. Raspbian has old version. Use nodesource ;).

copy config.example.json to config.json and pick a driver + display size.

npm install

nodejs pixdisp.js

http://localhost:8080/

Matrix driver & Unicorn Hat HD driver inspired by https://github.com/vesteraas/node-unicornhathd

### Webinterface
![Web interface](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/webui.png "Webinterface")
A simple web interface is included for drawing on the device. Defaults to port 8080.

### Drawing
![Device drawing](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/device.jpg "Drawing on the device")
Simple clicking on the canvas in the responsive webinterface makes things light up.

### Camera
![Using your camera](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/camera.jpg "Using your camera")
The webinterface allows you to capture your camera and submit images from there.