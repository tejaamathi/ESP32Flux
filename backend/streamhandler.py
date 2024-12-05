import cv2
import numpy as np
import os
import glob

def save_image(frame, filename):
    cv2.imwrite(filename, frame)

def handle_stream():
    ESP32_URL = "http://192.168.1.109:81/stream"
    cap = cv2.VideoCapture(ESP32_URL)
    since_last_contour = 0
    number_of_updates = 0
    # Delete all files in the imagestack directory
    files = glob.glob("../frontend/public/imagestack/*")
    for f in files:
        os.remove(f)

    while True:
        # Read the current frame
        ret, current_frame = cap.read()


        # Convert the current frame to grayscale
        gray_frame = cv2.cvtColor(current_frame, cv2.COLOR_BGR2GRAY)
        gray_frame = cv2.GaussianBlur(gray_frame, (21, 21), 0)

        # Initialize previous_frame if it's the first loop
        if 'previous_frame' not in locals():
            previous_frame = gray_frame
            continue

        # Calculate the absolute difference between the current and previous frame
        frame_delta = cv2.absdiff(previous_frame, gray_frame)

        # Threshold the difference to highlight significant changes
        _, threshold_frame = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)

        # Dilate the threshold image to fill in small holes
        dilated_frame = cv2.dilate(threshold_frame, None, iterations=2)

        # Find contours of the motion areas
        contours, _ = cv2.findContours(dilated_frame, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        num_contours = 0

        # Draw bounding boxes around motion areas
        for contour in contours:
            if cv2.contourArea(contour) < 500:  # Ignore small movements
                continue
            num_contours += 1
            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(current_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        if num_contours > 0:
            since_last_contour = 0
        else:
            since_last_contour += 1

        # Update the previous frame
        previous_frame = gray_frame

        if since_last_contour == 25:
            save_image(current_frame, f"../frontend/public/imagestack/{number_of_updates}.jpg")
            
            number_of_updates += 1
            print("Drawing Update Detected. Image saved.")

        if number_of_updates == 4:
            break
handle_stream()