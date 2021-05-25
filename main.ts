input.onButtonPressed(Button.A, function () {
    is_active = 1
})
input.onButtonPressed(Button.B, function () {
    is_active = 0
})
function obstacle_detection () {
    if (Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P1, Kitronik_Clip_Detector.LightSelection.Objct)) {
        // je ne comprends pas pourquoi la détection est inversée surement un problème de câblage
        is_obstacle = 0
    } else {
        is_obstacle = 1
    }
}
let is_obstacle = 0
let is_active = 0
serial.redirectToUSB()
Kitronik_Clip_Detector.setSensorToDetectObjects()
is_active = 0
is_obstacle = 0
basic.showLeds(`
    . # # # .
    . # . # .
    . # # # .
    . # # . .
    . # . # .
    `)
basic.forever(function () {
    obstacle_detection()
    serial.writeValue("is active", is_active)
    serial.writeValue("is_obstacle", is_obstacle)
    if (is_active == 1 && is_obstacle == 0) {
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, 100)
        kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, 100)
    } else {
        kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor1)
        kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor2)
    }
})
