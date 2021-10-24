// Swipe Up / Down / Left / Right
let initialX = null;
let initialY = null;


const startTouch = (e) =>{
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};
 
const moveTouch = (e) => {
  const actualMenu = localStorage.getItem('lastPage') || '/airtime.html';
  if (initialX === null) {
    return;
  }
 
  if (initialY === null) {
    return;
  }
 
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
 
  const diffX = initialX - currentX;
  const diffY = initialY - currentY;
 
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
      if ( actualMenu == '/airtime.html'){
        window.location.href = 'link_account.html'
      }else if ( actualMenu == '/link_account.html'){
        window.location.href = 'ublock.html'
        // console.log('Newx ublock  ')
      }else if ( actualMenu == '/ublock.html'){
        window.location.href = 'account.html'
      }else if ( actualMenu == '/account.html' || actualMenu == '/history.html' ){
        window.location.href = 'notifications.html'
      }else if ( actualMenu == '/notifications.html'){
        window.location.href = 'airtime.html'
      }

    } else {
      // swiped right
      console.log("swiped right");
      if ( actualMenu == '/airtime.html'){
        window.location.href = 'notifications.html'
      }else if ( actualMenu == '/notifications.html'){
        window.location.href = 'account.html'
      }else if ( actualMenu == '/account.html' || actualMenu == '/history.html' ){
        window.location.href = 'ublock.html'
      }else if ( actualMenu == '/ublock.html'){
        window.location.href = 'link_account.html'
      }else if ( actualMenu == '/link_account.html'){
        window.location.href = 'airtime.html'
      }
    } 
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
      console.log("swiped up");
    } else {
      // swiped down
      console.log("swiped down");
    } 
  }
 
  initialX = null;
  initialY = null;
   
//   e.preventDefault();
};

const detecPhoneDevice = () => {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}
const loadjscssfile = (filename, filetype) => {
  if (filetype == "css") {
    var fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}