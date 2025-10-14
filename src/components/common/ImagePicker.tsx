import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Image, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImagePickerProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export function ImagePicker({ onImageSelect, currentImage, trigger, disabled }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile  = useIsMobile();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onImageSelect(selectedFile);
      setIsOpen(false);
      setSelectedFile(null);
      setPreview(null);
      toast.success('Imagem selecionada com sucesso!');
    } catch (error) {
      console.error('Error selecting image:', error);
      toast.error('Erro ao selecionar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsOpen(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCameraDialog = () => {
    cameraInputRef.current?.click();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" disabled={disabled}>
              <Image className="w-4 h-4 mr-2" />
              Selecionar Imagem
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Foto</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Image Preview */}
            {currentImage && !preview && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Foto atual:</p>
                <img 
                  src={currentImage} 
                  alt="Current" 
                  className="w-32 h-32 object-cover rounded-lg mx-auto border"
                />
              </div>
            )}

            {/* New Image Preview */}
            {preview && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Nova foto:</p>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg mx-auto border"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button
                onClick={openFileDialog}
                variant="outline"
                className="flex-1"
                disabled={isUploading}
              >
                <Image className="w-4 h-4 mr-2" />
                Galeria
              </Button>
              {isMobile && (
                <Button
                  onClick={openCameraDialog}
                  variant="outline"
                  className="flex-1"
                  disabled={isUploading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Câmera
                </Button>
              )}
            </div>

            {/* Confirm/Cancel Buttons */}
            {selectedFile && (
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirm}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Confirmar'
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraInputChange}
            className="hidden"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}


