let toggle = 1; //-50
let placeToggle = 0;
$(document).ready(function() {
    $('.place-close-button').on('click', function () {
        $('.place').hide();
        $('.toggle-button').css("left", "456px")
    });
});
$(document).ready(function() {
    // 서버에 요청
    let params = {
        campus: 'SUWON',
        size: 5,
        page: page
    };
    $.ajax({
        url: kind === null ?
            'http://ec2-3-38-81-73.ap-northeast-2.compute.amazonaws.com/place/cards' : `http://ec2-3-38-81-73.ap-northeast-2.compute.amazonaws.com/place/cards/${kind}`,
        method: 'GET',
        data: params,
        success: function (response) {
            var data = response.content;


            // place-card-container의 내용을 삭제합니다.
            $(".place-card-container").empty();
            page = 0;

            // 데이터로부터 card를 동적으로 생성합니다.
            data.forEach(function (card) {
                // 현재 시간을 확인합니다.
                let now = new Date();
                let openAt = new Date(`${card.openAt}:00Z`);
                let closeAt = new Date(`${card.closeAt}:00Z`);
                let openTag = (now >= openAt && now <= closeAt) ? 'open-tag' : 'close-tag';

                // place-card의 HTML을 생성합니다.
                let placeCardHTML = `
                <div class="place-card" place-id="${card.placeID}">
                    <div class="place-image-container1"></div>
                    <div class="place-title">
                        <div class="place-name">${card.name}<span class="${openTag}"></span></div>
                        <div class="place-location"><span></span>${card.loadNameAddress}</div>
                        <div class="place-operation-time"><span></span>${card.openAt} - ${card.closeAt}</div>
                    </div>
                </div>
            `;

                // 생성한 HTML을 place-card-container에 추가합니다.
                $(".place-card-container").append(placeCardHTML);
            });
        },
        error: function (error) {
            console.error("데이터를 불러오는데 실패했습니다.", error);
        }
    });

    $('.toggle-button').on('click', function() {
        var $sideBarBody = $('.side-bar-body');
        var $toggleButton = $('.toggle-button');
        var $place = $('.place');
        var $placeCloseButton = $('.place-close-button');
        var $navBar = $('.nav-bar');

        // 현재 transform 값 가져오기

        var transformValue = $sideBarBody.css('transform');

        var currentPosition = $(this).css('background-position').split(" ")[1];
        if (toggle === 1) {
            $(this).css({
                "background-position": '-339px -150px'
            });
            toggle = 0
        } else {
            $(this).css({
                "background-position": '-339px -50px'
            });
            toggle = 1
        }

        if(placeToggle === 0) {
            // translateX 값이 0인지 확인하여 토글
            if (transformValue === 'none' || transformValue === 'matrix(1, 0, 0, 1, 0, 0)') {
                $sideBarBody.css('transform', 'translateX(-100%)');
                $toggleButton.css('transform', 'translateX(-390px)'); // side-bar-body의 너비만큼 왼쪽으로 이동
                $navBar.css('transform', 'translateX(-390px');
            } else {
                $sideBarBody.css('transform', 'translateX(0%)');
                $toggleButton.css('transform', 'translateX(0px)'); // 원래 위치로 복귀
                $navBar.css('transform', 'translateX(0px');
            }
        }else{
            if (transformValue === 'none' || transformValue === 'matrix(1, 0, 0, 1, 0, 0)') {
                $sideBarBody.css('transform', 'translateX(-845px)');
                $place.css('transform', 'translateX(-845px)');
                $placeCloseButton.css('transform', 'translateX(-845px)');
                $toggleButton.css('transform', 'translateX(-780px)'); // side-bar-body의 너비만큼 왼쪽으로 이동
            } else {
                $sideBarBody.css('transform', 'translateX(0%)');
                $place.css('transform', 'translateX(0%)');
                $placeCloseButton.css('transform', 'translateX(0px)');
                $toggleButton.css('transform', 'translateX(0px)'); // 원래 위치로 복귀
            }

        }
    }).hover(function() {
        var currentPosition = $(this).css('background-position').split(" ")[1];
        if (toggle === 1) {
            $(this).css({
                "background-position": '-339px 0px'
            });
        } else if (currentPosition === '-150px') {
            $(this).css({
                "background-position": '-339px -100px'
            });
        }
    }, function() { // hover 이벤트가 끝날 때의 동작
        var currentPosition = $(this).css('background-position').split(" ")[1];
        if (currentPosition === '0px') {
            $(this).css({
                "background-position": '-339px -50px'
            });
        } else if (currentPosition === '-100px') {
            $(this).css({
                "background-position": '-339px -150px'
            });
        }
    });

    $('.place-close-button').on('click', function () {
        $('.place').hide();
        $('.nav-bar').show();
        $(this).hide();
        placeToggle = 0;
        var $place = $('.place');
        var $placeCloseButton = $('.place-close-button');
        $place.css('transform', 'translateX(-845px)');
        $placeCloseButton.css('transform', 'translateX(-845px)');
    })
    $('.place-close-button').click();
});