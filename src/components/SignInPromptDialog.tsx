import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogIn } from "lucide-react";

interface SignInPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignInPromptDialog = ({ open, onOpenChange }: SignInPromptDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <LogIn className="w-5 h-5 text-primary" />
            Sign In Required
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Please sign in or create an account to add products to your cart.
          </DialogDescription>
        </DialogHeader>
        <Link
          to="/auth"
          onClick={() => onOpenChange(false)}
          className="block w-full mt-4 py-3 bg-primary text-primary-foreground font-display text-sm uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all text-center"
        >
          Sign In / Sign Up
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPromptDialog;
