import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  productName: string;
}

const ProductImageDialog = ({ open, onOpenChange, images, productName }: ProductImageDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const hasMultipleImages = images.length > 1;
  const activeImage = images[currentIndex];

  const goPrevious = () => {
    setZoomed(false);
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goNext = () => {
    setZoomed(false);
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-5 border-border/60 bg-background/95 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{productName}</DialogTitle>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-lg bg-secondary/30">
          {activeImage && (
            <div className="max-h-[70vh] overflow-auto">
              <img
                src={activeImage}
                alt={`${productName} image ${currentIndex + 1}`}
                className={`mx-auto transition-transform duration-300 ${zoomed ? "max-w-none cursor-zoom-out scale-150" : "max-h-[70vh] w-full cursor-zoom-in object-contain"}`}
                onClick={() => setZoomed((value) => !value)}
              />
            </div>
          )}

          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-3 top-3 rounded-full shadow-lg"
            onClick={() => setZoomed((value) => !value)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </Button>

          {hasMultipleImages && (
            <>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={goPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={goNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => {
                  setCurrentIndex(index);
                  setZoomed(false);
                }}
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-md border transition-all ${index === currentIndex ? "border-primary" : "border-border/60 opacity-70 hover:opacity-100"}`}
              >
                <img src={image} alt={`${productName} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageDialog;