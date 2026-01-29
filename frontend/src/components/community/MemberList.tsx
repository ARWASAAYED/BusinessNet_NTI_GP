"use client";

import React, { useEffect, useState } from "react";
import { Search, UserPlus, MessageCircle, Shield, UserMinus, MoreVertical, Crown } from "lucide-react";
import communityService from "@/services/communityService";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import MessageButton from "../common/MessageButton";
import Spinner from "../common/Spinner";
import Input from "../common/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/app/providers";

interface MemberListProps {
  communityId: string;
}

export default function MemberList({ communityId }: MemberListProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const myMemberInfo = members.find(m => m._id === user?._id);
  const isModerator = myMemberInfo?.role === 'moderator' || myMemberInfo?.role === 'admin';
  const isAdmin = myMemberInfo?.role === 'admin';

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await communityService.getMembers(communityId);
      setMembers(data.members || []);
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [communityId]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await communityService.updateMemberRole(communityId, userId, newRole);
      showToast(`Member promoted to ${newRole}`, 'success');
      loadMembers();
    } catch (error) {
      showToast('Failed to update role', 'error');
    }
  };

  const handleBan = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await communityService.banMember(communityId, userId);
      showToast('Member removed', 'success');
      loadMembers();
    } catch (error) {
      showToast('Failed to remove member', 'error');
    }
  };

  const filteredMembers = members.filter((m) =>
    m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-sm"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member._id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar src={member.avatar} alt={member.username} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {member.username}
                    </h4>
                    {member.role === 'admin' && (
                      <span className="flex items-center gap-1 text-[8px] font-black uppercase bg-primary-500 text-white px-1.5 py-0.5 rounded shadow-lg shadow-primary-500/20">
                        <Crown className="w-2 h-2" /> Admin
                      </span>
                    )}
                    {member.role === 'moderator' && (
                      <span className="flex items-center gap-1 text-[8px] font-black uppercase bg-indigo-500 text-white px-1.5 py-0.5 rounded shadow-lg shadow-indigo-500/20">
                        <Shield className="w-2 h-2" /> Moderator
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Joined {new Date(member.joinedAt).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Moderation Actions */}
                {isModerator && member._id !== user?._id && member.role !== 'admin' && (
                  <div className="flex gap-2 mr-2 pr-2 border-r border-gray-100 dark:border-gray-800">
                    {isAdmin && (
                      <button 
                        onClick={() => handleUpdateRole(member._id, member.role === 'moderator' ? 'member' : 'moderator')}
                        className={`p-2 rounded-xl transition-all ${
                          member.role === 'moderator' 
                            ? 'text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600' 
                            : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                        title={member.role === 'moderator' ? "Demote to Member" : "Promote to Moderator"}
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleBan(member._id)}
                      className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                      title="Remove Member"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <MessageButton
                  userId={member._id}
                  userName={member.username}
                  variant="icon"
                  size="md"
                />
                <Button variant="outline" size="sm" className="h-9 px-4 hidden sm:flex">
                  Follow
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            No members found matching your search.
          </div>
        )}
      </div>
    </Card>
  );
}
