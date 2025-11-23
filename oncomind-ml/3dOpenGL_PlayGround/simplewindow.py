"""
Simple Window using PyOpenGL - ( New OpenGL )
"""
import glfw
from OpenGL.GL import * 
window = glfw.create_window(1000, 800, "Pycasm Window", None, None)
if not window:
     glfw.terminate()
     print("Glfw window can't be created")
     exit()

glfw.set_window_pos(window, 100,100) 
glfw.make_context_current(window)
while not glfw.window_should_close(window):
    glfw.poll_events()
    glfw.swap_buffers(window)
glfw.terminate()