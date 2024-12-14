const parseString = (string) => {
  if (typeof string !== 'string') return;

  const validType = (type) => ['work', 'home', 'personal'].includes(type);
  if (validType(string)) return string;
};

const parseBoolean = (bool) => {
  if (typeof bool !== 'string') return;

  switch (bool) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return;
  }
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseString(contactType);
  const parsedFav = parseBoolean(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedFav,
  };
};

// фільтрації контактів за типом, властивістю isFavourite у відповіді для маршруту GET /contacts. Для цього використовуйте такі query параметри запиту:

//     type - відображає тип контакту, значення властивості contactType STRING
//     isFavourite - відображає чи є контакт обраним BOOLEAN
