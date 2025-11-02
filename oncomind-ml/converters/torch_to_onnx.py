#!/usr/bin/env python
"""
Convert a YOLO model (PyTorch format) to ONNX format using Ultralytics.
Example:
    python convert_to_onnx.py --model yolov10n.pt --output yolov10n.onnx
"""

import argparse
from ultralytics import YOLO


def main():
     parser = argparse.ArgumentParser(
          description="Convert a YOLO model (PyTorch) to ONNX format."
     )
     parser.add_argument(
          "--model",
          type=str,
          required=True,
          help="Path to the YOLO model (.pt) file to convert, e.g. yolov10n.pt",
     )
     parser.add_argument(
          "--output",
          type=str,
          default=None,
          help="Optional output path for the ONNX file. Defaults to <model_name>.onnx",
     )

     args = parser.parse_args()

     # Load the YOLO model
     print(f"🔹 Loading YOLO model from {args.model} ...")
     model = YOLO(args.model)

     # Export to ONNX
     print("🔹 Exporting model to ONNX ...")
     export_path = model.export(format="onnx")
     print(f"✅ Model exported successfully: {export_path}")

     # If an output path was given, rename the file
     if args.output and args.output != export_path:
          import os, shutil

          shutil.move(export_path, args.output)
          export_path = args.output
          print(f"📦 ONNX file moved to: {export_path}")



if __name__ == "__main__":
    main()
