from ultralytics import YOLO
import argparse
from typing import Optional

class YOLODiagnosticTool:
    """
    YOLO modelini kullanarak erken kanser hücresi sınıflandırması için bir araç.
    Hem komut satırı argümanları hem de programatik içe aktarma yoluyla çalışabilir.
    """
    def __init__(self, model_path: str):
        """
        Modelin yolunu alarak sınıfı başlatır ve YOLO modelini yükler.

        Args:
            model_path (str): YOLO model dosyasının yolu (örn. 'yolov10n.pt').
        """
        self.model_path = model_path
        print(f"🔹 Loading YOLO model from {self.model_path} ...")
        # Model yükleme işlemini __init__ içinde yapıyoruz
        self.model = YOLO(self.model_path)
        print("✅ YOLO model loaded successfully.")

    def run_inference(self, image_source: str, show_result: bool = True):
        """
        Belirtilen görüntü üzerinde çıkarım (inference) çalıştırır.

        Args:
            image_source (str): Test görüntüsünün yolu veya URL'si.
            show_result (bool): Sonucu görsel olarak göstermek isteyip istemediğiniz.
            
        Returns:
            list: YOLO modelinden dönen sonuçlar listesi.
        """
        print(f"🔹 Running inference on image: {image_source}")
        
        # Orijinal koddaki model(image) çağrısını burada yapıyoruz.
        results = self.model(image_source) 
        
        if show_result and results:
            results[0].show()
        
        print("✅ Inference completed successfully!")
        return results

    @staticmethod
    def run_from_cli():
        """
        Komut satırı argümanlarını ayrıştırır ve aracı başlatıp çıkarımı çalıştırır.
        Bu metod, komut satırı testleri için orijinal 'main' fonksiyonunun yerine geçer.
        """
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
        
        # 1. Sınıfı başlat
        tool = YOLODiagnosticTool(model_path=args.model)
        
        # 2. Argüman varsa çıkarımı çalıştır
        if args.test_image:
            tool.run_inference(image_source=args.test_image, show_result=True)
        else:
            print("ℹ️ No test image provided. Model is loaded and ready for use.")


# Dosya doğrudan çalıştırıldığında CLI modunu etkinleştir.
if __name__ == "__main__":
    YOLODiagnosticTool.run_from_cli()