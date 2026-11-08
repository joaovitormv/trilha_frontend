import { useCallback, useState } from 'react';
import type { ModalVariant } from '../components/Modal';
import { getFriendlyApiError } from '../api/utils/errorHandler';

export interface FeedbackModalState {
  isOpen: boolean;
  variant: ModalVariant;
  title: string;
  message: string;
}

const INITIAL_STATE: FeedbackModalState = {
  isOpen: false,
  variant: 'error',
  title: '',
  message: '',
};

// Uso: <Modal {...modal} onClose={closeModal} />
export const useFeedbackModal = () => {
  const [modal, setModal] = useState<FeedbackModalState>(INITIAL_STATE);

  const showError = useCallback((title: string, message: string) => {
    setModal({ isOpen: true, variant: 'error', title, message });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    setModal({ isOpen: true, variant: 'success', title, message });
  }, []);

  // Atalho para erros vindos da API (axios): converte para a mensagem amigável.
  const showApiError = useCallback(
    (error: unknown) => {
      const { title, message } = getFriendlyApiError(error);
      showError(title, message);
    },
    [showError],
  );

  // Mantém variant/title/message para o texto não sumir durante a animação de fechamento
  // e para o chamador consultar `modal.variant` ao fechar (ex.: redirecionar após sucesso).
  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return { modal, showError, showSuccess, showApiError, closeModal };
};
