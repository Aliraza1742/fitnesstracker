import { useAlertStore, AlertButton } from '../store/useAlertStore';

export const customAlert = (title: string, message: string, buttons?: AlertButton[]) => {
  useAlertStore.getState().showAlert(title, message, buttons);
};
