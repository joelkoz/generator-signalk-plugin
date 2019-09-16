
var Generator = require('yeoman-generator');
var _ = require('lodash');

var SigPathInfo = {
    pos: {
        title: "GPS position",
        path: "navigation.position"
    },

    depth: {
        title: "Depth",
        path: "environment.depth.belowSurface"
    },

    speed: {
        title: "Speed",
        path: "navigation.speedOverGround"
    },

    heading: {
        title: "Heading",
        path: "navigation.headingTrue"
    },

    course: {
        title: "Course over ground",
        path: "navigation.courseOverGroundTrue"
    },

    closestAppr: {
        title: "Closest approach (from AIS)",
        path: "navigation.closestApproach"
    },

    tripETA: {
        title: "Estimated time of arrival",
        path: "navigation.destination.eta"
    },

    waterTemp: {
        title: "Water surface temp",
        path: "environment.water.temperature"
    },

    outsideTemp: {
        title: "Outside air temperature",
        path: "environment.outside.temperature"
    },

    outsideRelHumid: {
        title: "Outside air rel humitity",
        path: "environment.outside.humidity"
    },

    insideTemp: {
        title: "Inside air temperature",
        path: "environment.inside.temperature"
    },

    insideRelHumid: {
        title: "Inside air rel humitity",
        path: "environment.inside.humidity"
    },

    engRmTemp: {
        title: "Engine room air temperature",
        path: "environment.inside.engineRoom.temperature"
    },

    engRmRelHumid: {
        title: "Engine room air rel humitity",
        path: "environment.inside.engineRoom.relativeHumidity"
    },

    engine0State: {
        title: "Engine 0 state",
        path: "propulsion.0.state"
    },

    engine0Revs: {
        title: "Engine 0 revolutions",
        path: "propulsion.0.revolutions"
    },

    engine0Temp: {
        title: "Engine 0 temperature",
        path: "propulsion.0.temperature"
    },

    engine0OilTemp: {
        title: "Engine 0 oil temperature",
        path: "propulsion.0.oilTemperature"
    },

    engine0OilPress: {
        title: "Engine 0 oil pressure",
        path: "propulsion.0.oilPressure"
    },

    engine0Load: {
        title: "Engine 0 load",
        path: "propulsion.0.engineLoad"
    },

    engine0RunTime: {
        title: "Engine 0 total run time",
        path: "propulsion.0.runTime"
    },

    engine1State: {
        title: "Engine 1 state",
        path: "propulsion.1.state"
    },

    engine1Revs: {
        title: "Engine 1 revolutions",
        path: "propulsion.1.revolutions"
    },

    engine1Temp: {
        title: "Engine 1 temperature",
        path: "propulsion.1.temperature"
    },

    engine1OilTemp: {
        title: "Engine 1 oil temperature",
        path: "propulsion.1.oilTemperature"
    },

    engine1OilPress: {
        title: "Engine 1 oil pressure",
        path: "propulsion.1.oilPressure"
    },

    engine1Load: {
        title: "Engine 1 load",
        path: "propulsion.1.engineLoad"
    },

    engine1RunTime: {
        title: "Engine 1 total run time",
        path: "propulsion.1.runTime"
    },


    someSKData: {
        title: "Generic/example data value",
        path: "path.to.some.value"
    }

}

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    
        // Add additional properties and functions to the SigPathInfo
        // array to make things easier down the road...
        var that = this;
        Object.keys(SigPathInfo).forEach(function(key, index) {


        });
    }


    async prompting() {

        // For details on how to formulate prompts, see https://github.com/SBoudrias/Inquirer.js#question
        let prompts = [
            {
                type: "input",
                name: "id",
                message: "Plugin id",
                default: this.appname.replace(/\s+/g, '-'),
                store: true
              },
              {
                type: "input",
                name: "name",
                message: "Plugin name",
                default: function() {
                    let appName = this.appname;
                    if (_.startsWith(appName, 'signalk')) {
                        appName = appName.substr(8);
                    }
                    return _.upperFirst(appName)
                }.bind(this),
                store: true

              },
              {
                type: "input",
                name: "className",
                message: "Class name",
                default: function (answers) {
                    return _.upperFirst(_.camelCase(answers.name));
                },
                store: true
              },
              {
                type: "input",
                name: "description",
                message: "Plugin description",
                default: 'This is what my plugin does',
                store: true
              },
              {
                type: "confirm",
                name: "hasWebApp",
                message: "Does the plugin have a web UI?",
                store: true
              },
              {
                type: "confirm",
                name: "hasAPI",
                message: "Does the plugin respond to webservice calls?",
                default: function(answers) {
                    return answers.hasWebApp;
                },
                when: function(answers) {
                    return !answers.hasWebApp;
                },
                store: true
              },
              {
                type: "checkbox",
                name: "paths",
                message: "What SignalK data are you interested in?",
                choices: [],
                store: true
            }
        ];


        // Load up the SignalK path choices with the paths we know of...
        Object.keys(SigPathInfo).forEach(function(key, index) {

            let info = SigPathInfo[key];
            let choice = {
                name: info.title,
                value: key,
                checked: false
            }
            prompts[prompts.length-1].choices.push(choice);
        });

        this.answers = await this.prompt(prompts);
        if (this.answers.hasWebApp) {
            this.answers.hasAPI = true;
        }
        
    }


    writing() {

        // Load up the "paths" array with the path info
        // objects we will be using. While we are at it,
        // decorate them with functions to help with
        // code generation...
        var paths = [];
        this.answers.paths.forEach(key => {

            var info = SigPathInfo[key];
            info.varName = key;
            info.upperName = _.upperFirst(key);

            Object.defineProperty(info, 'streamName', {
                get: function() { return 'strm' +  this.upperName }
            });

            Object.defineProperty(info, 'propName', {
                get: function() { return 'prop' +  this.upperName }
            });

            Object.defineProperty(info, 'pathOptionName', {
                get: function() { return this.varName + "SKPath" }
            });

            Object.defineProperty(info, 'typeFilterOptionName', {
                get: function() { return this.varName + "SourceType" }
            });

            Object.defineProperty(info, 'talkerFilterOptionName', {
                get: function() { return this.varName + "SourceTalker" }
            });

            Object.defineProperty(info, 'handlerName', {
                get: function() { return 'on' +  this.upperName + "Value" }
            });


            paths.push(info);
        });


        let defaultPkg = {
            "name": this.answers.id,
            "version": "0.0.5",
            "description": this.answers.description,
            "main": "index.js",
            "dependencies": {
              "baconjs": "^1.0.1",
              "signalk-plugin-base": "^1.0.0",
            },
            "keywords": [
                "signalk-node-server-plugin",
                "signalk"
            ]
        }

        if (this.answers.hasWebApp) {
            defaultPkg.devDependencies = {
                "babel-cli": "^6.26.0",
                "babel-preset-react-app": "^3.1.2"
            };
            defaultPkg.keywords.push("signalk-webapp");
        }

        this.fs.extendJSON(this.destinationPath('package.json'), defaultPkg);

        this.fs.copyTpl(
            this.templatePath("plugin.js.ejs"),
            this.destinationPath("index.js"),
            { a: this.answers, paths }
        );

        this.fs.copyTpl(
            this.templatePath("./public/index.html.ejs"),
            this.destinationPath("./public/index.html"),
            { a: this.answers, paths }
        );


        this.fs.copyTpl(
            this.templatePath("./src/mainPage.jsx.ejs"),
            this.destinationPath("./src/mainPage.jsx"),
            { a: this.answers, paths }
        );

        this.fs.copy(
            this.templatePath("./public/react-dom.production.min.js"),
            this.destinationPath("./public/react-dom.production.min.js")
        );

        this.fs.copy(
            this.templatePath("./public/react.production.min.js"),
            this.destinationPath("./public/react.production.min.js")
        );

    }


    install() {
        this.npmInstall();
    }
   

};