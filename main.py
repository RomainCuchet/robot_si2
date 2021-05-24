def on_button_pressed_a():
    global is_active
    is_active = 1
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global is_active
    is_active = 0
input.on_button_pressed(Button.B, on_button_pressed_b)

def obstacle_detection():
    global is_obstacle
    if Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P1,
    Kitronik_Clip_Detector.LightSelection.OBJCT):
        is_obstacle = 1
    elif not (Kitronik_Clip_Detector.sensor_digital_detection(Kitronik_Clip_Detector.PinSelection.P1,
    Kitronik_Clip_Detector.LightSelection.OBJCT)):
        is_obstacle = 0
is_obstacle = 0
is_active = 0
serial.redirect_to_usb()
Kitronik_Clip_Detector.set_sensor_to_detect_objects()
is_active = 0
basic.show_leds("""
    . # # # .
    . # . # .
    . # # # .
    . # # . .
    . # . # .
    """)

def on_forever():
    obstacle_detection()
    serial.write_value("is active", is_active)
    serial.write_value("is_obstacle", is_obstacle)
    if is_active == 1 and is_obstacle == 0:
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR1,
            kitronik_klip_motor.MotorDirection.FORWARD,
            100)
        kitronik_klip_motor.motor_on(kitronik_klip_motor.Motors.MOTOR2,
            kitronik_klip_motor.MotorDirection.FORWARD,
            100)
    else:
        kitronik_klip_motor.motor_off(kitronik_klip_motor.Motors.MOTOR1)
        kitronik_klip_motor.motor_off(kitronik_klip_motor.Motors.MOTOR2)
basic.forever(on_forever)
