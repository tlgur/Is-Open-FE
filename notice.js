$(document).ready(function () {
    var $noticeContainer = $('.notice-container');

    $.get("http://3.38.81.73:8080/notice/recent", function (data) {
        var noticesData = data.noticePrevs;
        var noticePrevCount = data.noticePrevsCount;

        for (var i = 0; i < noticePrevCount; i++) {
            if (noticesData[i]) {
                var noticeTitle = noticesData[i].title;
                var $noticePrev = $('<div>', {
                    class: 'notice-prev',
                    text: noticeTitle,
                    'notice-id': noticesData[i].noticeId
                });
                $noticeContainer.append($noticePrev);
            }
        }

        // 이 부분을 $.get 요청의 콜백 내부로 옮깁니다.
        var notices = $('.notice-prev');
        var currentIndex = 0;

        notices.hide();
        notices.eq(currentIndex).css({opacity: 1, top: '2px'}).show();

        function showNextNotice() {
            notices.eq(currentIndex).animate({opacity: 0, top: '40px'}, 500, function () {
                $(this).css('z-index', 1).hide();
            });

            currentIndex = (currentIndex + 1) % notices.length;
            notices.eq(currentIndex).css({top: '-40px', opacity: 0, 'z-index': 2}).show().animate({
                opacity: 1,
                top: '2px'
            }, 500);
            $noticeContainer.attr('notice-id', notices.eq(currentIndex).attr('notice-id'))
        }

        setInterval(showNextNotice, 5000);

        $noticeContainer.on('click', function() {
            // 현재 보이는 .notice-prev의 notice-id 속성 값을 가져옵니다.
            var noticeId = $(this).find('.notice-prev:visible').attr('notice-id');

            $.get("http://3.38.81.73:8080/notice/" + noticeId, function (data) {
                var title = data.title;
                var content = data.content;

                // Overlay 생성
                var $overlay = $('<div>', {
                    class: 'overlay'
                }).appendTo('body');

                // 중앙에 표시될 흰색 사각형 생성
                var $popupBox = $('<div>', {
                    class: 'popup-box'
                }).appendTo($overlay);

                $('<h2>', {
                    text: title,
                    class: 'popup-title'
                }).appendTo($popupBox);

                $('<p>', {
                    text: content,
                    class: 'popup-content'
                }).appendTo($popupBox);

                // overlay를 클릭하면 popup 및 overlay 삭제
                $overlay.on('click', function () {
                    $(this).remove();
                });

                // popupBox 내부를 클릭했을 때 overlay가 삭제되지 않도록 이벤트 전파 중지
                $popupBox.on('click', function (event) {
                    event.stopPropagation();
                });
            });
        });

    }).fail(function () {
        console.log("Error occurred while fetching data");
    });
});