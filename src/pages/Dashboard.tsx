import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ProjectCard, type Project } from '../components/ProjectCard';
import { downloadFile } from '../utils/BundlerLogic';
import { FolderOpen, Loader } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'projects'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const fetchedProjects: Project[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedProjects.push({
                        id: doc.id,
                        name: data.name,
                        outputType: data.outputType,
                        createdAt: data.createdAt.toDate(),
                        fileCount: data.fileCount,
                        content: data.content,
                    });
                });

                setProjects(fetchedProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    const handleDownload = (project: Project) => {
        if (project.content) {
            downloadFile(project.content, project.name);
        } else {
            alert("This project file is not saved in the database.");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
                <div className="card max-w-md text-center">
                    <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <FolderOpen className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">
                        Sign In Required
                    </h2>
                    <p className="text-amber-700">
                        Please sign in to view your saved projects
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-amber-700 font-semibold">Loading your projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-amber-900 mb-2">
                        My Projects
                    </h1>
                    <p className="text-amber-700">
                        View and download your recent bundled projects
                    </p>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <FolderOpen className="w-10 h-10 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-amber-900 mb-2">
                            No projects yet
                        </h3>
                        <p className="text-amber-700">
                            Create your first bundle to see it here!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
