# generator-signalk-plugin
A [Yoeman](https://yeoman.io) generator for initializing a [SignalK Node Server](https://github.com/SignalK/signalk-server-node) Plugin development project. 


## Features
o Jumpstarts plugin development by generating complete project using [SignalKPlugin](https://github.com/joelkoz/signalk-plugin-base) class
o Initial scaffolding writes code to subscribe to the most common SignalK data streams
o Supports optional front end UI Webapp development using React
o Supports optional RESTful API calls to your plugin to retrieve data

## Usage
Installing Yoeman and this generator:

```
npm install -g yo
npm install -g generator-signalk-plugin
```

Once you have done that, create a new directory to hold your project, make that directory your current
working directory, then run the generator using:

```
yo signalk-plugin
```

Answer the questions, and voila!
