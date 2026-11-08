import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import './styles.css';

export type ModalVariant = 'error' | 'success' | 'confirm';

interface ModalProps {
  isOpen: boolean;
  variant?: ModalVariant;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export const Modal = ({
  isOpen,
  variant = 'error',
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Fechar',
  onConfirm,
  onClose,
}: ModalProps) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    if (variant === 'error') return <AlertTriangle size={36} color="#ff4d4d" />;
    if (variant === 'success') return <CheckCircle size={36} color="#2ecc71" />;
    return <HelpCircle size={36} color="#6a0dad" />;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box modal-${variant}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">{renderIcon()}</div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          {variant === 'confirm' ? (
            <>
              <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>
                {cancelText}
              </button>
              <button type="button" className="modal-btn modal-btn-danger" onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="modal-btn modal-btn-primary"
              onClick={onConfirm || onClose}
            >
              {confirmText !== 'Confirmar' ? confirmText : 'Entendi'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};