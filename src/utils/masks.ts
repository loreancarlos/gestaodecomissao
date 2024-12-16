import IMask from 'imask';

export const cpfMask: IMask.MaskedPatternOptions = {
  mask: '000.000.000-00',
  lazy: false
};

export const phoneMask: IMask.MaskedDynamicOptions = {
  mask: '(00) 00000-0000',
  lazy: false
};



export const unmaskValue = (value: string): string => {
  return (value || '').replace(/\D/g, '');
};

export const formatCPF = (value: string): string => {
  if (!value) return '';
  const unmasked = unmaskValue(value);
  const masked = IMask.createPipe(cpfMask);
  return masked(unmasked);
};

export const formatPhone = (value: string): string => {
  if (!value) return '';
  const unmasked = unmaskValue(value);
  const masked = IMask.createPipe(phoneMask);
  return masked(unmasked);
};