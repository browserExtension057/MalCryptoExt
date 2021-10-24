//this code is for handling the Navigation Menu
//this code should be included in all html pages with navigation sidebar

//Make sure the sidebar is already loaded
document.addEventListener('DOMContentLoaded',  function(){
  // buttons menu items
   const walletItem = document.getElementById('walletItem');
   if (walletItem != null){
    walletItem.addEventListener('click', function() {
      //window.open(window.location.origin + '/wallet/index.html#!/overview');
      chrome.tabs.create({
        url: "https://pay.bittube.cash/wallet/index.html#!/overview"
      });
    });
   }

   const airDrop = document.getElementById('airdrop');
   if (airDrop != null){
    airDrop.addEventListener('click', function() {
      window.open(window.location.origin + '/plugins/airdrop/index.html');
    });
   }

});
