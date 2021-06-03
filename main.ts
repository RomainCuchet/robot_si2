input.onButtonPressed(Button.A, function () {
    led_manager()
    if (is_active == 0) {
        is_active = 1
    } else {
        is_active = 0
    }
})
function line_follower () {
    if (Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P0, Kitronik_Clip_Detector.LightSelection.Light) && Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P2, Kitronik_Clip_Detector.LightSelection.Light)) {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
    } else if (Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P0, Kitronik_Clip_Detector.LightSelection.Dark) && Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P2, Kitronik_Clip_Detector.LightSelection.Light)) {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Reverse, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
    } else if (false) {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
    }
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "up") {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
    } else if (receivedString == "down") {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Reverse, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Reverse, speed_right)
    } else if (receivedString == "right") {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Reverse, speed_right)
    } else if (receivedString == "left") {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Reverse, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
    }
})
input.onButtonPressed(Button.B, function () {
    led_manager()
    if (is_line_active == 0) {
        is_line_active = 1
    } else {
        is_line_active = 0
    }
})
function led_manager () {
    if (is_active == 0) {
        for (let x = 0; x <= 4; x++) {
            led.plot(x, 0)
        }
    } else {
        for (let x2 = 0; x2 <= 4; x2++) {
            led.unplot(x2, 0)
        }
    }
    if (is_line_active == 1) {
        led.plot(1, 3)
        led.plot(2, 4)
        led.plot(3, 3)
        led.plot(4, 2)
        led.unplot(1, 2)
        led.unplot(3, 2)
        led.unplot(2, 3)
        led.unplot(1, 4)
        led.unplot(3, 4)
    } else {
        led.unplot(1, 3)
        led.unplot(2, 4)
        led.unplot(3, 3)
        led.unplot(4, 2)
        led.plot(1, 2)
        led.plot(3, 2)
        led.plot(2, 3)
        led.plot(1, 4)
        led.plot(3, 4)
    }
}
function obstacle_detection () {
    if (Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P1, Kitronik_Clip_Detector.LightSelection.Objct)) {
        // je ne comprends pas pourquoi la détection est inversée
        is_obstacle = 0
    } else {
        is_obstacle = 1
    }
}
let is_obstacle = 0
let is_active = 0
let speed_right = 0
let speed_left = 0
let is_line_active = 0
led.setBrightness(100)
serial.redirectToUSB()
radio.setGroup(1)
Kitronik_Clip_Detector.setSensorToDetectObjects()
is_line_active = 0
speed_left = 80
speed_right = 80
is_active = 0
is_obstacle = 0
basic.forever(function () {
    obstacle_detection()
    serial.writeValue("is active", is_active)
    serial.writeValue("is_obstacle", is_obstacle)
    serial.writeValue("is_line_active", is_line_active)
    if (is_line_active == 1) {
        line_follower()
    } else if (is_active == 1 && is_obstacle == 0) {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, speed_left)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
    } else {
        led_manager()
        kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor1)
        kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor2)
    }
})
