input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    led_manager()
    if (is_active == 0) {
        is_active = 1
    } else {
        is_active = 0
    }
    
})
function line_follower() {
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

radio.onReceivedString(function on_received_string(receivedString: string) {
    
    command = receivedString
})
function led_manager() {
    if (is_active == 0) {
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

function obstacle_detection() {
    
    if (Kitronik_Clip_Detector.sensorDigitalDetection(Kitronik_Clip_Detector.PinSelection.P1, Kitronik_Clip_Detector.LightSelection.Objct)) {
        //  je ne comprends pas pourquoi la détection est inversée
        is_obstacle = 0
    } else {
        is_obstacle = 1
    }
    
}

let command = ""
let is_obstacle = 0
let is_active = 0
let speed_right = 0
let speed_left = 0
led.setBrightness(100)
serial.redirectToUSB()
radio.setGroup(1)
Kitronik_Clip_Detector.setSensorToDetectObjects()
speed_left = 80
speed_right = 80
is_active = 0
is_obstacle = 0
basic.forever(function on_forever() {
    let is_line_active = 0
    obstacle_detection()
    serial.writeValue("is active", is_active)
    serial.writeValue("is_obstacle", is_obstacle)
    serial.writeValue("is_line_active", is_line_active)
    if (command == "up") {
        if (is_active == 1 && is_obstacle == 0) {
            kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Forward, speed_left)
            kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Forward, speed_right)
        } else {
            kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor1)
            kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor2)
        }
        
    } else if (command == "down") {
        if (is_active == 1) {
            kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor1, kitronik_klip_motor.MotorDirection.Reverse, speed_left)
            kitronik_klip_motor.motorOn(kitronik_klip_motor.Motors.Motor2, kitronik_klip_motor.MotorDirection.Reverse, speed_right)
        } else {
            kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor1)
            kitronik_klip_motor.motorOff(kitronik_klip_motor.Motors.Motor2)
        }
        
    }
    
})
