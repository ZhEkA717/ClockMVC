"use strict";

// model

function ClockModel() {
    let myView = null;
    let myUTC = null;

    this.start = function (view, utc) {
        myView = view;
        myUTC = utc;
    };

    this.updateView = function () {
        if (myView) {
            myView.update();
        }
    };

    this.clockRun = function (raznUTC) {
        let currentTime = new Date();

        this.second = currentTime.getUTCSeconds();
        this.minute = currentTime.getUTCMinutes();
        this.hour = currentTime.getUTCHours() + raznUTC;
        this.positionHourArrow =
            this.hour * 30 + (this.minute * 60 + this.second) * (1 / 120);
        this.updateView();
    };

    let t = setInterval(() => {
        this.clockRun(myUTC);
    }, 1000);
    this.clockStart = function () {
        if (!t) {
            this.clockRun(myUTC);
            t = setInterval(() => {
                this.clockRun(myUTC);
            }, 1000);
        }
    };

    this.clockStop = function () {
        clearInterval(t);
        t = false;
    };

}

// view DOM
function ClockViewDom() {
    let myModel = null;
    let myClockDiv = null;
    let secondArrow = null,
        minuteArrow = null,
        hourArrow = null;
    let myLabel = null,
        mySpan = null;

    this.start = function (model, ClockDiv, label,span) {
        myModel = model;
        myClockDiv = ClockDiv;
        myLabel = label;
        mySpan = span;

        function createClock(sizeClock) {
            let dialClock = document.createElement('div');

            myClockDiv.style.width = sizeClock + 'px';
            dialClock.style.position = "relative";
            dialClock.style.width = sizeClock + "px";
            dialClock.style.height = sizeClock + "px";
            dialClock.style.borderRadius = 50 + "%";
            dialClock.style.backgroundColor = "wheat";
            myClockDiv.append(dialClock);

            const dialClockCenterX = dialClock.offsetLeft + dialClock.offsetWidth / 2,
                dialClockCenterY = dialClock.offsetTop + dialClock.offsetHeight / 2;

            function posNumber() {

                const radius = parseFloat(sizeClock * 0.4);

                let count = 0;
                for (let i = 30; i < 361; i = i + 30) {
                    let angle = parseFloat(i / 180 * Math.PI),
                        numbers = document.createElement('div');

                    numbers.style.position = "absolute";
                    numbers.style.width = sizeClock * 0.15 + 'px';
                    numbers.style.height = sizeClock * 0.15 + 'px';
                    numbers.style.borderRadius = 50 + "%";
                    numbers.style.backgroundColor = "rgb(31, 172, 31)";
                    numbers.style.display = "flex";
                    numbers.style.alignItems = "center";
                    numbers.style.justifyContent = "center";
                    numbers.innerHTML = ++count;
                    myClockDiv.append(numbers);

                    let numbersCenterX = dialClockCenterX + radius * Math.sin(angle),
                        numbersCenterY = dialClockCenterY - radius * Math.cos(angle);

                    numbers.style.left = Math.round(numbersCenterX - numbers.offsetWidth / 2) + 'px';
                    numbers.style.top = Math.round(numbersCenterY - numbers.offsetHeight / 2) + 'px';
                };
            }

            function createArrows(viewArrow, height, width, zIndex, color) {
                const Arrow = document.createElement('div');

                Arrow.style.height = sizeClock / 2 * height + "px";
                Arrow.style.width = sizeClock * width + "px";
                Arrow.style.position = "absolute";
                Arrow.style.borderRadius = 50 + "px";
                Arrow.style.transformOrigin = "center bottom";
                Arrow.style.transform = "rotate(0deg)";
                Arrow.style.backgroundColor = color;
                Arrow.style.zIndex = zIndex;
                myClockDiv.append(Arrow);

                Arrow.id = viewArrow;
                Arrow.style.left = dialClockCenterX - Arrow.offsetWidth / 2 + 'px';
                Arrow.style.top = dialClockCenterY - Arrow.offsetHeight + 'px';
            }
            posNumber();

            const Arrows = [
                {
                    arrow: "hour",
                    length: 0.4,
                    width: 0.02,
                    zIndex: 3,
                    color: "black"
                },
                {
                    arrow: "minute",
                    length: 0.6,
                    width: 0.015,
                    zIndex: 2,
                    color: "black"
                },
                {
                    arrow: "second",
                    length: 0.75,
                    width: 0.01,
                    zIndex: 1,
                    color: "red"
                }
            ];

            Arrows.forEach(item => {
                createArrows(
                    item.arrow,
                    item.length,
                    item.width,
                    item.zIndex,
                    item.color
                );
            });
        }

        createClock(200);


        secondArrow = myClockDiv.querySelector('#second'),
            minuteArrow = myClockDiv.querySelector('#minute'),
            hourArrow = myClockDiv.querySelector('#hour');

        function createLabel(span) {
            let labelSpan = document.getElementById(span);
            labelSpan.innerHTML = myLabel;
        }
        createLabel(mySpan);
    };

    this.update = function () {
        secondArrow.style.transform = `rotate(${myModel.second * 6}deg)`;
        minuteArrow.style.transform = `rotate(${myModel.minute * 6}deg)`;
        hourArrow.style.transform = `rotate(${myModel.positionHourArrow}deg)`;
    };

}
// view SVG

function ClockViewSVG() {
    let myModel = null;
    let myClockDiv = null;
    let secondArrow = null,
        minuteArrow = null,
        hourArrow = null;
    let myLabel = null,
        mySpan = null;

        const clockCenterX = 100,
        clockCenterY = 100;
    this.start = function (model, ClockDiv, label,span) {
        myModel = model;
        myClockDiv = ClockDiv;
        myLabel = label;
        mySpan = span;

        function createClock(r) {
            const clockRadius = r,
                clockNumberRadius = clockRadius * 0.15,
                radius = clockRadius * 0.8,
                clock = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        
            clock.setAttribute('fill', '#dbc81db7');
            clock.setAttribute('r', clockRadius);
            clock.setAttribute('cx', clockCenterX);
            clock.setAttribute('cy', clockCenterY);
            myClockDiv.append(clock);
        
            let count = 0;
            function posNumber() {
                for (let i = 30; i <= 360; i = i + 30) {
                    let clockNumber = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
                        clockNumberText = document.createElementNS('http://www.w3.org/2000/svg', 'text'),
                        angle = i / 180 * Math.PI,
                        clockNumberCenterX = clockCenterX + radius * Math.sin(angle),
                        clockNumberCenterY = clockCenterY - radius * Math.cos(angle),
                        cx = Math.round(clockNumberCenterX),
                        cy = Math.round(clockNumberCenterY);
        
                    clockNumber.setAttribute('cx', cx);
                    clockNumber.setAttribute('cy', cy);
                    clockNumber.setAttribute('fill', 'rgb(31, 172, 31)');
                    clockNumber.setAttribute('r', clockNumberRadius);
                    myClockDiv.append(clockNumber);
        
                    clockNumberText.setAttribute('x', cx);
                    clockNumberText.setAttribute('y', cy + clockRadius * 0.08 / 2);
                    clockNumberText.setAttribute('text-anchor', "middle");
                    clockNumberText.style.fill = "black";
                    clockNumberText.setAttribute("font-size", clockRadius * 0.08 * 2);
                    clockNumberText.textContent = ++count;
                    myClockDiv.append(clockNumberText);
                }
            }
            function createArrows(viewArrow, height, width, color) {
                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
                arrow.setAttribute('id', viewArrow);
                arrow.setAttribute('x', clockCenterX - width / 2);
                arrow.setAttribute('y', clockCenterY - height + height * 0.1);
                arrow.setAttribute('rx', 20);
                arrow.setAttribute('ry', 20);
                arrow.setAttribute('height', height);
                arrow.setAttribute('width', width);
                arrow.setAttribute('fill', color);
                myClockDiv.append(arrow);
            }
            posNumber();
        
            const paramsArrows = [
                {
                    arrow: "second",
                    length: clockRadius * 0.8,
                    width: clockRadius * 2 * 0.005,
                    color: "red"
                },
                {
                    arrow: "minute",
                    length: clockRadius * 0.6,
                    width: clockRadius * 2 * 0.015,
                    color: "black"
                },
                {
                    arrow: "hour",
                    length: clockRadius * 0.4,
                    width: clockRadius * 2 * 0.025,
                    color: "black"
                }
        
            ];
        
            paramsArrows.forEach(item => {
                createArrows(
                    item.arrow,
                    item.length,
                    item.width,
                    item.color
                );
            });            
        }
        
        createClock(100);

        secondArrow = myClockDiv.querySelector('#second'),
            minuteArrow = myClockDiv.querySelector('#minute'),
            hourArrow = myClockDiv.querySelector('#hour');

        function createLabel(span) {
            let labelSpan = document.getElementById(span);
            labelSpan.innerHTML = myLabel;
        }
        createLabel(mySpan);
    };

    this.update = function () {
        secondArrow.setAttribute('transform', 'rotate(' + myModel.second * 6 + ' ' + clockCenterX + ' ' + clockCenterY + ' )');
        minuteArrow.setAttribute('transform', 'rotate(' + myModel.minute * 6 + ' ' + clockCenterX + ' ' + clockCenterY + ' )');
        hourArrow.setAttribute('transform', 'rotate(' + myModel.positionHourArrow + ' ' + clockCenterX + ' ' + clockCenterY + ' )');
    };

}

// controoler 

function ClockController() {
    let myModel = null;
    let myClock = null;

    function debounceSerie(func, interval, immediate) {
        var timer;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timer = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timer;
            clearTimeout(timer);
            timer = setTimeout(later, interval);
            if (callNow)
                func.apply(context, args);
        };
    };

    this.start = function (model, clock) {
        myModel = model;
        myClock = clock;

        let btnStart = myClock.querySelector(".start");
        let btnStop = myClock.querySelector(".stop");

        btnStart.addEventListener("click", debounceSerie(this.clockStart, 500, false));
        btnStop.addEventListener("click", this.clockStop);
    };

    this.clockStart = function () {
        myModel.clockStart();
    };

    this.clockStop = function () {
        myModel.clockStop();
    };
}
const countiesGMT = {
    NewYork: { label: "Нью-Йорк (GMT-5)", GMT: -5 },
    London: { label: "Лондон (GMT)", GMT: 0 },
    Berlin: { label: "Берлин (GMT+1)", GMT: 1 },
    Minsk: { label: "Минск (GMT+3)", GMT: 3 },
    Tokio: { label: "Токио (GMT+9)", GMT: 9 },
    Vladivostok: { label: "Владивосток (GMT+10)", GMT: 10 },
}



// 1st
let clock1 = new ClockModel();
let view1 = new ClockViewDom();
let controller1 = new ClockController();

let container1 = document.getElementById('divClock1'),
    clocknum1 = document.getElementById("clock1");

clock1.start(view1, countiesGMT.NewYork.GMT);
view1.start(clock1, container1,countiesGMT.NewYork.label,"span1");
controller1.start(clock1, clocknum1);

clock1.clockRun(countiesGMT.NewYork.GMT);
clock1.updateView();



// 2nd
let clock2 = new ClockModel();
let view2 = new ClockViewDom();
let controller2 = new ClockController();

let container2 = document.getElementById('divClock2'),
    clocknum2 = document.getElementById("clock2");

clock2.start(view2, countiesGMT.Minsk.GMT);
view2.start(clock2, container2,countiesGMT.Minsk.label,"span2");
controller2.start(clock2, clocknum2);

clock2.clockRun(countiesGMT.Minsk.GMT);
clock2.updateView();

// 3d
let clock3 = new ClockModel();
let view3 = new ClockViewSVG();
let controller3 = new ClockController();

let container3 = document.getElementById('divClock3'),
    clocknum3 = document.getElementById("clock3");

clock3.start(view3, countiesGMT.London.GMT);
view3.start(clock3, container3,countiesGMT.London.label,"span3");
controller3.start(clock3, clocknum3);

clock3.clockRun(countiesGMT.London.GMT);
clock3.updateView();

// 4n
let clock4 = new ClockModel();
let view4 = new ClockViewSVG();
let controller4 = new ClockController();

let container4 = document.getElementById('divClock4'),
    clocknum4 = document.getElementById("clock4");

clock4.start(view4, countiesGMT.Tokio.GMT);
view4.start(clock4, container4,countiesGMT.Tokio.label,"span4");
controller4.start(clock4, clocknum4);

clock4.clockRun(countiesGMT.Tokio.GMT);
clock4.updateView();

// 5n
let clock5 = new ClockModel();
let view5 = new ClockViewSVG();
let controller5 = new ClockController();

let container5 = document.getElementById('divClock5'),
    clocknum5 = document.getElementById("clock5");

clock5.start(view5, countiesGMT.Berlin.GMT);
view5.start(clock5, container5,countiesGMT.Berlin.label,"span5");
controller5.start(clock5, clocknum5);

clock5.clockRun(countiesGMT.Berlin.GMT);
clock5.updateView();

// 6n
let clock6 = new ClockModel();
let view6 = new ClockViewSVG();
let controller6 = new ClockController();

let container6 = document.getElementById('divClock6'),
    clocknum6 = document.getElementById("clock6");

clock6.start(view6, countiesGMT.Vladivostok.GMT);
view6.start(clock6, container6,countiesGMT.Vladivostok.label,"span6");
controller6.start(clock6, clocknum6);

clock6.clockRun(countiesGMT.Vladivostok.GMT);
clock6.updateView();






