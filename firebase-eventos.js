import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    doc,
    onSnapshot
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Tu configuración de Firebase (que puedes encontrar en la consola de Firebase)
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén una instancia de Firestore
const db = getFirestore(app);

const eventosRef = collection(db, "eventos");

// AGREGAR EVENTO
export async function agregarEvento(titulo, descripcion, fecha_inicio, fecha_fin, persona) {
    try {
        const docRef = await addDoc(eventosRef, {
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            persona
        });
        console.log("✅ Evento agregado con ID:", docRef.id);
    } catch (error) {
        console.error("❌ Error al agregar evento:", error);
    }
}
  
// EDITAR EVENTO
export async function editarEvento(eventoId, nuevoEvento) {
    try {
        const eventoRef = doc(db, "eventos", eventoId);
        await updateDoc(eventoRef, nuevoEvento);
        console.log("✅ Evento actualizado");
    } catch (error) {
        console.error("❌ Error al editar evento:", error);
    }
}

// ELIMINAR EVENTO
export async function eliminarEvento(eventoId) {
    try {
        const eventoRef = doc(db, "eventos", eventoId);
        await deleteDoc(eventoRef);
        console.log("✅ Evento eliminado");
    } catch (error) {
        console.error("❌ Error al eliminar evento:", error);
    }
}

// OBTENER TODOS LOS EVENTOS
export async function obtenerEventos() {
    try {
        const querySnapshot = await getDocs(eventosRef);
        const eventos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log("📃 Eventos obtenidos:", eventos);
        return eventos;
    } catch (error) {
        console.error("❌ Error al obtener eventos:", error);
    }
}

// 🔁 ESCUCHAR CAMBIOS EN TIEMPO REAL (opcional)
export function escucharEventos(callback) {
    return onSnapshot(eventosRef, (snapshot) => {
        const eventos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(eventos);
    });
}
