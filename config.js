let config = {
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	electronOptions: {
		webPreferences: {
		  webviewTag: true
		}
	  },
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left",
            config: {
                dateFormat: "ddd MMM D"
            }
		},
		{
			module: "compliments",
            disabled: true,
			position: "lower_third"
		},
		{
			module: "MMM-GoogleAssistant",
			position: "fullscreen_above",
            configDeepMerge: true,
			config: {
				debug: false,
				assistantConfig: {
                    lang: "ko-KR"
				},
            }
		},
		{
		  module: "MMM-Detector",
		  position: "top_left",
		  configDeepMerge: true,
		  config: {
			debug: false,
			detectors: [
			  {
				detector: "Snowboy",
				Model: "jarvis",
				Sensitivity: null,
				Logo: "google",
				autoRestart: false,
				onDetected: {
				  notification: "GA_ACTIVATE"
				}
			  },
			  {
				detector: "Porcupine",
				Model: "ok google",
				Sensitivity: null,
				Logo: "google",
				autoRestart: false,
				onDetected: {
				  notification: "GA_ACTIVATE"
				}
			  },
			  {
				detector: "Porcupine",
				Model: "hey google",
				Sensitivity: null,
				Logo: "google",
				autoRestart: false,
				onDetected: {
				  notification: "GA_ACTIVATE"
				}
			  },
			]
		  }
		},
	  {
		module: "MMM-OpenWeatherForecast",
		position: "top_right",
		header: "Forecast",
		config: {
		  apikey: "", // 발급받은 api key 입력
            latitude: "위도 입력",
            longitude: "경도 입력",
            language: "kr",
            forecastLayout: "table",
		}
	  },
	  {
		module: 'MMM-MicrosoftToDo',
		position: 'top_left',	// This can be any of the regions. Best results in left or right regions.
		config: {
			// 3개 항목 발급받아서 입력
		  oauth2ClientSecret: '', // client secret value
		  oauth2RefreshToken: '',
		  oauth2ClientId: '',
          listName: '',
		  showCheckbox: true, // optional parameter: default value is true and will show a checkbox before each todo list item
		  showDueDate: false, // optional parameter: default value is false and will show the todo list items due date if it exists on the todo list item
		  dateFormat: 'ddd MMM Do [ - ]', //optional parameter: uses moment date format and the default value is 'ddd MMM Do [ - ]'
		  hideIfEmpty: false, // optional parameter: default value is false and will show the module also when the todo list is empty
		  maxWidth: 450, // optional parameter: max width in pixel, default value is 450
		  itemLimit: 200, // optional parameter: limit on the number of items to show from the list, default value is 200
		  orderBy: 'subject', // optional parameter: 'subject' - order results by subject/name, 'dueDate' - order results by due date, default value is unordered
		  completeOnClick: true, // optional parameter: default value is false, when set to true complete task when clicking on it
		  refreshSeconds: 60, // optional parameter: every how many seconds should the list be updated from the remote service, default value is 60
		  fade: true, //optional parameter: default value is false. True will fade the list towards the bottom from the point set in the fadePoint parameter
		  fadePoint: 0.5 //optional parameter: decimal value between 0 and 1 sets the point where the fade effect will start
		}
	  },
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

