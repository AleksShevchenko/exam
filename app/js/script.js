(function($) {
    $(function() {
        var jcarousel = $('.jcarousel');
        jcarousel
            .on('jcarousel:reload jcarousel:create', function () {
                var carousel = $(this),
                    width = carousel.innerWidth();
                carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            })
            .jcarousel({
                wrap: 'circular'
            });
        $('.step__nav--prev')
            .jcarouselControl({
                target: '-=1'
            });
        $('.step__nav--next')
            .jcarouselControl({
                target: '+=1'
            });
        $('.jcarousel').jcarouselAutoscroll({
            interval: 5000,
            target: "+=1",
            autostart: true
        });
    });

    $(function() {
        function crossDomainAjax (url) {
            var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            var xhr = new XHR();
            xhr.open('GET', url, false);
            xhr.onload = function() {
                var obj = $.parseJSON( this.responseText )
                var myImgs = $('.grid-img');
                var myTitles = $('.grid-title');
                for (var i = 0; i < myImgs.length; i++) {
                    myImgs[i].setAttribute('src', obj.hits[i].webformatURL);
                    myTitles[i].innerHTML = obj.hits[i].tags;
                }
            }
            xhr.onerror = function() {
              console.log( 'Error ' + this.status );
            }
            xhr.send();
        }
        
        function getImages() {
            var word = $('.search__input').val();
                if (word.length === 0) {
                    var arr = ["canada", "harley", "carpathian"];
                    var rand = Math.floor(Math.random() * arr.length);
                    word = ( arr[rand] );
                }
            var request = (document.all && document.querySelector && !document.addEventListener) ? 'http' : 'https';
            crossDomainAjax(request + '://pixabay.com/api/?key=3536504-f5f43fa39c601bc2382590432&q='+word+'&image_type=photo');
            $('.search__input').val('');

            var $grid = $('.grid').imagesLoaded( function() {
            // init Masonry after all images have loaded
                 $('.grid').masonry({
                    columnWidth: 45,
                     itemSelector: ".grid-item",
                     gutter: 20,
                     resize: true,
                     // originLeft: false,

                     singleMode: false,
                // true - если у вас все блоки одинаковой ширины
                     isResizable: true,
                // перестраивает блоки при изменении размеров окна
                     isAnimated: true,
                // анимируем перестроение блоков
                     animationOptions: { 
                     queue: false, 
                     duration: 500 
      }



                });
            });
        }
        $('#search__form').submit(function(e) {
            e.preventDefault();
            getImages();
        });
        $('.search__input').keydown(function(e) {
            if(e.keyCode == 13){
                getImages();
                return false;
            }
        });

        getImages()
    });
})(jQuery);