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
            this.clockRun();
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

// view

function ClockViewDom() {
    let myModel = null;
    let myClockDiv = null;
    let secondArrow = null,
        minuteArrow = null,
        hourArrow = null;
    let myLabel = null;

    this.start = function (model, ClockDiv, label) {
        myModel = model;
        myClockDiv = ClockDiv;
        myLabel = label;

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

        // function createLabel() {
        //     let span = myClockDiv.querySelector(".span");
        //     span.innerHTML = myLabel;
        // }
        // createLabel();
    };

    this.update = function () {
        secondArrow.style.transform = `rotate(${myModel.second * 6}deg)`;
        minuteArrow.style.transform = `rotate(${myModel.minute * 6}deg)`;
        hourArrow.style.transform = `rotate(${myModel.positionHourArrow}deg)`;
    };

}

// controoler 

function ClockController() {
    let myModel = null;
    let myClockDiv = null;

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

    this.start = function (model, ClockDiv) {
        myModel = model;
        myClockDiv = ClockDiv;

        let btnStart = myClockDiv.querySelector(".start");
        let btnStop = myClockDiv.querySelector(".stop");

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
let clock = new ClockModel();
let view = new ClockViewDom();
let controller = new ClockController();

let container = document.getElementById('divClock');

clock.start(view, countiesGMT.NewYork.GMT);
view.start(clock, container,countiesGMT.NewYork.label);
controller.start(clock, container);

clock.updateView();

clock.clockRun(countiesGMT.NewYork.GMT);


// 2nd
let clock1 = new ClockModel();
let view1 = new ClockViewDom();
let controller1 = new ClockController();

let container1 = document.getElementById('divClock1');

clock1.start(view1, countiesGMT.Minsk.GMT);
view1.start(clock1, container1,countiesGMT.Minsk.label);
controller1.start(clock1, container1);


clock1.updateView();

clock1.clockRun(countiesGMT.Minsk.GMT);

let clock3 = new ClockModel();
let view3 = new ClockViewDom();
let controller3 = new ClockController();

let container3 = document.getElementById('divClock2');

clock3.start(view3, countiesGMT.London.GMT);
view3.start(clock3, container3,countiesGMT.London.label);
controller3.start(clock3, container3);


clock3.updateView();

clock3.clockRun(countiesGMT.London.GMT);



