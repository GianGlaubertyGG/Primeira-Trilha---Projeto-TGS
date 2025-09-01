
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { User, Post, Follow } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Mail, Phone, MapPin, UserPlus, MessageCircle } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import EducationSection from "../components/profile/EducationSection";
import UserPosts from "../components/profile/UserPosts";
import EditProfileModal from "../components/profile/EditProfileModal";

export default function PerfilPage({ currentUser }) {
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const location = useLocation();

  const loadData = useCallback(async (userId) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    
    try {
      let userToLoad;
      if (userId && userId !== currentUser.id) {
        userToLoad = await User.get(userId);
        setIsMyProfile(false);
        const followCheck = await Follow.filter({ follower_email: currentUser.email, following_email: userToLoad.email });
        setIsFollowing(followCheck.length > 0);
      } else {
        userToLoad = currentUser;
        setIsMyProfile(true);
      }
      setProfileUser(userToLoad);

      if (userToLoad) {
        const userPosts = await Post.filter({ author_email: userToLoad.email }, '-created_date');
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setProfileUser(null);
    }
    setLoading(false);
  }, [currentUser]); // currentUser is a dependency for loadData

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get('id');
    loadData(userId);
  }, [location.search, loadData]); // loadData is now a stable reference thanks to useCallback

  const handleUpdateProfile = async (updatedData) => {
    try {
      await User.updateMyUserData(updatedData);
      setIsEditModalOpen(false);
      loadData(profileUser?.id || currentUser?.id); 
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleFollow = async () => {
    if (isMyProfile || !profileUser || !currentUser) return;
    
    const previousIsFollowing = isFollowing;
    setIsFollowing(!previousIsFollowing);

    try {
      if (previousIsFollowing) {
        const followRecord = await Follow.filter({ follower_email: currentUser.email, following_email: profileUser.email });
        if (followRecord.length > 0) {
          await Follow.delete(followRecord[0].id);
        }
      } else {
        await Follow.create({ follower_email: currentUser.email, following_email: profileUser.email });
      }
      loadData(profileUser.id); 
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
      setIsFollowing(previousIsFollowing);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    if (!currentUser) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl">Você precisa estar logado para ver um perfil.</h2>
          <p>Por favor, faça login.</p>
        </div>
      );
    }
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl">Usuário não encontrado.</h2>
        <p>Este perfil pode não existir ou foi removido.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <ProfileHeader 
          user={profileUser} 
          isMyProfile={isMyProfile}
          isFollowing={isFollowing}
          onEdit={() => setIsEditModalOpen(true)}
          onFollow={handleFollow}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <AboutSection bio={profileUser.bio} />
            <Card className="shadow-sm border-0">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Contato</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" /> <span>{profileUser.email}</span>
                </div>
                {profileUser.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" /> <span>{profileUser.phone}</span>
                  </div>
                )}
                {profileUser.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" /> <span>{profileUser.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="activity">Atividade</TabsTrigger>
                <TabsTrigger value="education">Formação</TabsTrigger>
                <TabsTrigger value="skills">Habilidades</TabsTrigger>
                <TabsTrigger value="projects">Projetos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity">
                <UserPosts posts={posts} user={profileUser} />
              </TabsContent>
              <TabsContent value="education">
                <EducationSection education={profileUser.education} />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsSection skills={profileUser.skills} />
              </TabsContent>
              <TabsContent value="projects">
                <ProjectsSection projects={profileUser.projects} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={profileUser}
          onSubmit={handleUpdateProfile}
        />
      )}
    </div>
  );
}
