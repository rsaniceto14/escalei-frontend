import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AvailableUserSchedule } from '@/api';
import { areaService } from '@/api/services/areaService';
import { Role } from '@/api/types';

interface AddParticipantsDialogProps {
  isOpen: boolean;
  availableUsers: AvailableUserSchedule[];
  onAdd: (selectedUsers: string[], selectedArea: string, selectedRole: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddParticipantsDialog: React.FC<AddParticipantsDialogProps> = ({
  isOpen,
  availableUsers,
  onAdd,
  onCancel,
  isLoading = false,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Get unique areas from available users
  const uniqueAreas = useMemo(
    () => Array.from(new Set(availableUsers.flatMap(user => user.areas?.map(a => a.name) || []))).sort(),
    [availableUsers],
  );

  // Filter users based on selected area and role
  const filteredUsers = useMemo(() => {
    if (!selectedArea) return [];
    
    let users = availableUsers.filter(user => user.areas?.some(a => a.name === selectedArea));
    
    // If role is selected, filter users who have that role in the selected area
    if (selectedRole) {
      const roleId = parseInt(selectedRole);
      const selectedAreaObj = availableUsers
        .flatMap(user => user.areas || [])
        .find(a => a.name === selectedArea);
      const areaId = selectedAreaObj ? parseInt(selectedAreaObj.id) : null;
      
      if (areaId) {
        users = users.filter(user => 
          user.roles?.some(role => role.id === roleId && role.area_id === areaId)
        );
      }
    }
    
    return users;
  }, [availableUsers, selectedArea, selectedRole]);

  // Fetch roles when area is selected
  useEffect(() => {
    const fetchRoles = async () => {
      if (!selectedArea) {
        setAvailableRoles([]);
        setSelectedRole('');
        return;
      }

      setLoadingRoles(true);
      try {
        const area = availableUsers
          .flatMap(user => user.areas || [])
          .find(a => a.name === selectedArea);
        
        if (area) {
          const roles = await areaService.getRoles(parseInt(area.id));
          setAvailableRoles(roles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setAvailableRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [selectedArea, availableUsers]);

  const handleAreaChange = (value: string) => {
    setSelectedUsers([]);
    setSelectedArea(value);
    setSelectedRole('');
  };

  const handleRoleChange = (value: string) => {
    setSelectedUsers([]);
    setSelectedRole(value);
  };

  const handleUserClick = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id.toString()));
    }
  };

  const handleAdd = () => {
    if (!selectedRole) return;
    onAdd(selectedUsers, selectedArea, selectedRole);
    setSelectedUsers([]);
    setSelectedArea('');
    setSelectedRole('');
  };

  const handleCancel = () => {
    onCancel();
    setSelectedUsers([]);
    setSelectedArea('');
    setSelectedRole('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Adicionar Participantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableUsers.length === 0 ? (
            <p className="text-sm text-echurch-600">Nenhum usuário disponível para adicionar.</p>
          ) : (
            <>
              <p className="text-sm text-echurch-600">Selecione os participantes para adicionar:</p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-echurch-700">Filtrar por Área</label>
                  <Select value={selectedArea} onValueChange={handleAreaChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueAreas.map(area => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedArea && (
                  <div>
                    <label className="text-sm font-medium text-echurch-700">Selecionar Função *</label>
                    <Select 
                      value={selectedRole} 
                      onValueChange={handleRoleChange}
                      disabled={loadingRoles}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingRoles ? "Carregando..." : "Selecione a função"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500 text-center">
                            {loadingRoles ? "Carregando funções..." : "Nenhuma função disponível para esta área"}
                          </div>
                        ) : (
                          availableRoles.map(role => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                              {role.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {selectedUsers.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedUsers.length} selecionado
                      {selectedUsers.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {selectedArea && selectedRole && (
                    <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-6 px-2 ml-auto">
                      {selectedUsers.length === filteredUsers.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedArea && selectedRole && filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUsers.includes(user.id.toString())
                          ? 'bg-echurch-50 border-echurch-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleUserClick(user.id.toString())}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-echurch-200 text-echurch-700 text-xs">
                            {user.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-echurch-600">{user.areas?.map(a => a.name).join(', ') || ''}</p>
                        </div>
                      </div>
                      <Checkbox
                        id={user.id.toString()}
                        checked={selectedUsers.includes(user.id.toString())}
                        onChange={() => {}} // Handled by onClick
                        className="pointer-events-none"
                      />
                    </div>
                  ))
                ) : selectedArea && selectedRole ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum usuário disponível com esta função na área selecionada.
                  </p>
                ) : selectedArea ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Selecione uma função para ver os usuários disponíveis.
                  </p>
                ) : null}
              </div>
            </>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              className="flex-1 bg-echurch-500 hover:bg-echurch-600"
              disabled={!selectedArea || !selectedRole || filteredUsers.length === 0 || selectedUsers.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                'Adicionar'
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
