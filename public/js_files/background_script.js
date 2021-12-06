document.addEventListener("DOMContentLoaded", () => {
//script start

(function backgroundChange() {
   let date = new Date();
   let month = date.getMonth();
   console.log(month);
   let bodyBackGr = $("body");
   console.log(bodyBackGr);
   switch(month) {
      case 11:
      case 0:
      case 1:
         bodyBackGr.css({'background-image': 'url(images/winter.jpg)'});
      break;

      case 8:
      case 9:
      case 10:
         bodyBackGr.css({'background-image': 'url(images/autumn.jpg)'});
      break;

      case 5:
      case 6:
      case 7:
         bodyBackGr.css({'background-image': 'url(images/summer.jpg)'});
      break;

      case 2:
      case 3:
      case 4:
         bodyBackGr.css({'background-image': 'url(images/spring.jpg)'});
      break;
   }
})();

//script end
})