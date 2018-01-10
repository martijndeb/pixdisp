[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Known Vulnerabilities](https://snyk.io/test/github/sexybiggetje/pixdisp/badge.svg?targetFile=package.json)](https://snyk.io/test/github/sexybiggetje/pixdisp?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/7178fe123a6aed4cd277/maintainability)](https://codeclimate.com/github/sexybiggetje/pixdisp/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7178fe123a6aed4cd277/test_coverage)](https://codeclimate.com/github/sexybiggetje/pixdisp/test_coverage)
[![Build Status](https://travis-ci.org/sexybiggetje/pixdisp.svg?branch=master)](https://travis-ci.org/sexybiggetje/pixdisp)

A small application to drive LED matrix displays, such as the [Pimoroni Unicorn](https://shop.pimoroni.com/?q=unicorn%20hat), from nodejs. My intention is to create a digital graffiti/guestbook system and a general animation system. This is a project for fun, so if you have a feature just request it! Or add it and I'll review it. Social coding ftw.

Make sure you are on a recent nodejs version. Raspbian has an old version. Use [Nodesource](https://github.com/nodesource/distributions) ;).

Also, use a decent modern browser. I wrote recent syntax, so probably works best in Chrome 62+. Firefox is known to have some issues, Edge works, Safari is a PITA. Just wait for your browser to play catch up then with recent standards. If you dislike Chrome, you can put this trough Babel. But you're on your own there.

Copy config.example.json to config.json and pick a driver + display size.

execute:

    npm install
    nodejs pixdisp.js

Navigate to http://localhost:8080/

Matrix driver & Unicorn Hat HD driver inspired by https://github.com/vesteraas/node-unicornhathd

### Unit tests
This application has some unit tests, making use of [Jest](http://facebook.github.io/jest/). Jest is configured as a dev dependency.

execute:

    npm test

Some code linting practices and security tests can be executed by running the lint task:

    npm run lint

### Drawing
![Device drawing](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/device.jpg "Drawing on the device")

Simple clicking on the canvas in the responsive webinterface makes things light up, when you press submit it will get sent to the device.

### Camera
![Using your camera](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/camera.jpg "Using your camera")

The webinterface allows you to capture your camera and submit images from there.

### Webinterface
![Web interface](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/webui.png "Webinterface")

A simple web interface is included for drawing on the device. Defaults to port 8080.

### Coding
![Coding](https://raw.githubusercontent.com/sexybiggetje/pixdisp/screenshots/animation.jpg "Coding")

[![Demo](http://img.youtube.com/vi/4mPzOF_h1kQ/0.jpg)](http://www.youtube.com/watch?v=4mPzOF_h1kQ) (Click for youtube)

With an advanced editor you can write simple animations in the browser using a secure sandboxed javascript. Documentation will follow here once the API is final.
