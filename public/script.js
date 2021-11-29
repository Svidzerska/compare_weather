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
         
      }
   
      renderInit() {
         console.log(this.addButton);
         this.mainDiv.append(this.input, this.addButton);
         this.addButton.innerHTML = "Add";
         this.input.setAttribute("placeholder",`Type your city here...`);
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
   }

   class WeatherModel {
      constructor(view){
         this.cities = [];
         this.view = view;
         // this.getCityGeo = this.getCityGeo.bind(this);
         this.getWeatherGeo = this.getWeatherGeo.bind(this);
      } 

      addCityToDB(value) {
         this.cities.push(value);
         console.log(this.cities);
      }

      
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
      constructor(view,model) {
         this.view = view;
         this.model = model;
         this.addCity = this.addCity.bind(this);
      }

      addCity() {
         let value = this.view.input.value; 
         this.model.addCityToDB(value); 
         this.view.clearInput();
      }

      addHandle() {
         this.view.addButton.addEventListener("click", this.addCity);
      }

      getGeo() {
         let geo = navigator.geolocation;
         console.log(geo);
         let id = geo.watchPosition((pos) => {
            const latitude  = pos.coords.latitude;
            const longitude = pos.coords.longitude;
            console.log(pos.coords);
            this.model.getWeatherGeo(latitude,longitude)
                        .then(result => result instanceof Error ? 
                        console.log(result) : 
                        this.view.addWeatherGeo(result[0],result[1],result[2],result[3],result[4],result[5],result[6]));                                       
            geo.clearWatch(id);
         }, (err) => console.log(new Error(err)));
      }   
   }

   function start(){
      let view = new WeatherView();
      let model = new WeatherModel(view);
      let controller = new WeatherController(view,model);

      view.renderInit();
      controller.addHandle();
      controller.getGeo();
   }

   start();

   






   //script end
})