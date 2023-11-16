$(document).ready(function () {
    $(document).on('click', '.place-card', function () {
        var $place = $('.place');
        if (placeToggle === 0) {
            $('.nav-bar').hide();
            placeToggle = 1;
            var $placeCloseButton = $('.place-close-button');
            $place.show();
            $placeCloseButton.show();
            $place.css('transform', 'translateX(0px)');
            $placeCloseButton.css('transform', 'translateX(0px)');
            let $toggle = $('.toggle-button');
            setTimeout(function () {
                $toggle.css("left", "845px")
            }, 305);
        }
        let operationTime = $(this).find('.place-operation-time').text();
        let location = $(this).find('.place-location').text();
        $place.find('.place-name').text($(this).find('.place-name').text());
        $place.find('.place-operation-time').html(`<span></span>${operationTime}`);
        $place.find('.place-location').html(`<span></span>${location}`);

        $.ajax({
            url:
                `http://3.38.81.73:8080/place/detail/${$(this).attr('place-id')}`,
            method: 'GET',
            success: function (response) {
            },
            error: function (error) {
                console.error("데이터를 불러오는데 실패했습니다.", error);
            }
        });
    });


});