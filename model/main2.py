import fastapi
from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import keras
import uvicorn
import os
import tensorflow as tf
# from pydantic import BaseModel
app = FastAPI()

import requests

import os




API_URL = "https://api-inference.huggingface.co/models/google/gemma-7b"
HF_TOKEN = os.getenv("HF_TOKEN")  # Get token from environment variable
headers = {"Authorization": f"Bearer {HF_TOKEN}"}



def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()



# model = keras.models.load_model("Ai714")
model = tf.keras.models.load_model("Ai714")  
model.save("Ai714.h5", save_format="h5") 


def read_imagefile(file) -> Image.Image:
    image = Image.open(BytesIO(file))
    return image

def preprocessing(image: Image.Image):
    # Convert PIL image to NumPy array
    image_np = np.array(image)

    # Resize the image
    resized_image = cv2.resize(image_np, (420, 420))

    # Add a channel dimension to match model input shape
    resized_image = np.expand_dims(resized_image, axis=0)

    return resized_image

@app.get('/')
def index():
    return{'message':'hello world'}

@app.post("/predict/")
async def predict_image(name: str,file: UploadFile = File(...)):
    # Load the model


    # Read the uploaded image file
    image = read_imagefile(await file.read())

    # Preprocess the image
    image = preprocessing(image)

    # Maprediction
    predictione  = model.predict(image)
    max_idx=predictione.argmax()
    x=""
    if(max_idx==0):
        x="first degree burn"
    elif(max_idx==1):
        x="second degree burn"
    else:
        x="third degree burn"

	
    output = query({
	    "inputs": "what are remedies for "+x+". If a paitent alredy have "+name+" problem",
    })
    output= output[0]['generated_text']
    output = output.replace('\n', ' ')

# Remove extra spaces
    output = ' '.join(output.split())
    
    # Return prediction as response
    return {"prediction": max_idx.tolist(),
            "llm_op":output}




    # Get the port number from the environment variable if available
# if __name__ == '__main__':
#     uvicorn.run(app, host='127.0.0.1', port=8000)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)    