document.addEventListener("DOMContentLoaded", () => {
   //script start

   class WeatherView {
      constructor() {
         this.input = document.createElement("input");
         this.addButton = document.createElement("button");
         this.addButton.setAttribute("id","add_city");
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
   }

   class WeatherModel {
      constructor(view){
         this.cities = [];
         this.view = view;
      } 

      addCityToDB(value) {
         this.cities.push(value);
         console.log(this.cities);
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
   }

   function start(){
      let view = new WeatherView();
      let model = new WeatherModel(view);
      let controller = new WeatherController(view,model);

      view.renderInit();
      controller.addHandle();
   }

   start();







   //script end
})