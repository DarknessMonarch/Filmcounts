"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import styles from "@/app/styles/team.module.css";
import { useOrgStore } from "@/app/store/Organization";
import { useAuthStore } from "@/app/store/Auth";

export default function TeamPage() {
  const {
    currentOrg,
    orgInvitations,
    loading,
    sendInvitation,
    getOrgInvitations,
    updateOrganization,
  } = useOrgStore();
  
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("member"); 

  useEffect(() => {
    if (currentOrg?._id) {
      getOrgInvitations(currentOrg._id);
    }
  }, [currentOrg?._id, getOrgInvitations]);

  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!currentOrg?._id) {
      toast.error("No organization selected");
      return;
    }

    try {
      const result = await sendInvitation({
        organizationId: currentOrg._id,
        email,
        role,
        invitedBy: user._id
      });

      if (result.success) {
        toast.success("Invitation sent successfully");
        setEmail("");
        await getOrgInvitations(currentOrg._id);
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Invite error:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!currentOrg?._id) return;

    try {
      const updatedMembers = currentOrg.members.filter(m => m._id !== memberId);
      const result = await updateOrganization(currentOrg._id, {
        members: updatedMembers
      });

      if (result.success) {
        toast.success("Member removed successfully");
      } else {
        toast.error(result.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove member");
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    if (!currentOrg?._id) return;

    try {
      const updatedMembers = currentOrg.members.map(m => 
        m._id === memberId ? { ...m, role: newRole } : m
      );
      
      const result = await updateOrganization(currentOrg._id, {
        members: updatedMembers
      });

      if (result.success) {
        toast.success("Role updated successfully");
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Role update error:", error);
      toast.error("Failed to update role");
    }
  };

  const allTeamMembers = [
    ...(currentOrg?.members || []),
    ...(orgInvitations || []).map(inv => ({
      ...inv,
      pending: true,
      name: inv.email, 
    }))
  ];

  const filteredMembers = allTeamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !currentOrg) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading team information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.teamSection}>
        <h2>Invite team members</h2>
        <p>Get your projects up and running faster by inviting your team to collaborate.</p>
        
        <div className={styles.teamInviteSection}>
          <h3>Team members</h3>
          <p>Get your projects up and running faster by inviting your team to collaborate.</p>
          
          <div className={styles.inviteInputContainer}>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inviteInput}
            />
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.roleSelect}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="read-only">Read-only</option>
            </select>
            <button onClick={handleInvite} className={styles.inviteButton}>
              Send Invites
            </button>
          </div>
        </div>
        
        <div className={styles.teamMembersSection}>
          <div className={styles.teamMembersHeader}>
            <h3>Name</h3>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.teamMembersList}>
            {filteredMembers.map((member) => (
              <div key={member._id} className={styles.teamMemberItem}>
                <div className={styles.memberInfo}>
                  <h4>{member.name}</h4>
                  <p>{member.email}</p>
                  {member.pending && <span className={styles.pendingBadge}>Pending</span>}
                </div>
                
                {!member.pending && (
                  <div className={styles.memberActions}>
                    <select 
                      value={member.role} 
                      onChange={(e) => handleUpdateRole(member._id, e.target.value)}
                      className={styles.roleSelect}
                      disabled={member._id === user._id} 
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="read-only">Read-only</option>
                    </select>
                    
                    {member._id !== user._id && ( 
                      <button 
                        onClick={() => handleRemoveMember(member._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}