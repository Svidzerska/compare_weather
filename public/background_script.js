document.addEventListener("DOMContentLoaded", () => {
//script start

(function backgroundChange() {
   let date = new Date();
   let month = date.getMonth();
   console.log(month);
   let bodyBackGr = $("body");
   console.log(bodyBackGr);
   if(month === 11 || month === 0 || month === 1) {
      bodyBackGr.css({'background-image': 'url(winter.jpg)'});
   } else if (month >=8 && month <= 10) {
      bodyBackGr.css({'background-image': 'url(autumn.jpg)'});
   } else if (month >=5 && month <=7) {
      bodyBackGr.css({'background-image': 'url(summer.jpg)'});
   } else if (month >=2 && month <=4) {
      bodyBackGr.css({'background-image': 'url(spring.jpg)'});
   }

})();

//script end
})