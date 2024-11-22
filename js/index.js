document.addEventListener('DOMContentLoaded', function () {
    //地图初始化
    map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
    });
    let serch_config = {
        city: "全国",
    }
    AMap.plugin('AMap.ToolBar', function () {//异步加载插件
        var toolbar = new AMap.ToolBar();//缩放工具条
        position: 'RB';
        map.addControl(toolbar);
    });
    AMap.plugin('AMap.Scale', function () {//异步加载插件
        var scale = new AMap.Scale();//比例尺
        map.addControl(scale);
    });
    //路况图层
    var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10,
        map: map
    })
    trafficLayer.hide();
    document.getElementById('toggleTraffic').addEventListener('click', function () {
        if (trafficLayer.getVisible()) {//判断是否显示
            trafficLayer.hide();
            this.textContent = '显示交通情况';
            this.style.background = '#ffffff';
        } else {
            trafficLayer.show();
            this.textContent = '隐藏交通情况';
            this.style.background = '#38d738';
        }
    });
    //卫星地图
    var Satellite = new AMap.TileLayer.Satellite({
        zIndex: 11,
        map: map
    });
    Satellite.hide();
    document.getElementById('toggleSatellite').addEventListener('click', function () {
        if (Satellite.getVisible()) {//判断是否显示
            Satellite.hide();
            this.textContent = '显示卫星地图';
            this.style.background = '#ffffff';
        } else {
            Satellite.show();
            this.textContent = '隐藏卫星地图';
            this.style.background = '#38d738';
        }
    });
    //室内地图
    AMap.plugin('AMap.IndoorMap', function () {
        var indoorMap = new AMap.IndoorMap({
            map: map,
            offset: {
                x: 0,
                y: 0
            }
        });
        indoorMap.on('active', function (e) {
            console.log(e);
        });
    });
    // 工具栏
    AMap.plugin('AMap.ToolBar', function () {
        var toolbar = new AMap.ToolBar(); //缩放工具条实例化
        map.addControl(toolbar); //添加控件
    });
    // 比例尺
    AMap.plugin('AMap.Scale', function () {
        var scale = new AMap.Scale(); //比例尺控件实例化
        map.addControl(scale); //添加控件
    });
    // 定位
    AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation();
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
            if (status === 'complete') {
                // 定位成功，设置地图中心点
                map.setCenter(result.position);
                // 获取当前位置
                const currentLat = result.position.lat;
                const currentLng = result.position.lng;
                //输入提示
                var autoOptions = {
                    input: "search"
                };
                AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
                    var auto = new AMap.AutoComplete(autoOptions);
                    var placeSearch = new AMap.PlaceSearch({
                        city: '全国',
                        map: map
                    });  //构造地点查询类
                    auto.on("select", select);//注册监听，当选中某条记录时会触发
                    function select(e) {
                        placeSearch.setCity(e.poi.adcode);
                        placeSearch.search(e.poi.name);  //关键字查询查询
                        map.setZoom(15);
                        map.setCenter(e.poi.location);
                    }
                    //多边形范围查询
                    // 创建一个矩形范围
                    const distance = 0.01; // 1公里大约等于0.01度
                    const polygonArr = [
                        [currentLng, currentLat + distance], // 北
                        [currentLng + distance, currentLat], // 东
                        [currentLng, currentLat - distance], // 南
                        [currentLng - distance, currentLat]  // 西
                    ];
                    placeSearch.searchInBounds("厕所", polygonArr, function (status, result) {
                        //查询成功时，result 即对应匹配的 POI 信息
                        console.log(result);
                    });
                });
            } else {
                // 定位失败，处理错误
                console.error('定位失败:', result);
            }
        });
    });












    //服务界面切换
    var map_button=document.getElementById('map');
    var service_button=document.getElementById('service');
    var login_button=document.getElementById('login');
    var service_container =document.getElementById('service-container');
    var login_container =document.getElementById('login-container');
    //点击地图按钮
    map_button.addEventListener('click', function () {
        service_container.style.display='none';
        login_container.style.display='none';
        map_button.style.color='orange';
        service_button.style.color='#000000';
        login_button.style.color='#000000';
    });
    service_button.addEventListener('click', function () {
        service_container.style.display='block';
        login_container.style.display='none';
        service_button.style.color='orange';
        map_button.style.color='#000000';
        login_button.style.color='#000000';
    })
    login_button.addEventListener('click', function () {
        service_container.style.display='none';
        login_container.style.display='block';
        login_button.style.color='orange';
        service_button.style.color='#000000';
        map_button.style.color='#000000';
    })

})


