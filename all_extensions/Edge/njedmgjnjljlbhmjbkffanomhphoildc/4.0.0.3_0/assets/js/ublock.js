document.addEventListener('DOMContentLoaded',  function(){
    const allSwitches = document.querySelectorAll(".toolToggle")
    for(let i=0;i<5;i++){
        allSwitches[i].addEventListener("click",() => {
            if(allSwitches[i].dataset.active==0){
                allSwitches[i].querySelector(".mbsc-switch-track").classList.add("active")
                allSwitches[i].dataset.active=1
                allSwitches[i].classList.add("on")
                setTimeout(() => {
                    if(document.body.classList.contains("dirty")){
                        document.querySelector(".refreshFrame").style.display="block"
                    }
                },20)


            }
            else{
                allSwitches[i].querySelector(".mbsc-switch-track").classList.remove("active")
                allSwitches[i].dataset.active=0
                allSwitches[i].classList.remove("on")
                setTimeout(() => {
                    if(!document.body.classList.contains("dirty")){
                        document.querySelector(".refreshFrame").style.display="none"
                    }
                    else{
                        document.querySelector(".refreshFrame").style.display="block"
                    }
                },20)
            }
        })
    }




})