const getSidoAndSigungu = (fullAddress, addressAbbr) => {
  const address = fullAddress.replace(addressAbbr, '');
  const splitAddress = address.split(' ');

  const sido = splitAddress[0];
  const sigungu = splitAddress[2]
    ? `${splitAddress[1]} ${splitAddress[2]}`
    : splitAddress[1];

  return {
    sido,
    sigungu,
  };
};
export {getSidoAndSigungu};
