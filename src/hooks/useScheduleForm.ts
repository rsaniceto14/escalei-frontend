import { useState } from 'react';
import { scheduleService, CreateScheduleRequest, ScheduleType } from '@/api';
import { toast } from 'sonner';

interface ScheduleFormData {
  name: string;
  description: string;
  local: string;
  start_date: string;
  end_date: string;
  observation: string;
  type: ScheduleType;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  local?: string;
  start_date?: string;
  end_date?: string;
}

interface UseScheduleFormReturn {
  formData: ScheduleFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  updateField: <K extends keyof ScheduleFormData>(field: K, value: ScheduleFormData[K]) => void;
  handleSubmit: (userId: number, onSuccess: () => void) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: ScheduleFormData = {
  name: '',
  description: '',
  local: '',
  start_date: '',
  end_date: '',
  observation: '',
  type: ScheduleType.Geral,
};

export function useScheduleForm(): UseScheduleFormReturn {
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof ScheduleFormData>(
    field: K,
    value: ScheduleFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validação de nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    // Validação de descrição
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Descrição deve ter no mínimo 5 caracteres';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    // Validação de local
    if (!formData.local.trim()) {
      newErrors.local = 'Local é obrigatório';
    } else if (formData.local.trim().length < 3) {
      newErrors.local = 'Local deve ter no mínimo 3 caracteres';
    }

    // Validação de data de início
    if (!formData.start_date) {
      newErrors.start_date = 'Data de início é obrigatória';
    } else {
      const startDate = new Date(formData.start_date);
      const now = new Date();
      
      // Remove as horas para comparar apenas a data
      now.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate < now) {
        newErrors.start_date = 'Data de início não pode ser no passado';
      }
    }

    // Validação de data de fim
    if (!formData.end_date) {
      newErrors.end_date = 'Data de término é obrigatória';
    } else if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        newErrors.end_date = 'Data de término deve ser após a data de início';
      }

      // Verifica se a diferença não é muito grande (ex: máximo 30 dias)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        newErrors.end_date = 'A escala não pode ter mais de 30 dias de duração';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (userId: number, onSuccess: () => void) => {
    // Valida o formulário
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduleData: CreateScheduleRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        local: formData.local.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        observation: formData.observation.trim() || undefined,
        type: formData.type,
        approved: false,
        user_creator: userId,
      };

      const createdSchedule = await scheduleService.create(scheduleData);

      toast.success('Escala criada com sucesso! Aguardando aprovação.');
      console.log('Escala criada:', createdSchedule);

      // Reseta o formulário após sucesso
      resetForm();
      
      // Callback de sucesso
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar escala:', error);
      
      // Tratamento de erros específicos do backend
      if (error?.response?.status === 422) {
        toast.error('Dados inválidos. Verifique os campos e tente novamente.');
      } else if (error?.response?.status === 401) {
        toast.error('Sua sessão expirou. Faça login novamente.');
      } else if (error?.response?.status === 403) {
        toast.error('Você não tem permissão para criar escalas.');
      } else {
        toast.error(error?.message || 'Erro ao criar escala. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    resetForm,
  };
}
