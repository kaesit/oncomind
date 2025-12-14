from ultralytics import YOLO
from tqdm import tqdm


# Define these functions OUTSIDE the main block so workers can see them
def update_pbar(trainer):
    pbar.update(1)


def close_pbar(trainer):
    pbar.close()


if __name__ == "__main__":
    # 1. Load the Segmentation Model
    model = YOLO("yolo11n-seg.pt")

    # --- CUSTOM TQDM SETUP ---
    EPOCHS = 100
    # Initialize the progress bar
    pbar = tqdm(total=EPOCHS, desc="Total Training Progress", unit="epoch")

    # Attach callbacks
    model.add_callback("on_train_epoch_end", update_pbar)
    model.add_callback("on_train_end", close_pbar)
    # -------------------------

    # 2. Train
    # The code below is now safe because it is indented under __main__
    results = model.train(
        data="./datasets/Cancer detection.v3i.yolov11/data.yaml",
        epochs=EPOCHS,
        imgsz=640,
        batch=8,
        device=0,  # Now that your GPU is detected, this will work!
        # Medical-Specific Augmentations
        flipud=0.5,
        fliplr=0.5,
        mosaic=1.0,
        name="cancer_cell_healthy_unhealthy_fixed",
        workers=4,  # Reduced from 8 to 4 to be safer on Windows/GTX 1660
    )

"""
data="./datasets/Cancer detection.v3i.yolov11/data.yaml",
epochs=EPOCHS,
imgsz=960,              # 🔥 EN KRİTİK DEĞİŞİKLİK
batch=2,                # VRAM’i çözüne harca
device=0,

# Augmentations (SEGMENTATION-FRIENDLY)
flipud=0.0,             # medikalde kapat
fliplr=0.5,             # OK
mosaic=0.0,             # 🔥 KAPAT

name="cancer_cell_healthy_unhealthy_fixed_v2",
workers=4,

"""
