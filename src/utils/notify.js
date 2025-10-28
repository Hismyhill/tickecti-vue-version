import { useToast } from "vue-toastification";

const toast = useToast();

export function notifySuccess(message) {
  toast.success(message, {
    timeout: 3000,
  });
}

export function notifyError(message) {
  toast.error(message, {
    timeout: 4000,
  });
}

export function notifyInfo(message) {
  toast.info(message, {
    timeout: 3000,
  });
}

export function notifyWarning(message) {
  toast.warning(message, {
    timeout: 3000,
  });
}
