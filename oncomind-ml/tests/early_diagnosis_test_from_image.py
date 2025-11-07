from ultralytics import YOLO
import argparse


def main():
     parser = argparse.ArgumentParser(
          description="Run a script to test basic cancer cell classification model to help early diagnosis"
     )
     parser.add_argument(
          "--model",
          type=str,
          required=True,
          help="Path to the YOLO(or other) model file, e.g. yolov10n.pt",
     )
     parser.add_argument(
          "--test-image",
          type=str,
          default=None,
          help="Optional test image (path or URL) to verify inference with the chosen model.",
     )

     args = parser.parse_args()
     
     print(f"🔹 Loading YOLO model from {args.model} ...")
     model = YOLO(args.model)
     
     if args.test_image:
          print(f"🔹 Running inference on test image: {args.test_image}")
          image = args.test_image
          results = model(image)
          results[0].show()
          print("✅ Inference completed successfully!")



