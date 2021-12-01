document.addEventListener("DOMContentLoaded", () => {
   //script start

   class WeatherView {
      constructor() {
         this.input = document.createElement("input");
         this.addButton = document.createElement("button");
         this.addButton.setAttribute("id","add_city");
         this.divGeo = document.createElement("div");
         this.divGeo.setAttribute("class","geoFixed");
         this.mainDiv = document.querySelector(".main");
         this.inputDiv = document.querySelector(".input_field");
         this.deleteAllButton = document.createElement("button");
         this.taskDiv = document.querySelector(".tasks");
         this.divQuestion = document.createElement("div");
      }
   
      renderInit() {
         console.log(this.addButton);
         this.inputDiv.append(this.input, this.addButton);
         this.addButton.innerHTML = "Add";
         this.input.setAttribute("placeholder",`Type your city here...`);
         this.mainDiv.appendChild(this.deleteAllButton);
         this.deleteAllButton.setAttribute("id","delete_all");
         this.deleteAllButton.innerText = "Delete All Cities";
      }

      clearInput() {
         this.input.value = "";
      }

      questionInput(data) {
         this.inputDiv.appendChild(this.divQuestion);
         this.divQuestion.setAttribute("class", "possible_city");
         this.divQuestion.innerText = `${data.name},${data.sys.country},${data.coord.lat},${data.coord.lon}`;

      }

      errorInput(data) {
         this.inputDiv.appendChild(this.divQuestion);
         this.divQuestion.setAttribute("class", "possible_city");
         this.divQuestion.innerText = `${data.message}`;
      }
   

      addWeatherGeo(temperature,feel_temperature,cloud,precipitation,icon,city) {
         this.mainDiv.appendChild(this.divGeo);
         const tempC = Math.round(+temperature - 273.15);
         const tempfeelC = Math.round(+feel_temperature - 273.15);
         const tempF = Math.round(tempC*1.8 + 32); 
         const tempfeelF = Math.round(tempfeelC*1.8 + 32); 
         this.divGeo.innerHTML = `<div><p>Where you are</p></div>
         <div><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${precipitation}"><div><p>${tempC} &#176;C / ${tempF} F </p><p>feels like:<br>${tempfeelC} &#176;C / ${tempfeelF} F</p></div></div>
         <div><p>${precipitation}</p></div>
         <div><p>${city}</p></div>
         `;
      }

      addCityAndWeather(name,_id,temp) {
         const divOneCity = document.createElement("div");
         this.taskDiv.appendChild(divOneCity);
         divOneCity.setAttribute("class", "city_example");
         divOneCity.setAttribute("id",`button${_id}`);
         divOneCity.innerHTML = `<p>${name}${temp}</p>`;
         const deleteButton = document.createElement("button");
         divOneCity.appendChild(deleteButton);
         deleteButton.setAttribute("id",`${_id}`);
         deleteButton.innerText = "Delete";
      }

      
      deleteAllCities() {
         this.taskDiv.innerHTML = "";
      }

      deleteCity(id) {
         const divOneCity = document.querySelector(`#button${id}`);
         divOneCity.remove();
      }
   }

   class WeatherModel {
      constructor(view){
         this.view = view;
      }       
   }

   class WeatherModelDB extends WeatherModel {
      constructor(view) {
         super(view);
      }

      addCityToDBPromise(method,cityFromInput) {
         return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, "http://localhost:3030/cities");
            xhr.responseType = "json";
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');   
            xhr.onload = () => {
               if(xhr.status === 200) {
                  resolve(xhr.response);
               } else {
                  var error = new Error(this.statusText);
                  error.code = this.status;
                  reject(error);
               }
            }
   
            xhr.onerror = () => {
               reject(new Error("Network Error"));
            }

            xhr.send(cityFromInput);
         })
      }

      async getCitiesFromDB() {
         try {
            let result = await fetch('http://localhost:3030/cities', {
               method: 'GET'})
            let json = await result.json();
            return json;
         } catch(err) {
             return err;
         }
      }

      deleteCitiesFromDBPromise(identificator) {
         return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("DELETE", `http://localhost:3030/cities/${identificator}`);
            xhr.responseType = "json";
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');   
            xhr.onload = () => {
               if(xhr.status === 200) {
                  resolve(xhr.response);
               } else {
                  var error = new Error(this.statusText);
                  error.code = this.status;
                  reject(error);
               }
            }
   
            xhr.onerror = () => {
               reject(new Error("Network Error"));
            }

            xhr.send();
         })
      }
   }

   class WeatherModelGetWeather extends WeatherModel {
      constructor(view) {
         super(view);
      }

      //weather by city
      async getWeatherCity(method,city) {
         try {
            let result = await fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=18403b04ed7c3c2c59d89a2a42ba33c0');
            let json = await result.json();
            return json;
         } catch(err) {
             return err;
         }
      }


      //weather from geolocation
      async getWeatherGeo(latitude,longitude) {
         try {
            let result = await fetch('http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=18403b04ed7c3c2c59d89a2a42ba33c0');
            let json = await result.json();
            let temp = json.main.temp;
            let feel_temp = json.main.feels_like;
            let cloud = json.clouds;
            let precipitation = json.weather[0].description;
            let icon = json.weather[0].icon;
            let city = json.name;
            let weather = [temp,feel_temp,cloud,precipitation,icon,city];
            return weather;
         } catch(err) {
             return err;
         }
      }
   }



   class WeatherController {
      constructor(view,modelDB,modelW,mediator) {
         this.view = view;
         this.modelDB = modelDB;
         this.modelW = modelW;
         this.mediator = mediator;
         this.addCity = this.addCity.bind(this);
         this.deleteAll = this.deleteAll.bind(this);
         this.getCities = this.getCities.bind(this);
         this.clickDelete = this.clickDelete.bind(this);
         this.findWeatherCity = this.findWeatherCity.bind(this);
         this.addHandle = this.addHandle.bind(this);
         this.addHandleRemove = this.addHandleRemove.bind(this);
         this.showWeather = this.showWeather.bind(this);
      }

      renderInitCity(array) {
         for( let i = 0; i < array.length; i++) {
            console.log(66666);
            console.log(array[i]._id);
            this.view.addCityAndWeather(array[i].name,array[i]._id);
         }
      }
      
      initCity() {
         this.modelDB.getCitiesFromDB()
                        .then(result => result instanceof Error ? 
                        console.log(result) : 
                        this.renderInitCity(result));    
      }

      
      findWeatherCity() {
         console.log(this.view.input.value);
         this.modelW.getWeatherCity("GET", this.view.input.value)
                                          .then(data => {
                                             console.log(data);
                                             if (data.cod === 200) {
                                                this.view.questionInput(data);
                                                this.mediator.subscribe(this.addHandle);
                                                this.addHandle();
                                             } else if (data.cod === '404') {
                                                this.view.errorInput(data);
                                                if (this.mediator.done() === true) {
                                                   this.addHandleRemove();
                                                }
                                             }
                                          })
                                          .catch(err => console.error(err));
      }

      inputHandle() {
         this.view.input.addEventListener("input", this.findWeatherCity);
      }

      addCity() {
         let value = this.view.input.value; 
         console.log(value);
         let valueobj = {
            name: `${value}`
         };
         let valueToDB = JSON.stringify(valueobj);
         console.log(valueToDB);
         this.modelDB.addCityToDBPromise("POST", valueToDB)
                           .then(data => {
                              // this.view.addCityAndWeather(data.name,data._id)
                              console.log(data);
                              this.showWeather(data.name,data._id);
                           })
                           .catch(err => console.error(err));
         this.view.clearInput();
      }


      showWeather(name,_id) {
         this.modelW.getWeatherCity("GET", name)
                                          .then(data => {
                                             console.log(data);
                                             this.view.addCityAndWeather(name,_id,data.main.temp)
                                          })
                                          .catch(err => console.error(err));
      }

      addHandleRemove() {
         this.view.addButton.removeEventListener("click", this.addCity);
      }

      
      addHandle() {
         this.view.addButton.addEventListener("click", this.addCity);
      }

      
      deleteAll(array) {
         for( let i = 0; i < array.length; i++) {
            console.log(66666);
            console.log(array[i]._id);
            this.modelDB.deleteCitiesFromDBPromise(array[i]._id);
         
         }
         this.view.deleteAllCities();
      }

      getCities() {
         this.modelDB.getCitiesFromDB()
                        .then(result => result instanceof Error ? 
                        console.log(result) : 
                        this.deleteAll(result));                                       
      }

      deleteAllHandle() {
         this.view.deleteAllButton.addEventListener("click", this.getCities);
      }

      clickDelete(e) {
         if (e.target.className !== "city_example") {
            const button = e.target;
            console.log(button.id);
            this.modelDB.deleteCitiesFromDBPromise(button.id);
            this.view.deleteCity(button.id);
         }
      }

      deleteTask() {
         this.view.taskDiv.addEventListener("click", this.clickDelete);
      }

      getGeo() {
         let geo = navigator.geolocation;
         console.log(geo);
         let id = geo.watchPosition((pos) => {
            const latitude  = pos.coords.latitude;
            const longitude = pos.coords.longitude;
            console.log(pos.coords);
            this.modelW.getWeatherGeo(latitude,longitude)
                        .then(result => result instanceof Error ? 
                        console.log(result) : 
                        this.view.addWeatherGeo(result[0],result[1],result[2],result[3],result[4],result[5],result[6]));                                       
            geo.clearWatch(id);
         }, (err) => console.log(new Error(err)));
      }   
   }


   class Facade {
      constructor(view,controller) {
         this.view = view;
         this.controller = controller;
      }

      handle(){
         this.controller.deleteAllHandle();
         this.controller.deleteTask();
      }

      init() {
         this.controller.getGeo();
         this.view.renderInit();
         this.controller.initCity();
         this.controller.inputHandle();
      }
   }


   class Mediator {
      constructor() {
         this.functionDone = [];
      }

      subscribe(user) {
         this.functionDone.splice(0,1,user);
         console.log(this.functionDone);
      }

      done() {
         if (this.functionDone[this.functionDone.length-1] !== undefined) {
            return true;
         }
      }
   }

   function start(){
      let view = new WeatherView();
      // let model = new WeatherModel(view);
      let modelDB = new WeatherModelDB(view);
      let modelW = new WeatherModelGetWeather(view);
      let mediator = new Mediator();
      let controller = new WeatherController(view,modelDB,modelW,mediator);
      let facade = new Facade(view,controller);
      

      
      facade.init();
      facade.handle();
   }


   

   start();

   






   //script end
})