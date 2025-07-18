
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, UserPlus, Edit, Trash2, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Sample user data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Active' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "The user has been removed successfully",
    });
  };

  const handleEdit = (user: typeof users[0]) => {
    setEditingUser(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleSaveEdit = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, name: editName, email: editEmail, role: editRole } 
        : user
    ));
    setEditingUser(null);
    toast({
      title: "User Updated",
      description: "User information has been updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } 
        : user
    ));
    
    const targetUser = users.find(user => user.id === id);
    const newStatus = targetUser?.status === 'Active' ? 'Inactive' : 'Active';
    
    toast({
      title: "Status Updated",
      description: `User status changed to ${newStatus}`,
    });
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: 'New User',
      email: 'new@example.com',
      role: 'User',
      status: 'Active'
    };
    
    setUsers([...users, newUser]);
    setEditingUser(newUser.id);
    setEditName(newUser.name);
    setEditEmail(newUser.email);
    setEditRole(newUser.role);
    
    toast({
      title: "User Added",
      description: "Please edit the new user's details",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-secondary/50"
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-secondary/20">
                  <TableCell>
                    {editingUser === user.id ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-secondary/50" />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === user.id ? (
                      <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-secondary/50" />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === user.id ? (
                      <select 
                        value={editRole} 
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full p-2 rounded-md bg-secondary/50 border border-white/10"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'Admin' ? 'bg-primary/20 text-primary' : 'bg-secondary/30'}`}>
                        {user.role}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-2 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {user.status}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {editingUser === user.id ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(user.id)}>
                          <Check className="h-4 w-4 text-green-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 text-red-400" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
