"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ImageModal({
  visible,
  image_url,
  title,
  onClose,
}: {
  visible: boolean;
  image_url: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <img
          src={image_url}
          alt={title}
          className="rounded-md object-contain w-full max-h-[80vh]"
        />
      </DialogContent>
    </Dialog>
  );
}
