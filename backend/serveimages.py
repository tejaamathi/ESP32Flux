from flask import Flask, jsonify, send_from_directory
import os
from flask_cors import CORS
from datetime import datetime
import urllib.request
import base64
import json
import time
import os
import requests
app = Flask(__name__)
CORS(app)

webui_server_url = 'http://127.0.0.1:7860'

out_dir = 'api_out'
out_dir_t2i = os.path.join(out_dir, 'txt2img')
out_dir_i2i = os.path.join(out_dir, 'img2img')
os.makedirs(out_dir_t2i, exist_ok=True)
os.makedirs(out_dir_i2i, exist_ok=True)


def timestamp():
    return datetime.fromtimestamp(time.time()).strftime("%Y%m%d-%H%M%S")


def encode_file_to_base64(path):
    with open(path, 'rb') as file:
        return base64.b64encode(file.read()).decode('utf-8')


def decode_and_save_base64(base64_str, save_path):
    with open(save_path, "wb") as file:
        file.write(base64.b64decode(base64_str))


def call_api(api_endpoint, **payload):
    data = json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(
        f'{webui_server_url}/{api_endpoint}',
        headers={'Content-Type': 'application/json'},
        data=data,
    )
    response = urllib.request.urlopen(request)
    return json.loads(response.read().decode('utf-8'))


def call_img2img_api(**payload):
    response = call_api('sdapi/v1/img2img', **payload)
    for index, image in enumerate(response.get('images')):
        save_path = os.path.join(out_dir_i2i, f'img2img-{timestamp()}-{index}.png')
        decode_and_save_base64(image, save_path)
        return save_path

SAVE_DIRECTORY = "../frontend/public/imagestack"

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(SAVE_DIRECTORY, filename)

@app.route('/get-image-list')
def get_image_list():
    # List all files in the imagestack directory
    files = sorted(os.listdir(SAVE_DIRECTORY))
    return jsonify([files[-1]]if len(files) > 0 else [])

@app.route('/ai/<prompt>/')
def ai(prompt):
    option_payload = {
    "sd_model_checkpoint": "ae.safetensors",
    "CLIP_stop_at_last_layers": 2
    }
    requests.post(url=f"{webui_server_url}/sdapi/v1/options", json=option_payload)
    # Prepare the payload for the img2img API
    init_images = [
        encode_file_to_base64('../frontend/public/imagestack/3.jpg'),
    ]

    payload = {
        "prompt": prompt,
        "batch_size": 1,
        "steps": 20,
        "seed": -1,
        "distilled_cfg_scale": 3.5,
        "cfg_scale": 1,
        "width": 1024,
        "height": 1024,
        "sampler_name": "Euler",
        "scheduler": "Simple",
        "init_images": init_images,

    }

    # Call the img2img API with the prepared payload
    savepath = call_img2img_api(**payload)
    with open(savepath, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

    return jsonify({'status': 'success', 'savepath': savepath, 'image':encoded_string})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')