var ERROR = 'error';
var baseURL = 'http://srt.bz/';
function isValidURL(url){
    var pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    if(pattern.test(url)){
        return true;
    }else{
        return false;
    }
}
function is_url(str)
{
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function generateURL() {
    var url =  $('#urlInput').val();
    if(!is_url(url)){
        showNotification(ERROR,"Please provide a valid url.");
        return false;
    } else{
        generateShortenURL(url);
    }
}

function generateShortenURL(url) {
    $.ajax({
        url: "http://localhost:8080/openapi?url="+encodeURIComponent(url),
        cache: true,
        success: function(result){
            console.log("asd : "  +result);
            $('#targetURL').val(result.targetURL)
            createNotificationForURL(result.shortURL);
            $('#shortenURLHeader').text(result.shortURL);
            $('#shortenURLHeader').attr('href',result.shortURL);
            $('#shortenSufix').val(result.shortURL);
            $('#shortenURLModel').modal('show');
            $("#QRCodeURL").attr("src", "http://localhost:8080/qrcode?text=" + result.shortURL);
        }
    });
}

function showNotification(type,msg) {

    if(type == ERROR) {
        iziToast.error({
            id: 'error',
            title: 'Error',
            message: msg,
            position: 'topRight',
            transitionIn: 'fadeInDown'
        });
    }

}

function copyToClipBoard(){
    /* Select the text field */
    $("#shortenSufix").select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    iziToast.info({
        id: 'info',
        title: 'Info',
        message: 'Copied to clipboard.',
        position: 'topRight',
        transitionIn: 'fadeInDown'
    });
}

function createNotificationForURL(shortURL) {

    iziToast.show({
        id: 'haduken',
        theme: 'dark',
        icon: 'icon-contacts',
        title: 'Hey',
        displayMode: 2,
        message: 'Hi, Shorten URL has been generated successfully.',
        position: 'bottomCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(0, 255, 184)',
        image: 'img/avatar.jpg',
        imageWidth: 70,
        layout: 2,
        image: 'images/qrcode.png',
        balloon: true,
        buttons: [
            ['<button>Copy URL</button>',
                function(instance, toast) {
                    iziToast.show({
                        theme: 'dark',
                        icon: 'icon-photo',
                        message: 'Copied to clipboard.',
                        position: 'topRight',
                        // iconText: 'star',
                    });
                    /* Select the text field */
                    $("#shortenSufix").select();
                    /* Copy the text inside the text field */
                    document.execCommand("copy");
                },
                true
            ],
            ['<button>Open URL</button>',
                function(instance, toast) {

                    iziToast.show({
                        theme: 'dark',
                        icon: 'icon-ondemand_video',
                        message: 'Opening URL in New Tab.',
                        position: 'topRight',
                        // iconText: 'star',
                    });
                    window.open(shortURL,'_blank');

                }
            ]
        ]
    });

}


/**
 * Clearable text inputs
 */
function tog(v){return v?'addClass':'removeClass';}
$(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
});

// $('.clearable').trigger("input");
// Uncomment the line above if you pre-fill values from LS or server


var twitterShare = document.querySelector('[data-js="twitter-share"]');

twitterShare.onclick = function(e) {
    e.preventDefault();
    var twitterWindow = window.open('https://twitter.com/share?url=' + $('#shortenSufix').val(), 'twitter-popup', 'height=350,width=600');
    if(twitterWindow.focus) { twitterWindow.focus(); }
    return false;
}

var facebookShare = document.querySelector('[data-js="facebook-share"]');

facebookShare.onclick = function(e) {
    e.preventDefault();
    var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + $('#shortenSufix').val(), 'facebook-popup', 'height=350,width=600');
    if(facebookWindow.focus) { facebookWindow.focus(); }
    return false;
}


$( document ).ready(function() {
    $('#urlGenerateBtn').click(generateURL);
});