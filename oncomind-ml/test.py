import cv2
from ultralytics import YOLO

model = YOLO("./runs/segment/cancer_cell_healthy_unhealthy_fixed/weights/best.pt")
results = model.predict(source="./datasets/Cancer detection.v3i.yolov11/test/images/139_02_bmp.rf.a9dd94b384e192e7396d8d10e0e88158.jpg", imgsz=640, conf=0.25)

# YOLO plot fonksiyonu, maskeleri ve kutuları görselleştirir
img = results[0].plot()

# OpenCV ile göster
cv2.imshow("Segmentation Result", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
