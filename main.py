def on_button_pressed_a():
    global is_active
    led_manager()
    if is_active == 0:
        is_active = 1
    else:
        is_active = 0
input.on_button_pressed(Button.A, on_button_pressed_a)

def line_follower():
    if Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P0,
    Kitronik_Clip_Detector.LightSelection.LIGHT) and Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P2,
    Kitronik_Clip_Detector.LightSelection.LIGHT):
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR1,
            kitronik_klip_motor.MotorDirection.FORWARD,
            speed_left)
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR2,
            kitronik_klip_motor.MotorDirection.FORWARD,
            speed_right)
    elif Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P0,
    Kitronik_Clip_Detector.LightSelection.DARK) and Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P2,
    Kitronik_Clip_Detector.LightSelection.LIGHT):
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR1,
            kitronik_klip_motor.MotorDirection.REVERSE,
            speed_left)
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR2,
            kitronik_klip_motor.MotorDirection.FORWARD,
            speed_right)
    elif False:
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR1,
            kitronik_klip_motor.MotorDirection.FORWARD,
            speed_left)
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR2,
            kitronik_klip_motor.MotorDirection.FORWARD,
            speed_right)

def on_received_string(receivedString):
    global command
    command = receivedString
radio.on_received_string(on_received_string)

def led_manager():
    if is_active == 0:
        led.plot(1, 3)
        led.plot(2, 4)
        led.plot(3, 3)
        led.plot(4, 2)
        led.unplot(1, 2)
        led.unplot(3, 2)
        led.unplot(2, 3)
        led.unplot(1, 4)
        led.unplot(3, 4)
    else:
        led.unplot(1, 3)
        led.unplot(2, 4)
        led.unplot(3, 3)
        led.unplot(4, 2)
        led.plot(1, 2)
        led.plot(3, 2)
        led.plot(2, 3)
        led.plot(1, 4)
        led.plot(3, 4)
def obstacle_detection():
    global is_obstacle
    if Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P1,
    Kitronik_Clip_Detector.LightSelection.OBJCT):
        # je ne comprends pas pourquoi la détection est inversée
        is_obstacle = 0
    else:
        is_obstacle = 1
command = ""
is_obstacle = 0
is_active = 0
speed_right = 0
speed_left = 0
led.set_brightness(100)
serial.redirect_to_usb()
radio.set_group(1)
Kitronik_Clip_Detector.set_sensor_to_detect_objects()
speed_left = 80
speed_right = 80
is_active = 0
is_obstacle = 0

def on_forever():
    is_line_active = 0
    obstacle_detection()
    serial.write_value("is active", is_active)
    serial.write_value("is_obstacle", is_obstacle)
    serial.write_value("is_line_active", is_line_active)
    if command == "up":
        if is_active == 1 and is_obstacle == 0:
            kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR1,
                kitronik_klip_motor.MotorDirection.FORWARD,
                speed_left)
            kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR2,
                kitronik_klip_motor.MotorDirection.FORWARD,
                speed_right)
        else:
            kitronik_klip_motor.motor_off(kitronik_klip_motor.Motors.MOTOR1)
            kitronik_klip_motor.motor_off(kitronik_klip_motor.Motors.MOTOR2)
    elif command == "down":
        if is_active == 1:
            kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR1,
                kitronik_klip_motor.MotorDirection.REVERSE,
                speed_left)
            kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR2,
                kitronik_klip_motor.MotorDirection.REVERSE,
                speed_right)
        else:
            kitronik_klip_motor.motor_off(kitronik_klip_motor.Motors.MOTOR1)
            kitronik_klip_motor.motor_off(kitronik_klip_motor.Motors.MOTOR2)
basic.forever(on_forever)
