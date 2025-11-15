import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoleRequirement {
  role_id: number;
  area_id: number;
  count: number;
  role_name?: string;
  area_name?: string;
}

interface SortableRoleListProps {
  roles: RoleRequirement[];
  onReorder: (roles: RoleRequirement[]) => void;
  onRemove: (index: number) => void;
  getRoleName: (roleId: number, areaId: number) => string;
  getAreaName: (areaId: number) => string;
}

interface SortableItemProps {
  role: RoleRequirement;
  index: number;
  onRemove: (index: number) => void;
  getRoleName: (roleId: number, areaId: number) => string;
  getAreaName: (areaId: number) => string;
}

function SortableItem({ role, index, onRemove, getRoleName, getAreaName }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${role.area_id}-${role.role_id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isDragging ? 'border-echurch-500 bg-echurch-50' : 'border-gray-200 bg-white'
      } hover:bg-gray-50 transition-colors`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <Badge variant="outline" className="min-w-[2rem] justify-center">
        {index + 1}
      </Badge>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-echurch-700">
          {getRoleName(role.role_id, role.area_id)}
        </p>
        <p className="text-xs text-echurch-600">
          {getAreaName(role.area_id)} • {role.count} {role.count === 1 ? 'pessoa' : 'pessoas'}
        </p>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
        type="button"
      >
        Remover
      </button>
    </div>
  );
}

export const SortableRoleList: React.FC<SortableRoleListProps> = ({
  roles,
  onReorder,
  onRemove,
  getRoleName,
  getAreaName,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = roles.findIndex(
        (r) => `${r.area_id}-${r.role_id}` === active.id
      );
      const newIndex = roles.findIndex(
        (r) => `${r.area_id}-${r.role_id}` === over.id
      );

      const newRoles = arrayMove(roles, oldIndex, newIndex);
      onReorder(newRoles);
    }
  };

  if (roles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-echurch-600 mb-2">
        Arraste para reordenar a prioridade de processamento das funções
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={roles.map((r) => `${r.area_id}-${r.role_id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {roles.map((role, index) => (
              <SortableItem
                key={`${role.area_id}-${role.role_id}`}
                role={role}
                index={index}
                onRemove={onRemove}
                getRoleName={getRoleName}
                getAreaName={getAreaName}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

