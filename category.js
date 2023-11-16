let page = 0;
let isLoading = false;
let kind = null;

function loadMoreData(kind) {
    if (isLoading) {
        return;
    }

    isLoading = true;
    page++;

    // 요청 파라미터 설정
    let params = {
        campus: 'SUWON',
        size: 5,
        page: page
    };

    // 서버에 요청
    $.ajax({
        url: kind === null ?
            'http://ec2-3-38-81-73.ap-northeast-2.compute.amazonaws.com/place/cards' : `http://ec2-3-38-81-73.ap-northeast-2.compute.amazonaws.com/place/cards/${kind}`,
        method: 'GET',
        data: params,
        success: function(response) {
            var data = response.content;

            // 데이터로부터 card를 동적으로 생성합니다.
            data.forEach(function(card) {
                // 현재 시간을 확인합니다.
                let now = new Date();
                let openAt = new Date(`${card.openAt}:00Z`);
                let closeAt = new Date(`${card.closeAt}:00Z`);
                let openTag = (now >= openAt && now <= closeAt) ? 'open-tag' : 'close-tag';

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

            isLoading = false;
        },
        error: function(error) {
            console.error("데이터를 불러오는데 실패했습니다.", error);
            isLoading = false;
        }
    });
}

$(document).ready(function() {
    // nav-item 클릭 이벤트
    $(".nav-item").click(function() {
        page = 0; // 페이지 초기화
        kind = $(this).attr('class').split(' ')[1].split('-')[1];
        let url = `http://ec2-3-38-81-73.ap-northeast-2.compute.amazonaws.com/place/usages/${kind}`;

        // 서버에 데이터 요청
        $.get(url, function(data) {
            // 이전에 뿌려진 데이터 삭제
            $(".category-container").empty();

            if (data.count > 0) {
                // 데이터 순회하며 버튼 생성
                let idx = 0;
                for (let field in data) {
                    if (data.hasOwnProperty(field) && field !== 'count') {
                        let button = $(`<button class="category-btn" data-category="${field}">${field}</button>`);

                        // 클릭 이벤트 추가
                        button.click(function() {
                            if (idx > data[field].length) idx = 0;  // 리스트 마지막 도달시 초기화
                            let value = data[field][idx] || button.attr('data-category');
                            idx++;

                            // 만약 value가 x가 아니라면 클릭 효과 적용
                            if (value !== button.attr('data-category')) {
                                button.text(value).attr(field, value);
                                button.addClass('pressed').css({
                                    'box-shadow': 'inset 0px 6px 10px rgba(0, 0, 0, 0.2)',
                                    'transform': 'scale(0.97)',
                                    'color': 'rgba(4, 117, 244, 0.75)'
                                });
                            } else {
                                button.text(field).attr(field, '');
                                button.removeClass('pressed').css({
                                    'box-shadow': 'none',
                                    'transform': 'scale(1)',
                                    'color': 'rgba(0, 0, 0, 0.35)'
                                });
                            }
                        });

                        // 처음 버튼 생성 시 x 상태로 초기화
                        button.text(button.attr('data-category')).attr(field, '');

                        $(".category-container").append(button);
                    }
                }
            }
        });

        // 요청 파라미터 초기화
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
    });

    // category-btn 클릭 이벤트
    $(".category-container").on("click", ".category-btn", function () {
        page = 0; // 페이지 초기화

        // 요청 파라미터 초기화
        let params = {
            campus: 'SUWON',
            size: 5,
            page: page
        };

        // 컨테이너 내의 모든 category-btn을 순회
        $(".category-container .category-btn").each(function () {
            let field = $(this).attr('data-category');  // 해당 버튼의 종류
            let fieldValue = $(this).attr(field);  // 버튼의 field 값
            if (fieldValue) {  // 필드 값이 존재할 경우만 추가
                params[field] = fieldValue;
            }
        });

        // 서버에 요청
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

    });

    $(".place-card-container").on('scroll', function() {
        // 현재 스크롤 위치 + 컨테이너 높이가 전체 스크롤 가능한 높이에 가까울 때
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 30) {
            loadMoreData(kind);
        }
    });
    $(".nav-item, .category-btn, #logo, #seoul, #suwon").click(function() {
        $(".place-card-container").scrollTop(0); // 스크롤 위치 초기화
        page = 0; // page 초기화
    });
});