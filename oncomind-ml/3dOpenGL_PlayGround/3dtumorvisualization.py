import pyvista as pv
from skimage import measure
import numpy as np

# 1. Veriyi Yükle (Örnek: 3D bir numpy dizisi, 1=tümör, 0=normal doku)
# Gerçek hayatta bunu AI modeliniz üretecek
tumor_volume_data = np.load("tumor_mask_3d.npy")

# 2. Marching Cubes ile 3D Mesh oluştur (Algorithmik kısım)
# Bu işlem voxel verisini OpenGL'in anlayacağı vertex/face yapısına çevirir
verts, faces, normals, values = measure.marching_cubes(tumor_volume_data, level=0.5)

# 3. PyVista (OpenGL Wrapper) ile Görselleştirme
# Mesh objesini oluştur
mesh = pv.PolyData(verts, faces)

# Sahneye ekle
plotter = pv.Plotter()
plotter.add_mesh(mesh, color="red", opacity=0.5, show_edges=True)
plotter.add_text("3D Tumor Visualization", position='upper_left')

# Etkileşimli pencereyi aç
plotter.show()