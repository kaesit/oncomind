import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *

# --- BÖLÜM 1: OBJ Yükleyici Fonksiyonu ---
def OBJ_Yukle(dosya_yolu):
     vertice_listesi = [] # Noktaları (x,y,z) burada tutacağız
     yuzey_listesi = []   # Yüzeyleri (nokta sırası) burada tutacağız

     try:
          dosya = open(dosya_yolu, 'r') # Dosyayı okuma modunda aç
          for satir in dosya:
               # Satırın başındaki ve sonundaki boşlukları temizle, parçalara ayır
               degerler = satir.split()
            
               # Eğer satır boşsa atla
               if not degerler:
                    continue

               # 'v' ile başlıyorsa bu bir VERTEX (Köşe) noktasıdır
               if degerler[0] == 'v':
                    # Koordinatları float'a çevirip listeye ekle
                    # degerler[1], [2], [3] -> x, y, z
                    vertice_listesi.append(list(map(float, degerler[1:4])))

               # 'f' ile başlıyorsa bu bir FACE (Yüzey) bilgisidir
               elif degerler[0] == 'f':
                    yuzey = []
                    for v in degerler[1:]:
                         # OBJ dosyalarında bazen "1/1/1" gibi texture/normal verileri olur.
                         # Bize sadece ilk sayı (vertex indeksi) lazım, o yüzden '/' ile bölüyoruz.
                         w = v.split('/')
                         # OBJ indeksleri 1'den başlar, Python 0'dan. O yüzden -1 yapıyoruz.
                         yuzey.append(int(w[0]) - 1)
                    yuzey_listesi.append(yuzey)
        
          dosya.close()
          return vertice_listesi, yuzey_listesi

     except IOError:
          print(f"{dosya_yolu} bulunamadı!")
          return [], []

# --- BÖLÜM 2: Ana Döngü ve Çizim ---

def main():
     pygame.init()
     # 800x600 bir pencere aç, OpenGL kullanacağını belirt (DOUBLEBUF | OPENGL)
     display = (800, 600)
     pygame.display.set_mode(display, DOUBLEBUF | OPENGL)

     # Kamera Ayarları (Perspektif)
     # 45 derece açı, en-boy oranı, en yakın 0.1, en uzak 50.0 birim görünsün
     gluPerspective(45, (display[0]/display[1]), 0.1, 50.0)

     # Kamerayı Z ekseninde geriye çek (Modeli görebilmek için)
     glTranslatef(0.0, 0.0, -5)

     # Modelimizi yüklüyoruz (Dosya adını buraya yazın)
     # Not: Eğer elinde dosya yoksa basit bir küp objesi bulmalısın.
     vertices, faces = OBJ_Yukle("../assets/obj/cube.obj") 

     # Eğer dosya yüklenemediyse programı durdurma, hata verip devam etsin
     if not vertices:
          print("Model yüklenemedi, lütfen dosya adını kontrol et.")

     # Oyun Döngüsü
     while True:
          for event in pygame.event.get():
               if event.type == pygame.QUIT:
                    pygame.quit()
               quit()

          # Modeli kendi ekseninde sürekli döndür (X=1, Y=1 hızında)
          glRotatef(1, 1, 1, 0)

          # Ekranı temizle (Hem renk hem derinlik tamponunu)
          glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)

          # --- ÇİZİM BAŞLANGICI ---
          glBegin(GL_TRIANGLES) # veya GL_QUADS (Modeline göre değişir)
        
          for yuzey in faces:
               # Yüzeyin her bir noktası için
               for vertex_id in yuzey:
                    # O noktanın koordinatlarını al
                    vertex = vertices[vertex_id]
                    # OpenGL'e bu noktayı çizmesini söyle
                    glVertex3fv(vertex)
        
          glEnd()
          # --- ÇİZİM BİTİŞİ ---

          # Çizimi ekrana yansıt
          pygame.display.flip()
          pygame.time.wait(10) # Çok hızlı dönmemesi için küçük bir bekleme

if __name__ == "__main__":
    main()