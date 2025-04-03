import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebaseConfig";
import {
  collection, addDoc, serverTimestamp, updateDoc, doc,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL,
} from "firebase/storage";

export default function PublicarForm() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [imagenes, setImagenes] = useState([]);

  const handleFileChange = (e) => {
    setImagenes([...e.target.files]);
  };

  const handlePublicar = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert("Debés iniciar sesión para publicar.");

    try {
      const publicacionRef = await addDoc(collection(db, "publicaciones"), {
        titulo,
        descripcion,
        precio: parseInt(precio),
        ubicacion,
        propietarioId: user.uid,
        propietarioEmail: user.email,
        timestamp: serverTimestamp(),
        imagenes: [],
      });

      const urls = [];
      for (let i = 0; i < imagenes.length; i++) {
        const archivo = imagenes[i];
        const storageRef = ref(storage, `publicaciones/${publicacionRef.id}/${archivo.name}`);
        await uploadBytes(storageRef, archivo);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }

      await updateDoc(doc(db, "publicaciones", publicacionRef.id), { imagenes: urls });

      alert("¡Publicación creada con éxito!");
      setTitulo(""); setDescripcion(""); setPrecio(""); setUbicacion(""); setImagenes([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al publicar.");
    }
  };

  return (
    <form onSubmit={handlePublicar} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Publicá tu propiedad</h2>
      <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} />
      <input placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button type="submit">Publicar</button>
    </form>
  );
}
