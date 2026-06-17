import tkinter as tk
from tkinter import filedialog, ttk, messagebox
from PIL import Image
import os
import shutil
import json
import re
from urllib.parse import unquote

# --- CONFIGURATION ---
# These paths ensure the script knows exactly where your project lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_JS = os.path.join(BASE_DIR, "projects.js")
ASSETS_DIR = os.path.join(BASE_DIR, "public", "assets")

class ProjectManager:
    def __init__(self, root):
        self.root = root
        self.root.title("alreadystillagain - Portfolio Manager")
        self.root.geometry("900x600")

        self.projects = []
        self.editing_index = None # None means adding new, integer means editing existing

        # Ensure assets directory exists
        if not os.path.exists(ASSETS_DIR):
            os.makedirs(ASSETS_DIR)

        self.load_projects_from_js()
        self.setup_ui()

    def setup_ui(self):
        # Main container using PanedWindow for resizable sections
        self.paned = ttk.PanedWindow(self.root, orient=tk.HORIZONTAL)
        self.paned.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # --- LEFT SIDE: LIST & ORDERING ---
        left_frame = ttk.Frame(self.paned, padding="10")
        self.paned.add(left_frame, weight=1)

        ttk.Label(left_frame, text="Current Projects", font=("Helvetica", 14, "bold")).pack(pady=(0, 10))
        
        self.listbox = tk.Listbox(left_frame, font=("Helvetica", 12), selectmode=tk.SINGLE)
        self.listbox.pack(fill=tk.BOTH, expand=True, side=tk.LEFT)
        self.listbox.bind('<<ListboxSelect>>', self.on_select_project)

        scrollbar = ttk.Scrollbar(left_frame, orient=tk.VERTICAL, command=self.listbox.yview)
        scrollbar.pack(side=tk.LEFT, fill=tk.Y)
        self.listbox.config(yscrollcommand=scrollbar.set)

        order_btns = ttk.Frame(left_frame)
        order_btns.pack(side=tk.RIGHT, fill=tk.Y, padx=(10, 0))
        ttk.Button(order_btns, text="▲", width=3, command=lambda: self.move_project(-1)).pack(pady=5)
        ttk.Button(order_btns, text="▼", width=3, command=lambda: self.move_project(1)).pack(pady=5)
        ttk.Button(order_btns, text="🗑", width=3, command=self.delete_project).pack(side=tk.BOTTOM, pady=20)

        # --- RIGHT SIDE: FORM ---
        right_frame = ttk.Frame(self.paned, padding="20")
        self.paned.add(right_frame, weight=2)

        self.form_label = ttk.Label(right_frame, text="Add New Project", font=("Helvetica", 14, "bold"))
        self.form_label.pack(pady=(0, 15))

        # Title
        ttk.Label(right_frame, text="Project Title:").pack(anchor=tk.W)
        self.title_entry = ttk.Entry(right_frame, width=50)
        self.title_entry.pack(fill=tk.X, pady=(0, 15))

        # Type
        ttk.Label(right_frame, text="Media Type:").pack(anchor=tk.W)
        self.type_var = tk.StringVar(value="video")
        ttk.OptionMenu(right_frame, self.type_var, "video", "video", "image", "audio", "link").pack(fill=tk.X, pady=(0, 15))

        # Vimeo ID
        ttk.Label(right_frame, text="Full-Size Media (Vimeo ID / URL / Local Path):").pack(anchor=tk.W)
        self.vimeo_entry = ttk.Entry(right_frame, width=50)
        self.vimeo_entry.pack(fill=tk.X, pady=(0, 15))

        # Page Visibility
        ttk.Label(right_frame, text="Show on Pages:").pack(anchor=tk.W)
        self.page_options = ["home", "recent work", "vhs multitracking", "still", "music videos", "music", "watch tv", "interactive"]
        self.page_vars = {page: tk.BooleanVar() for page in self.page_options}
        page_frame = ttk.Frame(right_frame)
        page_frame.pack(fill=tk.X, pady=(0, 15))
        for i, page in enumerate(self.page_options):
            ttk.Checkbutton(page_frame, text=page, variable=self.page_vars[page]).grid(row=i//4, column=i%4, sticky=tk.W, padx=5)

        # Description
        ttk.Label(right_frame, text="Description:").pack(anchor=tk.W)
        self.desc_text = tk.Text(right_frame, height=4, width=50, font=("Helvetica", 12))
        self.desc_text.pack(fill=tk.X, pady=(0, 15))

        # Thumbnail Selection
        self.thumb_path = ""
        self.file_btn = ttk.Button(right_frame, text="Select Thumbnail Source (Auto-resizes to 300px)", command=self.select_file)
        self.file_btn.pack(fill=tk.X, pady=(0, 5))
        self.file_label = ttk.Label(right_frame, text="No new file selected", foreground="gray")
        self.file_label.pack(anchor=tk.W, pady=(0, 20))

        # Actions
        btn_frame = ttk.Frame(right_frame)
        btn_frame.pack(fill=tk.X, side=tk.BOTTOM)
        
        self.submit_btn = ttk.Button(btn_frame, text="SAVE PROJECT", command=self.save_project)
        self.submit_btn.pack(side=tk.RIGHT, padx=5, ipady=5)
        
        ttk.Button(btn_frame, text="ADD NEW", command=self.set_new_mode).pack(side=tk.RIGHT, padx=5, ipady=5)
        ttk.Button(btn_frame, text="CLEAR FIELDS", command=self.clear_fields).pack(side=tk.RIGHT, padx=5, ipady=5)

        self.refresh_listbox()

    def load_projects_from_js(self):
        if not os.path.exists(PROJECTS_JS):
            self.projects = []
            print(f"Creating new projects list (File not found at {PROJECTS_JS})")
            return

        try:
            with open(PROJECTS_JS, "r") as f:
                content = f.read()
            
            # Find all content between { and }
            blocks = re.findall(r'\{(.*?)\}', content, re.DOTALL)
            self.projects = []
            for block in blocks:
                item = {}
                # Smart regex to find key: "value" or key: ["val1", "val2"]
                field_matches = re.findall(r'(\w+):\s*(?:["\'](.*?)["\']|\[(.*?)\])', block)
                for key, val_str, array_str in field_matches:
                    if array_str:
                        # Clean up array string: ["home", "time"] -> ["home", "time"]
                        item[key] = [v.strip().strip('"').strip("'") for v in array_str.split(',') if v.strip()]
                    else:
                        item[key] = val_str
                if item: 
                    self.projects.append(item)
            print(f"Successfully loaded {len(self.projects)} projects from {PROJECTS_JS}")
        except Exception as e:
            messagebox.showerror("Load Error", f"Could not parse projects.js: {e}")

    def refresh_listbox(self):
        self.listbox.delete(0, tk.END)
        for p in self.projects:
            display_text = f"[{p.get('type', '???').upper()}] {p.get('title', 'Untitled')}"
            self.listbox.insert(tk.END, display_text)

    def on_select_project(self, event):
        selection = self.listbox.curselection()
        if not selection: return
        
        self.editing_index = selection[0]
        p = self.projects[self.editing_index]
        
        self.form_label.config(text=f"Editing: {p['title']}")
        self.title_entry.delete(0, tk.END)
        self.title_entry.insert(0, p.get('title', ''))
        self.type_var.set(p.get('type', 'video'))
        self.vimeo_entry.delete(0, tk.END)
        self.vimeo_entry.insert(0, p.get('vimeoId', p.get('imageUrl', p.get('audioUrl', p.get('linkUrl', '')))))
        self.desc_text.delete("1.0", tk.END)
        self.desc_text.insert("1.0", p.get('description', '').replace('\\"', '"').replace('\\n', '\n'))
        
        # Set checkboxes
        project_pages = p.get('pages', [])
        for page in self.page_options:
            self.page_vars[page].set(page in project_pages)
            
        self.file_label.config(text=f"Existing: {p.get('thumbnail')}")
        self.thumb_path = "" # Reset so we don't overwrite unless a new file is picked

    def set_new_mode(self):
        self.editing_index = None
        self.form_label.config(text="Add New Project")

    def clear_fields(self):
        self.title_entry.delete(0, tk.END)
        self.vimeo_entry.delete(0, tk.END)
        self.desc_text.delete("1.0", tk.END)
        for var in self.page_vars.values():
            var.set(False)
        self.file_label.config(text="No file selected", foreground="gray")
        self.thumb_path = ""

    def move_project(self, direction):
        selection = self.listbox.curselection()
        if not selection: return
        idx = selection[0]
        new_idx = idx + direction
        if 0 <= new_idx < len(self.projects):
            self.projects[idx], self.projects[new_idx] = self.projects[new_idx], self.projects[idx]
            self.save_all_to_js()
            self.refresh_listbox()
            self.listbox.select_set(new_idx)
            # Update the form to reflect the new position
            self.on_select_project(None)

    def delete_project(self):
        selection = self.listbox.curselection()
        if not selection or not messagebox.askyesno("Delete", "Are you sure?"): return
        self.projects.pop(selection[0])
        self.save_all_to_js()
        self.refresh_listbox()
        self.clear_fields()
        self.set_new_mode()

    def select_file(self):
        path = filedialog.askopenfilename(filetypes=[("Image files", "*.jpg *.jpeg *.png *.webp")])
        if path:
            self.thumb_path = path
            self.file_label.config(text=os.path.basename(path), foreground="black")

    def save_project(self):
        try:
            title = self.title_entry.get().strip()
            v_val = self.vimeo_entry.get().strip()
            # Escape quotes for JS
            desc = self.desc_text.get("1.0", tk.END).strip().replace('"', '\\"').replace('\n', '\\n')
            m_type = self.type_var.get()
            selected_pages = [page for page, var in self.page_vars.items() if var.get()]

            if not title:
                messagebox.showerror("Error", "Title is required.")
                return
            
            if m_type == "video" and not v_val:
                messagebox.showerror("Error", "Vimeo ID is required for video projects.")
                return

            # --- Process Media Input ---
            processed_media_url = v_val # The URL/ID that goes into projects.js
            local_media_source = None   # The actual file on disk if it's local

            if v_val.startswith("file://"):
                local_media_source = unquote(v_val.replace("file://", ""))
            elif os.path.exists(v_val):
                local_media_source = v_val
            
            public_dir = os.path.join(BASE_DIR, "public")
            if local_media_source and local_media_source.startswith(public_dir):
                processed_media_url = local_media_source.replace(public_dir, "").replace("\\", "/")
            elif local_media_source and not local_media_source.startswith('http'):
                # Local file outside the project - copy it to assets
                base = os.path.basename(local_media_source)
                target = os.path.join(ASSETS_DIR, base)
                if local_media_source != target:
                    shutil.copy(local_media_source, target)
                processed_media_url = f"/assets/{base}"
                local_media_source = target # Use the local copy as the thumb source

            # --- Determine Thumbnail Source ---
            thumb_src = None
            if self.thumb_path:
                thumb_src = self.thumb_path
            elif m_type == "image" and local_media_source:
                thumb_src = local_media_source
            elif self.editing_index is not None:
                existing = self.projects[self.editing_index]
                t_url = existing.get('thumbnail', '')
                if t_url.startswith('/assets/') and not os.path.basename(t_url).startswith('thumb_'):
                    p = os.path.join(public_dir, t_url.lstrip('/'))
                    if os.path.exists(p): thumb_src = p
                elif m_type == "image" and existing.get('imageUrl', '').startswith('/assets/'):
                    p = os.path.join(public_dir, existing['imageUrl'].lstrip('/'))
                    if os.path.exists(p): thumb_src = p

            final_thumb_url = ""
            final_full_url = ""

            if thumb_src:
                ext = os.path.splitext(thumb_src)[1]
                base_name = os.path.basename(thumb_src)
                if base_name.startswith("thumb_"):
                    base_name = base_name.replace("thumb_", "")
                
                # For videos, name the thumb after the Vimeo ID
                if m_type == "video" and v_val:
                    base_name = f"{v_val}{ext}"

                thumb_name = f"thumb_{base_name}"
                os.makedirs(ASSETS_DIR, exist_ok=True)
                thumb_dest = os.path.join(ASSETS_DIR, thumb_name)
                full_dest = os.path.join(ASSETS_DIR, base_name)

                # Copy high-res file if thumb_src was the full-size input
                if m_type == "image" and thumb_src == local_media_source and local_media_source != full_dest:
                    shutil.copy(local_media_source, full_dest)
                
                # Generate 300x300 square thumb
                with Image.open(thumb_src) as img:
                    img = img.convert("RGBA") if img.mode in ("RGBA", "P") else img.convert("RGB")
                    w, h = img.size
                    min_dim = min(w, h)
                    left = (w - min_dim) / 2
                    top = (h - min_dim) / 2
                    right = (w + min_dim) / 2
                    bottom = (h + min_dim) / 2
                    img = img.crop((left, top, right, bottom))
                    img = img.resize((300, 300), Image.LANCZOS)
                    img.save(thumb_dest)

                final_thumb_url = f"/assets/{thumb_name}"
                if m_type == "image":
                    final_full_url = f"/assets/{base_name}"
            elif self.editing_index is not None:
                existing = self.projects[self.editing_index]
                final_thumb_url = existing.get('thumbnail', '')
                if m_type == "image":
                    final_full_url = existing.get('imageUrl', final_thumb_url)
            
            new_data = {
                "id": v_val if (m_type == "video" and v_val) else title.replace(" ", "-").lower(),
                "type": m_type,
                "title": title,
                "thumbnail": final_thumb_url,
                "description": desc,
                "pages": selected_pages
            }
            
            if m_type == "video":
                new_data["vimeoId"] = processed_media_url
            elif m_type == "image":
                new_data["imageUrl"] = processed_media_url if processed_media_url else final_full_url
            elif m_type == "audio":
                new_data["audioUrl"] = processed_media_url
            elif m_type == "link":
                new_data["linkUrl"] = processed_media_url

            if self.editing_index is not None:
                self.projects[self.editing_index] = new_data
            else:
                self.projects.append(new_data)

            self.save_all_to_js()
            messagebox.showinfo("Success", "Website Updated Successfully.")
            self.refresh_listbox()
            self.clear_fields()
            self.set_new_mode()
        except Exception as e:
            messagebox.showerror("Save Error", f"An error occurred while saving: {e}")

    def save_all_to_js(self):
        try:
            js_content = "export const projects = [\n"
            for i, p in enumerate(self.projects):
                js_content += "  {\n"
                js_content += f'    id: "{p["id"]}",\n'
                js_content += f'    type: "{p["type"]}",\n'
                js_content += f'    title: "{p["title"]}",\n'
                js_content += f'    thumbnail: "{p["thumbnail"]}",\n'
                if p["type"] == "video":
                    js_content += f'    vimeoId: "{p.get("vimeoId", "")}",\n'
                elif p["type"] == "image":
                    js_content += f'    imageUrl: "{p.get("imageUrl", p["thumbnail"])}",\n'
                elif p["type"] == "audio":
                    js_content += f'    audioUrl: "{p.get("audioUrl", "")}",\n'
                elif p["type"] == "link":
                    js_content += f'    linkUrl: "{p.get("linkUrl", "")}",\n'
                js_content += f'    description: "{p["description"]}",\n'
                pages_json = json.dumps(p.get("pages", []))
                js_content += f'    pages: {pages_json}\n'
                js_content += "  }" + (",\n" if i < len(self.projects) - 1 else "\n")
            js_content += "];"
            
            with open(PROJECTS_JS, "w") as f:
                f.write(js_content)
        except Exception as e:
            messagebox.showerror("Write Error", f"Could not write to projects.js: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = ProjectManager(root)
    root.mainloop()