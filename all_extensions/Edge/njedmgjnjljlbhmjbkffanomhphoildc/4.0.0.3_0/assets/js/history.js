// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const getUSerHistory = async (historyCollection, from = 0, type = 'history') => {
    const token = await getFirebaseToken();
    let url;
    if (type == 'search') {
      const minAmountToSearch = document.getElementById('minAmountToSearch').value;
      const maxAmountToSearch = document.getElementById('maxAmountToSearch').value;
      let dateTo = document.getElementById('dateTo').value.split('/');
      dateTo = dateTo[1] + ',' + dateTo[0] + ',' + dateTo[2];
      dateTo = new Date(dateTo).getTime();
      let dateFrom = document.getElementById('dateFrom').value.split('/');
      dateFrom = dateFrom[1] + ',' + dateFrom[0] + ',' + dateFrom[2];
      dateFrom = new Date(dateFrom).getTime();
      const type = document.getElementById('searchHistory').getAttribute('data-historyType');

      if (minAmountToSearch != '' && maxAmountToSearch != '') {
        url = functionBaseURL + '/app/searchHistory?minAmount=' + minAmountToSearch + '&maxAmount=' + maxAmountToSearch + '&historyType=' + type + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
      } else if (minAmountToSearch != '') {
        url = functionBaseURL + '/app/searchHistory?minAmount=' + minAmountToSearch + '&historyType=' + type + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
      } else if (maxAmountToSearch != '') {
        url = functionBaseURL + '/app/searchHistory?maxAmount=' + maxAmountToSearch + '&historyType=' + type + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
      } else {
        url = functionBaseURL + '/app/searchHistory?historyType=' + type + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
      }
    } else {
      url = functionBaseURL + '/app/getHistory?suffix=' + historyCollection + '&from=' + from;
    }
    sendGetRequest(url, token, function (user, response) {
      const result = JSON.parse(response);
      fillUserHistory(historyCollection, result, type);
    });
}

const fillUserHistory = (historyCollection, result, type = 'history ') => {

    let historyArray = [];
    let totalRows;
    let ulData;
    let loadMore;
    let loadMoreElement;
    let loader;
    let divToFill;
    let noDataDiv;
    let ulId;
    if (type == 'history') {
      switch (historyCollection) {
        case 'all':
          ulData = document.getElementById('ulDonations');
          loadMore = 'loadMoreDonations';
          loadMoreElement = document.getElementById('loadMoreDonations');
          loader = document.getElementById('loaderDonations');
          divToFill = document.getElementById('dataDonations');
          noDataDiv = document.getElementById('noDonationsDiv');
          ulId = '#ulDonations';
          break;
        case 'earnings':
          ulData = document.getElementById('ulEarnings');
          loadMore = 'loadMoreEarnings';
          loadMoreElement = document.getElementById('loadMoreEarnings');
          loader = document.getElementById('loaderEarnings');
          divToFill = document.getElementById('dataEarnings');
          noDataDiv = document.getElementById('noEarningsDiv');
          ulId = '#ulEarnings';
          break;
        case 'expenses':
          ulData = document.getElementById('ulPurchases');
          loadMore = 'loadMorePurchases';
          loadMoreElement = document.getElementById('loadMorePurchases');
          loader = document.getElementById('loaderPurchases');
          divToFill = document.getElementById('dataPurchase');
          noDataDiv = document.getElementById('noPurchasesDiv');
          ulId = '#ulPurchases';
          break;
        default:
          throw new Error('Invalid collection suffix');

      }
    } else {
      ulData = document.getElementById('ulSearch');
      loadMore = 'loadMorePurchases';
      loadMoreElement = document.getElementById('loadMorePurchases');
      loader = document.getElementById('loaderSearch');
      divToFill = document.getElementById('dataSearch');
      noDataDiv = document.getElementById('noSearchResults');
      ulId = '#ulSearch';
    }



    if (result.success != 'No history') {
      historyArray = result.data.data;
      totalRows = result.data.total;
    }

    if (historyArray && historyArray.length) {
      if (type == 'history') {
        showHideButtonLoader(loadMore, 'hideLoader');
        if (ulData.childElementCount == totalRows) {
          loadMoreElement.classList.add('displayNone');
        } else if (ulData.childElementCount < totalRows) {
          const from = parseInt(loadMoreElement.getAttribute('data-from')) + 10;
          loadMoreElement.setAttribute('data-from', from);
          loadMoreElement.classList.remove('displayNone');
        }
      } else {
        showHideButtonLoader('searchHistory', 'hideLoader');
      }


      if (historyArray.length > 0) {
        for (let i = 0; i < historyArray.length; i++) {
          if (historyArray[i].type == 0) {
            let li = document.createElement('li');
            li.style.opacity = "0"
            li.style.animation = "listPop 0.4s ease forwards"
            li.style.animationDelay = i * 0.05 + 's';
            li.setAttribute('data-time', historyArray[i].time);
            li.classList.add('liHistoryItem');

            let h3_Title = document.createElement('h3');
            h3_Title.classList.add('bolder');
            h3_Title.classList.add('defaultColor');
            h3_Title.classList.add('historyTitle');
            h3_Title.setAttribute('data-info', JSON.stringify(historyArray[i]));
            h3_Title.addEventListener('click', function (e) {
              showPopupInfo(JSON.parse(this.getAttribute('data-info')));
            })

            let h3_TUBE = document.createElement('h3');
            h3_TUBE.classList.add('leftSideHistory');
            h3_TUBE.classList.add('historyTube');

            let purchaseDate = document.createElement('p');
            purchaseDate.classList.add("historyDate");
            const date = new Date(historyArray[i].time);
            purchaseDate.innerHTML = formatDateHistory(date);


            if (historyArray[i].data.referenceId != undefined) {
              historyArray[i].data.type = 'purchase';
              historyArray[i].data.purchaseType = 'wiretransfer';
            }

            if (historyArray[i].data[0] != undefined) {
              if (historyArray[i].data[0]['paypal'] != undefined) {
                historyArray[i].data.type = 'purchase';
                historyArray[i].data.purchaseType = 'paypal';
              }
            }


            if (historyArray[i].data.gateway != undefined) {
              if (historyArray[i].data.gateway == 'coinbase') {
                historyArray[i].data.type = 'purchase';
                historyArray[i].data.purchaseType = 'crypto';
              } else if (historyArray[i].data.gateway == 'credit card') {
                historyArray[i].data.type = 'purchase';
                historyArray[i].data.purchaseType = 'credit card';
              }

            }

            if (historyArray[i].data.userPlatorm != undefined) {
              historyArray[i].data.type = 'donation';
            }


            switch (historyArray[i].data.type) {
              case 'registration':
                if (historyCollection == 'all' || historyCollection == 'earnings') {
                  h3_Title.textContent = 'Registration';
                  h3_TUBE.innerHTML = parseFloat(historyArray[i].data.amount).toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>';
                }

                break;
              case 'withdraw':
                if (historyCollection == 'all' || historyCollection == 'expenses') {
                  h3_Title.innerHTML = 'Withdrawal (' + historyArray[i].data.fromWallet + ')';
                  h3_TUBE.innerHTML = '-' + parseFloat(historyArray[i].data.amount).toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>';
                  h3_TUBE.classList.add('redColor');
                }
                break;

              case 'purchase':
                if (historyArray[i].data.purchaseType == 'wiretransfer') {
                  if (historyArray[i].data.state == 'Pending') {
                    h3_Title.innerHTML = i18next.t('wireTransferTitle') + ' <i class="mbsc-ic mbsc-ic-fa-clock-o"></i>';
                  } else {
                    h3_Title.innerHTML = i18next.t('wireTransferTitle');
                  }
                  h3_TUBE.innerHTML = historyArray[i].data.tubeamount + ' <i class="icon-font-tube tubeFont8"></i>'
                } else if (historyArray[i].data.purchaseType == 'paypal') {
                  h3_Title.textContent = 'Paypal';
                  let currencySymb
                  switch ( historyArray[i].data[0]['paypal']['payment']['transactions'][0]['amount'].currency){
                    case 'USD':
                      currencySymb = '&dollar;'
                    break;
                    case 'AUD':
                      currencySymb = 'A&dollar;'
                    break;
                    case 'GBP':
                      currencySymb = '&pound;'
                    break;
                    case 'NZD':
                      currencySymb = 'N&dollar;'
                    break;
                    case 'EUR':
                      currencySymb = '&euro;'
                    break;
                  }
                  h3_TUBE.innerHTML = historyArray[i].data[0]['paypal']['payment']['transactions'][0]['amount'].total + ' ' + currencySymb;
                } else if (historyArray[i].data.purchaseType == 'crypto') {
                  h3_Title.textContent = i18next.t('purchaseWithCrypto');
                  h3_TUBE.innerHTML = historyArray[i].data.tubeamount + ' <i class="icon-font-tube tubeFont8"></i>'
                } else if (historyArray[i].data.purchaseType == 'credit card' && historyArray[i].data.state.toLowerCase() == 'complete') {
                  h3_Title.textContent = i18next.t('pruchaseWithCC');
                  if (typeof (historyArray[i].data.tubeamount) === 'string') {
                    historyArray[i].data.tubeamount = new Number(historyArray[i].data.tubeamount);
                  } else {
                    historyArray[i].data.tubeamount = historyArray[i].data.tubeamount;
                  }
                  h3_TUBE.innerHTML = historyArray[i].data.tubeamount.toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>'
                }
                break;
              case 'donation':
                if (historyArray[i].data.user_sender === firebase.auth().currentUser.displayName && (historyCollection == 'all' || historyCollection == 'expenses')) {
                  if (historyArray[i].data.userPlatorm != undefined) {
                    if ( historyArray[i].data.userPlatorm == '310b0774-d5ef-e79d-9a7d-23bfa1c7ab95'){
                      h3_Title.textContent = i18next.t('donation') + ' ' + i18next.t('to') + ' ' + historyArray[i].data.userSocialId;
                    }else{
                      h3_Title.textContent = i18next.t('donation') + ' ' + i18next.t('to') + ' ' + historyArray[i].data.username;
                    }


                  } else {
                    h3_Title.textContent = historyArray[i].data.username;
                  }
                  h3_TUBE.classList.add('redColor');
                  h3_TUBE.innerHTML = '-' + parseFloat(historyArray[i].data.amount).toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>';
                } else {
                  if (historyArray[i].data.userPlatorm != undefined) {
                    if (historyArray[i].data.user_sender === undefined && (historyCollection == 'all' || historyCollection == 'expenses')) {
                      if ( historyArray[i].data.userPlatorm == '310b0774-d5ef-e79d-9a7d-23bfa1c7ab95'){
                        h3_Title.textContent =  i18next.t('donation').charAt(0).toUpperCase() + i18next.t('donation').slice(1) + ' ' + i18next.t('to') + ' ' + historyArray[i].data.userSocialId;
                      }else{
                        h3_Title.textContent = i18next.t('donation').charAt(0).toUpperCase() + i18next.t('donation').slice(1) + ' ' + i18next.t('to') + ' ' + historyArray[i].data.username;
                      }
                      h3_TUBE.classList.add('redColor');
                      h3_TUBE.innerHTML = '-' + parseFloat(historyArray[i].data.amount).toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>';
                    } else if (historyArray[i].data.user_sender !== undefined && (historyCollection == 'all' || historyCollection == 'earnings')) {
                      h3_Title.textContent = 'Donation from ' + historyArray[i].data.user_sender;
                      h3_TUBE.innerHTML = parseFloat(historyArray[i].data.amount).toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>';
                    }
                  } else {
                    h3_Title.textContent = historyArray[i].data.username;
                  }

                }

                break;
              case 'airtime':
                h3_Title.textContent = historyArray[i].data.type.charAt(0).toUpperCase() + historyArray[i].data.type.slice(1);
                h3_TUBE.innerHTML = parseFloat(historyArray[i].data.amount).toFixed(2) + ' <i class="icon-font-tube tubeFont8"></i>';
                break;
            } // END SWITCH

            if (h3_Title.innerHTML != '') {
              li.appendChild(h3_Title);
              li.appendChild(h3_TUBE);
              li.appendChild(purchaseDate);
              if (type == 'history') {
                ulData.appendChild(li);
              } else {
                ulData.appendChild(li);
              }
            } // END IF TITLE EMPTY

            mobiscroll.listview(ulId, {
              theme: 'ios',
              enhance: true,
              swipe: false
            });

            loader.classList.add('displayNone');
            noDataDiv.classList.add('displayNone');
            divToFill.classList.remove('displayNone');
            if (ulData.childElementCount == totalRows) {
              loadMoreElement.classList.add('displayNone');
            }

            if (type == 'search') {
              document.getElementById('searchHistoryForm').classList.remove('fadeIn');
              document.getElementById('searchHistoryForm').classList.add('fadeOut');
              document.getElementById('dataSearch').classList.remove('fadeOut');
              document.getElementById('dataSearch').classList.add('fadeIn');
            }


          } //END IF TYPE 0
        } //END FOR

      } //END HISTORY LENGTH
    } // END IF DATA
    else {
      if (ulData.children.length > 0) {
        showHideButtonLoader(loadMore, 'hideLoader');
        loadMoreElement.setAttribute('disabled', 'disabled');

      } else {
        if ( type != 'history' ){
          document.getElementById('searchHistoryForm').classList.add('displayNone');
          showHideButtonLoader('searchHistory', 'hideLoader');
        }

        loader.classList.add('displayNone');
        divToFill.classList.add('displayNone');
        noDataDiv.classList.remove('displayNone');

      }
    }

  }

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loaderDonations').classList.remove('displayNone');
    document.getElementById('noDonationsDiv').classList.add('displayNone');
    document.getElementById('dataDonations').classList.add('displayNone');
    document.getElementById('ulDonations').innerHTML = '';
    document.getElementById('loadMoreDonations').setAttribute('data-from', '0');
    getUSerHistory('all', 0);

    //  PLACEHOLDERS FORM SEARCH
    if(document.getElementById('searchHistoryForm') != null ){
        const allLabels = document.querySelectorAll(".dynamicLabel");
        const allInput = document.querySelectorAll(".loginInput");
        for(let i=0;i<allLabels.length;i++){
            switch(i){
                case 0:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('searchMinAmount');
                }, 650)

                break;
                case 1:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('searchMaxAmount');
                }, 650)

                break;
                case 2:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('searchDateFrom');
                }, 650)

                break;
                case 3:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('searchDateTo');
                }, 650)

                break;
            }
            allInput[i].addEventListener("focus",() => {
                allInput[i].placeholder=""
                allLabels[i].style.animation="labelAppear 0.5s ease-out forwards"
            })

        }


        const buttonsType = document.querySelectorAll('.buttonsSearchType');
        for(let i=0;i<buttonsType.length;i++){

            buttonsType[i].addEventListener("click",function(e){
               e.preventDefault();
               e.stopPropagation();
               setButtonHistoryActive(this);
               document.getElementById('searchHistory').setAttribute('data-historyType', this.id)
            })

        }

        mobiscroll.calendar('#dateFrom', {
            theme: 'mobiscroll',
            dateFormat: 'dd/mm/yy'
        });


        mobiscroll.calendar('#dateTo', {
            theme: 'mobiscroll',
            dateFormat: 'dd/mm/yy'
        });


        const dateFrom = document.getElementById('dateFrom');
        dateFrom.addEventListener('click', function(e){
            removeErrors(this);
        })

        const dateTo = document.getElementById('dateTo');
        dateTo.addEventListener('click', function(e){
            removeErrors(this);
        })

        const searchHistory = document.getElementById('searchHistory');
        searchHistory.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            if (checkDates()){
                showHideButtonLoader('searchHistory', 'showLoader');
                const type = this.getAttribute('data-historyType');

                let collection;
                switch (type){
                    case 'searchAll':
                        collection = 'all';
                    break;
                    case 'searchEarnings':
                        collection = 'earnings';
                    break;
                    case 'searchExpenses':
                        collection = 'expenses';
                    break;
                }

                getUSerHistory(collection, 0, 'search');
            }
        });

        const newSearch = document.getElementById('newSearch');
        newSearch.addEventListener('click', function(e){
            newSearchF();
        });

        const newSearchNoResult = document.getElementById('newSearchNoResult');
        if (newSearchNoResult != null){
            newSearchNoResult.addEventListener('click', function(e){
                hideNoResultsSearch();
                newSearchF();
            })
        }

    }
     // History Tabs
     if (document.getElementById('tabsHistory') != null ){
        mobiscroll.nav('#tabsHistory', {
          theme: 'ios',
          type: 'tab',
          cssClass: 'divTabsPublisher',
          onItemTap: function (event, inst) {
            document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
            document.querySelector('#apps-tab-' + event.target.getAttribute('data-tab')).classList.add('md-apps-tab-sel');

            //ONE TAB JS CODE

            //LEGACY MULTI-TABS
            if ( event.target.getAttribute('data-tab') == 'expenses' ){
                cleanTabOnClick('loaderPurchases', 'noPurchasesDiv', 'dataPurchase', 'ulPurchases');
                hideNoResultsSearch();
                newSearchF();
                document.getElementById('loadMorePurchases').setAttribute('data-from', '0');
                getUSerHistory('expenses', 0);
            } else if ( event.target.getAttribute('data-tab') == 'earnings' ){
                cleanTabOnClick('loaderEarnings', 'noEarningsDiv', 'dataEarnings', 'ulEarnings');
                hideNoResultsSearch();
                newSearchF();
                document.getElementById('loadMoreEarnings').setAttribute('data-from', '0');
                getUSerHistory('earnings', 0);
            } else if ( event.target.getAttribute('data-tab') == 'all' ){
                hideNoResultsSearch();
                newSearchF();
                cleanTabOnClick('loaderDonations', 'noDonationsDiv', 'dataDonations', 'ulDonations');
                document.getElementById('loadMoreDonations').removeAttribute('disabled');
                document.getElementById('loadMoreDonations').setAttribute('data-from', '0');
                getUSerHistory('all', 0);
            } else if ( event.target.getAttribute('data-tab') == 'search' ){
                document.getElementById('loaderSearch').classList.remove('displayNone');
                document.getElementById('searchHistoryForm').classList.add('fadeOut');
                document.getElementById('searchHistoryForm').classList.remove('fadeIn');
                document.getElementById('ulSearch').innerHTML = '';
                document.getElementById('minAmountToSearch').value = '';
                document.getElementById('maxAmountToSearch').value = '';
                document.getElementById('dateFrom').value = '';
                document.getElementById('dateTo').value = '';
                setTimeout(function(e){
                    document.getElementById('loaderSearch').classList.add('displayNone');
                    document.getElementById('searchHistoryForm').classList.remove('fadeOut');
                    document.getElementById('searchHistoryForm').classList.add('fadeIn');
                }, 1000);
            }
        }
        });
    }

    const loadMorePurchases = document.getElementById('loadMorePurchases');
    const loadMoreEarnings = document.getElementById('loadMoreEarnings');
    const loadMoreDonations = document.getElementById('loadMoreDonations');

    // button load more purchases;
    if (loadMorePurchases != null){
        loadMorePurchases.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            showHideButtonLoader('loadMorePurchases', 'showLoader');
            const query_from = this.getAttribute('data-from');
            getUSerHistory('expenses', query_from);
        })

    }

    // Buttom load more earnings;
    if (loadMoreEarnings != null){
        loadMoreEarnings.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();

            showHideButtonLoader('loadMoreEarnings', 'showLoader');
            const query_from = this.getAttribute('data-from');
            getUSerHistory('earnings', query_from);
        })

    }

    // Buttom load more donations;
    if (loadMoreDonations != null){
        loadMoreDonations.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            showHideButtonLoader('loadMoreDonations', 'showLoader');
            const query_from = this.getAttribute('data-from');
            getUSerHistory('all', query_from);
        })

    }

    function cleanTabOnClick(loader, div, divData, ulData){
        document.getElementById(loader).classList.remove('displayNone');
        document.getElementById(div).classList.add('displayNone');
        document.getElementById(divData).classList.add('displayNone');
        document.getElementById(ulData).innerHTML = '';
    }

    function setButtonHistoryActive(element){
        const buttonsType = document.querySelectorAll('.buttonsSearchType');
        for(let i=0;i<buttonsType.length;i++){
            buttonsType[i].classList.remove('selected');
        }
        element.classList.add('selected');

    }

    function checkDates(){
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        let errors;
        let elementsWithErrors;
        if (dateFrom.value === '' && dateTo.value === ''){
            errors = [i18next.t('fieldRequired'), i18next.t('fieldRequired')];
            elementsWithErrors = ['dateFrom', 'dateTo'];
            setErrors(errors, elementsWithErrors);
            return false;
        }else if (dateFrom.value === ''){
            errors = [i18next.t('fieldRequired')];
            elementsWithErrors = ['dateFrom'];
            setErrors(errors, elementsWithErrors);
            return false;
        }else if (dateTo.value === ''){
            errors = [i18next.t('fieldRequired')];
            elementsWithErrors = ['dateTo'];
            setErrors(errors, elementsWithErrors);
            return false;
        }else if(dateFrom.value !== '' && dateTo.value !== ''){
            return true;
        }
    }

    const hideNoResultsSearch = function(){
        document.getElementById('searchHistoryForm').classList.remove('displayNone');
        document.getElementById('noSearchResults').classList.add('displayNone');
    }
    const newSearchF = function(){
        document.getElementById('dataSearch').classList.remove('fadeIn');
        document.getElementById('dataSearch').classList.add('fadeOut');
        document.getElementById('searchHistoryForm').classList.remove('fadeOut');
        document.getElementById('ulSearch').innerHTML = '';

            const allLabels = document.querySelectorAll(".dynamicLabel");
            const allInput = document.querySelectorAll(".loginInput");
            for(let i=0;i<allLabels.length;i++){
                allInput[i].value = "";
                switch(i){
                    case 0:
                    allInput[i].placeholder="Min Amount";
                    break;
                    case 1:
                    allInput[i].placeholder="Max Amount";
                    break;
                    case 2:
                    allInput[i].placeholder="Date from";
                    break;
                    case 3:
                    allInput[i].placeholder="Date to";
                    break;
                }

                allLabels[i].style.animation="labelDisappear 0.5s ease-out forwards";
            }
    }

    const closeHistory = document.getElementById('closeHistory');
    if ( closeHistory != undefined ){
        closeHistory.addEventListener('click', function(e){
            window.location.href = '/account.html';
        })
    }
});