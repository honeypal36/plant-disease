from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app=FastAPI()

MODEL=tf.keras.models.load_model("../models/1.keras")
MODEL.export("../models/plants_model/1")
CLASS_NAMES=["Early Blight","Late Blight", "Healthy"]

def read_file_as_image(data) -> np.ndarray:
    image=np.array(Image.open(BytesIO(data)))
    return image

@app.get("/ping")
async def ping():
    return "heyaa!"

@app.post("/predict")
async def predict(
    file: UploadFile=File(...)
):
    image=read_file_as_image(await file.read())
    image_batch=np.expand_dims(image,0)
    pred=MODEL.predict(image_batch)
    pred_class=CLASS_NAMES[np.argmax(pred[0])]
    confidence=np.max(pred[0])
    result={
        'class': str(pred_class),
        'confidence': float(confidence)
    }

    print(result)
    return result

if __name__=="__main__":
    uvicorn.run(app, host='localhost', port=8000)