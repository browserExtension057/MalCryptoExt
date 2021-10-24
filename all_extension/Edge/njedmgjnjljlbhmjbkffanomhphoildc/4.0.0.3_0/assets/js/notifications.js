const drawNotifications = (data, usernoti) => {
  let noReadNotis = 0;
  if (data.length > 0) {
    data.forEach((notification, index) => {
      const liNoti = document.createElement('li');
      liNoti.classList.add('notification');
      liNoti.style.animation = "listPop 0.4s ease forwards"
      liNoti.style.animationDelay = index * 0.05 + 's'
      liNoti.style.opacity = 0
      const pNotiDate = document.createElement('p');
      pNotiDate.classList.add('notifDate');
      pNotiDate.innerHTML = formatDateHistory(new Date(notification.time));
      const notifTitle = document.createElement('div');
      notifTitle.classList.add('notifTitle');
      notifTitle.innerHTML = notification.title;
      for (var property in usernoti[0]) {
        if (notification.id == property) {
          if (usernoti[0][property] == 'No Read') {
            noReadNotis = noReadNotis + 1;
            notifTitle.classList.add('bolder');
            notifTitle.setAttribute('data-action', 'markAsRead');
            notifTitle.setAttribute('data-notiid', notification.id);
          }
        }
      }

      const tooltipContainer = document.createElement('div');
      tooltipContainer.classList.add('tooltipContainer');
      const pContent = document.createElement('p');
      pContent.classList.add('displayNone');
      pContent.innerHTML = notification.text;
      const imgNoti = document.createElement('img');
      if (notification.type == 'new') {
        imgNoti.setAttribute('src', './assets/images/iconNotif/new.svg');
      } else if (notification.type == 'important') {
        imgNoti.setAttribute('src', './assets/images/iconNotif/advice.svg');
      }
      tooltipContainer.appendChild(imgNoti);
      liNoti.appendChild(pNotiDate);
      liNoti.appendChild(notifTitle);
      liNoti.appendChild(tooltipContainer);
      liNoti.appendChild(pContent);
      document.getElementById('ulNotifcations').appendChild(liNoti);
    });

    document.getElementById('loaderNotifications').classList.add('displayNone');
    document.getElementById('notificationsContainer').classList.remove('displayNone')

    const liNotifications = document.getElementsByClassName('notification');
    if (liNotifications.length > 0) {
      for (let i = 0; i < liNotifications.length; i++) {
        liNotifications[i].addEventListener('click', function (e) {
          const instanceModalLogin = mobiscroll.popup('#notificationModal', {
            display: 'center',
            closeOnOverlayTap: false,
            cssClass: 'popUpResendEmail popupNotifications',
            buttons: [{
              text: i18next.t('close'),
              cssClass: 'buttonModdal',
              handler: function (event, inst) {
                inst.hide();
              }
            }],
            onBeforeShow: async (ev, inst) => {
              if (liNotifications[i].children[1].getAttribute('data-action') == 'markAsRead') {
                let count = new Number(document.getElementById('notifCount').children[0].innerHTML);
                if ((count - 1) != 0) {
                  document.getElementById('notifCount').children[0].innerHTML = (count - 1);
                  localStorageEx.set('totalUserNotifications', (count - 1), 300);
                } else {

                  document.getElementById('notifCount').classList.add('displayNone');
                  document.getElementById('notifCount').children[0].innerHTML = 0;
                  localStorage.removeItem('totalUserNotifications');
                }
                const data = {
                  notiid: liNotifications[i].children[1].getAttribute('data-notiid'),
                  action: 'markAsRead'
                }
                const url = functionBaseURL + '/app/updateNotification';
                const resultMarkAsRead = await firebaseXhr(url, JSON.stringify(data));
                if (resultMarkAsRead.result == 'Success') {
                  liNotifications[i].children[1].classList.remove('bolder');
                }
              }
              document.getElementById('notificationTitle').innerHTML = liNotifications[i].children[1].innerHTML;
              document.getElementById('notificationContent').innerHTML = liNotifications[i].children[3].innerHTML;

              const links = document.getElementById('notificationContent').getElementsByTagName('a');
              if (links.length > 0) {
                for (let i = 0; i < links.length; i++) {
                  links[i].addEventListener('click', function (e) {
                    chrome.tabs.create({
                      url: this.getAttribute('href')
                    })
                  });
                }
              }

            },
          });
          instanceModalLogin.show();
        })
      }
    }
  } else {
    document.getElementById('loaderNotifications').classList.add('displayNone');
    document.getElementById('notificationsContainer').innerHTML = '<p class="pCenterDiv" align="center"><img src="/assets/images/logo-header.svg"> <br> There are no notifications.</p>'
    document.getElementById('notificationsContainer').classList.remove('displayNone')
  }
}
const initNotifications = async () => {
  try{
    if (detecPhoneDevice()) {
      if ( document.querySelectorAll('.footerElem > a[href="/vpn.html"]')[0] !== null && document.querySelectorAll('.footerElem > a[href="/vpn.html"]')[0] !== undefined ){
        document.querySelectorAll('.footerElem > a[href="/vpn.html"]')[0].parentElement.classList.add('displayNone')
      }
    }

    const url = functionBaseURL + '/app/getNotifications?action=user';
    const getNotifications = await firebaseXhr(url);
    if ( getNotifications.result == 'Success'){
      localStorageEx.set('totalUserNotifications', getNotifications.total, 300);
      document.getElementById('notifCount').children[0].innerHTML = getNotifications.total;
      if (getNotifications.total != 0) {
        document.getElementById('notifCount').classList.remove('displayNone');
      } else {
        document.getElementById('notifCount').classList.add('displayNone');
      }
      drawNotifications(getNotifications.data, getNotifications.usernoti);
    }
  }catch (err) {
    console.log('Error getting Notifications', err);
  }
}

window.onload = function () {
  const body = document.getElementsByTagName('body')[0];
  if (body.getAttribute('data-mobileDevice') == null || body.getAttribute('data-mobileDevice') == undefined) {
    if (detecPhoneDevice()) {
      body.addEventListener("touchstart", startTouch, false);
      body.addEventListener("touchmove", moveTouch, false);
      body.setAttribute('data-mobileDevice', 'true')
      loadjscssfile('assets/css/mobile.css', 'css');
    } else {
      body.setAttribute('data-mobileDevice', 'false')
    }
  }
  initNotifications();
  const buttonBuyTubes = document.getElementById('buttonBuyTubes');
  if (buttonBuyTubes != null) {
    buttonBuyTubes.addEventListener('click', function () {
      //window.location.href = '/buytubes.html';
      chrome.tabs.create({
        url: "https://pay.bittube.cash/buytubes/index.html"
      });
    });
  }
};