var uppward = chrome.extension.getBackgroundPage().uppward;
var flaggedResources = uppward.pref.getFlaggedResourcesLrdPage();

displayFlagged(flaggedResources);

function displayFlagged(flaggedResources) {

    var nodeBefore = document.getElementById('title');

    var element = document.createElement('div');
    element.className = 'list';
    element.innerHTML = getDisplayMarkup(flaggedResources);

    nodeBefore.parentNode.insertBefore(element, nodeBefore.nextSibling);

    var numSuspicious = document.getElementById('num-sus');
    numSuspicious.innerHTML = flaggedResources.length;

}

function getDisplayMarkup(flaggedResources){

    try {
        var m = [];

        var count = 0

        // push header
        m.push('<div class="header">');
        m.push('    <div class="number">No</div>');
        m.push('    <div class="url">URL</div>');
        m.push('    <div class="more"></div>');
        m.push('</div>');

        flaggedResources.forEach(function(fr){
            count++
            m.push('<div class="row">');
            m.push('    <div class="left">');
            m.push('        <div class="number">' + count + '</div>');
            m.push('        <div class="url">' + fr.original + '</div>');
            m.push('    </div>');
            m.push('    <div class="right">');
            m.push('        <div class="more">');
            m.push('            <a href="' + fr.link  + '" target="_blank">About more</a>');
            m.push('        </div>');
            m.push('    </div>');
            m.push('</div>');
        })

        return m.join('');
    } catch (err) {
        console.log('error')
        //console.log(err)
    }

}