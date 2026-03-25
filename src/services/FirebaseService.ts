import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Project } from '../components/ProjectCard';

export const FirebaseService = {
  /**
   * Save a new project to Firestore
   */
  async saveProject(
    project: Omit<Project, 'id' | 'createdAt'> & { userId: string }
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...project,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Fetch all projects for a specific user
   */
  async fetchUserProjects(userId: string): Promise<Project[]> {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        name: data.name,
        outputType: data.outputType,
        createdAt: data.createdAt?.toDate() || new Date(),
        fileCount: data.fileCount,
        content: data.content,
        isPublic: data.isPublic ?? false,
      });
    });

    return projects;
  },

  /**
   * Delete a project from Firestore
   */
  async deleteProject(projectId: string): Promise<void> {
    await deleteDoc(doc(db, 'projects', projectId));
  },

  /**
   * Toggle project public/private visibility
   */
  async updateVisibility(projectId: string, isPublic: boolean): Promise<void> {
    await updateDoc(doc(db, 'projects', projectId), { isPublic });
  },

  /**
   * Fetch a single project by ID (for sharing)
   */
  async getPublicProject(projectId: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      outputType: data.outputType,
      createdAt: data.createdAt?.toDate() || new Date(),
      fileCount: data.fileCount,
      content: data.content,
      isPublic: data.isPublic ?? false,
    };
  },
};
