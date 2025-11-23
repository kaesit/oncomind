import pygame
from OpenGL.GL import *
from OpenGL.GLU import *


def load_obj(path):
     vertices = []
     faces = []

     with open(path, "r") as f:
          for line in f:
               if line.startswith("v "):
                    parts = line.split()
                    vertex = list(map(float, parts[1:4]))
                    vertices.append(vertex)

               elif line.startswith("f "):
                    parts = line.split()[1:]
                    face = []
                    for part in parts:
                         vertex_index = int(part.split("/")[0]) - 1
                         face.append(vertex_index)
                    faces.append(face)

     return vertices, faces


def render_model(vertices, faces):
     glBegin(GL_TRIANGLES)

     for face in faces:
          for i in range(1, len(face) - 1):
               glVertex3fv(vertices[face[0]])
               glVertex3fv(vertices[face[i]])
               glVertex3fv(vertices[face[i + 1]])

     glEnd()


def main():
     pygame.init()
     display = (800, 600)
     pygame.display.set_mode(display, pygame.OPENGL | pygame.DOUBLEBUF)

     glEnable(GL_DEPTH_TEST)
     gluPerspective(85, display[0] / display[1], 0.1, 50.0)
     glTranslatef(0.0, 0.0, -5)

     vertices, faces = load_obj("../assets/obj/cube.obj")

     running = True
     while running:
          for event in pygame.event.get():
               if event.type == pygame.QUIT:
                    running = False

          glRotatef(1, 1, 1, 1)
          glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)

          render_model(vertices, faces)

          pygame.display.flip()
          pygame.time.wait(50)

     pygame.quit()


if __name__ == "__main__":
    main()
