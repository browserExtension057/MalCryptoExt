// languages.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 


// Languages
	
$("#language_bt").click(function(){
	 $("#languagemodal").fadeIn(100);
		$('#languagemodal').animate({left:'0%'}, 200, 'swing', function() {});	
  $("ul.listlanguages").animate({ scrollTop: 0 }, 100);
  return false;
});

$("#languageclose").click(function(){
 $('#languagemodal').animate({left:'+=100%'}, 200, 'swing', function() {});	
});

// Reset search 

$(".resetsearch").click(function() {
	$(".languagesearch").val("");
	$('.notfound').hide();
	$('.listlanguages li').fadeIn(100);
	$(".resetsearch").hide();
});

				
// Input reset

$(".languagesearch").keyup(function(event){
		var val = $(this).val();
		if (val.length > 0){
			$(".resetsearch").show();
			}
		else{
			$(".resetsearch").hide();
	}	
});
			
	
// Order - list languages

var $list = $("#list");

$list.children().detach().sort(function(a, b) {
    return $(a).text().localeCompare($(b).text());
}).appendTo($list);


// Search language 

$('#languagesearch').bind('keyup', function() {
		var searchString = $(this).val();
		var count = 0;
		$(".listlanguages li").each(function(index, value) {
			currentName = $(value).text()
				if( currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
									$(value).show();
									count++;
							}
			else{
									$(value).hide();
							}  
		});
			if (count != 0) 
						{
								$('.listlanguages').find('.notfound').hide();
						}
		else{
								$('.listlanguages').find('.notfound').show();
						}						  
});

// Save selected language

savelanguage = function () {
		$('.configuration-settings').hide(); 
		$('.configuration_active').addClass('configuration'); 
		$('.configuration').removeClass('configuration_active');
		localStorage.setItem('Configuration', 'off'); 
		$('body').addClass('height_auto'); 
		$('body').removeClass('height_500'); 			
		$('body').removeClass('height_500_2');	
	 window.top.location.reload();
};

$(document).ready(function() {

// de - German

DE = function () {
  localStorage.setItem('Language', 'de');
		$('#selectedlanguage').text(de);
		$('.listlanguages li a').removeClass('active');
		$('#bt_de').addClass('active');
	 $('#list').find('#li_de').insertBefore('li:eq(0)');			
};

// bn - Bengali

BN = function () {
  localStorage.setItem('Language', 'bn');
		$('#selectedlanguage').text(bn);
		$('.listlanguages li a').removeClass('active');
		$('#bt_bn').addClass('active');			
	 $('#list').find('#li_bn').insertBefore('li:eq(0)');		
};

// bg - Bulgarian

BG = function () {
  localStorage.setItem('Language', 'bg');
		$('#selectedlanguage').text(bg);
		$('.listlanguages li a').removeClass('active');
		$('#bt_bg').addClass('active');	
	 $('#list').find('#li_bg').insertBefore('li:eq(0)');		
};

// ca - Catalan

CA = function () {
  localStorage.setItem('Language', 'ca');
		$('#selectedlanguage').text(ca);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ca').addClass('active');	
	 $('#list').find('#li_ca').insertBefore('li:eq(0)');				
};

// cs - Czech

CS = function () {
  localStorage.setItem('Language', 'cs');
		$('#selectedlanguage').text(cs);
		$('.listlanguages li a').removeClass('active');
		$('#bt_cs').addClass('active');		
	 $('#list').find('#li_cs').insertBefore('li:eq(0)');				
};

// zh_CN - Chinese (China)

ZH_CN = function () {
  localStorage.setItem('Language', 'zh_CN');
		$('#selectedlanguage').text(zh_CN);
		$('.listlanguages li a').removeClass('active');
		$('#bt_zh_CN').addClass('active');
	 $('#list').find('#li_zh_CN').insertBefore('li:eq(0)');							
};

// zh_TW - Chinese (Taiwan)

ZH_TW = function () {
  localStorage.setItem('Language', 'zh_TW');
		$('#selectedlanguage').text(zh_TW);
		$('.listlanguages li a').removeClass('active');
		$('#bt_zh_TW').addClass('active');	
	 $('#list').find('#li_zh_TW').insertBefore('li:eq(0)');			
};

// ko - Korean

KO = function () {
  localStorage.setItem('Language', 'ko');
		$('#selectedlanguage').text(ko);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ko').addClass('active');	
	 $('#list').find('#li_ko').insertBefore('li:eq(0)');						
};

// hr - Croatian

HR = function () {
  localStorage.setItem('Language', 'hr');
		$('#selectedlanguage').text(hr);
		$('.listlanguages li a').removeClass('active');
		$('#bt_hr').addClass('active');		
	 $('#list').find('#li_hr').insertBefore('li:eq(0)');					
};

// da - Danish

DA = function () {
  localStorage.setItem('Language', 'da');
		$('#selectedlanguage').text(da);
		$('.listlanguages li a').removeClass('active');
		$('#bt_da').addClass('active');	
	 $('#list').find('#li_da').insertBefore('li:eq(0)');				
};

// sk - Slovak

SK = function () {
  localStorage.setItem('Language', 'sk');
		$('#selectedlanguage').text(sk);
		$('.listlanguages li a').removeClass('active');
		$('#bt_sk').addClass('active');		
	 $('#list').find('#li_sk').insertBefore('li:eq(0)');				
};

// sl - Slovenian

SL = function () {
  localStorage.setItem('Language', 'sl');
		$('#selectedlanguage').text(sl);
		$('.listlanguages li a').removeClass('active');
		$('#bt_sl').addClass('active');
	 $('#list').find('#li_sl').insertBefore('li:eq(0)');						
};

// es - Spanish

ES = function () {
  localStorage.setItem('Language', 'es');
		$('#selectedlanguage').text(es);
		$('.listlanguages li a').removeClass('active');
		$('#bt_es').addClass('active');	
	 $('#list').find('#li_es').insertBefore('li:eq(0)');				
};

// et - Estonian

ET = function () {
  localStorage.setItem('Language', 'et');
		$('#selectedlanguage').text(et);
		$('.listlanguages li a').removeClass('active');
		$('#bt_et').addClass('active');
	 $('#list').find('#li_et').insertBefore('li:eq(0)');						
};

// fil - Filipino

FIL = function () {
  localStorage.setItem('Language', 'fil');
		$('#selectedlanguage').text(fil);
		$('.listlanguages li a').removeClass('active');
		$('#bt_fil').addClass('active');	
	 $('#list').find('#li_fil').insertBefore('li:eq(0)');							
};

// fi - Finnish

FI = function () {
  localStorage.setItem('Language', 'fi');
		$('#selectedlanguage').text(fi);
		$('.listlanguages li a').removeClass('active');
		$('#bt_fi').addClass('active');
	 $('#list').find('#li_fi').insertBefore('li:eq(0)');								
};

// fr - French

FR = function () {
  localStorage.setItem('Language', 'fr');
		$('#selectedlanguage').text(fr);
		$('.listlanguages li a').removeClass('active');
		$('#bt_fr').addClass('active');	
	 $('#list').find('#li_fr').insertBefore('li:eq(0)');								
};

// el - Greek

EL = function () {
  localStorage.setItem('Language', 'el');
		$('#selectedlanguage').text(el);
		$('.listlanguages li a').removeClass('active');
		$('#bt_el').addClass('active');	
	 $('#list').find('#li_el').insertBefore('li:eq(0)');				
};

// gu - Gujarati

GU = function () {
  localStorage.setItem('Language', 'gu');
		$('#selectedlanguage').text(gu);
		$('.listlanguages li a').removeClass('active');
		$('#bt_gu').addClass('active');	
	 $('#list').find('#li_gu').insertBefore('li:eq(0)');				
};

// he - Hebrew

HE = function () {
  localStorage.setItem('Language', 'he');
		$('#selectedlanguage').text(he);
		$('.listlanguages li a').removeClass('active');
		$('#bt_he').addClass('active');	
	 $('#list').find('#li_he').insertBefore('li:eq(0)');									
};

// hi - Hindi

HI = function () {
  localStorage.setItem('Language', 'hi');
		$('#selectedlanguage').text(hi);
		$('.listlanguages li a').removeClass('active');
		$('#bt_hi').addClass('active');		
	 $('#list').find('#li_hi').insertBefore('li:eq(0)');					
};

// nl - Dutch

NL = function () {
  localStorage.setItem('Language', 'nl');
		$('#selectedlanguage').text(nl);
		$('.listlanguages li a').removeClass('active');
		$('#bt_nl').addClass('active');	
	 $('#list').find('#li_nl').insertBefore('li:eq(0)');					
};

// hu - Hungarian

HU = function () {
  localStorage.setItem('Language', 'hu');
		$('#selectedlanguage').text(hu);
		$('.listlanguages li a').removeClass('active');
		$('#bt_hu').addClass('active');
	 $('#list').find('#li_hu').insertBefore('li:eq(0)');								
};

// id - Indonesian

ID = function () {
  localStorage.setItem('Language', 'id');
		$('#selectedlanguage').text(id);
		$('.listlanguages li a').removeClass('active');
		$('#bt_id').addClass('active');	
	 $('#list').find('#li_id').insertBefore('li:eq(0)');						
};

// en_US - English (USA)

EN_US = function () {
  localStorage.setItem('Language', 'en_US');
		$('#selectedlanguage').text(en_US);
		$('.listlanguages li a').removeClass('active');
		$('#bt_en_US').addClass('active');	
	 $('#list').find('#li_en_US').insertBefore('li:eq(0)');							
};

// en_GB - English (Great Britain)

EN_GB = function () {
  localStorage.setItem('Language', 'en_GB');
		$('#selectedlanguage').text(en_GB);
		$('.listlanguages li a').removeClass('active');
		$('#bt_en_GB').addClass('active');	
	 $('#list').find('#li_en_GB').insertBefore('li:eq(0)');				
};

// it - Italian

IT = function () {
  localStorage.setItem('Language', 'it');
		$('#selectedlanguage').text(it);
		$('.listlanguages li a').removeClass('active');
		$('#bt_it').addClass('active');	
	 $('#list').find('#li_it').insertBefore('li:eq(0)');				
};

// ja - Japanese

JA = function () {
  localStorage.setItem('Language', 'ja');
		$('#selectedlanguage').text(ja);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ja').addClass('active');
	 $('#list').find('#li_ja').insertBefore('li:eq(0)');		
};

// lv - Latvian

LV = function () {
  localStorage.setItem('Language', 'lv');
		$('#selectedlanguage').text(lv);
		$('.listlanguages li a').removeClass('active');
		$('#bt_lv').addClass('active');	
	 $('#list').find('#li_lv').insertBefore('li:eq(0)');				
};

// lt - Lithuanian

LT = function () {
  localStorage.setItem('Language', 'lt');
		$('#selectedlanguage').text(lt);
		$('.listlanguages li a').removeClass('active');
		$('#bt_lt').addClass('active');	
	 $('#list').find('#li_lt').insertBefore('li:eq(0)');					
};

// ms - Malay

MS = function () {
  localStorage.setItem('Language', 'ms');
		$('#selectedlanguage').text(ms);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ms').addClass('active');		
	 $('#list').find('#li_ms').insertBefore('li:eq(0)');							
};

// mr - Marathi

MR = function () {
  localStorage.setItem('Language', 'mr');
		$('#selectedlanguage').text(mr);
		$('.listlanguages li a').removeClass('active');
		$('#bt_mr').addClass('active');	
	 $('#list').find('#li_mr').insertBefore('li:eq(0)');				
};

// no - Norwegian

NO = function () {
  localStorage.setItem('Language', 'no');
		$('#selectedlanguage').text(no);
		$('.listlanguages li a').removeClass('active');
		$('#bt_no').addClass('active');
	 $('#list').find('#li_no').insertBefore('li:eq(0)');					
};

// fa - Persian

FA = function () {
  localStorage.setItem('Language', 'fa');
		$('#selectedlanguage').text(fa);
		$('.listlanguages li a').removeClass('active');
		$('#bt_fa').addClass('active');	
	 $('#list').find('#li_fa').insertBefore('li:eq(0)');				
};

// pl - Polish

PL = function () {
  localStorage.setItem('Language', 'pl');
		$('#selectedlanguage').text(pl);
		$('.listlanguages li a').removeClass('active');
		$('#bt_pl').addClass('active');	
	 $('#list').find('#li_pl').insertBefore('li:eq(0)');					
};

// pt_BR - Portuguese (Brazil)

PT_BR = function () {
  localStorage.setItem('Language', 'pt_BR');
		$('#selectedlanguage').text(pt_BR);
		$('.listlanguages li a').removeClass('active');
		$('#bt_pt_BR').addClass('active');	
	 $('#list').find('#li_pt_BR').insertBefore('li:eq(0)');					
};

// pt_PT - Portuguese (Portugal)

PT_PT = function () {
  localStorage.setItem('Language', 'pt_PT');
		$('#selectedlanguage').text(pt_PT);
		$('.listlanguages li a').removeClass('active');
		$('#bt_pt_PT').addClass('active');	
	 $('#list').find('#li_pt_PT').insertBefore('li:eq(0)');					
};

// ro - Romanian

RO = function () {
  localStorage.setItem('Language', 'ro');
		$('#selectedlanguage').text(ro);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ro').addClass('active');	
	 $('#list').find('#li_ro').insertBefore('li:eq(0)');				
};

// ru - Russian

RU = function () {
  localStorage.setItem('Language', 'ru');
		$('#selectedlanguage').text(ru);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ru').addClass('active');	
	 $('#list').find('#li_ru').insertBefore('li:eq(0)');							
};


// sr - Serbian

SR = function () {
  localStorage.setItem('Language', 'sr');
		$('#selectedlanguage').text(sr);
		$('.listlanguages li a').removeClass('active');
		$('#bt_sr').addClass('active');	
	 $('#list').find('#li_sr').insertBefore('li:eq(0)');			
};

// sv - Swedish

SV = function () {
  localStorage.setItem('Language', 'sv');
		$('#selectedlanguage').text(sv);
		$('.listlanguages li a').removeClass('active');
		$('#bt_sv').addClass('active');	
	 $('#list').find('#li_sv').insertBefore('li:eq(0)');				
};

// th - Thai

TH = function () {
  localStorage.setItem('Language', 'th');
		$('#selectedlanguage').text(th);
		$('.listlanguages li a').removeClass('active');
		$('#bt_th').addClass('active');	
	 $('#list').find('#li_th').insertBefore('li:eq(0)');			
};

// ta - Tamil

TA = function () {
  localStorage.setItem('Language', 'ta');
		$('#selectedlanguage').text(ta);
		$('.listlanguages li a').removeClass('active');
		$('#bt_ta').addClass('active');	
	 $('#list').find('#li_ta').insertBefore('li:eq(0)');				
};

// te - Telugu

TE = function () {
  localStorage.setItem('Language', 'te');
		$('#selectedlanguage').text(te);
		$('.listlanguages li a').removeClass('active');
		$('#bt_te').addClass('active');	
	 $('#list').find('#li_te').insertBefore('li:eq(0)');						
};

// tr - Turkish

TR = function () {
  localStorage.setItem('Language', 'tr');
		$('#selectedlanguage').text(tr);
		$('.listlanguages li a').removeClass('active');
		$('#bt_tr').addClass('active');	
	 $('#list').find('#li_tr').insertBefore('li:eq(0)');					
};

// uk - Ukrainian

UK = function () {
  localStorage.setItem('Language', 'uk');
		$('#selectedlanguage').text(uk);
		$('.listlanguages li a').removeClass('active');
		$('#bt_uk').addClass('active');	
	 $('#list').find('#li_uk').insertBefore('li:eq(0)');							
};

// vi - Vietnamese

VI = function () {
  localStorage.setItem('Language', 'vi');
		$('#selectedlanguage').text(vi);
		$('.listlanguages li a').removeClass('active');
		$('#bt_vi').addClass('active');	
	 $('#list').find('#li_vi').insertBefore('li:eq(0)');									
};



// Button language 

$("#bt_bg").click(function(){localStorage.setItem('Language', 'bg'); BG(); savelanguage();});	
$("#bt_bn").click(function(){localStorage.setItem('Language', 'bn'); BN(); savelanguage();});		
$("#bt_ca").click(function(){localStorage.setItem('Language', 'ca'); CA(); savelanguage();});
$("#bt_cs").click(function(){localStorage.setItem('Language', 'cs'); CS(); savelanguage();});
$("#bt_da").click(function(){localStorage.setItem('Language', 'da'); DA(); savelanguage();});
$("#bt_de").click(function(){localStorage.setItem('Language', 'de'); DE(); savelanguage();});
$("#bt_el").click(function(){localStorage.setItem('Language', 'el'); EL(); savelanguage();});
$("#bt_en_US").click(function(){localStorage.setItem('Language', 'en_US'); EN_US(); savelanguage();});
$("#bt_en_GB").click(function(){localStorage.setItem('Language', 'en_GB'); EN_GB(); savelanguage();});
$("#bt_es").click(function(){localStorage.setItem('Language', 'es'); ES(); savelanguage();});
$("#bt_et").click(function(){localStorage.setItem('Language', 'et'); ET(); savelanguage();});
$("#bt_fa").click(function(){localStorage.setItem('Language', 'fa'); FA(); savelanguage();});
$("#bt_fi").click(function(){localStorage.setItem('Language', 'fi'); FI(); savelanguage();});
$("#bt_fil").click(function(){localStorage.setItem('Language', 'fil'); FIL(); savelanguage();});
$("#bt_fr").click(function(){localStorage.setItem('Language', 'fr'); FR(); savelanguage();});
$("#bt_gu").click(function(){localStorage.setItem('Language', 'gu'); GU(); savelanguage();});
$("#bt_he").click(function(){localStorage.setItem('Language', 'he'); HE(); savelanguage();});
$("#bt_hi").click(function(){localStorage.setItem('Language', 'hi'); HI(); savelanguage();});
$("#bt_hr").click(function(){localStorage.setItem('Language', 'hr'); HR(); savelanguage();});
$("#bt_hu").click(function(){localStorage.setItem('Language', 'hu'); HU(); savelanguage();});
$("#bt_id").click(function(){localStorage.setItem('Language', 'id'); ID(); savelanguage();});
$("#bt_it").click(function(){localStorage.setItem('Language', 'it'); IT(); savelanguage();});
$("#bt_ja").click(function(){localStorage.setItem('Language', 'ja'); JA(); savelanguage();});
$("#bt_ko").click(function(){localStorage.setItem('Language', 'ko'); KO(); savelanguage();});
$("#bt_lt").click(function(){localStorage.setItem('Language', 'lt'); LT(); savelanguage();});
$("#bt_lv").click(function(){localStorage.setItem('Language', 'lv'); LV(); savelanguage();});
$("#bt_mr").click(function(){localStorage.setItem('Language', 'mr'); MR(); savelanguage();});
$("#bt_ms").click(function(){localStorage.setItem('Language', 'ms'); MS(); savelanguage();});
$("#bt_nl").click(function(){localStorage.setItem('Language', 'nl'); NL(); savelanguage();});
$("#bt_no").click(function(){localStorage.setItem('Language', 'no'); NO(); savelanguage();});
$("#bt_pl").click(function(){localStorage.setItem('Language', 'pl'); PL(); savelanguage();});
$("#bt_pt_BR").click(function(){localStorage.setItem('Language', 'pt_BR'); PT_BR(); savelanguage();});
$("#bt_pt_PT").click(function(){localStorage.setItem('Language', 'pt_PT'); PT_PT(); savelanguage();});
$("#bt_ro").click(function(){localStorage.setItem('Language', 'ro'); RO(); savelanguage();});
$("#bt_ru").click(function(){localStorage.setItem('Language', 'ru'); RU(); savelanguage();});
$("#bt_sk").click(function(){localStorage.setItem('Language', 'sk'); SK(); savelanguage();});
$("#bt_sl").click(function(){localStorage.setItem('Language', 'sl'); SL(); savelanguage();});
$("#bt_sr").click(function(){localStorage.setItem('Language', 'sr'); SR(); savelanguage();});
$("#bt_sv").click(function(){localStorage.setItem('Language', 'sv'); SV(); savelanguage();});
$("#bt_ta").click(function(){localStorage.setItem('Language', 'ta'); TA(); savelanguage();});
$("#bt_te").click(function(){localStorage.setItem('Language', 'te'); TE(); savelanguage();});
$("#bt_th").click(function(){localStorage.setItem('Language', 'th'); TH(); savelanguage();});
$("#bt_tr").click(function(){localStorage.setItem('Language', 'tr'); TR(); savelanguage();});
$("#bt_uk").click(function(){localStorage.setItem('Language', 'uk'); UK(); savelanguage();});
$("#bt_vi").click(function(){localStorage.setItem('Language', 'vi'); VI(); savelanguage();});
$("#bt_zh_CN").click(function(){localStorage.setItem('Language', 'zh_CN'); ZH_CN(); savelanguage();});
$("#bt_zh_TW").click(function(){localStorage.setItem('Language', 'zh_TW'); ZH_TW(); savelanguage();});


// Check localStorage

if (localStorage.getItem('Language') == 'bg') { BG();}
if (localStorage.getItem('Language') == 'bn') { BN();}
if (localStorage.getItem('Language') == 'ca') { CA();}
if (localStorage.getItem('Language') == 'cs') { CS();}
if (localStorage.getItem('Language') == 'da') { DA();}
if (localStorage.getItem('Language') == 'de') { DE();}
if (localStorage.getItem('Language') == 'el') { EL();}
if (localStorage.getItem('Language') == 'en_US') { EN_US();}
if (localStorage.getItem('Language') == 'en_GB') { EN_GB();}
if (localStorage.getItem('Language') == 'es') { ES();}
if (localStorage.getItem('Language') == 'et') { ET();}
if (localStorage.getItem('Language') == 'fa') { FA();}
if (localStorage.getItem('Language') == 'fi') { FI();}
if (localStorage.getItem('Language') == 'fil') { FIL();}
if (localStorage.getItem('Language') == 'fr') { FR();}
if (localStorage.getItem('Language') == 'gu') { GU();}
if (localStorage.getItem('Language') == 'he') { HE();}
if (localStorage.getItem('Language') == 'hi') { HI();}
if (localStorage.getItem('Language') == 'hr') { HR();}
if (localStorage.getItem('Language') == 'hu') { HU();}
if (localStorage.getItem('Language') == 'id') { ID();}
if (localStorage.getItem('Language') == 'it') { IT();}
if (localStorage.getItem('Language') == 'ja') { JA();}
if (localStorage.getItem('Language') == 'ko') { KO();}
if (localStorage.getItem('Language') == 'lt') { LT();}
if (localStorage.getItem('Language') == 'lv') { LV();}
if (localStorage.getItem('Language') == 'mr') { MR();}
if (localStorage.getItem('Language') == 'ms') { MS();}
if (localStorage.getItem('Language') == 'nl') { NL();}
if (localStorage.getItem('Language') == 'no') { NO();}
if (localStorage.getItem('Language') == 'pl') { PL();}
if (localStorage.getItem('Language') == 'pt_BR') { PT_BR();}
if (localStorage.getItem('Language') == 'pt_PT') { PT_PT();}
if (localStorage.getItem('Language') == 'ro') { RO();}
if (localStorage.getItem('Language') == 'ru') { RU();}
if (localStorage.getItem('Language') == 'sk') { SK();}
if (localStorage.getItem('Language') == 'sl') { SL();}
if (localStorage.getItem('Language') == 'sr') { SR();}
if (localStorage.getItem('Language') == 'sv') { SV();}
if (localStorage.getItem('Language') == 'ta') { TA();}
if (localStorage.getItem('Language') == 'te') { TE();}
if (localStorage.getItem('Language') == 'th') { TH();}
if (localStorage.getItem('Language') == 'tr') { TR();}
if (localStorage.getItem('Language') == 'uk') { UK();}
if (localStorage.getItem('Language') == 'vi') { VI();}
if (localStorage.getItem('Language') == 'zh_CN') { ZH_CN();}
if (localStorage.getItem('Language') == 'zh_TW') { ZH_TW();}

});
// languages.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 