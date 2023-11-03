var mapOptions = {
    center: new naver.maps.LatLng(37.29394154319374, 126.97494018690558),
    zoom: 17,
    maxZoom: 19,
    minZoom: 16,
    zoomControl: true, //줌 컨트롤의 표시 여부
    zoomControlOptions: { //줌 컨트롤의 옵션
        style: naver.maps.ZoomControlStyle.LARGE,
        position: naver.maps.Position.RIGHT_BOTTOM
    },
};
var map = new naver.maps.Map('map', mapOptions);
