import tkinter as tk
from tkinter import filedialog, messagebox
import shutil
import os

HTML_FILE = "index.html"
IMAGE_DIR = "images"

# Vérifie que le dossier images existe
if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)

chemin_image_html = ""

def choisir_image():
    global chemin_image_html
    chemin = filedialog.askopenfilename(
        title="Choisir une image",
        filetypes=[("Images", "*.png *.jpg *.jpeg *.gif *.webp")]
    )
    if chemin:
        nom_fichier = os.path.basename(chemin)
        destination = os.path.join(IMAGE_DIR, nom_fichier)

        try:
            shutil.copy(chemin, destination)
            chemin_image_html = os.path.join(IMAGE_DIR, nom_fichier).replace("\\", "/")
            label_image.config(text=f"Image : {chemin_image_html}")
        except Exception as e:
            messagebox.showerror("Erreur", f"Erreur lors de la copie : {e}")

def ajouter_projet():
    global chemin_image_html
    titre = entry_titre.get()
    type_projet = entry_type.get()
    description = entry_description.get("1.0", tk.END).strip()
    lien = entry_lien.get()

    if not all([titre, type_projet, description, lien, chemin_image_html]):
        messagebox.showwarning("Champs manquants", "Merci de remplir tous les champs.")
        return

    bloc_html = f"""
      <div class=\"project-card rounded-lg overflow-hidden\">
        <img src=\"{chemin_image_html}\" alt=\"{titre}\" class=\"w-full h-48 object-cover\">
        <div class=\"p-6\">
          <h3 class=\"text-xl font-semibold mb-2\">{titre}</h3>
          <div class=\"flex flex-wrap mb-4\">
            {''.join([f'<span class=\"tech-badge\">{tech.strip()}</span>' for tech in type_projet.split(',')])}
          </div>
          <p class=\"text-gray-400 text-sm mb-6\">{description}</p>
          <a href=\"{lien}\" class=\"bg-primary text-white px-4 py-2 rounded text-sm\">Voir plus</a>
        </div>
      </div>
"""

    if not os.path.exists(HTML_FILE):
        messagebox.showerror("Erreur", f"Fichier {HTML_FILE} non trouvé.")
        return

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lines = []
    inserted = False
    for i, line in enumerate(lines):
        new_lines.append(line)
        if '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 slide-in">' in line and not inserted:
            new_lines.append(bloc_html + "\n")
            inserted = True

    if inserted:
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
        messagebox.showinfo("Succès", "Projet ajouté avec succès !")
        entry_titre.delete(0, tk.END)
        entry_type.delete(0, tk.END)
        entry_description.delete("1.0", tk.END)
        entry_lien.delete(0, tk.END)
        chemin_image_html = ""
        label_image.config(text="Aucune image sélectionnée")
    else:
        messagebox.showerror("Erreur", "Impossible d’insérer le projet.")

# Interface
root = tk.Tk()
root.title("Ajouter un projet au Portfolio")
root.geometry("500x550")

tk.Label(root, text="Titre du projet").pack()
entry_titre = tk.Entry(root, width=60)
entry_titre.pack()

tk.Label(root, text="Type de projet (séparé par des virgules)").pack()
entry_type = tk.Entry(root, width=60)
entry_type.pack()

tk.Label(root, text="Description").pack()
entry_description = tk.Text(root, height=6, width=60)
entry_description.pack()

tk.Label(root, text="Lien GitHub / Démo").pack()
entry_lien = tk.Entry(root, width=60)
entry_lien.pack()

tk.Button(root, text="Choisir une image", command=choisir_image).pack(pady=5)
label_image = tk.Label(root, text="Aucune image sélectionnée")
label_image.pack()

tk.Button(root, text="Ajouter au Portfolio", command=ajouter_projet).pack(pady=10)

root.mainloop()