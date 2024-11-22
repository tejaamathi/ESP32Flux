import tkinter as tk

class DrawingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Drawing App")

        self.canvas = tk.Canvas(root, width=800, height=600, bg="white")
        self.canvas.pack(fill=tk.BOTH, expand=True)

        self.color_label = tk.Label(root, text="Color:")
        self.color_label.pack(side=tk.LEFT, padx=10)

        self.color_var = tk.StringVar()
        self.color_var.set("black")

        self.color_entry = tk.Entry(root, textvariable=self.color_var)
        self.color_entry.pack(side=tk.LEFT)

        self.brush_size_label = tk.Label(root, text="Brush Size:")
        self.brush_size_label.pack(side=tk.LEFT, padx=10)

        self.brush_size_var = tk.IntVar()
        self.brush_size_var.set(5)

        self.brush_size_entry = tk.Entry(root, textvariable=self.brush_size_var)
        self.brush_size_entry.pack(side=tk.LEFT)

        self.clear_button = tk.Button(root, text="Clear", command=self.clear_canvas)
        self.clear_button.pack(side=tk.LEFT, padx=10)

        self.canvas.bind("<B1-Motion>", self.draw)

        self.last_x, self.last_y = None, None

    def draw(self, event):
        x, y = event.x, event.y
        color = self.color_var.get()
        brush_size = self.brush_size_var.get()

        if self.last_x and self.last_y:
            self.canvas.create_line(self.last_x, self.last_y, x, y, width=brush_size, fill=color, capstyle=tk.ROUND, smooth=tk.TRUE)

        self.last_x, self.last_y = x, y

    def clear_canvas(self):
        self.canvas.delete("all")
        self.last_x, self.last_y = None, None

if __name__ == "__main__":
    root = tk.Tk()
    app = DrawingApp(root)
    root.mainloop()
        



