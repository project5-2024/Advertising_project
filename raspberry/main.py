from PIL import ImageTk, Image
import tkinter as tk
import urllib.request
import io

def display_image_from_url(url):
   root = tk.Tk()
   root.title("Displaying Images from URL in Tkinter")
   root.geometry("1920x1080")
   try:
      with urllib.request.urlopen(url) as u:
         raw_data = u.read()
   except Exception as e:
      print(f"Error fetching image: {e}")
      return

   try:
      image = Image.open(io.BytesIO(raw_data))
      photo = ImageTk.PhotoImage(image)
   except Exception as e:
      print(f"Error opening image: {e}")
      return
   
   label = tk.Label(root, image=photo)
   label.pack()
   root.attributes("-fullscreen", True)
   root.mainloop()

display_image_from_url("https://www.tutorialspoint.com/python_pillow/images/tutorials_point.jpg")