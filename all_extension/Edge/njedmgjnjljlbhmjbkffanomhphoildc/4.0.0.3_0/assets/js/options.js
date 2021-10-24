document.addEventListener('DOMContentLoaded', function() {
    // Buttons to add click

    mobiscroll.nav('#navigation', { theme: 'ios' });

    const divCountryCode = document.getElementById('divCountryCode');
    if (divCountryCode != null){
        divCountryCode.addEventListener('click', function(){
            document.getElementById('countriesDiv').style.top = '115px';
        });
    }

    const closeSearchCountry = document.getElementById('closeSearchCountry');
    if ( closeSearchCountry != null ){
        closeSearchCountry.addEventListener('click', function(e){
            document.getElementById('countriesDiv').style.top = '600px';
        })
    }

    if(document.getElementById('linkBankForm') != null ){
        const allLabels = document.querySelectorAll(".labelBank")
        const allInput = document.querySelectorAll(".bankInput")
        for(let i=0;i < allLabels.length;i++){
            switch(i){
                case 0:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('accountName');
                }, 500);

                break;
                case 1:
                    setTimeout(function(e){
                        allInput[i].placeholder = i18next.t('firstName');
                    }, 500);

                break;
                case 2:
                    setTimeout(function(e){
                        allInput[i].placeholder = i18next.t('lastName');
                    }, 500);

                break;
                case 3:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('accountNumber');
                }, 500);
                break;
                case 4:
                    allInput[i].placeholder = 'BIC/SWIFT';//i18next.t('password');
                break;
                case 5:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('verificationCode');// 'Verification Code';//i18next.t('password');
                }, 500);
                break;
            }
            allInput[i].addEventListener("focus",() => {
                removeErrors(allInput[i]);
                allInput[i].placeholder=""
                allLabels[i].style.animation="labelAppear 0.5s ease-out forwards"
            });

            allInput[i].addEventListener("blur",() => {
                if (allInput[i].value == ''){
                    switch(i){
                        case 0:
                            setTimeout(function(e){
                                allInput[i].placeholder = i18next.t('accountName');
                            }, 500);
                            setLocalStorageAccount();

                        break;
                        case 1:
                            setTimeout(function(e){
                                allInput[i].placeholder = i18next.t('firstName');
                            }, 500);
                            setLocalStorageAccount();
                        break;
                        case 2:
                            setTimeout(function(e){
                                allInput[i].placeholder = i18next.t('lastName');
                            }, 500);
                            setLocalStorageAccount();
                        break;
                        case 3:
                        setTimeout(function(e){
                            allInput[i].placeholder = i18next.t('accountNumber');
                        }, 500);
                            setLocalStorageAccount();
                        break;
                        case 4:
                            allInput[i].placeholder = 'BIC/SWIFT';//i18next.t('password');
                            setLocalStorageAccount();
                        break;
                        case 5:
                        setTimeout(function(e){
                            allInput[i].placeholder = i18next.t('verificationCode');// 'Verification Code';//i18next.t('password');
                        }, 500);
                        break;
                    }

                    allLabels[i].style.animation = "labelDisappear 0.5s ease-out forwards"
                }

            });

        }
    }

    function setLocalStorageAccount(){
        const obj = {
            accountName:  document.getElementById('accountName').value || '',
            firstName: document.getElementById('firstName').value || '',
            lastName: document.getElementById('lastName').value || '',
            IBAN: document.getElementById('userIBAN').value || '',
            BIC: document.getElementById('bic-swift').value || ''

        }
        localStorageEx.set('userInfoAccount', obj, 300);
    }
})