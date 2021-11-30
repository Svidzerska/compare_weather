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

      addWeatherGeo(temperature,feel_temperature,cloud,precipitation,icon,city) {
         this.mainDiv.appendChild(this.divGeo);
         this.divGeo.innerHTML = `<p>${temperature}</p>
         <p>${feel_temperature}</p>
         <p>${cloud}</p>
         <p>${precipitation}</p>
         <p>${icon}</p>
         <p>${city}</p>`;
      }

      addCityAndWeather(name,_id) {
         const divOneCity = document.createElement("div");
         this.taskDiv.appendChild(divOneCity);
         divOneCity.setAttribute("class", "city_example")
         divOneCity.innerHTML = `<p>${name}</p>`;
         const deleteButton = document.createElement("button");
         divOneCity.appendChild(deleteButton);
         deleteButton.setAttribute("id",`${_id}`);
         deleteButton.innerText = "Delete";
      }

      deleteAllCities() {
         this.taskDiv.innerHTML = "";
      }
   }

   class WeatherModel {
      constructor(view){
         this.view = view;
      } 

      // addCityToDBPromise(method,cityFromInput) {
      //    return new Promise((resolve, reject) => {
      //       const xhr = new XMLHttpRequest();
      //       xhr.open(method, "http://localhost:3030/cities");
      //       xhr.responseType = "json";
      //       xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');   
      //       xhr.onload = () => {
      //          if(xhr.status === 200) {
      //             resolve(xhr.response);
      //          } else {
      //             var error = new Error(this.statusText);
      //             error.code = this.status;
      //             reject(error);
      //          }
      //       }
   
      //       xhr.onerror = () => {
      //          reject(new Error("Network Error"));
      //       }

      //       xhr.send(cityFromInput);
      //    })
      // }

      // async getCitiesFromDB() {
      //    try {
      //       let result = await fetch('http://localhost:3030/cities', {
      //          method: 'GET'})
      //       let json = await result.json();
      //       return json;
      //    } catch(err) {
      //        return err;
      //    }
      // }

      // deleteCitiesFromDBPromise(identificator) {
      //    return new Promise((resolve, reject) => {
      //       const xhr = new XMLHttpRequest();
      //       xhr.open("DELETE", `http://localhost:3030/cities/${identificator}`);
      //       xhr.responseType = "json";
      //       xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');   
      //       xhr.onload = () => {
      //          if(xhr.status === 200) {
      //             resolve(xhr.response);
      //          } else {
      //             var error = new Error(this.statusText);
      //             error.code = this.status;
      //             reject(error);
      //          }
      //       }
   
      //       xhr.onerror = () => {
      //          reject(new Error("Network Error"));
      //       }

      //       xhr.send();
      //    })
      // }


      //weather from geolocation
      // async getWeatherGeo(latitude,longitude) {
      //    try {
      //       let result = await fetch('http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=18403b04ed7c3c2c59d89a2a42ba33c0');
      //       let json = await result.json();
      //       let temp = json.main.temp;
      //       let feel_temp = json.main.feels_like;
      //       let cloud = json.clouds;
      //       let precipitation = json.weather[0].description;
      //       let icon = json.weather[0].icon;
      //       let city = json.name;
      //       let weather = [temp,feel_temp,cloud,precipitation,icon,city];
      //       return weather;
      //    } catch(err) {
      //        return err;
      //    }
      // }
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
      constructor(view,modelDB,modelW) {
         this.view = view;
         this.modelDB = modelDB;
         this.modelW = modelW;
         this.addCity = this.addCity.bind(this);
         this.deleteAll = this.deleteAll.bind(this);
         this.getCities = this.getCities.bind(this);
      }

      addCity() {
         let value = this.view.input.value; 
         // this.model.addCityToDB(value); 
         console.log(value);
         let valueobj = {
            name: `${value}`
         };
         let valueToDB = JSON.stringify(valueobj);
         console.log(valueToDB);
         this.modelDB.addCityToDBPromise("POST", valueToDB)
                           .then(data => this.view.addCityAndWeather(data.name,data._id))
                           .catch(err => console.error(err));
         this.view.clearInput();
      }

      addHandle() {
         this.view.addButton.addEventListener("click", this.addCity);
      }

      deleteAllHandle() {
         this.view.deleteAllButton.addEventListener("click", this.getCities);
      }

      deleteAll(array) {
         for( let i = 0; i < array.length; i++) {
            console.log(66666);
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

   function start(){
      let view = new WeatherView();
      // let model = new WeatherModel(view);
      let modelDB = new WeatherModelDB(view);
      let modelW = new WeatherModelGetWeather(view);
      let controller = new WeatherController(view,modelDB,modelW);

      view.renderInit();
      controller.addHandle();
      controller.deleteAllHandle();
      controller.getGeo();
   }

   start();

   






   //script end
})