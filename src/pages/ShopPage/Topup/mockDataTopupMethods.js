import viettel from '../../../assets/img/carrierLogo/viettel.png'
import mobifone from '../../../assets/img/carrierLogo/mobifone.png'
import vinaphone from '../../../assets/img/carrierLogo/vinaphone.png'
import vietnammobile from '../../../assets/img/carrierLogo/vietnammobile.png'
import gmobile from '../../../assets/img/carrierLogo/gmobile.png'

export const carriers = {
  VTT: {
    name: 'Viettel',
    prefixOld: ['096', '097', '098', '086'],
    prefixNew: ['0162', '0163', '0164', '0165', '0166', '0167', '0168', '0169'],
    logo: viettel,
  },
  VMS: {
    name: 'Mobifone',
    prefixOld: ['090', '093', '089'],
    prefixNew: ['0120', '0121', '0122', '0126', '0128'],
    logo: mobifone,
  },
  VNP: {
    name: 'Vinaphone',
    prefixOld: ['091', '094', '088'],
    prefixNew: ['0123', '0124', '0125', '0127', '0129'],
    logo: vinaphone,
  },
  VNM: {
    name: 'Vietnamobile',
    prefixOld: ['092'],
    prefixNew: ['0186', '0188'],
    logo: vietnammobile,
  },
  GTM: {
    name: 'Gmobile',
    prefixOld: ['099'],
    prefixNew: ['0199'],
    logo: gmobile,
  },
};
