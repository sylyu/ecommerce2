# ecommerce2
This is the root folder of the project.
It has a subdirectory /public that is an Angular git repo.


## Create Code

1. Create folder 	
 - [ ] `mkdir project_name` 	
 - [ ] `cd project_name` 	
 - [ ] `touch server.js`
 - [ ] copy your cleaned up and working crud server file into the blank one.

	
2. Make a package.json file:
 - [ ] `npm init -y`

{

     "name": "Angular",
      "version": "1.0.0",
      "description": "",
      "main": "practice_ts.js",
      "scripts": \{
        "test": "echo \"Error: no test specified\" && exit 1"
      \},
      "keywords": [],
      "author": "",
      "license": "ISC"

}

3. `sudo npm install express --save`
4. `sudo npm install body-parser --save`
5. `sudo npm install mongoose --save`
6. `sudo npm install bcryptjs --save`
7. `sudo npm install cors --save`
8. `sudo npm install multer --save`

9. `npm init -y`

{
  "name": "ecommerce2",
  "version": "1.0.0",
  "description": "This is the root folder of the project. It has a subdirectory /public that is an Angular git repo.",
  "main": "server.js",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.18.3",
    "express": "^4.16.4",
    "mongoose": "^5.4.16",
    "multer": "^1.4.1"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sylyu/ecommerce2.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/sylyu/ecommerce2/issues"
  },
  "homepage": "https://github.com/sylyu/ecommerce2#readme"
}


10. Install angular project 
- don't do sudo - will cause you to enter password every time.
- this will take time to install
`ng new public`
	- pick yes 
	- pick css
	- enter

## Start servers
### terminal window 1 - leave mongoose running
`cd ~/`
`sudo mongod`
- kill server if needed
		`ps -ax | grep mongo`
		`sudo kill` *that_number*

### terminal window 2 - leave this open to query database when needed
 `mongo`


### terminal window 3
path to your angular public project folder and create a dist folder. 
leave this running

    cd project_name/public
    ng build --watch

### terminal window 4 (I use vscode terminal window) - run nodemon
`nodemon server.js`

### terminal window 5 
I split screen on vscode for just terminal stuff

## Start Browsers

### Browser for testing
  http://localhost:8000

### Browser for learning
on website -> go to angular -> fetch data -> service for instructions
 path into your public(angular project) folder
~/authors/public (master)

## Continue Coding
16. Create ng g s http

$ ng g s http	(leave it a generic name) - We'll need this for dependency injections

	follow instructions to handle the imports and exports for httpClient and httpService
	open project tree public | app | http.service.ts is created
	- you will see you are exporting the class HttpService
	  (if you are able to export it, something else can import it)

17. Register app.module.ts

	To register, go to app.module.ts. We import then include it to our array of providers
	1 you can see that to first register it, you first import it. The provide the file path where we can find that.
	  so we first import http service

		import { HttpService } from './http.service';

	 2 The go below we include that in our array of providers

		providers: [HttpService],

18. HttpClient app.module.ts
	
	 3 HttpClient - Our services need to be able to make Http requests, so it needs HttpClient
		- we import HttpClientModule
	
			import { HttpClientModule } from '@angular/common/http';
		
		- we include that in our array of imports

		  imports: [
 
    			HttpClientModule,
  		  ],

19. Dependency injection
	- when one part of your app is dependent on another piece, then you will need to inject it.	
	1. go to http.service.ts (because it needs HttpClient)
	   How did we inject?
           - We did that by importing HttpClient, 
	
		import { HttpClient } from '@angular/common/http';
	
	   - and then we made it an attribute of that class. 
             So in your constructor method, you can say that you can 
	     have this attribute called _http (indicate it's being injected) and declare type HttpClient	

		  constructor(private _http: HttpClient) {

  		  }

       We do this one more time because our component needs a service.  
        ( If service isn't being used by a component, we don't need to have it.
	( so in order to make sure that our services are being built, we need a component to use it. )
	2. go to app.component.ts and inject the service. so we import it and make it an attribute.
		- so use your constructor method 
		- use the _http to name your attribute
		- and then define it as an HttpService
		(you just injected it)
		
    `import { HttpService } from './http.service';
    
    export class AppComponent {
    	title = 'public';
    
    	constructor(private _httpService: HttpService){
       
    	}
    }`
		
20. Now I like my service to do something
   - go to `http.service.ts` and write a function called getTasks, then call it in the constructor.
   - it's going to use the `_http` attribute we just gave
   - and it has the `get` method. provide a url of where you want it to go
   - remember this will return as an observable (it will come back as an observable)
   - we store that in `tempObservable`
   - since it's an observable, it has a `subscribe` method. lets use that subscribe method, which means we are going to get data because we just subscribed. when there is new data, we are going to get that data. 
   - what would you like to do with that data? this case, we `console.log` it
   - how do i call this function. since this service is being built, because it's been required by a component we can also tell it to do things in the constructor. 
	- so we ask, while it's being built, run this `getTasks` function in the `constructor`.

  

     constructor(private _http: HttpClient) {
        this.getTasks();
       }

       getTasks(){
         // our http response is an observable, store it in the variable tempObservable
         let tempObservable = this._http.get('/tasks');
         //subscribe to our observable and provide the code we would like to do with our data from the response.
         tempObservable.subscribe(data => console.log("Got our tasks!", data));
       }

21. run the app. refresh localhost.8000 on google chrome. in console. you will see that 
   should get message - got our tasks


## angular | dom manipulation | nested components
inside your projects | public folder
    `ng g c component-name` (add child components add, edit and home)

- look in public src app























