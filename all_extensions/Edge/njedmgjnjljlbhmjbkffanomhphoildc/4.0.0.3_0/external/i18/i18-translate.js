var path;

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
  path = chrome.runtime.getURL('/_locales/{{lng}}/extension.json'); // For chrome, Gets url based on manifest root dynamically
} else if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
  path = browser.runtime.getURL('/_locales/{{lng}}/extension.json'); // For firefox, Gets url based on manifest root dynamically
} else {
  switch (checkBrowser()) { // Original, as fallback of sorts.
    case 'chrome':
      path = 'chrome-extension://cnogbbmciffpibmkphohpebghmomaemi/_locales/{{lng}}/extension.json';
      break;
    default:
      path = window.location.origin + '/_locales/{{lng}}/extension.json'; // Does this actually work anywhere?
      break;
  }
}

i18next
  .use(i18nextXHRBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator'],
      // keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      // cache user language on
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    backend: {
      loadPath: path, //_locales/{{lng}}/extension.json',
    }
  }, function(err, t) {
        localize = locI18next.init(i18next);
        localize('.translate');
  });

  function checkBrowser(){

    var google_chrome   = navigator.userAgent.indexOf('Chrome') > -1;
    var edge = (/Edge\/\d./i.test(navigator.userAgent))
    var firefox  = navigator.userAgent.indexOf('Firefox') > -1;
    var safari   = navigator.userAgent.indexOf("Safari") > -1;
    var opera    = navigator.userAgent.indexOf(' OPR/') > -1;
    
    var browserName;
  
      if ((google_chrome) && (safari)) safari = false;
  
      if((google_chrome) && (edge)){
          google_chrome = false;
      }
  
      if( (google_chrome) && (opera)) google_chrome = false;
    
      if (google_chrome){
        browserName = 'chrome';
      }else if(firefox){
        browserName = 'firefox';
      }else if(safari){
        browserName = 'safari';
      }else if (edge){
        browserName = 'edge';
      }else if (opera){
        browserName = 'opera';
      }
      return browserName;
}

  //order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],


