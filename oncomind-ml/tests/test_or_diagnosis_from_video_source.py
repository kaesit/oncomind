from ultralytics import YOLO
import cv2
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
          "--video-source",
          type=str,
          default=None,
          help="Optional test image (path or URL) to verify inference with the chosen model.",
     )
     
     args = parser.parse_args()
     
     print(f"🔹 Loading YOLO model from {args.model} ...")
     model = YOLO(args.model)
     


     # 1) model içinden isimleri almaya çalış
     names = None
     if hasattr(model, "names") and model.names:
          names = model.names
     else:
          try:
               names = model.model.names
          except Exception:
               names = None

     # 2) yoksa burada kendi sınıf listen (ör: COCO) ver
     if names is None:
          # örnek: COCO-80 kısa liste (buna ihtiyacın varsa tamamını vereyim)
          # veya kendi custom listen: ["person","face","dog", ...]
          manual_names = [
               "person",
               "bicycle",
               "car",
               "motorcycle",
               "airplane",
               "bus",
               "train",
               "truck",
               "boat",
               "traffic light",
               "fire hydrant",
               "stop sign",
               "parking meter",
               "bench",
               "bird",
               "cat",
               "dog",
               "horse",
               "sheep",
               "cow",
               "elephant",
               "bear",
               "zebra",
               "giraffe",
               "backpack",
               "umbrella",
               "handbag",
               "tie",
               "suitcase",
               "frisbee",
               "skis",
               "snowboard",
               "sports ball",
               "kite",
               "baseball bat",
               "baseball glove",
               "skateboard",
               "surfboard",
               "tennis racket",
               "bottle",
               "wine glass",
               "cup",
               "fork",
               "knife",
               "spoon",
               "bowl",
               "banana",
               "apple",
               "sandwich",
               "orange",
               "broccoli",
               "carrot",
               "hot dog",
               "pizza",
               "donut",
               "cake",
               "chair",
               "couch",
               "potted plant",
               "bed",
               "dining table",
               "toilet",
               "tv",
               "laptop",
               "mouse",
               "remote",
               "keyboard",
               "cell phone",
               "microwave",
               "oven",
               "toaster",
               "sink",
               "refrigerator",
               "book",
               "clock",
               "vase",
               "scissors",
               "teddy bear",
               "hair drier",
               "toothbrush",
          ]
          names = manual_names

     cap = cv2.VideoCapture(args.video_source)
     while True:
          ret, frame = cap.read()
          if not ret:
               break

          results = model.predict(source=frame, stream=False, verbose=False)
          res = results[0]
          boxes = res.boxes.xyxy.cpu().numpy() if hasattr(res.boxes, "xyxy") else []
          scores = res.boxes.conf.cpu().numpy() if hasattr(res.boxes, "conf") else []
          classes = (
               res.boxes.cls.cpu().numpy().astype(int) if hasattr(res.boxes, "cls") else []
          )

          for xyxy, conf, cls in zip(boxes, scores, classes):
               x1, y1, x2, y2 = map(int, xyxy)
               label = names[cls] if cls < len(names) else str(cls)
               cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
               cv2.putText(
                    frame,
                    f"{label} {conf:.2f}",
                    (x1, y1 - 6),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    1,
               )

          cv2.imshow("out", frame)
          if cv2.waitKey(1) & 0xFF == ord("q"):
               break

     cap.release()
     cv2.destroyAllWindows()

if __name__ == "__main__":
     main()