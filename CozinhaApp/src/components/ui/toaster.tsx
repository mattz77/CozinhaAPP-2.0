import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
}
