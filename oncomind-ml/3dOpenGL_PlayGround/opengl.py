from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *
import sys

def draw():
     x = 45
     y = 45
     glRotatef(x, 1.0, 0.0, 0.0)
     glRotatef(y, 1.0, 1.0, 0.0)
     glClear(GL_COLOR_BUFFER_BIT)
     glutWireCube(0.7)
     
     glFlush()
     
glutInit(sys.argv)
glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)
glutInitWindowSize(500, 500)
glutInitWindowPosition(100, 100)
glutCreateWindow(b"Cube")
glutDisplayFunc(draw)
glutMainLoop()

